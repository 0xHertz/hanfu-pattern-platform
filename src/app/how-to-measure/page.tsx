import Link from "next/link"
import type { ReactNode } from "react"
import { Home, ChevronRight } from "lucide-react"
import { MEASUREMENT_DEFINITIONS } from "@/types/measurement"

/* ─── Inline SVG Illustrations ─── */

function HeightSvg() {
  return (
    <svg viewBox="0 0 200 260" fill="none" className="h-full w-full">
      {/* Head */}
      <ellipse cx={100} cy={28} rx={13} ry={15} stroke="#5a3e2b" strokeWidth={2} />
      {/* Neck */}
      <line x1={100} y1={43} x2={100} y2={52} stroke="#5a3e2b" strokeWidth={2} />
      {/* Shoulders */}
      <line x1={72} y1={52} x2={128} y2={52} stroke="#5a3e2b" strokeWidth={2} />
      {/* Torso */}
      <path d="M78 54 L122 54 L114 96 L86 96Z" stroke="#5a3e2b" strokeWidth={1.5} fill="#faf0ea" />
      {/* Arms */}
      <path d="M78 58 L66 78 L60 100" stroke="#5a3e2b" strokeWidth={1.5} strokeLinecap="round" />
      <path d="M122 58 L134 78 L140 100" stroke="#5a3e2b" strokeWidth={1.5} strokeLinecap="round" />
      {/* Hips */}
      <line x1={82} y1={96} x2={118} y2={96} stroke="#5a3e2b" strokeWidth={1.5} />
      {/* Legs */}
      <line x1={88} y1={96} x2={85} y2={180} stroke="#5a3e2b" strokeWidth={1.5} strokeLinecap="round" />
      <line x1={112} y1={96} x2={115} y2={180} stroke="#5a3e2b" strokeWidth={1.5} strokeLinecap="round" />
      {/* Feet */}
      <line x1={78} y1={190} x2={92} y2={190} stroke="#5a3e2b" strokeWidth={1.5} strokeLinecap="round" />
      <line x1={108} y1={190} x2={122} y2={190} stroke="#5a3e2b" strokeWidth={1.5} strokeLinecap="round" />
      {/* Measurement line */}
      <line x1={160} y1={15} x2={160} y2={195} stroke="#c0392b" strokeWidth={2} strokeDasharray="5 4" />
      {/* Arrows */}
      <polygon points="160,12 156,22 164,22" fill="#c0392b" />
      <polygon points="160,198 156,188 164,188" fill="#c0392b" />
      {/* Label */}
      <text x={168} y={105} fontSize={11} fill="#8b4513" fontFamily="serif">身高</text>
    </svg>
  )
}

function BustSvg() {
  return (
    <svg viewBox="0 0 200 200" fill="none" className="h-full w-full">
      {/* Head */}
      <ellipse cx={100} cy={22} rx={12} ry={14} stroke="#5a3e2b" strokeWidth={2} />
      <line x1={100} y1={36} x2={100} y2={44} stroke="#5a3e2b" strokeWidth={2} />
      {/* Shoulders */}
      <line x1={70} y1={44} x2={130} y2={44} stroke="#5a3e2b" strokeWidth={2} />
      {/* Torso */}
      <path d="M74 46 L126 46 L120 80 L118 120 L82 120 L80 80Z" stroke="#5a3e2b" strokeWidth={1.5} fill="#faf0ea" />
      {/* Arms */}
      <path d="M74 50 L62 70 L56 95" stroke="#5a3e2b" strokeWidth={1.5} strokeLinecap="round" />
      <path d="M126 50 L138 70 L144 95" stroke="#5a3e2b" strokeWidth={1.5} strokeLinecap="round" />
      {/* Bust measurement - horizontal line */}
      <line x1={56} y1={70} x2={144} y2={70} stroke="#c0392b" strokeWidth={2} strokeDasharray="5 4" />
      {/* Arrows */}
      <polygon points="54,70 62,66 62,74" fill="#c0392b" />
      <polygon points="146,70 138,66 138,74" fill="#c0392b" />
      <text x={90} y={67} fontSize={10} fill="#8b4513" fontFamily="serif" textAnchor="middle">净胸围</text>
    </svg>
  )
}

