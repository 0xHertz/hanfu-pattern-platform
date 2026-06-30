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

export default function RegisterPage() {
  const router = useRouter()
  const supabase = createClient()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)

    if (!email.trim() || !password.trim() || !confirmPassword.trim()) {
      setError("请填写所有字段")
      return
    }

    if (password.length < 6) {
      setError("密码长度至少 6 位")
      return
    }

    if (password !== confirmPassword) {
      setError("两次输入的密码不一致")
      return
    }

    setLoading(true)

    const { error: signUpError } = await supabase.auth.signUp({
      email: email.trim(),
      password,
    })

    if (signUpError) {
      setError(
        signUpError.message === "User already registered"
          ? "该邮箱已注册，请直接登录"
          : signUpError.message
      )
      setLoading(false)
      return
    }

    setSuccess(true)
    setLoading(false)
  }

  if (success) {
    return (
      <div className="flex min-h-[calc(100vh-3.5rem)] items-center justify-center bg-gradient-to-br from-background to-secondary/50 px-4 py-12">
        <div className="w-full max-w-md text-center">
          <Card className="border-border/60 shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl tracking-tight">
                注册成功
              </CardTitle>
              <CardDescription className="mx-auto mt-2 max-w-sm">
                我们已向 {email} 发送了一封确认邮件。
                <br />
                请查收邮件并点击确认链接完成注册。
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <svg
                  className="size-8 text-primary"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <Button
                variant="outline"
                onClick={() => router.push("/login")}
              >
                前往登录
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
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
            创建账号，开启你的汉服纸样定制之旅
          </p>
        </div>

        <Card className="border-border/60 shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-xl tracking-tight">注册</CardTitle>
            <CardDescription>
              输入邮箱和密码创建新账号
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
                  placeholder="至少 6 位"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="new-password"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm-password">确认密码</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  placeholder="再次输入密码"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  autoComplete="new-password"
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
                    注册中…
                  </>
                ) : (
                  "注册"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        <p className="mt-5 text-center text-sm text-muted-foreground">
          已有账号？{" "}
          <Link
            href="/login"
            className="font-medium text-primary underline-offset-4 hover:underline"
          >
            登录
          </Link>
        </p>
      </div>
    </div>
  )
}
