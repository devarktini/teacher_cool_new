'use client'
import { useState } from 'react'
import { useSelector } from 'react-redux'
import { selectAuth } from '@/store/features/authSlice'
import { useRouter } from 'next/navigation'
import Table, { Column } from '@/components/Table'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/cards/Card'
import { mockUsers } from '@/data/mockData'
import AuthGuard from '@/components/AuthGuard'
import Pagination from '@/components/common/Pagination'

export default function DashboardUsersPage() {
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5
  const totalPages = Math.ceil(mockUsers.length / itemsPerPage)

  // Get current users for pagination
  const getCurrentUsers = () => {
    const start = (currentPage - 1) * itemsPerPage
    const end = start + itemsPerPage
    return mockUsers.slice(start, end)
  }

  return (
    <AuthGuard requireAdmin>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Users Management</h1>
          <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            Add User
          </button>
        </div>

        <Card>
          <CardContent className="p-6">
            <Table
              data={getCurrentUsers()}
              columns={[
                { key: 'name', header: 'Name', sortable: true },
                { key: 'email', header: 'Email' },
                {
                  key: 'role',
                  header: 'Role',
                  render: (row) => (
                    <span className="capitalize px-2 py-1 bg-gray-100 rounded-full text-sm">
                      {row.role}
                    </span>
                  )
                },
                {
                  key: 'status',
                  header: 'Status',
                  render: (row) => (
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                      ${row.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`
                    }>
                      {row.status}
                    </span>
                  )
                },
                {
                  key: 'joinDate',
                  header: 'Join Date',
                  render: (row) => new Date(row.joinDate).toLocaleDateString()
                },
                {
                  key: 'actions',
                  header: 'Actions',
                  render: (row) => (
                    <div className="flex gap-2">
                      <button className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600">
                        Edit
                      </button>
                      <button 
                        className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
                        disabled={row.role === 'admin'}
                      >
                        Delete
                      </button>
                    </div>
                  )
                }
              ]}
              headerColor="#F3F4F6"
              bordered
              striped
            />
            <div className="mt-4">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                color="blue"
                showFirstLast
                showPageNumbers
                size="md"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </AuthGuard>
  )
}