function WaistSvg() {
  return (
    <svg viewBox="0 0 200 200" fill="none" className="h-full w-full">
      {/* Head */}
      <ellipse cx={100} cy={22} rx={12} ry={14} stroke="#5a3e2b" strokeWidth={2} />
      <line x1={100} y1={36} x2={100} y2={44} stroke="#5a3e2b" strokeWidth={2} />
      <line x1={70} y1={44} x2={130} y2={44} stroke="#5a3e2b" strokeWidth={2} />
      <path d="M74 46 L126 46 L120 78 L115 105 L85 105 L80 78Z" stroke="#5a3e2b" strokeWidth={1.5} fill="#faf0ea" />
      <path d="M74 50 L62 70 L56 95" stroke="#5a3e2b" strokeWidth={1.5} strokeLinecap="round" />
      <path d="M126 50 L138 70 L144 95" stroke="#5a3e2b" strokeWidth={1.5} strokeLinecap="round" />
      {/* Waist measurement */}
      <line x1={56} y1={95} x2={144} y2={95} stroke="#c0392b" strokeWidth={2} strokeDasharray="5 4" />
      <polygon points="54,95 62,91 62,99" fill="#c0392b" />
      <polygon points="146,95 138,91 138,99" fill="#c0392b" />
      <text x={100} y={92} fontSize={10} fill="#8b4513" fontFamily="serif" textAnchor="middle">净腰围</text>
    </svg>
  )
}

function HipSvg() {
  return (
    <svg viewBox="0 0 200 200" fill="none" className="h-full w-full">
      {/* Side profile body */}
      {/* Head */}
      <ellipse cx={100} cy={22} rx={12} ry={14} stroke="#5a3e2b" strokeWidth={2} />
      <line x1={100} y1={36} x2={100} y2={44} stroke="#5a3e2b" strokeWidth={2} />
      <line x1={76} y1={44} x2={124} y2={44} stroke="#5a3e2b" strokeWidth={2} />
      {/* Torso - slightly different shape to suggest profile */}
      <path d="M78 46 L122 46 L125 80 L130 120 L70 120 L75 80Z" stroke="#5a3e2b" strokeWidth={1.5} fill="#faf0ea" />
      {/* Arms hint */}
      <path d="M78 50 L66 72 L62 95" stroke="#5a3e2b" strokeWidth={1.5} strokeLinecap="round" />
      <path d="M122 50 L134 72 L138 95" stroke="#5a3e2b" strokeWidth={1.5} strokeLinecap="round" />
      {/* Hip measurement - lower than waist */}
      <line x1={52} y1={110} x2={148} y2={110} stroke="#c0392b" strokeWidth={2} strokeDasharray="5 4" />
      <polygon points="50,110 58,106 58,114" fill="#c0392b" />
      <polygon points="150,110 142,106 142,114" fill="#c0392b" />
      <text x={100} y={107} fontSize={10} fill="#8b4513" fontFamily="serif" textAnchor="middle">净臀围</text>
    </svg>
  )
}

function ShoulderWidthSvg() {
  return (
    <svg viewBox="0 0 200 200" fill="none" className="h-full w-full">
      {/* Head - back view */}
      <ellipse cx={100} cy={22} rx={12} ry={14} stroke="#5a3e2b" strokeWidth={2} />
      <line x1={100} y1={36} x2={100} y2={44} stroke="#5a3e2b" strokeWidth={2} />
      {/* Broad shoulders - back view */}
      <line x1={62} y1={45} x2={138} y2={45} stroke="#5a3e2b" strokeWidth={2} />
      <path d="M65 47 L135 47 L128 80 L124 120 L76 120 L72 80Z" stroke="#5a3e2b" strokeWidth={1.5} fill="#faf0ea" />
      {/* Arms */}
      <path d="M65 50 L52 72 L48 100" stroke="#5a3e2b" strokeWidth={1.5} strokeLinecap="round" />
      <path d="M135 50 L148 72 L152 100" stroke="#5a3e2b" strokeWidth={1.5} strokeLinecap="round" />
      {/* Shoulder width measurement */}
      <line x1={60} y1={38} x2={140} y2={38} stroke="#c0392b" strokeWidth={2} strokeDasharray="5 4" />
      <polygon points="58,38 66,34 66,42" fill="#c0392b" />
      <polygon points="142,38 134,34 134,42" fill="#c0392b" />
      <text x={100} y={35} fontSize={10} fill="#8b4513" fontFamily="serif" textAnchor="middle">总肩宽</text>
    </svg>
  )
}

