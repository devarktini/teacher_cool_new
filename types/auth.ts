export type UserRole = 'admin' | 'subadmin' | 'company' | 'manager' | 'user'

export interface Permission {
  view: boolean
  create: boolean
  edit: boolean
  delete: boolean
}

export interface ModulePermissions {
  dashboard: Permission
  users: Permission
  products: Permission
  orders: Permission
  analytics: Permission
  settings: Permission
}
