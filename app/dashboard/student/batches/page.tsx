'use client'
import Progress from '@/components/Progress';
import BatchCard from '@/components/Students/BatchCard';
import StudentApiService from '@/services/studentApi';
import { Pagination } from 'antd';
import React, { useEffect, useState } from 'react'
import { IoSearchOutline } from "react-icons/io5";


export default function page() {
  const [batchData, setBatchData] = useState([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const studentId = localStorage.getItem('id')

  const fetchBatches = async () => {
    try {
      setIsLoading(true)
      const res = await StudentApiService.fetchStudentDataByBatch(studentId);
      if (res) setBatchData(res?.data)
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchBatches()
  }, [])

  if (isLoading) return <Progress />
  return (
    <>

      <div className="bg-white rounded-md shadow-md py-4 px-4 my-4 ">
        <div className="flex flex-col md:flex-row justify-between items-center py-4 px-4">
          {/* Sort and Search Section */}
          <div className="flex flex-col md:flex-row gap-3 items-center w-full md:w-auto">


            <div className="relative w-full md:w-64">
              <input
                type="text"
                placeholder="Search..."
                className="bg-white w-full h-10 rounded pl-9 pr-1 border outline-none"
              />
              <div className="absolute top-3 left-4">
                <IoSearchOutline />
              </div>
            </div>
          </div>

          {/* Title Section */}
          <div className="mt-3 md:mt-0 flex items-center justify-center gap-5">


            <p className="font-semibold font-Roboto  text-[#1E1E1E]">
              Batches Overview
            </p>
          </div>
        </div>


        {/* <BatchCard batchData={batchData} /> */}
        {batchData.length > 0 ? (
          <BatchCard batchData={batchData} />
        ) : (
          <p className="text-center text-gray-500">No batch is available</p>
        )}
        <div className="pt-4 ">
          <Pagination
            showSizeChanger
            showQuickJumper
            // onShowSizeChange={onShowSizeChange}
            defaultCurrent={1}
            total={50}
          />
        </div>
      </div>
    </>
  )
}
