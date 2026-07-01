"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useAuth } from "@/lib/auth/context"

export function SiteHeader() {
  const { user, isAdmin, loading } = useAuth()
  const [mobileOpen, setMobileOpen] = useState(false)

  const NAV_LINKS = !user
    ? [{ href: "/login", label: "登录" }]
    : isAdmin
      ? [
          { href: "/garments", label: "款式管理" },
          { href: "/measure", label: "量体" },
          { href: "/digitizer", label: "描点工具" },
          { href: "/profile", label: "我的" },
        ]
      : [
          { href: "/", label: "所有款式" },
          { href: "/measure", label: "量体" },
          { href: "/profile", label: "我的" },
        ]

  return (
    <header className="sticky top-0 z-50 w-full border-b border-red-900/20 bg-[oklch(0.30_0.10_30)] shadow-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 text-lg font-bold tracking-wider text-[oklch(0.95_0.02_80)]"
        >
          <span className="inline-block rounded bg-[oklch(0.72_0.10_65)] px-1.5 py-0.5 text-xs text-[oklch(0.25_0.04_45)]">
            纸样
          </span>
          汉服
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-md px-3 py-1.5 text-sm font-medium text-[oklch(0.85_0.03_70)] transition-colors hover:bg-red-800/40 hover:text-white"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Mobile hamburger */}
        <Button
          variant="ghost"
          size="icon"
          className="text-[oklch(0.85_0.03_70)] hover:bg-red-800/40 hover:text-white md:hidden"
          onClick={() => setMobileOpen(true)}
        >
          <Menu className="size-5" />
        </Button>
      </div>

      {/* Mobile menu overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          {/* Panel */}
          <div
            className={cn(
              "absolute right-0 top-0 flex h-full w-64 flex-col",
              "bg-[oklch(0.28_0.08_30)] shadow-2xl",
              "animate-in slide-in-from-right duration-300"
            )}
          >
            <div className="flex items-center justify-between border-b border-red-800/30 px-4 py-3">
              <span className="text-sm font-bold tracking-wider text-[oklch(0.95_0.02_80)]">
                导航
              </span>
              <Button
                variant="ghost"
                size="icon"
                className="text-[oklch(0.85_0.03_70)] hover:bg-red-800/40 hover:text-white"
                onClick={() => setMobileOpen(false)}
              >
                <X className="size-5" />
              </Button>
            </div>
            <nav className="flex flex-col gap-1 p-4">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="rounded-md px-3 py-2.5 text-sm font-medium text-[oklch(0.85_0.03_70)] transition-colors hover:bg-red-800/40 hover:text-white"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}
    </header>
  )
}
