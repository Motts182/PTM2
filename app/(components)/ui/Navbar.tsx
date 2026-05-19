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
      className={active ? "text-blue-700 cursor-not-allowed" : "text-white"}
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
    <div className="flex items-center justify-center gap-6">
      {links.map((link) => (
        <NavLink key={link.href} {...link} active={pathname === link.href} />
      ))}
    </div>
  )
}

export default Navbar
