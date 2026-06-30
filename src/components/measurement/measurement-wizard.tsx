'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { HelpCircle, ChevronRight, ChevronLeft, Check, Ruler } from 'lucide-react'
import { MEASUREMENT_DEFINITIONS, type MeasurementDefinition, type MeasurementCategory } from '@/types/measurement'

const CATEGORY_ORDER: MeasurementCategory[] = ['body', 'torso', 'arm', 'leg', 'preference']

const CATEGORY_LABELS: Record<MeasurementCategory, string> = {
  body: '基础',
  torso: '躯干',
  arm: '手臂',
  leg: '腿部',
  preference: '偏好',
}

interface MeasurementWizardProps {
  initialValues?: Record<string, number>
  onComplete: (values: Record<string, number>) => void
  requiredMeasurements?: string[]
}

function btnClass(variant: 'primary' | 'outline', disabled?: boolean) {
  const base = 'inline-flex shrink-0 items-center justify-center rounded-lg text-sm font-medium transition-all h-9 gap-1.5 px-3'
  const primary = 'bg-primary text-primary-foreground hover:bg-primary/80 active:scale-95'
  const outline = 'border border-border bg-background hover:bg-muted active:scale-95'
  const d = disabled ? 'opacity-50 pointer-events-none' : 'cursor-pointer'
  return `${base} ${variant === 'primary' ? primary : outline} ${d}`
}

export function MeasurementWizard({
  initialValues = {},
  onComplete,
  requiredMeasurements = [],
}: MeasurementWizardProps) {
  const [values, setValues] = useState<Record<string, number>>(initialValues)
  const [activeCategory, setActiveCategory] = useState<MeasurementCategory>('body')
  const [showTooltip, setShowTooltip] = useState<string | null>(null)

  const updateValue = (id: string, value: number) => {
    setValues((prev) => ({ ...prev, [id]: value }))
  }

  const getValue = (id: string) => values[id]

  const requiredSet = new Set(requiredMeasurements)

  const isComplete = () =>
    requiredMeasurements.every((id) => values[id] !== undefined && values[id] > 0)

  const handleComplete = () => {
    const filtered: Record<string, number> = {}
    for (const id of requiredMeasurements) {
      if (values[id]) filtered[id] = values[id]
    }
    onComplete(filtered)
  }

  const eligibleCategories = CATEGORY_ORDER.filter((cat) => {
    return MEASUREMENT_DEFINITIONS.some(
      (d) => d.category === cat && (requiredMeasurements.length === 0 || requiredSet.has(d.id))
    )
  })

  const currentIdx = eligibleCategories.indexOf(activeCategory)

  const currentDefs = MEASUREMENT_DEFINITIONS.filter(
    (d) =>
      d.category === activeCategory &&
      (requiredMeasurements.length === 0 || requiredSet.has(d.id))
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-1 flex-wrap">
        {eligibleCategories.map((cat, i) => (
          <div key={cat} className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setActiveCategory(cat)}
              className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer ${
                cat === activeCategory
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-muted/70'
              }`}
            >
              <span className="hidden sm:inline">{CATEGORY_LABELS[cat]}</span>
              <span className="sm:hidden">{CATEGORY_LABELS[cat].charAt(0)}</span>
            </button>
            {i < eligibleCategories.length - 1 && (
              <ChevronRight className="size-3 text-muted-foreground/40" />
            )}
          </div>
        ))}
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Ruler className="size-4 text-muted-foreground" />
          <h3 className="text-sm font-medium text-muted-foreground">
            {CATEGORY_LABELS[activeCategory]}数据
          </h3>
        </div>

        {currentDefs.map((def) => (
          <MeasurementCard
            key={def.id}
            definition={def}
            value={getValue(def.id)}
            onChange={(v) => updateValue(def.id, v)}
            isRequired={requiredSet.has(def.id)}
            showTooltip={showTooltip === def.id}
            onTooltipToggle={() =>
              setShowTooltip(showTooltip === def.id ? null : def.id)
            }
          />
        ))}
      </div>

      <div className="flex justify-between pt-4 border-t">
        <button
          type="button"
          disabled={currentIdx <= 0}
          onClick={() => {
            if (currentIdx > 0) setActiveCategory(eligibleCategories[currentIdx - 1])
          }}
          className={btnClass('outline', currentIdx <= 0)}
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          上一步
        </button>

        <div className="text-sm text-muted-foreground self-center">
          {currentIdx + 1} / {eligibleCategories.length}
        </div>

        {currentIdx < eligibleCategories.length - 1 ? (
          <button
            type="button"
            onClick={() => setActiveCategory(eligibleCategories[currentIdx + 1])}
            className={btnClass('primary')}
          >
            下一步
            <ChevronRight className="w-4 h-4 ml-1" />
          </button>
        ) : (
          <button
            type="button"
            disabled={!isComplete()}
            onClick={handleComplete}
            className={btnClass('primary', !isComplete())}
          >
            <Check className="w-4 h-4 mr-1" />
            完成测量
          </button>
        )}
      </div>
    </div>
  )
}

function MeasurementCard({
  definition,
  value,
  onChange,
  isRequired,
  showTooltip,
  onTooltipToggle,
}: {
  definition: MeasurementDefinition
  value: number | undefined
  onChange: (value: number) => void
  isRequired: boolean
  showTooltip: boolean
  onTooltipToggle: () => void
}) {
  const currentValue = value ?? definition.min

  return (
    <Card className={value ? 'border-primary/30' : ''}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CardTitle className="text-base">
              {definition.name}
              {isRequired && <span className="text-red-500 ml-1">*</span>}
            </CardTitle>
            <button
              type="button"
              onClick={onTooltipToggle}
              className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              title={definition.description}
            >
              <HelpCircle className="w-4 h-4" />
            </button>
          </div>
          <Badge variant="outline">mm</Badge>
        </div>
        <CardDescription>{definition.nameEn}</CardDescription>
        {showTooltip && (
          <p className="text-xs text-muted-foreground bg-muted/50 rounded-md p-2 mt-1">
            {definition.description}
          </p>
        )}
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-3">
          <input
            type="range"
            value={currentValue}
            min={definition.min}
            max={definition.max}
            step={definition.step}
            onChange={(e) => onChange(Number(e.target.value))}
            className="flex-1 h-2 rounded-full appearance-none bg-secondary cursor-pointer accent-primary"
            style={{
              WebkitAppearance: 'none',
              appearance: 'none',
            }}
          />
          <input
            type="number"
            value={currentValue}
            onChange={(e) => {
              const v = Number(e.target.value)
              if (!isNaN(v) && v >= definition.min && v <= definition.max) onChange(v)
            }}
            className="w-24 rounded-md border border-input bg-background px-3 py-1.5 text-sm text-center
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            min={definition.min}
            max={definition.max}
            step={definition.step}
          />
        </div>
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{definition.min}mm</span>
          <span>{currentValue}mm</span>
          <span>{definition.max}mm</span>
        </div>
      </CardContent>
    </Card>
  )
}
