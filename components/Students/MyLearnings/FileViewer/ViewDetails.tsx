'use client'
import MDEditor from '@uiw/react-md-editor'
import React, { useState } from 'react'
import FilesViewCore from './FilesView';


function ViewDetaiils({ currentContent, setIsOpen, setCurrentContent }:any) {
    // console.log("Blog data in ViewDetails:", currentContent);
     const [isFileOpen, setIsFileOpen] = useState(false);
      const [filesData, setFilesData] = useState(null);
    return (
        <>
            <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-all duration-300 ease-out">
                <div className="bg-white w-full max-w-6xl max-h-[95vh] rounded-2xl shadow-xl overflow-hidden border border-gray-100 flex flex-col">
                    {/* Header with title and close button */}
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                            </svg>
                            Document Viewer
                        </h2>
                        <button
                            onClick={() => { setCurrentContent(null); setIsOpen(false) }}
                            className="text-black hover:text-red-500 transition-colors duration-200 rounded-full p-1 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-200"
                            aria-label="Close"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* Content area with subtle scrollbar */}
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
                                prose-blockquote:rounded-r"
                                >

                            <MDEditor.Markdown
                                source={currentContent?.content}
                                style={{
                                    backgroundColor: 'transparent',
                                    lineHeight: 1.6,
                                    color: 'black',
                                }}
                            />
                        </div>
                    </div>


                    {/* Footer with action button */}
                    <div className="bg-white px-6 py-4 border-t border-gray-200 flex justify-between items-center">
                        <div>
                            {currentContent.blog_files && currentContent.blog_files.length > 0 && (
                                <div className="mb-4">
                                    <h3 className="text-lg font-semibold text-gray-800">Attached Files</h3>
                                    <ul className="list-disc pl-5 space-y-2">
                                        {currentContent.blog_files.map((file:any, index:any) => (
                                            <li key={index} className="text-gray-600">

                                                {file.file_url.split('/').pop()}
                                                <span
                                                    onClick={() => {
                                                        setIsFileOpen(true);
                                                        setFilesData(file);
                                                    }}
                                                    className=" bg-white text-blue-600 px-3 py-1 rounded hover:bg-gray-100 text-sm font-medium cursor-pointer"
                                                >view</span>

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

            {/* <FilesViewCore
                isOpen={isFileOpen}
                onClose={() => setIsFileOpen(false)}
                fileData={filesData}
            /> */}
        </>
    )
}

export default ViewDetaiils