function NeckCircumferenceSvg() {
  return (
    <svg viewBox="0 0 200 200" fill="none" className="h-full w-full">
      {/* Closer view - head and shoulders only */}
      {/* Head */}
      <ellipse cx={100} cy={35} rx={16} ry={18} stroke="#5a3e2b" strokeWidth={2} />
      {/* Neck */}
      <rect x={92} y={53} width={16} height={18} rx={3} stroke="#5a3e2b" strokeWidth={1.5} fill="#faf0ea" />
      {/* Shoulders */}
      <path d="M60 80 L92 72 L108 72 L140 80" stroke="#5a3e2b" strokeWidth={2} strokeLinecap="round" />
      <path d="M60 82 L50 100" stroke="#5a3e2b" strokeWidth={1.5} strokeLinecap="round" />
      <path d="M140 82 L150 100" stroke="#5a3e2b" strokeWidth={1.5} strokeLinecap="round" />
      {/* Top of chest */}
      <path d="M70 98 L60 82" stroke="#5a3e2b" strokeWidth={1.5} />
      <path d="M130 98 L140 82" stroke="#5a3e2b" strokeWidth={1.5} />
      {/* Neck measurement - ellipse around neck */}
      <ellipse cx={100} cy={65} rx={20} ry={10} stroke="#c0392b" strokeWidth={2} strokeDasharray="5 4" />
      <text x={100} y={115} fontSize={10} fill="#8b4513" fontFamily="serif" textAnchor="middle">颈围</text>
    </svg>
  )
}

function ArmSpanSvg() {
  return (
    <svg viewBox="0 0 200 200" fill="none" className="h-full w-full">
      {/* Head */}
      <ellipse cx={100} cy={22} rx={12} ry={14} stroke="#5a3e2b" strokeWidth={2} />
      <line x1={100} y1={36} x2={100} y2={44} stroke="#5a3e2b" strokeWidth={2} />
      <line x1={75} y1={44} x2={125} y2={44} stroke="#5a3e2b" strokeWidth={2} />
      <path d="M78 46 L122 46 L114 80 L112 100 L88 100 L86 80Z" stroke="#5a3e2b" strokeWidth={1.5} fill="#faf0ea" />
      {/* Arms extended horizontally */}
      <line x1={75} y1={50} x2={20} y2={52} stroke="#5a3e2b" strokeWidth={1.5} strokeLinecap="round" />
      <line x1={125} y1={50} x2={180} y2={52} stroke="#5a3e2b" strokeWidth={1.5} strokeLinecap="round" />
      {/* Hands */}
      <circle cx={18} cy={52} r={3} stroke="#5a3e2b" strokeWidth={1.5} />
      <circle cx={182} cy={52} r={3} stroke="#5a3e2b" strokeWidth={1.5} />
      {/* Legs */}
      <line x1={90} y1={100} x2={87} y2={165} stroke="#5a3e2b" strokeWidth={1.5} strokeLinecap="round" />
      <line x1={110} y1={100} x2={113} y2={165} stroke="#5a3e2b" strokeWidth={1.5} strokeLinecap="round" />
      {/* Feet */}
      <line x1={80} y1={173} x2={94} y2={173} stroke="#5a3e2b" strokeWidth={1.5} strokeLinecap="round" />
      <line x1={106} y1={173} x2={120} y2={173} stroke="#5a3e2b" strokeWidth={1.5} strokeLinecap="round" />
      {/* Arm span measurement */}
      <line x1={16} y1={60} x2={184} y2={60} stroke="#c0392b" strokeWidth={2} strokeDasharray="5 4" />
      <polygon points="14,60 22,56 22,64" fill="#c0392b" />
      <polygon points="186,60 178,56 178,64" fill="#c0392b" />
      <text x={100} y={57} fontSize={9} fill="#8b4513" fontFamily="serif" textAnchor="middle">通臂长</text>
    </svg>
  )
}

