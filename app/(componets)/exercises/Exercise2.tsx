"use client"

import { useState } from "react"
import Range from "@/app/(componets)/ui/Range"

interface Props {
  steps: number[]
}

export default function Exercise2({ steps }: Props) {
  const [selection, setSelection] = useState({
    min: 0,
    max: Math.max(0, steps.length - 1),
  })

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
