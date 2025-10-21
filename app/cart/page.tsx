'use client'
import { useSelector, useDispatch } from 'react-redux'
import { selectCart, removeItem } from '@/store/features/cartSlice'
import Table, { Column } from '@/components/Table'
import { TrashIcon } from '@heroicons/react/24/outline'
import Image from 'next/image'

export default function CartPage() {
  const { items, total } = useSelector(selectCart)
  const dispatch = useDispatch()

  const columns: Column<any>[] = [
    {
      key: 'image',
      header: 'Product',
      width: '100px',
      render: (row) => (
        <div className="w-20 h-20 relative">
          <Image
            src={row.image || 'https://via.placeholder.com/150'}
            alt={row.name}
            fill
            className="object-cover rounded"
          />
        </div>
      )
    },
    { key: 'name', header: 'Name' },
    {
      key: 'price',
      header: 'Price',
      render: (row) => `$${row.price.toFixed(2)}`
    },
    {
      key: 'quantity',
      header: 'Quantity',
      render: (row) => (
        <span className="px-4 py-2 bg-gray-100 rounded">
          {row.quantity}
        </span>
      )
    },
    {
      key: 'subtotal',
      header: 'Subtotal',
      render: (row) => `$${(row.price * row.quantity).toFixed(2)}`
    },
    {
      key: 'actions',
      header: '',
      width: '50px',
      render: (row) => (
        <button
          onClick={(e) => {
            e.stopPropagation()
            dispatch(removeItem(row.id))
          }}
          className="text-red-500 hover:text-red-700"
        >
          <TrashIcon className="h-5 w-5" />
        </button>
      )
    }
  ]

  return (
    <div className="max-w-7xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Shopping Cart</h1>
      
      <div className="bg-white rounded-lg shadow">
        <Table
          data={items}
          columns={columns}
          headerColor="#F9FAFB"
          bordered
          emptyMessage="Your cart is empty"
        />

        {items.length > 0 && (
          <div className="p-6 border-t">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-600">Total Items: {items.length}</p>
                <p className="text-2xl font-bold">Total: ${total.toFixed(2)}</p>
              </div>
              <button
                className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
                onClick={() => {/* Add checkout logic */}}
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
