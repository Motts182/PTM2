"use client"

import { useRef, useCallback, useState } from "react"

interface RangeStepsProps {
  values: number[] // El array de precios fijos [1.99, 5.99, ...]
  currentMinIndex: number // Índice actual del mínimo
  currentMaxIndex: number // Índice actual del máximo
  onChange: (indices: { min: number; max: number }) => void
}

export default function RangeSteps({
  values,
  currentMinIndex,
  currentMaxIndex,
  onChange,
}: RangeStepsProps) {
  const trackRef = useRef<HTMLDivElement>(null)
  const [lastMoved, setLastMoved] = useState<"min" | "max">("min")

  const totalSteps = values.length - 1

  // El porcentaje ahora depende de en qué paso (índice) estamos parado
  const getPercent = (index: number) => (index / totalSteps) * 100

  const moveHandle = useCallback(
    (clientX: number, isMin: boolean) => {
      // Si no hay track o no hay valores, no hacemos nada
      if (!trackRef.current || values.length === 0) return

      // obtenemos el rectangulo del track
      const rect = trackRef.current.getBoundingClientRect()

      // obtenemos el porcentaje
      let percentage = ((clientX - rect.left) / rect.width) * 100

      // limitamos el porcentaje
      percentage = Math.min(Math.max(percentage, 0), 100)

      // Calculamos a qué paso de la barra se acerca más el mouse
      const exactStep = (percentage / 100) * totalSteps
      const closestStep = Math.round(exactStep)

      if (isMin) {
        // Evita cruzar o igualar al máximo
        if (closestStep < currentMaxIndex) {
          onChange({ min: closestStep, max: currentMaxIndex })
        }
      } else {
        // Evita cruzar o igualar al mínimo
        if (closestStep > currentMinIndex) {
          onChange({ min: currentMinIndex, max: closestStep })
        }
      }
    },
    [values.length, totalSteps, currentMinIndex, currentMaxIndex, onChange],
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

  // Si no hay valores cargados todavía, no mostramos nada
  if (!values || values.length === 0) return null

  return (
    <div className="flex gap-4 items-center p-20">
      <label className="w-16 text-left font-medium">
        ${values[currentMinIndex]?.toFixed(2)}
      </label>

      <div className="relative w-64 h-1 bg-gray-600 rounded" ref={trackRef}>
        <div className="relative w-64 h-1">
          {/* Barra de progreso visual */}
          <div
            className="absolute h-full bg-white"
            style={{
              left: `${getPercent(currentMinIndex)}%`,
              right: `${100 - getPercent(currentMaxIndex)}%`,
            }}
          />

          {/* Puntitos visuales opcionales para marcar los steps disponibles */}
          {values.map((_, index) => (
            <div
              key={index}
              className="absolute w-0.5 h-1 bg-gray-400 top-0"
              style={{ left: `${getPercent(index)}%`, transform: "translateX(-50%)" }}
            />
          ))}

          {/* Handle Mínimo */}
          <div
            onMouseDown={() => onMouseDown(true)}
            className={`absolute w-6 h-6 bg-white rounded-full -top-2.5 -translate-x-1/2 cursor-pointer hover:scale-110 transition-transform ${
              lastMoved === "min" ? "z-20" : "z-10"
            }`}
            style={{ left: `${getPercent(currentMinIndex)}%` }}
          />

          {/* Handle Máximo */}
          <div
            onMouseDown={() => onMouseDown(false)}
            className={`absolute w-6 h-6 bg-white rounded-full -top-2.5 -translate-x-1/2 cursor-pointer hover:scale-110 transition-transform ${
              lastMoved === "max" ? "z-20" : "z-10"
            }`}
            style={{ left: `${getPercent(currentMaxIndex)}%` }}
          />
        </div>
      </div>

      <label className="w-16 text-right font-medium">
        ${values[currentMaxIndex]?.toFixed(2)}
      </label>
    </div>
  )
}