"use client"

import { useState, useRef, useCallback, useEffect, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Trash2, Upload, Download, Copy, Plus, Crosshair, Wand2, FileUp } from "lucide-react"

// ─── Types ──────────────────────────────────────────────────────────────────

interface Point {
  id: string
  x: number
  y: number
  cp1x?: number; cp1y?: number  // bezier control point 1 (outgoing)
  cp2x?: number; cp2y?: number  // bezier control point 2 (incoming)
  formulaX: string | null // null = fixed, string = parametric formula
  formulaY: string | null
}

interface PatternPiece {
  id: string
  name: string
  points: Point[]
  annotations: Annotation[]
}

interface Annotation {
  id: string
  fromPointId: string
  toPointId: string
  label: string
  offset: number
}

interface ExportPart {
  name: string
  points: {
    x: number | string; y: number | string; type: "fixed" | "formula"
    cp1x?: number; cp1y?: number; cp2x?: number; cp2y?: number
  }[]
  interiorLines: number[][]
  foldLines: number[][]
  annotations: { from: number; to: number; label: string }[]
}

interface ExportData {
  garmentId: string
  name: string
  sizeLabel: string
  measurements: string[]
  parts: ExportPart[]
}

// ─── Constants ──────────────────────────────────────────────────────────────

const MEASUREMENT_DEFS = [
  { key: "height", label: "身高 (cm)", default: 160 },
  { key: "bust", label: "胸围 (cm)", default: 84 },
  { key: "waist", label: "腰围 (cm)", default: 68 },
  { key: "shoulderWidth", label: "肩宽 (cm)", default: 38 },
  { key: "armSpan", label: "臂长 (cm)", default: 55 },
  { key: "garmentLength", label: "衣长 (cm)", default: 70 },
  { key: "neckCircumference", label: "颈围 (cm)", default: 36 },
  { key: "armLength", label: "袖长 (cm)", default: 60 },
] as const

type MeasKey = (typeof MEASUREMENT_DEFS)[number]["key"]

const DEFAULT_MEASUREMENTS: Record<MeasKey, number> = Object.fromEntries(
  MEASUREMENT_DEFS.map((m) => [m.key, m.default])
) as Record<MeasKey, number>

// Standard size body reference (A型)
const SIZE_DATA: Record<string, Partial<Record<MeasKey, number>>> = {
  "155/80A": { height: 155, bust: 80, waist: 64, shoulderWidth: 39, garmentLength: 58, neckCircumference: 33, armLength: 52 },
  "160/84A": { height: 160, bust: 84, waist: 66, shoulderWidth: 40, garmentLength: 60, neckCircumference: 33, armLength: 54 },
  "165/88A": { height: 165, bust: 88, waist: 70, shoulderWidth: 41, garmentLength: 62, neckCircumference: 34, armLength: 55 },
  "170/92A": { height: 170, bust: 92, waist: 72, shoulderWidth: 42, garmentLength: 64, neckCircumference: 35, armLength: 57 },
  "175/96A": { height: 175, bust: 96, waist: 76, shoulderWidth: 43, garmentLength: 66, neckCircumference: 36, armLength: 58 },
  "180/100A": { height: 180, bust: 100, waist: 84, shoulderWidth: 44, garmentLength: 70, neckCircumference: 37, armLength: 60 },
  "185/104A": { height: 185, bust: 104, waist: 88, shoulderWidth: 45, garmentLength: 73, neckCircumference: 37, armLength: 62 },
}

const SIZE_OPTIONS = Object.keys(SIZE_DATA)

const GRID_SIZE = 20

// ─── Helpers ────────────────────────────────────────────────────────────────

let pointCounter = 0
function genId(): string {
  return `p${++pointCounter}_${Math.random().toString(36).slice(2, 6)}`
}
function pieceId(): string {
  return `piece_${Math.random().toString(36).slice(2, 8)}`
}

function evaluateFormula(formula: string, measurements: Record<string, number>): number {
  let expr = formula
  for (const [key, value] of Object.entries(measurements)) {
    expr = expr.replace(new RegExp(`\\{${key}\\}`, "g"), String(value))
  }
  expr = expr.replace(/×/g, "*").replace(/÷/g, "/")
  try {
    const fn = new Function(`"use strict"; return (${expr})`)
    const result = fn()
    if (typeof result === "number" && !Number.isNaN(result)) {
      return Math.round(result * 100) / 100
    }
  } catch {
    // fall through
  }
  return 0
}

function distanceToSegment(
  px: number,
  py: number,
  ax: number,
  ay: number,
  bx: number,
  by: number
): number {
  const dx = bx - ax
  const dy = by - ay
  const lenSq = dx * dx + dy * dy
  if (lenSq === 0) return Math.hypot(px - ax, py - ay)
  let t = ((px - ax) * dx + (py - ay) * dy) / lenSq
  t = Math.max(0, Math.min(1, t))
  return Math.hypot(px - (ax + t * dx), py - (ay + t * dy))
}

function findNearestEdge(
  px: number,
  py: number,
  points: Point[]
): number {
  if (points.length < 2) return points.length
  let minDist = Infinity
  let insertIdx = points.length
  for (let i = 0; i < points.length; i++) {
    const j = (i + 1) % points.length
    const dist = distanceToSegment(px, py, points[i].x, points[i].y, points[j].x, points[j].y)
    if (dist < minDist) {
      minDist = dist
      insertIdx = j
    }
  }
  return insertIdx
}

function generateDefaultCtrlPt(
  fromX: number, fromY: number,
  toX: number, toY: number,
  t: number
): { x: number; y: number } {
  return { x: fromX + (toX - fromX) * t, y: fromY + (toY - fromY) * t }
}

function getPointValue(
  point: Point,
  axis: "x" | "y",
  measurements: Record<string, number>
): number {
  const formula = axis === "x" ? point.formulaX : point.formulaY
  if (formula) {
    return evaluateFormula(formula, measurements)
  }
  return point[axis]
}

// ─── Main Component ─────────────────────────────────────────────────────────

