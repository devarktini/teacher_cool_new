import React, { useEffect, useState } from "react";
// import { messaging, getToken, onMessage } from "../../firebase";

import { motion } from "framer-motion";
import CourseCharts from "./CourseCharts";
import StudentApiService from "@/services/studentApi";
import MyProgress from "./MyProgress";
import pointsEarn from '@/public/images/points1.png'
import learningTime from '@/public/images/points3.png'
import completedCourses from '@/public/images/points2.png'
import graduationhat1 from '@/public/images/graduationhat1.png'

import Link from "next/link";
import Image from "next/image";

const StudentDashboard = () => {
  const [chartData] = useState({
    pieData: [
      { name: 'Completed', y: 60 },
      { name: 'In Progress', y: 30 },
      { name: 'Not Started', y: 10 },
    ],
    barData: [
      { name: 'Data Science, ML &', value: 120 },
      { name: 'Statistics For Data Science', value: 90 },
      { name: 'Machine Learning with Python', value: 70 },
    ],
    lineData: [
      { month: 'Feb', count: 10 },
      { month: 'Mar', count: 20 },
      { month: 'Apr', count: 45 },
      { month: 'May', count: 60 },
    ]
  });

  const dummyImage = 'https://miro.medium.com/v2/resize:fit:720/format:webp/1*U4gZLnRtHEeJuc6tdVLwPw.png';
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  const studentId = localStorage.getItem("id");
  const [courseData, setCourseData] = useState([]);
  const [studentMeetingData, setStudentMeetingDate] = useState([])
  const [studentDashboard, setStudentDashboard] = useState([])



  const studentProgress = async () => {
    try {
      const res = await StudentApiService.getCourseProgressByStudentId(studentId)
      setCourseData(res?.data)
    } catch (error) {
      console.error("Error fetching student progress:", error);
    }
  }
  // get course data
  useEffect(() => {
    studentProgress();
  }, []);



  // useEffect(() => {
  //   requestPermission();
  //   onMessage(messaging, (payload) => {
  //     console.log("Message received. ", payload);
  //     toast.info(
  //       `Title: ${payload.notification.title}\nBody: ${payload.notification.body}`,
  //       {
  //         position: toast.POSITION.TOP_RIGHT,
  //         autoClose: 2000,
  //       }
  //     );
  //   });
  // }, []);

  // const requestPermission = async () => {
  //   try {
  //     const status = await Notification.requestPermission();
  //     if (status === "granted") {
  //       const currentToken = await getToken(messaging, {
  //         vapidKey: process.env.VAP_ID,
  //       });
  //       setToken(currentToken);
  //       console.log("Token:", currentToken);

  //       // await fetch("http://localhost:3000/register", {
  //       await fetch(`${process.env.NEXT_PUBLIC_API_URL}register`, {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify({ token: currentToken }),
  //       });
  //     }
  //   } catch (error) {
  //     console.error("Permission denied", error);
  //   }
  // };

  // ------------------notification------------------------------
  const fetchStudentNotifications = async () => {
    try {
      // Perform the API request
      const response = await StudentApiService.getStudentNotifications(studentId);
      console.log("notifications", response)
      if (response.success) {
        setStudentMeetingDate(response.data);
      } else {
        console.log("Error", response.message)
      }
    } catch (error) {
      console.error('Error in fetching student notifications:', error);
    }
  };

  const studentDashboardData = async () => {
    try {
      const res = await StudentApiService.getStudentDashboard(studentId);
      console.log("student dashboard data", res);
      setStudentDashboard(res?.data);
    } catch (error) {
      console.error('error', error)
    }
  }

  useEffect(() => {

    fetchStudentNotifications();
    studentDashboardData();

  }, []);

  const [expandedCardIndex, setExpandedCardIndex] = useState(null);

  const toggleExpand = (index: any) => {
    setExpandedCardIndex(expandedCardIndex === index ? null : index);
  };

  const tableData = [
    {
      icon: pointsEarn,
      points: 0,
      topic: "Points earned",
    },
    {
      icon: learningTime,
      // points: studentDashboard?.total_duration ? `${studentDashboard?.total_duration} hrs` : 0,
      points: 0,
      topic: "Learning Time",
    },
    {
      icon: completedCourses,
      // points: studentDashboard?.total_completed_courses || 0,
      points: 0,
      topic: "Completed Courses",
    },
  ];
  const tableDataOne = [

    {
      icon: graduationhat1,
      // points: studentDashboard?.total_certificates || 0,
      points: 0,
      topic: "Certificates",
    },
  ];


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Stats Cards Section */}
        <div className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300 p-6 md:p-8">
          <div className="flex flex-wrap gap-4 md:gap-6">
            {tableData?.length > 0 &&
              tableData?.map((item: any, ind: number) => (
                <div
                  key={ind}
                  className={`flex items-center gap-4 md:gap-6 px-4 md:px-6 py-4 rounded-xl transition-all duration-300 hover:bg-blue-50 flex-1 min-w-[280px] md:min-w-[200px] ${ind < tableData.length - 1 ? 'md:border-r-2 border-gray-200' : ''
                    }`}
                >
                  <div className="flex-shrink-0">
                    <Image
                      src={item.icon}
                      alt={item.topic}
                      width={60}
                      height={60}
                      className="w-16 h-16 md:w-20 md:h-20 object-contain"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <span className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      {item?.points}
                    </span>
                    <span className="text-sm md:text-base font-medium text-gray-600">
                      {item?.topic}
                    </span>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Charts Section */}
        <div className="bg-white rounded-2xl shadow-md p-6 md:p-8">
          <div className="mb-6">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
              Course Analytics
            </h2>
            <p className="text-gray-600 text-sm md:text-base mt-1">
              Track your learning progress and performance
            </p>
          </div>
          <CourseCharts
            pieData={chartData.pieData}
            barData={chartData.barData}
            lineData={chartData.lineData}
          />
        </div>

        {/* Leaderboards Section */}
        <div className="bg-white rounded-2xl shadow-md p-6 md:p-8">
          <div className="mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
              Leaderboards
            </h2>
            <p className="text-gray-600 text-sm md:text-base mt-1">
              Your performance metrics
            </p>
          </div>

          {/* Leaderboard Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {tableDataOne?.length > 0 &&
              tableDataOne?.map((item: any, ind: number) => (
                <div
                  key={ind}
                  className="flex flex-col p-5 rounded-xl border-2 border-gray-200 hover:border-blue-400 bg-gradient-to-br from-white to-gray-50 transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
                >
                  <div className="mb-3">
                    <Image
                      src={item.icon}
                      alt={item.topic}
                      width={40}
                      height={40}
                      className="w-10 h-10 object-contain"
                    />
                  </div>
                  <span className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-1">
                    {item?.points}
                  </span>
                  <span className="text-sm md:text-base font-medium text-gray-600">
                    {item?.topic}
                  </span>
                </div>
              ))}
          </div>

          {/* Your Courses Table */}
          <div>
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 py-6 mb-6">
              <div>
                <h3 className="text-xl md:text-2xl font-bold text-gray-900">
                  Your Courses
                </h3>
                <p className="text-gray-600 text-sm mt-1">
                  Manage and track your enrolled courses
                </p>
              </div>
            </div>

            <div className="overflow-x-auto rounded-lg border border-gray-200">
              <table className="w-full min-w-full bg-white">
                <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                  <tr>
                    <th
                      scope="col"
                      className="px-4 md:px-6 py-4 text-center font-bold text-sm md:text-base text-gray-900 whitespace-nowrap"
                    >
                      Subject
                    </th>
                    <th
                      scope="col"
                      className="px-4 md:px-6 py-4 text-center font-bold text-sm md:text-base text-gray-900 whitespace-nowrap"
                    >
                      Title
                    </th>
                    <th
                      scope="col"
                      className="px-4 md:px-6 py-4 text-center font-bold text-sm md:text-base text-gray-900 whitespace-nowrap"
                    >
                      Reg No.
                    </th>
                    <th
                      scope="col"
                      className="px-4 md:px-6 py-4 text-center font-bold text-sm md:text-base text-gray-900 whitespace-nowrap"
                    >
                      Status
                    </th>
                    <th
                      scope="col"
                      className="px-4 md:px-6 py-4 text-center font-bold text-sm md:text-base text-gray-900 whitespace-nowrap"
                    >
                      Percentage
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {/* Uncomment and use your commented tbody code below:
                  {studentDashboard?.courses?.length > 0 ? (
                    studentDashboard?.courses?.map((item: any, ind: any) => (
                      <tr key={ind} className="hover:bg-blue-50 transition-colors duration-200">
                        <td className="px-4 md:px-6 py-4 whitespace-nowrap font-medium text-center text-sm md:text-base text-gray-900">
                          {item?.title}
                        </td>
                        <td className="px-4 md:px-6 py-4 whitespace-nowrap font-medium text-center text-sm md:text-base text-gray-900">
                          {item?.title}
                        </td>
                        <td className="px-4 md:px-6 py-4 whitespace-nowrap font-medium text-center text-sm md:text-base text-gray-900">
                          {item?.enrollment_id}
                        </td>
                        <td className="px-4 md:px-6 py-4 whitespace-nowrap text-center">
                          <span
                            className={`${
                              item?.status === 'completed'
                                ? 'text-emerald-700 bg-emerald-100'
                                : 'text-orange-700 bg-orange-100'
                            } inline-block px-3 py-1 rounded-full font-medium text-xs md:text-sm`}
                          >
                            {item?.status}
                          </span>
                        </td>
                        <td className="px-4 md:px-6 py-4 whitespace-nowrap text-center font-bold text-emerald-600 text-sm md:text-base">
                          {item?.progress}%
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-4 md:px-6 py-8 text-center">
                        <p className="text-gray-500 text-base">
                          Your next big achievement starts here! Explore courses and start learning today
                        </p>
                      </td>
                    </tr>
                  )} */}
                  <tr>
                    <td colSpan={5} className="px-4 md:px-6 py-8 text-center">
                      <p className="text-gray-500 text-base">
                        Your next big achievement starts here! Explore courses and start learning today
                      </p>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Progress and Enrolled Batches Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Section - Course Progress */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-md lg:p-6 md:p-8">
            <div className="mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                Progress on Courses
              </h2>
              <p className="text-gray-600 text-sm md:text-base mt-1">
                Monitor your learning journey
              </p>
            </div>

            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6 pb-6 border-b border-gray-200">
              <div>
                <h3 className="text-lg md:text-xl font-bold text-blue-600">
                  Recent Courses
                </h3>
                <p className="text-gray-600 text-sm mt-1">
                  Your active learning courses
                </p>
              </div>
              <Link
                href="/dashboard/student/my-learning"
                className="inline-block bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-4 md:px-6 py-2 rounded-lg font-semibold text-sm md:text-base transition-all duration-300 shadow-md hover:shadow-lg"
              >
                View All Courses
              </Link>
            </div>

            <div className="lg:pt-4">
              <MyProgress />
            </div>
          </div>

          {/* Right Section - Enrolled Batches */}
          <div className="lg:col-span-1 bg-white rounded-2xl shadow-md p-6 md:p-8">
            <div className="mb-6">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                Enrolled Batches
              </h2>
              <p className="text-gray-600 text-sm mt-1">
                Your active batches
              </p>
            </div>

            <div className="space-y-4 max-h-[600px] overflow-y-auto">
              {Array.isArray(studentMeetingData) &&
                studentMeetingData.length > 0 ? (
                studentMeetingData.map((batch: any, batchIndex: number) => (
                  <div
                    key={batch.id || batchIndex}
                    className="border-2 border-gray-200 rounded-xl p-4 bg-gradient-to-br from-white to-gray-50 hover:border-blue-400 hover:shadow-md transition-all duration-300"
                  >
                    {/* Batch Info */}
                    <div className="mb-4">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h3 className="text-base md:text-lg font-bold text-gray-900 flex-1">
                          {batch.name}
                        </h3>
                        <span
                          className={`text-xs px-2 py-1 rounded-full font-semibold whitespace-nowrap flex-shrink-0 ${batch.status === 'in_progress'
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-emerald-100 text-emerald-700'
                            }`}
                        >
                          {batch.status.replace('_', ' ')}
                        </span>
                      </div>
                      <p className="text-xs md:text-sm text-gray-600 line-clamp-2">
                        {batch.description}
                      </p>
                      <p className="text-xs text-gray-500 mt-2">
                        {new Date(batch.start_date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                        })}{' '}
                        –{' '}
                        {new Date(batch.end_date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </p>
                    </div>

                    {/* Courses inside batch */}
                    {batch.courses && batch.courses.length > 0 ? (
                      <div className="space-y-2">
                        {batch.courses.slice(0, 2).map(
                          (course: any, courseIndex: number) => (
                            <div
                              key={course.id || courseIndex}
                              className="bg-white border border-gray-200 rounded-lg p-3 hover:shadow-sm transition-all duration-300"
                            >
                              <h4 className="text-sm font-semibold text-gray-900 line-clamp-1">
                                {course.title}
                              </h4>
                              <p className="text-xs text-gray-600 line-clamp-1 mt-1">
                                {course.description}
                              </p>
                              <div className="flex flex-wrap gap-2 mt-2">
                                <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                                  {course.duration}
                                </span>
                                <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                                  {course.mode}
                                </span>
                              </div>

                              {/* Modules */}
                              {course.modules && course.modules.length > 0 && (
                                <details className="mt-2">
                                  <summary className="text-xs text-blue-600 cursor-pointer font-semibold hover:text-blue-700">
                                    {course.modules.length} Modules
                                  </summary>
                                  <ul className="mt-2 text-xs text-gray-700 space-y-1 pl-4">
                                    {course.modules.slice(0, 2).map(
                                      (mod: any, modIdx: number) => (
                                        <li key={modIdx} className="list-disc">
                                          {mod.module}{' '}
                                          {mod.lecture && mod.lecture.length > 0 && (
                                            <span className="text-gray-500 text-xs">
                                              ({mod.lecture.length}L)
                                            </span>
                                          )}
                                        </li>
                                      )
                                    )}
                                    {course.modules.length > 2 && (
                                      <li className="text-gray-500 text-xs">
                                        + {course.modules.length - 2} more
                                      </li>
                                    )}
                                  </ul>
                                </details>
                              )}
                            </div>
                          )
                        )}
                        {batch.courses.length > 2 && (
                          <p className="text-xs text-gray-500 italic px-2">
                            + {batch.courses.length - 2} more courses
                          </p>
                        )}
                      </div>
                    ) : (
                      <p className="text-xs text-gray-500 italic">
                        No courses in this batch
                      </p>
                    )}
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <p className="text-gray-500 text-sm">
                    No enrolled batches yet
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    Start exploring batches to get enrolled
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>


    // <div>
    //   <div className="bg-white rounded my-4 px-4 py-10 shadow-md">
    //     <div className="flex flex-wrap gap-4 sm:gap-2 pt-4">
    //       {tableData?.length > 0 &&
    //         tableData?.map((item: any, ind: any) => {
    //           return (
    //             <div
    //               key={ind}
    //               className={`flex items-center gap-4 sm:gap-8 px-4 sm:px-8 ${ind < tableData.length - 1 ? "sm:border-r-2 " : ""
    //                 } w-full sm:w-auto`}
    //             >
    //               <div>
    //                 <Image
    //                   src={item.icon}
    //                   alt="alt"
    //                   className="w-20 h-20 sm:w-auto sm:h-auto"
    //                 />
    //               </div>

    //               <div className="flex flex-col">
    //                 <span className="text-blue-500 font-semibold font-Roboto text-xl sm:text-2xl">
    //                   {item?.points}
    //                 </span>
    //                 <span className="text-sm sm:text-base font-Roboto text-[#1E1E1E] text-opacity-90">
    //                   {item?.topic}
    //                 </span>
    //               </div>
    //             </div>
    //           );
    //         })}
    //     </div>
    //   </div>

    //   {/* charts  */}

    //   <div className="p-6 bg-white">
    //     <h1 className="text-2xl font-bold mb-4">Course Analytics</h1>
    //     <CourseCharts
    //       pieData={chartData.pieData}
    //       barData={chartData.barData}
    //       lineData={chartData.lineData}
    //     />
    //   </div>

    //   <div className="bg-white px-4 py-4 rounded shadow-md ">
    //     <div>
    //       <p className="text-[32px] text-[#1E1E1E] font-medium font-Roboto pb-2 pl-1">
    //         Leaderboards
    //       </p>
    //     </div>
    //     <div className="flex gap-8 pb-4  ">
    //       {tableDataOne?.length > 0 &&
    //         tableDataOne?.map((item, ind) => {
    //           return (
    //             <div
    //               key={ind}
    //               className="flex px-4 py-3 rounded items-center gap-4 border-2"
    //             >
    //               <div>
    //                 <Image
    //                   src={
    //                     item.icon
    //                   }
    //                   alt="no img"
    //                 />
    //               </div>
    //               <div className="flex flex-col pt-2 ">
    //                 <span className="text-blue-500 font-semibold font-Roboto text-2xl">
    //                   {item?.points}
    //                 </span>
    //                 <span className="text-base  font-Roboto text-[#1E1E1E] text-opacity-60">
    //                   {item?.topic}
    //                 </span>
    //               </div>
    //             </div>
    //           );
    //         })}
    //     </div>
    //     <div className="">
    //       <div className="flex items-center justify-between py-4">
    //         <span className="text-xl font-medium font-Roboto text-[#1E1E1E] text-opacity-90">
    //           Your Courses
    //         </span>

    //       </div>
    //       <div className="bg-white">
    //         <div className="flex flex-col">
    //           <div className="overflow-x-auto ">
    //             <div className="inline-block min-w-full py-2 ">
    //               <div className="overflow-x-auto">
    //                 <table className="min-w-full text-left     bg-[#F1F4F9] rounded-lg">
    //                   <thead className="">
    //                     <tr>
    //                       <th
    //                         scope="col"
    //                         className=" px-4 whitespace-nowrap font-Nunito font-bold text-sm  text-[#202224] py-3 w-[200px] text-center tracking-wider rounded-lg"
    //                       >
    //                         Subject
    //                       </th>
    //                       <th
    //                         scope="col"
    //                         className=" px-4 font-Nunito font-bold text-sm  text-[#202224] whitespace-nowrap py-3 w-[200px] text-center tracking-wider"
    //                       >
    //                         Title
    //                       </th>
    //                       <th
    //                         scope="col"
    //                         className=" px-4 font-Nunito font-bold text-sm  text-[#202224] whitespace-nowrap py-3 w-[200px] text-center tracking-wider"
    //                       >
    //                         Reg No.
    //                       </th>
    //                       <th
    //                         scope="col"
    //                         className=" px-4 font-Nunito font-bold text-sm  text-[#202224] whitespace-nowrap py-3 w-[200px] text-center tracking-wider"
    //                       >
    //                         Status
    //                       </th>

    //                       <th
    //                         scope="col"
    //                         className=" px-4 font-Nunito font-bold text-sm  text-[#202224] whitespace-nowrap py-3 w-[200px] text-center tracking-wider"
    //                       >
    //                         Percentage
    //                       </th>

    //                     </tr>
    //                   </thead>
    //                   {/* <tbody className=" bg-white divide-y divide-gray-200 text-center ">
    //                     {studentDashboard?.courses?.length > 0 ? (
    //                       studentDashboard?.courses?.map((item: any, ind: any) => (
    //                         <tr key={ind} className="hover:bg-[#f6f9fe]">
    //                           <td className="px-4 py-4 whitespace-nowrap font-Roboto text-center text-[#1E1E1E] text-sm">
    //                             {item?.title}
    //                           </td>
    //                           <td className="px-4 py-4 whitespace-nowrap font-Roboto font-medium text-center text-[#1E1E1E] text-sm">
    //                             {item?.title}
    //                           </td>
    //                           <td className="px-4 py-4 whitespace-nowrap font-Roboto font-medium text-center  text-[#1E1E1E] text-sm">
    //                             {item?.enrollment_id}
    //                           </td>
    //                           <td
    //                             className={`px-4 py-4 whitespace-nowrap  text-center  `}
    //                           >
    //                             <span
    //                               className={`${item?.status === "completed"
    //                                 ? "text-[#07B89E] bg-[#DCF6F3] "
    //                                 : "text-[rgb(253,137,57)] bg-[#FFEBDD]"
    //                                 } block py-2 rounded w-28 font-Roboto font-medium text-xs`}
    //                             >
    //                               {item?.status}
    //                             </span>
    //                           </td>
    //                           <td className="px-4 py-4  whitespace-nowrap text-center text-[#08A362] font-Roboto text-base font-medium">
    //                             {item?.progress}%
    //                           </td>

    //                         </tr>
    //                       ))
    //                     ) : (
    //                       <tr>
    //                         <td colSpan={6} className="px-4 py-4 text-center text-xl text-gray-500">
    //                           Your next big achievement starts here! Explore courses and start learning today
    //                         </td>
    //                       </tr>
    //                     )}
    //                   </tbody> */}

    //                 </table>
    //               </div>
    //             </div>
    //           </div>
    //         </div>
    //       </div>

    //     </div>
    //   </div>
    //   <div className="grid grid-cols-1 gap-4 my-4">
    //     {/* Left Section for Course Progress */}
    //     <div className="col-span-12 md:col-span-8 rounded shadow-md bg-white py-3 px-4">
    //       <p className="text-[#1E1E1E] font-Roboto text-[32px] font-medium">
    //         Progress on courses
    //       </p>
    //       <div className="flex justify-between items-center mt-3">
    //         <div className="flex flex-col">
    //           <span className="text-2xl font-medium font-Roboto text-[#0966ED]">
    //             Courses
    //           </span>
    //           <span className="text-gray-900 text-opacity-50 text-base font-Roboto font-medium pt-1">
    //             Your recent courses
    //           </span>
    //         </div>
    //         <div className="bg-[#0966ED] text-white px-3 py-2 rounded-md">
    //           <Link href="/dashboard/student/my-learning"
    //             className="font-Roboto font-semibold text-base">
    //             My Courses
    //           </Link>
    //         </div>
    //       </div>
    //       <div className="pt-3">
    //         <MyProgress />
    //       </div>
    //     </div>

    //     {/* Right Section for Course Schedule */}
    //     <div className="col-span-12 md:col-span-4 rounded bg-white shadow-md py-3 px-4">
    //       <p className="text-[#1E1E1E] text-[26px] font-medium font-Roboto">
    //         Enrolled Batches
    //       </p>

    //       <div>
    //         {Array.isArray(studentMeetingData) && studentMeetingData.length > 0 ? (
    //           studentMeetingData.map((batch: any, batchIndex: number) => (
    //             <div
    //               key={batch.id || batchIndex}
    //               className="border border-gray-200 rounded-lg p-3 my-4 bg-gray-50"
    //             >
    //               {/* === Batch Info === */}
    //               <div className="flex justify-between items-center mb-3">
    //                 <div>
    //                   <h2 className="text-lg font-semibold text-[#1E1E1E]">
    //                     {batch.name}
    //                   </h2>
    //                   <p className="text-sm text-gray-600">
    //                     {batch.description}
    //                   </p>
    //                   <p className="text-xs text-gray-500 mt-1">
    //                     {new Date(batch.start_date).toLocaleDateString()} –{" "}
    //                     {new Date(batch.end_date).toLocaleDateString()}
    //                   </p>
    //                 </div>
    //                 <span
    //                   className={`text-xs px-3 py-1 rounded-full font-medium ${batch.status === "in_progress"
    //                     ? "bg-blue-100 text-blue-700"
    //                     : "bg-gray-200 text-gray-700"
    //                     }`}
    //                 >
    //                   {batch.status.replace("_", " ")}
    //                 </span>
    //               </div>

    //               {/* === Courses inside batch === */}
    //               {batch.courses?.length > 0 ? (
    //                 batch.courses.map((course: any, courseIndex: number) => (
    //                   <div
    //                     key={course.id || courseIndex}
    //                     className="border border-gray-300 rounded-lg mb-3 p-3 bg-white shadow-sm"
    //                   >
    //                     <div className="flex items-start">
    //                       {/* <img
    //                         src={course.banner}
    //                         alt={course.title}
    //                         className="w-14 h-14 rounded-lg object-cover"
    //                       /> */}
    //                       <div className="ml-3 flex-1">
    //                         <h3 className="text-base font-semibold text-gray-900">
    //                           {course.title}
    //                         </h3>
    //                         <p className="text-sm text-gray-600">
    //                           {course.description.length > 80
    //                             ? course.description.slice(0, 80) + "..."
    //                             : course.description}
    //                         </p>
    //                         <div className="flex flex-wrap gap-3 mt-2 text-xs text-gray-700">
    //                           <span className="bg-gray-100 px-2 py-1 rounded">
    //                             Duration: {course.duration}
    //                           </span>
    //                           <span className="bg-gray-100 px-2 py-1 rounded">
    //                             Mode: {course.mode}
    //                           </span>
    //                           <span className="bg-gray-100 px-2 py-1 rounded capitalize">
    //                             Level: {course.level.replaceAll("_", " ")}
    //                           </span>
    //                         </div>
    //                       </div>
    //                     </div>

    //                     {/* === Optional Modules === */}
    //                     {course.modules?.length > 0 && (
    //                       <details className="mt-3">
    //                         <summary className="cursor-pointer text-sm text-blue-600">
    //                           View Modules
    //                         </summary>
    //                         <ul className="mt-2 list-disc list-inside text-sm text-gray-700">
    //                           {course.modules.slice(0, 3).map(
    //                             (mod: any, modIdx: number) => (
    //                               <li key={modIdx}>
    //                                 {mod.module}{" "}
    //                                 {mod.lecture?.length > 0 && (
    //                                   <span className="text-gray-500 text-xs">
    //                                     ({mod.lecture.length} lectures)
    //                                   </span>
    //                                 )}
    //                               </li>
    //                             )
    //                           )}
    //                           {course.modules.length > 3 && (
    //                             <li className="text-gray-500 text-xs">
    //                               + more modules...
    //                             </li>
    //                           )}
    //                         </ul>
    //                       </details>
    //                     )}
    //                   </div>
    //                 ))
    //               ) : (
    //                 <p className="text-sm text-gray-500 italic">No courses found</p>
    //               )}
    //             </div>
    //           ))
    //         ) : (
    //           <p className="text-gray-500 text-sm italic mt-4">
    //             No enrolled batches found.
    //           </p>
    //         )}
    //       </div>
    //     </div>



    //   </div>


    // </div>
  );
};




export default StudentDashboard
