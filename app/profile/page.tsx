'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSelector, useDispatch } from 'react-redux'
import { selectAuth, logout } from '@/store/features/authSlice'
// import { useGetProfileQuery } from '@/store/services/userApi'

export default function ProfilePage() {
  const router = useRouter()
  const dispatch = useDispatch()
  const { isAuthenticated } = useSelector(selectAuth)
  // const { data: profile, isLoading } = useGetProfileQuery()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, router])

  const handleLogout = () => {
    dispatch(logout())
    router.push('/')
  }

  // if (isLoading) return <div className="p-8">Loading...</div>

  return (
    <div className="max-w-4xl mx-auto p-8">
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Profile</h1>
          <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
          >
            Logout
          </button>
        </div>
        {/* {profile && (
          <div className="space-y-4">
            <p><span className="font-semibold">Username:</span> {profile.username}</p>
            <p><span className="font-semibold">Email:</span> {profile.email}</p>
          </div>
        )} */}
      </div>
    </div>
  )
}
