import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import ClientLayout from '@/components/ClientLayout'
import { ThemeProvider } from '@/components/providers/ThemeProvider'
import { Toaster } from 'react-hot-toast';
const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Teachercool',
  description: 'Teachercool',
  icons: {
    icon: [
      { url: '/T.png', type: 'image/png' },
      // { url: '/icon.png', type: 'image/png' },
      // { url: '/icon-16x16.png', type: 'image/png', sizes: '16x16' },
      // { url: '/icon-32x32.png', type: 'image/png', sizes: '32x32' },
    ],
    shortcut: ['/favicon.ico'],
    apple: [
      // { url: '/apple-touch-icon.png', sizes: '180x180' },
      { url: '/T.png', sizes: '180x180' },
    ],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider>
          <ClientLayout>{children}</ClientLayout>
           <Toaster position="top-right" reverseOrder={false} />
        </ThemeProvider>
      </body>
    </html>
  )
}
