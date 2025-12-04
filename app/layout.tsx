import './globals.css'
import type { Metadata } from 'next'
import { Roboto } from 'next/font/google'
import ClientLayout from '@/components/ClientLayout'
import { ThemeProvider } from '@/components/providers/ThemeProvider'
import { Toaster } from 'react-hot-toast';
const roboto = Roboto({ subsets: ['latin'], weight: ['400', '500', '700'], variable: '--font-roboto' })


export const metadata: Metadata = {
  title: "Top LMS for Data Science and IT Training | TeacherCool LMS",
  description:
    "TeacherCool is India’s leading LMS for Data Science, Analytics, and IT skills. Explore 200+ courses, live mentorship, internships, and job-ready certifications. Learn at your pace with lifetime access.",
  keywords:
    "Best LMS for Data Science, Online IT training platform, Data Science internship India, LMS for analytics professionals, Career-focused LMS Learn Python and ML, LMS with certification, TeacherCool LMS features",
  authors: [{ name: "Teacher Cool" }],
  icons: {
    icon: "/T.png", // ✅ Place your favicon here
    shortcut: "/T.png",
    apple: "/T.png",
  },
  openGraph: {
    title: "Top LMS for Data Science and IT Training | TeacherCool LMS",
    description:
      "Join Teacher Cool's LMS and access top online courses for IT professionals and students. Learn at your own pace or in batch classes!",
    url: "https://teachercool.com",
    type: "website",
    images: ["/T.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Top LMS for Data Science and IT Training | TeacherCool LMS",
    description:
      "Join Teacher Cool's LMS and access top online courses for IT professionals and students. Learn at your own pace or in batch classes!",
    images: ["/T.png"],
  },
  alternates: {
    canonical: "https://teachercool.com",
  },
  other: {
    "google-site-verification": "google30f3ba12a169da7d.html"
  }

};


export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      
      <body className={roboto.className}>
        <ThemeProvider>
          <ClientLayout>{children}</ClientLayout>
          <Toaster position="top-right" reverseOrder={false} />
        </ThemeProvider>
      </body>
    </html>
  )
}
