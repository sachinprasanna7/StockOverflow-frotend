import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'

interface Order {
  id: string
  symbolId: string
  quantity: number
  amount: number
  orderType: 'LIMIT' | 'MARKET'
  status: 'COMPLETED' | 'PENDING'
  buySell: 'BUY' | 'SELL'
  ordered: string
}

interface OrderCardProps {
  order: Order
}

export function OrderCard({ order }: OrderCardProps) {
  const getOrderTypeBadgeVariant = (type: string) => {
    return type === 'LIMIT' ? 'default' : 'secondary'
  }

  const getStatusBadgeVariant = (status: string) => {
    return status === 'COMPLETED' ? 'default' : 'secondary'
  }

  const getBuySellColor = (buySell: string) => {
    return buySell === 'BUY' ? 'text-green-600' : 'text-red-600'
  }

  const getStatusColor = (status: string) => {
    return status === 'COMPLETED' ? 'text-green-600' : 'text-orange-500'
  }

  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-3">
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium text-gray-600">Order ID:</span>
              <span className="text-sm text-gray-900">{order.id}</span>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium text-gray-600">Quantity:</span>
              <span className="text-sm text-gray-900">{order.quantity}</span>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium text-gray-600">Order Type:</span>
              <Badge 
                variant={getOrderTypeBadgeVariant(order.orderType)}
                className={order.orderType === 'LIMIT' ? 'bg-green-100 text-green-800 hover:bg-green-100' : 'bg-blue-100 text-blue-800 hover:bg-blue-100'}
              >
                {order.orderType}
              </Badge>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium text-gray-600">Status:</span>
              <span className={`text-sm font-medium ${getStatusColor(order.status)}`}>
                {order.status}
              </span>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">Symbol ID:</span>
              <span className="text-sm text-gray-900">{order.symbolId}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">Amount:</span>
              <span className="text-sm text-gray-900">₹{order.amount.toLocaleString()}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">Buy/Sell:</span>
              <span className={`text-sm font-medium ${getBuySellColor(order.buySell)}`}>
                {order.buySell}
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">Ordered:</span>
              <span className="text-sm text-gray-900">{order.ordered}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
