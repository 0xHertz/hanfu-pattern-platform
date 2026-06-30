/**
 * Pattern Designer
 *
 * Takes a garment ID and measurements, generates SVG output.
 * No longer uses FreeSewing — delegates to the direct SVG generator.
 */
import { renderPattern } from './svg-generator'
import type { PatternData } from '@/types/garment'

/** Static registry of which measurements each garment requires */
const MEASUREMENT_REGISTRY: Record<string, string[]> = {
  'jiaoling-shang-ru': [
    'height', 'bust', 'waist', 'shoulderWidth',
    'armSpan', 'garmentLength', 'armLength', 'neckCircumference',
  ],
}

export type GarmentDesignId = keyof typeof MEASUREMENT_REGISTRY

/**
 * Result of a pattern generation
 */
export interface PatternResult {
  /** SVG string of the rendered pattern */
  svg: string
  /** Metadata about the generated pattern */
  metadata: {
    /** Width of the SVG in mm */
    width: number
    /** Height of the SVG in mm */
    height: number
    /** Number of parts generated */
    partCount: number
  }
}

/**
 * Generate a pattern SVG from a garment ID and measurements.
 *
 * @param garmentId - The ID of the garment design to generate
 * @param measurements - Body measurements in mm
 * @param options - Optional design-specific options
 * @returns Object containing SVG string and metadata
 */
export async function generatePattern(
  garmentId: string,
  measurements: Record<string, number>,
  options?: Record<string, number>,
): Promise<PatternResult> {
  if (!MEASUREMENT_REGISTRY[garmentId]) {
    throw new Error(
      `Unknown garment design: "${garmentId}". Available: ${Object.keys(MEASUREMENT_REGISTRY).join(', ')}`,
    )
  }

  const result = renderPattern(garmentId, measurements, options)

  return {
    svg: result.svg,
    metadata: {
      width: result.width,
      height: result.height,
      partCount: result.partCount,
    },
  }
}

/**
 * Get the list of required measurement IDs for a given garment design.
 */
export function getRequiredMeasurements(garmentId: string): string[] {
  return [...(MEASUREMENT_REGISTRY[garmentId] ?? [])]
}

/**
 * Get the list of available garment design IDs.
 */
export function getAvailableDesigns(): string[] {
  return Object.keys(MEASUREMENT_REGISTRY)
}
