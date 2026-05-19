"use client"

import { useState } from "react"
import Range from "@/app/(components)/ui/Range"

interface Props {
  min: number
  max: number
  serverError?: boolean
}

export default function Exercise1({ min, max, serverError }: Props) {
  const [selection, setSelection] = useState({ min, max })

  return (
    <section className="flex flex-col items-center gap-2">
      {serverError && (
        <p className="text-amber-400 text-sm mt-4">
          No se pudo conectar al servidor. Usando valores por defecto.
        </p>
      )}
      <div className="flex gap-8 text-sm text-gray-400 mt-4">
        <span>
          Valor mínimo seteado: <strong className="text-white">{min}</strong>
        </span>
        <span>
          Valor máximo seteado: <strong className="text-white">{max}</strong>
        </span>
      </div>
      <Range
        minLimit={min}
        maxLimit={max}
        currentMin={selection.min}
        currentMax={selection.max}
        onChange={setSelection}
      />
    </section>
  )
}
