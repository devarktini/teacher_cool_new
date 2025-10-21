'use client'
import { useState } from 'react'
import { useSelector } from 'react-redux'
import { selectAuth } from '@/store/features/authSlice'
import Table, { Column } from '@/components/Table'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/cards/Card'
import { mockProducts } from '@/data/mockData'
import Image from 'next/image'
import { usePermissions } from '@/hooks/usePermissions'

export default function DashboardProductsPage() {
  const { user } = useSelector(selectAuth)
  const isAdmin = user?.role === 'admin'

  const { hasPermission } = usePermissions()
  const canCreate = hasPermission('products', 'create')
  const canEdit = hasPermission('products', 'edit')
  const canDelete = hasPermission('products', 'delete')

  // Filter products based on user role
  const products = isAdmin ? mockProducts : mockProducts.filter(p => p.userId === user?.id)

  const columns: Column<any>[] = [
    {
      key: 'image',
      header: 'Image',
      width: '100px',
      render: (row) => (
        <div className="w-16 h-16 relative">
          <Image
            src={row.image}
            alt={row.name}
            fill
            className="object-cover rounded"
          />
        </div>
      )
    },
    { key: 'name', header: 'Name', sortable: true },
    { key: 'category', header: 'Category' },
    {
      key: 'price',
      header: 'Price',
      render: (row) => `$${row.price.toFixed(2)}`
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (row) => (
        <div className="flex gap-2">
          {canEdit && (
            <button className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600">
              Edit
            </button>
          )}
          {canDelete && (
            <button className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600">
              Delete
            </button>
          )}
        </div>
      )
    }
  ]

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">
          {isAdmin ? 'All Products' : 'My Products'}
        </h1>
        {canCreate && (
          <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            Add Product
          </button>
        )}
      </div>

      <Card>
        <CardContent className="p-6">
          <Table
            data={products}
            columns={columns}
            headerColor="#F3F4F6"
            bordered
            striped
          />
        </CardContent>
      </Card>
    </div>
  )
}
