import Link from "next/link"

const page = () => {
  return (
    <main className="flex flex-col flex-1 items-center justify-center font-sans ">
      <h1 className="text-2xl font-bold">technical test Mango</h1>

      <h2>Exercises</h2>

      <Link href="/exercise1">Exercise1</Link>

      <Link href="/exercise2">Exercise2</Link>
    </main>
  )
}
export default page
