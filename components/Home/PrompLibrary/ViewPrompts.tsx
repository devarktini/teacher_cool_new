import MarkdownViewer from "@/components/Home/PrompLibrary/MarkdownViewer";
import MDEditor from "@uiw/react-md-editor";
import { FiX } from "react-icons/fi";

const ViewPrompts = ({ promtDetails, onClose }:any) => {
    // Safe guard in case data isn't loaded yet

    if (!promtDetails) return null;

    const { title, description, prompt_count, public_content, private_content } = promtDetails;

    return (
        // 1. Fixed Overlay (Backdrop)
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4 animate-fadeIn">

            {/* 2. Modal Container */}
            <div className="bg-white w-full max-w-7xl max-h-[95vh] rounded-xl shadow-2xl flex flex-col relative animate-slideUp">

                {/* --- MODAL HEADER (Sticky) --- */}
                <div className="flex justify-between items-start p-6 border-b sticky top-0 bg-white z-10 rounded-t-xl">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
                            <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2 py-1 rounded-full border border-blue-200">
                                {prompt_count} Prompts
                            </span>
                        </div>
                        <p className="text-gray-600 text-sm">{description}</p>
                    </div>

                    <button
                        onClick={onClose}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                    >
                        <FiX size={24} />
                    </button>
                </div>

                {/* --- SCROLLABLE CONTENT --- */}
                <div className="overflow-y-auto p-6 space-y-8">

                    {/* Public Content Section */}
                    {public_content && (
                        <div>
                            <h2 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2 border-b pb-2">
                                <span className="text-xl">🔓</span> Preview
                            </h2>
                            <div className="bg-gray-50 border border-gray-200 rounded-lg p-5">
                                <MarkdownViewer content={public_content} />
                            </div>
                        </div>
                    )}

                    {/* Private Content Section */}
                    {private_content && (
                        <div>
                            <h2 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2 border-b pb-2">
                                <span className="text-xl">🔒</span> Premium Content
                            </h2>
                            <div className="bg-amber-50 border border-amber-200 rounded-lg p-5">
                                <MarkdownViewer content={private_content} />
                            </div>
                        </div>
                    )}

                    {/* Empty State if no content */}
                    {!public_content && !private_content && (
                        <div className="text-center text-gray-400 py-10 italic">
                            No content available for this library.
                        </div>
                    )}
                </div>

                {/* --- MODAL FOOTER --- */}
                {/* <div className="p-4 border-t bg-gray-50 rounded-b-xl flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-lg transition"
                    >
                        Close
                    </button>
                </div> */}
            </div>
        </div>
    );
};

export default ViewPrompts;



