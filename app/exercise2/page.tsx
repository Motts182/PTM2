import Exercise2 from "@/app/(components)/exercises/Exercise2"

export default async function Page() {
  let steps: number[] = []
  let serverError = false

  try {
    const res = await fetch("http://localhost:3001/exercise2")
    const data = await res.json()
    if (Array.isArray(data.rangeValues)) {
      steps = data.rangeValues
      console.log("[exercise2] datos del servidor:", { steps })
    }
  } catch {
    serverError = true
    console.error("[exercise2] servidor no disponible, sin valores de pasos")
  }

  return (
    <main className="flex flex-col flex-1 items-center justify-center gap-6 px-4">
      <div className="text-center">
        <p className="text-amber-400 text-xs tracking-widest uppercase mb-1">Exercise 2</p>
        <h1 className="text-2xl font-bold">Fixed Steps</h1>
      </div>
      <Exercise2 steps={steps} serverError={serverError} />
    </main>
  )
}
