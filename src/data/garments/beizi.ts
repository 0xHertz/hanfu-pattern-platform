import type { GarmentSize } from '@/types/garment'

// ====== 斜对襟褙子 (Slant-Collar Beizi) ======
export const XIEDUIJIN_BEIZI_SIZES: GarmentSize[] = [
  { label: '155/80A', height: 1550, bust: 800, waist: 640, hip: 828, bodyType: 'A' },
  { label: '160/84A', height: 1600, bust: 840, waist: 660, hip: 846, bodyType: 'A' },
  { label: '165/88A', height: 1650, bust: 880, waist: 700, hip: 882, bodyType: 'A' },
  { label: '170/92A', height: 1700, bust: 920, waist: 720, hip: 900, bodyType: 'A' },
  { label: '175/96A', height: 1750, bust: 960, waist: 760, hip: 936, bodyType: 'A' },
]

// ====== 直对襟褙子 (Straight-Collar Beizi) ======
export const ZHIDUIJIN_BEIZI_SIZES: GarmentSize[] = [
  { label: '155/80A', height: 1550, bust: 800, waist: 640, hip: 828, bodyType: 'A' },
  { label: '160/84A', height: 1600, bust: 840, waist: 660, hip: 846, bodyType: 'A' },
  { label: '165/88A', height: 1650, bust: 880, waist: 700, hip: 882, bodyType: 'A' },
  { label: '170/92A', height: 1700, bust: 920, waist: 720, hip: 900, bodyType: 'A' },
  { label: '175/96A', height: 1750, bust: 960, waist: 760, hip: 936, bodyType: 'A' },
  { label: '180/100A', height: 1800, bust: 1000, waist: 800, hip: 972, bodyType: 'A' },
  { label: '185/104A', height: 1850, bust: 1040, waist: 840, hip: 1008, bodyType: 'A' },
]

export interface BeiziDimensions {
  garmentLength: number
  garmentBust: number
  hemWidth: number
  cuffWidth: number
  armSpan: number
  collarWidth: number
  collarEdgeWidth: number
}

function calculateBeiziBase(
  height: number,
  bust: number,
  ease: number = 80
): BeiziDimensions {
  const garmentBust = bust + ease
  return {
    garmentLength: Math.round(height * 0.65),
    garmentBust,
    hemWidth: Math.round(garmentBust * 0.52),
    cuffWidth: Math.round(bust * 0.22),
    armSpan: Math.round(height * 1.02),
    collarWidth: Math.round(bust * 0.18),
    collarEdgeWidth: 65,
  }
}

export function calculateXieduijinBeizi(
  height: number,
  bust: number,
  ease: number = 80
): BeiziDimensions {
  return calculateBeiziBase(height, bust, ease)
}

export function calculateZhiduijinBeizi(
  height: number,
  bust: number,
  ease: number = 80
): BeiziDimensions {
  return calculateBeiziBase(height, bust, ease)
}
