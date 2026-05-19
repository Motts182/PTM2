"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

const links = [
  { href: "/", label: "Home" },
  { href: "/exercise1", label: "Exercise 1" },
  { href: "/exercise2", label: "Exercise 2" },
]

function NavLink({ href, label, active }: { href: string; label: string; active: boolean }) {
  return (
    <Link
      href={href}
      className={
        active
          ? "text-white font-semibold underline underline-offset-4 cursor-not-allowed"
          : "text-gray-400 hover:text-white transition-colors"
      }
      aria-disabled={active ? "true" : "false"}
      tabIndex={active ? -1 : 0}
    >
      {label}
    </Link>
  )
}

const Navbar = () => {
  const pathname = usePathname()

  return (
    <nav className="h-14 flex items-center justify-center gap-6 bg-gray-900 border-b border-gray-800 px-6">
      {links.map((link) => (
        <NavLink key={link.href} {...link} active={pathname === link.href} />
      ))}
    </nav>
  )
}

export default Navbar