function ArmLengthSvg() {
  return (
    <svg viewBox="0 0 200 200" fill="none" className="h-full w-full">
      {/* Head */}
      <ellipse cx={100} cy={22} rx={12} ry={14} stroke="#5a3e2b" strokeWidth={2} />
      <line x1={100} y1={36} x2={100} y2={44} stroke="#5a3e2b" strokeWidth={2} />
      <line x1={76} y1={44} x2={124} y2={44} stroke="#5a3e2b" strokeWidth={2} />
      <path d="M79 46 L121 46 L115 80 L113 105 L87 105 L85 80Z" stroke="#5a3e2b" strokeWidth={1.5} fill="#faf0ea" />
      {/* Left arm reaching down */}
      <path d="M76 50 L64 68 L58 90 L52 120 L48 140" stroke="#5a3e2b" strokeWidth={1.5} strokeLinecap="round" />
      {/* Right arm - measured */}
      <path d="M124 50 L140 70 L148 100 L150 120" stroke="#5a3e2b" strokeWidth={1.5} strokeLinecap="round" />
      {/* Legs */}
      <line x1={89} y1={105} x2={87} y2={165} stroke="#5a3e2b" strokeWidth={1.5} strokeLinecap="round" />
      <line x1={111} y1={105} x2={113} y2={165} stroke="#5a3e2b" strokeWidth={1.5} strokeLinecap="round" />
      {/* Arm length measurement */}
      <line x1={160} y1={48} x2={160} y2={122} stroke="#c0392b" strokeWidth={2} strokeDasharray="5 4" />
      <polygon points="160,46 156,54 164,54" fill="#c0392b" />
      <polygon points="160,124 156,116 164,116" fill="#c0392b" />
      <text x={168} y={88} fontSize={10} fill="#8b4513" fontFamily="serif">臂长</text>
    </svg>
  )
}

function GarmentLengthSvg() {
  return (
    <svg viewBox="0 0 200 260" fill="none" className="h-full w-full">
      {/* Head - back view */}
      <ellipse cx={100} cy={28} rx={13} ry={15} stroke="#5a3e2b" strokeWidth={2} />
      <line x1={100} y1={43} x2={100} y2={52} stroke="#5a3e2b" strokeWidth={2} />
      <line x1={72} y1={52} x2={128} y2={52} stroke="#5a3e2b" strokeWidth={2} />
      <path d="M76 54 L124 54 L118 100 L114 130 L86 130 L82 100Z" stroke="#5a3e2b" strokeWidth={1.5} fill="#faf0ea" />
      <path d="M76 58 L64 78 L58 100" stroke="#5a3e2b" strokeWidth={1.5} strokeLinecap="round" />
      <path d="M124 58 L136 78 L142 100" stroke="#5a3e2b" strokeWidth={1.5} strokeLinecap="round" />
      <line x1={86} y1={130} x2={114} y2={130} stroke="#5a3e2b" strokeWidth={1.5} />
      {/* Garment extending below */}
      <path d="M86 130 L84 180 L116 180 L114 130" stroke="#5a3e2b" strokeWidth={1.5} strokeDasharray="3 3" fill="#faf0ea" />
      <line x1={88} y1={130} x2={86} y2={190} stroke="#5a3e2b" strokeWidth={1.5} strokeLinecap="round" />
      <line x1={112} y1={130} x2={114} y2={190} stroke="#5a3e2b" strokeWidth={1.5} strokeLinecap="round" />
      {/* Measurement line */}
      <line x1={155} y1={48} x2={155} y2={178} stroke="#c0392b" strokeWidth={2} strokeDasharray="5 4" />
      <polygon points="155,46 151,54 159,54" fill="#c0392b" />
      <polygon points="155,180 151,172 159,172" fill="#c0392b" />
      <text x={163} y={118} fontSize={10} fill="#8b4513" fontFamily="serif">衣长</text>
    </svg>
  )
}

function SkirtLengthSvg() {
  return (
    <svg viewBox="0 0 200 260" fill="none" className="h-full w-full">
      {/* Head */}
      <ellipse cx={100} cy={26} rx={12} ry={14} stroke="#5a3e2b" strokeWidth={2} />
      <line x1={100} y1={40} x2={100} y2={48} stroke="#5a3e2b" strokeWidth={2} />
      <line x1={74} y1={48} x2={126} y2={48} stroke="#5a3e2b" strokeWidth={2} />
      <path d="M78 50 L122 50 L118 78 L116 90 L84 90 L82 78Z" stroke="#5a3e2b" strokeWidth={1.5} fill="#faf0ea" />
      <path d="M78 54 L66 72 L60 92" stroke="#5a3e2b" strokeWidth={1.5} strokeLinecap="round" />
      <path d="M122 54 L134 72 L140 92" stroke="#5a3e2b" strokeWidth={1.5} strokeLinecap="round" />
      {/* Hips */}
      <line x1={84} y1={90} x2={116} y2={90} stroke="#5a3e2b" strokeWidth={1.5} />
      {/* Skirt extending down */}
      <path d="M86 92 L78 175 L122 175 L114 92" stroke="#5a3e2b" strokeWidth={1.5} fill="#faf0ea" />
      {/* Legs peeking below */}
      <line x1={90} y1={175} x2={88} y2={200} stroke="#5a3e2b" strokeWidth={1.5} strokeLinecap="round" />
      <line x1={110} y1={175} x2={112} y2={200} stroke="#5a3e2b" strokeWidth={1.5} strokeLinecap="round" />
      <line x1={82} y1={208} x2={96} y2={208} stroke="#5a3e2b" strokeWidth={1.5} strokeLinecap="round" />
      <line x1={104} y1={208} x2={118} y2={208} stroke="#5a3e2b" strokeWidth={1.5} strokeLinecap="round" />
      {/* Measurement line */}
      <line x1={155} y1={92} x2={155} y2={200} stroke="#c0392b" strokeWidth={2} strokeDasharray="5 4" />
      <polygon points="155,90 151,98 159,98" fill="#c0392b" />
      <polygon points="155,202 151,194 159,194" fill="#c0392b" />
      <text x={163} y={150} fontSize={10} fill="#8b4513" fontFamily="serif">裙长</text>
    </svg>
  )
}

