"use client"
import React, { useEffect, useRef, useState } from 'react';
import { Modal, Button } from 'antd';
import { useSelector } from 'react-redux';
import { FaBook, FaClock, FaPlay, FaVideo } from 'react-icons/fa';
import axios from 'axios';
import { RiDeleteBin6Line } from 'react-icons/ri';
import toast from 'react-hot-toast';
import DeleteCoursePopup from './DeleteCoursePopup';
import HLSVideoPlayer from '@/components/common/HLSVideoPlayer';
import TeacherApiService from '@/services/teacherApi';
import { selectAuth } from '@/store/features/authSlice';

// -------------------------
// Types
// -------------------------

type User = {
    id?: number | string;
    [key: string]: any;
};

type Lecture = {
    id?: number | string;
    name?: string;
    [key: string]: any;
};

type ModuleType = {
    module?: string;
    lecture?: Lecture[];
    [key: string]: any;
};

type CourseType = {
    id?: number | string;
    title?: string;
    modules?: ModuleType[];
    type?: string;
    [key: string]: any;
};

type CourseDetailItem = {
    id?: number | string;
    course?: string;
    module?: string;
    sub_module?: string;
    is_uploaded?: boolean;
    thumbnail_image?: string;
    created_at?: string;
    [key: string]: any;
};

// -------------------------
// Main component
// -------------------------

