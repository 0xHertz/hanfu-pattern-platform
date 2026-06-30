"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Ruler, Shirt, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { GARMENT_CATALOG, GARMENT_CATEGORIES, DYNASTY_LABELS } from "@/data/garments"
import type { GarmentCategory } from "@/types/garment"

type CategoryFilter = GarmentCategory | "all"

export default function HomePage() {
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>("all")
  const [readyIds, setReadyIds] = useState<Set<string>>(new Set())

  useEffect(() => {
    try {
      const ids = new Set<string>()
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (!key) continue
        if (key.startsWith("hanfu-formulas-")) {
          ids.add(key.slice("hanfu-formulas-".length))
        } else if (key.startsWith("hanfu-override-")) {
          const rest = key.slice("hanfu-override-".length)
          const lastDash = rest.lastIndexOf("-")
          const id = lastDash > 0 ? rest.slice(0, lastDash) : rest
          if (id.length >= 2) ids.add(id)
        }
      }
      setReadyIds(ids)
    } catch { /* localStorage not available */ }
  }, [])

  const availableGarments = GARMENT_CATALOG.filter(g => readyIds.has(g.id))

  const filteredGarments =
    activeCategory === "all"
      ? availableGarments
      : availableGarments.filter((g) => g.category === activeCategory)

  const categories: { value: CategoryFilter; label: string }[] = [
    { value: "all", label: "全部" },
    ...Object.entries(GARMENT_CATEGORIES).map(([key, val]) => ({
      value: key as CategoryFilter,
      label: val.name,
    })),
  ]

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[oklch(0.30_0.10_30)] via-[oklch(0.25_0.08_35)] to-[oklch(0.20_0.06_40)]">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(45deg, transparent, transparent 40px, rgba(255,255,255,0.1) 40px, rgba(255,255,255,0.1) 41px)",
          }}
        />
        <div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24 lg:py-32">
          <div className="max-w-2xl">
            <div className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-[oklch(0.72_0.10_65)/30] bg-[oklch(0.72_0.10_65)/10] px-3 py-1 text-xs font-medium tracking-wide text-[oklch(0.85_0.05_70)]">
              <Ruler className="size-3" />
              明制 · 唐制 · 宋制 · 汉制
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-[oklch(0.95_0.02_80)] sm:text-4xl lg:text-5xl">
              汉服参数化
              <br />
              纸样平台
            </h1>
            <p className="mt-4 text-base leading-relaxed text-[oklch(0.80_0.03_70)] sm:text-lg">
              输入你的身体数据，生成专属于你的汉服裁剪图纸。
              <br className="hidden sm:inline" />
              从明制袄裙到唐制齐胸襦裙，数十种传统款式任你定制。
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button
                size="lg"
                className="bg-[oklch(0.72_0.10_65)] text-[oklch(0.20_0.04_40)] hover:bg-[oklch(0.72_0.10_65)/85]"
                onClick={() =>
                  document
                    .getElementById("catalog")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
              >
                浏览款式
                <ArrowRight className="ml-1 size-4" />
              </Button>
              <Link
                href="/how-to-measure"
                className="inline-flex items-center rounded-lg border border-[oklch(0.72_0.10_65)/30] text-[oklch(0.85_0.03_70)] text-sm font-medium h-10 px-4 hover:bg-[oklch(0.72_0.10_65)/10] transition-colors"
              >
                如何量体
              </Link>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-background to-transparent" />
      </section>

      {/* Catalog */}
      <section
        id="catalog"
        className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14"
      >
        <div className="mb-8">
          <h2 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
            款式目录
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            共 {GARMENT_CATALOG.length} 款汉服纸样，选择款式开始定制
          </p>
        </div>

        {/* Filter tabs */}
        <div className="mb-8 flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setActiveCategory(cat.value)}
              className={
                activeCategory === cat.value
                  ? "rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition-colors"
                  : "rounded-lg bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground transition-colors hover:bg-secondary/70"
              }
            >
              {cat.label}
              {cat.value !== "all" && (
                <span className="ml-1.5 text-xs opacity-70">
                  (
                  {
                    GARMENT_CATALOG.filter((g) => g.category === cat.value)
                      .length
                  }
                  )
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Garment grid */}
        {filteredGarments.length > 0 ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filteredGarments.map((garment) => (
              <Card
                key={garment.id}
                className="group relative flex flex-col transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
              >
                {/* Thumbnail area */}
                <div className="flex aspect-[4/3] items-center justify-center rounded-t-xl bg-gradient-to-br from-secondary to-muted">
                  <Shirt className="size-12 text-muted-foreground/40" />
                </div>

                {/* Badge row */}
                <div className="flex flex-wrap gap-1.5 px-4 pt-3 sm:px-5 sm:pt-4">
                  <Badge variant={garment.dynasty}>
                    {DYNASTY_LABELS[garment.dynasty]}
                  </Badge>
                  <Badge variant="secondary">
                    {GARMENT_CATEGORIES[garment.category].name}
                  </Badge>
                  {garment.gender !== "unisex" && (
                    <Badge variant="outline">
                      {garment.gender === "male" ? "男装" : "女装"}
                    </Badge>
                  )}
                </div>

                <CardHeader>
                  <CardTitle className="text-base">{garment.name}</CardTitle>
                  <CardDescription>{garment.nameEn}</CardDescription>
                </CardHeader>

                <CardContent className="flex-1">
                  <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                    {garment.description}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {garment.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="inline-block rounded bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </CardContent>

                <CardFooter>
                  <Link href={`/garments/${garment.id}`} className="w-full">
                    <Button className="w-full">开始定制</Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="py-16 text-center text-muted-foreground">
            暂无该分类下的款式
          </div>
        )}
      </section>
    </div>
  )
}
