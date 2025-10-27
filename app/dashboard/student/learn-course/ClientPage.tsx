'use client'
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";
import { RiArrowDownSLine, RiArrowRightSLine } from "react-icons/ri";
import { PlayCircleFilled } from "@ant-design/icons";

import { selectBatchCourse, selectCourseDetails } from "@/store/features/courseSlice";
import StudentApiService from "@/services/studentApi";
import HLSVideoPlayer from "@/components/common/HLSVideoPlayer";
import S3FileViewer from "@/components/Students/MyLearnings/FileViewer/S3FileViewer";

/**
 * NOTE:
 * - Adjust the imported paths if your project layout differs.
 * - If StudentApiService methods return other shaped responses, update the interfaces below.
 */

/* ----------------------------- Types & Interfaces ----------------------------- */

type Nullable<T> = T | null;

interface SubModule {
    file?: string | null;
    thumbnail?: string | null;
    "sub-module-name"?: string;
    supporting_file?: string | null;
    // any other fields you have in sub-modules
}

interface Lecture {
    id: string;
    name: string;
    // ...
    "sub-module-name-crossed"?: boolean;
}

interface CourseModule {
    module: string;
    lecture: Lecture[];
    "sub-modules": SubModule[];
}

interface Progress {
    id?: number | string;
    progress?: string; // eg "100.00"
    video_status?: string[]; // list of file ids or urls
    // other fields if any
}

interface SelectedContent {
    moduleIndex: number;
    contentIndex: number;
}

/* ----------------------------- Component ----------------------------- */