const CourseContent: React.FC = () => {
    const { user } = useSelector(selectAuth) as { user?: User };
    const userDetails = user || {};

    const [showModal, setShowModal] = useState<boolean>(false);
    const [courseModules, setCourseModules] = useState<ModuleType[]>([]);
    const [categoryList, setCategoryList] = useState<CourseType[]>([]);
    const [moduleIndex, setModuleIndex] = useState<number>(0);
    const [progress, setProgress] = useState<number>(0);
    const [moduleSubList, setModuleSubList] = useState<Lecture[]>([]);

    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [courseInformation, setCourseInformation] = useState<{
        course: string;
        file: string;
        file_type: string;
        moduleName: string;
        lectureName: string;
        thumbnail_image: string;
        is_preview_video: boolean;
    }>({
        course: '',
        file: '',
        file_type: '',
        moduleName: '',
        lectureName: '',
        thumbnail_image: '',
        is_preview_video: false,
    });

    const [loading, setLoading] = useState<boolean>(false);
    const [file, setFile] = useState<File | null>(null);
    const [existingContent, setExistingContent] = useState<Array<any>>([]);
    const [courseDetails, setCourseDetails] = useState<CourseDetailItem[]>([]);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [thumbnailImg, setThumbnailImg] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const f = e.target.files?.[0] || null;
        if (!f) return;
        setThumbnailImg(f);
        setPreview(URL.createObjectURL(f));
    };

    const coursesByTeacher = async () => {
        try {
            const res: any = await TeacherApiService.getCoursesFilesByUser(userDetails.id);
            if (res) {
                setCourseDetails(res);
            }
        } catch (error) {
            toast.error('Error fetching teacher courses');
        }
    };

    useEffect(() => {
        if (userDetails?.id) coursesByTeacher();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userDetails?.id]);

    useEffect(() => {
        TeacherApiService.getCoursesByUserTwo(userDetails?.id).then((res: any) => {
            setCategoryList(
                (res?.data || []).filter((course: CourseType) => {
                    const type = (course.type || '').toString().toLowerCase();
                    return type === 'public' || type === 'free';
                })
            );
        }).catch(() => {
            /* ignore */
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleOpenModal = () => setShowModal(true);

    const resetState = () => {
        setFile(null);
        setCourseInformation(prev => ({
            ...prev,
            file: '',
            file_type: '',
            lectureName: '',
            thumbnail_image: '',
            is_preview_video: false,
        }));
        if (fileInputRef.current) fileInputRef.current.value = '';
        setProgress(0);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        resetState();
        setCourseInformation({
            course: '',
            file: '',
            file_type: '',
            moduleName: '',
            lectureName: '',
            thumbnail_image: '',
            is_preview_video: false,
        });
        setCourseModules([]);
        setModuleSubList([]);
        setExistingContent([]);
    };

    const onClickSelectCourse = (index: number) => {
        if (index === -1) {
            setCourseModules([]);
            return;
        }
        setModuleIndex(index);
        setCourseModules(categoryList[index]?.modules || []);
        setExistingContent([]);
    };

    const onClickSelectModule = (index: number) => {
        const selectedModule = courseModules[index];
        setModuleSubList(selectedModule?.lecture || []);
        setExistingContent([]);
    };

    // Upload in chunks (returns info about uploaded chunks)
    const uploadFileInChunks = async (f: File) => {
        const chunkSize = 50 * 1024 * 1024; // 50MB
        const totalChunks = Math.ceil(f.size / chunkSize);
        const uploadId = new Date().getTime().toString();
        let totalBytesUploaded = 0;

        const uploadChunk = async (chunk: Blob, chunkNumber: number) => {
            const formData = new FormData();
            formData.append('chunk', chunk as Blob);
            formData.append('chunkNumber', String(chunkNumber));
            formData.append('uploadId', uploadId);
            formData.append('totalChunks', String(totalChunks));

            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/lms/upload-chunk/upload-chunk/`, {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
                    },
                    body: formData,
                });

                totalBytesUploaded += (chunk as Blob).size;
                const currentProgress = Math.round((totalBytesUploaded / f.size) * 100);
                setProgress(currentProgress);
                return response.json();
            } catch (error) {
                toast.error('Error uploading chunk');
                throw error;
            }
        };

        const promises: Promise<any>[] = [];
        for (let i = 0; i < totalChunks; i++) {
            const chunk = f.slice(i * chunkSize, (i + 1) * chunkSize);
            promises.push(uploadChunk(chunk, i));
        }

        const results = await Promise.all(promises);
        return {
            chunkSize,
            res: results,
            uploadId,
            totalChunks,
        };
    };

    const handleSubmit = async () => {
        if (!courseInformation.course) { toast.error('Please select a course'); return; }
        if (!courseInformation.moduleName) { toast.error('Please select a module'); return; }
        if (!courseInformation.lectureName) { toast.error('Please select a lecture'); return; }
        if (!file) { toast.error('Please select a file'); return; }

        setLoading(true);
        setProgress(0);

        try {
            const fileType = file.type || '';
            const fileCategory = fileType.startsWith('video/') ? 'video' : 'pdf';

            const uploadResult = await uploadFileInChunks(file);
            if (!uploadResult) throw new Error('Upload failed');

            const formData = new FormData();
            formData.append('upload_id', uploadResult.uploadId);
            formData.append('module', courseInformation.moduleName);
            formData.append('course_id', courseInformation.course);
            formData.append('lecture', courseInformation.lectureName);
            formData.append('is_preview_video', String(courseInformation.is_preview_video));
            formData.append('file_type', fileCategory);
            if (thumbnailImg) formData.append('thumbnail_image', thumbnailImg);

            if (fileCategory === 'video') {
                await fetch(`${process.env.NEXT_PUBLIC_API_URL}/lms/upload-chunk/merge-chunks/`, {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('userAuth') || ''}`,
                    },
                    body: formData,
                });
            } else {
                await TeacherApiService.getCourseContent(formData);
            }

            setExistingContent(prev => [
                ...prev,
                {
                    lecture: courseInformation.lectureName,
                    type: fileCategory,
                    isPreview: courseInformation.is_preview_video,
                    date: new Date().toLocaleString(),
                },
            ]);

            toast.success('Content uploaded successfully!');
            await coursesByTeacher();
            resetState();
        } catch (error: any) {
            toast.error(error?.message || 'Error uploading content');
        } finally {
            setLoading(false);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const f = e.target.files?.[0] || null;
        if (!f) return;

        const validTypes = ['video/mp4', 'application/pdf'];
        if (!validTypes.includes(f.type)) {
            toast.error('Invalid file type. Only MP4 and PDF allowed');
            return;
        }

        setFile(f);
        setCourseInformation(prev => ({
            ...prev,
            file: f.name,
            file_type: f.type.startsWith('video/') ? 'video' : 'pdf',
        }));
    };

    return (
        <>
            <div className="flex items-center justify-end gap-[16rem] ">
                <h4>Course Content</h4>
                <input
                    type="text"
                    placeholder="Search course content..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="w-[20rem] px-4 py-1 border rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                <Button type="primary" onClick={handleOpenModal} className="add-content-btn">
                    Add Course Content
                </Button>
            </div>

            <Modal
                centered
                width={700}
                open={showModal}
                title={<span className="text-2xl pl-4 font-semibold">Add Course Content</span>}
                onCancel={handleCloseModal}
                footer={null}
            >
                <div className="border-t-2 border-gray-200 mt-2 pt-3 px-4" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                            {/* Course Selection */}
                            <div>
                                <label className="block text-sm font-medium mb-1">Course <span className="text-red-500">*</span></label>
                                <select
                                    className="w-full p-2 border rounded"
                                    onChange={e => {
                                        const index = e.target.selectedIndex - 1;
                                        onClickSelectCourse(index);
                                        setCourseInformation(prev => ({ ...prev, course: e.target.value, moduleName: '', lectureName: '' }));
                                    }}
                                    value={courseInformation.course}
                                >
                                    <option value="">Select Course</option>
                                    {categoryList?.map((course, idx) => (
                                        <option key={String(course.id ?? idx)} value={String(course.id ?? '')}>{course.title}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Module Selection */}
                            <div>
                                <label className="block text-sm font-medium mb-1">Module <span className="text-red-500">*</span></label>
                                <select
                                    className="w-full p-2 border rounded"
                                    onChange={e => {
                                        const index = e.target.selectedIndex - 1;
                                        onClickSelectModule(index);
                                        setCourseInformation(prev => ({ ...prev, moduleName: e.target.value, lectureName: '' }));
                                    }}
                                    value={courseInformation.moduleName}
                                    disabled={!courseInformation.course}
                                >
                                    <option value="">Select Module</option>
                                    {courseModules.map((module, idx) => (
                                        <option key={String(idx)} value={String(module.module ?? '')}>{module.module}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Lecture Selection */}
                            <div>
                                <label className="block text-sm font-medium mb-1">Lecture <span className="text-red-500">*</span></label>
                                <select
                                    className="w-full p-2 border rounded"
                                    onChange={e => setCourseInformation(prev => ({ ...prev, lectureName: e.target.value }))}
                                    value={courseInformation.lectureName}
                                    disabled={!courseInformation.moduleName}
                                >
                                    <option value="">Select Lecture</option>
                                    {moduleSubList.map((lecture, idx) => (
                                        <option key={String(lecture.id ?? idx)} value={String(lecture.name ?? '')}>{lecture.name}</option>
                                    ))}
                                </select>
                            </div>

                            {/* File Upload */}
                            <div>
                                <label className="block text-sm font-medium mb-1">File <span className="text-red-500">*</span></label>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    className="w-full p-2 border rounded"
                                    accept=".mp4,.pdf"
                                    onChange={handleFileChange}
                                    disabled={loading}
                                />
                            </div>

                            {/* Thumbnail */}
                            <div>
                                <label className="block text-sm font-medium mb-1">Thumbnail <span className="text-red-500">*</span></label>
                                {preview && <img src={preview} alt="Preview" className="w-48 h-48 object-cover rounded-md" />}
                                <input type="file" className="w-full p-2 border rounded" accept="image/*" onChange={handleImageChange} />
                            </div>

                        </div>

                        {/* Preview Video Checkbox */}
                        <div className="flex items-center gap-2">
                            <input type="checkbox" checked={courseInformation.is_preview_video} onChange={e => setCourseInformation(prev => ({ ...prev, is_preview_video: e.target.checked }))} />
                            <label className="text-sm">Mark as Preview Video</label>
                        </div>

                        {/* Progress Bar */}
                        {loading && (
                            <div className="space-y-2">
                                <div className="w-full bg-gray-200 rounded-full h-2.5">
                                    <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${progress}%` }} />
                                </div>
                                <p className="text-sm text-gray-600 text-center">Uploading... {Math.round(progress)}%</p>
                            </div>
                        )}

                        {/* Upload History */}
                        {existingContent.length > 0 && (
                            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                                <h3 className="text-lg font-semibold mb-2">Uploaded Content</h3>
                                <div className="space-y-2">
                                    {existingContent.map((item, idx) => (
                                        <div key={idx} className="flex justify-between items-center p-2 bg-white rounded border">
                                            <div>
                                                <span className="font-medium">{item.lecture}</span>
                                                <span className="text-sm text-gray-500 ml-2">({item.type} - {item.isPreview ? 'Preview' : 'Regular'})</span>
                                            </div>
                                            <span className="text-sm text-gray-400">{item.date}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-end mt-6">
                        <button onClick={handleSubmit} disabled={loading} className="bg-blue-600 text-white px-6 py-2 rounded-full font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed">
                            {loading ? 'Uploading...' : 'Add Content'}
                        </button>
                    </div>

                </div>
            </Modal>

            <div className='mt-5'>
                <CourseContentDetails courseDetails={courseDetails} searchQuery={searchQuery} refreshData={coursesByTeacher} />
            </div>
        </>
    );
};

export default CourseContent;

// -------------------------
// Child component
// -------------------------

const CourseContentDetails: React.FC<{ courseDetails?: CourseDetailItem[]; refreshData?: () => void; searchQuery?: string }> = ({ courseDetails = [], refreshData, searchQuery = '' }) => {
    const [selectedFile, setSelectedFile] = useState<string | null>(null);
    const [showVideoPopup, setShowVideoPopup] = useState<boolean>(false);
    const [showDeletePopup, setShowDeletePopup] = useState<boolean>(false);
    const [deletedId, setDeletedId] = useState<string | number | null | undefined>(null);


    const BASE_URL = process.env.REACT_APP_BASEURL || '';

    const playVideos = (item: CourseDetailItem) => {
        const url = `${BASE_URL}/lms/upload-chunk/${item?.id}/hls/`;
        const config = { headers: { accept: 'application/json' } };
        axios.get(url, config)
            .then(res => {
                if (res.data) {
                    setSelectedFile(res.data['presigned_url']);
                }
            })
            .catch(err => {
                toast.error(err?.message || 'Error fetching video url');
            });

        setShowVideoPopup(true);
    };

    const handleDeletedContent = async (id: number | string) => {
        try {
            const res = await TeacherApiService.deleteCourseContent(id);
            if (res?.success) {
                toast.success(res.message || 'Deleted');
                refreshData && refreshData();
            } else {
                toast.error(res?.message || 'Delete failed');
            }
        } catch (error: any) {
            toast.error(error?.message || 'Delete failed');
        }
    };

    const filteredDetails = (courseDetails || []).filter(item => {
        const searchLower = (searchQuery || '').toLowerCase();
        return (
            (item.course || '').toString().toLowerCase().includes(searchLower) ||
            (item.module || '').toString().toLowerCase().includes(searchLower) ||
            (item.sub_module || '').toString().toLowerCase().includes(searchLower)
        );
    });

    return (
        <>
            {showDeletePopup && (
                <DeleteCoursePopup setShowDeletePopup={setShowDeletePopup} handleCourseDelete={handleDeletedContent} deletedId={deletedId} />
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6 ">
                {filteredDetails?.length > 0 ? (
                    filteredDetails.map((item, index) => (
                        <div key={String(item.id ?? index)} className="rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                            {item?.is_uploaded && (
                                <div
                                    className="relative h-48 bg-gray-800 cursor-pointer group"
                                    onClick={() => playVideos(item)}
                                    style={{ backgroundImage: `url(${item.thumbnail_image})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
                                >
                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                                        <button className="text-white hover:text-blue-400 transition-colors"><FaPlay className="text-2xl" /></button>
                                    </div>
                                </div>
                            )}

                            <div className="p-3 space-y-2">
                                <h1 className="text-xl font-bold text-gray-800 truncate">{item.course}</h1>
                                <div className="flex items-center text-gray-600">
                                    <FaBook className="mr-3 text-blue-500 flex-shrink-0" />
                                    <span className="font-medium">Module:</span>
                                    <span className="ml-2 truncate">{item.module}</span>
                                </div>

                                <div className="flex items-center text-gray-600">
                                    <FaVideo className="mr-3 text-blue-500 flex-shrink-0" />
                                    <span className="font-medium">Lecture:</span>
                                    <span className="ml-2 truncate">{item.sub_module}</span>
                                </div>

                                <div className="flex items-center text-gray-500 text-sm">
                                    <FaClock className="mr-3 text-purple-500 flex-shrink-0" />
                                    <span>Created:</span>
                                    <span className="ml-2">{item.created_at ? new Date(item.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : ''}</span>
                                </div>
                            </div>

                            <div className="px-6 py-2 flex items-center justify-end ">
                                <button className="text-red-500 hover:text-red-700" onClick={() => { setDeletedId(item?.id); setShowDeletePopup(true); }}>
                                    <RiDeleteBin6Line size={20} />
                                </button>
                            </div>
                        </div>
                    ))
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
                                    <p className="mt-4">No course content available</p>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {selectedFile && showVideoPopup && (
                <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl shadow-2xl overflow-hidden max-w-4xl w-full">
                        <div className="flex justify-end p-2 bg-gray-50">
                            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors" onClick={() => { setSelectedFile(null); setShowVideoPopup(false); }}>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <div className="p-4">
                            <HLSVideoPlayer url={selectedFile} />
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};




// 'use client'
// import React, { useEffect, useRef, useState } from 'react';
// import { Modal, Button } from 'antd';
// import { useSelector } from 'react-redux';
// import { FaBook, FaClock, FaPlay, FaVideo } from "react-icons/fa";
// import axios from "axios";
// import { RiDeleteBin6Line } from 'react-icons/ri';
// import toast from 'react-hot-toast';
// import DeleteCoursePopup from './DeleteCoursePopup';
// import HLSVideoPlayer from '@/components/common/HLSVideoPlayer';
// import TeacherApiService from '@/services/teacherApi';
// import { selectAuth } from '@/store/features/authSlice';

// function CourseContent() {
//     const { user } = useSelector(selectAuth);
//     const userDetails = user;
//     const [showModal, setShowModal] = useState(false);
//     const [courseModules, setCourseModules] = useState([]);
//     const [categoryList, setCategoryList] = useState([]);
//     const [moduleIndex, setModuleIndex] = useState(0);
//     const [progress, setProgress] = useState(0);
//     const [moduleSubList, setModuleSubList] = useState([]);

//     const fileInputRef = useRef(null);
//     const [courseInformation, setCourseInformation] = useState({
//         course: "",
//         file: "",
//         file_type: "",
//         moduleName: "",
//         lectureName: "",
//         thumbnail_image: "",
//         is_preview_video: false

//     });
//     const [loading, setLoading] = useState(false);
//     const [file, setFile] = useState(null);
//     const [existingContent, setExistingContent] = useState([]);
//     const [courseDetails, setCourseDetails] = useState([])
//     const [searchQuery, setSearchQuery] = useState('');
//     const [thumbnailImg, setthumbnailImg] = useState(null);
//     const [preview, setPreview] = useState(null);

//     const handleImageChange = (e) => {
//         const file = e.target.files[0];
//         setthumbnailImg(file)
//         setPreview(URL.createObjectURL(file));
//     }

//     const coursesByTeacher = async () => {
//         try {
//             const res = await TeacherApiService.getCoursesFilesByUser(userDetails.id);
//             if (res) {
//                 setCourseDetails(res)

//             }
//         } catch (error) {
//             toast.error("Error fetching teacher courses");
//         }
//     };

//     useEffect(() => {
//         if (userDetails?.id) {
//             coursesByTeacher();

//         }
//     }, [userDetails?.id]);

//     useEffect(() => {
//         TeacherApiService.getCoursesByUserTwo(userDetails?.id).then((res) => {
//             setCategoryList(
//                 res?.data.filter(
//                     (course) =>
//                         course.type.toLowerCase() === "public" ||
//                         course.type.toLowerCase() === "free"
//                 )
//             );
//         });
//     }, []);

//     const handleOpenModal = () => setShowModal(true);

//     const handleCloseModal = () => {
//         setShowModal(false);
//         resetState();
//         setCourseInformation({
//             course: "",
//             file: "",
//             file_type: "",
//             moduleName: "",
//             lectureName: "",
//             thumbnail_image: "",
//             is_preview_video: false
//         });
//         setCourseModules([]);
//         setModuleSubList([]);
//         setExistingContent([]);
//     };

//     const onClickSelectCourse = (index) => {
//         if (index === -1) {
//             setCourseModules([]);
//             return;
//         }
//         setModuleIndex(index);
//         setCourseModules(categoryList[index]?.modules || []);
//         setExistingContent([]);
//     };

//     const onClickSelectModule = (index) => {
//         const selectedModule = courseModules[index];
//         setModuleSubList(selectedModule?.lecture || []);
//         setExistingContent([]);
//     };

//     const uploadFileInChunks = async (file) => {
//         const chunkSize = 50 * 1024 * 1024;
//         const totalChunks = Math.ceil(file.size / chunkSize);
//         const uploadId = new Date().getTime();
//         let totalBytesUploaded = 0;

//         const uploadChunk = async (chunk, chunkNumber) => {
//             const formData = new FormData();
//             formData.append("chunk", chunk);
//             formData.append("chunkNumber", chunkNumber);
//             formData.append("uploadId", uploadId);
//             formData.append("totalChunks", totalChunks);

//             try {
//                 const response = await fetch(
//                     `${process.env.REACT_APP_BASEURL}lms/upload-chunk/upload-chunk/`,
//                     {
//                         method: "POST",
//                         headers: {
//                             Authorization: `Bearer ${localStorage.getItem('token')}`,
//                         },
//                         body: formData,
//                     }
//                 );

//                 totalBytesUploaded += chunk.size;
//                 const currentProgress = Math.round((totalBytesUploaded / file.size) * 100);
//                 setProgress(currentProgress);
//                 return response.json();
//             } catch (error) {
//                 toast.error("Error uploading chunk");
//                 throw error;
//             }
//         };

//         const promises = [];
//         for (let i = 0; i < totalChunks; i++) {
//             const chunk = file.slice(i * chunkSize, (i + 1) * chunkSize);
//             promises.push(uploadChunk(chunk, i));
//         }

//         return Promise.all(promises)
//             .then(results => ({
//                 chunkSize,
//                 res: results,
//                 uploadId,
//                 totalChunks
//             }));
//     };

//     const handleSubmit = async () => {
//         if (!courseInformation.course) {
//             toast.error("Please select a course");
//             return;
//         }
//         if (!courseInformation.moduleName) {
//             toast.error("Please select a module");
//             return;
//         }
//         if (!courseInformation.lectureName) {
//             toast.error("Please select a lecture");
//             return;
//         }
//         if (!file) {
//             toast.error("Please select a file");
//             return;
//         }

//         setLoading(true);
//         setProgress(0);

//         try {
//             const fileType = file.type;
//             let fileCategory = fileType.startsWith("video/") ? "video" : "pdf";

//             const uploadResult = await uploadFileInChunks(file);
//             if (!uploadResult) throw new Error("Upload failed");

//             const formData = new FormData();
//             formData.append("upload_id", uploadResult.uploadId);
//             formData.append("module", courseInformation.moduleName);
//             formData.append("course_id", courseInformation.course);
//             formData.append("lecture", courseInformation.lectureName);
//             formData.append("is_preview_video", courseInformation.is_preview_video);
//             formData.append("file_type", fileCategory);
//             formData.append("thumbnail_image", thumbnailImg);

//             if (fileCategory === "video") {
//                 await fetch(`${process.env.REACT_APP_BASEURL}lms/upload-chunk/merge-chunks/`, {
//                     method: "POST",
//                     headers: {
//                         Authorization: `Bearer ${localStorage.getItem("userAuth")}`,
//                     },
//                     body: formData,
//                 });
//             } else {
//                 await TeacherApiService.getCourseContent(formData);
//             }

//             setExistingContent(prev => [...prev, {
//                 lecture: courseInformation.lectureName,
//                 type: fileCategory,
//                 isPreview: courseInformation.is_preview_video,
//                 date: new Date().toLocaleString()
//             }]);

//             toast.success("Content uploaded successfully!");
//             coursesByTeacher();
//             resetState();
//         } catch (error) {
//             toast.error("Error uploading content");
//         } finally {
//             setLoading(false);
//         }
//     };

//     const resetState = () => {
//         setFile(null);
//         setCourseInformation(prev => ({
//             ...prev,
//             file: "",
//             file_type: "",
//             lectureName: "",
//             thumbnail_image: "",
//             is_preview_video: false
//         }));
//         if (fileInputRef.current) fileInputRef.current.value = "";
//         setProgress(0);
//     };

//     const handleFileChange = (e) => {
//         const file = e.target.files[0];
//         if (!file) return;

//         const validTypes = ["video/mp4", "application/pdf"];
//         if (!validTypes.includes(file.type)) {
//             toast.error("Invalid file type. Only MP4 and PDF allowed");
//             return;
//         }

//         setFile(file);
//         setCourseInformation(prev => ({
//             ...prev,
//             file: file.name,
//             file_type: file.type.startsWith("video/") ? "video" : "pdf"
//         }));
//     };

//     return (
//         <>
//             <div className='flex items-center justify-end  gap-[16rem] '>
//                 <h4>Course Content</h4>
//                 <input
//                     type='text'
//                     placeholder='Search course content...'
//                     value={searchQuery}
//                     onChange={(e) => setSearchQuery(e.target.value)}
//                     className="w-[20rem] px-4 py-1 border rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
//                 />
//                 <Button
//                     type="primary"
//                     onClick={handleOpenModal}
//                     className="add-content-btn "
//                 >
//                     Add Course Content
//                 </Button>
//             </div>


//             <Modal
//                 centered
//                 width={700}
//                 visible={showModal}
//                 title={<span className="text-2xl pl-4 font-semibold">Add Course Content</span>}
//                 onCancel={handleCloseModal}
//                 footer={null}
//             >
//                 <div className="border-t-2 border-gray-200 mt-2 pt-3 px-4" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
//                     <div className="space-y-4">
//                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                             {/* Course Selection */}
//                             <div>
//                                 <label className="block text-sm font-medium mb-1">
//                                     Course <span className="text-red-500">*</span>
//                                 </label>
//                                 <select
//                                     className="w-full p-2 border rounded"
//                                     onChange={(e) => {
//                                         const index = e.target.selectedIndex - 1;
//                                         onClickSelectCourse(index);
//                                         setCourseInformation(prev => ({
//                                             ...prev,
//                                             course: e.target.value,
//                                             moduleName: "",
//                                             lectureName: ""
//                                         }));
//                                     }}
//                                     value={courseInformation.course}
//                                 >
//                                     <option value="">Select Course</option>
//                                     {categoryList?.map((course, index) => (
//                                         <option key={index} value={course.id}>{course.title}</option>
//                                     ))}
//                                 </select>
//                             </div>

//                             {/* Module Selection */}
//                             <div>
//                                 <label className="block text-sm font-medium mb-1">
//                                     Module <span className="text-red-500">*</span>
//                                 </label>
//                                 <select
//                                     className="w-full p-2 border rounded"
//                                     onChange={(e) => {
//                                         const index = e.target.selectedIndex - 1;
//                                         onClickSelectModule(index);
//                                         setCourseInformation(prev => ({
//                                             ...prev,
//                                             moduleName: e.target.value,
//                                             lectureName: ""
//                                         }));
//                                     }}
//                                     value={courseInformation.moduleName}
//                                     disabled={!courseInformation.course}
//                                 >
//                                     <option value="">Select Module</option>
//                                     {courseModules.map((module, index) => (
//                                         <option key={index} value={module.module}>{module.module}</option>
//                                     ))}
//                                 </select>
//                             </div>

//                             {/* Lecture Selection */}
//                             <div>
//                                 <label className="block text-sm font-medium mb-1">
//                                     Lecture <span className="text-red-500">*</span>
//                                 </label>
//                                 <select
//                                     className="w-full p-2 border rounded"
//                                     onChange={(e) => setCourseInformation(prev => ({
//                                         ...prev,
//                                         lectureName: e.target.value
//                                     }))}
//                                     value={courseInformation.lectureName}
//                                     disabled={!courseInformation.moduleName}
//                                 >
//                                     <option value="">Select Lecture</option>
//                                     {moduleSubList.map((lecture, index) => (
//                                         <option key={index} value={lecture.name}>{lecture.name}</option>
//                                     ))}
//                                 </select>
//                             </div>

//                             {/* File Upload */}
//                             <div>
//                                 <label className="block text-sm font-medium mb-1">
//                                     File <span className="text-red-500">*</span>
//                                 </label>
//                                 <input
//                                     ref={fileInputRef}
//                                     type="file"
//                                     className="w-full p-2 border rounded"
//                                     accept=".mp4,.pdf"
//                                     onChange={handleFileChange}
//                                     disabled={loading}
//                                 />
//                             </div>

//                             <div>
//                                 <label className="block text-sm font-medium mb-1">
//                                     Thumbnail <span className="text-red-500">*</span>
//                                 </label>
//                                 {preview && <img src={preview} alt="Preview" className="w-48 h-48 object-cover rounded-md" />}
//                                 <input
//                                     type="file"
//                                     className="w-full p-2 border rounded"
//                                     accept="image/*"
//                                     onChange={handleImageChange}
//                                     required // Add required attribute if needed
//                                 />
//                             </div>


//                         </div>

//                         {/* Preview Video Checkbox */}
//                         <div className="flex items-center gap-2">
//                             <input
//                                 type="checkbox"
//                                 checked={courseInformation.is_preview_video}
//                                 onChange={(e) => setCourseInformation(prev => ({
//                                     ...prev,
//                                     is_preview_video: e.target.checked
//                                 }))}
//                             />
//                             <label className="text-sm">
//                                 Mark as Preview Video
//                             </label>
//                         </div>

//                         {/* Progress Bar */}
//                         {loading && (
//                             <div className="space-y-2">
//                                 <div className="w-full bg-gray-200 rounded-full h-2.5">
//                                     <div
//                                         className="bg-blue-600 h-2.5 rounded-full"
//                                         style={{ width: `${progress}%` }}
//                                     ></div>
//                                 </div>
//                                 <p className="text-sm text-gray-600 text-center">
//                                     Uploading... {Math.round(progress)}%
//                                 </p>
//                             </div>
//                         )}

//                         {/* Upload History */}
//                         {existingContent.length > 0 && (
//                             <div className="mt-4 p-4 bg-gray-50 rounded-lg">
//                                 <h3 className="text-lg font-semibold mb-2">Uploaded Content</h3>
//                                 <div className="space-y-2">
//                                     {existingContent?.map((item, index) => (
//                                         <div key={index} className="flex justify-between items-center p-2 bg-white rounded border">
//                                             <div>
//                                                 <span className="font-medium">{item.lecture}</span>
//                                                 <span className="text-sm text-gray-500 ml-2">
//                                                     ({item.type} - {item.isPreview ? 'Preview' : 'Regular'})
//                                                 </span>
//                                             </div>
//                                             <span className="text-sm text-gray-400">{item.date}</span>
//                                         </div>
//                                     ))}
//                                 </div>
//                             </div>
//                         )}
//                     </div>

//                     {/* Submit Button */}
//                     <div className="flex justify-end mt-6">
//                         <button
//                             onClick={handleSubmit}
//                             disabled={loading}
//                             className="bg-blue-600 text-white px-6 py-2 rounded-full font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
//                         >
//                             {loading ? 'Uploading...' : 'Add Content'}
//                         </button>
//                     </div>
//                 </div>
//             </Modal>

//             <div className='mt-5'>
//                 <CourseContentDetails
//                     courseDetails={courseDetails}
//                     searchQuery={searchQuery}
//                     refreshData={coursesByTeacher}
//                 />
//             </div>

//         </>
//     );
// }

// export default CourseContent;

// const CourseContentDetails = ({ courseDetails, refreshData, searchQuery }) => {
//     const [selectedFile, setSelectedFile] = useState(null);
//     const [showVideoPopup, setShowVideoPopup] = useState(false);
//     const [showDeletePopup, setShowDeletePopup] = useState(false);
//     const [deletedId, setDeletedId] = useState(null);

//     const BASE_URL = process.env.REACT_APP_BASEURL;
//     // const token = JSON.parse(localStorage.getItem("userAuth"));
//     const playVideos = (item) => {
//         const url = `${BASE_URL}/lms/upload-chunk/${item?.id}/hls/`;
//         const config = {
//             headers: {
//                 accept: "application/json",
//                 // "X-CSRFTOKEN": userDetails?.csrftoken,
//             },
//         };
//         axios
//             .get(url, config)
//             .then((res) => {
//                 if (res.data) {
//                     setSelectedFile(res.data['presigned_url']);
//                 }
//             })
//             .catch((err) => {
//                 toast.error(err.message);
//             });

//         setShowVideoPopup(true);
//     };

//     const handleDeletedContent = async (id) => {
//         try {
//             const res = await TeacherApiService.deleteCourseContent(id);
//             if (res?.success) {
//                 toast.success(res.message);
//                 refreshData(); // Refresh parent data after deletion
//             } else {
//                 toast.error(res?.message);
//             }
//         } catch (error) {
//             toast.error(error.message);
//         }
//     };
//     const filteredDetails = courseDetails?.filter(item => {
//         const searchLower = searchQuery.toLowerCase();
//         return (
//             item.course?.toLowerCase().includes(searchLower) ||
//             item.module?.toLowerCase().includes(searchLower) ||
//             item.sub_module?.toLowerCase().includes(searchLower)
//         );
//     });
//     return (
//         <>
//             {showDeletePopup && (
//                 <DeleteCoursePopup
//                     setShowDeletePopup={setShowDeletePopup}
//                     handleCourseDelete={handleDeletedContent}
//                     deletedId={deletedId}
//                 />
//             )}

//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6 ">
//                 {filteredDetails?.length > 0 ? (
//                     filteredDetails.map((item, index) => (
//                         <div
//                             key={index}
//                             className="rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
//                         >
//                             {/* Video Thumbnail Section */}
//                             {item?.is_uploaded && (

//                                 <div
//                                     className="relative h-48 bg-gray-800 cursor-pointer group"
//                                     onClick={() => playVideos(item)}
//                                     style={{
//                                         backgroundImage: `url(${item.thumbnail_image})`,
//                                         backgroundSize: 'cover',
//                                         backgroundPosition: 'center',
//                                     }}
//                                 >

//                                     {/* Top Section with Play Button */}
//                                     <div className="absolute top-1/2 left-1/2 ">
//                                         <button className="text-white hover:text-blue-400 transition-colors">
//                                             <FaPlay className="text-2xl" />
//                                         </button>
//                                     </div>


//                                 </div>
//                             )}

//                             {/* Rest of the card content remains the same */}
//                             <div className="p-3 space-y-2">
//                                 <h1 className="text-xl font-bold text-gray-800 truncate">
//                                     {item.course}
//                                 </h1>

//                                 <div className="flex items-center text-gray-600">
//                                     <FaBook className="mr-3 text-blue-500 flex-shrink-0" />
//                                     <span className="font-medium">Module:</span>
//                                     <span className="ml-2 truncate">{item.module}</span>
//                                 </div>

//                                 <div className="flex items-center text-gray-600">
//                                     <FaVideo className="mr-3 text-blue-500 flex-shrink-0" />
//                                     <span className="font-medium">Lecture:</span>
//                                     <span className="ml-2 truncate">{item.sub_module}</span>
//                                 </div>

//                                 <div className="flex items-center text-gray-500 text-sm">
//                                     <FaClock className="mr-3 text-purple-500 flex-shrink-0" />
//                                     <span>Created:</span>
//                                     <span className="ml-2">
//                                         {new Date(item.created_at).toLocaleDateString("en-US", {
//                                             year: "numeric",
//                                             month: "long",
//                                             day: "numeric",
//                                         })}
//                                     </span>
//                                 </div>
//                             </div>

//                             {/* Delete Button */}
//                             <div className="px-6 py-2 flex items-center justify-end ">
//                                 <button
//                                     className="text-red-500 hover:text-red-700"
//                                     onClick={() => {
//                                         setDeletedId(item?.id);
//                                         setShowDeletePopup(true);
//                                     }}
//                                 >
//                                     <RiDeleteBin6Line size={20} />
//                                 </button>
//                             </div>
//                         </div>
//                     ))
//                 ) : (
//                     <div className="col-span-full text-center py-12">
//                         <div className="text-gray-500 text-xl font-medium">
//                             {searchQuery ? (
//                                 <>
//                                     <span className="text-3xl">🔍</span>
//                                     <p className="mt-4">No results found for "{searchQuery}"</p>
//                                 </>
//                             ) : (
//                                 <>
//                                     <span className="text-3xl">📭</span>
//                                     <p className="mt-4">No course content available</p>
//                                 </>
//                             )}
//                         </div>
//                     </div>
//                 )}
//             </div>


//             {selectedFile && showVideoPopup && (
//                 <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
//                     <div className="bg-white rounded-xl shadow-2xl overflow-hidden max-w-4xl w-full">
//                         <div className="flex justify-end p-2 bg-gray-50">
//                             <button
//                                 className="p-2 hover:bg-gray-100 rounded-full transition-colors"
//                                 onClick={() => {
//                                     setSelectedFile(null);
//                                     setShowVideoPopup(false);
//                                 }}
//                             >
//                                 <svg
//                                     xmlns="http://www.w3.org/2000/svg"
//                                     className="h-6 w-6 text-gray-600"
//                                     fill="none"
//                                     viewBox="0 0 24 24"
//                                     stroke="currentColor"
//                                 >
//                                     <path
//                                         strokeLinecap="round"
//                                         strokeLinejoin="round"
//                                         strokeWidth={2}
//                                         d="M6 18L18 6M6 6l12 12"
//                                     />
//                                 </svg>
//                             </button>
//                         </div>
//                         <div className="p-4">
//                             <HLSVideoPlayer url={selectedFile} />
//                         </div>
//                     </div>
//                 </div>
//             )}
//         </>
//     )
// }