"use client"

import { useCallback, useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { GARMENT_CATALOG, DYNASTY_LABELS, GARMENT_CATEGORIES } from "@/data/garments"
import type { Dynasty, GarmentCategory } from "@/types/garment"
import {
  CheckCircle2,
  RotateCcw,
  Shirt,
  Calculator,
  FlaskConical,
  X,
  AlertCircle,
} from "lucide-react"
import { collectSizeImports, deriveFormulas } from "@/lib/pattern/formula-deriver"
import { saveFormulas, deleteOverride, hasFormulasSync, getOverridesSync } from "@/lib/storage"
import { AdminGuard } from "@/components/admin-guard"

interface PartInfo { name: string; pointCount: number }
interface ImportData { garmentId: string; name: string; measurements: string[]; parts: PartInfo[]; sizeLabel?: string }

function safeParse(data: string | null): ImportData | null {
  if (!data) return null
  try {
    const raw = JSON.parse(data)
    if (typeof raw !== "object" || raw === null) return null
    const obj = raw as Record<string, unknown>
    const parts: PartInfo[] = Array.isArray(obj.parts)
      ? (obj.parts as Record<string, unknown>[]).map((p) => ({ name: typeof p.name === "string" ? p.name : "未命名", pointCount: Array.isArray(p.points) ? p.points.length : 0 }))
      : []
    return { garmentId: String(obj.garmentId || ""), name: String(obj.name || ""), measurements: Array.isArray(obj.measurements) ? obj.measurements as string[] : [], parts, sizeLabel: typeof obj.sizeLabel === "string" ? obj.sizeLabel : undefined }
  } catch { return null }
}

type OverrideEntry = { garmentId: string; sizeLabel: string; data: ImportData | null }

// Simple formula derivation modal component
function FormulaModal({ garmentId, name, onClose, onSaved }: { garmentId: string; name: string; onClose: () => void; onSaved: () => void }) {
  const overrides = getOverridesSync(garmentId)
  const [saved, setSaved] = useState(false)

  const handleSave = async () => {
    if (overrides.length < 2) return
    try {
      const imports = collectSizeImports(garmentId)
      const formulas = deriveFormulas(imports)
      await saveFormulas(garmentId, formulas)
      setSaved(true)
      setTimeout(() => { onSaved(); onClose() }, 1000)
    } catch (e) {
      alert("公式推导失败: " + (e instanceof Error ? e.message : String(e)))
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" onClick={onClose}>
      <div className="mx-4 w-full max-w-lg rounded-xl border border-border bg-background shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between border-b px-6 py-4">
          <div className="flex items-center gap-3">
            <FlaskConical className="size-5 text-violet-600" />
            <div><h2 className="text-lg font-bold">计算公式推导</h2><p className="text-xs text-muted-foreground">{name}</p></div>
          </div>
          <button onClick={onClose} className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted"><X className="size-4" /></button>
        </div>
        <div className="px-6 py-4 space-y-3">
          <p className="text-sm">基于以下 {overrides.length} 套尺码数据推导参数化公式：</p>
          <div className="flex flex-wrap gap-1.5">
            {overrides.map(o => <Badge key={o.sizeLabel} variant="secondary" className="text-xs">{o.sizeLabel}</Badge>)}
          </div>
          <p className="text-xs text-muted-foreground">
            系统将比对各尺码间同一顶点的坐标差异，通过线性回归找到与身高、胸围等测量值的最佳拟合公式。
          </p>
        </div>
        <div className="flex justify-end gap-3 border-t px-6 py-4">
          <Button variant="outline" size="sm" onClick={onClose}>取消</Button>
          <Button size="sm" disabled={overrides.length < 2 || saved} onClick={handleSave}>
            {saved ? "已保存" : overrides.length < 2 ? "至少需要2套数据" : "保存公式"}
          </Button>
        </div>
      </div>
    </div>
  )
}

type Filter = GarmentCategory | "all"

export default function GarmentsPage() {
  const [refresh, setRefresh] = useState(0)
  const [formulaModal, setFormulaModal] = useState<string | null>(null)
  const [catFilter, setCatFilter] = useState<Filter>("all")
  const [dynastyFilter, setDynastyFilter] = useState<string>("all")
  const [genderFilter, setGenderFilter] = useState<string>("all")

  const refreshData = () => setRefresh(k => k + 1)

  const filtered = GARMENT_CATALOG.filter(g => {
    if (catFilter !== "all" && g.category !== catFilter) return false
    if (dynastyFilter !== "all" && g.dynasty !== dynastyFilter) return false
    if (genderFilter !== "all" && g.gender !== genderFilter) return false
    return true
  })

  const handleReset = async (garmentId: string) => {
    await deleteOverride(garmentId)
    localStorage.removeItem(`hanfu-formulas-${garmentId}`)
    refreshData()
  }

  const dynasties = [...new Set(GARMENT_CATALOG.map(g => g.dynasty))]
  const genders = [...new Set(GARMENT_CATALOG.map(g => g.gender))]

  return (
    <AdminGuard>
    <div className="mx-auto max-w-6xl px-4 py-8">
      <nav className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/" className="hover:text-foreground">首页</Link>
        <span>/</span>
        <span className="font-medium text-foreground">款式管理</span>
      </nav>

      <div className="mb-6">
        <h1 className="text-2xl font-bold">款式管理</h1>
        <p className="mt-1 text-sm text-muted-foreground">导入多套尺码数据后，点击「计算公式」自动推导参数化公式</p>
      </div>

      {/* Filter bar */}
      <div className="mb-6 space-y-2">
        <div className="flex flex-wrap gap-2">
          <span className="text-xs font-medium text-muted-foreground self-center mr-1">部位:</span>
          {[{value:"all",label:"全部"},{value:"upper",label:"上身"},{value:"lower",label:"下身"},{value:"full_body",label:"通体"}].map(f => (
            <button key={f.value} onClick={() => setCatFilter(f.value as Filter)}
              className={`rounded-lg px-3 py-1 text-xs font-medium transition-colors ${catFilter===f.value ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/70"}`}>
              {f.label}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          <span className="text-xs font-medium text-muted-foreground self-center mr-1">朝代:</span>
          {[{value:"all",label:"全部"},...dynasties.map(d => ({value:d,label:DYNASTY_LABELS[d as Dynasty]}))].map(f => (
            <button key={f.value} onClick={() => setDynastyFilter(f.value)}
              className={`rounded-lg px-3 py-1 text-xs font-medium transition-colors ${dynastyFilter===f.value ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/70"}`}>
              {f.label}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          <span className="text-xs font-medium text-muted-foreground self-center mr-1">性别:</span>
          {[{value:"all",label:"全部"},{value:"female",label:"女装"},{value:"male",label:"男装"},{value:"unisex",label:"通用"}].map(f => (
            <button key={f.value} onClick={() => setGenderFilter(f.value)}
              className={`rounded-lg px-3 py-1 text-xs font-medium transition-colors ${genderFilter===f.value ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/70"}`}>
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Garment grid */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map(g => {
          const overrides = getOverridesSync(g.id)
          const hasFormulasCache = hasFormulasSync(g.id)

          return (
            <Card key={g.id} className="flex flex-col">
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <CardTitle className="text-base">{g.name}</CardTitle>
                    <CardDescription className="mt-0.5">{g.nameEn}</CardDescription>
                  </div>
                  <div className="flex flex-col gap-1 shrink-0 items-end">
                    <Badge variant={g.dynasty as Dynasty}>{DYNASTY_LABELS[g.dynasty]}</Badge>
                    <Badge variant="outline" className="text-[10px]">{GARMENT_CATEGORIES[g.category].name}</Badge>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="flex flex-1 flex-col gap-3">
                <div className="flex items-center gap-2">
                  {hasFormulasCache ? (
                    <Badge variant="outline" className="border-violet-400 text-violet-600"><FlaskConical className="mr-1 size-3" />公式驱动</Badge>
                  ) : overrides.length > 0 ? (
                    <Badge variant="outline" className="border-amber-400 text-amber-600"><CheckCircle2 className="mr-1 size-3" />{overrides.length}套数据</Badge>
                  ) : (
                    <Badge variant="secondary"><Shirt className="mr-1 size-3" />默认</Badge>
                  )}
                  <span className="text-[10px] text-muted-foreground ml-auto">{g.gender==="male"?"男装":g.gender==="female"?"女装":"通用"}</span>
                </div>

                {overrides.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {overrides.map(o => <Badge key={o.sizeLabel} variant="outline" className="text-[9px]">{o.sizeLabel}</Badge>)}
                  </div>
                )}

                <div className="mt-auto flex items-center gap-2">
                  <Link href={`/garments/${g.id}`} className="inline-flex items-center justify-center rounded-lg border border-border bg-background px-2.5 text-xs font-medium h-7 hover:bg-muted">
                    详情
                  </Link>

                  {overrides.length >= 2 && (
                    <Button variant="default" size="xs" className="gap-1 bg-violet-600 hover:bg-violet-700" onClick={() => setFormulaModal(g.id)}>
                      <Calculator className="size-3" />计算公式
                    </Button>
                  )}

                  {overrides.length === 1 && (
                    <Link href={`/import?overwrite=${g.id}`} className="inline-flex items-center justify-center rounded-lg border border-border bg-background px-2.5 text-xs font-medium h-7 hover:bg-muted">
                      导入更多
                    </Link>
                  )}

                  {overrides.length >= 1 ? (
                    <Button variant="destructive" size="xs" className="gap-1 ml-auto" onClick={() => handleReset(g.id)}>
                      <RotateCcw className="size-3" />还原
                    </Button>
                  ) : (
                    <Link href={`/import?overwrite=${g.id}`} className="inline-flex items-center justify-center rounded-lg border border-border bg-background px-2.5 text-xs font-medium h-7 hover:bg-muted ml-auto">
                      导入覆盖
                    </Link>
                  )}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {filtered.length === 0 && (
        <p className="text-center text-muted-foreground py-16">没有匹配的款式</p>
      )}

      {formulaModal && (
        <FormulaModal garmentId={formulaModal} name={GARMENT_CATALOG.find(g => g.id === formulaModal)?.name ?? ""} onClose={() => setFormulaModal(null)} onSaved={refreshData} />
      )}
    </div>
    </AdminGuard>
  )
}
