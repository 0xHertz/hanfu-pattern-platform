/**
 * Pattern utility functions for measurement validation,
 * ease suggestion, and dimension formatting.
 */

/**
 * Ease amounts by garment subtype and fit type (in mm)
 */
const EASE_TABLE: Record<string, number> = {
  'jiaoling-shang-ru_fitted': 100,
  'jiaoling-shang-ru_loose': 140,
  'jiaoling-shang-ru_snug': 60,
  'duan-ao_fitted': 100,
  'da-ao_loose': 160,
  'zhongyi_snug': 60,
  default_fitted: 100,
  default_loose: 140,
  default_snug: 60,
}

/**
 * Validate that all required measurements are present and within reasonable bounds.
 *
 * @param measurements - The user's body measurements in mm
 * @param required - List of required measurement IDs
 * @returns Array of error messages (empty if valid)
 */
export function validateMeasurements(
  measurements: Record<string, number>,
  required: string[],
): string[] {
  const errors: string[] = []

  const BOUNDS: Record<string, { min: number; max: number; name: string }> = {
    height: { min: 1400, max: 2200, name: 'Height' },
    bust: { min: 700, max: 1400, name: 'Bust' },
    waist: { min: 550, max: 1200, name: 'Waist' },
    hip: { min: 750, max: 1400, name: 'Hip' },
    shoulderWidth: { min: 320, max: 550, name: 'Shoulder Width' },
    armSpan: { min: 1300, max: 2300, name: 'Arm Span' },
    armLength: { min: 450, max: 750, name: 'Arm Length' },
    garmentLength: { min: 400, max: 1500, name: 'Garment Length' },
    neckCircumference: { min: 280, max: 450, name: 'Neck Circumference' },
    skirtLength: { min: 500, max: 1400, name: 'Skirt Length' },
  }

  for (const id of required) {
    const val = measurements[id]
    if (val == null || val === undefined) {
      errors.push(`Missing measurement: ${BOUNDS[id]?.name ?? id}`)
      continue
    }
    const bounds = BOUNDS[id]
    if (bounds) {
      if (val < bounds.min) {
        errors.push(`${bounds.name} (${val}mm) is below minimum ${bounds.min}mm`)
      } else if (val > bounds.max) {
        errors.push(`${bounds.name} (${val}mm) exceeds maximum ${bounds.max}mm`)
      }
    }
  }

  return errors
}

/**
 * Suggest an ease amount based on garment type and fit preference.
 *
 * @param garmentId - The garment design ID
 * @param fitType - Optional fit type ('fitted', 'loose', 'snug')
 * @returns Suggested ease amount in mm
 */
export function suggestEase(
  garmentId: string,
  fitType: 'fitted' | 'loose' | 'snug' = 'fitted',
): number {
  const key = `${garmentId}_${fitType}`
  if (key in EASE_TABLE) return EASE_TABLE[key]
  return EASE_TABLE[`default_${fitType}`] ?? 100
}

/**
 * Format a dimension in mm to a human-readable string.
 *
 * Examples:
 * - formatDimension(1700) => "170cm"
 * - formatDimension(920) => "92cm"
 * - formatDimension(45) => "4.5cm"
 *
 * @param mm - Dimension in millimeters
 * @returns Formatted string
 */
export function formatDimension(mm: number): string {
  if (mm >= 10) {
    return `${Math.round(mm / 10)}cm`
  }
  return `${(mm / 10).toFixed(1)}cm`
}

/**
 * Format a measurement value for display with its unit.
 *
 * @param mm - Value in millimeters
 * @returns Human-readable string like "170 cm"
 */
export function displayMeasurement(mm: number): string {
  if (mm >= 100) {
    return `${(mm / 10).toFixed(0)} cm`
  }
  return `${mm.toFixed(0)} mm`
}
