import Link from 'next/link'

export default function MeasureIndexPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-20 text-center">
      <h1 className="text-2xl font-bold mb-4">量体定制</h1>
      <p className="text-muted-foreground mb-6">
        请先从款式目录中选择一件汉服，然后进入该款式的量体页面。
      </p>
      <Link
        href="/"
        className="inline-flex items-center justify-center rounded-lg bg-primary text-primary-foreground text-sm font-medium h-10 px-4 hover:bg-primary/80"
      >
        浏览款式
      </Link>
    </div>
  )
}
