"use client"

import { useState, type FormEvent } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card"
import { Loader2 } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const supabase = createClient()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)

    if (!email.trim() || !password.trim()) {
      setError("请输入邮箱和密码")
      return
    }

    setLoading(true)

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    })

    if (signInError) {
      setError(
        signInError.message === "Invalid login credentials"
          ? "邮箱或密码错误"
          : signInError.message
      )
      setLoading(false)
      return
    }

    router.push("/")
    router.refresh()
  }

  return (
    <div className="flex min-h-[calc(100vh-3.5rem)] items-center justify-center bg-gradient-to-br from-background to-secondary/50 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xl font-bold tracking-wider text-foreground"
          >
            <span className="inline-block rounded bg-[oklch(0.72_0.10_65)] px-1.5 py-0.5 text-xs text-[oklch(0.25_0.04_45)]">
              纸样
            </span>
            汉服
          </Link>
          <p className="mt-2 text-sm text-muted-foreground">
            登录你的账号，保存并管理专属纸样
          </p>
        </div>

        <Card className="border-border/60 shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-xl tracking-tight">登录</CardTitle>
            <CardDescription>
              输入邮箱和密码登录你的账号
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email">邮箱</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  autoFocus
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">密码</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                />
              </div>

              {error && (
                <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-2.5 text-sm text-destructive">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                className="w-full"
                size="lg"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 size-4 animate-spin" />
                    登录中…
                  </>
                ) : (
                  "登录"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        <p className="mt-5 text-center text-sm text-muted-foreground">
          还没有账号？{" "}
          <Link
            href="/register"
            className="font-medium text-primary underline-offset-4 hover:underline"
          >
            注册
          </Link>
        </p>
      </div>
    </div>
  )
}
