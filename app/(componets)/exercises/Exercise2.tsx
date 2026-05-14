"use client"

import { useState, useEffect } from "react"
import RangeSteps from "@/app/(componets)/ui/RangeSteps"

export default function Exercise2() {
  const [prices, setPrices] = useState<number[]>([])
  // Guardamos la selección como las posiciones (índices) del array
  const [selection, setSelection] = useState({ min: 0, max: 0 })

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const res = await fetch("http://localhost:3001/exercise2")
        const data = await res.json()

        if (data.rangeValues && data.rangeValues.length > 0) {
          setPrices(data.rangeValues)
          setSelection({ min: 0, max: data.rangeValues.length - 1 })
        }
      } catch (error) {
        console.error(error)
      }
    }
    fetchPrices()
  }, [])

  return (
    <section className="flex flex-col items-center">
      <RangeSteps
        values={prices}
        currentMinIndex={selection.min}
        currentMaxIndex={selection.max}
        onChange={(newIndices) => setSelection(newIndices)}
      />
    </section>
  )
}
