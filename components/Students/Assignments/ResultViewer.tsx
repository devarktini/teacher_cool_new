import React, { useEffect, useState, useMemo } from 'react'
import StudentApiService from '@/services/studentApi';

function ResultViewer({ assignmentId, onCancel }:any) {
    const [quizQuestions, setQuizQuestions] = useState<any>([]);
    const [studentAssignment, setStudentAssignment] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    // Memoized combined results to prevent infinite re-renders
    const combinedResults = useMemo(() => {
        if (!studentAssignment || !quizQuestions.length) return [];
        
        return quizQuestions.map((question:any) => {
            const studentAnswer = studentAssignment.results.find((result:any) => result.id === question.id);
            return {
                ...question,
                studentAnswer: studentAnswer || null
            };
        });
    }, [studentAssignment, quizQuestions]);

    const fetchQuizByAssignmentId = async () => {
        try {
            const res = await StudentApiService.getQuizByAssignmentId(assignmentId);
            setQuizQuestions(res || []);
            console.log(res)
        } catch (error) {
            console.error("Error fetching quiz:", error);
        }
    };

    const fetchStudentResults = async () => {
        const student_id = localStorage.getItem('userId');
        try {
            const res = await StudentApiService.getStudentAssignmet(student_id);
            // Find the specific assignment result
            const assignmentResult = res.results?.find((result:any) => 
                result.assignment === assignmentId
            );
            setStudentAssignment(assignmentResult || null);
        } catch (error) {
            console.error("Error fetching student results:", error);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            await Promise.all([fetchStudentResults(), fetchQuizByAssignmentId()]);
            setLoading(false);
        };
        fetchData();
    }, [assignmentId]);

    // Calculate score based on actual results
    const totalQuestions = combinedResults.length;
    const correctAnswers = combinedResults.filter((q:any) => 
        q.studentAnswer?.is_correct
    ).length;

    // Use the actual marks from the API
    const obtainedMarks = studentAssignment?.total_marks || 0;
    const totalMarks = studentAssignment?.count || totalQuestions;

    if (loading) {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
                    <div className="flex justify-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    </div>
                    <p className="text-center mt-4 text-gray-600">Loading results...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
                {/* Simple Header with Circular Score */}
                <div className="bg-white border-b p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-800">Quiz Results</h2>
                        <button
                            onClick={onCancel}
                            className="text-gray-500 hover:text-gray-700 text-2xl font-bold w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
                        >
                            ×
                        </button>
                    </div>
                    
                    {/* Circular Score Display */}
                    <div className="flex justify-center space-x-8">
                        {/* Marks Circle */}
                        <div className="text-center">
                            <div className="relative w-24 h-24 mx-auto mb-2">
                                <svg className="w-full h-full" viewBox="0 0 36 36">
                                    <path
                                        d="M18 2.0845
                                          a 15.9155 15.9155 0 0 1 0 31.831
                                          a 15.9155 15.9155 0 0 1 0 -31.831"
                                        fill="none"
                                        stroke="#E5E7EB"
                                        strokeWidth="3"
                                    />
                                    <path
                                        d="M18 2.0845
                                          a 15.9155 15.9155 0 0 1 0 31.831
                                          a 15.9155 15.9155 0 0 1 0 -31.831"
                                        fill="none"
                                        stroke="#3B82F6"
                                        strokeWidth="3"
                                        strokeDasharray={`${(obtainedMarks / totalMarks) * 100}, 100`}
                                    />
                                </svg>
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <span className="text-2xl font-bold text-gray-800">
                                        {obtainedMarks}
                                    </span>
                                    <span className="text-xs text-gray-500">/{totalMarks}</span>
                                </div>
                            </div>
                            <p className="text-sm font-medium text-gray-600">Marks Obtained</p>
                        </div>

                        {/* Accuracy Circle */}
                        <div className="text-center">
                            <div className="relative w-24 h-24 mx-auto mb-2">
                                <svg className="w-full h-full" viewBox="0 0 36 36">
                                    <path
                                        d="M18 2.0845
                                          a 15.9155 15.9155 0 0 1 0 31.831
                                          a 15.9155 15.9155 0 0 1 0 -31.831"
                                        fill="none"
                                        stroke="#E5E7EB"
                                        strokeWidth="3"
                                    />
                                    <path
                                        d="M18 2.0845
                                          a 15.9155 15.9155 0 0 1 0 31.831
                                          a 15.9155 15.9155 0 0 1 0 -31.831"
                                        fill="none"
                                        stroke="#10B981"
                                        strokeWidth="3"
                                        strokeDasharray={`${totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0}, 100`}
                                    />
                                </svg>
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <span className="text-2xl font-bold text-gray-800">
                                        {correctAnswers}
                                    </span>
                                    <span className="text-xs text-gray-500">/{totalQuestions}</span>
                                </div>
                            </div>
                            <p className="text-sm font-medium text-gray-600">Correct Answers</p>
                        </div>

                        {/* Percentage Circle */}
                        <div className="text-center">
                            <div className="relative w-24 h-24 mx-auto mb-2">
                                <svg className="w-full h-full" viewBox="0 0 36 36">
                                    <path
                                        d="M18 2.0845
                                          a 15.9155 15.9155 0 0 1 0 31.831
                                          a 15.9155 15.9155 0 0 1 0 -31.831"
                                        fill="none"
                                        stroke="#E5E7EB"
                                        strokeWidth="3"
                                    />
                                    <path
                                        d="M18 2.0845
                                          a 15.9155 15.9155 0 0 1 0 31.831
                                          a 15.9155 15.9155 0 0 1 0 -31.831"
                                        fill="none"
                                        stroke="#8B5CF6"
                                        strokeWidth="3"
                                        strokeDasharray={`${totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0}, 100`}
                                    />
                                </svg>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <span className="text-2xl font-bold text-gray-800">
                                        {totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0}%
                                    </span>
                                </div>
                            </div>
                            <p className="text-sm font-medium text-gray-600">Accuracy</p>
                        </div>
                    </div>
                </div>

                {/* Results List */}
                <div className="overflow-y-auto max-h-[50vh] p-6">
                    {combinedResults.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                            No results found for this assignment.
                        </div>
                    ) : (
                        combinedResults.map((question:any, index:any) => (
                            <div key={question.id} className="mb-6 last:mb-0 border rounded-lg p-4 bg-gray-50">
                                {/* Question Header */}
                                <div className="flex items-start space-x-3 mb-3">
                                    <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm ${
                                        question.studentAnswer?.is_correct 
                                            ? 'bg-green-100 text-green-800' 
                                            : 'bg-red-100 text-red-800'
                                    }`}>
                                        {index + 1}
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-gray-800 text-lg">
                                            {question.question}
                                        </h3>
                                        <div className="flex items-center space-x-2 mt-1">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                question.studentAnswer?.is_correct 
                                                    ? 'bg-green-100 text-green-800' 
                                                    : 'bg-red-100 text-red-800'
                                            }`}>
                                                {question.studentAnswer?.is_correct ? 'Correct' : 'Incorrect'}
                                            </span>
                                            <span className="text-xs text-gray-500 capitalize">
                                                {question.type.replace('_', ' ')}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Answers */}
                                <div className="grid md:grid-cols-2 gap-4 ml-11">
                                    {/* Student's Answer */}
                                    <div className="border rounded-lg p-3 bg-white">
                                        <p className="text-sm font-medium text-gray-600 mb-2">Your Answer</p>
                                        <p className={`font-semibold ${
                                            question.studentAnswer?.is_correct 
                                                ? 'text-green-700' 
                                                : 'text-red-700'
                                        }`}>
                                            {question.type === 'multiple' ? (
                                                question.options?.find((opt:any) => opt === question.studentAnswer?.selected) || 
                                                question.studentAnswer?.selected
                                            ) : (
                                                question.studentAnswer?.selected === 'true' ? 'True' : 'False'
                                            )}
                                        </p>
                                    </div>

                                    {/* Correct Answer (only show if incorrect) */}
                                    {!question.studentAnswer?.is_correct && (
                                        <div className="border border-green-200 bg-green-50 rounded-lg p-3">
                                            <p className="text-sm font-medium text-green-800 mb-2">Correct Answer</p>
                                            <p className="font-semibold text-green-700">
                                                {question.type === 'multiple' ? (
                                                    question.options?.find((opt:any) => opt === question.answer) || 
                                                    question.answer
                                                ) : (
                                                    question.answer === 'true' ? 'True' : 'False'
                                                )}
                                            </p>
                                        </div>
                                    )}
                                </div>

                                {/* Options for multiple choice */}
                                {question.type === 'multiple' && question.options && (
                                    <div className="ml-11 mt-3">
                                        <p className="text-sm font-medium text-gray-600 mb-2">All Options</p>
                                        <div className="grid grid-cols-2 gap-2">
                                            {question.options.map((option:any, optIndex:any) => {
                                                const isStudentAnswer = option === question.studentAnswer?.selected;
                                                const isCorrectAnswer = option === question.answer;
                                                
                                                return (
                                                    <div key={optIndex} className={`p-2 rounded border text-sm ${
                                                        isCorrectAnswer 
                                                            ? 'bg-green-50 border-green-200 text-green-800 font-semibold' 
                                                            : isStudentAnswer && !isCorrectAnswer
                                                                ? 'bg-red-50 border-red-200 text-red-800'
                                                                : 'bg-gray-50 border-gray-200 text-gray-600'
                                                    }`}>
                                                        {option}
                                                        {isCorrectAnswer && <span className="ml-2 text-green-600">✓</span>}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>

                {/* Footer */}
                <div className="border-t px-6 py-4 bg-gray-50">
                    <div className="flex justify-between items-center">
                        <div className="text-sm text-gray-600">
                            Completed on: {studentAssignment?.created_at ? 
                                new Date(studentAssignment.created_at).toLocaleDateString() : 'N/A'
                            }
                        </div>
                        <button
                            onClick={onCancel}
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200 font-medium"
                        >
                            Close Results
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ResultViewer;