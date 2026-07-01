/**
 * Import Pattern SVG Generator
 *
 * Takes digitizer-exported JSON (or compatible format) and measurements,
 * evaluates all formula points, and generates a styled SVG layout
 * matching the built-in pattern generator's appearance.
 *
 * Supports both:
 *   - The digitizer's native export format (x: number|string, type: "fixed"|"formula")
 *   - A verbose format with explicit formulaX/formulaY fields
 */

// ─── Types ──────────────────────────────────────────────────────────────────

export interface ImportPoint {
  /** If number → fixed coordinate. If string → formula like "{bust}/4+20" */
  x: number | string
  y: number | string
  type?: "fixed" | "formula"
  cp1x?: number
  cp1y?: number
  cp2x?: number
  cp2y?: number
}

export interface ImportPart {
  name: string
  points: ImportPoint[]
  interiorLines?: number[][]
  foldLines?: number[][]
  annotations?: { from: number; to: number; label: string }[]
}

export interface ImportData {
  garmentId: string
  name: string
  /** List of measurement keys this pattern uses */
  measurements: string[]
  parts: ImportPart[]
}

// ─── Computed point (after evaluation) ──────────────────────────────────────

interface ComputedPoint {
  cx: number
  cy: number
  cp1x?: number
  cp1y?: number
  cp2x?: number
  cp2y?: number
}

// ─── Formula evaluator ──────────────────────────────────────────────────────

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

function getPointValue(
  point: ImportPoint,
  measurements: Record<string, number>,
  axis: "x" | "y",
): number {
  const val = axis === "x" ? point.x : point.y
  if (typeof val === "string") {
    return evaluateFormula(val, measurements)
  }
  return val
}

// ─── Compute all points ─────────────────────────────────────────────────────

function computePart(
  part: ImportPart,
  measurements: Record<string, number>,
): ComputedPoint[] {
  return part.points.map((p) => ({
    cx: getPointValue(p, measurements, "x"),
    cy: getPointValue(p, measurements, "y"),
    cp1x: p.cp1x,
    cp1y: p.cp1y,
    cp2x: p.cp2x,
    cp2y: p.cp2y,
  }))
}

// ─── SVG building ───────────────────────────────────────────────────────────

const SEAM = 10
const GAP = 50
const MARGIN = 40

function buildPath(pts: ComputedPoint[], close = true): string {
  if (pts.length < 2) return ""
  let d = `M ${pts[0].cx},${pts[0].cy}`
  for (let i = 1; i < pts.length; i++) {
    const prev = pts[i - 1]
    const curr = pts[i]
    const hasCurve =
      prev.cp1x !== undefined &&
      prev.cp1y !== undefined &&
      curr.cp2x !== undefined &&
      curr.cp2y !== undefined
    if (hasCurve) {
      d += ` C ${prev.cp1x},${prev.cp1y} ${curr.cp2x},${curr.cp2y} ${curr.cx},${curr.cy}`
    } else {
      d += ` L ${curr.cx},${curr.cy}`
    }
  }
  if (close && pts.length >= 3) {
    const last = pts[pts.length - 1]
    const first = pts[0]
    const hasCurve =
      last.cp1x !== undefined &&
      last.cp1y !== undefined &&
      first.cp2x !== undefined &&
      first.cp2y !== undefined
    if (hasCurve) {
      d += ` C ${last.cp1x},${last.cp1y} ${first.cp2x},${first.cp2y} ${first.cx},${first.cy}`
    } else {
      d += " Z"
    }
  }
  return d
}

function spath(pts: ComputedPoint[], sw: number, dash?: string): string {
  if (pts.length < 2) return ""
  const d = buildPath(pts, true)
  return `<path d="${d}" fill="none" stroke="#222" stroke-width="${sw}" stroke-linejoin="round"${dash ? ` stroke-dasharray="${dash}"` : ""}/>`
}

interface BBox {
  minX: number
  minY: number
  maxX: number
  maxY: number
  width: number
  height: number
}

