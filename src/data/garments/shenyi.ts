import type { GarmentSize } from '@/types/garment'

export const SHENYI_SIZES: GarmentSize[] = [
  { label: '155/80A', height: 1550, bust: 800, waist: 640, hip: 828, bodyType: 'A' },
  { label: '160/84A', height: 1600, bust: 840, waist: 660, hip: 846, bodyType: 'A' },
  { label: '165/88A', height: 1650, bust: 880, waist: 700, hip: 882, bodyType: 'A' },
  { label: '170/92A', height: 1700, bust: 920, waist: 720, hip: 900, bodyType: 'A' },
  { label: '175/96A', height: 1750, bust: 960, waist: 760, hip: 936, bodyType: 'A' },
  { label: '180/100A', height: 1800, bust: 1000, waist: 800, hip: 972, bodyType: 'A' },
  { label: '185/104A', height: 1850, bust: 1040, waist: 840, hip: 1008, bodyType: 'A' },
]

export interface ShenyiDimensions {
  garmentLength: number
  garmentBust: number
  hemWidth: number
  cuffWidth: number
  armSpan: number
  collarWidth: number
  collarEdgeWidth: number
}

export function calculateShenyi(
  height: number,
  bust: number,
  ease: number = 120
): ShenyiDimensions {
  const garmentBust = bust + ease
  return {
    garmentLength: Math.round(height * 0.88),
    garmentBust,
    hemWidth: Math.round(garmentBust * 0.60),
    cuffWidth: Math.round(bust * 0.35),
    armSpan: Math.round(height * 1.20),
    collarWidth: Math.round(bust * 0.20),
    collarEdgeWidth: 70,
  }
}
