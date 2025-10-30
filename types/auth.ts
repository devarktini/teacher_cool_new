export type UserRole = 'admin' | 'university' | 'teacher' | 'student' | 'corporate' 

export interface Permission {
  view: boolean
  create: boolean
  edit: boolean
  delete: boolean
}

export interface ModulePermissions {
  dashboard: Permission
  users: Permission
  courses: Permission
  assignments: Permission
  analytics: Permission
  settings: Permission
}
