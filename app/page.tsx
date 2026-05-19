import Link from "next/link"

export default function Home() {
  return (
    <main className="flex flex-col flex-1 items-center justify-center gap-10 px-4">
      <div className="text-center space-y-3">
        <span className="inline-block px-3 py-1 rounded border border-amber-400/40 text-amber-400 text-xs tracking-widest uppercase">
          Technical Test
        </span>
        <h1 className="text-4xl font-bold tracking-tight mt-3">Range Component</h1>
        <p className="text-gray-400 text-sm max-w-xs mx-auto">
          Custom dual-handle slider with free range and fixed-step modes.
        </p>
      </div>

      <nav className="flex flex-col sm:flex-row gap-4 w-full max-w-xs sm:max-w-none sm:w-auto">
        <Link
          href="/exercise1"
          className="flex flex-col items-center gap-1 px-8 py-4 rounded-lg border border-gray-700 hover:border-amber-400 hover:bg-amber-400/5 transition-all text-sm group"
        >
          <span className="text-amber-400 text-xs tracking-widest uppercase">Exercise 1</span>
          <span className="text-gray-300 group-hover:text-white transition-colors">Free Range</span>
        </Link>
        <Link
          href="/exercise2"
          className="flex flex-col items-center gap-1 px-8 py-4 rounded-lg border border-gray-700 hover:border-amber-400 hover:bg-amber-400/5 transition-all text-sm group"
        >
          <span className="text-amber-400 text-xs tracking-widest uppercase">Exercise 2</span>
          <span className="text-gray-300 group-hover:text-white transition-colors">Fixed Steps</span>
        </Link>
      </nav>
    </main>
  )
}
