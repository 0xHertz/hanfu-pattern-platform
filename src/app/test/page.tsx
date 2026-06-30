'use client'

import { useState } from 'react'

export default function TestPage() {
  const [count, setCount] = useState(0)
  const [sliderVal, setSliderVal] = useState(50)

  return (
    <div className="p-10 max-w-md mx-auto space-y-6">
      <h1 className="text-2xl font-bold">交互测试</h1>

      <div className="space-y-2">
        <p>计数器: <strong>{count}</strong></p>
        <button
          type="button"
          onClick={() => setCount(c => c + 1)}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-lg cursor-pointer"
        >
          点击 +1
        </button>
      </div>

      <div className="space-y-2">
        <p>滑块值: <strong>{sliderVal}</strong></p>
        <input
          type="range"
          value={sliderVal}
          min={0}
          max={100}
          step={1}
          onChange={(e) => setSliderVal(Number(e.target.value))}
          className="w-full cursor-pointer"
        />
      </div>
    </div>
  )
}
