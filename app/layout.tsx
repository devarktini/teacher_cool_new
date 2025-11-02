import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import ClientLayout from '@/components/ClientLayout'
import { ThemeProvider } from '@/components/providers/ThemeProvider'
import { Toaster } from 'react-hot-toast';
const inter = Inter({ subsets: ['latin'] })

// export const metadata: Metadata = {
//   title: 'Teachercool',
//   description: 'Teachercool',
//   icons: {
//     icon: [
//       { url: '/T.png', type: 'image/png' },
//       // { url: '/icon.png', type: 'image/png' },
//       // { url: '/icon-16x16.png', type: 'image/png', sizes: '16x16' },
//       // { url: '/icon-32x32.png', type: 'image/png', sizes: '32x32' },
//     ],
//     shortcut: ['/favicon.ico'],
//     apple: [
//       // { url: '/apple-touch-icon.png', sizes: '180x180' },
//       { url: '/T.png', sizes: '180x180' },
//     ],
//   },
// }

export const metadata: Metadata = {
  title: "Teacher Cool - Best Learning Management System for IT Courses",
  description:
    "Teacher Cool - The ultimate Learning Management System (LMS) for IT professionals and students. Buy single or multi-course programs, join batch classes, and upgrade your career with expert-led training.",
  keywords:
    "LMS, Learning Management System, online courses, IT training, e-learning, professional development, certification, career growth, software training, full-stack development, cloud computing, web development, Python, Java, AI, Data Science, programming, coding, bootcamp, corporate training, remote learning, self-paced learning, teacher cool, study online",
  authors: [{ name: "Teacher Cool" }],
  openGraph: {
    title: "Teacher Cool - Best Learning Management System for IT Courses",
    description:
      "Join Teacher Cool's LMS and access top online courses for IT professionals and students. Learn at your own pace or in batch classes!",
    url: "https://teachercool.com",
    type: "website",
    images: [
      {
        url: "/T.png", // make sure this file exists in /public
        width: 1200,
        height: 630,
        alt: "Teacher Cool Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Teacher Cool - Best LMS for IT Courses",
    description:
      "Buy single and multi-course programs, join batch training, and upskill in IT with Teacher Cool!",
    images: ["/T.png"],
  },
  alternates: {
    canonical: "https://teachercool.com",
  },
};

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
