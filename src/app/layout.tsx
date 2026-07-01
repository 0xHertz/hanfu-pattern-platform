import type { Metadata } from "next"
import "./globals.css"
import { SiteHeader } from "@/components/site-header"
import { AuthProvider } from "@/lib/auth/context"

export const metadata: Metadata = {
  title: "汉服纸样 — 参数化汉服纸样生成平台",
  description:
    "输入你的身体数据，生成专属于你的汉服裁剪图纸。支持明制、唐制、宋制、汉制等数十种传统款式。",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="zh-CN" className="h-full antialiased">
      <body className="flex min-h-full flex-col">
        <AuthProvider>
          <SiteHeader />
          <main className="flex-1">{children}</main>
        </AuthProvider>
        <footer className="border-t border-border py-6 text-center text-xs text-muted-foreground">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <p>汉服纸样平台 — 让传统服饰制作更简单</p>
          </div>
        </footer>
      </body>
    </html>
  )
}
