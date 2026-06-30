import Link from 'next/link'
import { User, Settings, Clock } from 'lucide-react'

export default function ProfilePage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-20 text-center">
      <User className="size-12 mx-auto text-muted-foreground mb-4" />
      <h1 className="text-2xl font-bold mb-2">我的</h1>
      <p className="text-muted-foreground">
        登录后可以保存测量数据和图纸历史
      </p>
      <div className="mt-6">
        <Link
          href="/login"
          className="inline-flex items-center justify-center rounded-lg bg-primary text-primary-foreground text-sm font-medium h-10 px-4 hover:bg-primary/80"
        >
          登录 / 注册
        </Link>
      </div>
    </div>
  )
}
