import Link from 'next/link'
import Image from 'next/image'
import logo from '@/public/images/Logo.png'
import rLogo from '@/public/images/rMarkW.png'
import { FaFacebookF, FaInstagram, FaXTwitter, FaLinkedinIn } from "react-icons/fa6";
import { GlobeIcon } from "@radix-ui/react-icons";

export default function Footer() {
  return (
    <footer className="bg-blue-950 text-gray-400 py-12 px-6 md:px-20 lg:px-32">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between gap-10">
        {/* Brand / Intro */}
        <div className="flex flex-col gap-4 max-w-sm ">
          <div className="relative w-[140px]">
            {/* Main logo */}
            <Image src={logo} alt="TeacherCool logo" width={125} height={48} className="object-contain" />
            {/* Registered mark */}
            <div className="absolute top-0 right-0 w-4 h-4">
              <Image src={rLogo} alt="registered mark" width={16} height={16} />
            </div>
          </div>

          <p className="text-sm text-gray-300">
            Empowering learners worldwide by delivering exceptional educational
            experiences.
          </p>

          <div className="flex gap-4 text-xl" aria-label="social links">
            <a href="https://www.facebook.com/share/1722px7Njj/" target="_blank" rel="noopener noreferrer" className="hover:text-gray-200" aria-label="Facebook">
              <FaFacebookF />
            </a>
            <a href="https://www.instagram.com/teachercool_official/" target="_blank" rel="noopener noreferrer" className="hover:text-gray-200" aria-label="Instagram">
              <FaInstagram />
            </a>
            <a href="https://x.com/TeacherCoo81249" target="_blank" rel="noopener noreferrer" className="hover:text-gray-200" aria-label="X (Twitter)">
              <FaXTwitter />
            </a>
            <a href="https://www.linkedin.com/company/teachercoolofficial/" target="_blank" rel="noopener noreferrer" className="hover:text-gray-200" aria-label="LinkedIn">
              <FaLinkedinIn />
            </a>
            {/* <a href="https://bsky.app/profile/teachercool.bsky.social" target="_blank" rel="noopener noreferrer" className="hover:text-gray-200" aria-label="Bluesky">
              <GlobeIcon className="w-5 h-5" />
            </a> */}
          </div>
        </div>

        {/* Links */}
        <nav className="grid grid-cols-2 md:grid-cols-4 gap-8 text-sm" aria-label="footer navigation">
          <div>
            <h4 className="font-semibold text-gray-200 mb-2">Solutions</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="hover:text-white hover:underline">About</Link>
              </li>
              <li>
                <Link href="/whatweoffer" className="hover:text-white hover:underline">What We Offer</Link>
              </li>
              <li>
                <Link href="/corporates" className="hover:text-white hover:underline">For Corporates</Link>
              </li>
              <li>
                <Link href="/universities" className="hover:text-white hover:underline">For Universities</Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-gray-200 mb-2">Support</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/blogs" className="hover:underline hover:text-white">Blogs</Link>
              </li>
              <li>
                <Link href="/articles" className="hover:underline hover:text-white">Articles</Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-gray-200 mb-2">Company</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/terms" className="hover:underline hover:text-white">Terms</Link>
              </li>
              <li>
                <Link href="/policy" className="hover:underline hover:text-white">Privacy</Link>
              </li>
              <li>
                <Link href="/contact" className="hover:underline hover:text-white">Contact Us</Link>
              </li>
              <li>
                <Link href="/about" className="hover:underline hover:text-white">About Us</Link>
              </li>
            </ul>
          </div>

         
        </nav>
      </div>

      {/* Bottom */}
      <div className="mt-10 border-t border-gray-700 pt-6 text-center text-sm text-gray-300">
        <div className="mb-2">
          B-99, Khirki Extension, Panchsheel Vihar, Sheikh Sarai Village, Malviya Nagar, New Delhi, Delhi 110017
        </div>
        <div>
          © {new Date().getFullYear()} TeacherCool Inc. All rights reserved. The Certification names are the trademarks of their respective owners.
        </div>
      </div>
    </footer>
  )
}
