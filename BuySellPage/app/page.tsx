import { Sidebar } from '@/components/sidebar'
import { StockHeader } from '@/components/stock-header'
import { ChartSection } from '@/components/chart-section'
import { AboutSection } from '@/components/about-section'
import { ActionButtons } from '@/components/action-buttons'
import { StockMetrics } from '@/components/stock-metrics'

export default function Dashboard() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 p-6">
        <div className="max-w-6xl mx-auto space-y-6">
          <StockHeader />
          <ChartSection />
          <AboutSection />
          <ActionButtons />
          <StockMetrics />
        </div>
      </main>
    </div>
  )
}
