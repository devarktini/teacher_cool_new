import { UserRole, ModulePermissions } from '@/types/auth'

export const rolePermissions: Record<UserRole, ModulePermissions> = {
  admin: {
    dashboard: { view: true, create: true, edit: true, delete: true },
    users: { view: true, create: true, edit: true, delete: true },
    products: { view: true, create: true, edit: true, delete: true },
    orders: { view: true, create: true, edit: true, delete: true },
    analytics: { view: true, create: true, edit: true, delete: true },
    settings: { view: true, create: true, edit: true, delete: true },
  },
  subadmin: {
    dashboard: { view: true, create: false, edit: false, delete: false },
    users: { view: true, create: true, edit: true, delete: false },
    products: { view: true, create: true, edit: true, delete: false },
    orders: { view: true, create: true, edit: true, delete: false },
    analytics: { view: true, create: false, edit: false, delete: false },
    settings: { view: true, create: false, edit: false, delete: false },
  },
  company: {
    dashboard: { view: true, create: false, edit: false, delete: false },
    users: { view: false, create: false, edit: false, delete: false },
    products: { view: true, create: true, edit: true, delete: true },
    orders: { view: true, create: true, edit: true, delete: false },
    analytics: { view: true, create: false, edit: false, delete: false },
    settings: { view: true, create: false, edit: true, delete: false },
  },
  manager: {
    dashboard: { view: true, create: false, edit: false, delete: false },
    users: { view: true, create: false, edit: false, delete: false },
    products: { view: true, create: false, edit: true, delete: false },
    orders: { view: true, create: true, edit: true, delete: false },
    analytics: { view: true, create: false, edit: false, delete: false },
    settings: { view: false, create: false, edit: false, delete: false },
  },
  user: {
    dashboard: { view: true, create: false, edit: false, delete: false },
    users: { view: false, create: false, edit: false, delete: false },
    products: { view: true, create: false, edit: false, delete: false },
    orders: { view: true, create: true, edit: false, delete: false },
    analytics: { view: false, create: false, edit: false, delete: false },
    settings: { view: false, create: false, edit: false, delete: false },
  },
}
