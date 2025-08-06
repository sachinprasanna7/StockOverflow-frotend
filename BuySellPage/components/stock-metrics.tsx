export function StockMetrics() {
  const metrics = [
    { label: 'Sector:', value: 'Automobile' },
    { label: 'P/E Ratio:', value: '21.8' },
    { label: '52 Week High:', value: '₹1025' },
    { label: 'Market Cap:', value: '₹3.1 Lakh Cr' },
    { label: 'Exchange:', value: 'NSE' },
    { label: '52 Week Low:', value: '₹550' },
  ]

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="grid grid-cols-2 gap-x-8 gap-y-4">
        {metrics.map((metric, index) => (
          <div key={index} className="flex justify-between">
            <span className="text-gray-600 font-medium">{metric.label}</span>
            <span className="text-gray-900 font-semibold">{metric.value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
