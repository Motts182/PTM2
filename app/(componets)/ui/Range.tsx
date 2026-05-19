"use client"

import { useRef, useCallback, useState } from "react"

interface RangeProps {
  steps?: number[]
  minLimit?: number
  maxLimit?: number
  currentMin: number
  currentMax: number
  onChange: (values: { min: number; max: number }) => void
}

export default function Range({
  steps,
  minLimit = 0,
  maxLimit = 100,
  currentMin,
  currentMax,
  onChange,
}: RangeProps) {
  const [lastMoved, setLastMoved] = useState<"min" | "max" | null>(null)
  const trackRef = useRef<HTMLDivElement>(null)

  const isSteps = steps !== undefined && steps.length > 0
  const totalSteps = isSteps ? steps.length - 1 : 0

  const getPercent = (value: number) =>
    isSteps
      ? (value / totalSteps) * 100
      : ((value - minLimit) / (maxLimit - minLimit)) * 100

  const moveHandle = useCallback(
    (clientX: number, isMin: boolean) => {
      if (!trackRef.current) return

      const rect = trackRef.current.getBoundingClientRect()
      let percentage = ((clientX - rect.left) / rect.width) * 100
      percentage = Math.min(Math.max(percentage, 0), 100)

      const newValue = isSteps
        ? Math.round((percentage / 100) * totalSteps)
        : Math.round((percentage / 100) * (maxLimit - minLimit) + minLimit)

      if (isMin) {
        if (newValue < currentMax) onChange({ min: newValue, max: currentMax })
      } else {
        if (newValue > currentMin) onChange({ min: currentMin, max: newValue })
      }
    },
    [isSteps, totalSteps, minLimit, maxLimit, currentMin, currentMax, onChange],
  )

  const onMouseDown = (isMin: boolean) => {
    setLastMoved(isMin ? "min" : "max")
    const onMouseMove = (e: MouseEvent) => moveHandle(e.clientX, isMin)
    const onMouseUp = () => {
      document.removeEventListener("mousemove", onMouseMove)
      document.removeEventListener("mouseup", onMouseUp)
    }
    document.addEventListener("mousemove", onMouseMove)
    document.addEventListener("mouseup", onMouseUp)
  }

  if (isSteps && steps!.length === 0) return null

  const minLabel = isSteps ? `$${steps![currentMin]?.toFixed(2)}` : String(currentMin)
  const maxLabel = isSteps ? `$${steps![currentMax]?.toFixed(2)}` : String(currentMax)

  return (
    <div className="flex gap-4 items-center p-20">
      <span className="w-16 text-left font-medium">{minLabel}</span>

      <div className="relative w-64 h-1 bg-gray-600 rounded" ref={trackRef}>
        <div className="relative w-64 h-1">
          <div
            className="absolute h-full bg-white"
            style={{
              left: `${getPercent(currentMin)}%`,
              right: `${100 - getPercent(currentMax)}%`,
            }}
          />

          {isSteps &&
            steps!.map((_, index) => (
              <div
                key={index}
                className="absolute w-0.5 h-1 bg-gray-400 top-0"
                style={{ left: `${getPercent(index)}%`, transform: "translateX(-50%)" }}
              />
            ))}

          <div
            onMouseDown={() => onMouseDown(true)}
            className={`absolute w-6 h-6 bg-white rounded-full -top-2.5 -translate-x-1/2 cursor-pointer hover:scale-110 transition-transform ${
              lastMoved === "min" ? "z-20" : "z-10"
            }`}
            style={{ left: `${getPercent(currentMin)}%` }}
          />
          <div
            onMouseDown={() => onMouseDown(false)}
            className={`absolute w-6 h-6 bg-white rounded-full -top-2.5 -translate-x-1/2 cursor-pointer hover:scale-110 transition-transform ${
              lastMoved === "max" ? "z-20" : "z-10"
            }`}
            style={{ left: `${getPercent(currentMax)}%` }}
          />
        </div>
      </div>

      <span className="w-16 text-right font-medium">{maxLabel}</span>
    </div>
  )
}
