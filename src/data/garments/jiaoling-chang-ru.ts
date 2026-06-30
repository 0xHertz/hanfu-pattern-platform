import type { GarmentSize } from '@/types/garment'

export const JIAOLING_CHANGRU_SIZES: GarmentSize[] = [
  { label: '155/80A', height: 1550, bust: 800, waist: 640, hip: 828, bodyType: 'A' },
  { label: '160/84A', height: 1600, bust: 840, waist: 660, hip: 846, bodyType: 'A' },
  { label: '165/88A', height: 1650, bust: 880, waist: 700, hip: 882, bodyType: 'A' },
  { label: '170/92A', height: 1700, bust: 920, waist: 720, hip: 900, bodyType: 'A' },
  { label: '175/96A', height: 1750, bust: 960, waist: 760, hip: 936, bodyType: 'A' },
]

export interface JiaolingChangRuDimensions {
  garmentLength: number
  garmentBust: number
  hemWidth: number
  cuffWidth: number
  armSpan: number
  collarWidth: number
  collarEdgeWidth: number
}

export function calculateJiaolingChangRu(
  height: number,
  bust: number,
  ease: number = 100
): JiaolingChangRuDimensions {
  const garmentBust = bust + ease
  return {
    garmentLength: Math.round(height * 0.44),
    garmentBust,
    hemWidth: Math.round(garmentBust / 2),
    cuffWidth: Math.round(bust * 0.2375 + 2),
    armSpan: Math.round(height * 1.02),
    collarWidth: Math.round(bust * 0.1975),
    collarEdgeWidth: bust < 920 ? 60 : 65,
  }
}
