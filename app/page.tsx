import Link from "next/link"

export default function Home() {
  return (
    <main className="flex flex-col flex-1 items-center justify-center gap-6 px-4">
      <h1 className="text-3xl font-bold tracking-tight">Technical Test — Mango</h1>
      <p className="text-gray-400 text-sm">Custom Range slider component</p>
      <nav className="flex gap-4 mt-2">
        <Link
          href="/exercise1"
          className="px-5 py-2 rounded border border-gray-600 hover:border-white transition-colors text-sm"
        >
          Exercise 1
        </Link>
        <Link
          href="/exercise2"
          className="px-5 py-2 rounded border border-gray-600 hover:border-white transition-colors text-sm"
        >
          Exercise 2
        </Link>
      </nav>
    </main>
  )
}
