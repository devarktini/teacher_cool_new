'use client'
import React, { useState, useEffect, ChangeEvent } from 'react';
import { BiTrash, BiPencil, BiShow } from 'react-icons/bi';
import axios, { AxiosError } from 'axios';
import MDEditor from '@uiw/react-md-editor';
import FilesViewCore from '@/components/Students/MyLearnings/FileViewer/FilesView';
import { BlogEditor } from '@/components/common/BlogEditor';
import { Course, CourseContent, BlogFile, ApiResponse } from '@/types/PrivateNotes';

// Component Props Interfaces
interface CourseDetailsProps {
    course: Course;
}

interface CourseListProps {
    courses: Course[];
    selectedCourse: Course | null;
    onSelectCourse: (course: Course) => void;
}

const CourseDetails: React.FC<CourseDetailsProps> = ({ course }) => {
    return (
        <div className="space-y-4 flex">
            <div className='w-1/2'>
                <h2 className="text-2xl font-semibold">{course.title}</h2>
                <h3 className="text-xl font-medium">{course.level}</h3>
                <h3 className="text-xl font-medium">Instructor: {course.instructor_name}</h3>
            </div>
            <div className='w-1/2'>
                <img
                    src={course.banner}
                    alt="Course Banner"
                    className="w-full h-44 rounded-md"
                />
            </div>
        </div>
    );
};

const CourseList: React.FC<CourseListProps> = ({ courses, selectedCourse, onSelectCourse }) => {
    const [search, setSearch] = useState<string>('');

    const filteredCourses = courses.filter(course =>
        course.title.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-4">
            <input
                type="text"
                placeholder="Search courses..."
                className="w-full p-2 border border-gray-300 rounded-md"
                value={search}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
            />
            <div className="space-y-1">
                {filteredCourses.length > 0 ? (
                    filteredCourses.map((course) => (
                        <div
                            key={course.id}
                            className="cursor-pointer p-1 border-2 border-green-600 hover:border-blue-500 rounded-md"
                            onClick={() => onSelectCourse(course)}
                        >
                            <div
                                className={`flex flex-col ${course.id === selectedCourse?.id ? 'bg-green-200' : 'bg-white'
                                    }`}
                            >
                                <span className="font-semibold">{course.title}</span>
                                <span className="text-sm">{course['category name']}</span>
                                <span className="text-sm">{course.instructor_name}</span>
                            </div>
                        </div>
                    ))
                ) : (
                    <li>No courses found</li>
                )}
            </div>
        </div>
    );
};

