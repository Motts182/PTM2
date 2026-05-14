"use client"

import { useRef, useCallback, useState } from "react"

interface RangeProps {
  // Limites
  minLimit: number
  maxLimit: number
  // Valores
  currentMin: number
  currentMax: number
  onChange: (values: { min: number; max: number }) => void
}

export default function Range({
  minLimit,
  maxLimit,
  currentMin,
  currentMax,
  onChange,
}: RangeProps) {
  const [lastMoved, setLastMoved] = useState<"min" | "max" | null>(null)
  const trackRef = useRef<HTMLDivElement>(null)

  const getPercent = (value: number) =>
    ((value - minLimit) / (maxLimit - minLimit)) * 100

  const moveHandle = useCallback(
    (clientX: number, isMin: boolean) => {
      if (!trackRef.current) return

      // obtenemos el rectangulo del track
      const rect = trackRef.current.getBoundingClientRect()
      // obtenemos el porcentaje
      let percentage = ((clientX - rect.left) / rect.width) * 100
      // limitamos el porcentaje
      percentage = Math.min(Math.max(percentage, 0), 100)
      // calculamos el nuevo valor redondeandolo
      const newValue = Math.round(
        (percentage / 100) * (maxLimit - minLimit) + minLimit,
      )

      if (isMin) {
        // Evita que el mínimo supere al máximo
        if (newValue < currentMax) {
          onChange({ min: newValue, max: currentMax })
        }
      } else {
        // Evita que el máximo sea menor al mínimo
        if (newValue > currentMin) {
          onChange({ min: currentMin, max: newValue })
        }
      }
    },
    [minLimit, maxLimit, currentMin, currentMax, onChange],
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

  return (
    <div className="flex gap-4 items-center p-20">
      {/* Etiquetas editables  */}
      <span className="w-16 text-left font-medium">{currentMin}</span>

      <div className="relative w-64 h-1 bg-gray-600 rounded" ref={trackRef}>
        <div className="relative w-64 h-1">
          {/* Barra de progreso visual */}
          <div
            className="absolute h-full bg-white"
            style={{
              left: `${getPercent(currentMin)}%`,
              right: `${100 - getPercent(currentMax)}%`,
            }}
          />

          <div
            onMouseDown={() => onMouseDown(true)}
            className={`absolute w-6 h-6 bg-white rounded-full -top-2.5 -translate-x-1/2 cursor-pointer hover:scale-110 transition-transform ${
              lastMoved === "min" ? "z-20" : "z-10"
            }`}
            style={{ left: `${getPercent(currentMin)}%` }}
          />
          <div
            onMouseDown={() => onMouseDown(false)}
            className={`absolute w-6 h-6 bg-white rounded-full  -top-2.5 -translate-x-1/2 cursor-pointer hover:scale-110 transition-transform ${
              lastMoved === "max" ? "z-20" : "z-10"
            } `}
            style={{ left: `${getPercent(currentMax)}%` }}
          />
        </div>
      </div>

      <span className="w-16 text-right font-medium">{currentMax}</span>
    </div>
  )
}
