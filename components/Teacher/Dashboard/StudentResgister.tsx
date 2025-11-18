'use client'
import React from 'react'
import { FaCodeCompare } from 'react-icons/fa6'
import DataChart from './DataChart'

function StudentResgister() {
  return (
      <div className="container mx-auto mt-10 px-4 sm:px-6">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-4">
                    {/* Main Content Section */}
                    <div className="md:col-span-8 lg:col-span-7 h-fit bg-white p-3 sm:p-1 shadow-md rounded-[10px] shadow-gray-400">
                        <div className="flex justify-between items-start">
                            <div>
                                <h1 className="text-lg sm:text-xl font-medium text-textColor">Student Register</h1>
                            </div>
                            <div className="bg-icon p-2 h-[30px] shadow-lg">
                                <FaCodeCompare className="text-xl text-textColor" />
                            </div>
                        </div>
                        <div className="chart mt-4">
                            <DataChart />
                        </div>
                    </div>

                    {/* Upcoming Classes Section */}
                    {/* <div className="md:col-span-4 lg:col-span-5 bg-white p-3 sm:p-4 shadow-md rounded-[10px] shadow-gray-400">
                        <h1 className="text-lg sm:text-xl font-medium mb-2">Upcoming Classes</h1>
                        <UpcomingTraining
                            data={LinksData}
                            titleKey="title"
                            subTitleKey="subTitle"
                            dateKey="date"
                            monthKey="month"
                            yearKey="year"
                            linkKey="link"
                            timeKey="time"
                            titleFontSize="text-base sm:text-lg"
                            subTitleFontSize="text-sm sm:text-base"
                            dateFontSize="text-xs sm:text-sm"
                            linkFontSize="text-sm sm:text-base"
                            timeFontSize="text-xs sm:text-sm"
                        />
                    </div> */}
                </div>
            </div>
  )
}

export default StudentResgister
