import { useSelector } from 'react-redux'
import { selectAuth } from '@/store/features/authSlice'
import { rolePermissions } from '@/config/permissions'
import type { UserRole } from '@/types/auth'

export function usePermissions() {
  const { user } = useSelector(selectAuth)
  const role = user?.role as UserRole || 'user'

  const hasPermission = (
    module: keyof typeof rolePermissions[UserRole],
    action: 'view' | 'create' | 'edit' | 'delete'
  ) => {
    return rolePermissions[role][module][action]
  }

  return { hasPermission, role }
}
