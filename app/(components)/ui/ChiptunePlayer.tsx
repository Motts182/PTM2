"use client"

import { useState, useRef, useEffect } from "react"

const MELODY = [523, 659, 784, 1047, 784, 659, 523, 0, 440, 587, 698, 880, 698, 587, 440, 0]
const NOTE_SEC = 0.13

export default function ChiptunePlayer() {
  const [playing, setPlaying] = useState(false)
  const ctxRef = useRef<AudioContext | null>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  function scheduleNote(noteIdx: number) {
    const ctx = ctxRef.current
    if (!ctx) return

    const freq = MELODY[noteIdx % MELODY.length]
    if (freq > 0) {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = "square"
      osc.frequency.value = freq
      gain.gain.setValueAtTime(0.04, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + NOTE_SEC * 0.8)
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start(ctx.currentTime)
      osc.stop(ctx.currentTime + NOTE_SEC)
    }

    timerRef.current = setTimeout(() => scheduleNote(noteIdx + 1), NOTE_SEC * 1000)
  }

  useEffect(() => {
    let onInteraction: (() => void) | null = null

    try {
      const ctx = new AudioContext()
      ctxRef.current = ctx

      const tryStart = () => {
        if (ctxRef.current !== ctx) return
        scheduleNote(0)
        setPlaying(true)
      }

      if (ctx.state === "running") {
        tryStart()
      } else {
        onInteraction = () => {
          ctx.resume().then(tryStart)
          if (onInteraction) {
            document.removeEventListener("click", onInteraction)
            document.removeEventListener("keydown", onInteraction)
            onInteraction = null
          }
        }
        document.addEventListener("click", onInteraction)
        document.addEventListener("keydown", onInteraction)
      }
    } catch {}

    return () => {
      if (onInteraction) {
        document.removeEventListener("click", onInteraction)
        document.removeEventListener("keydown", onInteraction)
      }
      if (timerRef.current) clearTimeout(timerRef.current)
      ctxRef.current?.close()
      ctxRef.current = null
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const toggle = () => {
    if (ctxRef.current) {
      if (timerRef.current) clearTimeout(timerRef.current)
      ctxRef.current.close()
      ctxRef.current = null
      setPlaying(false)
    } else {
      try {
        ctxRef.current = new AudioContext()
        scheduleNote(0)
        setPlaying(true)
      } catch {}
    }
  }

  return (
    <button
      onClick={toggle}
      aria-label={playing ? "Detener música" : "Reproducir música 8-bit"}
      className="text-gray-400 hover:text-amber-400 transition-colors text-base select-none"
    >
      {playing ? "♪" : "♫"}
    </button>
  )
}
