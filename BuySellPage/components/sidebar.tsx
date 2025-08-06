import { BarChart3, Briefcase, ShoppingCart, ArrowUpDown } from 'lucide-react'
import Link from 'next/link'

const menuItems = [
  { name: 'Dashboard', icon: BarChart3, href: '/', active: true },
  { name: 'Portfolio', icon: Briefcase, href: '/portfolio' },
  { name: 'Orders', icon: ShoppingCart, href: '/orders' },
  { name: 'Transact', icon: ArrowUpDown, href: '/transact' },
]

export function Sidebar() {
  return (
    <div className="w-64 bg-slate-800 text-white p-6">
      <div className="flex items-center gap-2 mb-8">
        <div className="w-6 h-6 bg-gradient-to-br from-blue-400 to-purple-500 rounded"></div>
        <h1 className="text-xl font-semibold">Stock Overflow</h1>
      </div>
      
      <nav className="space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                item.active 
                  ? 'bg-slate-700 text-white' 
                  : 'text-slate-300 hover:bg-slate-700 hover:text-white'
              }`}
            >
              <Icon className="w-5 h-5" />
              {item.name}
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
