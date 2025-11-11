import React, { useEffect, useState } from 'react'
import { CiCalendarDate } from 'react-icons/ci';
import { BsArrowRight } from 'react-icons/bs';
import { IoMdStopwatch } from 'react-icons/io';
import { Tooltip } from 'antd';
import { HiOutlineUsers } from 'react-icons/hi';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { FaEdit } from 'react-icons/fa';
import TeacherApiService from '@/services/teacherApi';
import toast from 'react-hot-toast';
import AddStudents from './AddStudents';
import DeleteCoursePopup from '../Courses/DeleteCoursePopup';


const BatchDetails = ({ batches, setBatches, batchData, handleEdit, searchQuery }: any) => {
    const [selectedBatch, setSelectedBatch] = useState(null);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [showDeletePopup, setShowDeletePopup] = useState(false);
    const [selectedBatchId, setSelectedBatchId] = useState(null);
    const [filteredBatches, setFilteredBatches] = useState([]);
    // const [searchQuery, setSearchQuery] = useState("");

    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 5,
    });

    // Delete handler
    const handleDelete = (id: any) => {
        setSelectedBatchId(id);
        setShowDeletePopup(true);
    };

    const handleCourseDeleted = async (id: any) => {
        try {
            const res = await TeacherApiService.deleteBatch(id);
            if (res) {
                toast.success(`Batch with ID ${id} deleted`);
                setBatches((prevBatches: any) => prevBatches.filter((batch: any) => batch.id !== id));
                setFilteredBatches((prevFilteredBatches) => prevFilteredBatches.filter((batch: any) => batch.id !== id));
            }
        } catch (error: any) {
            console.error("Error deleting batch:", error);
            if (error.status === 403) {
                toast.error(error.response.data.detail || "You do not have permission to delete this batch.");
            } else {
                toast.error("An error occurred while deleting the batch.");
            }
        } finally {
            setShowDeletePopup(false);
        }
    };

    // Determine current batches to display
    const startIndex = (pagination.current - 1) * pagination.pageSize;
    const currentBatches = filteredBatches.slice(
        startIndex,
        startIndex + pagination.pageSize
    );

    const onHandleStaterBatch = async (batch: any) => {
        const res: any = await TeacherApiService.getStudentByBatch(batch.id);
        const batchId = batch.id;

        const studentIds = res?.studentsData?.map((student: any) => student.student) ?? [];
        try {
            const res = await TeacherApiService.enrollStudentsInBatch(batchId, studentIds);

            if (res) {
                toast.success(`Students enrolled in batch ${batch.name}`);
                // Update the batch's status in the state
                setBatches((prevBatches: any) =>
                    prevBatches.map((b: any) =>
                        b.id === batchId ? { ...b, status: "in_progress" } : b
                    )
                );
                // Update filteredBatches to reflect the change
                setFilteredBatches((prev: any) =>
                    prev.map((b: any) =>
                        b.id === batchId ? { ...b, status: "in_progress" } : b
                    )
                );
            } else {
                toast.error("Students not enrolled");
            }
        } catch (error) {
            console.error("Error enrolling students in batch:", error);
            toast.error("Error enrolling students");
        }
    };



    const shareEmail = async (batch: any) => {
        if (!batch.id || !batch.meeting) {
            toast(`Please create a meeting link for batch ${batch.name} first.`);
            return;
        }
        try {
            const res = await TeacherApiService.sendMeetingLinkToStudentByBatch(
                batch.id,
                batch.meeting.id
            );
            if (res) {
                toast.success(`Meeting link sent to students in batch ${batch.name}`);
            } else {
                toast.error("Meeting link not sent to students");
            }
        } catch (error) {
            toast.error("Error sending meeting link to students");
        }
    };

    // useEffect(() => {
    //   setFilteredBatches(batches);
    // }, [batches]);


    useEffect(() => {
        const lowerSearch = searchQuery.toLowerCase();
        const filtered = batches.filter((batch: any) =>
            batch.name.toLowerCase().includes(lowerSearch) ||
            (batch.instructor?.name?.toLowerCase().includes(lowerSearch))
        );
        setFilteredBatches(filtered);
    }, [batches, searchQuery]);

    return (
        <div className="bg-white p-2 rounded">
            {showDeletePopup && (
                <DeleteCoursePopup
                    setShowDeletePopup={setShowDeletePopup}
                    handleCourseDelete={handleCourseDeleted}
                    deletedId={selectedBatchId}
                />
            )}



            {/* Table to display batches */}
            {currentBatches?.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                    {currentBatches.map((batch: any) => (
                        <div
                            key={batch.id}
                            className={`p-4 shadow-md rounded-lg border-l-4 ${batch.status === "in_progress"
                                ? " border-green-600"
                                : batch.status === "closed"
                                    ? " border-red-600"
                                    : " border-gray-300"
                                }`}
                        >
                            <div className="mb-2 text-lg text-center font-bold">
                                {batch.name}
                            </div>

                            <div className="mb-2 text-sm text-start h-20 overflow-y-auto bg-gray-100 p-3 rounded-lg shadow-sm">
                                <ol className="list-decimal list-inside text-gray-700 marker:text-blue-500">
                                    {batch.courses.map((course: any) => (
                                        <li
                                            key={course.id}
                                            className="py-1 border-b last:border-none border-gray-300"
                                        >
                                            {course.title}
                                        </li>
                                    ))}
                                </ol>
                            </div>

                            <div className="mb-2 flex items-center justify-between text-sm font-bold">
                                <div className="flex items-center justify-center gap-3">
                                    <CiCalendarDate className="text-xl" />
                                    {batch.start_date}
                                </div>
                                <BsArrowRight className="text-xl" />
                                {batch.end_date}
                            </div>

                            <div className="mb-2 flex items-center justify-between text-sm font-bold">
                                <div className="flex items-center justify-center gap-3">
                                    <IoMdStopwatch className="text-xl" />
                                    {batch.start_time}
                                </div>
                                <BsArrowRight className="text-xl" />
                                {batch.end_time}
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="mb-2 text-sm">
                                    <strong>Capacity:</strong> {batch.student_count} / {batch.capacity}
                                </div>
                                <div className="mb-2 text-sm">
                                    <strong>Status:</strong> {batch.status}
                                </div>
                            </div>

                            <div className="flex items-center justify-between pt-2">
                                <Tooltip
                                    placement="top"
                                    title={
                                        batch.status !== "open"
                                            ? "You cannot add more students"
                                            : "Add Students"
                                    }
                                >
                                    <button
                                        className={`bg-blue-500 hover:bg-blue-700 text-white text-lg rounded-sm py-1 px-1 ${batch.status !== "open"
                                            ? "opacity-50 cursor-not-allowed"
                                            : "cursor-pointer"
                                            }`}
                                        onClick={() => {
                                            setSelectedBatch(batch);
                                            setIsPopupOpen(true);
                                        }}
                                        disabled={batch.status !== "open"}
                                    >
                                        <HiOutlineUsers />
                                    </button>
                                </Tooltip>

                                <Tooltip
                                    placement="top"
                                    title={
                                        batch.status !== "open"
                                            ? "You have already started the batch"
                                            : "Start Batch"
                                    }
                                >
                                    <button
                                        onClick={() => onHandleStaterBatch(batch)}
                                        disabled={batch.status !== "open"}
                                        className={`bg-gradient-to-r from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 text-white font-bold rounded-sm shadow-md flex items-center ${batch.status !== "open"
                                            ? "opacity-50 cursor-not-allowed"
                                            : "cursor-pointer"
                                            }`}
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
                                                d="M5 13l4 4L19 7"
                                            />
                                        </svg>
                                    </button>
                                </Tooltip>

                                <RiDeleteBin6Line
                                    onClick={() => handleDelete(batch.id)}
                                    className="cursor-pointer w-6 h-6 text-red-500"
                                />
                                <FaEdit
                                    onClick={() => handleEdit(batch.id)}
                                    className="cursor-pointer w-6 h-6 text-blue-500"
                                />
                                <button
                                    onClick={() => shareEmail(batch)}
                                    className="bg-blue-500 hover:bg-blue-700 text-white font-normal text-xs py-1 px-2 rounded"
                                >
                                    Share Email
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="col-span-full text-center py-12">
                    <div className="text-gray-500 text-xl font-medium">
                        {searchQuery ? (
                            <>
                                <span className="text-3xl">🔍</span>
                                <p className="mt-4">No results found for "{searchQuery}"</p>
                            </>
                        ) : (
                            <>
                                <span className="text-3xl">📭</span>
                                <p className="mt-4">No batches available</p>
                            </>
                        )}
                    </div>
                </div>
            )}



            {/* --------------------- */}
            <div className="overflow-hidden mt-4">

            </div>
            {/* Add Students Popup */}
            {isPopupOpen && (
                <AddStudents
                    isOpen={isPopupOpen}
                    onClose={() => setIsPopupOpen(false)}
                    batch={selectedBatch}
                />
            )}
        </div>
    );
};

export default BatchDetails
