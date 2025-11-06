import React, { useEffect, useRef, useState, useCallback, useMemo } from "react";
import MCQ from "./MCQ";
import StudentApiService from "@/services/studentApi";

// Define types
interface Question {
  id: string | number;
  question: string;
  options: any[];
  type?: string;
  [key: string]: any;
}

interface Result {
  id: string | number;
  type: string;
  selected: any;
  is_correct: boolean;
}

interface AssignmentData {
  others?: {
    quiz_time?: string;
  };
  [key: string]: any;
}

interface QuizProps {
  assignmentId: string | number;
  onCancel: () => void;
  assignmentData: AssignmentData;
}

interface ApiResponse<T = any> {
  ok?: boolean;
  json?: () => Promise<T>;
  text?: () => Promise<string>;
  message?: string;
  [key: string]: any;
}

// Constants
const DEFAULT_QUIZ_TIME = "1:00";
const DEFAULT_TIME_MS = 60 * 60 * 1000; // 1 hour
const WARNING_THRESHOLD = 15 * 60 * 1000; // 15 minutes

const toTypeKey = (rawType: any): string => {
  if (!rawType && rawType !== "") return "multiple";
  return String(rawType).toLowerCase().replace(/[-_\s]/g, "");
};

const Quiz = ({ assignmentId, onCancel, assignmentData }: QuizProps) => {
  // State
  const [questions, setQuestions] = useState<Question[]>([]);
  const [results, setResults] = useState<Result[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [showTimeWarning, setShowTimeWarning] = useState(false);
  const [timeUp, setTimeUp] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Refs
  const lastFetchedRef = useRef<string | number | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const warningShownRef = useRef(false);
  const student_id = localStorage.getItem("id");

  // Memoized values
  const answeredCount = useMemo(() => 
    results.filter((r: Result) => r.selected !== null).length,
    [results]
  );

  const progressPercentage = useMemo(() => 
    Math.round((answeredCount / questions.length) * 100),
    [answeredCount, questions.length]
  );

  const currentQuestion = questions[currentIndex];
  const currentResult = results[currentIndex];

  // Timer functions
  const parseTimeStringToMs = useCallback((timeString: string): number => {
    if (!timeString) return DEFAULT_TIME_MS;
    
    try {
      const parts = timeString.split(':');
      if (parts.length === 2) {
        const hours = parseInt(parts[0], 10);
        const minutes = parseInt(parts[1], 10);
        
        if (!isNaN(hours) && !isNaN(minutes)) {
          return (hours * 60 * 60 * 1000) + (minutes * 60 * 1000);
        }
      }
      
      const decimalHours = parseFloat(timeString);
      if (!isNaN(decimalHours)) {
        return decimalHours * 60 * 60 * 1000;
      }
      
      return DEFAULT_TIME_MS;
    } catch (error) {
      console.error('Error parsing time:', error);
      return DEFAULT_TIME_MS;
    }
  }, []);

  const getTotalTimeMs = useCallback((): number => {
    const quizTimeString = assignmentData?.others?.quiz_time || DEFAULT_QUIZ_TIME;
    return parseTimeStringToMs(quizTimeString);
  }, [assignmentData, parseTimeStringToMs]);

  const formatTime = useCallback((milliseconds: number): string => {
    if (milliseconds <= 0) return "00:00:00";
    
    const totalSeconds = Math.floor(milliseconds / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }, []);

  const getTimerColor = useCallback((): string => {
    if (timeLeft <= WARNING_THRESHOLD) {
      return "text-red-600 font-bold animate-pulse";
    }
    
    const quarterTime = getTotalTimeMs() * 0.25;
    if (timeLeft <= quarterTime) {
      return "text-orange-500 font-semibold";
    }
    
    return "text-gray-700";
  }, [timeLeft, getTotalTimeMs]);

  // Quiz data functions
  const normalize = useCallback((item: any): Question => {
    const typeKey = toTypeKey(item.type);
    let options: any[] = [];

    if (Array.isArray(item.options)) {
      options = item.options.slice();
    } else if (typeof item.options === "string") {
      try {
        const parsed = JSON.parse(item.options);
        options = Array.isArray(parsed) ? parsed.slice() : [String(parsed)];
      } catch {
        options = [item.options];
      }
    } else if (item.options == null) {
      options = [];
    } else {
      try {
        options = Object.values(item.options);
      } catch {
        options = [];
      }
    }

    if (typeKey === "multiple") {
      options = options.map((o: any) => (o == null ? "" : String(o)));
      while (options.length < 4) options.push("");
      if (options.length > 4) options = options.slice(0, 4);
    } else if (typeKey === "truefalse") {
      options = ["True", "False"];
    } else {
      options = options
        .map((o: any) => (typeof o === "string" ? o.trim() : o))
        .filter((o: any) => o !== null && o !== undefined && o !== "");
    }

    return {
      id: item.id,
      question: item.question ?? "",
      options,
      rawType: item.type,
      type: typeKey,
      raw: item,
    };
  }, []);

  // Timer management
  const startTimer = useCallback((): void => {
    const totalTimeMs = getTotalTimeMs();
    setTimeLeft(totalTimeMs);
    
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    timerRef.current = setInterval(() => {
      setTimeLeft(prevTime => {
        if (prevTime <= 1000) {
          if (timerRef.current) {
            clearInterval(timerRef.current);
          }
          setTimeUp(true);
          return 0;
        }
        
        const newTime = prevTime - 1000;
        
        if (newTime <= WARNING_THRESHOLD && !warningShownRef.current) {
          setShowTimeWarning(true);
          warningShownRef.current = true;
          
          setTimeout(() => {
            setShowTimeWarning(false);
          }, 10000);
        }
        
        return newTime;
      });
    }, 1000);
  }, [getTotalTimeMs]);

  // Quiz navigation
  const handleAnswer = useCallback((selectedValue: any): void => {
    setResults(prev => prev.map((result, index) => 
      index === currentIndex ? { ...result, selected: selectedValue } : result
    ));
  }, [currentIndex]);

  const nextQuestion = useCallback((): void => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(i => i + 1);
      setSidebarOpen(false);
    }
  }, [currentIndex, questions.length]);

  const prevQuestion = useCallback((): void => {
    if (currentIndex > 0) {
      setCurrentIndex(i => i - 1);
      setSidebarOpen(false);
    }
  }, [currentIndex]);

  const goToQuestion = useCallback((index: number): void => {
    setCurrentIndex(index);
    setSidebarOpen(false);
  }, []);

  // API handlers
  const handleAutoSubmit = useCallback(async (): Promise<void> => {
    if (submitting) return;
    
    setSubmitting(true);
    try {
      const payload = { assignment: assignmentId, student: student_id, results };
      const resp = await StudentApiService.postSubmittedResults(payload);

      let message = "Time's up! Your quiz has been automatically submitted.";
      
      if (resp && typeof (resp as ApiResponse).ok !== "undefined") {
        const apiResp = resp as ApiResponse;
        if (!apiResp.ok) {
          const text = apiResp.text ? await apiResp.text().catch(() => "Submission failed") : "Submission failed";
          throw new Error(text || "Submission failed");
        }
        const data = apiResp.json ? await apiResp.json().catch(() => ({})) : {};
        message = data.message || message;
      } else {
        message = (resp && (resp as any).message) || message;
      }

      setSubmitMessage(message);
      setShowSubmitModal(true);
      setSubmitted(true);
    } catch (err: any) {
      console.error("Auto-submit failed:", err);
      setSubmitMessage("Time's up! But there was an issue submitting your quiz. Please contact support.");
      setShowSubmitModal(true);
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  }, [assignmentId, results, student_id, submitting]);

  const submitResults = useCallback(async (): Promise<void> => {
    if (submitting) return;
    setSubmitting(true);
    
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    try {
      const payload = { assignment: assignmentId, student: student_id, results };
      const resp = await StudentApiService.postSubmittedResults(payload);

      let message = "Your quiz has been submitted successfully.";
      
      if (resp && typeof (resp as ApiResponse).ok !== "undefined") {
        const apiResp = resp as ApiResponse;
        if (!apiResp.ok) {
          const text = apiResp.text ? await apiResp.text().catch(() => "Submission failed") : "Submission failed";
          throw new Error(text || "Submission failed");
        }
        const data = apiResp.json ? await apiResp.json().catch(() => ({})) : {};
        message = data.message || message;
      } else {
        message = (resp && (resp as any).message) || message;
      }

      setSubmitMessage(message);
      setShowSubmitModal(true);
      setSubmitted(true);
    } catch (err: any) {
      console.error("Submit failed:", err);
      setSubmitMessage(err?.message || "Submission failed. Please try again.");
      setShowSubmitModal(true);
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  }, [assignmentId, results, student_id, submitting]);

  // Effects
  useEffect(() => {
    if (timeUp && !submitted) {
      handleAutoSubmit();
    }
  }, [timeUp, submitted, handleAutoSubmit]);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!assignmentId) return;
    if (lastFetchedRef.current === assignmentId) return;

    let aborted = false;
    const fetchQuiz = async (): Promise<void> => {
      setLoading(true);
      try {
        const res = await StudentApiService.getQuizByAssignmentId(assignmentId);
        if (aborted) return;
        
        const list = Array.isArray(res) ? res : [];
        
        if (list.length === 0) {
          setQuestions([]);
          setResults([]);
          return;
        }

        const normalized = list.map(normalize);
        const initialResults: Result[] = normalized.map((q: Question) => ({
          id: q.id,
          type: q.type || "multiple",
          selected: null,
          is_correct: false,
        }));

        setQuestions(normalized);
        setResults(initialResults);
        setCurrentIndex(0);
        lastFetchedRef.current = assignmentId;
        startTimer();
      } catch (err) {
        if (!aborted) {
          console.error("Quiz fetch error:", err);
          setQuestions([]);
          setResults([]);
        }
      } finally {
        if (!aborted) setLoading(false);
      }
    };

    fetchQuiz();
    return () => { aborted = true; };
  }, [assignmentId, normalize, startTimer]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent): void => {
      if (e.key >= "1" && e.key <= "9") {
        const index = parseInt(e.key, 10) - 1;
        if (index < questions.length) {
          goToQuestion(index);
        }
      }

      if (currentQuestion?.type === "multiple") {
        if (e.key === "a" || e.key === "A") handleAnswer(currentQuestion.options[0]);
        if (e.key === "b" || e.key === "B") handleAnswer(currentQuestion.options[1]);
        if (e.key === "c" || e.key === "C") handleAnswer(currentQuestion.options[2]);
        if (e.key === "d" || e.key === "D") handleAnswer(currentQuestion.options[3]);
      } else if (currentQuestion?.type === "truefalse") {
        if (e.key === "t" || e.key === "T") handleAnswer("True");
        if (e.key === "f" || e.key === "F") handleAnswer("False");
      }

      if ((e.key === "ArrowRight")) nextQuestion();
      if ((e.key === "ArrowLeft")) prevQuestion();
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [currentQuestion, questions.length, handleAnswer, nextQuestion, prevQuestion, goToQuestion]);

  // Modal handlers
  const handleCloseSubmitModal = useCallback(() => {
    setShowSubmitModal(false);
    if (!submitMessage.toLowerCase().includes("fail") && onCancel) {
      onCancel();
      window.location.reload();
    }
  }, [submitMessage, onCancel]);

  // Loading state
  if (loading) {
    return (
      <div className="fixed inset-0 bg-gray-900 flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl p-8 w-full max-w-md mx-4 shadow-2xl">
          <div className="flex items-center justify-center gap-3">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <div className="text-lg font-medium text-gray-700">Loading quiz…</div>
          </div>
        </div>
      </div>
    );
  }

  // No questions state
  if (!questions.length) {
    return (
      <div className="fixed inset-0 bg-gray-900 flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl p-8 w-full max-w-md mx-4 shadow-2xl">
          <div className="text-center text-gray-700 mb-6">
            <div className="text-6xl mb-4">📝</div>
            <div className="text-xl font-semibold">No questions available</div>
          </div>
          <button
            onClick={onCancel}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-medium transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  // Sub-components for better organization
  const QuestionNavigation = () => (
    <div className="grid grid-cols-5 gap-2">
      {questions.map((_, index: number) => {
        const isAnswered = results[index]?.selected !== null;
        const isCurrent = index === currentIndex;

        return (
          <button
            key={index}
            onClick={() => goToQuestion(index)}
            className={`w-8 h-8 rounded flex items-center justify-center text-xs font-medium transition-all
              ${isCurrent ? "bg-blue-600 text-white ring-2 ring-blue-300" : 
                isAnswered ? "bg-green-500 text-white" : 
                "bg-white text-gray-600 border border-gray-300"
              } hover:shadow-md`}
          >
            {index + 1}
          </button>
        );
      })}
    </div>
  );

  const QuestionListPreview = () => (
    <div className="space-y-1 max-h-48 overflow-y-auto">
      {questions.map((q: Question, index: number) => (
        <button
          key={index}
          onClick={() => goToQuestion(index)}
          className={`w-full text-left p-2 rounded text-xs transition-all ${
            index === currentIndex ? "bg-blue-100 border border-blue-500" : "bg-white border border-gray-200 hover:bg-gray-50"
          }`}
        >
          <div className="flex items-center gap-2">
            <div className={`w-5 h-5 rounded flex items-center justify-center text-xs ${
              results[index]?.selected !== null ? "bg-green-500 text-white" : "bg-gray-200 text-gray-600"
            }`}>
              {index + 1}
            </div>
            <div className="truncate flex-1">
              {q.question.substring(0, 30)}...
            </div>
          </div>
        </button>
      ))}
    </div>
  );

  const ProgressBar = () => (
    <div className="bg-white rounded-lg p-3 shadow-sm mb-4">
      <div className="flex justify-between text-xs mb-2">
        <span className="text-gray-600">Progress</span>
        <span className="font-semibold">{progressPercentage}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-1.5">
        <div
          className="bg-green-500 h-1.5 rounded-full transition-all"
          style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
        ></div>
      </div>
    </div>
  );

  return (
    <>
      {/* Main Modal */}
      <div className="fixed inset-0 bg-gray-900 flex flex-col z-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b border-gray-200 py-3 px-4 md:px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                className="md:hidden p-2 rounded-md hover:bg-gray-100"
                onClick={() => setSidebarOpen((s) => !s)}
                aria-label="Toggle questions navigation"
              >
                <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>

              <h1 className="text-lg font-bold text-gray-900">Exam Portal</h1>
              <div className="w-px h-6 bg-gray-300 hidden sm:block"></div>
              <div className="text-sm text-gray-600 hidden sm:block">
                Question {currentIndex + 1} of {questions.length}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className={`text-sm font-mono ${getTimerColor()}`}>
                {formatTime(timeLeft)}
              </div>
              
              <div className="bg-blue-50 text-blue-700 px-3 py-1 rounded text-sm">
                Answered: {answeredCount}/{questions.length}
              </div>
              <button
                onClick={onCancel}
                className="text-gray-500 hover:text-gray-700 text-xl font-bold w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100 transition-colors"
                aria-label="Close quiz"
              >
                ×
              </button>
            </div>
          </div>
        </div>

        {/* Time Warning Modal */}
        {showTimeWarning && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-2xl p-6 max-w-sm mx-4 shadow-2xl animate-bounce">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-gray-900">Time Warning</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Only 15 minutes remaining! Please review your answers and submit soon.
              </p>
              <button
                onClick={() => setShowTimeWarning(false)}
                className="w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 font-medium transition-colors"
              >
                Understood
              </button>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Navigation Sidebar */}
          <aside className="hidden md:block w-64 bg-gray-50 border-r border-gray-200 p-4 overflow-auto">
            <h3 className="font-semibold text-gray-800 mb-3 text-sm">Questions</h3>
            <ProgressBar />
            <QuestionNavigation />
            <div className="mt-4">
              <QuestionListPreview />
            </div>
          </aside>

          {/* Mobile Sidebar */}
          {sidebarOpen && (
            <div className="md:hidden fixed inset-0 z-40">
              <div
                className="absolute inset-0 bg-black bg-opacity-40"
                onClick={() => setSidebarOpen(false)}
                aria-hidden="true"
              />
              <div className="absolute left-0 top-0 bottom-0 w-80 bg-white border-r border-gray-200 p-4 overflow-auto">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold">Questions</h4>
                  <button 
                    onClick={() => setSidebarOpen(false)} 
                    className="p-1 rounded hover:bg-gray-100 transition-colors"
                  >
                    ✕
                  </button>
                </div>
                <ProgressBar />
                <QuestionNavigation />
                <div className="mt-4">
                  <QuestionListPreview />
                </div>
              </div>
            </div>
          )}

          {/* MCQ Area */}
          <div className="flex-1 flex flex-col bg-white min-h-0">
            <div className="flex-1 p-4 sm:p-6 overflow-auto">
              {currentQuestion && (
                <MCQ
                  key={currentQuestion.id}
                  question={currentQuestion.question}
                  options={currentQuestion.options}
                  type={currentQuestion.type || "multiple"}
                  onAnswer={handleAnswer}
                  selectedAnswer={currentResult?.selected || null}
                  assignmentData={assignmentData}
                />
              )}
            </div>

            {/* Navigation buttons */}
            <div className="border-t border-gray-200 bg-white p-3 sm:p-4">
              <div className="flex flex-col sm:flex-row justify-between items-center max-w-4xl mx-auto gap-3">
                <button
                  onClick={prevQuestion}
                  disabled={currentIndex === 0}
                  className={`w-full sm:w-auto px-6 py-2 rounded-lg font-medium text-sm transition-colors ${
                    currentIndex === 0 ? "bg-gray-200 text-gray-500 cursor-not-allowed" : "bg-blue-600 text-white hover:bg-blue-700"
                  }`}
                >
                  ← Previous Question
                </button>

                <div className="text-sm text-gray-600">
                  {currentIndex + 1} of {questions.length}
                </div>

                {currentIndex === questions.length - 1 ? (
                  <button
                    onClick={submitResults}
                    disabled={submitting}
                    className={`w-full sm:w-auto px-6 py-2 bg-green-600 text-white rounded-lg font-medium text-sm hover:bg-green-700 transition-colors ${
                      submitting ? "opacity-70 cursor-not-allowed" : ""
                    }`}
                  >
                    {submitting ? "Submitting…" : "Submit Quiz"}
                  </button>
                ) : (
                  <button
                    onClick={nextQuestion}
                    className="w-full sm:w-auto px-6 py-2 bg-blue-600 text-white rounded-lg font-medium text-sm hover:bg-blue-700 transition-colors"
                  >
                    Next Question →
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Submission Popup */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black bg-opacity-50">
          <div className="relative w-full max-w-md mx-4 p-6 rounded-2xl bg-white shadow-2xl animate-[fadeInUp_240ms_ease]">
            <div className="flex flex-col items-center">
              <div className="flex items-center justify-center w-28 h-28 rounded-full bg-gradient-to-br from-green-100 to-green-50 ring-4 ring-white shadow-lg mb-4">
                {submitMessage.toLowerCase().includes("fail") ? (
                  <svg className="w-12 h-12 text-red-600" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M18 6L6 18M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="w-12 h-12 text-green-700" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>

              <h3 className="text-xl font-extrabold text-gray-900 mb-1">
                {submitMessage.toLowerCase().includes("fail") ? "Submission Failed" : 
                 timeUp ? "Time's Up!" : "Quiz Submitted"}
              </h3>

              <p className="text-sm text-gray-600 text-center mb-4 px-2">
                {submitMessage || (submitMessage.toLowerCase().includes("fail") ? "Something went wrong." : 
                 timeUp ? "Your quiz has been automatically submitted." : "Your responses were submitted successfully.")}
              </p>

              <div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
                <span className="px-2 py-1 bg-gray-100 rounded-full">Assignment: {assignmentId ?? "—"}</span>
                <span className="px-2 py-1 bg-gray-100 rounded-full">{new Date().toLocaleString()}</span>
              </div>

              <div className="flex w-full gap-3">
                <button
                  onClick={handleCloseSubmitModal}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold shadow hover:scale-[1.02] transition-all"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  OK
                </button>

                <button
                  onClick={() => setShowSubmitModal(false)}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-white border border-gray-200 text-gray-700 font-medium shadow-sm hover:bg-gray-50 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Quiz;



// import React, { useEffect, useRef, useState } from "react";
// import MCQ from "./MCQ";
// import StudentApiService from "@/services/studentApi";

// // Define types
// interface Question {
//   id: string | number;
//   question: string;
//   options: any[];
//   type?: string;
//   [key: string]: any;
// }

// interface Result {
//   id: string | number;
//   type: string;
//   selected: any;
//   is_correct: boolean;
// }

// interface AssignmentData {
//   others?: {
//     quiz_time?: string;
//   };
//   [key: string]: any;
// }

// interface QuizProps {
//   assignmentId: string | number;
//   onCancel: () => void;
//   assignmentData: AssignmentData;
// }

// interface ApiResponse<T = any> {
//   ok?: boolean;
//   json?: () => Promise<T>;
//   text?: () => Promise<string>;
//   message?: string;
//   [key: string]: any;
// }

// const toTypeKey = (rawType: any): string => {
//   if (!rawType && rawType !== "") return "multiple";
//   return String(rawType).toLowerCase().replace(/[-_\s]/g, "");
// };

// const Quiz = ({ assignmentId, onCancel, assignmentData }: QuizProps) => {
//   const [questions, setQuestions] = useState<Question[]>([]);
//   const [results, setResults] = useState<Result[]>([]);
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [loading, setLoading] = useState(false);
//   const [submitting, setSubmitting] = useState(false);
//   const [submitted, setSubmitted] = useState(false);
//   const [submitMessage, setSubmitMessage] = useState("");
//   const [showSubmitModal, setShowSubmitModal] = useState(false);
  
//   // Timer states
//   const [timeLeft, setTimeLeft] = useState(0);
//   const [showTimeWarning, setShowTimeWarning] = useState(false);
//   const [timeUp, setTimeUp] = useState(false);

//   // UI responsiveness
//   const [sidebarOpen, setSidebarOpen] = useState(false);

//   const lastFetchedRef = useRef<string | number | null>(null);
//   const mountedRef = useRef(true);
//   const timerRef = useRef<NodeJS.Timeout | null>(null);
//   const warningShownRef = useRef(false);
//   const student_id = localStorage.getItem("id");

//   // Parse time string like "1:30" (hours:minutes) to milliseconds
//   const parseTimeStringToMs = (timeString: string): number => {
//     if (!timeString) return 60 * 60 * 1000; // Default 1 hour
    
//     try {
//       const parts = timeString.split(':');
//       if (parts.length === 2) {
//         const hours = parseInt(parts[0], 10);
//         const minutes = parseInt(parts[1], 10);
        
//         if (!isNaN(hours) && !isNaN(minutes)) {
//           return (hours * 60 * 60 * 1000) + (minutes * 60 * 1000);
//         }
//       }
      
//       // Fallback: try to parse as decimal hours
//       const decimalHours = parseFloat(timeString);
//       if (!isNaN(decimalHours)) {
//         return decimalHours * 60 * 60 * 1000;
//       }
      
//       return 60 * 60 * 1000; // Default 1 hour
//     } catch (error) {
//       console.error('Error parsing time:', error);
//       return 60 * 60 * 1000; // Default 1 hour
//     }
//   };

//   // Calculate total time in milliseconds
//   const getTotalTimeMs = (): number => {
//     const quizTimeString = assignmentData?.others?.quiz_time || "1:00";
//     return parseTimeStringToMs(quizTimeString);
//   };

//   // Format time for display
//   const formatTime = (milliseconds: number): string => {
//     if (milliseconds <= 0) return "00:00:00";
    
//     const totalSeconds = Math.floor(milliseconds / 1000);
//     const hours = Math.floor(totalSeconds / 3600);
//     const minutes = Math.floor((totalSeconds % 3600) / 60);
//     const seconds = totalSeconds % 60;

//     if (hours > 0) {
//       return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
//     }
//     return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
//   };

//   // Get timer color based on time left
//   const getTimerColor = (): string => {
//     const totalTime = getTotalTimeMs();
//     const warningThreshold = 15 * 60 * 1000; // 15 minutes
    
//     if (timeLeft <= warningThreshold) {
//       return "text-red-600 font-bold animate-pulse";
//     }
    
//     const quarterTime = totalTime * 0.25;
//     if (timeLeft <= quarterTime) {
//       return "text-orange-500 font-semibold";
//     }
    
//     return "text-gray-700";
//   };

//   // Start the countdown timer
//   const startTimer = (): void => {
//     const totalTimeMs = getTotalTimeMs();
//     setTimeLeft(totalTimeMs);
    
//     if (timerRef.current) {
//       clearInterval(timerRef.current);
//     }

//     timerRef.current = setInterval(() => {
//       setTimeLeft(prevTime => {
//         if (prevTime <= 1000) {
//           if (timerRef.current) {
//             clearInterval(timerRef.current);
//           }
//           setTimeUp(true);
//           return 0;
//         }
        
//         const newTime = prevTime - 1000;
        
//         // Show warning when 15 minutes left (if not already shown)
//         if (newTime <= 15 * 60 * 1000 && !warningShownRef.current) {
//           setShowTimeWarning(true);
//           warningShownRef.current = true;
          
//           // Auto-hide warning after 10 seconds
//           setTimeout(() => {
//             setShowTimeWarning(false);
//           }, 10000);
//         }
        
//         return newTime;
//       });
//     }, 1000);
//   };

//   // Auto-submit when time is up
//   useEffect(() => {
//     if (timeUp && !submitted) {
//       handleAutoSubmit();
//     }
//   }, [timeUp, submitted]);

//   const handleAutoSubmit = async (): Promise<void> => {
//     if (submitting) return;
    
//     setSubmitting(true);
//     try {
//       const payload = { assignment: assignmentId, student: student_id, results };
//       const resp = await StudentApiService.postSubmittedResults(payload);

//       let message = "Time's up! Your quiz has been automatically submitted.";
      
//       if (resp && typeof (resp as ApiResponse).ok !== "undefined") {
//         const apiResp = resp as ApiResponse;
//         if (!apiResp.ok) {
//           const text = apiResp.text ? await apiResp.text().catch(() => "Submission failed") : "Submission failed";
//           throw new Error(text || "Submission failed");
//         }
//         const data = apiResp.json ? await apiResp.json().catch(() => ({})) : {};
//         message = data.message || message;
//       } else {
//         message = (resp && (resp as any).message) || message;
//       }

//       setSubmitMessage(message);
//       setShowSubmitModal(true);
//       setSubmitted(true);
//     } catch (err: any) {
//       console.error("Auto-submit failed:", err);
//       setSubmitMessage("Time's up! But there was an issue submitting your quiz. Please contact support.");
//       setShowSubmitModal(true);
//       setSubmitted(true);
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   // Cleanup timer on unmount
//   // useEffect(() => {
//   //   return () => {
//   //     if (timerRef.current) {
//   //       clearInterval(timerRef.current);
//   //     }
//   //     mountedRef.current = false;
//   //   };
//   // }, []);

//   const normalize = (item: any): Question => {
//     const typeKey = toTypeKey(item.type);

//     let options: any[] = [];
//     if (Array.isArray(item.options)) {
//       options = item.options.slice();
//     } else if (typeof item.options === "string") {
//       try {
//         const parsed = JSON.parse(item.options);
//         if (Array.isArray(parsed)) options = parsed.slice();
//         else options = [String(parsed)];
//       } catch {
//         options = [item.options];
//       }
//     } else if (item.options == null) {
//       options = [];
//     } else {
//       try {
//         options = Object.values(item.options);
//       } catch {
//         options = [];
//       }
//     }

//     if (typeKey === "multiple") {
//       options = options.map((o: any) => (o == null ? "" : String(o)));
//       while (options.length < 4) options.push("");
//       if (options.length > 4) options = options.slice(0, 4);
//     } else if (typeKey === "truefalse") {
//       options = ["true", "false"];
//     } else {
//       options = options
//         .map((o: any) => (typeof o === "string" ? o.trim() : o))
//         .filter((o: any) => o !== null && o !== undefined && o !== "");
//     }

//     return {
//       id: item.id,
//       question: item.question ?? "",
//       options,
//       rawType: item.type,
//       type: typeKey,
//       raw: item,
//     };
//   };

//  useEffect(() => {
//   if (!assignmentId) return;
//   if (lastFetchedRef.current === assignmentId) return;

//   let aborted = false;
//   const run = async (): Promise<void> => {
//     setLoading(true);
//     try {
//       const res = await StudentApiService.getQuizByAssignmentId(assignmentId);
//       console.log("API response:", res);
      
//       // Remove the mountedRef check since it's causing issues
//       if (aborted) return;
      
//       // The response is already an array, use it directly
//       const list = Array.isArray(res) ? res : [];
//       console.log("Processed list:", list);

//       if (list.length === 0) {
//         console.warn("No questions found");
//         setQuestions([]);
//         setResults([]);
//         return;
//       }

//       const normalized = list.map(normalize);
//       console.log("Normalized questions:", normalized);

//       const initialResults: Result[] = normalized.map((q: Question) => ({
//         id: q.id,
//         type: q.type || "multiple",
//         selected: null,
//         is_correct: false,
//       }));

//       setQuestions(normalized);
//       setResults(initialResults);
//       setCurrentIndex(0);
//       lastFetchedRef.current = assignmentId;
      
//       // Start timer after questions are loaded
//       startTimer();
//     } catch (err) {
//       if (!aborted) {
//         console.error("Quiz fetch error:", err);
//         setQuestions([]);
//         setResults([]);
//       }
//     } finally {
//       if (!aborted) setLoading(false);
//     }
//   };

//   run();
  
//   return () => {
//     aborted = true;
//   };
// }, [assignmentId]);

//   const handleAnswer = (selectedValue: any): void => {
//     setResults((prev: Result[]) => {
//       const newResults = prev.map((result: Result, index: number) => {
//         if (index === currentIndex) {
//           return {
//             ...result,
//             selected: selectedValue,
//           };
//         }
//         return result;
//       });
//       return newResults;
//     });
//   };

//   const nextQuestion = (): void => {
//     if (currentIndex < questions.length - 1) {
//       setCurrentIndex((i) => i + 1);
//       setSidebarOpen(false);
//     }
//   };

//   const prevQuestion = (): void => {
//     if (currentIndex > 0) {
//       setCurrentIndex((i) => i - 1);
//       setSidebarOpen(false);
//     }
//   };

//   const goToQuestion = (index: number): void => {
//     setCurrentIndex(index);
//     setSidebarOpen(false);
//   };

//   const submitResults = async (): Promise<void> => {
//     if (submitting) return;
//     setSubmitting(true);
    
//     // Clear timer when manually submitting
//     if (timerRef.current) {
//       clearInterval(timerRef.current);
//     }
    
//     try {
//       const payload = { assignment: assignmentId, student: student_id, results };
//       const resp = await StudentApiService.postSubmittedResults(payload);

//       let message = "Your quiz has been submitted successfully.";
      
//       if (resp && typeof (resp as ApiResponse).ok !== "undefined") {
//         const apiResp = resp as ApiResponse;
//         if (!apiResp.ok) {
//           const text = apiResp.text ? await apiResp.text().catch(() => "Submission failed") : "Submission failed";
//           throw new Error(text || "Submission failed");
//         }
//         const data = apiResp.json ? await apiResp.json().catch(() => ({})) : {};
//         message = data.message || message;
//       } else {
//         message = (resp && (resp as any).message) || message;
//       }

//       setSubmitMessage(message);
//       setShowSubmitModal(true);
//       setSubmitted(true);
//     } catch (err: any) {
//       console.error("Submit failed:", err);
//       setSubmitMessage(err?.message || "Submission failed. Please try again.");
//       setShowSubmitModal(true);
//       setSubmitted(true);
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   const currentQuestion = questions[currentIndex];
//   const currentResult = results[currentIndex];

//   // Add keyboard navigation
//   useEffect(() => {
//     const handleKeyPress = (e: KeyboardEvent): void => {
//       if (e.key >= "1" && e.key <= "9") {
//         const index = parseInt(e.key, 10) - 1;
//         if (index < questions.length) {
//           goToQuestion(index);
//         }
//       }

//       if (currentQuestion?.type === "multiple") {
//         if (e.key === "a" || e.key === "A") handleAnswer(currentQuestion.options[0]);
//         if (e.key === "b" || e.key === "B") handleAnswer(currentQuestion.options[1]);
//         if (e.key === "c" || e.key === "C") handleAnswer(currentQuestion.options[2]);
//         if (e.key === "d" || e.key === "D") handleAnswer(currentQuestion.options[3]);
//       } else if (currentQuestion?.type === "truefalse") {
//         if (e.key === "t" || e.key === "T") handleAnswer("true");
//         if (e.key === "f" || e.key === "F") handleAnswer("false");
//       }

//       if ((e.key === "ArrowRight")) {
//         nextQuestion();
//       }
//       if ((e.key === "ArrowLeft")) {
//         prevQuestion();
//       }
//     };

//     window.addEventListener("keydown", handleKeyPress);
//     return () => window.removeEventListener("keydown", handleKeyPress);
//   }, [currentQuestion, questions.length]);

//   if (loading) {
//     return (
//       <div className="fixed inset-0 bg-gray-900 flex items-center justify-center z-50">
//         <div className="bg-white rounded-2xl p-8 w-full max-w-md mx-4 shadow-2xl">
//           <div className="flex items-center justify-center gap-3">
//             <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
//             <div className="text-lg font-medium text-gray-700">Loading quiz…</div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   if (!questions.length) {
//     return (
//       <div className="fixed inset-0 bg-gray-900 flex items-center justify-center z-50">
//         <div className="bg-white rounded-2xl p-8 w-full max-w-md mx-4 shadow-2xl">
//           <div className="text-center text-gray-700 mb-6">
//             <div className="text-6xl mb-4">📝</div>
//             <div className="text-xl font-semibold">No questions available</div>
//           </div>
//           <button
//             onClick={onCancel}
//             className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-medium"
//           >
//             Close
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <>
//       {/* Main Modal - Full Screen */}
//       <div className="fixed inset-0 bg-gray-900 flex flex-col z-50">
//         {/* Header */}
//         <div className="bg-white shadow-sm border-b border-gray-200 py-3 px-4 md:px-6">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center gap-4">
//               {/* Sidebar toggle shown on small screens */}
//               <button
//                 className="md:hidden p-2 rounded-md hover:bg-gray-100"
//                 onClick={() => setSidebarOpen((s) => !s)}
//                 aria-label="Toggle questions navigation"
//               >
//                 <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
//                 </svg>
//               </button>

//               <h1 className="text-lg font-bold text-gray-900">Exam Portal</h1>
//               <div className="w-px h-6 bg-gray-300 hidden sm:block"></div>
//               <div className="text-sm text-gray-600 hidden sm:block">
//                 Question {currentIndex + 1} of {questions.length}
//               </div>
//             </div>

//             <div className="flex items-center gap-3">
//               {/* Timer Display */}
//               <div className={`text-sm font-mono ${getTimerColor()}`}>
//                 {formatTime(timeLeft)}
//               </div>
              
//               <div className="bg-blue-50 text-blue-700 px-3 py-1 rounded text-sm">
//                 Answered: {results.filter((r: Result) => r.selected !== null).length}/{questions.length}
//               </div>
//               <button
//                 onClick={onCancel}
//                 className="text-gray-500 hover:text-gray-700 text-xl font-bold w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100"
//                 aria-label="Close quiz"
//               >
//                 ×
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Time Warning Modal */}
//         {showTimeWarning && (
//           <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
//             <div className="bg-white rounded-2xl p-6 max-w-sm mx-4 shadow-2xl animate-bounce">
//               <div className="flex items-center gap-3 mb-4">
//                 <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
//                   <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//                   </svg>
//                 </div>
//                 <h3 className="text-lg font-bold text-gray-900">Time Warning</h3>
//               </div>
//               <p className="text-gray-600 mb-4">
//                 Only 15 minutes remaining! Please review your answers and submit soon.
//               </p>
//               <button
//                 onClick={() => setShowTimeWarning(false)}
//                 className="w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 font-medium"
//               >
//                 Understood
//               </button>
//             </div>
//           </div>
//         )}

//         {/* Main Content */}
//         <div className="flex-1 flex overflow-hidden">
//           {/* Navigation Sidebar */}
//           <aside
//             className={`hidden md:block w-64 bg-gray-50 border-r border-gray-200 p-4 overflow-auto`}
//             aria-hidden={!sidebarOpen && true}
//           >
//             <h3 className="font-semibold text-gray-800 mb-3 text-sm">Questions</h3>

//             {/* Progress */}
//             <div className="bg-white rounded-lg p-3 shadow-sm mb-4">
//               <div className="flex justify-between text-xs mb-2">
//                 <span className="text-gray-600">Progress</span>
//                 <span className="font-semibold">
//                   {Math.round((results.filter((r: Result) => r.selected !== null).length / questions.length) * 100)}%
//                 </span>
//               </div>
//               <div className="w-full bg-gray-200 rounded-full h-1.5">
//                 <div
//                   className="bg-green-500 h-1.5 rounded-full transition-all"
//                   style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
//                 ></div>
//               </div>
//             </div>

//             {/* Questions Grid */}
//             <div className="grid grid-cols-5 gap-2">
//               {questions.map((_, index: number) => {
//                 const isAnswered = results[index]?.selected !== null;
//                 const isCurrent = index === currentIndex;

//                 return (
//                   <button
//                     key={index}
//                     onClick={() => goToQuestion(index)}
//                     className={`w-8 h-8 rounded flex items-center justify-center text-xs font-medium transition-all
//                       ${isCurrent ? "bg-blue-600 text-white ring-2 ring-blue-300" : isAnswered ? "bg-green-500 text-white" : "bg-white text-gray-600 border border-gray-300"
//                     } hover:shadow-md`}
//                     aria-current={isCurrent ? "true" : "false"}
//                   >
//                     {index + 1}
//                   </button>
//                 );
//               })}
//             </div>

//             {/* Question List Preview */}
//             <div className="mt-4 space-y-1 max-h-48 overflow-y-auto">
//               {questions.map((q: Question, index: number) => (
//                 <button
//                   key={index}
//                   onClick={() => goToQuestion(index)}
//                   className={`w-full text-left p-2 rounded text-xs transition-all ${
//                     index === currentIndex ? "bg-blue-100 border border-blue-500" : "bg-white border border-gray-200 hover:bg-gray-50"
//                   }`}
//                 >
//                   <div className="flex items-center gap-2">
//                     <div
//                       className={`w-5 h-5 rounded flex items-center justify-center text-xs ${
//                         results[index]?.selected !== null ? "bg-green-500 text-white" : "bg-gray-200 text-gray-600"
//                       }`}
//                     >
//                       {index + 1}
//                     </div>
//                     <div className="truncate flex-1">
//                       {q.question.substring(0, 30)}...
//                     </div>
//                   </div>
//                 </button>
//               ))}
//             </div>
//           </aside>

//           {/* Mobile Sidebar */}
//           {sidebarOpen && (
//             <div className="md:hidden fixed inset-0 z-40">
//               <div
//                 className="absolute inset-0 bg-black bg-opacity-40"
//                 onClick={() => setSidebarOpen(false)}
//                 aria-hidden="true"
//               />
//               <div className="absolute left-0 top-0 bottom-0 w-80 bg-white border-r border-gray-200 p-4 overflow-auto">
//                 <div className="flex items-center justify-between mb-3">
//                   <h4 className="font-semibold">Questions</h4>
//                   <button onClick={() => setSidebarOpen(false)} className="p-1 rounded hover:bg-gray-100">
//                     ✕
//                   </button>
//                 </div>

//                 <div className="bg-white rounded-lg p-3 shadow-sm mb-4">
//                   <div className="flex justify-between text-xs mb-2">
//                     <span className="text-gray-600">Progress</span>
//                     <span className="font-semibold">
//                       {Math.round((results.filter((r: Result) => r.selected !== null).length / questions.length) * 100)}%
//                     </span>
//                   </div>
//                   <div className="w-full bg-gray-200 rounded-full h-1.5">
//                     <div
//                       className="bg-green-500 h-1.5 rounded-full transition-all"
//                       style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
//                     ></div>
//                   </div>
//                 </div>

//                 <div className="grid grid-cols-5 gap-2">
//                   {questions.map((_, index: number) => {
//                     const isAnswered = results[index]?.selected !== null;
//                     const isCurrent = index === currentIndex;

//                     return (
//                       <button
//                         key={index}
//                         onClick={() => goToQuestion(index)}
//                         className={`w-8 h-8 rounded flex items-center justify-center text-xs font-medium transition-all
//                           ${isCurrent ? "bg-blue-600 text-white ring-2 ring-blue-300" : isAnswered ? "bg-green-500 text-white" : "bg-white text-gray-600 border border-gray-300"
//                         } hover:shadow-md`}
//                       >
//                         {index + 1}
//                       </button>
//                     );
//                   })}
//                 </div>

//                 <div className="mt-4 space-y-1">
//                   {questions.map((q: Question, index: number) => (
//                     <button
//                       key={index}
//                       onClick={() => goToQuestion(index)}
//                       className={`w-full text-left p-2 rounded text-xs transition-all ${
//                         index === currentIndex ? "bg-blue-100 border border-blue-500" : "bg-white border border-gray-200 hover:bg-gray-50"
//                       }`}
//                     >
//                       <div className="flex items-center gap-2">
//                         <div className={`w-5 h-5 rounded flex items-center justify-center text-xs ${
//                           results[index]?.selected !== null ? "bg-green-500 text-white" : "bg-gray-200 text-gray-600"
//                         }`}>{index + 1}</div>
//                         <div className="truncate flex-1">{q.question.substring(0, 40)}...</div>
//                       </div>
//                     </button>
//                   ))}
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* MCQ Area */}
//           <div className="flex-1 flex flex-col bg-white min-h-0">
//             <div className="flex-1 p-4 sm:p-6 overflow-auto">
//               {currentQuestion && (
//                 <MCQ
//                   key={currentQuestion.id}
//                   question={currentQuestion.question}
//                   options={currentQuestion.options}
//                   type={currentQuestion.type || "multiple"}
//                   onAnswer={handleAnswer}
//                   selectedAnswer={currentResult?.selected || null}
//                   assignmentData={assignmentData}
//                 />
//               )}
//             </div>

//             {/* Navigation buttons */}
//             <div className="border-t border-gray-200 bg-white p-3 sm:p-4">
//               <div className="flex flex-col sm:flex-row justify-between items-center max-w-4xl mx-auto gap-3">
//                 <button
//                   onClick={prevQuestion}
//                   disabled={currentIndex === 0}
//                   className={`w-full sm:w-auto px-6 py-2 rounded-lg font-medium text-sm ${
//                     currentIndex === 0 ? "bg-gray-200 text-gray-500 cursor-not-allowed" : "bg-blue-600 text-white hover:bg-blue-700"
//                   }`}
//                 >
//                   ← Previous Question
//                 </button>

//                 <div className="text-sm text-gray-600">
//                   {currentIndex + 1} of {questions.length}
//                 </div>

//                 {currentIndex === questions.length - 1 ? (
//                   <button
//                     onClick={submitResults}
//                     disabled={submitting}
//                     className={`w-full sm:w-auto px-6 py-2 bg-green-600 text-white rounded-lg font-medium text-sm hover:bg-green-700 ${
//                       submitting ? "opacity-70 cursor-not-allowed" : ""
//                     }`}
//                   >
//                     {submitting ? "Submitting…" : "Submit Quiz"}
//                   </button>
//                 ) : (
//                   <button
//                     onClick={nextQuestion}
//                     className="w-full sm:w-auto px-6 py-2 bg-blue-600 text-white rounded-lg font-medium text-sm hover:bg-blue-700"
//                   >
//                     Next Question →
//                   </button>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Submission Popup */}
//       {showSubmitModal && (
//         <div
//           className="fixed inset-0 z-[60] flex items-center justify-center bg-black bg-opacity-50"
//           role="dialog"
//           aria-modal="true"
//           aria-labelledby="submit-modal-title"
//         >
//           <div
//             className="relative w-full max-w-md mx-4 p-6 rounded-2xl bg-white shadow-2xl transform transition-all duration-300 ease-out
//                      animate-[fadeInUp_240ms_ease] sm:animate-[none]"
//             style={{ animationFillMode: "forwards" }}
//           >
//             <div className="flex flex-col items-center">
//               <div
//                 className={`flex items-center justify-center w-28 h-28 rounded-full bg-gradient-to-br from-green-100 to-green-50
//                             ring-4 ring-white shadow-lg mb-4`}
//                 aria-hidden="true"
//               >
//                 {submitMessage.toLowerCase().includes("fail") ? (
//                   <svg className="w-12 h-12 text-red-600" viewBox="0 0 24 24" fill="none" stroke="currentColor">
//                     <path strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M18 6L6 18M6 6l12 12" />
//                   </svg>
//                 ) : (
//                   <svg className="w-12 h-12 text-green-700" viewBox="0 0 24 24" fill="none" stroke="currentColor">
//                     <path strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
//                   </svg>
//                 )}
//               </div>

//               <h3 id="submit-modal-title" className="text-xl font-extrabold text-gray-900 mb-1">
//                 {submitMessage.toLowerCase().includes("fail") ? "Submission Failed" : 
//                  timeUp ? "Time's Up!" : "Quiz Submitted"}
//               </h3>

//               <p className="text-sm text-gray-600 text-center mb-4 px-2">
//                 {submitMessage || (submitMessage.toLowerCase().includes("fail") ? "Something went wrong." : 
//                  timeUp ? "Your quiz has been automatically submitted." : "Your responses were submitted successfully.")}
//               </p>

//               <div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
//                 <span className="px-2 py-1 bg-gray-100 rounded-full">Assignment: {assignmentId ?? "—"}</span>
//                 <span className="px-2 py-1 bg-gray-100 rounded-full">{new Date().toLocaleString()}</span>
//               </div>

//               <div className="flex w-full gap-3">
//                 <button
//                   onClick={() => {
//                     setShowSubmitModal(false);
//                     if (!submitMessage.toLowerCase().includes("fail") && onCancel) {
//                       onCancel();
//                       window.location.reload();
//                     }
//                   }}
//                   className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold shadow hover:scale-[1.02] transition-transform focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-300"
//                 >
//                   <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
//                     <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
//                   </svg>
//                   OK
//                 </button>

//                 <button
//                   onClick={() => setShowSubmitModal(false)}
//                   className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-white border border-gray-200 text-gray-700 font-medium shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-200"
//                 >
//                   Close
//                 </button>
//               </div>
//             </div>

//             <div aria-hidden className="pointer-events-none absolute -right-6 -top-6">
//               <div className="w-2 h-2 bg-yellow-400 rounded-full mb-2 animate-pulse"></div>
//               <div className="w-2 h-2 bg-pink-400 rounded-full mt-6 animate-pulse"></div>
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   );
// };

// export default Quiz;