export default function DigitizerPage() {
  // Image
  const [imageUrl, setImageUrl] = useState("")
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageSize, setImageSize] = useState({ w: 800, h: 600 })
  const imageRef = useRef<HTMLImageElement>(null)
  const [urlInput, setUrlInput] = useState("")

  // Pieces
  const [pieces, setPieces] = useState<PatternPiece[]>([
    { id: pieceId(), name: "前片", points: [], annotations: [] },
  ])
  const [activePieceIdx, setActivePieceIdx] = useState(0)
  const [pieceNameInput, setPieceNameInput] = useState("")

  // Selection
  const [selectedPoint, setSelectedPoint] = useState<string | null>(null)

  // Zoom / Pan
  const [zoom, setZoom] = useState(1)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const zoomRef = useRef(1)
  const panRef = useRef({ x: 0, y: 0 })
  const canvasRef = useRef<HTMLDivElement>(null)
  const isPanning = useRef(false)
  const panStart = useRef({ x: 0, y: 0 })
  const panOffsetStart = useRef({ x: 0, y: 0 })

  // Drag
  const [dragging, setDragging] = useState<string | null>(null)

  // Test measurements
  const [testMeas, setTestMeas] = useState<Record<string, number>>({ ...DEFAULT_MEASUREMENTS })
  const [selectedSize, setSelectedSize] = useState("170/92A")

  // Formula editing
  const [editingFormulaAxis, setEditingFormulaAxis] = useState<"x" | "y" | null>(null)
  const [formulaInput, setFormulaInput] = useState("")

  // Active formula axis for chip insertion
  const [activeFormulaField, setActiveFormulaField] = useState<"x" | "y" | null>(null)

  // Curve mode
  const [curveMode, setCurveMode] = useState(false)
  const [showControlPoints, setShowControlPoints] = useState(true)

  // Auto-trace
  const [isAutoTracing, setIsAutoTracing] = useState(false)
  const [autoTraceThreshold, setAutoTraceThreshold] = useState(128)
  const [prevPointsBeforeTrace, setPrevPointsBeforeTrace] = useState<Point[] | null>(null)

  // Control point dragging
  const [draggingCp, setDraggingCp] = useState<{ pointId: string; cp: "cp1" | "cp2" } | null>(null)
  const draggingCpRef = useRef<{ pointId: string; cp: "cp1" | "cp2" } | null>(null)
  const suppressClickRef = useRef(false)

  // Annotation mode
  const [annotationMode, setAnnotationMode] = useState(false)
  const [pendingAnnotationStart, setPendingAnnotationStart] = useState<string | null>(null)
  const [importKey, setImportKey] = useState(0)

  // ─── Derived ────────────────────────────────────────────────────────────

  const activePiece = pieces[activePieceIdx]
  const points = activePiece?.points ?? []

  const computedPoints = useMemo(() => {
    return points.map((p) => ({
      ...p,
      computedX: getPointValue(p, "x", testMeas),
      computedY: getPointValue(p, "y", testMeas),
    }))
  }, [points, testMeas])

  const selectedPointData = useMemo(() => {
    if (!selectedPoint) return null
    return points.find((p) => p.id === selectedPoint) ?? null
  }, [selectedPoint, points])

  // ─── Image handlers ─────────────────────────────────────────────────────

  const handleImageLoad = useCallback(() => {
    if (imageRef.current) {
      setImageSize({ w: imageRef.current.naturalWidth, h: imageRef.current.naturalHeight })
      setImageLoaded(true)
    }
  }, [])

  const loadImageUrl = useCallback(() => {
    if (urlInput.trim()) {
      setImageUrl(urlInput.trim())
      setImageLoaded(false)
      setZoom(1)
      setPan({ x: 0, y: 0 })
    }
  }, [urlInput])

  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      setImageUrl(ev.target?.result as string)
      setImageLoaded(false)
      setZoom(1)
      setPan({ x: 0, y: 0 })
    }
    reader.readAsDataURL(file)
  }, [])

  // ─── Piece management ──────────────────────────────────────────────────

  const addPiece = useCallback(() => {
    const name = pieceNameInput.trim() || `裁片 ${pieces.length + 1}`
    setPieces((prev) => [...prev, { id: pieceId(), name, points: [], annotations: [] }])
    setActivePieceIdx(pieces.length)
    setPieceNameInput("")
  }, [pieceNameInput, pieces.length])

  const selectPiece = useCallback((idx: number) => {
    setActivePieceIdx(idx)
    setSelectedPoint(null)
  }, [])

  // ─── Point operations ──────────────────────────────────────────────────

  const addPoint = useCallback(
    (x: number, y: number, shiftKey: boolean) => {
      setPieces((prev) => {
        const updated = [...prev]
        const piece = { ...updated[activePieceIdx], points: [...updated[activePieceIdx].points] }

        const newPoint = (px: number, py: number, pts: Point[], idx: number): Point => {
          const pt: Point = { id: genId(), x: px, y: py, formulaX: null, formulaY: null }
          if (curveMode && pts.length > 0) {
            // Default control points so curve starts near-straight
            const prevPt = pts[idx > 0 ? idx - 1 : pts.length - 1]
            const c1 = generateDefaultCtrlPt(prevPt.x, prevPt.y, px, py, 0.33)
            const c2 = generateDefaultCtrlPt(prevPt.x, prevPt.y, px, py, 0.66)
            pt.cp1x = Math.round(c1.x); pt.cp1y = Math.round(c1.y)
            pt.cp2x = Math.round(c2.x); pt.cp2y = Math.round(c2.y)
            // Also set cp2 on previous point if it doesn't have one
            const pp = pts[idx > 0 ? idx - 1 : pts.length - 1]
            if (pp.cp2x === undefined) {
              const pc2 = generateDefaultCtrlPt(prevPt.x, prevPt.y, px, py, 0.33)
              pp.cp2x = Math.round(pc2.x); pp.cp2y = Math.round(pc2.y)
            }
          }
          return pt
        }

        if (shiftKey && piece.points.length >= 2) {
          const idx = findNearestEdge(x, y, piece.points)
          piece.points.splice(idx, 0, newPoint(x, y, piece.points, idx))
        } else {
          piece.points.push(newPoint(x, y, piece.points, piece.points.length))
        }

        updated[activePieceIdx] = piece
        return updated
      })
    },
    [activePieceIdx, curveMode]
  )

  const deletePoint = useCallback(
    (id: string) => {
      setPieces((prev) => {
        const updated = [...prev]
        const piece = { ...updated[activePieceIdx] }
        piece.points = piece.points.filter((p) => p.id !== id)
        piece.annotations = (piece.annotations || []).filter(
          (a) => a.fromPointId !== id && a.toPointId !== id
        )
        updated[activePieceIdx] = piece
        return updated
      })
      if (selectedPoint === id) setSelectedPoint(null)
      if (pendingAnnotationStart === id) setPendingAnnotationStart(null)
    },
    [activePieceIdx, selectedPoint, pendingAnnotationStart]
  )

  const updatePointPosition = useCallback(
    (id: string, x: number, y: number) => {
      setPieces((prev) => {
        const updated = [...prev]
        const piece = { ...updated[activePieceIdx] }
        piece.points = piece.points.map((p) =>
          p.id === id ? { ...p, x, y, formulaX: null, formulaY: null } : p
        )
        updated[activePieceIdx] = piece
        return updated
      })
    },
    [activePieceIdx]
  )

  const updatePointFormula = useCallback(
    (id: string, axis: "x" | "y", formula: string | null) => {
      setPieces((prev) => {
        const updated = [...prev]
        const piece = { ...updated[activePieceIdx] }
        piece.points = piece.points.map((p) => {
          if (p.id !== id) return p
          if (axis === "x") return { ...p, formulaX: formula || null }
          return { ...p, formulaY: formula || null }
        })
        updated[activePieceIdx] = piece
        return updated
      })
    },
    [activePieceIdx]
  )

  // ─── Control point handlers ────────────────────────────────────────────────

  const updateControlPoint = useCallback(
    (pointId: string, cp: "cp1" | "cp2", x: number, y: number) => {
      setPieces((prev) => {
        const updated = [...prev]
        const piece = { ...updated[activePieceIdx] }
        piece.points = piece.points.map((p) => {
          if (p.id !== pointId) return p
          if (cp === "cp1") return { ...p, cp1x: x, cp1y: y }
          return { ...p, cp2x: x, cp2y: y }
        })
        updated[activePieceIdx] = piece
        return updated
      })
    },
    [activePieceIdx]
  )

  const handleCpPointerDown = useCallback(
    (e: React.PointerEvent, pointId: string, cp: "cp1" | "cp2") => {
      e.preventDefault()
      e.stopPropagation()
      ;(e.target as Element).setPointerCapture?.(e.pointerId)
      setDraggingCp({ pointId, cp })
      draggingCpRef.current = { pointId, cp }
      suppressClickRef.current = true
    },
    []
  )

  // ─── Auto-Trace Algorithm ────────────────────────────────────────────────

  function loadImageToCanvas(imgSrc: string): Promise<{ data: Uint8ClampedArray; w: number; h: number }> {
    return new Promise((resolve, reject) => {
      const img = new window.Image()
      if (!imgSrc.startsWith('data:')) {
        img.crossOrigin = "anonymous"
      }
      img.onload = () => {
        const canvas = document.createElement("canvas")
        canvas.width = img.naturalWidth
        canvas.height = img.naturalHeight
        const ctx = canvas.getContext("2d")!
        ctx.drawImage(img, 0, 0)
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
        resolve({ data: imageData.data, w: canvas.width, h: canvas.height })
      }
      img.onerror = () => reject(new Error('图片加载失败，可能是跨域限制'))
      img.src = imgSrc
    })
  }

  function mooreNeighborTrace(
    data: Uint8ClampedArray,
    w: number,
    h: number,
    threshold: number
  ): { x: number; y: number }[] {
    const isDark = (x: number, y: number) => {
      if (x < 0 || x >= w || y < 0 || y >= h) return false
      const idx = (y * w + x) * 4
      return data[idx] + data[idx + 1] + data[idx + 2] < threshold * 3
    }

    // Find starting pixel (topmost-leftmost dark pixel)
    let startX = -1, startY = -1
    for (let y = 0; y < h && startX === -1; y++) {
      for (let x = 0; x < w && startX === -1; x++) {
        if (isDark(x, y)) { startX = x; startY = y }
      }
    }
    if (startX === -1) return []

    // Moore-Neighbor 8-direction: clockwise from 0=East
    const dirs: [number, number][] = [
      [1, 0], [1, -1], [0, -1], [-1, -1],
      [-1, 0], [-1, 1], [0, 1], [1, 1],
    ]

    const contour: { x: number; y: number }[] = []
    let cx = startX, cy = startY
    let prevDir = 7 // start with north-west check
    let maxPixels = w * h // safety limit
    const visited = new Set<number>()

    while (maxPixels-- > 0) {
      const key = cy * w + cx
      if (visited.has(key)) break
      visited.add(key)
      contour.push({ x: cx, y: cy })

      let found = false
      for (let i = 0; i < 8; i++) {
        const dirIdx = (prevDir + 1 + i) % 8
        const [dx, dy] = dirs[dirIdx]
        const nx = cx + dx
        const ny = cy + dy
        if (isDark(nx, ny)) {
          cx = nx; cy = ny
          prevDir = dirIdx
          found = true
          break
        }
      }
      if (!found) break
      if (cx === startX && cy === startY) break
    }

    return contour
  }

  function douglasPeucker(
    points: { x: number; y: number }[],
    epsilon: number
  ): { x: number; y: number }[] {
    if (points.length <= 2) return points

    let maxDist = 0
    let maxIdx = 0
    const first = points[0]
    const last = points[points.length - 1]

    for (let i = 1; i < points.length - 1; i++) {
      const d = distanceToSegment(points[i].x, points[i].y, first.x, first.y, last.x, last.y)
      if (d > maxDist) { maxDist = d; maxIdx = i }
    }

    if (maxDist > epsilon) {
      const left = douglasPeucker(points.slice(0, maxIdx + 1), epsilon)
      const right = douglasPeucker(points.slice(maxIdx), epsilon)
      return [...left.slice(0, -1), ...right]
    }

    return [first, last]
  }

  const handleAutoTrace = useCallback(async () => {
    if (!imageUrl || isAutoTracing) return
    setIsAutoTracing(true)
    // Save current points for undo
    setPrevPointsBeforeTrace([...points])

    try {
      const { data, w, h } = await loadImageToCanvas(imageUrl)
      // Count dark pixels for diagnostics
      let darkCount = 0
      for (let i = 0; i < data.length; i += 4) {
        if (data[i] + data[i+1] + data[i+2] < autoTraceThreshold * 3) darkCount++
      }
      const rawContour = mooreNeighborTrace(data, w, h, autoTraceThreshold)
      if (rawContour.length < 3) {
        alert(`自动识别未找到足够轮廓点。\n图片: ${w}×${h}px\n暗色像素: ${darkCount} (${(darkCount/(w*h)*100).toFixed(1)}%)\n轮廓点: ${rawContour.length}\n尝试降低阈值。`)
        setIsAutoTracing(false)
        return
      }
      const epsilon = 2.0
      const simplified = douglasPeucker(rawContour, epsilon)

      const newPoints: Point[] = simplified.map((p) => ({
        id: genId(),
        x: Math.round(p.x),
        y: Math.round(p.y),
        formulaX: null,
        formulaY: null,
      }))

      setPieces((prev) => {
        const updated = [...prev]
        updated[activePieceIdx] = { ...updated[activePieceIdx], points: newPoints }
        return updated
      })
      setSelectedPoint(null)
    } catch (err) {
      alert(`自动识别失败: ${err instanceof Error ? err.message : '图片加载错误'}`)
    }
    setIsAutoTracing(false)
  }, [imageUrl, isAutoTracing, autoTraceThreshold, activePieceIdx, points])

  const undoAutoTrace = useCallback(() => {
    if (prevPointsBeforeTrace) {
      setPieces((prev) => {
        const updated = [...prev]
        updated[activePieceIdx] = { ...updated[activePieceIdx], points: prevPointsBeforeTrace }
        return updated
      })
      setPrevPointsBeforeTrace(null)
    }
  }, [prevPointsBeforeTrace, activePieceIdx])

  // ─── Annotation helpers ─────────────────────────────────────────────

  const addAnnotation = useCallback(
    (fromPointId: string, toPointId: string, label: string) => {
      setPieces((prev) => {
        const updated = [...prev]
        const piece = { ...updated[activePieceIdx] }
        piece.annotations = [
          {
            id: `ann_${Math.random().toString(36).slice(2, 8)}`,
            fromPointId,
            toPointId,
            label,
            offset: 15,
          },
        ]
        updated[activePieceIdx] = piece
        return updated
      })
    },
    [activePieceIdx]
  )

  const deleteAnnotation = useCallback(
    (annId: string) => {
      setPieces((prev) => {
        const updated = [...prev]
        const piece = { ...updated[activePieceIdx] }
        piece.annotations = (piece.annotations || []).filter((a) => a.id !== annId)
        updated[activePieceIdx] = piece
        return updated
      })
    },
    [activePieceIdx]
  )

  const updateAnnotationLabel = useCallback(
    (annId: string, label: string) => {
      setPieces((prev) => {
        const updated = [...prev]
        const piece = { ...updated[activePieceIdx] }
        piece.annotations = (piece.annotations || []).map((a) =>
          a.id === annId ? { ...a, label } : a
        )
        updated[activePieceIdx] = piece
        return updated
      })
    },
    [activePieceIdx]
  )

  // ─── Canvas interactions ────────────────────────────────────────────────

  const getCanvasCoords = useCallback(
    (clientX: number, clientY: number) => {
      const rect = canvasRef.current?.getBoundingClientRect()
      if (!rect) return { x: 0, y: 0 }
      return {
        x: (clientX - rect.left - panRef.current.x) / zoomRef.current,
        y: (clientY - rect.top - panRef.current.y) / zoomRef.current,
      }
    },
    []
  )

  const handleCanvasClick = useCallback(
    (e: React.MouseEvent) => {
      if (!imageLoaded) return
      if (e.button !== 0) return

      const { x, y } = getCanvasCoords(e.clientX, e.clientY)
      if (x < 0 || y < 0 || x > imageSize.w || y > imageSize.h) return

      if (annotationMode) {
        const hitRadius = 8 / zoomRef.current
        const hitPoint = computedPoints.find(
          (p) => Math.hypot(p.computedX - x, p.computedY - y) < hitRadius
        )
        if (hitPoint) {
            if (pendingAnnotationStart === null) {
              setPendingAnnotationStart(hitPoint.id)
            } else if (pendingAnnotationStart !== hitPoint.id) {
              const p1 = computedPoints.find((p) => p.id === pendingAnnotationStart)
              if (p1) {
                const dist = Math.round(
                  Math.hypot(p1.computedX - hitPoint.computedX, p1.computedY - hitPoint.computedY)
                )
                const label = window.prompt("输入标注文字:", `${dist}px`)
                if (label) {
                  addAnnotation(pendingAnnotationStart, hitPoint.id, label)
                }
              }
              setPendingAnnotationStart(null)
            } else {
              setPendingAnnotationStart(null)
            }
          } else {
            // Clicked empty space — cancel pending
            setPendingAnnotationStart(null)
          }
        return
      }

      if (dragging || suppressClickRef.current) {
        suppressClickRef.current = false
        return
      }

      const hitRadius = 8 / zoomRef.current
      const hitPoint = computedPoints.find(
        (p) => Math.hypot(p.computedX - x, p.computedY - y) < hitRadius
      )

      if (hitPoint) {
        setSelectedPoint(hitPoint.id)
        return
      }

      addPoint(Math.round(x), Math.round(y), e.shiftKey)
    },
    [getCanvasCoords, computedPoints, addPoint, dragging, annotationMode, pendingAnnotationStart, addAnnotation, imageLoaded, imageSize]
  )

  const handlePointPointerDown = useCallback(
    (e: React.PointerEvent, pointId: string) => {
      e.preventDefault()
      e.stopPropagation()
      if (annotationMode) return // don't start drag in annotation mode
      ;(e.target as Element).setPointerCapture?.(e.pointerId)
      setDragging(pointId)
      setSelectedPoint(pointId)
      suppressClickRef.current = true
    },
    [annotationMode]
  )

  const handleCanvasPointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (dragging) {
        const { x, y } = getCanvasCoords(e.clientX, e.clientY)
        updatePointPosition(dragging, Math.round(x), Math.round(y))
      }
      if (draggingCp) {
        const { x, y } = getCanvasCoords(e.clientX, e.clientY)
        updateControlPoint(draggingCp.pointId, draggingCp.cp, Math.round(x), Math.round(y))
      }
    },
    [dragging, draggingCp, getCanvasCoords, updatePointPosition, updateControlPoint]
  )

  const handleCanvasPointerUp = useCallback(() => {
    setDragging(null)
    setDraggingCp(null)
    draggingCpRef.current = null
  }, [])

  // Zoom with scroll
  const handleWheel = useCallback(
    (e: React.WheelEvent) => {
      e.preventDefault()
      const rect = canvasRef.current?.getBoundingClientRect()
      if (!rect) return
      const mouseX = e.clientX - rect.left
      const mouseY = e.clientY - rect.top
      const delta = -e.deltaY * 0.001
      const newZoom = Math.max(0.1, Math.min(10, zoomRef.current * (1 + delta)))
      const ratio = newZoom / zoomRef.current
      const newPan = {
        x: mouseX - ratio * (mouseX - panRef.current.x),
        y: mouseY - ratio * (mouseY - panRef.current.y),
      }
      zoomRef.current = newZoom
      panRef.current = newPan
      setZoom(newZoom)
      setPan(newPan)
    },
    []
  )

  // Middle mouse pan
  const handleCanvasPointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (e.button === 1) {
        // Middle mouse
        e.preventDefault()
        isPanning.current = true
        panStart.current = { x: e.clientX, y: e.clientY }
        panOffsetStart.current = { ...pan }
        ;(e.target as Element).setPointerCapture?.(e.pointerId)
      }
    },
    [pan]
  )

  const handleCanvasPointerMoveGlobal = useCallback(
    (e: React.PointerEvent) => {
      if (isPanning.current) {
        setPan({
          x: panOffsetStart.current.x + (e.clientX - panStart.current.x),
          y: panOffsetStart.current.y + (e.clientY - panStart.current.y),
        })
      }
    },
    []
  )

  const handleCanvasPointerUpGlobal = useCallback(() => {
    isPanning.current = false
    setDragging(null)
    setDraggingCp(null)
    draggingCpRef.current = null
  }, [])

  // Keyboard
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Delete" || e.key === "Backspace") {
        if (selectedPoint && document.activeElement?.tagName !== "INPUT") {
          deletePoint(selectedPoint)
        }
      }
      if (e.key === "Escape") {
        setSelectedPoint(null)
        setPendingAnnotationStart(null)
      }
    }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [selectedPoint, deletePoint])

  // ─── Formula helpers ──────────────────────────────────────────────────

  const insertMeasurementIntoFormula = useCallback(
    (key: string) => {
      if (!selectedPoint) return
      if (!activeFormulaField) return
      const currentFormula = activeFormulaField === "x" ? selectedPointData?.formulaX : selectedPointData?.formulaY
      const newVal = (currentFormula || "") + `{${key}}`
      updatePointFormula(selectedPoint, activeFormulaField, newVal)
    },
    [selectedPoint, selectedPointData, activeFormulaField, updatePointFormula]
  )

  const setPointFixed = useCallback(() => {
    if (!selectedPoint) return
    updatePointFormula(selectedPoint, "x", null)
    updatePointFormula(selectedPoint, "y", null)
    setActiveFormulaField(null)
  }, [selectedPoint, updatePointFormula])

  // ─── Export ────────────────────────────────────────────────────────────

  const buildExportData = useCallback((): ExportData => {
    return {
      garmentId: "my-garment",
      name: "数字化裁片",
      sizeLabel: selectedSize,
      measurements: MEASUREMENT_DEFS.map((m) => m.key),
      parts: pieces.map((piece) => ({
        name: piece.name,
        points: piece.points.map((p) => ({
          x: p.formulaX || p.x,
          y: p.formulaY || p.y,
          type: p.formulaX ? "formula" : "fixed",
          ...(p.cp1x !== undefined ? { cp1x: p.cp1x, cp1y: p.cp1y } : {}),
          ...(p.cp2x !== undefined ? { cp2x: p.cp2x, cp2y: p.cp2y } : {}),
        })),
        interiorLines: [],
        foldLines: [],
        annotations: piece.annotations.map((ann) => {
          const from = piece.points.findIndex((p) => p.id === ann.fromPointId)
          const to = piece.points.findIndex((p) => p.id === ann.toPointId)
          return { from, to, label: ann.label }
        }),
      })),
    }
  }, [pieces])

  const handleExportJSON = useCallback(() => {
    const data = buildExportData()
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "pattern-digitized.json"
    a.click()
    URL.revokeObjectURL(url)
  }, [buildExportData])

  const handleCopyFormulas = useCallback(() => {
    const data = buildExportData()
    const text = JSON.stringify(data, null, 2)
    navigator.clipboard.writeText(text)
  }, [buildExportData])

  const handleImportJSON = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target?.result as string) as ExportData
        if (data.sizeLabel) setSelectedSize(data.sizeLabel)
        const newPieces: PatternPiece[] = data.parts.map((part) => {
          const points: Point[] = part.points.map((p) => ({
            id: genId(),
            x: typeof p.x === "number" ? p.x : 0,
            y: typeof p.y === "number" ? p.y : 0,
            formulaX: typeof p.x === "string" ? p.x : null,
            formulaY: typeof p.y === "string" ? p.y : null,
            cp1x: p.cp1x, cp1y: p.cp1y,
            cp2x: p.cp2x, cp2y: p.cp2y,
          }))
          const annotations: Annotation[] = (part.annotations || []).map((ann) => ({
            id: `ann_${Math.random().toString(36).slice(2, 8)}`,
            fromPointId: points[ann.from]?.id || "",
            toPointId: points[ann.to]?.id || "",
            label: ann.label,
            offset: 15,
          })).filter((a) => a.fromPointId && a.toPointId)
          return { id: pieceId(), name: part.name, points, annotations }
        })
        setPieces(newPieces)
        setActivePieceIdx(0)
        setSelectedPoint(null)
        setPendingAnnotationStart(null)
        setAnnotationMode(false)
        setImportKey(k => k + 1)
      } catch {
        alert("导入失败：JSON 格式不正确")
      }
    }
    reader.readAsText(file)
    e.target.value = ""
  }, [])

  // ─── Rendering helpers ─────────────────────────────────────────────────

  function renderGrid() {
    const gridLines: React.ReactNode[] = []
    const spaced = GRID_SIZE
    const w = Math.max(imageSize.w, 800)
    const h = Math.max(imageSize.h, 600)

    for (let x = 0; x <= w; x += spaced) {
      gridLines.push(
        <line
          key={`gv${x}`}
          x1={x}
          y1={0}
          x2={x}
          y2={h}
          stroke="#d4d4d0"
          strokeWidth={0.5}
          strokeDasharray="2 2"
        />
      )
    }
    for (let y = 0; y <= h; y += spaced) {
      gridLines.push(
        <line
          key={`gh${y}`}
          x1={0}
          y1={y}
          x2={w}
          y2={y}
          stroke="#d4d4d0"
          strokeWidth={0.5}
          strokeDasharray="2 2"
        />
      )
    }
    return gridLines
  }

  const selectedIdx = selectedPoint ? computedPoints.findIndex((p) => p.id === selectedPoint) : -1

  // Curve path builder
  function buildPathData(pts: typeof computedPoints): string | null {
    if (pts.length < 2) return null
    let d = `M ${pts[0].computedX},${pts[0].computedY}`
    for (let i = 1; i < pts.length; i++) {
      const prev = pts[i - 1]
      const curr = pts[i]
      const hasCurve = curveMode && prev.cp1x !== undefined && curr.cp2x !== undefined
      if (hasCurve) {
        d += ` C ${prev.cp1x},${prev.cp1y} ${curr.cp2x},${curr.cp2y} ${curr.computedX},${curr.computedY}`
      } else {
        d += ` L ${curr.computedX},${curr.computedY}`
      }
    }
    // Close path (last to first)
    if (pts.length >= 3) {
      const last = pts[pts.length - 1]
      const first = pts[0]
      const hasCurve = curveMode && last.cp1x !== undefined && first.cp2x !== undefined
      if (hasCurve) {
        d += ` C ${last.cp1x},${last.cp1y} ${first.cp2x},${first.cp2y} ${first.computedX},${first.computedY}`
      } else {
        d += ` L ${first.computedX},${first.computedY}`
      }
    }
    return d
  }

  // ─── JSX ───────────────────────────────────────────────────────────────

  return (
    <div className="flex h-[calc(100vh-3.5rem)] overflow-hidden">
      {/* ── Left Panel ────────────────────────────────────────────────── */}
      <aside className="flex w-[300px] shrink-0 flex-col overflow-y-auto border-r border-border bg-card">
        <div className="space-y-4 p-3">
          {/* Image Loader */}
          <section>
            <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
              加载图片
            </h3>
            <div className="flex gap-1.5">
              <Input
                placeholder="图片 URL…"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && loadImageUrl()}
                className="h-8 text-xs"
              />
              <Button size="xs" onClick={loadImageUrl}>
                加载
              </Button>
            </div>
            <label className="mt-1.5 flex cursor-pointer items-center gap-1.5 rounded-lg border border-dashed border-border px-2.5 py-2 text-xs text-muted-foreground transition-colors hover:bg-muted">
              <Upload className="size-3.5" />
              上传图片
              <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
            </label>
          </section>

          {/* Auto-Trace & Curve Tools */}
          <section className="space-y-2 rounded-lg border border-border bg-muted/30 p-2.5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              智能工具
            </h3>
            {/* Curve mode toggle */}
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-muted-foreground">描边模式</span>
              <div className="flex gap-0.5 rounded-md bg-muted p-0.5">
                <button
                  type="button"
                  onClick={() => setCurveMode(false)}
                  className={`rounded px-2.5 py-0.5 text-[11px] font-medium transition-all ${
                    !curveMode ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  直线
                </button>
                <button
                  type="button"
                  onClick={() => setCurveMode(true)}
                  className={`rounded px-2.5 py-0.5 text-[11px] font-medium transition-all ${
                    curveMode ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  曲线
                </button>
              </div>
            </div>
            {/* Show control points */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="showCp"
                checked={showControlPoints}
                onChange={(e) => setShowControlPoints(e.target.checked)}
                className="size-3.5 accent-violet-600"
              />
              <label htmlFor="showCp" className="text-[11px] text-muted-foreground select-none">
                显示控制点
              </label>
            </div>
            {/* Annotation mode toggle */}
            <div className="flex items-center justify-between border-t border-border/40 pt-2">
              <span className="text-[11px] text-muted-foreground">交互模式</span>
              <div className="flex gap-0.5 rounded-md bg-muted p-0.5">
                <button
                  type="button"
                  onClick={() => { setAnnotationMode(false); setPendingAnnotationStart(null) }}
                  className={`rounded px-2.5 py-0.5 text-[11px] font-medium transition-all ${
                    !annotationMode ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  描点
                </button>
                <button
                  type="button"
                  onClick={() => setAnnotationMode(true)}
                  className={`rounded px-2.5 py-0.5 text-[11px] font-medium transition-all ${
                    annotationMode ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  标注
                </button>
              </div>
            </div>
            {/* Auto-trace */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between gap-2">
                <Button
                  size="sm"
                  variant="secondary"
                  className="flex-1 h-7 text-[11px]"
                  disabled={!imageUrl || isAutoTracing}
                  onClick={handleAutoTrace}
                >
                  <Wand2 className="mr-1 size-3" />
                  {isAutoTracing ? "识别中..." : "自动识别"}
                </Button>
                {prevPointsBeforeTrace && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-7 text-[11px]"
                    onClick={undoAutoTrace}
                  >
                    撤销
                  </Button>
                )}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-muted-foreground w-8 shrink-0">
                  {autoTraceThreshold}
                </span>
                <input
                  type="range"
                  min={50}
                  max={200}
                  value={autoTraceThreshold}
                  onChange={(e) => setAutoTraceThreshold(Number(e.target.value))}
                  className="flex-1 h-1 accent-violet-600"
                />
                <span className="text-[10px] text-muted-foreground">阈值</span>
              </div>
              <p className="text-[9px] text-muted-foreground/60 leading-relaxed">
                将黑白图的轮廓自动识别为顶点
              </p>
            </div>
          </section>

          {/* Size Selector */}
          <section>
            <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
              标准尺码
            </h3>
            <select
              value={selectedSize}
              onChange={(e) => {
                setSelectedSize(e.target.value)
                const data = SIZE_DATA[e.target.value]
                if (data) {
                  setTestMeas((prev) => ({ ...prev, ...data } as Record<string, number>))
                }
              }}
              className="w-full rounded-lg border border-input bg-background px-2 py-1.5 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {SIZE_OPTIONS.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            <p className="mt-1 text-[10px] text-muted-foreground">
              选择尺码自动填充对应身材数据
            </p>
          </section>

          {/* Point List */}
          <section>
            <div className="mb-2 flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                顶点列表
              </h3>
              <Badge variant="outline" className="text-[10px]">
                {computedPoints.length} 点
              </Badge>
            </div>
            {computedPoints.length === 0 ? (
              <p className="text-[11px] text-muted-foreground/60 italic">
                点击右侧画布添加顶点
              </p>
            ) : (
              <div className="max-h-[200px] overflow-y-auto rounded-lg border border-border">
                <table className="w-full text-[11px]">
                  <thead className="bg-muted/50 text-left text-[10px] text-muted-foreground">
                    <tr>
                      <th className="w-6 px-1.5 py-1">#</th>
                      <th className="px-1.5 py-1">X</th>
                      <th className="px-1.5 py-1">Y</th>
                      <th className="px-1.5 py-1">类型</th>
                      <th className="w-6 px-1.5 py-1" />
                    </tr>
                  </thead>
                  <tbody>
                    {computedPoints.map((p, i) => (
                      <tr
                        key={p.id}
                        className={`border-t border-border/50 transition-colors ${
                          selectedPoint === p.id ? "bg-amber-50 dark:bg-amber-900/20" : ""
                        } cursor-pointer hover:bg-muted/50`}
                        onClick={() => setSelectedPoint(p.id)}
                      >
                        <td className="px-1.5 py-1 font-mono text-muted-foreground">{i + 1}</td>
                        <td className="max-w-[60px] truncate px-1.5 py-1 font-mono">
                          {p.formulaX ? (
                            <span className="text-blue-600 dark:text-blue-400">{p.formulaX}</span>
                          ) : (
                            p.computedX
                          )}
                        </td>
                        <td className="max-w-[60px] truncate px-1.5 py-1 font-mono">
                          {p.formulaY ? (
                            <span className="text-blue-600 dark:text-blue-400">{p.formulaY}</span>
                          ) : (
                            p.computedY
                          )}
                        </td>
                        <td className="px-1.5 py-1">
                          {p.formulaX ? (
                            <Badge variant="outline" className="text-[9px]">
                              公式
                            </Badge>
                          ) : (
                            <Badge variant="secondary" className="text-[9px]">
                              固定
                            </Badge>
                          )}
                        </td>
                        <td className="px-1.5 py-1">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation()
                              deletePoint(p.id)
                            }}
                            className="text-muted-foreground hover:text-destructive"
                          >
                            <Trash2 className="size-3" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          {/* Annotation list */}
          {(activePiece.annotations || []).length > 0 && (
          <section key={`annlist-${activePiece.id}-${importKey}`}>
              <div className="mb-2 flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  标注
                </h3>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => {
                      setPieces((prev) => {
                        const updated = [...prev]
                        updated[activePieceIdx] = { ...updated[activePieceIdx], annotations: [] }
                        return updated
                      })
                    }}
                    className="text-[10px] text-muted-foreground hover:text-destructive transition-colors"
                  >
                    清除全部
                  </button>
                  <Badge variant="outline" className="text-[10px]">
                    {(activePiece.annotations || []).length}
                  </Badge>
                </div>
              </div>
              <div className="space-y-1">
                {(activePiece.annotations || []).map((ann) => {
                  const fromIdx = computedPoints.findIndex((p) => p.id === ann.fromPointId)
                  const toIdx = computedPoints.findIndex((p) => p.id === ann.toPointId)
                  return (
                    <div
                      key={ann.id}
                      className="flex items-center gap-1.5 rounded-md border border-border/60 bg-muted/20 px-2 py-1.5"
                    >
                      <span className="shrink-0 text-[10px] font-mono text-muted-foreground">
                        #{fromIdx + 1}→#{toIdx + 1}
                      </span>
                      <input
                        className="h-6 flex-1 rounded border border-border/60 bg-background px-1.5 text-[11px] font-mono outline-none focus:border-rose-400"
                        value={ann.label}
                        onChange={(e) => updateAnnotationLabel(ann.id, e.target.value)}
                      />
                      <button
                        type="button"
                        onClick={() => deleteAnnotation(ann.id)}
                        className="shrink-0 text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="size-3" />
                      </button>
                    </div>
                  )
                })}
              </div>
            </section>
          )}

          {/* Selected point editor */}
          {selectedPointData && (
            <section className="rounded-lg border border-amber-200 bg-amber-50/50 p-2.5 dark:border-amber-800/30 dark:bg-amber-900/10">
              <div className="mb-1.5 flex items-center justify-between">
                <h4 className="text-[11px] font-bold text-amber-800 dark:text-amber-300">
                  点 #
                  {computedPoints.findIndex((p) => p.id === selectedPointData.id) + 1}
                </h4>
                <div className="flex gap-1">
                  <button
                    type="button"
                    onClick={setPointFixed}
                    className="rounded px-1.5 py-0.5 text-[10px] text-muted-foreground hover:bg-amber-100 dark:hover:bg-amber-800/30"
                  >
                    固定
                  </button>
                  <button
                    type="button"
                    onClick={() => deletePoint(selectedPointData.id)}
                    className="rounded px-1.5 py-0.5 text-[10px] text-destructive hover:bg-amber-100 dark:hover:bg-amber-800/30"
                  >
                    删除
                  </button>
                </div>
              </div>

              {/* Formula X */}
              <div className="mb-1.5">
                <label className="mb-0.5 block text-[10px] text-muted-foreground">
                  X 公式
                </label>
                <div className="flex gap-1">
                  <Input
                    className="h-7 flex-1 text-xs font-mono"
                    placeholder={String(selectedPointData.x)}
                    value={
                      editingFormulaAxis === "x" && selectedPoint === selectedPointData.id
                        ? formulaInput
                        : selectedPointData.formulaX || ""
                    }
                    onFocus={() => {
                      setEditingFormulaAxis("x")
                      setActiveFormulaField("x")
                      setFormulaInput(selectedPointData.formulaX || "")
                    }}
                    onChange={(e) => {
                      setFormulaInput(e.target.value)
                      updatePointFormula(selectedPointData.id, "x", e.target.value || null)
                    }}
                  />
                </div>
              </div>

              {/* Formula Y */}
              <div>
                <label className="mb-0.5 block text-[10px] text-muted-foreground">
                  Y 公式
                </label>
                <div className="flex gap-1">
                  <Input
                    className="h-7 flex-1 text-xs font-mono"
                    placeholder={String(selectedPointData.y)}
                    value={
                      editingFormulaAxis === "y" && selectedPoint === selectedPointData.id
                        ? formulaInput
                        : selectedPointData.formulaY || ""
                    }
                    onFocus={() => {
                      setEditingFormulaAxis("y")
                      setActiveFormulaField("y")
                      setFormulaInput(selectedPointData.formulaY || "")
                    }}
                    onChange={(e) => {
                      setFormulaInput(e.target.value)
                      updatePointFormula(selectedPointData.id, "y", e.target.value || null)
                    }}
                  />
                </div>
              </div>

              <div className="mt-1.5 text-[10px] text-muted-foreground">
                当前值: ({Math.round(computedPoints.find((p) => p.id === selectedPointData.id)?.computedX || 0)},{" "}
                {Math.round(computedPoints.find((p) => p.id === selectedPointData.id)?.computedY || 0)})
              </div>
            </section>
          )}

          {/* Stick to standard sizes for clarity — no per-measurement inputs needed */}

          {/* Export */}
          <section>
            <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
              导出
            </h3>
            <div className="flex gap-1.5">
              <Button size="sm" className="flex-1" onClick={handleExportJSON}>
                <Download className="mr-1 size-3.5" />
                导出 JSON
              </Button>
              <label className="inline-flex shrink-0 items-center justify-center rounded-lg border border-border bg-background px-2.5 text-xs font-medium h-7 gap-1 cursor-pointer hover:bg-muted transition-colors">
                <FileUp className="size-3.5" />
                导入 JSON
                <input type="file" accept=".json" onChange={handleImportJSON} className="hidden" />
              </label>
            </div>
            <div className="flex gap-1.5 mt-1.5">
              <Button size="sm" variant="outline" className="flex-1" onClick={handleCopyFormulas}>
                <Copy className="mr-1 size-3.5" />
                复制代码
              </Button>
            </div>
          </section>

          {/* Piece management */}
          <section>
            <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
              裁片
            </h3>
            <div className="flex gap-1.5">
              <select
                className="h-7 flex-1 rounded-lg border border-border bg-background px-2 text-xs outline-none focus:border-ring focus:ring-3 focus:ring-ring/50"
                value={activePieceIdx}
                onChange={(e) => selectPiece(Number(e.target.value))}
              >
                {pieces.map((p, i) => (
                  <option key={p.id} value={i}>
                    {p.name} ({p.points.length} 点)
                  </option>
                ))}
              </select>
              <Input
                placeholder="裁片名称"
                className="h-7 w-24 text-xs"
                value={pieceNameInput}
                onChange={(e) => setPieceNameInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addPiece()}
              />
              <Button size="icon-xs" onClick={addPiece}>
                <Plus className="size-3" />
              </Button>
            </div>
          </section>
        </div>
      </aside>

      {/* ── Canvas ──────────────────────────────────────────────────────── */}
      <main className="flex flex-1 flex-col overflow-hidden bg-[#f5f5f0]">
        {/* Toolbar */}
        <div className="flex items-center gap-2 border-b border-border/50 bg-white/50 px-3 py-1.5 text-[11px] text-muted-foreground backdrop-blur-sm dark:bg-black/20">
          <Crosshair className="size-3.5" />
          <span>
            {annotationMode ? (
              <span className="text-rose-600 dark:text-rose-400 font-semibold">
                标注模式 · {pendingAnnotationStart ? "点击第二个顶点完成标注" : "点击第一个顶点"}
              </span>
            ) : (
              <>
                点击添加顶点 · Shift+点击插入到边 · 滚轮缩放 · 中键平移
                {curveMode && <span className="ml-2 text-violet-600 dark:text-violet-400 font-semibold">· 曲线模式</span>}
              </>
            )}
          </span>
          <span className="ml-auto font-mono">
            {Math.round(zoom * 100)}% · {imageSize.w}×{imageSize.h}
          </span>
        </div>

        {/* Canvas area */}
        <div
          ref={canvasRef}
          className="relative flex-1 overflow-hidden"
          onClick={handleCanvasClick}
          onPointerMove={handleCanvasPointerMove}
          onPointerUp={handleCanvasPointerUpGlobal}
          onPointerDown={handleCanvasPointerDown}
          onWheel={handleWheel}
          style={{ cursor: dragging ? "grabbing" : isPanning.current ? "grabbing" : "crosshair" }}
        >
          <div
            className="absolute origin-top-left"
            style={{
              transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            }}
          >
            {imageUrl && (
              <div className="relative inline-block">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  ref={imageRef}
                  src={imageUrl}
                  alt="Reference"
                  onLoad={handleImageLoad}
                  onError={() => setImageLoaded(false)}
                  className="max-w-none"
                  draggable={false}
                />

                <svg
                  key={`${activePiece.id}-${importKey}`}
                  className="pointer-events-none absolute inset-0"
                  width={imageSize.w}
                  height={imageSize.h}
                >
                  {/* Grid */}
                  {imageLoaded && renderGrid()}

                  {/* Outline path (handles both straight and curved segments) */}
                  {computedPoints.length >= 2 && (() => {
                    const pathD = buildPathData(computedPoints)
                    if (!pathD) return null
                    return (
                      <>
                        {/* Fill */}
                        {computedPoints.length >= 3 && (
                          <path d={pathD} fill="rgba(37, 99, 235, 0.08)" stroke="none" />
                        )}
                        {/* Stroke */}
                        <path
                          d={pathD}
                          fill="none"
                          stroke="#2563eb"
                          strokeWidth={1.5 / zoom}
                          strokeOpacity={0.6}
                          strokeLinejoin="round"
                        />
                      </>
                    )
                  })()}

                  {/* Point markers */}
                  {computedPoints.map((p, i) => {
                    const isSelected = selectedPoint === p.id
                    const radius = Math.max(5, 10 / zoom)
                    const fontSize = Math.max(8, 12 / zoom)
                    return (
                      <g
                        key={p.id}
                        className="pointer-events-auto cursor-grab active:cursor-grabbing"
                        onPointerDown={(e) => handlePointPointerDown(e, p.id)}
                      >
                        {/* Hit area */}
                        <circle
                          cx={p.computedX}
                          cy={p.computedY}
                          r={Math.max(10, 18 / zoom)}
                          fill="transparent"
                        />
                        {/* Visual circle */}
                        <circle
                          cx={p.computedX}
                          cy={p.computedY}
                          r={radius}
                          fill={isSelected ? "#f59e0b" : (pendingAnnotationStart === p.id ? "#22c55e" : "#dc2626")}
                          stroke={isSelected ? "#d97706" : (pendingAnnotationStart === p.id ? "#16a34a" : "#fff")}
                          strokeWidth={Math.max(1, 2 / zoom)}
                        />
                        {/* Pending annotation glow */}
                        {pendingAnnotationStart === p.id && (
                          <circle
                            cx={p.computedX}
                            cy={p.computedY}
                            r={Math.max(12, 24 / zoom)}
                            fill="none"
                            stroke="#22c55e"
                            strokeWidth={Math.max(1.5, 3 / zoom)}
                            strokeDasharray={`${6 / zoom} ${3 / zoom}`}
                          >
                            <animate attributeName="r" from={Math.max(8, 16 / zoom)} to={Math.max(16, 32 / zoom)} dur="0.8s" repeatCount="indefinite"/>
                            <animate attributeName="opacity" from="0.8" to="0.1" dur="0.8s" repeatCount="indefinite"/>
                          </circle>
                        )}
                        {/* Number */}
                        <text
                          x={p.computedX}
                          y={p.computedY}
                          textAnchor="middle"
                          dominantBaseline="central"
                          fill="#fff"
                          fontSize={fontSize}
                          fontWeight="bold"
                          fontFamily="monospace"
                          style={{ pointerEvents: "none" }}
                        >
                          {i + 1}
                        </text>
                      </g>
                    )
                  })}

                  {/* Dimension annotations */}
                  {(activePiece.annotations || []).map((ann) => {
                    const ap1 = computedPoints.find((p) => p.id === ann.fromPointId)
                    const ap2 = computedPoints.find((p) => p.id === ann.toPointId)
                    if (!ap1 || !ap2) return null
                    const x1 = ap1.computedX, y1 = ap1.computedY
                    const x2 = ap2.computedX, y2 = ap2.computedY
                    const adx = x2 - x1, ady = y2 - y1
                    const alen = Math.hypot(adx, ady)
                    if (alen < 0.1) return null
                    const anx = -ady / alen, any = adx / alen
                    const tickLen = Math.max(4, 8 / zoom)
                    const adjOffset = Math.max(10, ann.offset / zoom)
                    const amidX = (x1 + x2) / 2, amidY = (y1 + y2) / 2
                    const atx = amidX + anx * adjOffset, aty = amidY + any * adjOffset
                    let aAngle = Math.atan2(ady, adx) * (180 / Math.PI)
                    if (aAngle > 90 || aAngle < -90) aAngle += 180
                    return (
                      <g key={ann.id}>
                        {/* Dimension line */}
                        <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#C00" strokeWidth={0.5 / zoom} />
                        {/* Start tick */}
                        <line x1={x1 - anx * tickLen} y1={y1 - any * tickLen} x2={x1 + anx * tickLen} y2={y1 + any * tickLen} stroke="#C00" strokeWidth={0.5 / zoom} />
                        {/* End tick */}
                        <line x1={x2 - anx * tickLen} y1={y2 - any * tickLen} x2={x2 + anx * tickLen} y2={y2 + any * tickLen} stroke="#C00" strokeWidth={0.5 / zoom} />
                        {/* Label */}
                        <text
                          x={atx}
                          y={aty}
                          fill="#C00"
                          fontSize={Math.max(6, 10 / zoom)}
                          fontFamily="monospace"
                          textAnchor="middle"
                          dominantBaseline="middle"
                          transform={`rotate(${aAngle}, ${atx}, ${aty})`}
                        >
                          {ann.label}
                        </text>
                      </g>
                    )
                  })}

                  {/* Control point handles */}
                  {curveMode && computedPoints.map((p) => {
                    const isSelected = selectedPoint === p.id
                    if (!showControlPoints && !isSelected) return null
                    if (p.cp1x === undefined && p.cp2x === undefined) return null
                    const cpR = Math.max(4, 7 / zoom)
                    return (
                      <g key={`cp-${p.id}`}>
                        {/* Dashed lines from main point to control points */}
                        {p.cp1x !== undefined && (
                          <line
                            x1={p.computedX} y1={p.computedY}
                            x2={p.cp1x} y2={p.cp1y}
                            stroke="#8b5cf6"
                            strokeWidth={1 / zoom}
                            strokeDasharray={`${3 / zoom} ${2 / zoom}`}
                          />
                        )}
                        {p.cp2x !== undefined && (
                          <line
                            x1={p.computedX} y1={p.computedY}
                            x2={p.cp2x} y2={p.cp2y}
                            stroke="#8b5cf6"
                            strokeWidth={1 / zoom}
                            strokeDasharray={`${3 / zoom} ${2 / zoom}`}
                          />
                        )}
                        {/* CP1 handle */}
                        {p.cp1x !== undefined && (
                          <g
                            className="pointer-events-auto cursor-grab active:cursor-grabbing"
                            onPointerDown={(e) => handleCpPointerDown(e, p.id, "cp1")}
                          >
                            <circle cx={p.cp1x} cy={p.cp1y} r={Math.max(8, 14 / zoom)} fill="transparent" />
                            <circle cx={p.cp1x} cy={p.cp1y} r={cpR} fill="#8b5cf6" stroke="#fff" strokeWidth={Math.max(0.5, 1.5 / zoom)} />
                          </g>
                        )}
                        {/* CP2 handle */}
                        {p.cp2x !== undefined && (
                          <g
                            className="pointer-events-auto cursor-grab active:cursor-grabbing"
                            onPointerDown={(e) => handleCpPointerDown(e, p.id, "cp2")}
                          >
                            <circle cx={p.cp2x} cy={p.cp2y} r={Math.max(8, 14 / zoom)} fill="transparent" />
                            <circle cx={p.cp2x} cy={p.cp2y} r={cpR} fill="#8b5cf6" stroke="#fff" strokeWidth={Math.max(0.5, 1.5 / zoom)} />
                          </g>
                        )}
                      </g>
                    )
                  })}
                </svg>

                {/* Empty state */}
                {!imageLoaded && imageUrl && (
                  <div className="absolute inset-0 flex items-center justify-center bg-[#f5f5f0]/80">
                    <p className="text-sm text-muted-foreground">加载图片中…</p>
                  </div>
                )}
              </div>
            )}

            {/* No image */}
            {!imageUrl && (
              <div className="flex h-[calc(100vh-8rem)] w-[calc(100vw-320px)] items-center justify-center">
                <div className="text-center">
                  <Upload className="mx-auto mb-3 size-8 text-muted-foreground/40" />
                  <p className="text-sm text-muted-foreground/60">
                    从左侧面板上传参考图片
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground/40">
                    支持 URL 或本地图片文件
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
