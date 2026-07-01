import type { ImportData, ImportPoint, ImportPart } from "./import-generator"
import { SIZE_DATA, DERIVATION_CANDIDATES, getSizeBust } from "@/data/size-data"

// ── Linear Regression ──────────────────────────────────────────────

interface RegressionResult {
  slope: number
  intercept: number
  r2: number
  measurement: string
}

function linearRegression(points: [number, number][]): { slope: number; intercept: number; r2: number } {
  const n = points.length
  if (n < 2) return { slope: 0, intercept: 0, r2: 0 }

  let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0
  for (const [x, y] of points) {
    sumX += x; sumY += y; sumXY += x * y; sumX2 += x * x
  }

  const denom = n * sumX2 - sumX * sumX
  if (Math.abs(denom) < 1e-10) return { slope: 0, intercept: 0, r2: 0 }

  const slope = (n * sumXY - sumX * sumY) / denom
  const intercept = (sumY - slope * sumX) / n

  const meanY = sumY / n
  let ssRes = 0, ssTot = 0
  for (const [x, y] of points) {
    const predicted = slope * x + intercept
    ssRes += (y - predicted) ** 2
    ssTot += (y - meanY) ** 2
  }

  const r2 = ssTot < 1e-10 ? 1 : Math.max(0, Math.min(1, 1 - ssRes / ssTot))
  return { slope, intercept, r2 }
}

function formatFormula(measurement: string, slope: number, intercept: number): string {
  const s = Math.abs(Math.round(slope * 1000)) / 1000
  if (s === 0) return `${Math.round(intercept)}`

  const prefix = slope < 0 ? "-" : ""
  let expr: string
  if (s === 1) {
    expr = `${prefix}{${measurement}}`
  } else {
    expr = `${prefix}{${measurement}}*${s}`
  }

  const roundedIntercept = Math.round(intercept)
  if (roundedIntercept > 0) return `${expr}+${roundedIntercept}`
  if (roundedIntercept < 0) return `${expr}${roundedIntercept}`
  return expr
}

// ── Derivation ─────────────────────────────────────────────────────

interface SizeImport {
  sizeLabel: string
  data: ImportData
}

function getSizeMeasurementsMm(sizeLabel: string): Record<string, number> {
  const cm = SIZE_DATA[sizeLabel]
  if (!cm) return {}
  const result: Record<string, number> = {}
  for (const [key, value] of Object.entries(cm)) {
    if (typeof value === "number") {
      result[key] = value * 10
    }
  }
  return result
}

export function deriveFormulas(imports: SizeImport[]): ImportData {
  if (imports.length < 2) {
    throw new Error("至少需要 2 套不同尺码的导入数据才能推导公式")
  }

  const sorted = [...imports].sort((a, b) => getSizeBust(a.sizeLabel) - getSizeBust(b.sizeLabel))
  const base = sorted[0].data

  const result: ImportData = {
    garmentId: base.garmentId,
    name: base.name,
    measurements: base.measurements,
    parts: base.parts.map((part, partIdx) => {
      return derivePartFormulas(part, sorted, partIdx)
    }),
  }

  return result
}

function derivePartFormulas(part: ImportPart, imports: SizeImport[], partIdx: number): ImportPart {
  const derivedPoints: ImportPoint[] = part.points.map((_point, pointIdx) => {
    const coordPairs: { sizeLabel: string; x: number; y: number }[] = []

    for (const imp of imports) {
      const p = imp.data.parts[partIdx]?.points[pointIdx]
      if (!p) continue

      const x = typeof p.x === "number" ? p.x : NaN
      const y = typeof p.y === "number" ? p.y : NaN
      if (!isNaN(x) && !isNaN(y)) {
        coordPairs.push({ sizeLabel: imp.sizeLabel, x, y })
      }
    }

    if (coordPairs.length < 2) {
      return { ...part.points[pointIdx] }
    }

    const allXSame = coordPairs.every((c) => c.x === coordPairs[0].x)
    const allYSame = coordPairs.every((c) => c.y === coordPairs[0].y)

    const xVal = allXSame
      ? coordPairs[0].x
      : deriveCoordinateValue(coordPairs, "x")
    const yVal = allYSame
      ? coordPairs[0].y
      : deriveCoordinateValue(coordPairs, "y")

    const isFormula = typeof xVal === "string" || typeof yVal === "string"

    const original = part.points[pointIdx]
    const result: ImportPoint = {
      x: xVal,
      y: yVal,
      cp1x: original.cp1x,
      cp1y: original.cp1y,
      cp2x: original.cp2x,
      cp2y: original.cp2y,
    }
    if (isFormula) result.type = "formula"
    return result
  })

  return { name: part.name, points: derivedPoints, annotations: part.annotations }
}

function deriveCoordinateValue(
  coordPairs: { sizeLabel: string; x: number; y: number }[],
  axis: "x" | "y",
): number | string {
  let bestFit: RegressionResult | null = null

  for (const meas of DERIVATION_CANDIDATES) {
    const points: [number, number][] = []
    for (const cp of coordPairs) {
      const measValue = getSizeMeasurementsMm(cp.sizeLabel)[meas]
      if (measValue === undefined) continue
      points.push([measValue, axis === "x" ? cp.x : cp.y])
    }

    if (points.length < 2) continue

    const result = linearRegression(points)

    if (!bestFit || result.r2 > bestFit.r2) {
      bestFit = { ...result, measurement: meas }
    }
  }

  if (bestFit && bestFit.r2 > 0.3) {
    return formatFormula(bestFit.measurement, bestFit.slope, bestFit.intercept)
  }

  return axis === "x" ? coordPairs[0].x : coordPairs[0].y
}

// ── Storage helpers ───────────────────────────────────────────────

export function getFormulasKey(garmentId: string): string {
  return `hanfu-formulas-${garmentId}`
}

export function collectSizeImports(garmentId: string): SizeImport[] {
  const imports: SizeImport[] = []
  const prefix = `hanfu-override-${garmentId}-`

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    if (!key || !key.startsWith(prefix)) continue

    const sizeLabel = key.slice(prefix.length)
    if (sizeLabel === "default" || !sizeLabel) continue

    try {
      const raw = localStorage.getItem(key)
      if (!raw) continue
      const data = JSON.parse(raw) as ImportData
      imports.push({ sizeLabel, data })
    } catch {
      void 0
    }
  }

  return imports
}
