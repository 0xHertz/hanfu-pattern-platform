import { notFound } from 'next/navigation'
import Link from 'next/link'
import { GARMENT_CATALOG, DYNASTY_LABELS, GARMENT_CATEGORIES } from '@/data/garments'
import { MEASUREMENT_DEFINITIONS } from '@/types/measurement'
import type { Dynasty } from '@/types/garment'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

function findMeasurementName(id: string): string | undefined {
  return MEASUREMENT_DEFINITIONS.find((m) => m.id === id)?.name
}

export default async function GarmentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const garment = GARMENT_CATALOG.find((g) => g.id === id)
  if (!garment) notFound()

  const categoryLabel = GARMENT_CATEGORIES[garment.category]?.name ?? garment.category
  const dynastyLabel = DYNASTY_LABELS[garment.dynasty]

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <nav className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/" className="hover:text-foreground transition-colors">
          首页
        </Link>
        <span aria-hidden="true">/</span>
        <Link href="/" className="hover:text-foreground transition-colors">
          款式
        </Link>
        <span aria-hidden="true">/</span>
        <span className="text-foreground font-medium">{garment.name}</span>
      </nav>

      <div className="mb-8">
        <div className="flex flex-wrap items-center gap-2 mb-2">
          <Badge variant={garment.dynasty as Dynasty}>{dynastyLabel}</Badge>
          <Badge variant="outline">{categoryLabel}</Badge>
          {garment.sleeveType === 'formal' && <Badge variant="secondary">礼服</Badge>}
          {garment.fitType === 'snug' && <Badge variant="secondary">紧身</Badge>}
          {garment.fitType === 'loose' && <Badge variant="secondary">宽松</Badge>}
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          {garment.name}
        </h1>
        <p className="mt-1 text-base text-muted-foreground">{garment.nameEn}</p>
      </div>

      <Card className="mb-8">
        <CardContent className="pt-6">
          <p className="text-base leading-relaxed text-foreground/85">
            {garment.description}
          </p>
        </CardContent>
      </Card>

      {garment.tags.length > 0 && (
        <div className="mb-8 flex flex-wrap gap-2">
          {garment.tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
      )}

      <div className="mb-8 border-t border-border" />

      <section className="mb-8">
        <h2 className="mb-4 text-xl font-semibold text-foreground">
          需要的测量数据
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
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
                  <div
                    key={size}
                    className="rounded-lg border border-border bg-muted/30 px-4 py-2.5 text-center text-sm font-medium text-foreground"
                  >
                    {size}
                  </div>
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
