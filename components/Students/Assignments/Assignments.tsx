'use client'
import Quiz from '@/components/Students/Assignments/Quiz';
import ResultViewer from '@/components/Students/Assignments/ResultViewer';
import StudentApiService from '@/services/studentApi';
import { Modal } from 'antd';
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast';
import { IoSearchOutline } from 'react-icons/io5';
import sendWhite from '@/public/images/student/sendWhite.png'
import Image from 'next/image';

function Countdown({ fromDate, toDate, now, onActiveClick, onInactiveClick }: any) {
  const from = useMemo(() => (fromDate ? new Date(fromDate).getTime() : null), [fromDate]);
  const to = useMemo(() => (toDate ? new Date(toDate).getTime() : null), [toDate]);

  if (!from || !to) {
    return <div className="text-sm text-gray-500">No window</div>;
  }

  const isBefore = now < from;
  const isDuring = now >= from && now <= to;
  const isAfter = now > to;

  function formatDuration(ms: any) {
    if (ms <= 0) return "00:00:00";
    const totalSeconds = Math.floor(ms / 1000);
    const hrs = Math.floor(totalSeconds / 3600).toString().padStart(2, "0");
    const mins = Math.floor((totalSeconds % 3600) / 60).toString().padStart(2, "0");
    const secs = (totalSeconds % 60).toString().padStart(2, "0");
    return `${hrs}:${mins}:${secs}`;
  }

  const startsIn = formatDuration(from - now);
  const timeLeft = formatDuration(to - now);

  const handleClick = () => {
    if (isDuring) {
      onActiveClick && onActiveClick();
    } else {
      onInactiveClick && onInactiveClick(isBefore ? "not_started" : "expired");
    }
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        onClick={handleClick}
        disabled={!isDuring}
        className={`flex items-center justify-center gap-2 rounded-md font-Roboto font-normal text-sm px-4 py-2 m-auto
          ${isDuring ? "bg-[#0966ED] text-white" : "bg-gray-200 text-gray-600 cursor-not-allowed"}`}
      >
        MCQ
        <Image
          className="w-[18px] h-[14px] mt-1"
          src={sendWhite}
          alt="img"
        />
      </button>

      <div className="text-xs text-center">
        {isBefore && <div>Starts in: <span className="font-medium">{startsIn}</span></div>}
        {isDuring && <div>Time left: <span className="font-medium">{timeLeft}</span></div>}
        {isAfter && <div className="text-red-600 font-medium">Expired</div>}
      </div>
    </div>
  );
}


