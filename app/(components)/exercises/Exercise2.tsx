"use client"

import { useState } from "react"
import Range from "@/app/(components)/ui/Range"

interface Props {
  steps: number[]
  serverError?: boolean
}

export default function Exercise2({ steps, serverError }: Props) {
  const [selection, setSelection] = useState({
    min: 0,
    max: Math.max(0, steps.length - 1),
  })

  if (serverError) {
    return (
      <p className="text-red-400 text-sm mt-4">
        No se pudo cargar los valores del servidor. Intente nuevamente.
      </p>
    )
  }

  if (steps.length === 0) {
    return (
      <p className="text-gray-400 text-sm mt-4">No hay valores disponibles.</p>
    )
  }

  return (
    <section className="flex flex-col items-center">
      <Range
        steps={steps}
        currentMin={selection.min}
        currentMax={selection.max}
        onChange={setSelection}
      />
    </section>
  )
}
