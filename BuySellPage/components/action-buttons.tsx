import { Button } from '@/components/ui/button'

export function ActionButtons() {
  return (
    <div className="flex gap-4">
      <Button 
        className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 text-lg font-medium"
        size="lg"
      >
        Buy
      </Button>
      <Button 
        className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 text-lg font-medium"
        size="lg"
      >
        Sell
      </Button>
      <Button 
        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg font-medium"
        size="lg"
      >
        Start SIP
      </Button>
    </div>
  )
}