export default function Assignments() {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [mcqIsOpen, setMcqIsOpen] = useState(false);
  const [isResultOpen, setIsResultOpen] = useState(false);
  // State declarations
  const currentDate = new Date().toLocaleDateString();
  const [currentTime, setCurrentTime] = useState(getFormattedTime());
  const [nowTs, setNowTs] = useState(Date.now()); // shared timestamp used by all countdowns
  const [assignment, setAssignment] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [query, setQuery] = useState("");
  const [assignmentId, setAssignmentId] = useState(null);
  const [quizResults, setQuizResults] = useState<any[]>([]);
  const [greeting, setGreeting] = useState("");
  const [assignmentData, setAssignmentData] = useState<any>({});
  const student_id = localStorage.getItem("id");

  // Function to get formatted current time
  function getFormattedTime() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");
    return `${hours}:${minutes}:${seconds}`;
  }

  // Memoized function to check if assignment has result
  const hasAssignmentResult = useCallback(
    (assignmentId: any) => {
      return quizResults.some((result: any) => result.assignment === assignmentId);
    },
    [quizResults]
  );

  // Fetch student results
  const fetchStudentResults = useCallback(async () => {

    try {
      const res = await StudentApiService.getStudentAssignmet(student_id);
      setQuizResults(res?.results || []);
    } catch (error) {
      console.error("Error fetching student results:", error);
      setQuizResults([]);
    }
  }, []);

  // Fetch assignments
  const fetchAssignment = useCallback(async () => {
    try {
      setLoading(true);
      if (!student_id) {
        toast.error("studentId is invalid");
      }

      const res = await StudentApiService.getAssignmetByStudent(student_id);
      setAssignment(res.data || []);
      setSearchResults(res.data || []);
    } catch (error: any) {
      console.error("Error in fetching assignment:", error.message);
      setAssignment([]);
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Modal handlers
  const openModal = () => setModalIsOpen(true);
  const closeModal = () => setModalIsOpen(false);


  const handleOpenQuiz = (assignmentId: any, item: any) => {
    setAssignmentId(assignmentId);
    setAssignmentData(item)
    setMcqIsOpen(true);
  };

  const handleCloseQuiz = () => {
    setMcqIsOpen(false);
    setAssignmentId(null);
  };

  const handleViewResult = (assignmentId: any) => {
    setAssignmentId(assignmentId);
    setIsResultOpen(true);
  };

  const handleCloseResult = () => {
    setIsResultOpen(false);
    setAssignmentId(null);
  };

  // Search handler
  const handleChange = (e: any) => {
    const { value } = e.target;
    setQuery(value);

    if (value) {
      const filteredResults = assignment.filter((item: any) =>
        item?.course_name?.toLowerCase().includes(value.toLowerCase())
      );
      setSearchResults(filteredResults);
    } else {
      setSearchResults(assignment);
    }
  };

  // shared timer - updates time display and nowTs for countdowns
  useEffect(() => {
    const timerId = setInterval(() => {
      setCurrentTime(getFormattedTime());
      setNowTs(Date.now());
    }, 1000);

    return () => clearInterval(timerId);
  }, []);

  useEffect(() => {
    const determineGreeting = () => {
      const currentHour = new Date().getHours();
      if (currentHour < 12) {
        return "Good Morning";
      } else if (currentHour < 18) {
        return "Good Afternoon";
      } else {
        return "Good Evening";
      }
    };
    setGreeting(determineGreeting());
  }, []);

  useEffect(() => {
    fetchStudentResults();
  }, [fetchStudentResults]);

  useEffect(() => {
    fetchAssignment();
  }, [fetchAssignment]);



  // Handlers passed to Countdown
  const handleActiveMCQClick = (itemId: any, item: any) => {
    // open quiz normally
    handleOpenQuiz(itemId, item);
  };

  const handleInactiveMCQClick = (item: any, reason: any) => {
    if (reason === "not_started") {
      const startStr = new Date(item.from_date).toLocaleString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
      toast.custom(`Quiz hasn't started yet. It will start on ${startStr}.`);
    } else {
      toast.error("The MCQ window has expired.");
    }
  };

  return (
    <div>
      <div className="bg-white rounded-md shadow-md my-4">
        <div className="flex flex-col md:flex-row justify-between items-center py-4 px-4">
          <div className="flex flex-col md:flex-row gap-3 items-center w-full md:w-auto">
            <div className="relative w-full md:w-64">
              <input
                type="text"
                placeholder="Search..."
                onChange={handleChange}
                className="bg-white w-full h-10 rounded pl-9 pr-1 border outline-none"
              />
              <div className="absolute top-3 left-4">
                <IoSearchOutline />
              </div>
            </div>
          </div>

          <div className="mt-3 md:mt-0">
            <span className="font-semibold font-Roboto text-lg text-[#1E1E1E]">Test / Assignments</span>
          </div>
        </div>

        <div className="border-t border-gray-200">
          <div className="flex flex-col">
            <div className="overflow-x-auto">
              <div className="inline-block min-w-full py-2">
                <div className="overflow-x-auto">
                  <table className="min-w-full text-left divide-y">
                    <thead className="">
                      <tr>
                        <th scope="col" className="px-4 whitespace-nowrap font-Roboto font-semibold text-sm text-[#1E1E1E] text-opacity-90 py-3 w-[200px] tracking-wider rounded-lg">
                          Course Name
                        </th>
                        <th scope="col" className="px-4 font-Roboto text-sm font-semibold text-[#1E1E1E] text-opacity-90 whitespace-nowrap py-3 w-[200px] text-center tracking-wider">
                          total Quizs
                        </th>
                        <th scope="col" className="px-4 font-semibold font-Roboto text-sm text-[#1E1E1E] text-opacity-90 whitespace-nowrap py-3 w-[200px] text-center tracking-wider">
                          Title
                        </th>
                        <th scope="col" className="px-4 font-semibold font-Roboto text-sm text-[#1E1E1E] text-opacity-90 whitespace-nowrap py-3 w-[200px] text-center tracking-wider">
                          Description
                        </th>
                        <th scope="col" className="px-4 font-semibold font-Roboto text-sm text-[#1E1E1E] text-opacity-90 whitespace-nowrap py-3 w-[200px] text-center tracking-wider">
                          Validity
                        </th>

                        <th scope="col" className="px-4 font-semibold font-Roboto text-sm text-[#1E1E1E] text-opacity-90 whitespace-nowrap py-3 w-[200px] text-center tracking-wider">
                          MCQ/Assignment
                        </th>
                      </tr>
                    </thead>
                    {loading && <p className="mt-4">Loading...</p>}
                    <tbody className="bg-white divide-y divide-gray-200">
                      {assignment?.length > 0 ? (
                        (query ? searchResults : assignment).map((item: any, ind: any) => {
                          const hasResult = hasAssignmentResult(item.id);

                          return (
                            <tr key={ind} className="hover:bg-[#f6f9fe]">
                              <td className="px-4 py-4 whitespace-nowrap font-Roboto text-[#1E1E1E] text-opacity-90 font-normal text-sm">
                                {item?.course_name}
                              </td>
                              <td className="px-4 font-normal py-4 whitespace-nowrap font-Roboto text-center text-[#1E1E1E] text-opacity-90 text-sm">
                                {item?.total_quizes}
                              </td>
                              <td className="px-4 py-4 font-normal whitespace-nowrap font-Roboto text-opacity-90 text-center text-[#1E1E1E] text-sm">
                                {item?.title}
                              </td>
                              <td className="px-4 py-4 font-normal whitespace-nowrap font-Roboto text-wrap text-opacity-90 text-start text-[#1E1E1E] text-sm">
                                {item?.description}
                              </td>
                              <td className="px-4 py-4 font-normal whitespace-nowrap font-Roboto text-wrap text-opacity-90 text-start text-[#1E1E1E] text-sm
                             flex flex-col gap-2 items-center justify-center ">

                                <span className="bg-green-600 text-white rounded-full px-1 py-1 text-xs">
                                  {new Date(item?.from_date).toLocaleString("en-US", {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}
                                </span>

                                <span className="bg-red-500 text-white rounded-full px-1 py-1 text-xs">
                                  {new Date(item?.to_date).toLocaleString("en-US", {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}
                                </span>
                              </td>

                              <td className="px-4 py-4 whitespace-nowrap text-center text-sm">
                                <div className="flex flex-col gap-2">
                                  {hasResult ? (
                                    // Show View button if result exists
                                    <button
                                      onClick={() => handleViewResult(item.id)}
                                      className="flex items-center justify-center text-center gap-2 bg-green-600 text-white rounded-md font-Roboto font-normal text-sm px-4 py-2 m-auto"
                                    >
                                      View Result
                                      <img
                                        className="w-[18px] h-[14px] mt-1"
                                        src={`${process.env.PUBLIC_URL}/images/student/sendWhite.png`}
                                        alt="img"
                                      />
                                    </button>
                                  ) : (
                                    // Use Countdown component to handle enable/disable + show timers
                                    <Countdown
                                      fromDate={item.from_date}
                                      toDate={item.to_date}
                                      now={nowTs}
                                      onActiveClick={() => handleActiveMCQClick(item.id, item)}
                                      onInactiveClick={(reason: any) => handleInactiveMCQClick(item, reason)}
                                    />
                                  )}
                                </div>
                              </td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td colSpan={6} className="text-center text-gray-500 py-4">
                            Your next big achievement starts here! Explore courses and start learning today.
                          </td>
                        </tr>
                      )}

                      {query && searchResults.length === 0 && (
                        <tr>
                          <td colSpan={6} className="text-center text-gray-500 py-4">No results found</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          {/* Modals */}
          <Modal
            open={modalIsOpen}
            onCancel={closeModal}
            footer={null}
            title="Start Assignment"
            width="100vw"
            style={{ top: 0, padding: 0 }}
            bodyStyle={{ padding: 0, height: "100vh", overflow: "auto" }}
            centered={false}
            modalRender={(modal) => <div style={{ width: "100vw", height: "100vh", margin: 0 }}>{modal}</div>}
          >
            {/* <AssignmentViewer /> */}
            <button onClick={closeModal} className="mt-4 bg-red-500 text-white px-4 py-2 rounded-md">Close</button>
          </Modal>
          {mcqIsOpen && assignmentId != null && (
            <Quiz assignmentId={assignmentId} onCancel={handleCloseQuiz} assignmentData={assignmentData} />
          )}
          {isResultOpen && <ResultViewer assignmentId={assignmentId} onCancel={handleCloseResult} />}
        </div>
      </div>
    </div>
  )
}


