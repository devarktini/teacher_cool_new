
'use client'

import CorporateDashboard from "@/components/Corporate/Dashboard/CorporateDashboard"
import StudentDashboard from "@/components/Students/StudentDashboard"
import TeacherDashboard from "@/components/Teacher/Dashboard/TeacherDashboard"
import { selectAuth } from "@/store/features/authSlice"
import { UserRole } from "@/types/auth"
import { useSelector } from "react-redux"

export default function DashboardPage() {
  const { user_type, isAuthenticated } = useSelector(selectAuth);

  if (!isAuthenticated) {
    return <div>Please log in to view the dashboard.</div>;
  }

  if (!user_type) {
    return <div>Unknown user type</div>;
  }

  const dashboardComponents: Record<UserRole, JSX.Element> = {
    student: <StudentDashboard />,
    teacher: <TeacherDashboard />,
    corporate : <CorporateDashboard />,
    university: <CorporateDashboard />, 
    admin: <div>Admin Dashboard</div>,
  };

  return dashboardComponents[user_type] || <div>Unknown user type</div>;
}



// export default function DashboardPage() {
//   const { user_type, user, isAuthenticated } = useSelector(selectAuth)

//   return (
//     // <>{user_type === "student" ? <StudentDashboard /> : <TeacherDashboard />}</>
//     <>{
//       isAuthenticated ? (
//         user_type === "student" ? <StudentDashboard /> : user_type === 'teacher' ? <TeacherDashboard /> : user_type === 'corporate' ? <CorporateDashboard /> : user_type === 'university' ? <div>Admin Dashboard</div> : <div>Unknown user type</div>
//       ) : (
//         <div>Please log in to view the dashboard.</div>
//       )
//     }</>
//   )
// }
