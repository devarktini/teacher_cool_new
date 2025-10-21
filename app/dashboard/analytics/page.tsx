import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/cards/Card"

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Analytics</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500">Analytics dashboard coming soon...</p>
        </CardContent>
      </Card>
    </div>
  )
}
