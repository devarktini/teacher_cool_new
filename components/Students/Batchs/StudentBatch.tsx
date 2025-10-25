"use client";

import Progress from '@/components/Progress';
import BatchCard from '@/components/Students/Batchs/BatchCard';
import StudentApiService from '@/services/studentApi';
import { Pagination } from 'antd';
import React, { useEffect, useState } from 'react';
import { IoSearchOutline } from "react-icons/io5";

export default function StudentBatch() {
  const [batchData, setBatchData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [studentId, setStudentId] = useState<string | null>(null);

  useEffect(() => {
    const id = localStorage.getItem('id');
    setStudentId(id);
  }, []);

  const fetchBatches = async (id: string | null) => {
    if (!id) return;
    try {
      setIsLoading(true);
      const res = await StudentApiService.fetchStudentDataByBatch(id);
      if (res) setBatchData(res?.data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (studentId) fetchBatches(studentId);
  }, [studentId]);

  if (isLoading) return <Progress />;

  return (
    <div className="bg-white rounded-md shadow-md py-4 px-4 my-4">
      <div className="flex flex-col md:flex-row justify-between items-center py-4 px-4">
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

        <div className="mt-3 md:mt-0 flex items-center justify-center gap-5">
          <p className="font-semibold font-Roboto text-[#1E1E1E]">
            Batches Overview
          </p>
        </div>
      </div>

      {batchData.length > 0 ? (
        <BatchCard batchData={batchData} />
      ) : (
        <p className="text-center text-gray-500">No batch is available</p>
      )}

      <div className="pt-4">
        <Pagination
          showSizeChanger
          showQuickJumper
          defaultCurrent={1}
          total={50}
        />
      </div>
    </div>
  );
}
