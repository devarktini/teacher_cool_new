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
  Squares2X2Icon,
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

  // 🏫 UNIVERSITY
  university: [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: HomeIcon
    },
    {
      name: 'Teachers Univesity',
      href: '/dashboard/teachers',
      icon: UsersIcon,
    },
    {
      name: 'Courses Univesity',
      href: '/dashboard/courses',
      icon: BookOpenIcon,
      submenu: [
        { name: 'My Courses', href: '/dashboard/courses' },
        { name: 'Add New Course', href: '/dashboard/courses/add' },
      ]
    },
    {
      name: 'Students Univesity',
      href: '/dashboard/students',
      icon: AcademicCapIcon
    },
    {
      name: 'Reports Univesity',
      href: '/dashboard/reports',
      icon: DocumentTextIcon
    },
    {
      name: 'Settings Univesity',
      href: '/dashboard/settings',
      icon: Cog6ToothIcon
    },
  ],

  // 🏫 UNIVERSITY
  corporate: [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: HomeIcon
    },
    {
      name: 'Teachers Organisation',
      href: '/dashboard/teachers',
      icon: UsersIcon,
    },
    {
      name: 'Courses Organisation',
      href: '/dashboard/courses',
      icon: BookOpenIcon,
      submenu: [
        { name: 'My Courses', href: '/dashboard/courses' },
        { name: 'Add New Course', href: '/dashboard/courses/add' },
      ]
    },
    {
      name: 'Students Organisation',
      href: '/dashboard/students',
      icon: AcademicCapIcon
    },
    {
      name: 'Reports Organisation',
      href: '/dashboard/reports',
      icon: DocumentTextIcon
    },
    {
      name: 'Settings Organisation',
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
      name: 'My Courses Teacher',
      href: '/dashboard/courses',
      icon: BookOpenIcon,
    },
    {
      name: 'Assignments Teacher',
      href: '/dashboard/assignments',
      icon: ClipboardIcon,
      submenu: [
        { name: 'Create Assignment', href: '/dashboard/assignments/create' },
        { name: 'My Assignments', href: '/dashboard/assignments' },
      ]
    },
    {
      name: 'Students Teacher',
      href: '/dashboard/students',
      icon: AcademicCapIcon
    },
    {
      name: 'Reports Teacher',
      href: '/dashboard/reports',
      icon: DocumentTextIcon
    },
  ],

  // 🎓 STUDENT
  student: [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: Squares2X2Icon ,
    },
    {
      name: "Home",
      href: "/dashboard/student/home",
      icon: HomeIcon, // Represents settings/home tools
    },
    {
      name: "My Learning",
      href: "/dashboard/student/my-learning",
      icon: BookOpenIcon,
    },
    {
      name: "Batches",
      href: "/dashboard/student/batches",
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
