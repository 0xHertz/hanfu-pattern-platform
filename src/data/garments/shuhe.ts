import type { GarmentSize } from '@/types/garment'

export const SHUHE_SIZES: GarmentSize[] = [
  { label: '165/88A', height: 1650, bust: 880, waist: 760, hip: 936, bodyType: 'A' },
  { label: '170/92A', height: 1700, bust: 920, waist: 800, hip: 972, bodyType: 'A' },
  { label: '175/96A', height: 1750, bust: 960, waist: 840, hip: 1008, bodyType: 'A' },
  { label: '180/100A', height: 1800, bust: 1000, waist: 880, hip: 1044, bodyType: 'A' },
  { label: '185/104A', height: 1850, bust: 1040, waist: 920, hip: 1080, bodyType: 'A' },
]

export interface ShuheDimensions {
  garmentLength: number
  garmentBust: number
  hemWidth: number
  cuffWidth: number
  armSpan: number
  collarWidth: number
  collarEdgeWidth: number
}

export function calculateShuhe(
  height: number,
  bust: number,
  ease: number = 60
): ShuheDimensions {
  const garmentBust = bust + ease
  return {
    garmentLength: Math.round(height * 0.30),
    garmentBust,
    hemWidth: Math.round(garmentBust * 0.50),
    cuffWidth: Math.round(bust * 0.20),
    armSpan: Math.round(height * 0.95),
    collarWidth: Math.round(bust * 0.19),
    collarEdgeWidth: 55,
  }
}
