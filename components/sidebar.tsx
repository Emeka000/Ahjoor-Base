"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Lock, TrendingUpIcon, UserCircle, Settings } from "lucide-react"

const navItems = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/locked-funds", label: "Locked Funds", icon: Lock },
  { href: "/investments", label: "Investments", icon: TrendingUpIcon },
  { href: "/profile", label: "Profile", icon: UserCircle },
  { href: "/settings", label: "Settings", icon: Settings },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="fixed top-0 left-0 h-screen w-64 border-r z-50 border-white/10 bg-[#0a0a0a] flex flex-col overflow-y-auto">
      <div className=" border-b border-white/10">
         <div className="flex items-center justify-center">
          <Link href="/" className="flex items-center">
            <img src="/logo.png" alt="Ahjoor Logo" className="h-20 w-auto" />
          </Link>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                isActive ? "bg-white/5 text-white" : "text-gray-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
