import { Search, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

const marketData = [
  { name: "NASDAQ", value: "24841" },
  { name: "Dow Jones", value: "24841" },
  { name: "Russell 2000", value: "24841" },
  { name: "S&P 500", value: "24841" },
  { name: "S&P 500 Financial", value: "24841" },
  { name: "S&P 500 Energy", value: "24841" },
]

const stockItems = [
  { id: 1, name: "List item", value: "100+" },
  { id: 2, name: "List item", value: "100+" },
  { id: 3, name: "List item", value: "100+" },
]

export default function StockDashboard() {
  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <div className="w-64 bg-slate-800 text-white flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-slate-700">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-slate-800" />
            </div>
            <div>
              <div className="font-bold text-lg">Stock</div>
              <div className="text-sm text-slate-300">Overflow</div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-6">
          <div className="space-y-1">
            <a href="#" className="block px-6 py-3 text-white bg-slate-700 border-r-2 border-blue-400">
              Dashboard
            </a>
            <a href="#" className="block px-6 py-3 text-slate-300 hover:text-white hover:bg-slate-700">
              Portfolio
            </a>
            <a href="#" className="block px-6 py-3 text-slate-300 hover:text-white hover:bg-slate-700">
              Orders
            </a>
            <a href="#" className="block px-6 py-3 text-slate-300 hover:text-white hover:bg-slate-700">
              Transact
            </a>
          </div>
        </nav>

        {/* Bottom illustration placeholder */}
        <div className="p-6">
          <div className="w-full h-32 bg-slate-700 rounded-lg flex items-center justify-center">
            <TrendingUp className="w-8 h-8 text-slate-400" />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header with market data */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex justify-between items-center mb-4">
            <div className="text-sm text-gray-600">MacBook Air - 1</div>
            <div className="text-sm text-gray-600">Period: 1283 | Time: 11:03:22</div>
          </div>
          <div className="grid grid-cols-6 gap-4">
            {marketData.map((item, index) => (
              <div key={index} className="text-center">
                <div className="font-semibold text-lg">{item.value}</div>
                <div className="text-sm text-gray-600">{item.name}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Main dashboard content */}
        <div className="flex-1 p-6 space-y-6">
          {/* Welcome message */}
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-800 italic">Hello, Santhosh Kumar!</h1>
          </div>

          {/* Portfolio summary */}
          <Card className="bg-green-100 border-green-200">
            <CardContent className="p-6">
              <div className="grid grid-cols-3 gap-8 text-center">
                <div>
                  <div className="text-lg font-semibold text-gray-700">Invested</div>
                  <div className="text-2xl font-bold text-gray-800">$38143</div>
                </div>
                <div>
                  <div className="text-lg font-semibold text-gray-700">Current</div>
                  <div className="text-2xl font-bold text-gray-800">$39245</div>
                </div>
                <div>
                  <div className="text-lg font-semibold text-gray-700">Returns</div>
                  <div className="text-2xl font-bold text-green-600">+$1102(2%)</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Search bar */}
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input placeholder="Search for stocks" className="pl-10 py-2 text-center" />
          </div>

          {/* Top Gainers sections */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((section) => (
              <Card key={section} className="bg-gray-50">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-slate-700">Top Gainers</CardTitle>
                  <CardDescription className="text-sm text-gray-600">
                    Stocks which have gained the most in this period!
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {stockItems.map((item) => (
                    <div key={item.id} className="flex items-center space-x-3">
                      <Avatar className="w-8 h-8 bg-slate-600">
                        <AvatarFallback className="text-white text-sm font-semibold">A</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="text-sm font-medium">{item.name}</div>
                      </div>
                      <div className="text-sm text-gray-600">{item.value}</div>
                      <Checkbox className="w-4 h-4" />
                    </div>
                  ))}
                  <div className="flex justify-between pt-4">
                    <Button variant="ghost" size="sm" className="text-blue-600">
                      View More
                    </Button>
                    <Button variant="ghost" size="sm" className="text-blue-600">
                      Action 1
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
