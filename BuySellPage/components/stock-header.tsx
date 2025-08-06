export function StockHeader() {
  return (
    <div className="flex items-start justify-between">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Tata Motors</h1>
        <p className="text-gray-600 mt-1">Symbol: TATAMOTORS • NSE</p>
      </div>
      <div className="text-right">
        <div className="text-3xl font-bold text-gray-900">₹930.50</div>
        <div className="text-green-600 font-medium">+1.23%</div>
      </div>
    </div>
  )
}
