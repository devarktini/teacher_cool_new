import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/cards/Card"

export default function CategoriesPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Product Categories</h1>
        <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          Add Category
        </button>
      </div>

      <Card>
        <CardContent className="p-6">
          <p className="text-gray-500">Categories management coming soon...</p>
        </CardContent>
      </Card>
    </div>
  )
}
