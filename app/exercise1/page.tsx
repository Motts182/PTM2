import Exercise1 from "@/app/(components)/exercises/Exercise1"

export default async function Page() {
  let min = 1
  let max = 100
  let serverError = false

  try {
    const res = await fetch("http://localhost:3001/exercise1")
    const data = await res.json()
    min = data.min
    max = data.max
    console.log("[exercise1] datos del servidor:", { min, max })
  } catch {
    serverError = true
    console.error("[exercise1] servidor no disponible, usando valores por defecto:", { min, max })
  }

  return (
    <main className="flex flex-col flex-1 items-center justify-center gap-6 px-4">
      <div className="text-center">
        <p className="text-amber-400 text-xs tracking-widest uppercase mb-1">Exercise 1</p>
        <h1 className="text-2xl font-bold">Free Range</h1>
      </div>
      <Exercise1 min={min} max={max} serverError={serverError} />
    </main>
  )
}
