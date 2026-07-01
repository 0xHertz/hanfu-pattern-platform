'use client'

import { use } from 'react'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { GARMENT_CATALOG, DYNASTY_LABELS } from '@/data/garments'
import type { Dynasty } from '@/types/garment'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { PatternViewer } from '@/components/pattern/pattern-viewer'
import { AlertTriangle, ArrowLeft } from 'lucide-react'
import { MEASUREMENT_DEFINITIONS } from '@/types/measurement'
import { generatePattern } from '@/lib/pattern/designer'
import { generateImportSvg } from '@/lib/pattern/import-generator'
import type { ImportData } from '@/lib/pattern/import-generator'

const CUSTOM_PREFIX = 'custom:'

function isCustom(id: string) {
  return id.startsWith(CUSTOM_PREFIX)
}

function extractImportId(garmentId: string): string {
  return garmentId.slice(CUSTOM_PREFIX.length)
}

function loadImportData(importId: string): ImportData | null {
  try {
    const raw = localStorage.getItem(`hanfu-import-${importId}`)
    if (!raw) return null
    return JSON.parse(raw) as ImportData
  } catch {
    return null
  }
}

export default function PatternPage({
  params,
}: {
  params: Promise<{ garmentId: string }>
}) {
  const { garmentId } = use(params)
  const [measurements, setMeasurements] = useState<Record<string, number>>({})
  const [svgString, setSvgString] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [generationError, setGenerationError] = useState<string | null>(null)
  const [loaded, setLoaded] = useState(false)
  const [importData, setImportData] = useState<ImportData | null>(null)

  useEffect(() => {
    const stored = localStorage.getItem(`hanfu-measurements-${garmentId}`)
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        setMeasurements(parsed)
      } catch {}
    }

    if (isCustom(garmentId)) {
      const importId = extractImportId(garmentId)
      const data = loadImportData(importId)
      setImportData(data)
    } else {
      const prefix = `hanfu-override-${garmentId}-`
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (key?.startsWith(prefix)) {
          const overrideJson = localStorage.getItem(key)
          if (overrideJson) {
            try { setImportData(JSON.parse(overrideJson)) } catch {}
            break
          }
        }
      }
    }

    setLoaded(true)
  }, [garmentId])

  const garment = !isCustom(garmentId)
    ? GARMENT_CATALOG.find((g) => g.id === garmentId)
    : undefined
  const dynastyLabel = garment ? DYNASTY_LABELS[garment.dynasty] : ''
  const hasMeasurements = Object.keys(measurements).length > 0

  // Pattern generation: built-in vs custom
  useEffect(() => {
    if (!hasMeasurements) return
    setIsGenerating(true)
    setGenerationError(null)

    if (isCustom(garmentId)) {
      if (!importData) {
        setGenerationError('导入数据未找到，请重新导入')
        setIsGenerating(false)
        return
      }
      try {
        const result = generateImportSvg(importData, measurements)
        setSvgString(result.svg)
      } catch (err) {
        console.error('Import pattern generation failed:', err)
        setGenerationError(err instanceof Error ? err.message : String(err))
      }
      setIsGenerating(false)
    } else {
      if (importData) {
        try {
          const result = generateImportSvg(importData, measurements)
          setSvgString(result.svg)
        } catch (err) {
          console.error('Override pattern generation failed:', err)
          setGenerationError(err instanceof Error ? err.message : String(err))
        }
        setIsGenerating(false)
      } else {
        generatePattern(garmentId, measurements)
          .then((result) => setSvgString(result.svg))
        .catch((err) => {
          console.error('Pattern generation failed:', err)
          setGenerationError(err instanceof Error ? err.message : String(err))
        })
        .finally(() => setIsGenerating(false))
      }
    }
  }, [garmentId, hasMeasurements, measurements, importData])

  const garmentName = isCustom(garmentId)
    ? importData?.name ?? '自定义款式'
    : garment?.name ?? ''

  const notFound = !isCustom(garmentId) && !garment
  const missingImport = isCustom(garmentId) && loaded && !importData

  if (notFound) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-foreground mb-2">款式未找到</h1>
        <p className="text-muted-foreground mb-6">
          未找到 ID 为 &ldquo;{garmentId}&rdquo; 的款式
        </p>
        <Link href="/">
          <Button variant="outline">返回首页</Button>
        </Link>
      </div>
    )
  }

  if (missingImport) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-foreground mb-2">导入数据未找到</h1>
        <p className="text-muted-foreground mb-6">
          未找到对应的导入数据，请重新导入
        </p>
        <Link href="/import">
          <Button>返回导入页面</Button>
        </Link>
      </div>
    )
  }

  if (!loaded) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-20 text-center">
        <p className="text-muted-foreground">加载中...</p>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {isCustom(garmentId) ? (
            <Link
              href="/import"
              className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="size-4" />
              导入
            </Link>
          ) : (
            <Link
              href={`/garments/${garment!.id}`}
              className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="size-4" />
              返回款式
            </Link>
          )}
          <div className="h-4 w-px bg-border" />
          {isCustom(garmentId) ? (
            <Badge variant="secondary">自定义</Badge>
          ) : (
            <Badge variant={garment!.dynasty as Dynasty}>{dynastyLabel}</Badge>
          )}
          <h1 className="text-xl font-bold tracking-tight text-foreground">
            {garmentName} — 裁剪图纸
          </h1>
        </div>
        <Link href={`/measure/${garmentId}`}>
          <Button variant="outline" size="sm">
            重新测量
          </Button>
        </Link>
      </div>

      {!hasMeasurements ? (
        <Card className="border-destructive/30">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <AlertTriangle className="mb-4 size-12 text-destructive/60" />
            <h2 className="mb-2 text-xl font-semibold text-foreground">
              缺少测量数据
            </h2>
            <p className="mb-6 max-w-sm text-muted-foreground">
              未检测到测量数据，请返回测量页面输入您的身体数据
            </p>
            <Link href={`/measure/${garmentId}`}>
              <Button>返回测量</Button>
            </Link>
          </CardContent>
        </Card>
      ) : generationError ? (
        <Card className="border-destructive/30">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <AlertTriangle className="mb-4 size-12 text-destructive/60" />
            <h2 className="mb-2 text-xl font-semibold text-foreground">
              图纸生成失败
            </h2>
            <p className="mb-2 max-w-lg text-sm text-muted-foreground">
              {generationError}
            </p>
            {!isCustom(garmentId) && (
              <p className="mb-6 max-w-lg text-xs text-muted-foreground">
                提示：当前仅有<b>交领上襦</b>支持图纸生成。其他款式正在开发中。
              </p>
            )}
            <Link href={`/measure/${garmentId}`}>
              <Button>返回重新测量</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          <PatternViewer
            svgString={svgString}
            garmentName={garmentName}
            isGenerating={isGenerating}
            onRegenerate={() => {
              localStorage.removeItem(`hanfu-measurements-${garmentId}`)
              window.location.href = `/measure/${garmentId}`
            }}
          />

          <Card>
            <CardHeader>
              <CardTitle className="text-base">测量数据摘要</CardTitle>
              <CardDescription>
                用于生成图纸的测量数据，共 {Object.keys(measurements).length} 项
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {Object.entries(measurements).map(([key, value]) => {
                  const def = MEASUREMENT_DEFINITIONS.find((m) => m.id === key)
                  return (
                    <div
                      key={key}
                      className="flex items-center justify-between rounded-md border border-border bg-muted/20 px-3 py-2"
                    >
                      <span className="text-xs font-medium text-foreground">
                        {def?.name ?? key}
                      </span>
                      <span className="text-xs text-muted-foreground tabular-nums">
                        {value} mm
                      </span>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

    </div>
  )
}
