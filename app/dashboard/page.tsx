import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/cards/Card"
import LineChart from "@/components/charts/LineChart"
import BarChart from "@/components/charts/BarChart"

const salesData = [
  { month: 'Jan', sales: 4000, orders: 240 },
  { month: 'Feb', sales: 3000, orders: 198 },
  { month: 'Mar', sales: 2000, orders: 120 },
  { month: 'Apr', sales: 2780, orders: 188 },
  { month: 'May', sales: 1890, orders: 139 },
  { month: 'Jun', sales: 2390, orders: 150 },
]

const categoryData = [
  { name: 'Electronics', sales: 4000, profit: 2400 },
  { name: 'Clothing', sales: 3000, profit: 1398 },
  { name: 'Books', sales: 2000, profit: 9800 },
  { name: 'Home', sales: 2780, profit: 3908 },
  { name: 'Sports', sales: 1890, profit: 4800 },
]

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$45,231.89</div>
            <p className="text-xs text-muted-foreground">+20.1% from last month</p>
          </CardContent>
        </Card>
        {/* Add more cards for different metrics */}
      </div>

      {/* Charts */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Monthly Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <LineChart 
              data={salesData}
              xAxisKey="month"
              lines={[
                { key: 'sales', color: 'hsl(var(--chart-1))' },
                { key: 'orders', color: 'hsl(var(--chart-2))' },
              ]}
              height={300}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Sales by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <BarChart 
              data={categoryData}
              xAxisKey="name"
              bars={[
                { key: 'sales', color: 'hsl(var(--chart-3))' },
                { key: 'profit', color: 'hsl(var(--chart-4))' },
              ]}
              height={300}
              stacked
            />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
