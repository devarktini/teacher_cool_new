import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/cards/Card"

export default function InventoryPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Inventory Management</h1>
      </div>

      <Card>
        <CardContent className="p-6">
          <p className="text-gray-500">Inventory tracking system coming soon...</p>
        </CardContent>
      </Card>
    </div>
  )
}
