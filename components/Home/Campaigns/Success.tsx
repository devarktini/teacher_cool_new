'use client'
import { useRouter } from 'next/navigation';
import React from 'react'

function Success({onclose}:any) {
    const router = useRouter();
    return (
        <>
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-md">
                <div className="relative bg-gradient-to-br from-blue-500 to-blue-700 text-white px-10 py-8 rounded-3xl shadow-[0_10px_40px_-15px_rgba(0,0,0,0.5)] animate-slideUp max-w-md w-full mx-4 border-2 border-white/20">
                    {/* Close Button */}
                    <button
                        onClick={onclose}
                        className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-200"
                        aria-label="Close"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </button>

                    <div className="flex flex-col items-center space-y-6">
                        {/* Animated Checkmark */}
                        <div className="animate-scaleIn ">
                            <div className="w-20 h-20 bg-green-100/20 rounded-full flex items-center justify-center">
                                <svg
                                    className="w-14 h-14 text-green-100"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M5 13l4 4L19 7"
                                    />
                                </svg>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="space-y-4 text-center">
                            <h3 className="text-2xl font-bold tracking-tight">
                                🎉 Success!
                            </h3>
                            <p className="text-lg font-medium text-green-100 ">
                                Your request has been successfully submitted!
                            </p>
                            <p className="text-sm text-green-200/90">
                                We'll get back to you within 24 hours
                            </p>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-4 w-full mt-4">
                            <button
                                onClick={() => router.push("/")}
                                className="flex-1 flex items-center justify-center gap-2 bg-white/90 text-blue-600 px-6 py-3 rounded-xl font-semibold hover:bg-white hover:scale-[1.02] transition-all duration-200 shadow-md hover:shadow-lg"
                            >
                                <svg
                                    className="w-5 h-5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                                    />
                                </svg>
                                Home
                            </button>
                            <button
                                onClick={() => router.push("/for-individual")}
                                className="flex-1 flex items-center justify-center gap-2 bg-white/90 text-blue-600 px-6 py-3 rounded-xl font-semibold hover:bg-white hover:scale-[1.02] transition-all duration-200 shadow-md hover:shadow-lg"
                            >
                                <svg
                                    className="w-5 h-5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                                    />
                                </svg>
                                Courses
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Success
