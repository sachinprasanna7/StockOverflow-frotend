'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { BarChart3, Briefcase, Clock, CreditCard } from 'lucide-react'

const navigation = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: BarChart3,
  },
  {
    name: 'Portfolio',
    href: '/portfolio',
    icon: Briefcase,
  },
  {
    name: 'Order History',
    href: '/order-history',
    icon: Clock,
  },
  {
    name: 'Transact',
    href: '/transact',
    icon: CreditCard,
  },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="w-64 bg-slate-800 text-white flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-slate-700">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 bg-gradient-to-br from-blue-400 to-purple-500 rounded"></div>
          <span className="text-xl font-semibold">Stock Overflow</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={cn(
                    'flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-slate-700 text-white'
                      : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                  )}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>
    </div>
  )
}
