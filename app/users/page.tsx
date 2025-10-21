'use client'
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { startProgress, stopProgress } from '@/store/features/progressSlice'
import Table, { Column } from '@/components/Table'
import SearchableDropdown from '@/components/SearchableDropdown'
import { mockUsers } from '@/data/mockData'
import { usePopup } from '@/hooks/usePopup'

interface User {
  id: number
  name: string
  email: string
  role: string
  status: string
}

const roles = [
  { value: 'all', label: 'All Roles' },
  { value: 'admin', label: 'Admin' },
  { value: 'user', label: 'User' },
  { value: 'editor', label: 'Editor' },
]

export default function UsersPage() {
  const dispatch = useDispatch()
  const popup = usePopup()
  const [selectedRole, setSelectedRole] = useState(roles[0])
  const [selectedUser, setSelectedUser] = useState<User>()

  // Replace sample data with mock data
  const users: User[] = mockUsers;

  const handleUserAction = async (user: User, action: 'edit' | 'delete') => {
    dispatch(startProgress({ color: '#3B82F6' }))
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      popup.show({
        title: action === 'edit' ? 'User Updated' : 'User Deleted',
        description: `Successfully ${action === 'edit' ? 'updated' : 'deleted'} user ${user.name}`,
        theme: action === 'edit' ? 'success' : 'warning',
        additionalData: [
          { key: 'User ID', value: user.id },
          { key: 'Email', value: user.email },
          { key: 'Role', value: user.role },
          { key: 'Action Timestamp', value: new Date().toLocaleString() }
        ],
        onConfirm: () => {
          console.log(`Confirmed ${action} for user:`, user)
        }
      })
    } catch (error) {
      popup.show({
        title: 'Error',
        description: `Failed to ${action} user. Please try again.`,
        theme: 'error'
      })
    } finally {
      dispatch(stopProgress())
    }
  }

  const columns: Column<User>[] = [
    { key: 'name', header: 'Name', sortable: true },
    { key: 'email', header: 'Email' },
    {
      key: 'role',
      header: 'Role',
      render: (row) => (
        <span className="capitalize">{row.role}</span>
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
      key: 'actions',
      header: 'Actions',
      render: (row) => (
        <div className="flex gap-2">
          <button
            onClick={() => handleUserAction(row, 'edit')}
            className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Edit
          </button>
          <button 
            onClick={() => handleUserAction(row, 'delete')}
            className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
            disabled={row.role === 'admin'}
          >
            Delete
          </button>
        </div>
      )
    }
  ]

  const filteredUsers = selectedRole.value === 'all' 
    ? users 
    : users.filter(user => user.role === selectedRole.value)

  const demonstrateProgress = async () => {
    // Start with default blue
    dispatch(startProgress())
    await new Promise(resolve => setTimeout(resolve, 1500))

    // Show success green
    dispatch(startProgress({ color: '#22C55E', size:48 }))
    await new Promise(resolve => setTimeout(resolve, 1500))

    // Show error red
    dispatch(startProgress({ color: '#EF4444' }))
    await new Promise(resolve => setTimeout(resolve, 1500))

    // Show warning yellow
    dispatch(startProgress({ color: '#F59E0B' }))
    await new Promise(resolve => setTimeout(resolve, 1500))

    dispatch(stopProgress())
  }

  return (
    <div className="p-8 mt-20">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Users</h1>
          <button
            onClick={demonstrateProgress}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            Demo Progress States
          </button>
        </div>
        <div className="w-64">
          <SearchableDropdown
            options={roles}
            value={selectedRole}
            onChange={setSelectedRole}
            placeholder="Filter by role"
            className="mb-4 border-4 border-green-500"
          />
        </div>
      </div>

      <Table
        data={filteredUsers}
        columns={columns}
        selectedRow={selectedUser}
        onRowClick={setSelectedUser}
        headerColor="#F3F4F6"
        selectedRowColor="#EFF6FF"
        striped
        bordered
        stickyHeader
        maxHeight="600px"
      />
    </div>
  )
}
