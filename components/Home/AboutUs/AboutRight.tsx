'use client'
import React, { memo, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { showLoginPopup } from '@/store/features/loginSlice'
import { selectAuth } from '@/store/features/authSlice'

const AboutRight: React.FC = () => {
    // If you have a typed AppDispatch, replace `any` with it (e.g. useDispatch<AppDispatch>())
    const dispatch = useDispatch<any>()
    const { isAuthenticated } = useSelector(selectAuth)

    const handleStartLearning = useCallback(() => {
        if (!isAuthenticated) {
            dispatch(showLoginPopup())
        } else {
            // navigate to courses / dashboard if authenticated (implement as needed)
            // router.push('/courses')
        }
    }, [dispatch, isAuthenticated])

    return (
        <section className="relative w-full p-6 md:p-8 bg-white/80 dark:bg-slate-900/60 rounded-lg shadow-sm">
            <header className="mb-4">
                <p className="text-blue-700 text-sm font-medium">About us</p>
                <h2 className="text-4xl md:text-5xl font-bold leading-tight mt-2">Who We Are</h2>
            </header>

            <div className="space-y-4 text-[#444] leading-relaxed">
                <p className="text-base md:text-lg text-justify">
                    TeacherCool empowers minds with innovative, practical IT and non-IT
                    trainings for individuals, corporates, and universities. We combine
                    industry-led curriculum, hands-on projects, and expert mentorship to
                    help learners excel in real-world environments.
                </p>

                <ul className="list-disc list-inside text-sm md:text-base text-[#555] space-y-2">
                    <li>Industry-aligned courses with practical projects</li>
                    <li>Flexible learning paths for beginners to advanced learners</li>
                    <li>Corporate & academic partnerships and tailored programs</li>
                </ul>

                <div className="mt-4">
                    <button
                        type="button"
                        onClick={handleStartLearning}
                        aria-label="Start learning now"
                        className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 active:translate-y-0.5 text-white font-semibold py-3 px-5 rounded transition-transform shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-300"
                    >
                        {/* Simple inline SVG icon */}
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                        Start Learning Now
                    </button>
                </div>
            </div>
        </section>
    )
}

export default memo(AboutRight)
