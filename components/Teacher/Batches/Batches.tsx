'use client';
import React, { useEffect, useState, ChangeEvent, FormEvent } from "react";
import { useSelector } from "react-redux";
import { selectAuth } from "@/store/features/authSlice";
import toast from "react-hot-toast";
import TeacherApiService from "@/services/teacherApi";
import BatchDetails from "./BatchDetails";

// ==== Interfaces ====

interface Course {
    id: number | string;
    title: string;
}

interface Batch {
    id: number;
    name: string;
    description: string;
    start_date: string;
    end_date: string;
    capacity: number;
    status: string;
    day: string;
    start_time: string;
    end_time: string;
    instructor?: string;
    courses?: Course[];
}

interface FormDataState {
    name: string;
    banner: File | null;
    description: string;
    start_date: string;
    end_date: string;
    capacity: string;
    status: string;
    day: string;
    start_time: string;
    end_time: string;
    instructor: string;
    course: string[]; // store course IDs as strings
}

const Batches: React.FC = () => {
    const { user } = useSelector(selectAuth);
    const userDetails = user;

    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [courses, setCourses] = useState<Course[]>([]);
    const [batches, setBatches] = useState<Batch[]>([]);
    const [isEditMode, setIsEditMode] = useState(false);
    const [editBatchId, setEditBatchId] = useState<number | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchQueryBatch, setSearchQueryBatch] = useState('');

    const [formData, setFormData] = useState<FormDataState>({
        name: "",
        banner: null,
        description: "",
        start_date: "",
        end_date: "",
        capacity: "",
        status: "open",
        day: "",
        start_time: "",
        end_time: "",
        instructor: "",
        course: [],
    });

    // ==== Filters ====
    const filteredCourses = courses.filter((course) =>
        course.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // ==== Handlers ====
    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, files, type } = e.target as HTMLInputElement;

        if (name === "course") {
            const courseId = value;
            setFormData((prev) => ({
                ...prev,
                course: prev.course.includes(courseId)
                    ? prev.course.filter((id) => id !== courseId)
                    : [...prev.course, courseId],
            }));
        } else {
            setFormData((prev) => ({
                ...prev,
                [name]: type === "file" && files ? files[0] : value,
            }));
        }
    };

    const removeCourse = (courseId: string) => {
        setFormData((prev) => ({
            ...prev,
            course: prev.course.filter((id) => id !== courseId),
        }));
    };

    const batchData = async () => {
        try {
            const res: any = await TeacherApiService.getTeacherBatch(userDetails.id);
            setBatches(res?.results || []);
        } catch (error) {
            console.error("Error fetching batches", error);
        }
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!formData.course.length) {
            toast.error("Please select at least one course");
            return;
        }

        try {
            if (isEditMode && editBatchId) {
                const result: any = await TeacherApiService.updateBatchDetails(editBatchId, formData);
                if (result) {
                    toast.success("Batch updated successfully");
                    const updatedBatches: any = batches.map((batch) =>
                        batch.id === editBatchId ? { ...batch, ...formData } : batch
                    );
                    setBatches(updatedBatches);
                }
                batchData();
            } else {
                const result = await TeacherApiService.createBatch(formData);
                if (result) {
                    toast.success("Batch created successfully");
                    batchData();
                } else {
                    toast("You have no access to create batch");
                }
            }

            handleClosePopup();
        } catch (error: any) {
            console.error("Error creating batch", error);
            if (error?.status === 403) {
                toast(error.response?.data?.detail);
            } else {
                toast.error(`Error: ${error.message}`);
            }
        }
    };

    const handleEdit = (id: number) => {
        const batchToEdit = batches.find((batch) => batch.id === id);
        if (batchToEdit) {
            setFormData({
                name: batchToEdit.name,
                banner: null,
                description: batchToEdit.description || "",
                start_date: batchToEdit.start_date?.split("T")[0] || "",
                end_date: batchToEdit.end_date?.split("T")[0] || "",
                capacity: String(batchToEdit.capacity || ""),
                status: batchToEdit.status || "open",
                day: batchToEdit.day || "",
                start_time: batchToEdit.start_time?.slice(0, 5) || "",
                end_time: batchToEdit.end_time?.slice(0, 5) || "",
                instructor: batchToEdit.instructor || "",
                course: batchToEdit.courses?.map((c) => String(c.id)) || [],
            });
            setIsEditMode(true);
            setEditBatchId(id);
            setIsPopupOpen(true);
        }
    };

    useEffect(() => {
        TeacherApiService.GetBatchCourses().then((res: any) => {
            setCourses(res || []);
        });
        batchData();
    }, []);

    const handleClosePopup = () => {
        setIsPopupOpen(false);
        setIsEditMode(false);
        setEditBatchId(null);
        setSearchQuery('');
        setFormData({
            name: "",
            banner: null,
            description: "",
            start_date: "",
            end_date: "",
            capacity: "",
            status: "open",
            day: "",
            start_time: "",
            end_time: "",
            instructor: "",
            course: [],
        });
    };

    // ==== Render ====
    return (
        <>
            <div className="flex justify-between items-center mb-4 gap-[16rem]">
                <h2 className="text-2xl font-semibold">Batches</h2>
                <input
                    type="text"
                    className="w-[20rem] px-4 py-1 border rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="Search by name or instructor"
                    value={searchQueryBatch}
                    onChange={(e) => setSearchQueryBatch(e.target.value)}
                />
                <button
                    onClick={() => setIsPopupOpen(true)}
                    className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded"
                >
                    Add Batch
                </button>
            </div>

            {isPopupOpen && (
                <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-[999] overflow-y-auto">
                    <div className="max-w-6xl mx-auto p-6 bg-white rounded-md shadow-md relative h-[90vh] w-full flex flex-col">
                        <h2 className="text-2xl font-bold mb-4">
                            {isEditMode ? "Edit Batch" : "Create Batch"}
                        </h2>

                        <form onSubmit={handleSubmit} className="flex-1 overflow-hidden flex flex-col">
                            <div className="grid grid-cols-2 gap-6 flex-1 overflow-hidden">
                                {/* Left Column */}
                                <div className="flex flex-col gap-6 h-full overflow-hidden">
                                    <div>
                                        <label className="text-sm font-medium">
                                            Batch Name <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="name"
                                            className="w-full p-2 border rounded"
                                            placeholder="Enter batch name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>

                                    <div className="flex flex-col h-full overflow-hidden">
                                        <div className="mb-2">
                                            <label className="text-sm font-medium">
                                                Search Courses <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                placeholder="Search courses..."
                                                className="w-full p-2 border rounded"
                                                value={searchQuery}
                                                onChange={(e) => setSearchQuery(e.target.value)}
                                            />
                                        </div>

                                        <div className="border rounded overflow-auto flex-1 p-2 space-y-2">
                                            {filteredCourses.map((course) => (
                                                <label
                                                    key={course.id}
                                                    className="flex items-center p-2 hover:bg-gray-50 cursor-pointer"
                                                >
                                                    <input
                                                        type="checkbox"
                                                        name="course"
                                                        value={String(course.id)}
                                                        checked={formData.course.includes(String(course.id))}
                                                        onChange={handleChange}
                                                        className="mr-2 h-4 w-4"
                                                    />
                                                    <span className="truncate">{course.title}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Right Column */}
                                <div className="flex flex-col gap-6 h-full overflow-hidden">
                                    <div className="flex-1 overflow-hidden">
                                        <h3 className="text-sm font-medium mb-2">
                                            Selected Courses ({formData.course.length})
                                        </h3>
                                        <div className="border rounded p-2 h-full overflow-y-auto">
                                            {formData.course.length === 0 ? (
                                                <div className="text-gray-500 text-center py-4">
                                                    No courses selected
                                                </div>
                                            ) : (
                                                <div className="space-y-2">
                                                    {formData.course.map((courseId) => {
                                                        const course = courses.find(
                                                            (c) => c.id === courseId || c.id === parseInt(courseId, 10)
                                                        );
                                                        return (
                                                            <div
                                                                key={courseId}
                                                                className="flex items-center justify-between bg-gray-50 p-2 rounded"
                                                            >
                                                                <div className="flex-1 font-medium truncate">{course?.title}</div>
                                                                <button
                                                                    type="button"
                                                                    className="text-red-500 hover:text-red-700 ml-2"
                                                                    onClick={() => removeCourse(courseId)}
                                                                >
                                                                    ×
                                                                </button>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Right Column Inputs */}
                                    <div className="space-y-4">
                                        <div>
                                            <label className="text-sm font-medium">Description</label>
                                            <textarea
                                                name="description"
                                                className="w-full p-2 border rounded resize-none"
                                                placeholder="Enter description"
                                                value={formData.description}
                                                onChange={handleChange}
                                                rows={1}
                                            />
                                        </div>

                                        <div className="grid grid-cols-2 gap-3">
                                            <div>
                                                <label className="text-sm font-medium">
                                                    Start Date <span className="text-red-500">*</span>
                                                </label>
                                                <input
                                                    type="date"
                                                    name="start_date"
                                                    className="w-full p-2 border rounded"
                                                    value={formData.start_date}
                                                    onChange={handleChange}
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="text-sm font-medium">
                                                    End Date <span className="text-red-500">*</span>
                                                </label>
                                                <input
                                                    type="date"
                                                    name="end_date"
                                                    className="w-full p-2 border rounded"
                                                    value={formData.end_date}
                                                    onChange={handleChange}
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-3">
                                            <div>
                                                <label className="text-sm font-medium">
                                                    Start Time <span className="text-red-500">*</span>
                                                </label>
                                                <input
                                                    type="time"
                                                    name="start_time"
                                                    className="w-full p-2 border rounded"
                                                    value={formData.start_time}
                                                    onChange={handleChange}
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="text-sm font-medium">
                                                    End Time <span className="text-red-500">*</span>
                                                </label>
                                                <input
                                                    type="time"
                                                    name="end_time"
                                                    className="w-full p-2 border rounded"
                                                    value={formData.end_time}
                                                    onChange={handleChange}
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-3 gap-3">
                                            <div>
                                                <label className="text-sm font-medium">
                                                    Capacity <span className="text-red-500">*</span>
                                                </label>
                                                <input
                                                    type="number"
                                                    name="capacity"
                                                    className="w-full p-2 border rounded"
                                                    value={formData.capacity}
                                                    onChange={handleChange}
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="text-sm font-medium">
                                                    Status <span className="text-red-500">*</span>
                                                </label>
                                                <select
                                                    name="status"
                                                    className="w-full p-2 border rounded"
                                                    value={formData.status}
                                                    onChange={handleChange}
                                                    required
                                                >
                                                    <option value="open">Open</option>
                                                    <option value="closed">Closed</option>
                                                    <option value="in_progress">In Progress</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="text-sm font-medium">Day</label>
                                                <input
                                                    type="text"
                                                    name="day"
                                                    className="w-full p-2 border rounded"
                                                    value={formData.day}
                                                    onChange={handleChange}
                                                    placeholder="e.g. Monday"
                                                    required
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end space-x-3 mt-6">
                                <button
                                    type="submit"
                                    className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded"
                                >
                                    {isEditMode ? "Update Batch" : "Create Batch"}
                                </button>
                                <button
                                    type="button"
                                    onClick={handleClosePopup}
                                    className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <BatchDetails
                batches={batches}
                setBatches={setBatches}
                batchData={batchData}
                handleEdit={handleEdit}
                searchQuery={searchQueryBatch}
            />
        </>
    );
};

export default Batches;
