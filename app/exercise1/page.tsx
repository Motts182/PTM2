import Exercise1 from "@/app/(componets)/exercises/Exercise1"

export default async function Page() {
  let min = 1
  let max = 100

  try {
    const res = await fetch("http://localhost:3001/exercise1")
    const data = await res.json()
    min = data.min
    max = data.max
  } catch {
    // server unavailable — defaults apply
  }

  return (
    <main className="flex flex-col items-center">
      <h1 className="mt-10 text-xl font-bold">Exercise 1</h1>
      <Exercise1 min={min} max={max} />
    </main>
  )
}
