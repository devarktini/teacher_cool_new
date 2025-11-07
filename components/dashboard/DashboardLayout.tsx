"use client";
import { useState, useEffect, useRef } from "react";
import {
  Bars3Icon,
  XMarkIcon,
  ArrowLeftCircleIcon,
  ArrowRightCircleIcon,
  PowerIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useDispatch, useSelector } from "react-redux";
import { logout, selectAuth } from "@/store/features/authSlice";
import { useRouter } from "next/navigation";
import { menuConfig } from "@/config/menuConfig";
import { UserRole } from "@/types/auth";
import { getCompleteUrl } from "@/lib/getCompleteUrl";
import Logo from "@/public/images/Logo.png";
import Image from "next/image";
import profileNull from "@/public/images/profileNull.jpg";
import { showLoginPopup } from "@/store/features/loginSlice";
import { CogIcon, UserIcon } from "lucide-react";
import { getProfilePath } from "@/lib/getProfilePath";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user_type, user, isAuthenticated } = useSelector(selectAuth);
  const role = (user_type ?? "student") as UserRole;
  const sidebarItems = menuConfig[role];
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const pathname = usePathname();
  const dispatch = useDispatch();
  const router = useRouter();
    const dropdownRef = useRef<HTMLDivElement>(null);

  // ✅ Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setUserDropdownOpen(false);
      }
    }

    if (userDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [userDropdownOpen]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const storedToken = localStorage.getItem("token");
    if (!storedToken) {
      dispatch(showLoginPopup());
    } else {
      setIsCheckingAuth(false);
    }
  }, [router]);

  const handleLogout = () => {
    dispatch(logout());
    router.push("/");
  };


  const handleProfileMenu = () => {
    const path = getProfilePath(user_type);
    router.push(path);
  }
  

  const NavItem = ({
    item,
    isCollapsed,
  }: {
    item: any;
    isCollapsed: boolean;
  }) => {
    const [isHovered, setIsHovered] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const [isSubmenuOpen, setIsSubmenuOpen] = useState(false);
    const timeoutRef = useRef<NodeJS.Timeout>();
    const hasSubmenu = item.submenu && item.submenu.length > 0;
    const isActive = hasSubmenu
      ? item.submenu.some((subitem: any) => subitem.href === pathname)
      : item.href === pathname;

    useEffect(() => {
      return () => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
      };
    }, []);

    const handleMouseEnter = () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      setIsHovered(true);
      if (isCollapsed && hasSubmenu) {
        setIsSubmenuOpen(true);
      }
    };

    const handleMouseLeave = () => {
      timeoutRef.current = setTimeout(() => {
        if (!isFocused) {
          setIsHovered(false);
          setIsSubmenuOpen(false);
        }
      }, 150);
    };

    const handleFocus = () => {
      setIsFocused(true);
      setIsSubmenuOpen(true);
    };

    const handleBlur = () => {
      setIsFocused(false);
      if (!isHovered) {
        setIsSubmenuOpen(false);
      }
    };

    return (
      <div
        className="relative group"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onFocus={handleFocus}
        onBlur={handleBlur}
      >
        <Link
          href={item.href || "#"}
          className={cn(
            "flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-xl mx-2 transition-all duration-300 group",
            isActive &&
              "bg-gradient-to-r from-blue-50 to-blue-100 text-blue-600 border border-blue-600  shadow-sm"
          )}
          onClick={(e) => {
            if (hasSubmenu && !isCollapsed) {
              e.preventDefault();
              setOpenSubmenu(openSubmenu === item.name ? null : item.name);
            }
          }}
        >
          <div
            className={cn(
              "p-2 rounded-lg transition-all duration-300 group-hover:scale-110",
              isActive
                ? "bg-blue-100 text-blue-600 border border-blue-300"
                : "bg-gray-100 text-gray-600 group-hover:bg-blue-100 group-hover:text-blue-600"
            )}
          >
            <item.icon className="h-4 w-4" />
          </div>
          {!isCollapsed && (
            <>
              <span className="flex-1 font-medium text-sm">{item.name}</span>
              {hasSubmenu && (
                <ChevronDownIcon
                  className={cn(
                    "h-4 w-4 transition-transform duration-300 flex-shrink-0",
                    openSubmenu === item.name && "rotate-180"
                  )}
                />
              )}
            </>
          )}
        </Link>

        {hasSubmenu &&
          (isCollapsed ? (
            <div
              className={cn(
                "absolute left-full top-0 ml-2 w-56 bg-white border border-gray-200 rounded-xl shadow-2xl z-[1000] py-2",
                isSubmenuOpen || isHovered || isFocused
                  ? "block animate-fadeIn"
                  : "hidden"
              )}
              onMouseEnter={() => setIsSubmenuOpen(true)}
              onMouseLeave={() => !isFocused && setIsSubmenuOpen(false)}
            >
              {item.submenu.map((subitem: any) => (
                <Link
                  key={subitem.href}
                  href={subitem.href}
                  className={cn(
                    "block px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200 mx-2 rounded-lg",
                    subitem.href === pathname &&
                      "bg-blue-50 text-blue-600 font-medium"
                  )}
                  onClick={() => {
                    setIsSubmenuOpen(false);
                    setIsHovered(false);
                    setIsFocused(false);
                  }}
                >
                  {subitem.name}
                </Link>
              ))}
            </div>
          ) : (
            <div
              className={cn(
                "pl-4 space-y-1 overflow-hidden transition-all duration-300",
                openSubmenu === item.name
                  ? "max-h-96 opacity-100"
                  : "max-h-0 opacity-0"
              )}
            >
              {item.submenu.map((subitem: any) => (
                <Link
                  key={subitem.href}
                  href={subitem.href}
                  className={cn(
                    "block px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg mx-2 transition-colors duration-200",
                    subitem.href === pathname &&
                      "bg-blue-50 text-blue-600 font-medium"
                  )}
                >
                  {subitem.name}
                </Link>
              ))}
            </div>
          ))}
      </div>
    );
  };

  const TopBarDateTime = () => {
    const [dateTime, setDateTime] = useState(new Date());

    useEffect(() => {
      const interval = setInterval(() => {
        setDateTime(new Date());
      }, 1000);
      return () => clearInterval(interval);
    }, []);

    return (
      <div className="flex items-center gap-3 bg-gray-50 px-4 py-2 rounded-xl border border-gray-200">
        <span className="text-sm font-medium text-gray-700">
          {dateTime.toLocaleDateString()}
        </span>
        <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
        <span className="text-sm font-medium text-gray-700">
          {dateTime.toLocaleTimeString()}
        </span>
      </div>
    );
  };

  if (isCheckingAuth) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600 font-medium">Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30">
      {/* Mobile Sidebar Overlay */}
      <div
        className={cn(
          "fixed inset-0  lg:hidden z-[999] transition-opacity duration-300",
          sidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
      >
        <div
          className={cn(
            "fixed inset-y-0 left-0 w-80 bg-white transform transition-transform duration-300 shadow-2xl flex flex-col",
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          {/* Fixed Header */}
          <div className="flex-shrink-0 flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <Image
                src={Logo}
                alt="TeacherCool"
                className="h-8 w-auto cursor-pointer"
                onClick={() => {
                  router.push("/");
                  setSidebarOpen(false);
                }}
              />
              <span className="text-white font-semibold text-lg">
                TeacherCool
              </span>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors duration-200"
            >
              <XMarkIcon className="h-6 w-6 text-black" />
            </button>
          </div>

          {/* Scrollable Navigation Menu */}
          <div className="flex-1 overflow-y-auto py-4 custom-scrollbar">
            <nav className="space-y-2 px-4">
              {sidebarItems.map((item) => (
                <div key={item.name} className="space-y-1">
                  <Link
                    href={item.href || "#"}
                    className={cn(
                      "flex items-center gap-3 px-4 py-4 text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-100 hover:text-blue-600 rounded-xl transition-all duration-300 group",
                      (item.href === pathname ||
                        (item.submenu &&
                          item.submenu.some(
                            (sub: any) => sub.href === pathname
                          ))) &&
                        "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg"
                    )}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <div
                      className={cn(
                        "p-3 rounded-xl transition-all duration-300 group-hover:scale-110",
                        item.href === pathname ||
                          item.submenu?.some(
                            (sub: any) => sub.href === pathname
                          )
                          ? "bg-white/20 text-white"
                          : "bg-gray-100 text-gray-600 group-hover:bg-blue-100 group-hover:text-blue-600"
                      )}
                    >
                      <item.icon className="h-5 w-5" />
                    </div>
                    <span className="font-semibold text-sm">{item.name}</span>
                  </Link>
                  {item.submenu && (
                    <div className="pl-4 mt-1 space-y-1">
                      {item.submenu.map((subitem: any) => (
                        <Link
                          key={subitem.href}
                          href={subitem.href}
                          className={cn(
                            "flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-all duration-200 border-l-2 border-transparent",
                            pathname === subitem.href &&
                              "bg-blue-50 text-blue-600 font-semibold border-l-2 border-blue-500"
                          )}
                          onClick={() => setSidebarOpen(false)}
                        >
                          {subitem.icon && <subitem.icon className="h-4 w-4" />}
                          {subitem.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </nav>
          </div>

          {/* Fixed Footer with Actions */}
          {/* <div className="flex-shrink-0 border-t border-gray-200 bg-white p-4">
            <div className="space-y-2">
          
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-colors duration-200"
              >
                <PowerIcon className="h-5 w-5" />
                <span className="font-medium text-sm">Sign Out</span>
              </button>
            </div>
          </div> */}

        </div>

     
      </div>

      {/* Desktop Sidebar */}
      <div
        className={cn(
          "hidden lg:fixed lg:inset-y-0 lg:flex lg:flex-col transition-all duration-500 bg-white border-r border-gray-200 shadow-lg",
          isCollapsed ? "lg:w-20" : "lg:w-64"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Fixed Header */}
          <div className="flex-shrink-0 flex items-center h-20 px-4 border-b border-gray-200 justify-between ">
            {!isCollapsed && (
              <Image
                src={Logo}
                alt="TeacherCool"
                className="h-8 w-auto cursor-pointer"
                onClick={() => router.push("/")}
              />
            )}
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-2 rounded-lg hover:bg-white/10 transition-all duration-300 text-gray-600"
            >
              {isCollapsed ? (
                <ArrowRightCircleIcon className="h-8 w-8" />
              ) : (
                <ArrowLeftCircleIcon className="h-8 w-8" />
              )}
            </button>
          </div>

          {/* Scrollable Navigation Menu */}
          <div className="flex-1 overflow-y-auto custom-scrollbar py-4">
            <nav className="space-y-2 px-2">
              {sidebarItems.map((item) => (
                <NavItem
                  key={item.name}
                  item={item}
                  isCollapsed={isCollapsed}
                />
              ))}
            </nav>
          </div>

          {/* Fixed Footer with User Info */}
          <div className="flex-shrink-0 p-4 border-t border-gray-200 bg-white">
            {/* {!isCollapsed && (
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                {user?.profile?.profile_image ? (
                  <img
                    src={getCompleteUrl(user.profile.profile_image)}
                    alt={user.name}
                    className="w-10 h-10 rounded-full border-2 border-white shadow-sm"
                  />
                ) : (
                  <Image
                    src={T}
                    alt="User"
                    className="w-10 h-10 rounded-full border-2 border-white shadow-sm"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 text-sm truncate">
                    {user?.name || "User"}
                  </p>
                  <p className="text-gray-500 text-xs capitalize">
                    {user_type || "user"}
                  </p>
                </div>
              </div>
            )} */}

            {/* Additional Footer Actions */}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div
        className={cn(
          "lg:flex lg:flex-col min-h-screen transition-all duration-500",
          isCollapsed ? "lg:pl-20" : "lg:pl-64"
        )}
      >
        {/* Top Bar */}
        <header className="bg-white shadow-sm sticky z-50 top-0 border-b border-gray-200 backdrop-blur-sm bg-white/95">
          <div className="flex h-20 items-center justify-between px-6">
            <div className="flex items-center gap-4 flex-1">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 hover:bg-gray-100 rounded-xl transition-colors duration-200"
              >
                <Bars3Icon className="h-6 w-6 text-gray-600" />
              </button>
              <h1 className="text-2xl font-bold text-gray-900 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {sidebarItems.find((item) => item.href === pathname)?.name ||
                  sidebarItems.find((item) =>
                    item.submenu?.some((sub: any) => sub.href === pathname)
                  )?.name ||
                  "Dashboard"}
              </h1>
            </div>

            {/* DateTime and User Info */}
            <div className="flex items-center gap-6">
              <div className="hidden xl:block">
                <TopBarDateTime />
              </div>

              {/* User Dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-xl transition-all duration-200 border border-gray-200"
                >
                  <div className="flex items-center gap-3">
                    {user?.profile?.profile_image ? (
                      <img
                        src={getCompleteUrl(user.profile.profile_image)}
                        alt={user.name}
                        className="w-10 h-10 rounded-full border-2 border-blue-200 shadow-sm"
                      />
                    ) : (
                      <Image
                        src={profileNull}
                        alt="User"
                        className="w-10 h-10 rounded-full border-2 border-blue-200 shadow-sm"
                      />
                    )}
                    <div className="hidden sm:flex flex-col items-start text-left">
                      <span className="font-semibold text-gray-900 text-sm">
                        {user?.name || "User"}
                      </span>
                      <span className="text-gray-500 text-xs capitalize">
                        {user_type || "user"}
                      </span>
                    </div>
                    <ChevronDownIcon
                      className={cn(
                        "h-4 w-4 text-gray-400 transition-transform duration-200",
                        userDropdownOpen && "rotate-180"
                      )}
                    />
                  </div>
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-gray-200 rounded-xl shadow-2xl z-50 py-2 animate-fadeIn">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="font-semibold text-gray-900">
                        {user?.name}
                      </p>
                      <p className="text-sm text-gray-500">{user?.email}</p>
                    </div>
                    <div className="py-1">
                      <button
                        
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200"
                        onClick={() => {
                           handleProfileMenu();
                          setUserDropdownOpen(false)}}
                      >
                        Profile Settings
                      </button>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200 flex items-center gap-2"
                      >
                        <PowerIcon className="h-4 w-4" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 min-h-[calc(100vh-8rem)]">
            {children}
          </div>
        </main>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 2px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}</style>
    </div>
  );
}
