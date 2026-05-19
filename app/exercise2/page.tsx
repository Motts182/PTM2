import Exercise2 from "@/app/(componets)/exercises/Exercise2"

export default async function Page() {
  let steps: number[] = []

  try {
    const res = await fetch("http://localhost:3001/exercise2")
    const data = await res.json()
    if (Array.isArray(data.rangeValues)) {
      steps = data.rangeValues
    }
  } catch {
    // server unavailable — empty steps renders nothing
  }

  return (
    <section className="flex flex-col items-center">
      <h1 className="mt-10 text-xl font-bold">Exercise 2</h1>
      <Exercise2 steps={steps} />
    </section>
  )
}
