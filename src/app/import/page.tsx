"use client"

import { useState, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Upload, Check, AlertCircle, FileJson, Layers, Ruler, Shirt } from "lucide-react"
import { GARMENT_CATALOG } from "@/data/garments"

interface ParsedImport {
  garmentId: string
  name: string
  sizeLabel?: string
  measurements: string[]
  parts: { name: string; pointCount: number }[]
}

interface ParsedRaw extends Record<string, unknown> {
  garmentId: string
  name: string
  sizeLabel?: string
  measurements?: string[]
  parts?: { name: string; points: unknown[] }[]
}

function generateShortId(): string {
  return Math.random().toString(36).slice(2, 8)
}

function parseImportJson(text: string): ParsedImport {
  let raw: unknown
  try {
    raw = JSON.parse(text)
  } catch {
    throw new Error("JSON 解析失败，请检查格式")
  }

  if (typeof raw !== "object" || raw === null) {
    throw new Error("JSON 必须是对象类型")
  }

  const obj = raw as Record<string, unknown>

  if (typeof obj.garmentId !== "string") {
    throw new Error("缺少 garmentId 字段（应为字符串）")
  }
  if (typeof obj.name !== "string") {
    throw new Error("缺少 name 字段（应为字符串）")
  }

  const sizeLabel = typeof obj.sizeLabel === "string" && obj.sizeLabel
    ? obj.sizeLabel
    : undefined

  const measurements: string[] = Array.isArray(obj.measurements)
    ? (obj.measurements as string[]).filter((m) => typeof m === "string")
    : []

  if (!Array.isArray(obj.parts) || obj.parts.length === 0) {
    throw new Error("缺少 parts 数组或为空")
  }

  const parts = (obj.parts as unknown[]).map((p, i) => {
    if (typeof p !== "object" || p === null) {
      throw new Error(`裁片 #${i + 1} 格式不正确`)
    }
    const part = p as Record<string, unknown>
    const name = typeof part.name === "string" ? part.name : `裁片 ${i + 1}`
    const points = Array.isArray(part.points) ? part.points : []
    return { name, pointCount: points.length }
  })

  return { garmentId: obj.garmentId, name: obj.name, sizeLabel, measurements, parts }
}

