'use client'
import CourseToday from '@/components/Home/CourseToday'
import React, { use } from 'react'
import { useSelector } from 'react-redux';
import { selectAuth } from "@/store/features/authSlice";


function page() {
    const { user, isAuthenticated } = useSelector(selectAuth);
    // console.log(user)
    // console.log(isAuthenticated)
  return (
    <>
     <CourseToday />
    </>
   
  )
}

export default page
