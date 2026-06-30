import type { GarmentSize } from '@/types/garment'

export const YESA_SIZES: GarmentSize[] = [
  { label: '165/88A', height: 1650, bust: 880, waist: 760, hip: 936, bodyType: 'A' },
  { label: '170/92A', height: 1700, bust: 920, waist: 800, hip: 972, bodyType: 'A' },
  { label: '175/96A', height: 1750, bust: 960, waist: 840, hip: 1008, bodyType: 'A' },
  { label: '180/100A', height: 1800, bust: 1000, waist: 880, hip: 1044, bodyType: 'A' },
  { label: '185/104A', height: 1850, bust: 1040, waist: 920, hip: 1080, bodyType: 'A' },
]

export interface YesaDimensions {
  garmentLengthFront: number
  garmentLengthBack: number
  garmentBust: number
  hemWidth: number
  cuffWidth: number
  armSpan: number
  collarWidth: number
  collarEdgeWidth: number
}

export function calculateYesa(
  height: number,
  bust: number,
  ease: number = 120
): YesaDimensions {
  const garmentBust = bust + ease
  return {
    garmentLengthFront: Math.round(height * 0.60),
    garmentLengthBack: Math.round(height * 0.78),
    garmentBust,
    hemWidth: Math.round(garmentBust * 0.55),
    cuffWidth: Math.round(bust * 0.32),
    armSpan: Math.round(height * 1.15),
    collarWidth: Math.round(bust * 0.21),
    collarEdgeWidth: 70,
  }
}
