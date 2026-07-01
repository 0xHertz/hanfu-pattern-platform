import { createClient } from "@/lib/supabase/client"

function getLocalStorage(): Storage | null {
  try {
    return typeof window !== "undefined" ? window.localStorage : null
  } catch {
    return null
  }
}

// ─── Overrides ──────────────────────────────────────────────────────────────

export async function getOverrides(
  garmentId: string
): Promise<{ sizeLabel: string; data: any }[]> {
  try {
    const supabase = createClient()
    const { data, error } = await supabase
      .from("overrides")
      .select("size_label, data")
      .eq("garment_id", garmentId)
    if (!error && data && data.length > 0) {
      return data.map((row) => ({
        sizeLabel: row.size_label,
        data: row.data,
      }))
    }
  } catch {
    /* Supabase unavailable */
  }
  return getOverridesSync(garmentId)
}

export function getOverridesSync(
  garmentId: string
): { sizeLabel: string; data: any }[] {
  const ls = getLocalStorage()
  if (!ls) return []
  try {
    const result: { sizeLabel: string; data: any }[] = []
    const prefix = `hanfu-override-${garmentId}-`
    for (let i = 0; i < ls.length; i++) {
      const key = ls.key(i)
      if (!key?.startsWith(prefix)) continue
      const raw = ls.getItem(key)
      if (!raw) continue
      try {
        result.push({ sizeLabel: key.slice(prefix.length), data: JSON.parse(raw) })
      } catch {
        /* skip unparseable */
      }
    }
    const oldKey = `hanfu-override-${garmentId}`
    const oldVal = ls.getItem(oldKey)
    if (oldVal) {
      try {
        const parsed = JSON.parse(oldVal)
        if (!result.some((r) => r.sizeLabel === "default")) {
          result.push({
            sizeLabel: (parsed as any)?.sizeLabel || "default",
            data: parsed,
          })
        }
      } catch {
        /* skip unparseable legacy */
      }
    }
    return result
  } catch {
    return []
  }
}

export async function saveOverride(
  garmentId: string,
  sizeLabel: string,
  data: any
): Promise<void> {
  try {
    const supabase = createClient()
    await supabase.from("overrides").upsert(
      { garment_id: garmentId, size_label: sizeLabel, data },
      { onConflict: "garment_id, size_label" }
    )
  } catch {
    /* Supabase unavailable */
  }
  const ls = getLocalStorage()
  if (ls) {
    try {
      ls.setItem(
        `hanfu-override-${garmentId}-${sizeLabel}`,
        JSON.stringify(data)
      )
    } catch {
      /* localStorage full or unavailable */
    }
  }
}

export async function deleteOverride(
  garmentId: string,
  sizeLabel?: string
): Promise<void> {
  try {
    const supabase = createClient()
    let query = supabase.from("overrides").delete().eq("garment_id", garmentId)
    if (sizeLabel) query = query.eq("size_label", sizeLabel)
    await query
  } catch {
    /* Supabase unavailable */
  }
  const ls = getLocalStorage()
  if (!ls) return
  try {
    if (sizeLabel) {
      ls.removeItem(`hanfu-override-${garmentId}-${sizeLabel}`)
    } else {
      for (let i = ls.length - 1; i >= 0; i--) {
        const key = ls.key(i)
        if (key?.startsWith(`hanfu-override-${garmentId}`)) {
          ls.removeItem(key)
        }
      }
    }
  } catch {
    /* localStorage unavailable */
  }
}

// ─── Formulas ───────────────────────────────────────────────────────────────

export async function getFormulas(garmentId: string): Promise<any> {
  try {
    const supabase = createClient()
    const { data, error } = await supabase
      .from("formulas")
      .select("data")
      .eq("garment_id", garmentId)
      .maybeSingle()
    if (!error && data) return data.data
  } catch {
    /* Supabase unavailable */
  }
  return getFormulasSync(garmentId)
}

export function hasFormulasSync(garmentId: string): boolean {
  const ls = getLocalStorage()
  if (!ls) return false
  try {
    return ls.getItem(`hanfu-formulas-${garmentId}`) !== null
  } catch {
    return false
  }
}

export function getFormulasSync(garmentId: string): any {
  const ls = getLocalStorage()
  if (!ls) return null
  try {
    const stored = ls.getItem(`hanfu-formulas-${garmentId}`)
    return stored ? JSON.parse(stored) : null
  } catch {
    return null
  }
}

export async function saveFormulas(
  garmentId: string,
  data: any
): Promise<void> {
  try {
    const supabase = createClient()
    await supabase.from("formulas").upsert(
      { garment_id: garmentId, data },
      { onConflict: "garment_id" }
    )
  } catch {
    /* Supabase unavailable */
  }
  const ls = getLocalStorage()
  if (ls) {
    try {
      ls.setItem(`hanfu-formulas-${garmentId}`, JSON.stringify(data))
    } catch {
      /* localStorage full or unavailable */
    }
  }
}
