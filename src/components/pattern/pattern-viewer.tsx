'use client'

import { useState, useRef, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { ZoomIn, ZoomOut, Download, Printer, RotateCcw, X, ChevronLeft, ChevronRight } from 'lucide-react'

export interface ReferenceImage {
  src: string
  label: string
  slug: string
}

interface PatternViewerProps {
  svgString: string | null
  garmentName: string
  isGenerating?: boolean
  referenceImages?: ReferenceImage[]
  onExport?: () => void
  onRegenerate?: () => void
}

export function PatternViewer({
  svgString,
  garmentName,
  isGenerating = false,
  referenceImages = [],
  onExport,
  onRegenerate,
}: PatternViewerProps) {
  const [zoom, setZoom] = useState(1)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const [isPanning, setIsPanning] = useState(false)
  const panStart = useRef({ x: 0, y: 0 })
  const containerRef = useRef<HTMLDivElement>(null)

  const zoomIn = () => setZoom((z) => Math.min(z * 1.2, 5))
  const zoomOut = () => setZoom((z) => Math.max(z / 1.2, 0.2))
  const resetView = useCallback(() => {
    setZoom(1)
    setPan({ x: 0, y: 0 })
  }, [])

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 0) {
      setIsPanning(true)
      panStart.current = { x: e.clientX - pan.x, y: e.clientY - pan.y }
    }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isPanning) return
    setPan({
      x: e.clientX - panStart.current.x,
      y: e.clientY - panStart.current.y,
    })
  }

  const handleMouseUp = () => setIsPanning(false)

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault()
    const delta = e.deltaY > 0 ? 0.9 : 1.1
    setZoom((z) => Math.max(0.2, Math.min(5, z * delta)))
  }

  const handlePrint = () => {
    if (!svgString) return
    const printWindow = window.open('', '_blank')
    if (!printWindow) return
    printWindow.document.write(`
      <html>
        <head><title>${garmentName} - 裁剪图纸</title>
        <style>
          body { margin: 0; display: flex; justify-content: center; }
          svg { max-width: 100%; height: auto; }
          @media print {
            @page { size: auto; margin: 10mm; }
            svg { width: 100%; }
          }
        </style></head>
        <body>${svgString}</body>
      </html>
    `)
    printWindow.document.close()
    setTimeout(() => printWindow.print(), 500)
  }

  const hasSvg = !!svgString
  const hasReference = referenceImages.length > 0

  if (isGenerating) {
    return (
      <Card className="flex items-center justify-center h-96">
        <div className="text-center space-y-4">
          <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full mx-auto" />
          <p className="text-muted-foreground">正在生成图纸...</p>
        </div>
      </Card>
    )
  }

  if (!hasSvg && !hasReference) {
    return (
      <Card className="flex items-center justify-center h-96">
        <div className="text-center space-y-4">
          <p className="text-muted-foreground">请先完成测量并点击生成图纸</p>
        </div>
      </Card>
    )
  }

  return (
    <div className="space-y-3">
      <Tabs defaultValue={hasSvg ? 'svg' : 'reference'}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {hasSvg && (
              <TabsList>
                <TabsTrigger value="svg">生成图纸</TabsTrigger>
                {hasReference && <TabsTrigger value="reference">参照图</TabsTrigger>}
              </TabsList>
            )}
            <TabsContent value="svg" className="m-0 flex items-center gap-2">
              <Badge variant="secondary">{Math.round(zoom * 100)}%</Badge>
              <Button variant="outline" size="sm" onClick={zoomIn}>
                <ZoomIn className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={zoomOut}>
                <ZoomOut className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={resetView}>
                <RotateCcw className="w-4 h-4" />
              </Button>
            </TabsContent>
          </div>
          <div className="flex items-center gap-2">
            {hasSvg && (
              <TabsContent value="svg" className="m-0 flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={handlePrint}>
                  <Printer className="w-4 h-4 mr-1" />
                  打印
                </Button>
                {onExport && (
                  <Button size="sm" onClick={onExport}>
                    <Download className="w-4 h-4 mr-1" />
                    导出
                  </Button>
                )}
                {onRegenerate && (
                  <Button variant="outline" size="sm" onClick={onRegenerate}>
                    重新生成
                  </Button>
                )}
              </TabsContent>
            )}
          </div>
        </div>

        {hasSvg && (
          <TabsContent value="svg">
            <Card className="overflow-hidden bg-white">
              <div
                ref={containerRef}
                className="relative overflow-hidden cursor-grab active:cursor-grabbing flex items-center justify-center"
                style={{ height: '600px', background: '#fafafa' }}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onWheel={handleWheel}
              >
                <div
                  style={{
                    transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
                  }}
                  dangerouslySetInnerHTML={{ __html: svgString }}
                />
              </div>
            </Card>
          </TabsContent>
        )}

        {hasReference && (
          <TabsContent value="reference">
            <ReferenceGallery images={referenceImages} garmentName={garmentName} />
          </TabsContent>
        )}
      </Tabs>
    </div>
  )
}

function ReferenceGallery({
  images,
  garmentName,
}: {
  images: ReferenceImage[]
  garmentName: string
}) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)

  const handlePrev = () => {
    setSelectedIndex((i) => (i !== null && i > 0 ? i - 1 : images.length - 1))
  }

  const handleNext = () => {
    setSelectedIndex((i) => (i !== null && i < images.length - 1 ? i + 1 : 0))
  }

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {images.map((img, index) => (
          <button
            key={img.slug}
            className="group relative overflow-hidden rounded-lg border border-border bg-white transition-shadow hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            onClick={() => setSelectedIndex(index)}
          >
            <div className="aspect-[3/4] overflow-hidden">
              <img
                src={img.src}
                alt={img.label}
                className="h-full w-full object-contain p-1 transition-transform group-hover:scale-105"
              />
            </div>
            <div className="border-t border-border px-2 py-1.5">
              <p className="text-xs text-muted-foreground truncate">{img.label}</p>
            </div>
          </button>
        ))}
      </div>

      {selectedIndex !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
          onClick={() => setSelectedIndex(null)}
        >
          <button
            className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/20 p-2 text-white hover:bg-white/40 transition-colors"
            onClick={(e) => { e.stopPropagation(); handlePrev() }}
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/20 p-2 text-white hover:bg-white/40 transition-colors"
            onClick={(e) => { e.stopPropagation(); handleNext() }}
          >
            <ChevronRight className="w-6 h-6" />
          </button>
          <button
            className="absolute right-4 top-4 rounded-full bg-white/20 p-2 text-white hover:bg-white/40 transition-colors"
            onClick={() => setSelectedIndex(null)}
          >
            <X className="w-5 h-5" />
          </button>

          <div
            className="flex flex-col items-center max-h-[90vh] max-w-[90vw]"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={images[selectedIndex].src}
              alt={images[selectedIndex].label}
              className="max-h-[85vh] max-w-[90vw] object-contain rounded-lg"
            />
            <p className="mt-2 text-sm text-white/80">
              {images[selectedIndex].label} — {garmentName}
            </p>
          </div>
        </div>
      )}
    </>
  )
}
