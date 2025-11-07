'use client'
import React from 'react'

function Skillgain({ courseSkills }: any) {
    return (
        <>
            {courseSkills?.skills?.length > 0 && (
                <div className="pt-10 mt-5 pb-6 mx-auto w-full max-w-4xl px-4 sm:px-6 lg:px-8">
                    <h2 className="font-Roboto font-semibold text-xl sm:text-2xl text-center text-gray-900 mb-6">
                        Skills You'll Gain
                    </h2>

                    <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
                        {courseSkills?.skills?.map((item: string, index: number) => (
                            <span
                                key={index}
                                className="inline-flex items-center bg-gradient-to-r from-[#F4F6FC] to-[#EFF3FC] text-sm sm:text-base font-semibold border-2 border-[#32b8d5] tracking-wide text-[#0966ED] hover:border-[#1771f7] hover:shadow-md hover:scale-105 font-Roboto rounded-full px-4 py-2 transition-all duration-200 cursor-default whitespace-nowrap"
                            >
                                {item?.trim()}
                            </span>
                        ))}
                    </div>
                </div>
            )}


        </>
    )
}

export default Skillgain
