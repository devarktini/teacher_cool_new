import { 
  HomeIcon, UsersIcon, ShoppingBagIcon, ChartBarIcon,
  Cog6ToothIcon, ClipboardIcon, CreditCardIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline'
import { UserRole } from '@/types/auth'

export const menuConfig: Record<UserRole, any[]> = {
  admin: [
    { 
      name: 'Dashboard', 
      href: '/dashboard', 
      icon: HomeIcon 
    },
    { 
      name: 'Users', 
      href: '/dashboard/users', 
      icon: UsersIcon 
    },
    {
      name: 'Products',
      icon: ShoppingBagIcon,
      href: '/dashboard/products',
      submenu: [
        { name: 'All Products', href: '/dashboard/products' },
        { name: 'Categories', href: '/dashboard/products/categories' },
        { name: 'Inventory', href: '/dashboard/products/inventory' },
      ]
    },
    {
      name: 'Orders',
      icon: ClipboardIcon,
      href: '/dashboard/orders',
      submenu: [
        { name: 'All Orders', href: '/dashboard/orders' },
        { name: 'Invoices', href: '/dashboard/orders/invoices' },
        { name: 'Shipments', href: '/dashboard/orders/shipments' },
      ]
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

  company: [
    { 
      name: 'Dashboard', 
      href: '/dashboard', 
      icon: HomeIcon 
    },
    {
      name: 'Products',
      icon: ShoppingBagIcon,
      href: '/dashboard/products',
      submenu: [
        { name: 'My Products', href: '/dashboard/products' },
        { name: 'Add Product', href: '/dashboard/products/add' },
      ]
    },
    {
      name: 'Orders',
      icon: ClipboardIcon,
      href: '/dashboard/orders',
      submenu: [
        { name: 'Received Orders', href: '/dashboard/orders' },
        { name: 'Shipments', href: '/dashboard/orders/shipments' },
      ]
    },
    { 
      name: 'Analytics', 
      href: '/dashboard/analytics', 
      icon: ChartBarIcon 
    },
  ],

  user: [
    { 
      name: 'Dashboard', 
      href: '/dashboard', 
      icon: HomeIcon 
    },
    {
      name: 'My Orders',
      icon: ClipboardIcon,
      href: '/dashboard/orders',
    },
    {
      name: 'My Profile',
      href: '/dashboard/profile',
      icon: Cog6ToothIcon
    },
  ],

  manager: [
    { 
      name: 'Dashboard', 
      href: '/dashboard', 
      icon: HomeIcon 
    },
    {
      name: 'Orders',
      icon: ClipboardIcon,
      href: '/dashboard/orders',
      submenu: [
        { name: 'Order Management', href: '/dashboard/orders' },
        { name: 'Shipments', href: '/dashboard/orders/shipments' },
      ]
    },
    { 
      name: 'Reports', 
      href: '/dashboard/reports', 
      icon: DocumentTextIcon 
    },
  ],

  subadmin: [
    { 
      name: 'Dashboard', 
      href: '/dashboard', 
      icon: HomeIcon 
    },
    { 
      name: 'Users', 
      href: '/dashboard/users', 
      icon: UsersIcon 
    },
    {
      name: 'Products',
      icon: ShoppingBagIcon,
      href: '/dashboard/products',
      submenu: [
        { name: 'All Products', href: '/dashboard/products' },
        { name: 'Categories', href: '/dashboard/products/categories' },
      ]
    },
    {
      name: 'Orders',
      icon: ClipboardIcon,
      href: '/dashboard/orders',
    },
  ],
}