const PrivateNotes: React.FC = () => {
    const [courses, setCourses] = useState<Course[]>([]);
    const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
    const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false);
    const [currentContent, setCurrentContent] = useState<CourseContent | null>(null);
    const [newContent, setNewContent] = useState<string>("");
    const [newContentTitle, setNewContentTitle] = useState<string>("");
    const [isEditMode, setIsEditMode] = useState<boolean>(false);
    const [contentToEdit, setContentToEdit] = useState<CourseContent | null>(null);
    const [files, setFiles] = useState<File[]>([]);
    const [tempFiles, setTempFiles] = useState<BlogFile[]>([]);
    const [isFileOpen, setIsFileOpen] = useState<boolean>(false);
    const [filesData, setFilesData] = useState<BlogFile | null>(null);

    // Fetch the data from the API on component mount
    const fetchCourses = async (): Promise<void> => {
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/lms/course/list_courses/?all_data=true&type=private&is_content=true`,
                {
                    method: "GET",
                    headers: {
                        Accept: "application/json",
                    },
                }
            );

            if (!response.ok) {
                throw new Error("Failed to fetch courses");
            }

            const data: ApiResponse<Course> = await response.json();
            setCourses(data.results || []);
        } catch (error) {
            console.error("Error fetching courses:", error);
        }
    };

    useEffect(() => {
        fetchCourses();
    }, []);

    const handleAddContent = async (): Promise<void> => {
        if (!newContentTitle.trim() || !newContent.trim()) {
            alert("Please provide a title and content.");
            return;
        }

        if (!selectedCourse) {
            alert("Please select a course.");
            return;
        }

        const formData = new FormData();
        const fileIds = tempFiles.map(file => file.file_id || file.id).filter(Boolean).join(',');
        formData.append("blog_file_ids", fileIds);
        formData.append("name", newContentTitle);
        formData.append("content", newContent);
        formData.append("course", selectedCourse.id.toString());

        try {
            const token = localStorage.getItem("token");


            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/lms/private-course-contents/`,
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    body: formData,
                }
            );

            if (!response.ok) {
                const errorResponse = await response.json();
                console.error("Failed to add content:", errorResponse);
                throw new Error("Failed to add content");
            }

            const newContentData: CourseContent = await response.json();

            const updatedCourses = courses.map((course) => {
                if (course.id === selectedCourse.id) {
                    return {
                        ...course,
                        content: [...(course.content || []), newContentData],
                    };
                }
                return course;
            });

            setCourses(updatedCourses);
            setSelectedCourse({
                ...selectedCourse,
                content: [...(selectedCourse.content || []), newContentData],
            });

            setNewContent("");
            setNewContentTitle("");
            setIsPopupOpen(false);
            setTempFiles([]);
            setFiles([]);
        } catch (error) {
            console.error("Error adding content:", error);
        }
    };

    const handleEditContent = async (): Promise<void> => {
        if (!newContentTitle.trim() || !newContent.trim()) {
            alert("Please provide a title and content.");
            return;
        }

        if (!contentToEdit || !selectedCourse) {
            alert("Invalid content or course selection.");
            return;
        }

        try {
            const formData = new FormData();
            const fileIds = tempFiles.map(file => file.file_id || file.id).filter(Boolean).join(',');
            formData.append("blog_file_ids", fileIds);
            formData.append("name", newContentTitle);
            formData.append("content", newContent);
            formData.append("course", selectedCourse.id.toString());

            const token = localStorage.getItem("token");

            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/lms/private-course-contents/${contentToEdit.id}/`,
                {
                    method: "PATCH",
                    headers: {
                        accept: "application/json",
                        Authorization: `Bearer ${token || ''}`,
                    },
                    body: formData,
                }
            );

            if (!response.ok) {
                throw new Error("Failed to edit content");
            }

            const updatedContent: CourseContent = await response.json();

            const updatedCourses = courses.map((course) => {
                if (course.id === selectedCourse.id) {
                    return {
                        ...course,
                        content: (course.content || []).map((content) =>
                            content.id === contentToEdit.id ? updatedContent : content
                        ),
                    };
                }
                return course;
            });

            setCourses(updatedCourses);
            setSelectedCourse({
                ...selectedCourse,
                content: (selectedCourse.content || []).map((content) =>
                    content.id === contentToEdit.id ? updatedContent : content
                ),
            });

            setNewContent("");
            setNewContentTitle("");
            setIsPopupOpen(false);
            setIsEditMode(false);
            setContentToEdit(null);
            setTempFiles([]);
            setFiles([]);
        } catch (error) {
            console.error("Error editing content:", error);
        }
    };

    const handleDeleteContent = async (contentId: number): Promise<void> => {
        if (!selectedCourse) return;

        try {
            const token = localStorage.getItem("token");

            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/lms/private-course-contents/${contentId}/`,
                {
                    method: "DELETE",
                    headers: {
                        accept: "application/json",
                        Authorization: `Bearer ${token || ''}`,
                    },
                }
            );

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data?.message || "Failed to delete content");
            }

            const updatedContent = (selectedCourse?.content || []).filter(
                (content) => content.id !== contentId
            );

            setSelectedCourse((prev) => prev ? ({
                ...prev,
                content: updatedContent,
            }) : null);

            const updatedCourses = courses.map((course) => {
                if (course.id === selectedCourse.id) {
                    return {
                        ...course,
                        content: updatedContent,
                    };
                }
                return course;
            });

            setCourses(updatedCourses);
        } catch (error) {
            console.error("Error deleting content:", error);
        }
    };

    const openEditPopup = (content: CourseContent): void => {
        setContentToEdit(content);
        setNewContentTitle(content.name);
        setNewContent(content.content);
        setTempFiles(content.blog_files || []);
        setIsEditMode(true);
        setIsPopupOpen(true);
    };

    const displayContent = (content: CourseContent): void => {
        setCurrentContent(content);
    };

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>): void => {
        const fileList = e.target.files;
        if (fileList) {
            const newFiles = Array.from(fileList);
            setFiles((prev) => [...prev, ...newFiles]);
        }
    };

    const handleRemoveFile = (indexToRemove: number): void => {
        setFiles((prev) => prev.filter((_, index) => index !== indexToRemove));
    };

    const handleFileUpload = async (): Promise<void> => {
        const token = localStorage.getItem("token");
        if (!token) {
            console.error("User not authenticated.");
            return;
        }

        for (const file of files) {
            const formData = new FormData();
            formData.append("file", file);

            try {
                const response = await axios.post<BlogFile>(
                    `${process.env.NEXT_PUBLIC_API_URL}/lms/s3-upload/`,
                    formData,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "multipart/form-data",
                        },
                    }
                );

                setTempFiles(prev => [...prev, ...(Array.isArray(response.data) ? response.data : [response.data])]);

            } catch (error) {
                const axiosError = error as AxiosError;
                console.error(`Upload failed for ${file.name}:`, axiosError.response?.data || axiosError.message);
            }
        }

        setFiles([]);
    };


    const isImage = (file: File): boolean => file.type.startsWith("image/");
    const isVideo = (file: File): boolean => file.type.startsWith("video/");
    const isPdf = (file: File): boolean => file.type === "application/pdf";

    const deleteBlogFile = async (fileId: any): Promise<void> => {
        try {
            const token = localStorage.getItem("token");

            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/lms/blog-files/${fileId}/`,
                {
                    method: 'DELETE',
                    headers: {
                        accept: 'application/json',
                        Authorization: `Bearer ${token || ''}`,
                    },
                }
            );

            if (response.ok) {
                setTempFiles(prev =>
                    prev.filter(file =>
                        String(file.file_id).trim() !== String(fileId).trim()
                    )
                );
            }
        } catch (error) {
            console.error('Error deleting file:', error);
        }
    };



    const toggleContentEnable = async (contentId: number, enabledValue: boolean): Promise<void> => {
        try {
            const formData = new FormData();
            formData.append("enabled", enabledValue.toString());

            const token = localStorage.getItem("token");

            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/lms/private-course-contents/${contentId}/enable-disable/`,
                {
                    method: "PATCH",
                    headers: {
                        accept: "application/json",
                        Authorization: `Bearer ${token || ''}`,
                    },
                    body: formData,
                }
            );

            if (!response.ok) {
                throw new Error("Failed to toggle enabled status");
            }

            const updated: CourseContent = await response.json();

            setCourses(prevCourses =>
                prevCourses.map(course => ({
                    ...course,
                    content: (course.content || []).map(c =>
                        c.id === contentId ? { ...c, enabled: updated.enabled } : c
                    )
                }))
            );

            if (selectedCourse && selectedCourse.content?.some(c => c.id === contentId)) {
                setSelectedCourse(prev => prev ? ({
                    ...prev,
                    content: (prev.content || []).map(c =>
                        c.id === contentId ? { ...c, enabled: updated.enabled } : c
                    )
                }) : null);
            }
        } catch (error) {
            console.error("Error toggling enable status:", error);
        }
    };

    const closePopup = (): void => {
        setIsPopupOpen(false);
        setIsEditMode(false);
        setContentToEdit(null);
        setTempFiles([]);
        setFiles([]);
        setNewContentTitle("");
        setNewContent("");
    };

    return (
        <div className="h-full flex">
            {/* Left Panel */}
            <div className="w-1/4 p-4 border-r h-full">
                <CourseList
                    courses={courses}
                    selectedCourse={selectedCourse}
                    onSelectCourse={setSelectedCourse}
                />
            </div>

            {/* Right Panel */}
            <div className="w-3/4 p-4 h-full">
                <div className="flex justify-end">
                    <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                        onClick={() => setIsPopupOpen(true)}
                        disabled={!selectedCourse}
                    >
                        Add Content
                    </button>
                </div>
                {selectedCourse ? (
                    <div className="overflow-scroll">
                        <CourseDetails course={selectedCourse} />
                        <div className="mt-8">
                            <h3 className="text-xl font-medium">Contents</h3>
                            <div className="list-disc pl-5 space-y-4">
                                {selectedCourse.content && selectedCourse.content.length > 0 ? (
                                    selectedCourse.content.map((content, index) => (
                                        <div key={index}>
                                            <div className="flex justify-end space-x-2">
                                                <label className="flex items-center gap-2">
                                                    <input
                                                        type="checkbox"
                                                        checked={content.enabled}
                                                        onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                                            toggleContentEnable(content.id, e.target.checked)
                                                        }
                                                    />
                                                    <span>{content.enabled ? 'Enabled' : 'Disabled'}</span>
                                                </label>
                                                <button
                                                    className="hover:text-blue-500"
                                                    onClick={() => displayContent(content)}
                                                >
                                                    <BiShow />
                                                </button>
                                                <button
                                                    className="hover:text-red-500 px-2"
                                                    onClick={() => handleDeleteContent(content.id)}
                                                >
                                                    <BiTrash />
                                                </button>
                                                <button
                                                    className="hover:text-green-500"
                                                    onClick={() => openEditPopup(content)}
                                                >
                                                    <BiPencil />
                                                </button>
                                            </div>
                                            <div className="border-1 h-24">
                                                <h4 className="font-semibold">{content.name}</h4>
                                                <p>
                                                    {new Date(content.created_at).toLocaleDateString('en-GB', {
                                                        year: 'numeric',
                                                        month: '2-digit',
                                                        day: '2-digit'
                                                    })}
                                                </p>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <li>No contents available for this course</li>
                                )}
                            </div>
                        </div>
                    </div>
                ) : (
                    <p className="text-gray-500">Select a course to view details</p>
                )}
            </div>

            {/* Popup Modal */}
            {isPopupOpen && (
                <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
                    <div
                        className="bg-white p-6 rounded-lg shadow-lg overflow-y-auto"
                        style={{ width: "85%", height: "95%" }}
                    >
                        <h2 className="text-xl font-bold mb-4">
                            {isEditMode ? "Edit Content" : "Add Content"}
                        </h2>
                        <div className="flex items-start justify-between">
                            <div className="w-2/3">
                                <input
                                    type="text"
                                    placeholder="Content Title"
                                    className="w-full p-2 mb-4 border border-gray-300 rounded-md"
                                    value={newContentTitle}
                                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                        setNewContentTitle(e.target.value)
                                    }
                                />
                            </div>

                            <div className="flex space-x-4 justify-around w-1/5">
                                <button
                                    className="bg-gray-500 hover:bg-gray-700 text-white font-bold px-2 rounded h-[35px] w-[100px]"
                                    onClick={closePopup}
                                >
                                    Close
                                </button>
                                <button
                                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold px-2 rounded h-[35px] w-[100px]"
                                    onClick={isEditMode ? handleEditContent : handleAddContent}
                                >
                                    {isEditMode ? "Save" : "Add"}
                                </button>
                            </div>
                        </div>

                        <div>
                            <div className='flex items-start justify-between gap-4'>
                                <div className="p-6 bg-white rounded-lg w-full max-w-2xl">
                                    <label className="block mb-2 text-lg font-semibold text-gray-700">
                                        Upload Files
                                    </label>

                                    <input
                                        type="file"
                                        accept=".pdf, .mp4, .avi, .mov, .jpeg, .jpg, .png"
                                        multiple
                                        onChange={handleFileChange}
                                        className="mb-4 block w-full text-sm text-gray-900 file:mr-4 file:py-2 file:px-4
                      file:rounded-full file:border-0 file:text-sm file:font-semibold
                      file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200"
                                    />

                                    <button
                                        onClick={handleFileUpload}
                                        className="mb-6 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                    >
                                        Upload Files
                                    </button>

                                    {files.length > 0 && (
                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                            {files.map((file, index) => (
                                                <div key={index} className="relative border p-2 rounded shadow-sm bg-gray-50">
                                                    {isImage(file) ? (
                                                        <img
                                                            src={URL.createObjectURL(file)}
                                                            alt="preview"
                                                            className="w-full h-32 object-cover rounded"
                                                        />
                                                    ) : isPdf(file) ? (
                                                        <div className="flex items-center justify-center h-32 text-red-600 font-medium">
                                                            📄 {file.name}
                                                        </div>
                                                    ) : isVideo(file) ? (
                                                        <div className="flex items-center justify-center h-32 text-blue-600 font-medium">
                                                            🎥 {file.name}
                                                        </div>
                                                    ) : (
                                                        <div className="flex items-center justify-center h-32">{file.name}</div>
                                                    )}

                                                    <button
                                                        onClick={() => handleRemoveFile(index)}
                                                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 text-xs flex items-center justify-center hover:bg-red-700"
                                                        title="Remove"
                                                    >
                                                        ×
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                <div className="bg-white text-gray-700 p-6 rounded-lg w-full max-w-2xl mx-auto">
                                    <h2 className="text-xl font-bold mb-4">Upload Links</h2>
                                    <ul className="space-y-3">
                                        {tempFiles.map((link, index) => (
                                            <li
                                                key={index}
                                                className="bg-blue-50 px-2 py-1 rounded flex justify-between items-center hover:bg-blue-100 transition"
                                            >
                                                <span className="truncate">{link.url ? link.url : link?.file_url}</span>

                                                <button

                                                    onClick={() => {
                                                        const copyText = link.url ?? link.file_url ?? "";
                                                        navigator.clipboard.writeText(copyText);
                                                    }}
                                                    className="bg-white text-blue-600 px-3 py-1 rounded hover:bg-gray-100 text-sm font-medium"
                                                >
                                                    Copy
                                                </button>

                                                <button
                                                    onClick={() => deleteBlogFile(link?.file_id ? link?.file_id : link?.id)}
                                                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm font-medium"
                                                >
                                                    Delete
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                </div>


                            </div>
                        </div>

                        <div className='mt-4'>
                            <BlogEditor
                                content={newContent}
                                setContent={setNewContent}
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* View Content Modal */}
            {currentContent && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-all duration-300 ease-out">
                    <div className="bg-white w-full max-w-6xl max-h-[95vh] rounded-2xl shadow-xl overflow-hidden border border-gray-100 flex flex-col">
                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                </svg>
                                Document Viewer
                            </h2>
                            <button
                                onClick={() => setCurrentContent(null)}
                                className="text-black hover:text-red-500 transition-colors duration-200 rounded-full p-1 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-200"
                                aria-label="Close"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="overflow-y-auto flex-1 p-6 md:p-8 bg-gradient-to-br from-white to-gray-50">
                            <div className="prose prose-blue max-w-none text-black 
                prose-headings:font-bold 
                prose-headings:text-black 
                prose-p:text-black 
                prose-li:text-black 
                prose-strong:text-black 
                prose-em:text-black 
                prose-code:text-black 
                prose-code:bg-gray-200 
                prose-code:rounded 
                prose-blockquote:text-black 
                prose-a:text-blue-600 hover:prose-a:text-blue-800 
                prose-blockquote:border-l-4 
                prose-blockquote:border-blue-300 
                prose-blockquote:bg-blue-50 
                prose-blockquote:px-4 
                prose-blockquote:py-2 
                prose-blockquote:rounded-r">
                                <MDEditor.Markdown
                                    source={currentContent.content}
                                    style={{
                                        backgroundColor: 'transparent',
                                        lineHeight: 1.6,
                                        color: 'black',
                                    }}
                                />
                            </div>
                        </div>

                        <div className="bg-white px-6 py-4 border-t border-gray-200 flex justify-between items-center">
                            <div>
                                {currentContent.blog_files && currentContent.blog_files.length > 0 && (
                                    <div className="mb-4">
                                        <h3 className="text-lg font-semibold text-gray-800">Attached Files</h3>
                                        <ul className="list-disc pl-5 space-y-2">
                                            {currentContent.blog_files.map((file, index) => (
                                                <li key={index} className="text-gray-600">
                                                    {(file.file_url || '').split('/').pop()}
                                                    <span
                                                        onClick={() => {
                                                            setIsFileOpen(true);
                                                            setFilesData(file);
                                                        }}
                                                        className="cursor-pointer bg-white text-blue-600 px-3 py-1 rounded hover:bg-gray-100 text-sm font-medium"
                                                    >
                                                        view
                                                    </span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                            <button
                                onClick={() => setCurrentContent(null)}
                                className="px-5 py-2.5 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors duration-300 flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 shadow-md hover:shadow-lg"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                                Close Preview
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* <FilesViewCore
        isOpen={isFileOpen}
        onClose={() => setIsFileOpen(false)}
        fileData={filesData}
      /> */}
        </div>
    );
};

export default PrivateNotes;