function ImportPageInner() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const garmentId = searchParams.get("overwrite") || ""
  const garment = garmentId ? GARMENT_CATALOG.find(g => g.id === garmentId) : null

  const [jsonText, setJsonText] = useState("")
  const [parsed, setParsed] = useState<ParsedImport | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [fileError, setFileError] = useState<string | null>(null)

  const handleParse = () => {
    setError(null)
    setParsed(null)
    if (!jsonText.trim()) {
      setError("请粘贴数字化仪导出的 JSON 数据")
      return
    }
    try {
      const result = parseImportJson(jsonText)
      setParsed(result)
    } catch (e) {
      setError(e instanceof Error ? e.message : "解析失败")
    }
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setFileError(null)
    if (!file.name.endsWith(".json")) {
      setFileError("请选择 .json 文件")
      return
    }
    const reader = new FileReader()
    reader.onload = (ev) => {
      const text = ev.target?.result as string
      setJsonText(text)
      try {
        const result = parseImportJson(text)
        setParsed(result)
        setError(null)
      } catch (e) {
        setError(e instanceof Error ? e.message : "解析失败")
      }
    }
    reader.onerror = () => setFileError("文件读取失败")
    reader.readAsText(file)
  }

  const handleUsePattern = () => {
    if (!parsed || !garmentId) return
    const sizeLabel = parsed.sizeLabel || "default"
    localStorage.setItem(`hanfu-override-${garmentId}-${sizeLabel}`, jsonText)
    router.push(`/measure/${garmentId}`)
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <nav className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/" className="hover:text-foreground transition-colors">
          首页
        </Link>
        <span aria-hidden="true">/</span>
        <span className="text-foreground font-medium">导入数字化数据</span>
      </nav>

      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          导入数字化数据
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          粘贴从数字化仪导出的 JSON，或上传文件
        </p>
      </div>

      <div className="space-y-6">
        {/* Input area */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <FileJson className="size-5" />
              粘贴 JSON 数据
            </CardTitle>
            <CardDescription>
              从数字化仪复制导出代码，粘贴到下方输入框中
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <textarea
              value={jsonText}
              onChange={(e) => {
                setJsonText(e.target.value)
                setParsed(null)
                setError(null)
              }}
              placeholder={`{\n  "garmentId": "my-garment",\n  "name": "交领上襦",\n  "measurements": ["height", "bust"],\n  "parts": [\n    {\n      "name": "前片",\n      "points": [\n        { "x": 100, "y": 200, "type": "fixed" },\n        { "x": "{bust}/4+20", "y": "50", "type": "formula" }\n      ]\n    }\n  ]\n}`}
              className="h-48 w-full rounded-lg border border-input bg-background px-3 py-2 text-xs font-mono
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-y"
            />

            <div className="flex items-center gap-3">
              <Button onClick={handleParse} disabled={!jsonText.trim()}>
                <Check className="mr-1.5 size-4" />
                解析数据
              </Button>
              <span className="text-xs text-muted-foreground">或</span>
              <label className="flex cursor-pointer items-center gap-1.5 rounded-lg border border-dashed border-border px-3 py-2 text-xs text-muted-foreground transition-colors hover:bg-muted">
                <Upload className="size-3.5" />
                上传 JSON 文件
                <input
                  type="file"
                  accept=".json,application/json"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>

            {fileError && (
              <p className="flex items-center gap-1 text-xs text-destructive">
                <AlertCircle className="size-3" />
                {fileError}
              </p>
            )}

            {error && (
              <div className="flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/5 p-3">
                <AlertCircle className="mt-0.5 size-4 shrink-0 text-destructive" />
                <div>
                  <p className="text-sm font-medium text-destructive">解析错误</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{error}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Preview */}
        {parsed && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Shirt className="size-5 text-primary" />
                数据预览
              </CardTitle>
              <CardDescription>
                验证数据正确后，点击下方按钮进入量体流程
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Garment info */}
              <div className="flex items-center gap-3 flex-wrap">
                <Badge variant="secondary" className="text-xs px-2.5 py-1">
                  {parsed.garmentId}
                </Badge>
                {parsed.sizeLabel && (
                  <Badge variant="outline" className="text-xs border-blue-400 text-blue-600 dark:text-blue-400">
                    尺码: {parsed.sizeLabel}
                  </Badge>
                )}
                <span className="text-lg font-semibold text-foreground">
                  {parsed.name}
                </span>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-3">
                <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/30 px-3 py-2.5">
                  <Layers className="size-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">裁片数量</p>
                    <p className="text-sm font-semibold text-foreground">{parsed.parts.length}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/30 px-3 py-2.5">
                  <Ruler className="size-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">测量参数</p>
                    <p className="text-sm font-semibold text-foreground">{parsed.measurements.length}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/30 px-3 py-2.5">
                  <Layers className="size-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">总顶点数</p>
                    <p className="text-sm font-semibold text-foreground">
                      {parsed.parts.reduce((s, p) => s + p.pointCount, 0)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Parts list */}
              <div className="rounded-lg border border-border">
                <div className="border-b border-border bg-muted/20 px-3 py-1.5">
                  <p className="text-xs font-medium text-muted-foreground">裁片列表</p>
                </div>
                <div className="divide-y divide-border">
                  {parsed.parts.map((part, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between px-3 py-2"
                    >
                      <span className="text-sm text-foreground">
                        {i + 1}. {part.name}
                      </span>
                      <Badge variant="outline" className="text-[10px]">
                        {part.pointCount} 个顶点
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>

              {/* Measurements */}
              {parsed.measurements.length > 0 && (
                <div className="rounded-lg border border-border">
                  <div className="border-b border-border bg-muted/20 px-3 py-1.5">
                    <p className="text-xs font-medium text-muted-foreground">所需测量参数</p>
                  </div>
                  <div className="flex flex-wrap gap-1.5 px-3 py-2">
                    {parsed.measurements.map((m) => (
                      <Badge key={m} variant="secondary" className="text-[10px]">
                        {m}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {garment && (
                <div className="rounded-lg border border-border p-4 space-y-2">
                  <p className="text-sm font-medium text-foreground">导入到</p>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">{garment.dynasty}</Badge>
                    <span className="font-medium">{garment.name}</span>
                    <span className="text-xs text-muted-foreground">({garment.nameEn})</span>
                  </div>
                  {parsed?.sizeLabel && (
                    <Badge variant="outline" className="text-xs">尺码: {parsed.sizeLabel}</Badge>
                  )}
                </div>
              )}

              <div className="flex justify-center gap-3 pt-2">
                <Button variant="outline" onClick={() => setJsonText("")}>
                  重新导入
                </Button>
                <Button onClick={handleUsePattern}>
                  <Check className="mr-1.5 size-4" />
                  使用此图纸
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

export default function ImportPage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-3xl px-4 py-20 text-center text-muted-foreground">加载中...</div>}>
      <ImportPageInner />
    </Suspense>
  )
}
