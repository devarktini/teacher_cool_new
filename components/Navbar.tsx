"use client";
import { useState } from "react";
import Link from "next/link";
import {
  MagnifyingGlassIcon,
  ShoppingCartIcon,
  UserIcon,
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { useDispatch, useSelector } from "react-redux";
import { selectAuth } from "@/store/features/authSlice";
import ThemeToggle from "./ThemeToggle";
import AnimatedSearchBox from "./AnimatedSearchBox";
import logo from '@/public/images/Logo.png'
import rLogo from '@/public/images/rMark.png'
import Image from "next/image";
import Programs from "./Home/Programs";
import { getCompleteUrl } from "@/lib/getCompleteUrl";
import { FaSignInAlt } from "react-icons/fa";
import ProfilePopup from "./Navbar/ProfilePopup";
import T from '@/public/T.png'
import { showLoginPopup } from '@/store/features/loginSlice';

export default function Navbar() {
  const dispatch = useDispatch();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, isAuthenticated } = useSelector(selectAuth);
  const [isProgramOpen, setIsProgramOpen] = useState<boolean>(false);
  const [isProfileOpen, setIsProfileOpen] = useState<boolean>(false);

  const onCLickShowDropdown = () => {
    setIsProgramOpen(true)
  }

  // console.log("auth", isAuthenticated)
  // console.log("user", user)
  const handleLoginClick = () => {
    dispatch(showLoginPopup());
    setIsMobileMenuOpen(false);
  }
  return (
    <>

      <nav className="bg-background sticky top-0 z-40 border-b  pt-2">
        <div className="px-5 ">
          <div className="flex items-center justify-around ">
            {/* Logo */}
            <div className=" w-[112px] relative py-1">
              <Link href='/'>
                <Image
                  src={logo}
                  alt="nav-logo"
                  className="cursor-pointer h-8 md:h-12 w-[80px] md:w-[99px]"
                />
              </Link>

              <div className="absolute top-0 right-5 md:right-0">
                <Image
                  src={rLogo}
                  alt="nav-logo"
                  className="cursor-pointer w-4 h-4 md:h-4"
                />
              </div>
            </div>

            <div className="flex-shrink-0">
              <button
                onClick={() => onCLickShowDropdown()}
                className="
                flex 
                items-center 
                rounded 
                px-3
                py-2 
                text-sm
                md:text-base
                font-medium 
                bg-gradient-to-r 
                from-[#19201a] 
                to-[#5b574a] 
                text-white 
                hover:shadow-lg 
                hover:from-[#313432] 
                hover:to-[#3e3a2b] 
                transition 
                duration-300 
                ease-in-out 
                focus:outline-none 
                focus:ring-2 
                focus:ring-offset-2 
                focus:ring-blue-600
              "
              >
                Programs
                <span className="ml-1 transition-transform transform group-hover:rotate-180">
                  ▼
                </span>
              </button>
            </div>

            {/* Desktop Search Box */}
            <div className="hidden lg:flex flex-1 max-w-lg mx-8">
              <AnimatedSearchBox />
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6">
              {/* Add ThemeToggle before other items */}
              {/* <ThemeToggle /> */}
              <Link href="/careers" className="text-gray-700 font-semibold hover:text-blue-600">
                Careers
              </Link>
              <Link href="/contact" className="text-gray-700 font-semibold hover:text-blue-600">
                Contact Us
              </Link>
              <Link href="/about" className="text-gray-700 font-semibold hover:text-blue-600">
                About Us
              </Link>
              <Link href="/blogs" className="text-gray-700 font-semibold hover:text-blue-600">
                Blogs
              </Link>

              <div
                className=""
                onMouseEnter={() => setIsProfileOpen(true)}
                onMouseLeave={() => setIsProfileOpen(false)}
              >
                {isAuthenticated ? (
                  <Link
                    href="/profile"
                    className="flex flex-col items-center text-gray-700 hover:text-blue-600 cursor-pointer"
                  >

                    {user?.profile?.profile_image ?
                      <img
                        src={getCompleteUrl(user?.profile?.profile_image)}
                        alt={user?.name}
                        className="h-8 w-8 rounded-full"
                      /> :
                      <Image src={T} alt="loading..." className="h-8 w-8 rounded-full" />
                    }
                    <span className="ml-2 text-sm">{user?.name}</span>
                  </Link>
                ) : (
                  <button
                    onClick={handleLoginClick}
                    className=" text-blue-500 px-4 py-2 rounded border border-blue-500 hover:bg-blue-100 transition"
                  >
                    Login
                  </button>
                )}

                {/* Popup appears in same hover zone */}
                {isAuthenticated && isProfileOpen && (
                  <ProfilePopup />
                )}
              </div>

              {/* <Link
              href="/cart"
              className="flex items-center text-gray-700 hover:text-blue-600 relative"
            >
              <ShoppingCartIcon className="h-6 w-6" />
              <span className="absolute -top-2 -right-2 bg-blue-600 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">
                {itemCount}
              </span>
            </Link> */}
            </div>

            {/* Mobile menu button */}
            <div className="flex md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-gray-700 hover:text-blue-600"
              >
                {isMobileMenuOpen ? (
                  <XMarkIcon className="h-6 w-6" />
                ) : (
                  <Bars3Icon className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>


          {/* Mobile Search Box */}
          <div className="md:hidden py-2">
            <AnimatedSearchBox />
          </div>
        </div>

        <div className="h-8 hidden xl:flex items-center justify-center space-x-6 md:space-x-12 text-sm md:text-lg font-bold bg-gradient-to-r from-purple-500 to-[#f1c40f] shadow-lg overflow-x-auto">
          <Link
            href="/for-individual"
          >
            For Individuals
          </Link>
          <Link
            href="/universities"

          >
            For Universities
          </Link>
          <Link
            href="/corporates"

          >
            For Corporates
          </Link>
        </div>

        {/* Mobile Navigation Menu */}
        <div
          className={`fixed inset-0 z-50 ${isMobileMenuOpen ? "block" : "hidden"
            }`}
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <div
            className={`fixed inset-y-0 left-0 transform ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
              } transition-transform duration-300 bg-white w-64`}
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the sidebar
          >
            <div className="px-4 pt-4 pb-3 space-y-1 border-r h-full">
              {/* Logo */}
              <div className="flex-shrink-0 mb-4">
                <Link href="/" className="flex items-center">
                  <Image src={logo} alt="loading.." className="w-20 h-10" />
                </Link>
              </div>
              {/* <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-gray-700 hover:text-blue-600 mb-4"
            >
              <XMarkIcon className="h-6 w-6" />
            </button> */}
              <Link
                href="/for-individual"
                className="block px-3 py-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                For Individual
              </Link>

              <Link
                href="/universities"
                className="block px-3 py-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Universities
              </Link>

              <Link
                href="/corporates"
                className="block px-3 py-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Corporates
              </Link>
              <Link
                href="/careers"
                className="block px-3 py-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Careers
              </Link>
              <Link
                href="/blogs"
                className="block px-3 py-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Blogs
              </Link>

              <Link
                href="/about"
                className="block px-3 py-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                About
              </Link>



              <div className="flex items-center justify-between px-3 py-2">
                {isAuthenticated ? (
                  <Link
                    href="/dashboard"
                    className="flex items-center text-gray-700 hover:text-blue-600"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {user?.profile?.profile_image ?
                      <img
                        src={getCompleteUrl(user?.profile?.profile_image)}
                        alt={user?.name}
                        className="h-8 w-8 rounded-full"
                      /> :
                      <Image src={T} alt="loading..." className="h-8 w-8 rounded-full" />
                    }

                    <span className="ml-2 text-sm">{user?.name}</span>

                  </Link>
                ) : (
                  <button
                    onClick={handleLoginClick}
                    className=" text-blue-500 px-4 py-2 rounded border border-blue-500 hover:bg-blue-100 transition"

                  >
                    <FaSignInAlt size={20} />
                  </button>
                )}

              </div>
            </div>
          </div>
        </div>
      </nav>

      {isProgramOpen && <Programs onClose={() => setIsProgramOpen(false)} />}


      {/* {showLoginModal && (
   
        <div className="bg-black bg-opacity-90 fixed inset-0 w-full h-full z-[9999] flex justify-center items-center">
          <Login
            // setShowSignUpPage={setShowSignUpPage}
            setForgetPassword={setForgetPassword}
            forgetPassword={forgetPassword}
          />
        </div>
      )} */}

    </>
  );
}
