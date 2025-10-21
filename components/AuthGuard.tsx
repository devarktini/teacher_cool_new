'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSelector } from 'react-redux'
import { selectAuth } from '@/store/features/authSlice'
import { mockProfile } from '@/data/mockData'  // Temporarily use mock data

interface AuthGuardProps {
  children: React.ReactNode
  requireAdmin?: boolean
}

export default function AuthGuard({ children, requireAdmin = false }: AuthGuardProps) {
  const router = useRouter()
  const { isAuthenticated, user } = useSelector(selectAuth)

  // For development, use mock profile
  const isAdmin = user?.role === 'admin' || mockProfile.role === 'admin'

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
    } else if (requireAdmin && !isAdmin) {
      router.push('/dashboard')
    }
  }, [isAuthenticated, router, requireAdmin, isAdmin])

  if (!isAuthenticated) return null
  if (requireAdmin && !isAdmin) return null

  return <>{children}</>
}
