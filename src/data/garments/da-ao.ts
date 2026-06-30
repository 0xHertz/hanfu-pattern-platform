import type { GarmentSize } from '@/types/garment'

export const DA_AO_SIZES: GarmentSize[] = [
  { label: '155/80A', height: 1550, bust: 800, waist: 640, hip: 828, bodyType: 'A' },
  { label: '160/84A', height: 1600, bust: 840, waist: 660, hip: 846, bodyType: 'A' },
  { label: '165/88A', height: 1650, bust: 880, waist: 700, hip: 882, bodyType: 'A' },
  { label: '170/92A', height: 1700, bust: 920, waist: 720, hip: 900, bodyType: 'A' },
  { label: '175/96A', height: 1750, bust: 960, waist: 760, hip: 936, bodyType: 'A' },
]

export interface DaAoDimensions {
  garmentLength: number
  garmentBust: number
  hemWidth: number
  cuffWidth: number
  armSpan: number
  collarWidth: number
  collarEdgeWidth: number
  sideSlit: number
}

export function calculateDaAo(
  height: number,
  bust: number,
  ease: number = 140
): DaAoDimensions {
  const garmentBust = bust + ease
  const garmentLength = Math.round(height * 0.55)
  return {
    garmentLength,
    garmentBust,
    hemWidth: Math.round(garmentBust * 0.55),
    cuffWidth: Math.round(bust * 0.28),
    armSpan: Math.round(height * 1.15),
    collarWidth: Math.round(bust * 0.21),
    collarEdgeWidth: 70,
    sideSlit: Math.round(garmentLength * 0.35),
  }
}
