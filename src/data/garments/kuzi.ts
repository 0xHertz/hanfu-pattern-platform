import type { GarmentSize } from '@/types/garment'

export const KUZI_SIZES: GarmentSize[] = [
  { label: '155/68A', height: 1550, bust: 800, waist: 680, hip: 828, bodyType: 'A' },
  { label: '160/72A', height: 1600, bust: 840, waist: 720, hip: 864, bodyType: 'A' },
  { label: '165/76A', height: 1650, bust: 880, waist: 760, hip: 900, bodyType: 'A' },
  { label: '170/80A', height: 1700, bust: 920, waist: 800, hip: 936, bodyType: 'A' },
  { label: '175/84A', height: 1750, bust: 960, waist: 840, hip: 972, bodyType: 'A' },
  { label: '180/88A', height: 1800, bust: 1000, waist: 880, hip: 1008, bodyType: 'A' },
  { label: '185/92A', height: 1850, bust: 1040, waist: 920, hip: 1044, bodyType: 'A' },
]

export interface KuziDimensions {
  pantsLength: number
  waistRelaxed: number
  hipRelaxed: number
  crotchDepth: number
  legOpening: number
  waistbandWidth: number
}

export function calculateKuzi(
  height: number,
  waist: number,
  hip: number,
  _ease: number = 0
): KuziDimensions {
  return {
    pantsLength: Math.round(height * 0.55),
    waistRelaxed: waist + 40,
    hipRelaxed: hip + 80,
    crotchDepth: Math.round(hip * 0.16 + 85),
    legOpening: Math.round(hip * 0.28),
    waistbandWidth: 60,
  }
}
