"use client"

import { use } from "react"
import { useRouter } from "next/navigation"
import { notFound } from "next/navigation"
import Link from "next/link"
import { GARMENT_CATALOG, DYNASTY_LABELS, GARMENT_CATEGORIES } from "@/data/garments"
import { MEASUREMENT_DEFINITIONS } from "@/types/measurement"
import type { Dynasty } from "@/types/garment"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

const SIZE_DATA: Record<string, Record<string, number>> = {
  "155/80A": { height: 1550, bust: 800, waist: 640, shoulderWidth: 390, garmentLength: 580, neckCircumference: 326, armSpan: 1550, armLength: 520 },
  "160/84A": { height: 1600, bust: 840, waist: 660, shoulderWidth: 400, garmentLength: 600, neckCircumference: 334, armSpan: 1600, armLength: 540 },
  "165/88A": { height: 1650, bust: 880, waist: 700, shoulderWidth: 410, garmentLength: 620, neckCircumference: 342, armSpan: 1650, armLength: 550 },
  "170/92A": { height: 1700, bust: 920, waist: 720, shoulderWidth: 420, garmentLength: 640, neckCircumference: 350, armSpan: 1700, armLength: 570 },
  "175/96A": { height: 1750, bust: 960, waist: 760, shoulderWidth: 430, garmentLength: 660, neckCircumference: 358, armSpan: 1750, armLength: 580 },
  "180/100A": { height: 1800, bust: 1000, waist: 840, shoulderWidth: 440, garmentLength: 700, neckCircumference: 366, armSpan: 1800, armLength: 600 },
  "185/104A": { height: 1850, bust: 1040, waist: 880, shoulderWidth: 450, garmentLength: 730, neckCircumference: 374, armSpan: 1850, armLength: 620 },
  "155/68A": { height: 1550, bust: 800, waist: 680, hip: 828, garmentLength: 580, skirtLength: 980, armSpan: 1550 },
  "160/72A": { height: 1600, bust: 840, waist: 720, hip: 864, garmentLength: 600, skirtLength: 1010, armSpan: 1600 },
  "165/76A": { height: 1650, bust: 880, waist: 760, hip: 900, garmentLength: 620, skirtLength: 1040, armSpan: 1650 },
  "170/80A": { height: 1700, bust: 920, waist: 800, hip: 936, garmentLength: 640, skirtLength: 1070, armSpan: 1700 },
  "175/84A": { height: 1750, bust: 960, waist: 840, hip: 972, garmentLength: 660, skirtLength: 1100, armSpan: 1750 },
  "180/88A": { height: 1800, bust: 1000, waist: 880, hip: 1008, garmentLength: 700, skirtLength: 1130, armSpan: 1800 },
  "185/92A": { height: 1850, bust: 1040, waist: 920, hip: 1044, garmentLength: 730, skirtLength: 1160, armSpan: 1850 },
}

function findMeasurementName(id: string): string | undefined {
  return MEASUREMENT_DEFINITIONS.find((m) => m.id === id)?.name
}

export default function GarmentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const router = useRouter()
  const garment = GARMENT_CATALOG.find((g) => g.id === id)
  if (!garment) notFound()

  const categoryLabel = GARMENT_CATEGORIES[garment.category]?.name ?? garment.category
  const dynastyLabel = DYNASTY_LABELS[garment.dynasty]

  const handleSizeClick = (size: string) => {
    const data = SIZE_DATA[size]
    if (!data) return
    localStorage.setItem(`hanfu-measurements-${garment.id}`, JSON.stringify(data))
    router.push(`/pattern/${garment.id}`)
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <nav className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/" className="hover:text-foreground transition-colors">
          首页
        </Link>
        <span aria-hidden="true">/</span>
        <Link href="/garments" className="hover:text-foreground transition-colors">
          款式
        </Link>
        <span aria-hidden="true">/</span>
        <span className="text-foreground font-medium">{garment.name}</span>
      </nav>

      <div className="mb-8">
        <div className="flex items-center gap-2 mb-3">
          <Badge variant={garment.dynasty as Dynasty}>{dynastyLabel}</Badge>
          <Badge variant="secondary">{categoryLabel}</Badge>
          <Badge variant="outline">{garment.sleeveType === "work" ? "劳作袖" : garment.sleeveType === "regular" ? "常服袖" : "礼服袖"}</Badge>
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          {garment.name}
        </h1>
        <p className="mt-2 text-muted-foreground">{garment.nameEn}</p>
      </div>

      <section className="mb-8">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm leading-relaxed text-muted-foreground">
              {garment.description}
            </p>
            <div className="mt-4 flex flex-wrap gap-1.5">
              {garment.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="mb-8">
        <h2 className="mb-4 text-xl font-semibold text-foreground">
          需要的测量数据
        </h2>
        <div className="grid gap-2 sm:grid-cols-2">
          {garment.defaultMeasurements.map((mid) => {
            const name = findMeasurementName(mid)
            return (
              <Card key={mid} className="border-l-4 border-l-primary/40">
                <CardHeader className="py-3">
                  <CardTitle className="text-sm font-medium">
                    {name ?? mid}
                    <span className="ml-2 text-xs font-normal text-muted-foreground">
                      ({mid})
                    </span>
                  </CardTitle>
                </CardHeader>
              </Card>
            )
          })}
        </div>
      </section>

      <div className="mb-8 border-t border-border" />

      <section className="mb-10">
        <h2 className="mb-4 text-xl font-semibold text-foreground">
          尺码对照
        </h2>
        <Card>
          <CardContent className="pt-6">
            {garment.sizes.length > 0 ? (
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
                {garment.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => handleSizeClick(size)}
                    className="rounded-lg border border-border bg-muted/30 px-4 py-2.5 text-center text-sm font-medium text-foreground hover:bg-primary hover:text-primary-foreground transition-colors cursor-pointer"
                  >
                    {size}
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                暂无尺码对照数据
              </p>
            )}
          </CardContent>
        </Card>
      </section>

      <div className="flex justify-center">
        <Link href={`/measure/${garment.id}`}>
          <Button size="lg" className="min-w-56 text-base font-semibold tracking-wide">
            开始量体定制
          </Button>
        </Link>
      </div>
    </div>
  )
}
