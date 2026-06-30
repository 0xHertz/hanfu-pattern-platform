'use client'

import { use } from 'react'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { GARMENT_CATALOG, DYNASTY_LABELS } from '@/data/garments'
import type { Dynasty } from '@/types/garment'
import { Badge } from '@/components/ui/badge'
import { MEASUREMENT_DEFINITIONS } from '@/types/measurement'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { MeasurementWizard } from '@/components/measurement/measurement-wizard'
import { ChevronRight, Ruler, Shirt } from 'lucide-react'

const CUSTOM_PREFIX = 'custom:'

function isCustom(id: string) {
  return id.startsWith(CUSTOM_PREFIX)
}

function extractImportId(garmentId: string): string {
  return garmentId.slice(CUSTOM_PREFIX.length)
}

interface ImportData {
  garmentId: string
  name: string
  measurements: string[]
  parts: { name: string; points: unknown[] }[]
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

export default function MeasurePage({
  params,
}: {
  params: Promise<{ garmentId: string }>
}) {
  const { garmentId } = use(params)
  const router = useRouter()

  const [importData, setImportData] = useState<ImportData | null>(null)
  const [customLoaded, setCustomLoaded] = useState(false)
  const [measurements, setMeasurements] = useState<Record<string, number> | null>(null)
  const [wizardComplete, setWizardComplete] = useState(false)

  // For custom garments, load import data from localStorage
  useEffect(() => {
    if (isCustom(garmentId)) {
      const importId = extractImportId(garmentId)
      const data = loadImportData(importId)
      setImportData(data)
      setCustomLoaded(true)
    } else {
      setCustomLoaded(true)
    }
  }, [garmentId])

  const garment = GARMENT_CATALOG.find((g) => g.id === garmentId)
  const dynastyLabel = garment ? DYNASTY_LABELS[garment.dynasty] : ''

  // Determine required measurements
  const requiredMeasurements = isCustom(garmentId)
    ? importData?.measurements ?? []
    : garment?.defaultMeasurements ?? []

  const garmentName = isCustom(garmentId)
    ? importData?.name ?? '自定义款式'
    : garment?.name ?? '未知款式'

  if (!isCustom(garmentId) && !garment) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-foreground mb-2">款式未找到</h1>
        <p className="text-muted-foreground mb-6">
          未找到 ID 为 &ldquo;{garmentId}&rdquo; 的款式
        </p>
        <Link href="/" className="inline-flex shrink-0 items-center justify-center rounded-lg border border-border bg-background text-sm font-medium h-9 gap-1.5 px-3 hover:bg-muted transition-colors">
          返回首页
        </Link>
      </div>
    )
  }

  // Loading state for custom garments
  if (isCustom(garmentId) && !customLoaded) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center">
        <p className="text-muted-foreground">加载中...</p>
      </div>
    )
  }

  if (isCustom(garmentId) && customLoaded && !importData) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-foreground mb-2">导入数据未找到</h1>
        <p className="text-muted-foreground mb-6">
          未找到对应的导入数据，请重新从导入页面导入
        </p>
        <Link href="/import" className="inline-flex shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground text-sm font-medium h-10 gap-1.5 px-4 hover:bg-primary/80 transition-colors cursor-pointer">
          返回导入页面
        </Link>
      </div>
    )
  }

  const handleWizardComplete = (values: Record<string, number>) => {
    setMeasurements(values)
    setWizardComplete(true)
  }

  const handleGeneratePattern = () => {
    if (!measurements) return
    localStorage.setItem(`hanfu-measurements-${garmentId}`, JSON.stringify(measurements))
    router.push(`/pattern/${garmentId}`)
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <nav className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/" className="hover:text-foreground transition-colors">
          首页
        </Link>
        <span aria-hidden="true">/</span>
        {isCustom(garmentId) ? (
          <>
            <Link href="/import" className="hover:text-foreground transition-colors">
              导入
            </Link>
            <span aria-hidden="true">/</span>
          </>
        ) : (
          <>
            <Link href="/" className="hover:text-foreground transition-colors">
              款式
            </Link>
            <span aria-hidden="true">/</span>
            <Link
              href={`/garments/${garment!.id}`}
              className="hover:text-foreground transition-colors"
            >
              {garment!.name}
            </Link>
            <span aria-hidden="true">/</span>
          </>
        )}
        <span className="text-foreground font-medium">量体</span>
      </nav>

      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          {isCustom(garmentId) ? (
            <Badge variant="secondary">自定义</Badge>
          ) : (
            <Badge variant={garment!.dynasty as Dynasty}>{dynastyLabel}</Badge>
          )}
          <Badge variant="outline">{garmentName}</Badge>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          量体定制 — {garmentName}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          请根据指引输入您的身体数据，我们将为您生成专属的裁剪图纸
        </p>
      </div>

      <div className="mb-8">
        <div className="flex items-center gap-0">
          <div
            className={`flex items-center gap-2 rounded-l-lg px-4 py-2 text-sm font-medium ${
              !wizardComplete
                ? 'bg-primary text-primary-foreground'
                : 'bg-primary/10 text-primary'
            }`}
          >
            <span
              className={`flex size-6 items-center justify-center rounded-full text-xs font-bold ${
                !wizardComplete
                  ? 'bg-primary-foreground text-primary'
                  : 'bg-primary text-primary-foreground'
              }`}
            >
              1
            </span>
            输入身体数据
          </div>
          <ChevronRight className="size-5 text-muted-foreground -mx-1 z-10" />
          <div
            className={`flex items-center gap-2 rounded-r-lg px-4 py-2 text-sm font-medium ${
              wizardComplete
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground'
            }`}
          >
            <span
              className={`flex size-6 items-center justify-center rounded-full text-xs font-bold ${
                wizardComplete
                  ? 'bg-primary-foreground text-primary'
                  : 'bg-muted-foreground/20 text-muted-foreground'
              }`}
            >
              2
            </span>
            生成图纸
          </div>
        </div>
      </div>

      {!wizardComplete ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              {isCustom(garmentId) ? <Shirt className="size-5" /> : <Ruler className="size-5" />}
              输入测量数据
            </CardTitle>
            <CardDescription>
              使用滑块或直接输入数值，标有 <span className="text-red-500">*</span> 的为必填项
              {isCustom(garmentId) && (
                <span className="block mt-1 text-xs">
                  此款式需要 {requiredMeasurements.length} 个测量参数
                </span>
              )}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <MeasurementWizard
              requiredMeasurements={requiredMeasurements}
              onComplete={handleWizardComplete}
            />
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Ruler className="size-5 text-green-600" />
                测量数据已记录
              </CardTitle>
              <CardDescription>
                以下是为您记录的测量数据，确认无误后可生成图纸
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 sm:grid-cols-2">
                {requiredMeasurements.map((mid) => {
                  const def = MEASUREMENT_DEFINITIONS.find(
                    (m) => m.id === mid
                  )
                  return (
                    <div
                      key={mid}
                      className="flex items-center justify-between rounded-lg border border-border bg-muted/30 px-4 py-3"
                    >
                      <span className="text-sm font-medium text-foreground">
                        {def?.name ?? mid}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {measurements?.[mid] ?? '—'} mm
                      </span>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-center gap-4">
            <button
              type="button"
              onClick={() => setWizardComplete(false)}
              className="inline-flex shrink-0 items-center justify-center rounded-lg border border-border bg-background text-sm font-medium h-9 gap-1.5 px-3 hover:bg-muted transition-colors cursor-pointer"
            >
              重新测量
            </button>
            <button
              type="button"
              onClick={handleGeneratePattern}
              className="inline-flex shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground text-sm font-medium h-10 gap-1.5 px-4 hover:bg-primary/80 transition-colors cursor-pointer"
            >
              生成图纸
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
