// permissions/rolePermissions.ts
import { UserRole, ModulePermissions } from '@/types/auth'

export const rolePermissions: Record<UserRole, ModulePermissions> = {
  // 👑 ADMIN — full access
  admin: {
    dashboard: { view: true, create: true, edit: true, delete: true },
    users: { view: true, create: true, edit: true, delete: true },
    courses: { view: true, create: true, edit: true, delete: true },
    assignments: { view: true, create: true, edit: true, delete: true },
    analytics: { view: true, create: true, edit: true, delete: true },
    settings: { view: true, create: true, edit: true, delete: true },
  },

  // 🏢 ORGANISATION — can manage courses, limited users
  organisation: {
    dashboard: { view: true, create: false, edit: false, delete: false },
    users: { view: true, create: true, edit: true, delete: false },
    courses: { view: true, create: true, edit: true, delete: true },
    assignments: { view: true, create: true, edit: true, delete: false },
    analytics: { view: true, create: false, edit: false, delete: false },
    settings: { view: true, create: false, edit: true, delete: false },
  },

  // 👨‍🏫 TEACHER — manage their courses and assignments
  teacher: {
    dashboard: { view: true, create: false, edit: false, delete: false },
    users: { view: false, create: false, edit: false, delete: false },
    courses: { view: true, create: true, edit: true, delete: false },
    assignments: { view: true, create: true, edit: true, delete: false },
    analytics: { view: true, create: false, edit: false, delete: false },
    settings: { view: true, create: false, edit: false, delete: false },
  },

  // 🎓 STUDENT — limited to viewing their own learning data
  student: {
    dashboard: { view: true, create: false, edit: false, delete: false },
    users: { view: false, create: false, edit: false, delete: false },
    courses: { view: true, create: false, edit: false, delete: false },
    assignments: { view: true, create: false, edit: false, delete: false },
    analytics: { view: true, create: false, edit: false, delete: false },
    settings: { view: false, create: false, edit: false, delete: false },
  },
}
