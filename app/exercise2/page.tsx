import Exercise2 from "@/app/(componets)/exercises/Exercise2"

export default async function Page() {
  let steps: number[] = []
  let serverError = false

  try {
    const res = await fetch("http://localhost:3001/exercise2")
    const data = await res.json()
    if (Array.isArray(data.rangeValues)) {
      steps = data.rangeValues
    }
  } catch {
    serverError = true
  }

  return (
    <section className="flex flex-col items-center">
      <h1 className="mt-10 text-xl font-bold">Exercise 2</h1>
      <Exercise2 steps={steps} serverError={serverError} />
    </section>
  )
}
