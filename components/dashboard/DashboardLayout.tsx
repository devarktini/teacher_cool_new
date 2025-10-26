'use client'
import { useState, useEffect, useRef } from 'react'
import {
  Bars3Icon,
  XMarkIcon,
  ArrowLeftCircleIcon,
  ArrowRightCircleIcon,
  PowerIcon,
} from '@heroicons/react/24/outline'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { useDispatch, useSelector } from 'react-redux'
import { logout, selectAuth } from '@/store/features/authSlice'
import { useRouter } from 'next/navigation'
import { menuConfig } from '@/config/menuConfig'
import { UserRole } from '@/types/auth'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user_type, user, isAuthenticated } = useSelector(selectAuth)
  const role = (user_type ?? 'student') as UserRole
  const sidebarItems = menuConfig[role]
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null)
  const [isCheckingAuth, setIsCheckingAuth] = useState(true)
  const pathname = usePathname()
  const dispatch = useDispatch()
  const router = useRouter()

  useEffect(() => {
    // Check if we're in the browser environment
    if (typeof window === 'undefined') return

    // Check localStorage directly for token
    const storedToken = localStorage.getItem('token')
    
    if (!storedToken) {
      router.push('/login')
    } else {
      setIsCheckingAuth(false)
    }
  }, [router])

  const handleLogout = () => {
    dispatch(logout())
    router.push('/login')
  }

  const NavItem = ({ item, isCollapsed }: { item: any, isCollapsed: boolean }) => {
    const [isHovered, setIsHovered] = useState(false)
    const [isFocused, setIsFocused] = useState(false)
    const [isSubmenuOpen, setIsSubmenuOpen] = useState(false)
    const timeoutRef = useRef<NodeJS.Timeout>()
    const hasSubmenu = item.submenu && item.submenu.length > 0
    const isActive = hasSubmenu
      ? item.submenu.some((subitem: any) => subitem.href === pathname)
      : item.href === pathname

    // Clear timeout on unmount
    useEffect(() => {
      return () => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current)
        }
      }
    }, [])

    const handleMouseEnter = () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      setIsHovered(true)
      if (isCollapsed && hasSubmenu) {
        setIsSubmenuOpen(true)
      }
    }

    const handleMouseLeave = () => {
      timeoutRef.current = setTimeout(() => {
        if (!isFocused) {
          setIsHovered(false)
          setIsSubmenuOpen(false)
        }
      }, 100)
    }

    const handleFocus = () => {
      setIsFocused(true)
      setIsSubmenuOpen(true)
    }

    const handleBlur = () => {
      setIsFocused(false)
      if (!isHovered) {
        setIsSubmenuOpen(false)
      }
    }

    return (
      <div
        className="relative group"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onFocus={handleFocus}
        onBlur={handleBlur}
      >
        <Link
          href={item.href || '#'}
          className={cn(
            "flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md mx-2",
            isActive && "bg-blue-50 text-blue-600"
          )}
          onClick={(e) => {
            if (hasSubmenu && !isCollapsed) {
              e.preventDefault()
              setOpenSubmenu(openSubmenu === item.name ? null : item.name)
            }
          }}
        >
          <item.icon className="h-5 w-5" />
          {!isCollapsed && (
            <>
              <span className="flex-1">{item.name}</span>
              {hasSubmenu && (
                <ArrowRightCircleIcon className={cn(
                  "h-4 w-4 transition-transform",
                  openSubmenu === item.name && "rotate-90"
                )} />
              )}
            </>
          )}
        </Link>

        {hasSubmenu && (isCollapsed ? (
          <div
            className={cn(
              "absolute left-full top-0 ml-2 w-48 bg-white border rounded-md shadow-lg z-[1000]",
              (isSubmenuOpen || isHovered || isFocused) ? "block" : "hidden"
            )}
            onMouseEnter={() => setIsSubmenuOpen(true)}
            onMouseLeave={() => !isFocused && setIsSubmenuOpen(false)}
          >
            {item.submenu.map((subitem: any) => (
              <Link
                key={subitem.href}
                href={subitem.href}
                className={cn(
                  "block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100",
                  subitem.href === pathname && "bg-blue-50 text-blue-600"
                )}
                onClick={() => {
                  setIsSubmenuOpen(false)
                  setIsHovered(false)
                  setIsFocused(false)
                }}
              >
                {subitem.name}
              </Link>
            ))}
          </div>
        ) : (
          <div className={cn(
            "pl-4 space-y-1 overflow-hidden transition-all",
            openSubmenu === item.name ? "max-h-40" : "max-h-0"
          )}>
            {item.submenu.map((subitem: any) => (
              <Link
                key={subitem.href}
                href={subitem.href}
                className={cn(
                  "block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md mx-2",
                  subitem.href === pathname && "bg-blue-50 text-blue-600"
                )}
              >
                {subitem.name}
              </Link>
            ))}
          </div>
        ))}
      </div>
    )
  }

  const TopBarDateTime = () => {
    const [dateTime, setDateTime] = useState(new Date())

    useEffect(() => {
      const interval = setInterval(() => {
        setDateTime(new Date())
      }, 1000)

      return () => clearInterval(interval)
    }, [])

    return (
      <div className="flex items-center gap-2">
        <span className="text-gray-600">{dateTime.toLocaleDateString()}</span>
        <span className="text-gray-600">{dateTime.toLocaleTimeString()}</span>
      </div>
    )
  }

  // Show loading spinner while checking authentication
  if (isCheckingAuth) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar for mobile */}
      <div className={cn(
        "fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity",
        sidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      )}>
        <div className={cn(
          "fixed inset-y-0 left-0 w-64 bg-white transform transition-transform duration-300",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}>
          <div className="flex items-center justify-between p-4 border-b">
            <span className="text-xl font-bold">Dashboard</span>
            <button 
              onClick={() => setSidebarOpen(false)}
              className="p-2 hover:bg-gray-100 rounded-md"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>
          <nav className="mt-4 space-y-1 p-2">
            {sidebarItems.map((item) => (
              <div key={item.name}>
                <div className="flex flex-col">
                  <Link
                    href={item.href || '#'}
                    className={cn(
                      "flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md",
                      (item.href === pathname ||
                        (item.submenu && item.submenu.some((sub: any) => sub.href === pathname))) &&
                      "bg-blue-50 text-blue-600"
                    )}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <item.icon className="h-5 w-5" />
                    {item.name}
                  </Link>
                  {item.submenu && (
                    <div className="pl-4 mt-1 space-y-1">
                      {item.submenu.map((subitem: any) => (
                        <Link
                          key={subitem.href}
                          href={subitem.href}
                          className={cn(
                            "block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md",
                            pathname === subitem.href && "bg-blue-50 text-blue-600"
                          )}
                          onClick={() => setSidebarOpen(false)}
                        >
                          {subitem.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </nav>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className={cn(
        "hidden lg:fixed lg:inset-y-0 lg:flex lg:flex-col transition-all duration-300 bg-white border-r border-gray-200",
        isCollapsed ? "lg:w-16" : "lg:w-64"
      )}>
        <div className="flex flex-col flex-grow">
          <div className="flex items-center h-16 flex-shrink-0 px-4 border-b justify-between">
            {!isCollapsed && <span className="text-xl font-bold">Dashboard</span>}
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-1 rounded-full hover:bg-gray-100 transition-colors"
            >
              {isCollapsed ? (
                <ArrowRightCircleIcon className="h-5 w-5" />
              ) : (
                <ArrowLeftCircleIcon className="h-5 w-5" />
              )}
            </button>
          </div>
          <nav className="flex-1 space-y-2 py-4">
            {sidebarItems.map((item) => (
              <NavItem key={item.name} item={item} isCollapsed={isCollapsed} />
            ))}
          </nav>
        </div>
      </div>

      {/* Main content */}
      <div className={cn(
        "lg:flex lg:flex-col min-h-screen transition-all duration-300",
        isCollapsed ? "lg:pl-16" : "lg:pl-64"
      )}>
        {/* Top bar */}
        <header className="bg-white shadow-sm border-b">
          <div className="flex h-16 items-center justify-between px-4 sm:px-6">
            <div className="flex items-center gap-4 flex-1">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 hover:bg-gray-100 rounded-md"
              >
                <Bars3Icon className="h-6 w-6" />
              </button>
              <h1 className="text-xl font-semibold text-gray-900">
                {sidebarItems.find(item => item.href === pathname)?.name ||
                  sidebarItems.find(item => item.submenu?.some((sub: any) => sub.href === pathname))?.name ||
                  'Dashboard'}
              </h1>
            </div>

            {/* DateTime and User Info */}
            <div className="flex items-center gap-4">
              <div className="hidden sm:block">
                <TopBarDateTime />
              </div>
              
              <div className="flex items-center gap-3">
                <div className="hidden sm:flex flex-col items-end text-sm">
                  <span className="font-medium text-gray-900">{user?.name || 'User'}</span>
                  <span className="text-gray-500 capitalize">{user_type || 'user'}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-3 py-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                  title="Logout"
                >
                  <PowerIcon className="h-5 w-5" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 sm:p-6">
          {children}
        </main>
      </div>
    </div>
  )
}