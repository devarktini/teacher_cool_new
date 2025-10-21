import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/cards/Card"

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Settings</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>General Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500">Settings configuration coming soon...</p>
        </CardContent>
      </Card>
    </div>
  )
}
