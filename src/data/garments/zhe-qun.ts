import type { GarmentSize } from '@/types/garment'

export const ZHE_QUN_SIZES: GarmentSize[] = [
  { label: '155/68A', height: 1550, bust: 800, waist: 640, hip: 828, bodyType: 'A' },
  { label: '160/72A', height: 1600, bust: 840, waist: 660, hip: 846, bodyType: 'A' },
  { label: '165/76A', height: 1650, bust: 880, waist: 700, hip: 882, bodyType: 'A' },
  { label: '170/80A', height: 1700, bust: 920, waist: 720, hip: 900, bodyType: 'A' },
  { label: '175/84A', height: 1750, bust: 960, waist: 760, hip: 936, bodyType: 'A' },
]

export interface ZheQunDimensions {
  skirtLength: number
  waistbandWidth: number
  hemCircumference: number
}

export function calculateZheQun(
  height: number,
  waist: number,
  ease: number = 100
): ZheQunDimensions {
  return {
    skirtLength: Math.round(height * 0.60),
    waistbandWidth: 80,
    hemCircumference: Math.round(waist * 4),
  }
}
