
'use client'

import StudentDashboard from "@/components/Students/StudentDashboard"
import { selectAuth } from "@/store/features/authSlice"
import { useSelector } from "react-redux"

export default function DashboardPage() {
   const { user_type, user, isAuthenticated } = useSelector(selectAuth)

  return (
    <>{user_type === "student" ? <StudentDashboard /> : 'dashboard for teachers'}</>
  )
}
