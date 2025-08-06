import { OrderHistoryHeader } from '@/components/order-history/order-history-header'
import { OrderCard } from '@/components/order-history/order-card'

const orders = [
  {
    id: '1025',
    symbolId: '12',
    quantity: 50,
    amount: 46000,
    orderType: 'LIMIT',
    status: 'COMPLETED',
    buySell: 'BUY',
    ordered: '2025-08-01 10:32'
  },
  {
    id: '1026',
    symbolId: '15',
    quantity: 20,
    amount: 18000,
    orderType: 'MARKET',
    status: 'PENDING',
    buySell: 'SELL',
    ordered: '2025-08-03 15:45'
  }
]

export default function OrderHistoryPage() {
  return (
    <div className="p-6">
      <OrderHistoryHeader />
      <div className="space-y-4 mt-6">
        {orders.map((order) => (
          <OrderCard key={order.id} order={order} />
        ))}
      </div>
    </div>
  )
}
