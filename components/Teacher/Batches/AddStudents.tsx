'use client'
import { useEffect, useState } from "react";
import { RxCross1 } from "react-icons/rx";
import DeleteCoursePopup from "../Courses/DeleteCoursePopup";
import toast from "react-hot-toast";
import TeacherApiService from "@/services/teacherApi";

// ✅ Custom debounce function (Lodash alternative)
function debounceWithCancel<F extends (...args: any[]) => void>(func: F, delay: number) {
    let timer: NodeJS.Timeout;
    const debounced = (...args: Parameters<F>) => {
        clearTimeout(timer);
        timer = setTimeout(() => func(...args), delay);
    };
    debounced.cancel = () => clearTimeout(timer);
    return debounced;
}

const AddStudents = ({ isOpen, onClose, batch }: any) => {
    const [selectedStudents, setSelectedStudents] = useState<any[]>([]);
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [inputValue, setInputValue] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [batchStudents, setBatchStudents] = useState<any[]>([]);
    const [error, setError] = useState("");
    const [showDeletePopup, setShowDeletePopup] = useState(false);
    const [studentToDelete, setStudentToDelete] = useState<any>(null);

    // ✅ Fetch students (client-side filter)
    const fetchStudents = async (query: string) => {
        try {
            if (!query) return setSearchResults([]); // Reset results when input is empty
            setIsLoading(true);
            const type = "student";
            const res = await TeacherApiService.getUserTypeListByAdmin(type); // Fetch all students
            const fetchedStudents = res?.data || [];

            // Filter students by name or email
            const filteredResults = fetchedStudents.filter(
                (student: any) =>
                    student.name.toLowerCase().includes(query.toLowerCase()) ||
                    student.email.toLowerCase().includes(query.toLowerCase())
            );

            // Exclude already selected or batch students
            const finalResults = filteredResults.filter(
                (student: any) =>
                    !selectedStudents.some((s: any) => s.id === student.id) &&
                    !batchStudents.some((s: any) => s.id === student.id)
            );

            setSearchResults(finalResults);
        } catch (error) {
            console.error("Error fetching students:", error);
        } finally {
            setIsLoading(false);
        }
    };

    // ✅ Use custom debounce
    const debouncedFetchStudents = debounceWithCancel((query: string) => {
        fetchStudents(query);
    }, 500);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setInputValue(value);
        debouncedFetchStudents(value);
    };

    const handleStudentSelect = (student: any) => {
        if (batchStudents.length + selectedStudents.length >= batch.capacity) {
            setError(`Cannot add more than ${batch.capacity} students to this batch.`);
            return;
        }
        setError("");
        setSelectedStudents([...selectedStudents, student]);
        setInputValue("");
        setSearchResults([]);
    };

    const handleStudentRemove = (id: number) => {
        setSelectedStudents(selectedStudents.filter((student: any) => student.id !== id));
    };

    const handleSubmit = async () => {
        try {
            if (batchStudents.length + selectedStudents.length > batch.capacity) {
                setError(`Cannot add more than ${batch.capacity} students to this batch.`);
                return;
            }
            const studentIds = selectedStudents.map((student: any) => student.id);
            await TeacherApiService.addStudentToBatch(batch.id, studentIds);
            toast.success("Students successfully added to the batch!");
            onClose();
        } catch (error) {
            toast.error("Failed to add students. Please try again.");
        }
    };

    useEffect(() => {
        return () => debouncedFetchStudents.cancel(); // ✅ Clean up on unmount
    }, []);

    useEffect(() => {
        (async () => {
            try {
                const res: any = await TeacherApiService.getStudentByBatch(batch.id);
                setBatchStudents(res?.studentsData || []);
            } catch (error) {
                console.error("Error fetching students by batch:", error);
            }
        })();
    }, [batch.id]);

    const handleCourseDelete = async (studentId: number) => {
        try {
            const response = await TeacherApiService.deleteBatchStudentById(studentId);
            if (response) {
                setBatchStudents(prevStudents =>
                    prevStudents.filter((student: any) => student.id !== studentId)
                );
                toast.success("Student removed from batch successfully");
            }
        } catch (error) {
            toast.error("Student not removed from batch");
        } finally {
            setShowDeletePopup(false);
            setStudentToDelete(null);
        }
    };

    return (
        <div
            className={`fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-60 z-50 p-2 sm:p-4 transition-all ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
                }`}
            onClick={onClose}
        >
            <div
                className="bg-white rounded-xl w-full max-w-6xl h-screen sm:h-[90vh] lg:h-[85vh] shadow-2xl flex flex-col overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header - Sticky */}
                <div className="flex-shrink-0 px-4 sm:px-6 lg:px-8 py-4 sm:py-5 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-blue-100 sticky top-0 z-20">
                    <div className="flex items-center justify-between gap-4">
                        <div className="flex-1 min-w-0">
                            <h2 className="text-lg sm:text-2xl lg:text-3xl font-bold text-gray-800">
                                Add Students to Batch
                            </h2>
                            <p className="text-xs sm:text-sm text-gray-600 mt-1">
                                {batchStudents?.length || 0} batch students • {selectedStudents.length} to add
                            </p>
                        </div>
                        <button
                            onClick={onClose}
                            className="flex-shrink-0 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded-full p-2 transition-all text-2xl leading-none"
                            aria-label="Close modal"
                        >
                            ✕
                        </button>
                    </div>
                </div>

                {/* Main Content - Scrollable */}
                <div className="flex-1 overflow-hidden flex flex-col lg:flex-row gap-4 sm:gap-6 p-4 sm:p-6 lg:p-8">

                    {/* Left Column - Search and Input */}
                    <div className="w-full lg:w-2/5 flex flex-col gap-4 min-h-0">

                        {/* Search Input */}
                        <div className="flex-shrink-0">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Search Students
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Search by name, email, or ID..."
                                    value={inputValue}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 sm:py-4 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all text-sm sm:text-base"
                                />
                                {isLoading && (
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2">
                                        <div className="flex items-center gap-2">
                                            <div className="h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                                            <span className="text-xs sm:text-sm text-gray-500">Searching...</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Search Results */}
                        {searchResults.length > 0 && (
                            <div className="flex-1 min-h-0 overflow-hidden flex flex-col">
                                <h3 className="text-sm font-semibold text-gray-700 mb-2">
                                    Available Students ({searchResults.length})
                                </h3>
                                <div className="flex-1 overflow-y-auto border border-gray-200 rounded-lg bg-gray-50">
                                    <ul className="divide-y divide-gray-200">
                                        {searchResults.map((student: any) => (
                                            <li
                                                key={student.id}
                                                onClick={() => handleStudentSelect(student)}
                                                className="px-3 sm:px-4 py-3 hover:bg-blue-100 cursor-pointer transition-colors duration-150 group"
                                            >
                                                <div className="flex items-start justify-between gap-2 sm:gap-3">
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm sm:text-base font-medium text-gray-900 truncate group-hover:text-blue-600">
                                                            {student.name}
                                                        </p>
                                                        <p className="text-xs sm:text-sm text-gray-600 truncate">
                                                            {student.email}
                                                        </p>
                                                        {student.id && (
                                                            <p className="text-xs text-gray-500 mt-0.5">
                                                                ID: {student.id}
                                                            </p>
                                                        )}
                                                    </div>
                                                    <div className="flex-shrink-0 w-5 h-5 sm:w-6 sm:h-6 rounded border-2 border-gray-300 group-hover:border-blue-500 group-hover:bg-blue-100 flex items-center justify-center transition-all">
                                                        {selectedStudents.some(s => s.id === student.id) && (
                                                            <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                            </svg>
                                                        )}
                                                    </div>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        )}

                        {/* No Results */}
                        {inputValue && searchResults.length === 0 && !isLoading && (
                            <div className="flex-1 flex items-center justify-center">
                                <div className="text-center text-gray-500">
                                    <svg className="mx-auto h-12 w-12 text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <p className="text-sm">No students found</p>
                                </div>
                            </div>
                        )}

                        {/* Initial State */}
                        {!inputValue && searchResults.length === 0 && (
                            <div className="flex-1 flex items-center justify-center text-center text-gray-500">
                                <div>
                                    <svg className="mx-auto h-12 w-12 text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                    <p className="text-sm">Start typing to search for students</p>
                                </div>
                            </div>
                        )}

                        {/* Error Message */}
                        {error && (
                            <div className="flex-shrink-0 bg-red-50 border border-red-200 rounded-lg p-3 sm:p-4">
                                <p className="text-sm text-red-700 flex items-start gap-2">
                                    <span className="text-lg leading-none flex-shrink-0">⚠</span>
                                    <span>{error}</span>
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Right Column - Selected and Batch Students */}
                    <div className="w-full lg:w-3/5 flex flex-col gap-4 sm:gap-6 min-h-0">

                        {/* Selected Students Section */}
                        <div className="flex-1 min-h-0 flex flex-col">
                            <div className="flex-shrink-0 flex items-center justify-between mb-3 sm:mb-4">
                                <h3 className="text-sm sm:text-base font-semibold text-gray-700">
                                    Students to Add ({selectedStudents.length})
                                </h3>
                                {selectedStudents.length > 0 && (
                                    <button
                                        onClick={() => setSelectedStudents([])}
                                        className="text-xs sm:text-sm text-red-600 hover:text-red-700 hover:bg-red-50 px-2 sm:px-3 py-1 rounded transition-colors"
                                    >
                                        Clear All
                                    </button>
                                )}
                            </div>

                            <div className="flex-1 overflow-y-auto border border-gray-200 rounded-lg bg-blue-50">
                                {selectedStudents.length === 0 ? (
                                    <div className="h-full flex items-center justify-center text-center text-gray-500">
                                        <div>
                                            <svg className="mx-auto h-10 w-10 text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6m0 0v6m0-6h6m0 0h6m-6-6h-6m0 0H6m0 6h-6" />
                                            </svg>
                                            <p className="text-xs sm:text-sm">Select students to add them here</p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="divide-y divide-blue-200">
                                        {selectedStudents.map((student: any, index: number) => (
                                            <div
                                                key={student.id}
                                                className="px-3 sm:px-4 py-2 sm:py-3 hover:bg-blue-100 transition-colors group flex items-center justify-between gap-2 sm:gap-3"
                                            >
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2 sm:gap-3">
                                                        <span className="flex-shrink-0 w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-blue-500 text-white text-xs sm:text-sm font-semibold flex items-center justify-center">
                                                            {index + 1}
                                                        </span>
                                                        <div className="min-w-0">
                                                            <p className="text-sm sm:text-base font-medium text-gray-900 truncate">
                                                                {student.name}
                                                            </p>
                                                            <p className="text-xs sm:text-sm text-gray-600 truncate">
                                                                {student.email}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={() => handleStudentRemove(student.id)}
                                                    className="flex-shrink-0 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full p-1.5 sm:p-2 transition-all"
                                                    aria-label="Remove student"
                                                >
                                                    ✕
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Batch Students Section */}
                        {batchStudents?.length > 0 && (
                            <div className="flex-1 min-h-0 flex flex-col">
                                <div className="flex-shrink-0 flex items-center justify-between mb-3 sm:mb-4">
                                    <h3 className="text-sm sm:text-base font-semibold text-gray-700">
                                        Current Batch Students ({batchStudents.length})
                                    </h3>
                                </div>

                                <div className="flex-1 overflow-y-auto border border-gray-200 rounded-lg bg-gray-50">
                                    <div className="divide-y divide-gray-200">
                                        {batchStudents.map((student: any) => (
                                            <div
                                                key={student.id}
                                                className="px-3 sm:px-4 py-2 sm:py-3 hover:bg-gray-100 transition-colors group flex items-center justify-between gap-2 sm:gap-3"
                                            >
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm sm:text-base font-medium text-gray-900 truncate">
                                                        {student.student_name}
                                                    </p>
                                                    {student.email && (
                                                        <p className="text-xs sm:text-sm text-gray-600 truncate">
                                                            {student.email}
                                                        </p>
                                                    )}
                                                </div>
                                                <button
                                                    onClick={() => {
                                                        setStudentToDelete(student.id);
                                                        setShowDeletePopup(true);
                                                    }}
                                                    className="flex-shrink-0 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full p-1.5 sm:p-2 transition-all"
                                                    aria-label="Remove from batch"
                                                >
                                                    ✕
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Delete Confirmation Popup */}
                {showDeletePopup && (
                    <DeleteCoursePopup
                        handleCourseDelete={handleCourseDelete}
                        setShowDeletePopup={setShowDeletePopup}
                        deletedId={studentToDelete}
                    />
                )}

                {/* Footer - Sticky */}
                <div className="flex-shrink-0 px-4 sm:px-6 lg:px-8 py-4 sm:py-5 border-t border-gray-200 bg-gray-50 flex flex-col-reverse sm:flex-row items-center justify-between gap-3 sm:gap-4">
                    <div className="text-xs sm:text-sm text-gray-600">
                        {selectedStudents.length > 0 && (
                            <span className="font-medium">
                                Ready to add <span className="text-blue-600 font-bold">{selectedStudents.length}</span> student{selectedStudents.length !== 1 ? "s" : ""}
                            </span>
                        )}
                    </div>
                    <div className="flex gap-3 w-full sm:w-auto">
                        <button
                            onClick={onClose}
                            className="flex-1 sm:flex-none px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg border border-gray-300 text-gray-700 font-semibold hover:bg-gray-100 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={selectedStudents.length === 0}
                            className="flex-1 sm:flex-none px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold transition-colors disabled:cursor-not-allowed"
                        >
                            Add {selectedStudents.length > 0 ? `(${selectedStudents.length})` : "Students"}
                        </button>
                    </div>
                </div>
            </div>
        </div>

    );
};

export default AddStudents;
