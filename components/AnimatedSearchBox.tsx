'use client'
import { useState, useEffect, useCallback } from 'react'
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import { useRouter } from 'next/navigation'
import HomeApiService from '@/services/homeApi'

export default function AnimatedSearchBox() {
  const router = useRouter()

  const [placeholder, setPlaceholder] = useState('')
  const [currentTerm, setCurrentTerm] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)
  const [query, setQuery] = useState('')
  const [courseLists, setCourseLists] = useState<any[]>([])
  const [filteredCourses, setFilteredCourses] = useState<any[]>([])
  const [showDropdown, setShowDropdown] = useState(false)

  // ✅ Placeholder animation
  useEffect(() => {
    const searchTerms = [
      'Python For Data Science',
      'AI Programming with Python',
      'Business Analytics with Tableau',
      'Data Analytics',
      'Full Stack Web Developer',
      'Statistics for Data Analytics',
      'Business Intelligence Analytics',
      'Cybersecurity',
      'Cloud Data Warehouses with Azure',
      'Digital Marketing',
    ]
    const timeout = setTimeout(() => {
      const current = searchTerms[currentTerm]
      if (isDeleting) {
        if (placeholder.length === 0) {
          setIsDeleting(false)
          setCurrentTerm((prev) => (prev + 1) % searchTerms.length)
        } else {
          setPlaceholder(current.substring(0, placeholder.length - 1))
        }
      } else {
        if (placeholder.length === current.length) {
          setTimeout(() => setIsDeleting(true), 1000)
        } else {
          setPlaceholder(current.substring(0, placeholder.length + 1))
        }
      }
    }, isDeleting ? 100 : 150)
    return () => clearTimeout(timeout)
  }, [placeholder, currentTerm, isDeleting])

  // ✅ Fetch courses
  const searchCourse = async () => {
    try {
      const data = await HomeApiService.getCourseList()
      setCourseLists(data?.results || [])
    } catch (error) {
      // console.error('Error fetching courses:', error)
      return;
    }
  }

  useEffect(() => {
    searchCourse()
  }, [])

  // ✅ Debounce setup
  const debounce = (func: Function, delay: number) => {
    let timer: NodeJS.Timeout
    return (...args: any[]) => {
      clearTimeout(timer)
      timer = setTimeout(() => func(...args), delay)
    }
  }

  const handleSearch = useCallback(
    debounce((text: string) => {
      if (!text) {
        setFilteredCourses([])
        setShowDropdown(false)
        return
      }

      const results = courseLists.filter((item: any) =>
        item?.title?.toLowerCase().includes(text.toLowerCase())
      )
      setFilteredCourses(results)
      setShowDropdown(true)
    }, 300),
    [courseLists]
  )

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setQuery(value)
    handleSearch(value)
  }


  // ✅ Redirect when selecting an item
  const handleSelect = (course: any) => {
    setQuery(course?.title)
    setShowDropdown(false)
    // Delay for dropdown close animation
    setTimeout(() => {
      router.push(`/courses/${course?.slug}/`);

      setQuery('')

    }, 5000)
  }

  // ✅ Handle Enter key press
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault() 
      if (filteredCourses.length > 0) {
        handleSelect(filteredCourses[0])
      }
    }
  }

  return (
    <div className="relative w-full max-w-md mx-auto">
      <input
        type="text"
        className="w-full bg-gray-100 border border-blue-500 shadow-md rounded-full px-4 py-2 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-600"
        placeholder={placeholder}
        value={query}
        onChange={handleChange}
        onFocus={() => query && setShowDropdown(true)}
        onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
        onKeyDown={handleKeyDown} // ✅ capture Enter key
        autoComplete="off"
      />
      <MagnifyingGlassIcon className="h-5 w-5 text-gray-500 absolute right-3 top-2.5" />

      {showDropdown && filteredCourses.length > 0 && (
        <ul className="absolute z-10 w-full bg-white border border-gray-200 rounded-lg mt-1 max-h-60 overflow-y-auto shadow-md">
          {filteredCourses.map((course: any, index) => (
            <li
              key={index}
              className="px-4 py-2 hover:bg-blue-100 cursor-pointer text-gray-700 text-sm"
              onMouseDown={() => handleSelect(course)} // 🧩 use onMouseDown instead of onClick to prevent blur before redirect
            >
              {course?.title}
            </li>
          ))}
        </ul>
      )}

      {showDropdown && filteredCourses.length === 0 && query && (
        <div className="absolute z-10 w-full bg-white border border-gray-200 rounded-lg mt-1 p-2 text-gray-500 text-sm shadow-md">
          No results found
        </div>
      )}
    </div>
  )
}
