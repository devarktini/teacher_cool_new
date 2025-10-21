import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/cards/Card"

export default function ShipmentsPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Shipments</h1>
      </div>

      <Card>
        <CardContent className="p-6">
          <p className="text-gray-500">Shipment tracking system coming soon...</p>
        </CardContent>
      </Card>
    </div>
  )
}
