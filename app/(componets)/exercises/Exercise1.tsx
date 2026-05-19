"use client"

import { useState } from "react"
import Range from "@/app/(componets)/ui/Range"

interface Props {
  min: number
  max: number
}

export default function Exercise1({ min, max }: Props) {
  const [selection, setSelection] = useState({ min, max })

  return (
    <section className="flex flex-col items-center">
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
