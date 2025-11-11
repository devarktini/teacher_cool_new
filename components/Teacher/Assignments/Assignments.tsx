'use client'
import React, { useState, useEffect, useCallback } from "react";
import { AiOutlineClose } from "react-icons/ai";
import TeacherQuizs from "./TeacherQuizs";
import TeacherApiService from "@/services/teacherApi";
import toast from "react-hot-toast";

interface AssignmentData {
    id?: any;
    title: string;
    description: string;
    due_date: string;
    isDisabled?: boolean;
    course: string;
    from_date: string;
    to_date: string;
    quiz_time: string;

}


const Assignment = () => {

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [courseData, setCourseData] = useState<any[]>([]);
    const [assignment, setAssignment] = useState<any[]>([]);
    const [assignmentData, setAssignmentData] = useState<AssignmentData>({
        title: "",
        description: "",
        due_date: "",
        isDisabled: false,
        course: "",
        from_date: "",
        to_date: "",
        quiz_time: "",
    });

    const [loadingAssignments, setLoadingAssignments] = useState(false);

    const fetchListCourseData = async () => {
        try {
            const res: any = await TeacherApiService.listCoursesAdmin();
            // console.log("res", res)
            if (res) {
                setCourseData(res);
            }

        } catch (error: any) {
            if (error.status === 404) {
                return null;
                // toast.info(error.response.data.detail)
            }
        }
    };

    useEffect(() => {
        fetchListCourseData();
    }, []);



    const fetchData = useCallback(async () => {
        setLoadingAssignments(true);
        try {
            const assignmentRes = await TeacherApiService.getAssignment();
            // defensive: support different shapes
            const assignments = (assignmentRes && (assignmentRes.results ?? assignmentRes.data ?? assignmentRes)) || [];
            // ensure we set a NEW array reference to force re-render
            setAssignment(Array.isArray(assignments) ? [...assignments] : []);
            return assignments;
        } catch (err) {
            console.error("Error fetching assignments:", err);
            setAssignment([]); // fallback so UI shows consistent empty state
            return [];
        } finally {
            setLoadingAssignments(false);
        }
    }, []);


    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleChange = (e: any) => {
        const { name, value, type, checked } = e.target;
        setAssignmentData((prevData) => ({
            ...prevData,
            [name]: type === "checkbox" ? checked : value,
        }));
    };
    const resetForm = () => {
        setAssignmentData({
            title: "",
            description: "",
            due_date: "",
            isDisabled: false,
            course: "",
            from_date: "",
            to_date: "",
            quiz_time: "",
        });

    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        try {
            const isEdit = !!assignmentData.id;

            const payload = {
                title: assignmentData.title,
                description: assignmentData.description,
                course: assignmentData.course,
                from_date: assignmentData.from_date,
                to_date: assignmentData.to_date,
                due_date: assignmentData.due_date || assignmentData.to_date,
                is_disabled: assignmentData.isDisabled || false,
                others: { quiz_time: assignmentData.quiz_time || "1:00" },
            };

            const res = isEdit
                ? await TeacherApiService.updateAssignment(assignmentData.id, payload)
                : await TeacherApiService.addAssignment(payload);

            if (res) {
                resetForm();
                fetchData();
                setShowModal(false);
                toast.success(`Assignment ${isEdit ? "Updated" : "Added"} Successfully!`);
            }
        } catch (error: any) {
            console.error(error);
            if (error.status === 403) {
                toast.error(error.response?.data?.detail || "Access denied");
            } else {
                toast.error("Something went wrong! Please try again.");
            }
        }
    };


    const formatDateForInput = (isoString: any) => {
        if (!isoString) return "";

        const date = new Date(isoString);

        // Adjust to local time for display
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        const hours = String(date.getHours()).padStart(2, "0");
        const minutes = String(date.getMinutes()).padStart(2, "0");

        return `${year}-${month}-${day}T${hours}:${minutes}`;
    };


    // edit assignment
    const handleEdit = (item: any) => {
        const formattedItem = {
            title: item.title || "",
            description: item.description || "",
            due_date: formatDateForInput(item.due_date),
            course: item.course || "",
            from_date: formatDateForInput(item.from_date),
            to_date: formatDateForInput(item.to_date),
            quiz_time: item?.others?.quiz_time,
            id: item.id,
        };

        setAssignmentData(formattedItem);
        setShowModal(true);
    };


    return (

        <>
            <div className="max-w-6xl mx-auto h-[85vh] p-6 bg-gray-50 rounded-2xl shadow-xl border border-gray-100">
                {/* Top controls */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                    <div className="flex items-center gap-4">
                        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-800">Assignments</h1>
                        <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-sm font-medium shadow-sm border border-blue-100">
                            {assignment?.length ?? 0} total
                        </span>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => {
                                // keep your flow: setShowModal controls modal
                                // if you used setScreenSwitch elsewhere, remove references
                                setShowModal(true);
                            }}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-lg shadow hover:scale-[1.02] transition-transform"
                            title="Add assignment"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                            </svg>
                            Add Assignment
                        </button>

                        <button
                            onClick={() => {
                                // If you have a separate modal for content, open it here.
                                // For simplicity this opens the same modal — adapt if you have separate logic.

                                setIsModalOpen(true)
                            }}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md"
                            title="Add assignment content"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6M9 16h6M9 8h6" />
                            </svg>
                            Add Assignment Content
                        </button>
                    </div>
                </div>

                {/* Add Assignment modal */}
                {showModal && (
                    <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center p-4">
                        <div className="bg-white w-full max-w-2xl rounded-xl shadow-2xl p-6">
                            <div className="flex items-start justify-between mb-4">
                                <h2 className="text-xl font-semibold text-slate-800">

                                    {assignmentData.id ? "Edit Assignment" : "Add Assignment"}
                                </h2>
                                <button
                                    onClick={() => setShowModal(false)}
                                    aria-label="Close"
                                    className="p-1 rounded-md hover:bg-gray-100"
                                >
                                    <AiOutlineClose className="text-lg text-slate-600" />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label htmlFor="title" className="block text-sm font-medium text-slate-700">
                                        Title<span className="text-red-500"> *</span>
                                    </label>
                                    <input
                                        id="title"
                                        name="title"
                                        required
                                        value={assignmentData.title}
                                        onChange={handleChange}
                                        className={`mt-1 block w-full rounded-lg p-3 border  'border-gray-200' bg-white focus:outline-none focus:ring-2 focus:ring-blue-200`}
                                    />

                                </div>

                                <div>
                                    <label htmlFor="description" className="block text-sm font-medium text-slate-700">
                                        Description<span className="text-red-500"> *</span>
                                    </label>
                                    <textarea
                                        id="description"
                                        name="description"
                                        required
                                        value={assignmentData.description}
                                        onChange={handleChange}
                                        rows={4}
                                        className={`mt-1 block w-full rounded-lg p-3 border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-200`}
                                    />

                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="due_date" className="block text-sm font-medium text-slate-700">
                                            Start Date<span className="text-red-500"> *</span>
                                        </label>
                                        <input
                                            id="from_date"
                                            type="datetime-local"
                                            name="from_date"
                                            required
                                            value={assignmentData.from_date}
                                            onChange={handleChange}
                                            className={`mt-1 block w-full rounded-lg p-2 border  border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-200`}
                                        />

                                    </div>
                                    <div>
                                        <label htmlFor="due_date" className="block text-sm font-medium text-slate-700">
                                            End Date<span className="text-red-500"> *</span>
                                        </label>
                                        <input
                                            id="to_date"
                                            type="datetime-local"
                                            name="to_date"
                                            required
                                            value={assignmentData.to_date}
                                            onChange={handleChange}
                                            className={`mt-1 block w-full rounded-lg p-2 border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-200`}
                                        />

                                    </div>

                                    <div>
                                        <label htmlFor="quiz_time" className="block text-sm font-medium text-slate-700">
                                            Quiz Time<span className="text-red-500"> *</span>
                                        </label>

                                        <select
                                            id="quiz_time"
                                            name="quiz_time"
                                            value={assignmentData.quiz_time}
                                            onChange={handleChange}
                                            required
                                            className={`mt-1 block w-full rounded-lg p-2 border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-200`}
                                        >
                                            <option value="1:00">1 hour</option>
                                            <option value="1:30">1:30 hours</option>
                                            <option value="2:00">2 hours</option>
                                            <option value="2:30">2:30 hours</option>
                                            <option value="3:00">3 hours</option>
                                            <option value="3:30">3:30 hours</option>
                                            <option value="4:00">4 hours</option>
                                        </select>

                                    </div>


                                    <div>
                                        <label htmlFor="course" className="block text-sm font-medium text-slate-700">
                                            Course<span className="text-red-500"> *</span>
                                        </label>
                                        <select
                                            id="course"
                                            name="course"
                                            required
                                            value={assignmentData.course}
                                            onChange={handleChange}
                                            className={`mt-1 block w-full rounded-lg p-2 border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-200`}
                                        >
                                            <option value="">Select a course</option>
                                            {courseData?.map((item) => (
                                                <option key={item.id} value={item.id}>
                                                    {item.title}
                                                </option>
                                            ))}
                                        </select>

                                    </div>
                                </div>



                                <div className="flex justify-end gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setShowModal(false)}
                                        className="px-4 py-2 rounded-lg border border-gray-200 bg-white hover:bg-gray-50"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-5 py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-semibold shadow hover:scale-[1.01]"
                                    >
                                        {assignmentData.id ? "Update Assignment" : "Add Assignment"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Main content area (always show assignment list) */}
                <div className="mt-6">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                        <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <h3 className="text-lg font-medium text-slate-800">Assignment List</h3>
                                <p className="text-sm text-slate-500">{assignment?.length ?? 0} items</p>
                            </div>

                            <div className="flex items-center gap-2">
                                <input
                                    type="search"
                                    placeholder="Search title..."
                                    className="px-3 py-2 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-100"
                                />
                            </div>
                        </div>

                        {/* Scrollable table container with sticky header */}
                        <div className="max-h-[58vh] overflow-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50 sticky top-0 z-10">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-sm font-medium text-slate-600">Title</th>
                                        <th className="px-6 py-3 text-left text-sm font-medium text-slate-600">Description</th>
                                        {/* <th className="px-6 py-3 text-left text-sm font-medium text-slate-600">Due Date</th> */}
                                        <th className="px-6 py-3 text-left text-sm font-medium text-slate-600">Quiz Duration</th>
                                        <th className="px-6 py-3 text-left text-sm font-medium text-slate-600">From/End Date</th>
                                        <th className="px-6 py-3 text-left text-sm font-medium text-slate-600">Course</th>
                                        <th className="px-6 py-3 text-left text-sm font-medium text-slate-600">Disable Assignment</th>
                                        <th className="px-6 py-3 text-left text-sm font-medium text-slate-600">Created By</th>
                                        <th className="px-6 py-3 text-left text-sm font-medium text-slate-600">Actions</th>
                                    </tr>
                                </thead>

                                <tbody className="bg-white divide-y divide-gray-100">
                                    {assignment && assignment.length > 0 ? (
                                        assignment.map((item, index) => (
                                            // console.log(item),
                                            <tr key={index} className="hover:bg-gray-50 transition-colors align-top">
                                                <td className="px-6 py-4 align-top whitespace-normal text-sm text-slate-700">{item.title}</td>
                                                <td className="px-6 py-4 align-top whitespace-normal text-sm text-slate-600 max-w-[28rem]">{item.description}</td>
                                                {/* <td className="px-6 py-4 align-top text-sm text-slate-600">{new Date(item.due_date).toLocaleString()}</td> */}
                                                <td className="px-6 py-4 align-top text-sm text-slate-600">{item?.others?.quiz_time} hrs</td>
                                                <td className="px-6 py-4 align-top text-sm text-slate-600">
                                                    {new Date(item.from_date).toLocaleString([], {
                                                        year: 'numeric',
                                                        month: '2-digit',
                                                        day: '2-digit',
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })} -
                                                    {new Date(item.to_date).toLocaleString([], {
                                                        year: 'numeric',
                                                        month: '2-digit',
                                                        day: '2-digit',
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}
                                                </td>
                                                <td className="px-6 py-4 align-top text-sm text-slate-700">{item.course_name}</td>

                                                <td className="px-6 py-4 align-top text-sm text-slate-700">
                                                    <input
                                                        type="checkbox"
                                                        checked={item.is_disabled}
                                                        onChange={async (e) => {
                                                            const updatedValue = e.target.checked;
                                                            const prevValue = item.is_disabled;

                                                            // Optimistically update UI
                                                            setAssignment((prev) =>
                                                                prev.map((a) =>
                                                                    a.id === item.id ? { ...a, is_disabled: updatedValue } : a
                                                                )
                                                            );

                                                            try {
                                                                // Call API with proper payload
                                                                await TeacherApiService.updateAssignmentActive(item.id, { is_disabled: updatedValue });
                                                                toast.success("Assignment updated successfully.");
                                                            } catch (error) {
                                                                // Revert UI on failure
                                                                setAssignment((prev) =>
                                                                    prev.map((a) =>
                                                                        a.id === item.id ? { ...a, is_disabled: prevValue } : a
                                                                    )
                                                                );
                                                                console.error("Failed to update assignment:", error);
                                                                toast.error("Failed to update assignment. Please try again.");
                                                            }
                                                        }}
                                                        className="border border-gray-300 rounded-md p-1"
                                                    />
                                                </td>


                                                <td className="px-6 py-4 align-top text-sm text-slate-700">{item?.created_by?.name} ({item?.created_by?.type})</td>
                                                <td className="px-6 py-4 align-top text-sm text-slate-700"><button onClick={() => handleEdit(item)}>Edit</button></td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={4} className="px-6 py-10 text-center text-slate-500">
                                                <div className="flex flex-col items-center gap-3">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-300" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6M9 16h6M9 8h6" />
                                                    </svg>
                                                    <div className="text-sm">No assignments yet. Click <strong>Add Assignment</strong> to create one.</div>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>


            {isModalOpen && (

                <TeacherQuizs
                    isModalOpen={isModalOpen}
                    setIsModalOpen={setIsModalOpen}

                />
            )}

        </>


    );
};

export default Assignment