/* ─── Measurement ID → SVG Map ─── */

const SVG_MAP: Record<string, ReactNode> = {
  height: <HeightSvg />,
  bust: <BustSvg />,
  waist: <WaistSvg />,
  hip: <HipSvg />,
  shoulderWidth: <ShoulderWidthSvg />,
  neckCircumference: <NeckCircumferenceSvg />,
  armSpan: <ArmSpanSvg />,
  armLength: <ArmLengthSvg />,
  garmentLength: <GarmentLengthSvg />,
  skirtLength: <SkirtLengthSvg />,
}

/* ─── Category labels ─── */

const CATEGORY_LABELS: Record<string, string> = {
  body: "基础数据",
  torso: "躯干",
  arm: "手臂",
  preference: "偏好",
}

/* ─── Page ─── */

export default function HowToMeasurePage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center gap-1.5 text-sm text-muted-foreground">
        <Link href="/" className="flex items-center gap-1 hover:text-foreground transition-colors">
          <Home className="size-3.5" />
          首页
        </Link>
        <ChevronRight className="size-3.5" />
        <span className="text-foreground font-medium">量体指南</span>
      </nav>

      {/* Header */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          量体指南
        </h1>
        <p className="mt-2 text-base text-muted-foreground">
          请按照图示准确测量身体各部位数据，输入到定制页面中即可生成属于你的纸样
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[oklch(0.72_0.10_65)/30] bg-[oklch(0.72_0.10_65)/10] px-3 py-1 text-xs font-medium text-[oklch(0.50_0.08_50)]">
            测量要点
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
            使用软尺贴身穿轻薄衣物测量
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
            保持自然站姿，呼吸正常
          </span>
        </div>
      </div>

      {/* Measurement grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2">
        {MEASUREMENT_DEFINITIONS.map((m) => (
          <div
            key={m.id}
            className="group relative overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="flex flex-col sm:flex-row">
              {/* SVG illustration */}
              <div className="flex aspect-square w-full items-center justify-center bg-gradient-to-br from-secondary/50 to-muted/30 p-4 sm:w-[180px] sm:aspect-auto sm:shrink-0">
                <div className="h-full w-full max-w-[160px]">
                  {SVG_MAP[m.id]}
                </div>
              </div>

              {/* Info */}
              <div className="flex flex-1 flex-col p-4 sm:p-5">
                <div className="mb-1 flex items-start justify-between gap-2">
                  <div>
                    <h2 className="text-base font-semibold tracking-tight text-foreground">
                      {m.name}
                    </h2>
                    <p className="text-xs text-muted-foreground">{m.nameEn}</p>
                  </div>
                  <span className="inline-flex shrink-0 items-center rounded-full border border-border px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                    {CATEGORY_LABELS[m.category] ?? m.category}
                  </span>
                </div>

                <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                  {m.description}
                </p>

                <div className="mt-3 flex items-center gap-3 border-t border-border pt-3 text-xs text-muted-foreground">
                  <span>
                    范围：<strong className="text-foreground">{(m.min / 10).toFixed(0)}</strong> –{" "}
                    <strong className="text-foreground">{(m.max / 10).toFixed(0)}</strong> cm
                  </span>
                  {m.required && (
                    <span className="ml-auto text-[oklch(0.60_0.12_40)]">* 必填</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