const LearnCourse: React.FC = () => {
    const selectedCourse = useSelector(selectCourseDetails) as any; // keep any if selector has custom type
    const batchCourse = useSelector(selectBatchCourse) as any; // keep any if selector has custom type

    // console.log("mylearning", selectedCourse)
    // console.log("batch", batchCourse)
    const course_id: Nullable<number | string> =
        selectedCourse?.course?.id ??
        selectedCourse?.id ??
        batchCourse?.id ??
        null;

    const student_id: Nullable<number | string> =
        selectedCourse?.student ??
        localStorage.getItem('id') ??
        null;


    const router = useRouter();

    // Component state
    const [showModuleContent, setShowModuleContent] = useState<number[]>([]);
    const [selectedContent, setSelectedContent] = useState<Nullable<SelectedContent>>(null);
    const [showAssignment, setShowAssignment] = useState(false);
    const [submitCheck, setSubmitCheck] = useState<string | null>(null);
    const [name, setName] = useState("");
    const [videoThumbnail, setVideoThumbnail] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<string | null>(null); // presigned_url from server
    const [progress, setProgress] = useState<Progress>({});
    const [courseModules, setCourseModules] = useState<CourseModule[]>([]);
    const [VideoFileId, setVideoFileId] = useState<string | null>(null);
    const [isVideoPlaying, setIsVideoPlaying] = useState(false);
    const [onMarkShowCertificate, setOnMarkShowCertificate] = useState(false);
    const [showCertificatePopup, setShowCertificatePopup] = useState(false);

    // `questions` was referenced in original — if you actually have them, replace this stub.
    // For now, keep an empty list to avoid runtime errors. If you do have real questions,
    // inject them here (e.g. from props or fetched data).
    const questions: { que: string; ans: string[] }[] = [];

    const [answerValue, setAnswerValue] = useState<(string | null)[]>(
        new Array(questions.length).fill(null)
    );

    const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

    /* ----------------------------- Helpers ----------------------------- */

    const playVideos = useCallback(
        async (fileId?: string | null) => {
            if (!fileId) {
                setSelectedFile(null);
                return;
            }
            const url = `${BASE_URL}/lms/upload-chunk/${fileId}/hls/`;
            try {
                const res = await axios.get(url, {
                    headers: {
                        accept: "application/json",
                    },
                });
                if (res?.data) {
                    setSelectedFile(res.data["presigned_url"] ?? null);
                } else {
                    setSelectedFile(null);
                }
            } catch (err: any) {
                toast.error(err?.message ?? "Failed to fetch video URL");
                setSelectedFile(null);
            }
        },
        [BASE_URL]
    );

    const getContentByLecture = useCallback(
        (name: string, subModule: SubModule[]) => {
            if (!Array.isArray(subModule)) return null;
            const index = subModule.findIndex((item) => {
                if (!item || !item["sub-module-name"]) return false;
                return item["sub-module-name"].toLowerCase() === name.toLowerCase();
            });
            return index !== -1 ? [index, subModule[index]] as const : null;
        },
        []
    );

    const isVideoAlreadyCompleted = useCallback(
        (moduleIndex: number, contentIndex: number, name: string) => {
            if (!courseModules?.[moduleIndex] || !Array.isArray(progress?.video_status)) return false;
            const values = getContentByLecture(name, courseModules[moduleIndex]["sub-modules"] || []);
            if (!values) return false;
            const file = values[1].file;
            if (!file) return false;
            return progress.video_status.includes(file);
        },
        [courseModules, progress, getContentByLecture]
    );

    /* ----------------------------- Data Fetching ----------------------------- */

    const fetchData = useCallback(async () => {
        if (!course_id || !student_id) {
            // don't fetch until we have IDs
            return;
        }

        try {
            // 1. get progress
            const progressResponse = await StudentApiService.getProgressByCourseIdAndStudentId(
                course_id,
                student_id
            );
            const progressData: Progress = progressResponse?.data ?? {};
            setProgress(progressData);

            setOnMarkShowCertificate(progressData?.progress === "100.00");

            // 2. get course modules
            const modulesResponse = await StudentApiService.getCourseModulesByCourseId(course_id);
            const courseModulesData: CourseModule[] = modulesResponse?.data ?? [];

            // default selection: first available sub-module content (if selectedContent is null)
            if (!selectedContent && courseModulesData?.length > 0) {
                const firstModule = courseModulesData[0];
                const firstLecture = firstModule?.["sub-modules"]?.[0] ?? null;
                handleContentSelection(0, 0, firstLecture);
            }

            // open first module by default
            handleModule(0);

            // mark crossed sub-modules based on progress (map)
            const updatedModules = courseModulesData.map((module) => ({
                ...module,
                "sub-modules": (module["sub-modules"] || []).map((subModule) => ({
                    ...subModule,
                    // add computed flag
                    "sub-module-name-crossed":
                        Array.isArray(progressData?.video_status) &&
                        progressData.video_status.includes(subModule.file ?? ""),
                })),
            }));

            setCourseModules(updatedModules);
        } catch (err:any) {
            // graceful failure
            console.error("Error fetching data:", err);
            toast.success(err?.message)
        }
    }, [course_id, student_id, selectedContent]);

    useEffect(() => {
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [course_id, student_id]);

    /* ----------------------------- UI Handlers ----------------------------- */

    const handleModule = (index: number) => {
        setShowModuleContent((prev) => (prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]));
    };

    const handleContentSelection = (
        moduleIndexOrObj: number | { moduleIndex: number; contentIndex: number; content?: SubModule | null },
        maybeContentIndex?: number,
        maybeContent?: SubModule | null
    ) => {
        // support both call styles in your original code
        let moduleIndex: number;
        let contentIndex: number;
        let content: SubModule | null = null;

        if (typeof moduleIndexOrObj === "object") {
            moduleIndex = moduleIndexOrObj.moduleIndex;
            contentIndex = moduleIndexOrObj.contentIndex;
            content = (moduleIndexOrObj as any).content ?? null;
        } else {
            moduleIndex = moduleIndexOrObj;
            contentIndex = maybeContentIndex ?? 0;
            content = maybeContent ?? null;
        }

        setIsVideoPlaying(false);
        setSelectedContent({ moduleIndex, contentIndex });
        setVideoFileId(content?.file ?? null);
        setVideoThumbnail(content?.thumbnail ?? null);
        if (content?.file) {
            playVideos(content.file);
        } else {
            setSelectedFile(null);
        }
    };

    const handleNavigation = (direction: -1 | 1) => {
        setIsVideoPlaying(false);
        if (!selectedContent) return;

        const { moduleIndex, contentIndex } = selectedContent;
        const newContentIndex = contentIndex + direction;

        // previous
        if (direction === -1) {
            if (newContentIndex >= 0) {
                const lecture = courseModules[moduleIndex].lecture[newContentIndex];
                const value = getContentByLecture(lecture.name, courseModules[moduleIndex]["sub-modules"]);
                handleContentSelection(moduleIndex, newContentIndex, value ? value[1] : null);
            } else if (moduleIndex - 1 >= 0) {
                const prevModule = courseModules[moduleIndex - 1];
                const lecture = prevModule.lecture[prevModule.lecture.length - 1];
                const value = getContentByLecture(lecture.name, prevModule["sub-modules"]);
                if (!showModuleContent.includes(moduleIndex - 1)) handleModule(moduleIndex - 1);
                handleContentSelection(moduleIndex - 1, prevModule.lecture.length - 1, value ? value[1] : null);
            }
            return;
        }

        // next
        if (direction === 1) {
            if (newContentIndex < (courseModules[moduleIndex]?.lecture?.length ?? 0)) {
                const lecture = courseModules[moduleIndex].lecture[newContentIndex];
                const value = getContentByLecture(lecture.name, courseModules[moduleIndex]["sub-modules"]);
                handleContentSelection(moduleIndex, newContentIndex, value ? value[1] : null);
            } else if (moduleIndex + 1 < courseModules.length) {
                const nextModule = courseModules[moduleIndex + 1];
                const lecture = nextModule.lecture[0];
                const value = getContentByLecture(lecture.name, nextModule["sub-modules"]);
                if (!showModuleContent.includes(moduleIndex + 1)) handleModule(moduleIndex + 1);
                handleContentSelection(moduleIndex + 1, 0, value ? value[1] : null);
            }
            return;
        }
    };

    const markAsCompleted = async (moduleIndex: number, contentIndex: number) => {
        if (!VideoFileId) {
            toast.error("There is no video available for this section, so you cannot mark it as completed.");
            return;
        }

        if (!progress?.id || !course_id || !student_id) {
            toast.error("Missing identifiers to update progress.");
            return;
        }

        try {
            const response = await StudentApiService.updateProgress(progress.id, course_id, student_id, VideoFileId);
            // many APIs wrap result as response.data or response.success; handle both common shapes:
            const success = !!(response?.success ?? response?.data?.success ?? true);
            const data = response?.data ?? response;
            if (success) {
                if (data?.progress === "100.00") {
                    setShowCertificatePopup(true);
                } else {
                    setShowCertificatePopup(false);
                }
                toast.success("Progress updated successfully!");
                // refresh modules/progress
                fetchData();
            } else {
                toast.error("Failed to update progress.");
            }
        } catch (err: any) {
            // console.error(err)
            toast.error(err?.message ?? "An error occurred while updating progress.");
        }
    };

    const handleOptionChange = (index: number, value: string) => {
        setAnswerValue((prev) => {
            const copy = [...prev];
            copy[index] = value;
            return copy;
        });
    };

    const onHandleGoCertificate = () => {
        router.push("/dashboard/student/Certificates");
    };

    /* ----------------------------- Derived / Safe values ----------------------------- */

    const selectedModuleName = useMemo(() => {
        if (!selectedContent) return "";
        const module = courseModules[selectedContent.moduleIndex];
        const lecture = module?.lecture?.[selectedContent.contentIndex];
        return lecture?.name ?? "";
    }, [selectedContent, courseModules]);

    /* ----------------------------- Render ----------------------------- */

    return (
        <>
            {showAssignment ? (
                <div>
                    <div className="border-b-2 border-gray-400 my-4 pb-2 flex gap-5">
                        <div className="mb-3">
                            <button onClick={() => setShowAssignment(false)} className="text-blue-600">
                                Back
                            </button>
                        </div>
                        <div className="flex flex-col gap-1">
                            <div>Module 1 Assessment</div>
                            <div style={{ fontSize: "12px" }}>
                                Graded Quiz. • 30 min. • 15 total points available.15 total points
                            </div>
                        </div>
                        <div style={{ fontSize: "12px" }}>
                            <span className="text-blue-600">Due:</span> Jul 17, 11:59 PM PDT
                        </div>
                    </div>

                    <div className="flex flex-col gap-5">
                        {questions?.map((que, index) => (
                            <div className="flex justify-between" key={index}>
                                <div className="flex flex-col gap-4">
                                    <div>{`${index + 1}.  ${que.que}`}</div>
                                    {que.ans.map((ans, ind) => (
                                        <div key={ind} className="flex gap-2 items-center ms-4">
                                            <input
                                                type="radio"
                                                value={ans}
                                                checked={answerValue[index] === ans}
                                                onChange={() => handleOptionChange(index, ans)}
                                            />
                                            <div>{ans}</div>
                                        </div>
                                    ))}
                                </div>
                                <div className="bg-blue-400 h-9 rounded text-white p-2">1 Point</div>
                            </div>
                        ))}
                    </div>

                    <div className="my-5 flex flex-col gap-3">
                        <div className="flex gap-3 items-start">
                            <input
                                type="checkbox"
                                value="option1"
                                checked={submitCheck === "option1"}
                                onChange={(e) => setSubmitCheck(e.target.value)}
                            />
                            <div>
                                I understand that submitting work that isn’t my own may result in permanent
                                failure of this course or deactivation of my TeacherCool account.
                            </div>
                        </div>
                        <input
                            type="text"
                            className="w-[20rem] p-2 border-2"
                            value={name}
                            placeholder="Enter your legal name"
                            onChange={(e) => setName(e.target.value)}
                        />
                        <div className="flex flex-col gap-2">
                            <div>Use the name on your government issued ID</div>
                            <div className="flex gap-4">
                                <button className="bg-blue-600 text-white p-2 rounded">Submit</button>
                                <button className="p-2 border-2 text-blue-600 border-blue-600 rounded">Save Draft</button>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="w-[100%] bg-white flex">
                    {showCertificatePopup && (
                        <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
                            <div className="bg-white relative w-[90%] max-w-lg rounded-xl shadow-2xl overflow-hidden transform transition-all animate-fadeIn">
                                <button
                                    className="px-2 absolute right-0 top-0 py-1 border-2 border-gray-300 text-gray-600 rounded-sm hover:bg-gray-50 transition-all duration-200 flex items-center justify-center gap-2"
                                    onClick={() => setShowCertificatePopup(false)}
                                >
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>

                                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 text-center">
                                    <div className="mx-auto w-24 h-24 mb-4 relative">
                                        <div className="absolute inset-0 animate-spin-slow">
                                            <svg className="w-full h-full text-blue-500" viewBox="0 0 24 24">
                                                <path
                                                    fill="currentColor"
                                                    d="M12,15.39L8.24,17.66L9.23,13.38L5.91,10.5L10.29,10.13L12,6.09L13.71,10.13L18.09,10.5L14.77,13.38L15.76,17.66M22,9.24L14.81,8.63L12,2L9.19,8.63L2,9.24L7.45,13.97L5.82,21L12,17.27L18.18,21L16.54,13.97L22,9.24Z"
                                                />
                                            </svg>
                                        </div>
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <svg className="w-16 h-16 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
                                            </svg>
                                        </div>
                                    </div>
                                    <h2 className="text-2xl font-bold text-blue-800 mb-2">Congratulations!</h2>
                                    <p className="text-gray-600">You've successfully completed the course</p>
                                    <div className="w-16 h-1 bg-blue-500 mx-auto rounded-full mt-4"></div>
                                </div>

                                <div className="p-8">
                                    <div className="bg-blue-50 rounded-lg p-6 mb-6">
                                        <p className="text-center text-gray-700 leading-relaxed">
                                            Your dedication and hard work have paid off! You can now download your certificate
                                            as proof of your achievement. Keep learning and growing!
                                        </p>
                                    </div>

                                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                        <button
                                            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 flex items-center justify-center gap-2 shadow-lg"
                                            onClick={() => onHandleGoCertificate()}
                                        >
                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            Go to Certificate
                                        </button>
                                    </div>
                                </div>

                                <div className="h-2 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"></div>
                            </div>
                        </div>
                    )}

                    {courseModules && courseModules.length > 0 && (
                        <div className="left_bar h-screen flex flex-col items-start justify-start  w-[30%] bg-gray-50 p-3 rounded-lg shadow-lg">
                            {onMarkShowCertificate && (
                                <div className="certificate-section w-[100%] p-2 bg-white rounded-lg shadow-lg mb-6">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="relative">
                                                <svg className="w-8 h-8 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                                                    <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
                                                </svg>
                                                <span className="absolute -top-1 -right-1 h-3 w-3">
                                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                                    <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                                                </span>
                                            </div>
                                        </div>

                                        <button
                                            className="flex items-center px-4 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-md"
                                            onClick={() => {
                                                onHandleGoCertificate();
                                            }}
                                        >
                                            <h2 className="text-lg font-semibold text-white">View Certificates</h2>
                                        </button>
                                    </div>

                                    <div className=" mt-2 p-1 bg-blue-50 rounded-lg">
                                        <p className="text-blue-800 text-xs">
                                            Congratulations! You've completed the course. Download your certificate to showcase your achievement.
                                        </p>
                                    </div>
                                </div>
                            )}

                            <div className="course_module overflow-y-auto overflow-auto">
                                {courseModules?.map((item, moduleIndex) => (
                                    <div key={moduleIndex} className="mb-2 w-full">
                                        <div
                                            className="font-bold text-lg text-blue-700 flex justify-between cursor-pointer hover:text-blue-800 transition-colors duration-200 flex gap-1"
                                            onClick={() => handleModule(moduleIndex)}
                                        >
                                            {item.module}
                                            {showModuleContent.includes(moduleIndex) ? <RiArrowDownSLine className="text-xl" /> : <RiArrowRightSLine className="text-xl" />}
                                        </div>

                                        {showModuleContent.includes(moduleIndex) && (
                                            <div className="flex flex-col gap-2 pl-4 mt-2 border-l-2 border-blue-200">
                                                {item["lecture"]?.map((content, contentIndex) => (
                                                    <div
                                                        key={contentIndex}
                                                        className={`cursor-pointer px-2 py-1 rounded-md transition-all duration-200  ${isVideoAlreadyCompleted(moduleIndex, contentIndex, content.name)
                                                            ? "bg-green-100 text-green-800 line-through"
                                                            : "bg-gray-100 hover:bg-blue-100 text-gray-700 hover:text-blue-700"
                                                            }`}
                                                        onClick={() => {
                                                            const value = getContentByLecture(content.name, item["sub-modules"]);
                                                            handleContentSelection(moduleIndex, contentIndex, value !== null ? (value as any)[1] : null);
                                                        }}
                                                    >
                                                        {selectedContent?.moduleIndex === moduleIndex && selectedContent?.contentIndex === contentIndex ? (
                                                            <>
                                                                <div className="relative">
                                                                    {content["name"]}
                                                                    <span className="absolute -top-1 -right-1 h-3 w-3">
                                                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                                                        <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
                                                                    </span>
                                                                </div>
                                                            </>
                                                        ) : (
                                                            content["name"]
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="right_bar w-[70%] bg-gray-100 p-5 rounded-lg shadow-lg">
                        {selectedContent && (
                            <div className="flex flex-col gap-5">
                                <div className="flex items-center justify-between">
                                    <div className="text-lg font-bold text-blue-700">
                                        Module {selectedContent.moduleIndex + 1}:{" "}
                                        {courseModules[selectedContent.moduleIndex]?.lecture?.[selectedContent.contentIndex]?.name ?? selectedModuleName}
                                    </div>

                                    {courseModules[selectedContent.moduleIndex]?.["sub-modules"]?.[selectedContent.contentIndex]?.supporting_file && (
                                        <button
                                            onClick={() => {
                                                const supportingFile = courseModules[selectedContent.moduleIndex]["sub-modules"][selectedContent.contentIndex]?.supporting_file;
                                                if (!supportingFile) {
                                                    console.error("No supporting file available");
                                                    return;
                                                }
                                                const link = document.createElement("a");
                                                link.href = supportingFile;
                                                link.download = "download";
                                                document.body.appendChild(link);
                                                link.click();
                                                document.body.removeChild(link);
                                            }}
                                            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 focus:ring-2 focus:ring-blue-300 transition-all"
                                        >
                                            Download File
                                        </button>
                                    )}
                                </div>
                            </div>
                        )}

                        {selectedContent !== null && (
                            <div className="content-display w-full mt-5">
                                <div className="pdf-content bg-white p-4 shadow-md rounded-lg">
                                    <p className="text-md font-medium text-gray-700">
                                        {courseModules[selectedContent.moduleIndex]?.lecture?.[selectedContent.contentIndex]?.name ?? selectedModuleName}
                                    </p>

                                    {selectedFile ? (
                                        isVideoPlaying ? (
                                            <HLSVideoPlayer url={selectedFile} />
                                        ) : (
                                            <div className="relative w-full max-w-lg mx-auto h-[30vh] sm:h-[30vh] md:h-[30vh] lg:h-[30vh] flex items-center justify-center">
                                                <button className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-lg" onClick={() => setIsVideoPlaying(true)}>
                                                    <PlayCircleFilled className="text-white w-24 h-24" />
                                                </button>
                                            </div>
                                        )
                                    ) : (
                                        <div className="text-md text-gray-800 font-semibold max-w-md mx-auto">
                                            <p className="text-center text-2xl font-bold text-red-500 md:text-3xl md:px-10">
                                                Unfortunately, there is no video uploaded for this section yet. Please contact the admin for more information.
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {selectedContent !== null && (
                            <div className="flex flex-col gap-5">
                                <div className="flex gap-3 justify-start mt-3">
                                    {(selectedContent?.moduleIndex !== 0 || selectedContent?.contentIndex !== 0) && (
                                        <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 focus:ring-2 focus:ring-blue-300 transition-all" onClick={() => handleNavigation(-1)}>
                                            Previous
                                        </button>
                                    )}

                                    {(selectedContent?.moduleIndex !== courseModules.length - 1 ||
                                        selectedContent?.contentIndex !== (courseModules[selectedContent.moduleIndex]?.lecture?.length ?? 1) - 1) && (
                                            <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 focus:ring-2 focus:ring-blue-300 transition-all" onClick={() => handleNavigation(1)}>
                                                Next
                                            </button>
                                        )}

                                    {!onMarkShowCertificate &&
                                        !isVideoAlreadyCompleted(
                                            selectedContent.moduleIndex,
                                            selectedContent.contentIndex,
                                            courseModules[selectedContent.moduleIndex]?.lecture?.[selectedContent.contentIndex]?.name ?? ""
                                        ) && (
                                            <button
                                                disabled={onMarkShowCertificate}
                                                className={`${courseModules[selectedContent.moduleIndex]?.lecture?.[selectedContent.contentIndex]?.["sub-module-name-crossed"]
                                                    ? "bg-green-600"
                                                    : "bg-gray-600"
                                                    } text-white px-4 py-2 rounded hover:opacity-90 transition-all`}
                                                onClick={() => markAsCompleted(selectedContent.moduleIndex, selectedContent.contentIndex)}
                                            >
                                                Mark as Complete
                                            </button>
                                        )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
            <div> <S3FileViewer courseId={course_id} /></div>
        </>
    );
};

export default LearnCourse;
