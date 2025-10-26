'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSelector } from 'react-redux'
import { selectAuth } from '@/store/features/authSlice'

interface AuthGuardProps {
  children: React.ReactNode
  requireAdmin?: boolean
}

export default function AuthGuard({ children, requireAdmin = false }: AuthGuardProps) {
  const router = useRouter()
  const { isAuthenticated, user_type, token } = useSelector(selectAuth)
  const [isChecking, setIsChecking] = useState(true)

  const isAdmin = user_type === 'admin'

  useEffect(() => {
    // Check if we're in the browser environment
    if (typeof window === 'undefined') return

    // Check localStorage directly for token
    const storedToken = localStorage.getItem('token')
    
    if (!storedToken) {
      router.push('/login')
    } else if (requireAdmin && user_type !== 'admin') {
      router.push('/dashboard')
    } else {
      setIsChecking(false)
    }
  }, [token, isAdmin, requireAdmin, router, user_type])

  // Show loading state while checking authentication
  if (isChecking) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return <>{children}</>
}






// 'use client'
// import { useEffect } from 'react'
// import { useRouter } from 'next/navigation'
// import { useSelector } from 'react-redux'
// import { selectAuth } from '@/store/features/authSlice'
// import { mockProfile } from '@/data/mockData'  // Temporarily use mock data

// interface AuthGuardProps {
//   children: React.ReactNode
//   requireAdmin?: boolean
// }

// export default function AuthGuard({ children, requireAdmin = false }: AuthGuardProps) {
//   const router = useRouter()
//   const { isAuthenticated, user } = useSelector(selectAuth)

//   // For development, use mock profile
//   const isAdmin = user?.role === 'admin' || mockProfile.role === 'admin'

//   useEffect(() => {
//     if (!isAuthenticated) {
//       router.push('/login')
//     } else if (requireAdmin && !isAdmin) {
//       router.push('/dashboard')
//     }
//   }, [isAuthenticated, router, requireAdmin, isAdmin])

//   if (!isAuthenticated) return null
//   if (requireAdmin && !isAdmin) return null

//   return <>{children}</>
// }