function computeBBox(pts: ComputedPoint[]): BBox {
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity
  for (const p of pts) {
    if (p.cx < minX) minX = p.cx
    if (p.cy < minY) minY = p.cy
    if (p.cx > maxX) maxX = p.cx
    if (p.cy > maxY) maxY = p.cy
    // Also consider control points for bounding box
    if (p.cp1x !== undefined && p.cp1x < minX) minX = p.cp1x
    if (p.cp1y !== undefined && p.cp1y < minY) minY = p.cp1y
    if (p.cp1x !== undefined && p.cp1x > maxX) maxX = p.cp1x
    if (p.cp1y !== undefined && p.cp1y > maxY) maxY = p.cp1y
    if (p.cp2x !== undefined && p.cp2x < minX) minX = p.cp2x
    if (p.cp2y !== undefined && p.cp2y < minY) minY = p.cp2y
    if (p.cp2x !== undefined && p.cp2x > maxX) maxX = p.cp2x
    if (p.cp2y !== undefined && p.cp2y > maxY) maxY = p.cp2y
  }
  // Clip negative values to 0 for layout
  const offX = Math.max(0, -minX)
  const offY = Math.max(0, -minY)
  return {
    minX: minX + offX,
    minY: minY + offY,
    maxX: maxX + offX,
    maxY: maxY + offY,
    width: maxX - minX,
    height: maxY - minY,
  }
}

// ─── Main export ────────────────────────────────────────────────────────────

export interface ImportPatternResult {
  svg: string
  width: number
  height: number
  partCount: number
}

/**
 * Generate an SVG pattern from imported digitizer data and measurements.
 *
 * @param data     - The parsed import data (from digitizer export JSON)
 * @param measurements - Body measurements in mm
 * @returns SVG string and metadata
 */
