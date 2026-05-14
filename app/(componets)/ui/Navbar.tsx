"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

const Navbar = () => {
  const pathname = usePathname()
  
  return (
    <div className="flex items-center justify-center gap-6">
      <Link
        className={`${pathname == "/" ? "text-blue-700 cursor-not-allowed" : "text-white"}`}
        href="/"
        aria-disabled={pathname == "/" ? "true" : "false"}
        tabIndex={pathname == "/" ? -1 : 0}
      >
        Home
      </Link>

      <Link
        className={`${pathname == "/exercise1" ? "text-blue-700 cursor-not-allowed" : "text-white"}`}
        href="/exercise1"
        aria-disabled={pathname == "/exercise1" ? "true" : "false"}
        tabIndex={pathname == "/exercise1" ? -1 : 0}
      >
        Exercise 1
      </Link>

      <Link
        className={`${pathname == "/exercise2" ? "text-blue-700 cursor-not-allowed" : "text-white"}`}
        href="/exercise2"
        aria-disabled={pathname == "/exercise2" ? "true" : "false"}
        tabIndex={pathname == "/exercise2" ? -1 : 0}
      >
        Exercise 2
      </Link>
    </div>
  )
}
export default Navbar
