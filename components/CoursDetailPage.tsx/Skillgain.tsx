'use client'
import React from 'react'

function Skillgain({courseSkills}:any) {
    return (
        <>
            {courseSkills?.skills?.length > 0 && (
                <div className="pt-10 mt-5 pb-6 mx-auto w-full max-w-4xl">
                    <p className="font-Roboto font-medium text-lg text-center">
                        Skills You'll Gain
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4">
                        {courseSkills?.skills?.map((item:string, index:number) => (
                            <p
                                key={index}
                                className="bg-[#F4F6FC] text-md font-semibold border-2 border-[#32b8d5] tracking-wide text-[#0966ED]  hover:border-[#1771f7]  font-Roboto rounded-full px-3 py-2 text-center"
                            >
                                {item?.trim()} {/* Trim any extra whitespace, and handle nulls */}
                            </p>
                        ))}
                    </div>
                </div>
            )}

        </>
    )
}

export default Skillgain
