"use client"

import Link from "next/link"
import { useAuth } from "@/lib/auth/context"

export function AdminGuard({ children }: { children: React.ReactNode }) {
  // TODO: re-enable auth check when Supabase is configured
  return <>{children}</>
}
