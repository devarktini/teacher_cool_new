'use client'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';
import { LockOutlined, VideoCameraOutlined } from "@ant-design/icons";
import HLSVideoPlayer from '../common/HLSVideoPlayer';
import axios from 'axios';
import { Tooltip } from "antd";


export default function LearningModules({modules,preview_files}:any) {
   const [courseModule, setCourseModule] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(true); // Loading state
  const [showVideoPopup, setShowVideoPopup] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  
//   const { userDetails } = useDateTime();

  useEffect(() => {
    setCourseModule(modules);
    setIsLoading(false); // Stop loading when data is set
  }, [modules]);

  const checkPreviewVideo = (module:any, sub_module:any) => {
    const moduleKey = module.replace(/\s/g, "_");
    const subModuleKey = sub_module.replace(/\s/g, "_");
    return preview_files[`${moduleKey}-${subModuleKey}`];
  };

  const playVideo = (item:any) => {
    const url = `${process.env.NEXT_PUBLIC_API_URL}/lms/upload-chunk/${item}/hls/`;
    const config = {
      headers: {
        accept: "application/json",
        // "X-CSRFTOKEN": userDetails?.csrftoken,
      },
    };
    axios
      .get(url, config)
      .then((res) => {
        if (res.data) {
          setSelectedFile(res.data["presigned_url"]);
        }
      })
      .catch((err) => {
        toast.error(err.message);
      });

    setShowVideoPopup(true);
  };

  return courseModule?.modules?.length > 0 && preview_files ? (
    <>
      {selectedFile && showVideoPopup && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl overflow-hidden max-w-4xl w-full">
            <div className="flex justify-end p-2 bg-gray-50">
              <button
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                onClick={() => {
                  setSelectedFile(null);
                  setShowVideoPopup(false);
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-gray-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="p-4">
              {/* <VideoPlayer fileId={selectedFile} /> */}

              <HLSVideoPlayer url={selectedFile} />
            </div>
          </div>
        </div>
      )}

      <div className="container mx-auto mt-5 mb-10">
        <h2 className="text-3xl font-semibold mb-8">Learning Modules</h2>
        {isLoading ? (
          // Show a loading spinner or message while loading
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
          </div>
        ) : (
          // Render the modules once loading is complete
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {courseModule?.modules?.map((module:any, index:number) => (
              <div
                key={index}
                className="bg-white p-6 shadow-md rounded-lg transition-transform transform hover:scale-105 hover:shadow-xl border border-gray-100 hover:border-blue-100"
              >
                <h3 className="text-xl font-bold text-gray-800 mb-4">
                  <span className="text-blue-600">{index + 1}.</span>{" "}
                  {module.module}
                </h3>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  {module?.lecture?.map((lecture:any, i:any) => (
                    <li
                      key={i}
                      className="text-sm flex items-center justify-between hover:text-blue-600 transition-colors duration-200"
                    >
                      {lecture.name}
                      {preview_files &&
                      checkPreviewVideo(module.module, lecture.name) ? (
                        <span className="ml-2">
                          <Tooltip title="You can watch this free video to understand the gist of the course">
                            <VideoCameraOutlined
                              className="h-8 w-8 text-blue-400 opacity-50 cursor-not-allowed"
                              onClick={() =>
                                playVideo(
                                  checkPreviewVideo(module.module, lecture.name)
                                )
                              }
                            />
                          </Tooltip>
                        </span>
                      ) : (
                        <span className="ml-2">
                          <Tooltip title="You have to purchase the course to watch this">
                            <LockOutlined className="h-8 w-8 text-blue-900 opacity-50 cursor-not-allowed" />
                          </Tooltip>
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  ) : null;
};