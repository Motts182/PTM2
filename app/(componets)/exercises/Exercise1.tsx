"use client"

import { useState, useEffect } from "react"
import Range from "@/app/(componets)/ui/Range"

export default function Exercise1() {
  // Estos valores vendrian de tu fetch al servicio mock 
  const [limits, setLimits] = useState({ min: 1, max: 100 })
  // Este es el estado que el padre "escucha" y controla
  const [selection, setSelection] = useState({ min: 1, max: 100 })

  useEffect(() => {
    const fetchLimits = async () => {
      const res = await fetch('http://localhost:3001/exercise1');
      const data = await res.json();
      setLimits(data)
      setSelection(data)
    }
    fetchLimits()
  }, [])

  return (
    <section className="flex flex-col items-center">      
      <Range
        minLimit={limits.min}
        maxLimit={limits.max}
        currentMin={selection.min}
        currentMax={selection.max}
        onChange={(newValues) => setSelection(newValues)}
      />
    </section>
  )
}