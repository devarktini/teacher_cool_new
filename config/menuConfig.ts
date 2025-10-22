import {
  HomeIcon, UsersIcon, ClipboardIcon, ChartBarIcon,
  Cog6ToothIcon, BookOpenIcon, AcademicCapIcon,
  BuildingOffice2Icon, DocumentTextIcon,
  UserGroupIcon,
  ClipboardDocumentListIcon,
  BookmarkIcon,
  TrophyIcon,
  BanknotesIcon,
  VideoCameraIcon,
  WrenchScrewdriverIcon,
} from '@heroicons/react/24/outline'
import { UserRole } from '@/types/auth'

export const menuConfig: Record<UserRole, any[]> = {
  // 🧠 ADMIN
  admin: [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: HomeIcon
    },
    {
      name: 'Manage Users',
      href: '/dashboard/users',
      icon: UsersIcon,
      submenu: [
        { name: 'All Users', href: '/dashboard/users' },
        { name: 'Students', href: '/dashboard/users/students' },
        { name: 'Teachers', href: '/dashboard/users/teachers' },
        { name: 'Organisations', href: '/dashboard/users/organisations' },
      ]
    },
    {
      name: 'Courses',
      href: '/dashboard/courses',
      icon: BookOpenIcon,
      submenu: [
        { name: 'All Courses', href: '/dashboard/courses' },
        { name: 'Categories', href: '/dashboard/courses/categories' },
      ]
    },
    {
      name: 'Reports',
      href: '/dashboard/reports',
      icon: DocumentTextIcon
    },
    {
      name: 'Analytics',
      href: '/dashboard/analytics',
      icon: ChartBarIcon
    },
    {
      name: 'Settings',
      href: '/dashboard/settings',
      icon: Cog6ToothIcon
    },
  ],

  // 🏫 ORGANISATION
  organisation: [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: HomeIcon
    },
    {
      name: 'Teachers',
      href: '/dashboard/teachers',
      icon: UsersIcon,
    },
    {
      name: 'Courses',
      href: '/dashboard/courses',
      icon: BookOpenIcon,
      submenu: [
        { name: 'My Courses', href: '/dashboard/courses' },
        { name: 'Add New Course', href: '/dashboard/courses/add' },
      ]
    },
    {
      name: 'Students',
      href: '/dashboard/students',
      icon: AcademicCapIcon
    },
    {
      name: 'Reports',
      href: '/dashboard/reports',
      icon: DocumentTextIcon
    },
    {
      name: 'Settings',
      href: '/dashboard/settings',
      icon: Cog6ToothIcon
    },
  ],

  // 👨‍🏫 TEACHER
  teacher: [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: HomeIcon
    },
    {
      name: 'My Courses',
      href: '/dashboard/courses',
      icon: BookOpenIcon,
    },
    {
      name: 'Assignments',
      href: '/dashboard/assignments',
      icon: ClipboardIcon,
      submenu: [
        { name: 'Create Assignment', href: '/dashboard/assignments/create' },
        { name: 'My Assignments', href: '/dashboard/assignments' },
      ]
    },
    {
      name: 'Students',
      href: '/dashboard/students',
      icon: AcademicCapIcon
    },
    {
      name: 'Reports',
      href: '/dashboard/reports',
      icon: DocumentTextIcon
    },
  ],

  // 🎓 STUDENT
  student: [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: HomeIcon,
    },
    {
      name: "Home",
      href: "/dashboard/student/home",
      icon: WrenchScrewdriverIcon, // Represents settings/home tools
    },
    {
      name: "My Learning",
      href: "/dashboard/student/my-learning",
      icon: BookOpenIcon,
    },
    {
      name: "Batches",
      href: "/dashboard/student/batchs",
      icon: UserGroupIcon, // Represents group learning or batchmates
    },
    {
      name: "Recorded Sessions",
      href: "/dashboard/student/recorded-sessions",
      icon: VideoCameraIcon,
    },
    {
      name: "My Progress",
      href: "/dashboard/student/my-progress",
      icon: ChartBarIcon,
    },
    {
      name: "Test/Assignments",
      href: "/dashboard/student/assignments",
      icon: ClipboardDocumentListIcon,
    },
    {
      name: "Bookmarks",
      href: "/dashboard/student/book-marks",
      icon: BookmarkIcon,
    },
    {
      name: "Certificates",
      href: "/dashboard/student/certificates",
      icon: TrophyIcon, // Or AcademicCapIcon if you want more formal
    },
    {
      name: "Payments",
      href: "/dashboard/student/payments",
      icon: BanknotesIcon,
    },

  ],
}