export function generateImportSvg(
  data: ImportData,
  measurements: Record<string, number>,
): ImportPatternResult {
  if (!data.parts || data.parts.length === 0) {
    throw new Error("导入数据不包含任何裁片")
  }

  // Compute all part points
  const computedParts = data.parts.map((part) => {
    const pts = computePart(part, measurements)
    const bbox = computeBBox(pts)
    return { part, pts, bbox }
  })

  // Layout: arrange parts side-by-side in rows
  interface LayoutItem {
    partIdx: number
    x: number
    y: number
  }

  const items: LayoutItem[] = []
  let cx = MARGIN
  let cy = MARGIN
  let rowMaxH = 0
  const rowWidth = 800 // max row width before wrapping

  for (let i = 0; i < computedParts.length; i++) {
    const { bbox } = computedParts[i]
    const w = bbox.width + SEAM * 2
    const h = bbox.height + SEAM * 2

    if (cx + w > rowWidth + MARGIN && items.length > 0) {
      // Wrap to next row
      cx = MARGIN
      cy += rowMaxH + 40
      rowMaxH = 0
    }

    items.push({ partIdx: i, x: cx, y: cy })
    cx += w + GAP
    rowMaxH = Math.max(rowMaxH, h)
  }

  const totalH = cy + rowMaxH + MARGIN
  const totalW = Math.max(rowWidth + MARGIN, cx - GAP + MARGIN)

  // Build SVG
  let svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${totalW} ${totalH}" style="background:#fff;font-family:sans-serif;">`
  svg += `<defs><marker id="a" markerWidth="5" markerHeight="4" refX="5" refY="2" orient="auto"><polygon points="0,0 5,2 0,4" fill="#C00"/></marker></defs>`

  // Grid background
  svg += `<g stroke="#eee" stroke-width="0.3">`
  for (let x = 0; x <= totalW; x += 20) {
    svg += `<line x1="${x}" y1="0" x2="${x}" y2="${totalH}"/>`
  }
  for (let y = 0; y <= totalH; y += 20) {
    svg += `<line x1="0" y1="${y}" x2="${totalW}" y2="${y}"/>`
  }
  svg += `</g>`

  // Render each part
  for (const item of items) {
    const { part, pts, bbox } = computedParts[item.partIdx]
    const ox = item.x - bbox.minX + SEAM
    const oy = item.y - bbox.minY + SEAM

    svg += `<g transform="translate(${ox},${oy})">`

    // Background rect
    svg += `<rect x="${bbox.minX - SEAM}" y="${bbox.minY - SEAM}" width="${bbox.width + SEAM * 2}" height="${bbox.height + SEAM * 2}" fill="#FFFAF5" rx="2"/>`

    // Outline path
    if (pts.length >= 2) {
      const fillPath = buildPath(pts, true)
      if (pts.length >= 3) {
        svg += `<path d="${fillPath}" fill="rgba(37, 99, 235, 0.04)" stroke="none"/>`
      }
      svg += spath(pts, 0.6)
    }

    // Grainline (center vertical-ish)
    const gx = bbox.minX + bbox.width * 0.3
    const gy = bbox.minY + bbox.height * 0.3
    svg += `<line x1="${gx - 18}" y1="${gy}" x2="${gx + 30}" y2="${gy}" stroke="#666" stroke-width="0.3" marker-end="url(#a)"/>`

    // Part name
    const labelX = bbox.minX + bbox.width / 2
    const labelY = bbox.minY + bbox.height / 2
    svg += `<text x="${labelX}" y="${labelY}" text-anchor="middle" font-size="13" fill="#333" font-weight="bold">${part.name}</text>`

    // DEBUG: show measurements used
    const measKeys = Object.keys(measurements).slice(0, 4)
    svg += `<text x="${labelX}" y="${labelY + 16}" text-anchor="middle" font-size="8" fill="#999">${measKeys.map(k => `${k}:${measurements[k]}`).join(' ')}</text>`

    // Annotation lines (dimension labels)
    const anns = part.annotations || []
    for (const ann of anns) {
      if (ann.from >= pts.length || ann.to >= pts.length) continue
      const pA = pts[ann.from], pB = pts[ann.to]
      const ax = pA.cx, ay = pA.cy
      const bx = pB.cx, by = pB.cy
      const dx = bx - ax, dy = by - ay
      const len = Math.hypot(dx, dy)
      if (len < 0.1) continue
      const labelName = ann.label.replace(/\d+/g, '').replace(/[pxmm]/gi, '').trim() || ann.label
      const labelText = `${labelName} ${Math.round(len)}mm`
      const nx = -dy / len, ny = dx / len
      const tickLen = 6
      const offset = 14
      const mx = (ax + bx) / 2, my = (ay + by) / 2
      const tx = mx + nx * offset, ty = my + ny * offset
      let angle = Math.atan2(dy, dx) * (180 / Math.PI)
      if (angle > 90 || angle < -90) angle += 180
      svg += `<line x1="${ax}" y1="${ay}" x2="${bx}" y2="${by}" stroke="#C00" stroke-width="0.4"/>
        <line x1="${ax - nx * tickLen}" y1="${ay - ny * tickLen}" x2="${ax + nx * tickLen}" y2="${ay + ny * tickLen}" stroke="#C00" stroke-width="0.4"/>
        <line x1="${bx - nx * tickLen}" y1="${by - ny * tickLen}" x2="${bx + nx * tickLen}" y2="${by + ny * tickLen}" stroke="#C00" stroke-width="0.4"/>
        <text x="${tx}" y="${ty}" fill="#C00" font-size="9" text-anchor="middle" dominant-baseline="middle" transform="rotate(${angle},${tx},${ty})">${labelText}</text>`
    }

    svg += `</g>`
  }

  svg += `<text x="${MARGIN}" y="${totalH - 12}" font-size="9" fill="#999">汉服纸样平台 — ${data.name} | 单位: mm | 缝份: ${SEAM}mm</text>`
  svg += `</svg>`

  return { svg, width: totalW, height: totalH, partCount: data.parts.length }
}
