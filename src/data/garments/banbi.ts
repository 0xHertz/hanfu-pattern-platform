import type { GarmentSize } from '@/types/garment'

// All 3 banbi variants share the same unisex size range
export const JIAOLING_BANBI_SIZES: GarmentSize[] = [
  { label: '155/80A', height: 1550, bust: 800, waist: 640, hip: 828, bodyType: 'A' },
  { label: '160/84A', height: 1600, bust: 840, waist: 660, hip: 846, bodyType: 'A' },
  { label: '165/88A', height: 1650, bust: 880, waist: 700, hip: 882, bodyType: 'A' },
  { label: '170/92A', height: 1700, bust: 920, waist: 720, hip: 900, bodyType: 'A' },
  { label: '175/96A', height: 1750, bust: 960, waist: 760, hip: 936, bodyType: 'A' },
  { label: '180/100A', height: 1800, bust: 1000, waist: 800, hip: 972, bodyType: 'A' },
  { label: '185/104A', height: 1850, bust: 1040, waist: 840, hip: 1008, bodyType: 'A' },
]

export const ZHIDUIJIN_BANBI_SIZES = JIAOLING_BANBI_SIZES
export const XIEDUIJIN_BANBI_SIZES = JIAOLING_BANBI_SIZES

export interface BanbiDimensions {
  garmentLength: number
  garmentBust: number
  hemWidth: number
  cuffWidth: number
  armLength: number
  collarWidth: number
  collarEdgeWidth: number
}

function calculateBanbiBase(
  height: number,
  bust: number,
  ease: number = 80
): BanbiDimensions {
  const garmentBust = bust + ease
  // armSpan ≈ height, shoulderWidth ≈ height * 0.24, half-sleeve = 35% of full arm
  const estimatedArmSpan = height
  const estimatedShoulderWidth = Math.round(height * 0.24)
  const armLength = Math.round((estimatedArmSpan - estimatedShoulderWidth) / 2 * 0.35)

  return {
    garmentLength: Math.round(height * 0.30),
    garmentBust,
    hemWidth: Math.round(garmentBust * 0.50),
    cuffWidth: Math.round(bust * 0.30),
    armLength,
    collarWidth: Math.round(bust * 0.19),
    collarEdgeWidth: 60,
  }
}

export function calculateJiaolingBanbi(
  height: number,
  bust: number,
  ease: number = 80
): BanbiDimensions {
  return calculateBanbiBase(height, bust, ease)
}

export function calculateZhiduijinBanbi(
  height: number,
  bust: number,
  ease: number = 80
): BanbiDimensions {
  return calculateBanbiBase(height, bust, ease)
}

export function calculateXieduijinBanbi(
  height: number,
  bust: number,
  ease: number = 80
): BanbiDimensions {
  return calculateBanbiBase(height, bust, ease)
}
