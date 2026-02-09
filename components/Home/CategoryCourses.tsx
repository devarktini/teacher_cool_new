'use client'
import React, { useEffect, useState } from 'react'
import HomeApiService from '@/services/homeApi'
import Card from '@/components/ui/cards/Card'
import Progress from '@/components/Progress'

interface Category {
    id: number
    cat_name: string
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
    const catName =
        category.charAt(0).toUpperCase() + category.slice(1).toLowerCase()

    const [categories, setCategories] = useState<Category[]>([])
    const [categoryId, setCategoryId] = useState<number | null>(null)
    const [courseData, setCourseData] = useState<Course[]>([])
    const [loading, setLoading] = useState<boolean>(true)

    // 1️⃣ Fetch all categories
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res: any = await HomeApiService.getAllCategory()
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

   
    return (
        <div className="my-10 px-4 sm:px-6 lg:px-8 md:py-5 max-w-[1280px] mx-auto">
            {/* Heading */}
            <h2 className="text-2xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800 mb-6 border-b-2 border-blue-300 inline-block pb-1 break-words">
                Related Courses for{' '}
                <span className="text-blue-500 capitalize">{catName}</span>
            </h2>

            {/* Loading state */}
            {loading ? (
                <Progress />
            ) : courseData?.length > 0 ? (
                <div className="w-full">
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
                        <Card data={courseData} />
                    </div>
                </div>
            ) : (
                <div className="bg-yellow-50 border-l-4 border-yellow-400 text-yellow-700 p-4 rounded shadow mt-4">
                    <p className="text-sm md:text-base font-medium">
                        No courses found for this category.
                    </p>
                </div>
            )}
        </div>
    )
}


export default CategoryCourses
