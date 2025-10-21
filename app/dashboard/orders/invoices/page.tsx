import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/cards/Card"

export default function InvoicesPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Invoices</h1>
      </div>

      <Card>
        <CardContent className="p-6">
          <p className="text-gray-500">Invoice management system coming soon...</p>
        </CardContent>
      </Card>
    </div>
  )
}
