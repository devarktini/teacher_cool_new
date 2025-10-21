import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/cards/Card"

export default function OrdersPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Orders</h1>
      </div>

      <Card>
        <CardContent className="p-6">
          <p className="text-gray-500">Orders management system coming soon...</p>
        </CardContent>
      </Card>
    </div>
  )
}
