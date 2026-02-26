'use client'
import React, { useEffect, useState } from 'react'
import HomeApiService from '@/services/homeApi'
import Card from '@/components/ui/cards/Card'
import Progress from '@/components/Progress'
import { getCompleteUrl } from '@/lib/getCompleteUrl'
import { FaChevronRight, FaHouse } from 'react-icons/fa6'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import HeaderForm from '@/components/NewCourseDetailPage/HeaderForm'
import AboutThisCourse from '@/components/NewCourseDetailPage/AboutThisCourse'
import AboutOurCourse from '@/components/NewCourseDetailPage/AboutOurCourse'

interface Category {
    id: number
    cat_name: string
    description: string
    banner: string
}

interface Course {
    id: number
    title: string
    description: string
    // 👆 Add any other course fields if available
}

interface FilteredCourseProps {
    category: string
}
function CategoryCourses({ category }: FilteredCourseProps) {
    const catName = category.charAt(0).toUpperCase() + category.slice(1).toLowerCase()

    const [categories, setCategories] = useState<Category[]>([])
    const [categoryId, setCategoryId] = useState<number | null>(null)
    const [courseData, setCourseData] = useState<Course[]>([])
    const [loading, setLoading] = useState<boolean>(true)
    const [catData, setCatData] = useState<Category | null>(null)
    const router = useRouter();

    // 1️⃣ Fetch all categories
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res: any = await HomeApiService.getAllCategory({ all_data: true })
                setCategories(res?.results || [])
            } catch (error) {
                // console.error('Failed to fetch categories:', error)
                return;
            }
        }

        fetchCategories()
    }, [])

    // 2️⃣ Find category ID from category name (case-insensitive)
    useEffect(() => {
        if (!categories.length || !catName) return

        const matchedCategory = categories.find(
            (item) => item.cat_name.toLowerCase() === catName.toLowerCase()
        )

        if (matchedCategory?.id) {
            setCategoryId(matchedCategory.id)
            setCatData(matchedCategory)
        } else {
            console.warn(`No category found matching "${catName}"`)
            setLoading(false)
        }
    }, [categories, catName])

    // 3️⃣ Fetch courses for matched category
    useEffect(() => {
        const fetchCoursesByCategory = async () => {
            if (!categoryId) return
            setLoading(true)
            try {
                const res: any = await HomeApiService.getCourseByCatId(categoryId)
                setCourseData(res?.data || [])
            } catch (error) {
                console.error('Error fetching course by category:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchCoursesByCategory()
    }, [categoryId])


    // return (
    //     <div className="my-8 px-4 sm:px-6 lg:px-8 md:py-5 max-w-8xl mx-auto">
    //         <div className="  w-full m-auto mb-4">
    //             <ul className=" flex items-center gap-1 md:gap-3">
    //                 <li>
    //                     <FaHouse
    //                         className="w-[16px] h-[16px] lg:w-[22px] lg:h-[22px] text-[#767777] cursor-pointer"
    //                         onClick={() => router.push("/")}
    //                     />
    //                 </li>
    //                 <li>
    //                     <FaChevronRight className="text-[10px] md:text-sm text-[#767777] " />
    //                 </li>

    //                     <li 
    //                     onClick={() => router.push(`/courses/`)}
    //                     className="text-[10px] text-nowrap md:text-sm text-[#767777] font-Roboto cursor-pointer">
    //                         Courses
    //                     </li>

    //                 {/* <Link
    //                     href={{
    //                         pathname: "/courses",
    //                         search: "?query=free",
    //                     }}
    //                 >
    //                     <li className="text-[10px] text-nowrap md:text-sm text-[#767777] font-Roboto cursor-pointer">
    //                         Courses
    //                     </li>
    //                 </Link> */}
    //                 <li>
    //                     <FaChevronRight className="text-[10px] md:text-sm text-[#767777] " />
    //                 </li>
    //                 <li
    //                     // onClick={() => router.push(`/browse/${specificCourse.catname.toLowerCase().replace(/\s+/g, '-')}`)}
    //                     onClick={() => router.push(`/courses/${catData?.cat_name?.toLowerCase()?.replace(/\s+/g, '-')}`)}
    //                     className="text-[10px] text-nowrap md:text-sm text-[#767777] font-Roboto cursor-pointer">
    //                     {catData?.cat_name}
    //                 </li>
    //             </ul>
    //         </div>
    //         {/* categoryData  */}
    //         <div className="w-full">
    //             <div className=" lg:flex items-start gap-4 justify-between">
    //                 <div>
    //                     <h1 className="text-3xl font-semibold text-[#1E1E1E] leading-tight">
    //                         {catData?.cat_name} Courses
    //                     </h1>
    //                     <p className="text-base text-[#1E1E1E] mt-1 max-w-3xl ">
    //                         {catData?.description || "No description available."}
    //                     </p>
    //                 </div>

    //                 <img
    //                     src={getCompleteUrl(catData?.banner || "")}
    //                     alt={catData?.cat_name}
    //                     className=" w-full lg:w-[50%] h-[70%] object-contain rounded-md my-5 lg:mt-0"
    //                 />
    //             </div>
    //         </div>


    //         <h2 className="text-xl lg:text-2xl font-bold text-gray-800 mb-6 border-b-2 border-blue-300 inline-block pb-1 break-words">
    //             Related Courses for{' '}
    //             <span className="text-blue-500 capitalize">{catName}</span>
    //         </h2>

    //         {/* Loading state */}
    //         {loading ? (
    //             <Progress />
    //         ) : courseData?.length > 0 ? (
    //             <div className="w-full">
    //                 <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
    //                     <Card data={courseData} />
    //                 </div>
    //             </div>
    //         ) : (
    //             <div className="bg-yellow-50 border-l-4 border-yellow-400 text-yellow-700 p-4 rounded shadow mt-4">
    //                 <p className="text-sm md:text-base font-medium">
    //                     No courses found for this category.
    //                 </p>
    //             </div>
    //         )}
    //     </div>
    // )

    return (<>
        <HeaderForm id={categoryId} type="category" />
        <AboutThisCourse id={categoryId} type="category" />
        <AboutOurCourse id={categoryId} type="category" />
    </>)
}


export default CategoryCourses
