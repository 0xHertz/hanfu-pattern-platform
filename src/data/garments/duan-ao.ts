import type { GarmentSize } from '@/types/garment'

export const DUAN_AO_SIZES: GarmentSize[] = [
  { label: '155/80A', height: 1550, bust: 800, waist: 640, hip: 828, bodyType: 'A' },
  { label: '160/84A', height: 1600, bust: 840, waist: 660, hip: 846, bodyType: 'A' },
  { label: '165/88A', height: 1650, bust: 880, waist: 700, hip: 882, bodyType: 'A' },
  { label: '170/92A', height: 1700, bust: 920, waist: 720, hip: 900, bodyType: 'A' },
  { label: '175/96A', height: 1750, bust: 960, waist: 760, hip: 936, bodyType: 'A' },
]

export interface DuanAoDimensions {
  garmentLength: number
  garmentBust: number
  hemWidth: number
  cuffWidth: number
  armSpan: number
  collarWidth: number
  collarEdgeWidth: number
  sideSlit: number
}

export function calculateDuanAo(
  height: number,
  bust: number,
  ease: number = 100
): DuanAoDimensions {
  const garmentBust = bust + ease
  return {
    garmentLength: Math.round(height * 0.38),
    garmentBust,
    hemWidth: Math.round(garmentBust * 0.52),
    cuffWidth: Math.round(bust * 0.25),
    armSpan: Math.round(height * 1.03),
    collarWidth: Math.round(bust * 0.20),
    collarEdgeWidth: 65,
    sideSlit: Math.round(height * 0.38 * 0.45),
  }
}
