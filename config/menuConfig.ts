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

  // 🏢 CORPORATE
  corporate: [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: HomeIcon
    },
    {
      name: 'Employee',
      href: '/dashboard/corporate/employees',
      icon: UsersIcon,
    },
    // {
    //   name: 'Courses Organisation',
    //   href: '/dashboard/courses',
    //   icon: BookOpenIcon,
    //   submenu: [
    //     { name: 'My Courses', href: '/dashboard/courses' },
    //     { name: 'Add New Course', href: '/dashboard/courses/add' },
    //   ]
    // },
    // {
    //   name: 'Learning',
    //   href: '/dashboard/corporate/learning',
    //   icon: AcademicCapIcon
    // },
    // {
    //   name: 'Assignments ',
    //   href: '/dashboard/corporate/assignments',
    //   icon: DocumentTextIcon
    // },
    // {
    //   name: 'Payments ',
    //   href: '/dashboard/corporate/payments',
    //   icon: Cog6ToothIcon
    // },
    {
      name: 'Batches ',
      href: '/dashboard/corporate/batches',
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
      name: 'Profile',
      href: '/dashboard/teacher/profile',
      icon: BookOpenIcon,
    },
    {
      name: 'Courses',
      href: '/dashboard/courses',
      // icon: ClipboardIcon,
      icon: BookOpenIcon,
      submenu: [
        { name: 'Add Courses', href: '/dashboard/teacher/courses/add-course' },
        { name: 'Course Content', href: '/dashboard/teacher/courses/add-content' },
        { name: 'Private Notes', href: '/dashboard/teacher/courses/private-notes' },
      ]
    },
    {
      name: 'Batches',
      href: '/dashboard/teacher/batches',
      icon: AcademicCapIcon
    },
    {
      name: 'Assignments',
      href: '/dashboard/teacher/assignments',
      icon: AcademicCapIcon
    },
    // {
    //   name: 'Reports Teacher',
    //   href: '/dashboard/reports',
    //   icon: DocumentTextIcon
    // },
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
