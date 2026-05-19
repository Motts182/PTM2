"use client"

import { useRef, useCallback, useState, useEffect } from "react"
import { useDragHandle } from "./useDragHandle"

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
  const [isDragging, setIsDragging] = useState(false)
  const [editing, setEditing] = useState<"min" | "max" | null>(null)
  const [editValue, setEditValue] = useState("")
  const [validationError, setValidationError] = useState<string | null>(null)
  const trackRef = useRef<HTMLDivElement>(null)

  const isSteps = steps !== undefined && steps.length > 0
  const totalSteps = isSteps ? steps.length - 1 : 0

  useEffect(() => {
    document.body.style.cursor = isDragging ? "grabbing" : ""
    document.body.style.userSelect = isDragging ? "none" : ""
    return () => {
      document.body.style.cursor = ""
      document.body.style.userSelect = ""
    }
  }, [isDragging])

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

  const moveByKey = useCallback(
    (key: string, isMin: boolean) => {
      const lo = isSteps ? 0 : minLimit
      const hi = isSteps ? totalSteps : maxLimit
      const current = isMin ? currentMin : currentMax

      let next: number
      if (key === "ArrowRight" || key === "ArrowUp") next = current + 1
      else if (key === "ArrowLeft" || key === "ArrowDown") next = current - 1
      else if (key === "Home") next = lo
      else if (key === "End") next = hi
      else return

      next = Math.min(Math.max(next, lo), hi)
      setLastMoved(isMin ? "min" : "max")
      setValidationError(null)
      if (isMin && next < currentMax) onChange({ min: next, max: currentMax })
      if (!isMin && next > currentMin) onChange({ min: currentMin, max: next })
    },
    [isSteps, totalSteps, minLimit, maxLimit, currentMin, currentMax, onChange],
  )

  const stopDragging = () => setIsDragging(false)

  const { startDrag, startTouch } = useDragHandle(moveHandle, stopDragging)

  const onMouseDown = (isMin: boolean) => {
    setValidationError(null)
    setLastMoved(isMin ? "min" : "max")
    setIsDragging(true)
    startDrag(isMin)
  }

  const onTouchStart = (isMin: boolean) => {
    setLastMoved(isMin ? "min" : "max")
    setIsDragging(true)
    startTouch(isMin)
  }

  const startEdit = (which: "min" | "max") => {
    setValidationError(null)
    const current = which === "min" ? currentMin : currentMax
    setEditValue(String(current))
    setEditing(which)
  }

  const commitEdit = (which: "min" | "max") => {
    setEditing(null)
    const val = parseInt(editValue, 10)
    if (isNaN(val)) return
    if (which === "min") {
      if (val < minLimit) {
        setValidationError(`El valor mínimo permitido es ${minLimit}`)
        return
      }
      if (val >= currentMax) {
        setValidationError(`El valor mínimo debe ser menor que el máximo (${currentMax})`)
        return
      }
      setValidationError(null)
      onChange({ min: val, max: currentMax })
    } else {
      if (val > maxLimit) {
        setValidationError(`El valor máximo permitido es ${maxLimit}`)
        return
      }
      if (val <= currentMin) {
        setValidationError(`El valor máximo debe ser mayor que el mínimo (${currentMin})`)
        return
      }
      setValidationError(null)
      onChange({ min: currentMin, max: val })
    }
  }

  const labelInputProps = (which: "min" | "max") => ({
    value: editValue,
    autoFocus: true,
    inputMode: "decimal" as const,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => setEditValue(e.target.value),
    onFocus: (e: React.FocusEvent<HTMLInputElement>) => e.target.select(),
    onBlur: () => commitEdit(which),
    onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") commitEdit(which)
      if (e.key === "Escape") setEditing(null)
    },
  })

  if (steps !== undefined && steps.length === 0) return null

  const minLabel = isSteps ? `$${steps![currentMin]?.toFixed(2)}` : String(currentMin)
  const maxLabel = isSteps ? `$${steps![currentMax]?.toFixed(2)}` : String(currentMax)

  const handleClass = `absolute w-6 h-6 bg-white rounded-full -top-2.5 -translate-x-1/2
    hover:scale-110 hover:cursor-grab transition-transform
    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black`

  return (
    <div className="flex flex-col items-center gap-3 px-6 py-10 w-full max-w-lg">
    <div className="flex gap-4 items-center w-full justify-center">
      {!isSteps && editing === "min" ? (
        <input
          className="w-16 text-left font-medium bg-transparent border-b border-white outline-none"
          {...labelInputProps("min")}
        />
      ) : (
        <span
          className={`w-16 text-left font-medium ${!isSteps ? "cursor-pointer hover:opacity-70" : ""}`}
          onClick={!isSteps ? () => startEdit("min") : undefined}
        >
          {minLabel}
        </span>
      )}

      <div className="relative w-40 sm:w-56 md:w-72 h-1 bg-gray-600 rounded" ref={trackRef}>
        <div className="relative w-full h-1">
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
            role="slider"
            tabIndex={0}
            aria-label="Mínimo"
            aria-valuemin={isSteps ? 0 : minLimit}
            aria-valuemax={isSteps ? totalSteps : maxLimit}
            aria-valuenow={currentMin}
            aria-valuetext={minLabel}
            onMouseDown={() => onMouseDown(true)}
            onTouchStart={() => onTouchStart(true)}
            onKeyDown={(e) => {
              if (["ArrowRight","ArrowLeft","ArrowUp","ArrowDown","Home","End"].includes(e.key)) {
                e.preventDefault()
                moveByKey(e.key, true)
              }
            }}
            className={`${handleClass} ${lastMoved === "min" ? "z-20" : "z-10"}`}
            style={{ left: `${getPercent(currentMin)}%` }}
          />
          <div
            role="slider"
            tabIndex={0}
            aria-label="Máximo"
            aria-valuemin={isSteps ? 0 : minLimit}
            aria-valuemax={isSteps ? totalSteps : maxLimit}
            aria-valuenow={currentMax}
            aria-valuetext={maxLabel}
            onMouseDown={() => onMouseDown(false)}
            onTouchStart={() => onTouchStart(false)}
            onKeyDown={(e) => {
              if (["ArrowRight","ArrowLeft","ArrowUp","ArrowDown","Home","End"].includes(e.key)) {
                e.preventDefault()
                moveByKey(e.key, false)
              }
            }}
            className={`${handleClass} ${lastMoved === "max" ? "z-20" : "z-10"}`}
            style={{ left: `${getPercent(currentMax)}%` }}
          />
        </div>
      </div>

      {!isSteps && editing === "max" ? (
        <input
          className="w-16 text-right font-medium bg-transparent border-b border-white outline-none"
          {...labelInputProps("max")}
        />
      ) : (
        <span
          className={`w-16 text-right font-medium ${!isSteps ? "cursor-pointer hover:opacity-70" : ""}`}
          onClick={!isSteps ? () => startEdit("max") : undefined}
        >
          {maxLabel}
        </span>
      )}
    </div>
      {validationError && (
        <p className="text-red-400 text-sm">{validationError}</p>
      )}
    </div>
  )
}
