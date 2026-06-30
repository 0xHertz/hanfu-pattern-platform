export type MeasKey =
  | "height"
  | "bust"
  | "waist"
  | "shoulderWidth"
  | "armSpan"
  | "garmentLength"
  | "neckCircumference"
  | "armLength"

export const SIZE_DATA: Record<string, Partial<Record<MeasKey, number>>> = {
  "155/80A": { height: 155, bust: 80, waist: 64, shoulderWidth: 39, garmentLength: 58, neckCircumference: 33, armLength: 52 },
  "160/84A": { height: 160, bust: 84, waist: 66, shoulderWidth: 40, garmentLength: 60, neckCircumference: 33, armLength: 54 },
  "165/88A": { height: 165, bust: 88, waist: 70, shoulderWidth: 41, garmentLength: 62, neckCircumference: 34, armLength: 55 },
  "170/92A": { height: 170, bust: 92, waist: 72, shoulderWidth: 42, garmentLength: 64, neckCircumference: 35, armLength: 57 },
  "175/96A": { height: 175, bust: 96, waist: 76, shoulderWidth: 43, garmentLength: 66, neckCircumference: 36, armLength: 58 },
  "180/100A": { height: 180, bust: 100, waist: 84, shoulderWidth: 44, garmentLength: 70, neckCircumference: 37, armLength: 60 },
  "185/104A": { height: 185, bust: 104, waist: 88, shoulderWidth: 45, garmentLength: 73, neckCircumference: 37, armLength: 62 },
}

export const DERIVATION_CANDIDATES: MeasKey[] = [
  "bust",
  "height",
  "waist",
  "shoulderWidth",
  "armSpan",
  "garmentLength",
  "neckCircumference",
  "armLength",
]

export function getSizeBust(sizeLabel: string): number {
  const parts = sizeLabel.split("/")
  if (parts.length >= 2) {
    const bustStr = parts[1].replace(/[A-Z]/g, "")
    return parseInt(bustStr, 10) || 0
  }
  return 0
}
