'use client'
import { usePathname } from 'next/navigation'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { Providers } from '@/store/provider'
import ProgressIndicator from '@/components/ProgressIndicator'
import ErrorBoundary from '@/components/ErrorBoundary'
import GlobalPopup from './GlobalPopup'
import ChatWidget from './chat/ChatWidget'

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const isDashboard = pathname?.startsWith('/dashboard')

  return (
    <Providers>
      <ErrorBoundary>
        <div className="flex flex-col min-h-screen relative">
          {!isDashboard && <Navbar />}
          <main className="flex-grow relative">
            {children}
          </main>
          {!isDashboard && <Footer />}
          <ProgressIndicator />
          <GlobalPopup />
          {/* Temporarily commented out */}
          {/* <ChatWidget /> */}
        </div>
      </ErrorBoundary>
    </Providers>
  )
}
