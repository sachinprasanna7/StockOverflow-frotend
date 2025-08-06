import { TrendingUp } from 'lucide-react'

export function ChartSection() {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-8">
      <div className="flex items-center justify-center h-64 text-gray-400">
        <div className="text-center">
          <TrendingUp className="w-12 h-12 mx-auto mb-2 opacity-50" />
          <p className="text-sm">[Chart Placeholder]</p>
        </div>
      </div>
    </div>
  )
}
