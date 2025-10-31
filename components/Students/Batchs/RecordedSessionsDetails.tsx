// RecordedSessionsDetails.tsx
'use client';
import Progress from '@/components/Progress';
import StudentApiService from '@/services/studentApi';
import React, { useEffect, useState } from 'react'
import BatchVideo from './BatchVideo';
import { useRouter } from 'next/navigation';

interface RecordedSession {
    id: string;
    topic: string;
    date: string;
    duration: string;
    url: string;
}

function RecordedSessionsDetails({ slug, id }: { slug: string; id: string }) {
    const router = useRouter()
    const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
    const [videoUrl, setVideoUrl] = useState<any>({ embed_url: "" });
    const [searchTerm, setSearchTerm] = useState("");
    const [allRecordedSessions, setAllRecordedSessions] = useState<RecordedSession[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchAllRecordedSessions = async (id: any) => {
        try {
            setLoading(true);
            const res = await StudentApiService.getAllRecordedSessions(id);
            console.log("Recorded Sessions:", res);
            setAllRecordedSessions(res.data || []);
        } catch (error) {
            console.error("Failed to fetch recorded sessions:", error);
            setAllRecordedSessions([]);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchAllRecordedSessions(id);
    }, [id]);

    const handlePlay = async (url: string) => {
        try {
            setLoading(true);
            const streamUrl: any = await StudentApiService.getRecordedSessionVideoUrl(url);
            setVideoUrl(streamUrl);
            setIsVideoModalOpen(true);
        } catch (error) {
            console.error("Failed to stream video:", error);
        } finally {
            setLoading(false);
        }
    };

    const filteredSessions = allRecordedSessions.filter((session) =>
        session.topic.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="w-full min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
            {/* Header */}
            <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-4 md:p-6 rounded-lg shadow-md bg-white">
                <div className="w-full sm:w-auto">
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 capitalize break-words">
                        {slug
                            .split('-')
                            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                            .join(' ')}
                    </h1>
                    <p className="text-gray-600 text-xs sm:text-sm md:text-base mt-1 md:mt-2">Watch recorded sessions</p>
                </div>
                <button
                    onClick={() => router.back()}
                    className="w-full sm:w-auto px-4 py-2 md:px-6 md:py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg md:rounded-lg font-medium text-sm md:text-base transition duration-200"
                >
                    ← Go Back
                </button>
            </div>

            {/* Search Bar */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div className="relative w-full max-w-md">
                    <svg
                        className="absolute left-3 top-3.5 w-5 h-5 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                    </svg>
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search sessions..."
                        className="w-full pl-10 pr-4 py-2 md:py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition duration-200"
                    />
                </div>
            </div>

            {/* Table Section */}
            {loading ? (
                <div className="flex items-center justify-center py-12">
                    <Progress />
                </div>
            ) : (
                <>
                    {/* Desktop Table View */}
                    <div className="hidden sm:block bg-white rounded-lg shadow-md border border-gray-200 overflow-x-auto">
                        <table className="w-full table-auto text-sm">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    {["Session Name", "Date", "Duration", "Actions"].map((header) => (
                                        <th
                                            key={header}
                                            className="px-4 md:px-6 py-3 md:py-3.5 text-left font-semibold text-gray-700 uppercase tracking-wide text-xs md:text-sm"
                                        >
                                            {header}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {filteredSessions.length > 0 ? (
                                    filteredSessions.map((session) => (
                                        <tr
                                            key={session.id}
                                            className="hover:bg-gray-50 transition duration-150"
                                        >
                                            <td className="px-4 md:px-6 py-3 md:py-4 font-medium text-gray-900 text-sm md:text-base">
                                                {session.topic}
                                            </td>
                                            <td className="px-4 md:px-6 py-3 md:py-4 text-gray-600 text-xs md:text-sm">
                                                {new Date(session.date).toLocaleDateString('en-US', {
                                                    year: 'numeric',
                                                    month: 'short',
                                                    day: 'numeric'
                                                })}
                                            </td>
                                            <td className="px-4 md:px-6 py-3 md:py-4 text-gray-600 text-xs md:text-sm">
                                                {session.duration}
                                            </td>
                                            <td className="px-4 md:px-6 py-3 md:py-4">
                                                <button
                                                    onClick={() => handlePlay(session.url)}
                                                    className="inline-flex items-center space-x-2 px-3 md:px-4 py-1.5 md:py-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg transition duration-200 font-medium text-xs md:text-sm whitespace-nowrap"
                                                >
                                                    <svg
                                                        className="w-4 h-4"
                                                        fill="currentColor"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path d="M8 5v14l11-7z" />
                                                    </svg>
                                                    <span className="hidden sm:inline">Play</span>
                                                    <span className="sm:hidden">▶</span>
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={4} className="px-4 md:px-6 py-8 md:py-12 text-center">
                                            <div className="flex flex-col items-center">
                                                <svg
                                                    className="w-10 md:w-12 h-10 md:h-12 text-gray-300 mb-3"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={1.5}
                                                        d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                                                    />
                                                </svg>
                                                <p className="text-gray-500 font-medium text-sm md:text-base">No sessions found</p>
                                                <p className="text-gray-400 text-xs md:text-sm mt-1">Try adjusting your search terms</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile Card View */}
                    <div className="sm:hidden space-y-4">
                        {filteredSessions.length > 0 ? (
                            filteredSessions.map((session) => (
                                <div
                                    key={session.id}
                                    className="bg-white rounded-lg shadow-md border border-gray-200 p-4"
                                >
                                    <div className="space-y-3">
                                        <div>
                                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Session Name</p>
                                            <p className="text-sm font-medium text-gray-900 mt-1 break-words">
                                                {session.topic}
                                            </p>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Date</p>
                                                <p className="text-sm text-gray-600 mt-1">
                                                    {new Date(session.date).toLocaleDateString('en-US', {
                                                        year: 'numeric',
                                                        month: 'short',
                                                        day: 'numeric'
                                                    })}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Duration</p>
                                                <p className="text-sm text-gray-600 mt-1">{session.duration}</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => handlePlay(session.url)}
                                            className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition duration-200 font-medium text-sm"
                                        >
                                            <svg
                                                className="w-4 h-4"
                                                fill="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path d="M8 5v14l11-7z" />
                                            </svg>
                                            <span>Play Video</span>
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="bg-white rounded-lg shadow-md border border-gray-200 p-8 text-center">
                                <div className="flex flex-col items-center">
                                    <svg
                                        className="w-12 h-12 text-gray-300 mb-3"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={1.5}
                                            d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                                        />
                                    </svg>
                                    <p className="text-gray-500 font-medium text-sm mt-3">No sessions found</p>
                                    <p className="text-gray-400 text-xs mt-1">Try adjusting your search terms</p>
                                </div>
                            </div>
                        )}
                    </div>
                </>
            )}

            {/* Video Modal */}
            <BatchVideo
                isOpen={isVideoModalOpen}
                onClose={() => {
                    setIsVideoModalOpen(false);
                    setVideoUrl({ embed_url: "" });
                }}
                videoUrl={videoUrl}
                loading={loading}
            />
        </div>

    )
}

export default RecordedSessionsDetails;
