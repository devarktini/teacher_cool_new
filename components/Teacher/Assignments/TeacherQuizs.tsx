'use client'
import React, { useState, useEffect, useRef } from "react";
import * as XLSX from "xlsx";
import toast from "react-hot-toast";
import TeacherApiService from "@/services/teacherApi";

// ===========================
// TypeScript Interfaces
// ===========================

interface QuestionOption {
  type: "multiple" | "true_false";
  question: string;
  options: string[];
  answer: string;
}

interface Assignment {
  id: string;
  title: string;
}

interface Quiz {
  id: string;
  question: string;
  type: "multiple" | "true_false";
  options: string[];
  answer: string;
}

interface ParsedQuestion extends QuestionOption {
  _rowIndex: number;
}

interface ValidationError {
  row: number | string;
  issues: string[];
}

interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
  cleanedQuestions: QuestionOption[];
}

interface UploadResult {
  successCount: number;
  errorCount: number;
}

interface TeacherQuizsProps {
  isModalOpen: boolean;
  setIsModalOpen: (value: boolean) => void;
}

// ===========================
// Type Guard Functions
// ===========================

const isQuiz = (item: any): item is Quiz => {
  return (
    typeof item === "object" &&
    item !== null &&
    typeof item.id === "string" &&
    typeof item.question === "string" &&
    (item.type === "multiple" || item.type === "true_false")
  );
};

const isQuizArray = (data: any): data is Quiz[] => {
  return Array.isArray(data) && (data.length === 0 || data.every(isQuiz));
};

const validateAndCastQuizzes = (data: any): Quiz[] => {
  if (isQuizArray(data)) {
    return data;
  }

  if (Array.isArray(data)) {
    return data.filter(isQuiz);
  }

  return [];
};

// ===========================
// Main Component
// ===========================

const TeacherQuizs: React.FC<TeacherQuizsProps> = ({ isModalOpen, setIsModalOpen }) => {
  // State Management
  const [assignmentTitle, setAssignmentTitle] = useState<string>("");
  const [assignmentId, setAssignmentId] = useState<string>("");
  const [assignment, setAssignment] = useState<Assignment[]>([]);
  const [existingQuizzes, setExistingQuizzes] = useState<Quiz[]>([]);
  const [questions, setQuestions] = useState<QuestionOption[]>([
    { type: "multiple", question: "", options: ["", "", "", ""], answer: "" },
  ]);
  const [loadingQuizzes, setLoadingQuizzes] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [deletingQuizId, setDeletingQuizId] = useState<string | null>(null);

  // Excel upload states
  const [excelPreview, setExcelPreview] = useState<QuestionOption[]>([]);
  const [excelErrors, setExcelErrors] = useState<ValidationError[]>([]);
  const [parsing, setParsing] = useState<boolean>(false);
  const [uploadingExcel, setUploadingExcel] = useState<boolean>(false);
  const [excelFileName, setExcelFileName] = useState<string>("");
  const [uploadMethod, setUploadMethod] = useState<"manual" | "file">("manual");

  // File input ref
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ===========================
  // useEffect Hooks
  // ===========================

  // Fetch assignments on mount
  useEffect(() => {
    TeacherApiService.getAssignment()
      .then((res) => {
        if (res) {
          setAssignment(res?.data || []);
        }
      })
      .catch((err) => {
        console.error("Fetch assignments failed:", err);
        toast.error("Failed to load assignments");
      });
  }, []);

  // Fetch quizzes when assignment changes
  useEffect(() => {
    if (!assignmentId) {
      setExistingQuizzes([]);
      setAssignmentTitle("");
      return;
    }

    const selected = assignment.find((a) => a.id === assignmentId);
    setAssignmentTitle(selected ? selected.title : "");

    setLoadingQuizzes(true);
    TeacherApiService.getQuizByAssignmentId(assignmentId)
      .then((res) => {
        const data = res?.results ?? res?.data ?? res;
        setExistingQuizzes(validateAndCastQuizzes(data));
      })
      .catch((err) => {
        console.error("Failed to load quizzes:", err);
        setExistingQuizzes([]);
        toast.error("Failed to load quizzes");
      })
      .finally(() => setLoadingQuizzes(false));
  }, [assignmentId, assignment]);

  // ===========================
  // Event Handlers
  // ===========================

  const handleUploadMethodChange = (method: "manual" | "file"): void => {
    setUploadMethod(method);
    if (method === "manual") {
      setExcelPreview([]);
      setExcelErrors([]);
      setExcelFileName("");
    } else {
      setQuestions([
        { type: "multiple", question: "", options: ["", "", "", ""], answer: "" },
      ]);
    }
  };

  const handleQuestionChange = (index: number, event: React.ChangeEvent<HTMLInputElement>): void => {
    const newQuestions = [...questions];
    newQuestions[index].question = event.target.value;
    setQuestions(newQuestions);
  };

  const handleTypeChange = (index: number, event: React.ChangeEvent<HTMLSelectElement>): void => {
    const newQuestions = [...questions];
    const val = event.target.value as "multiple" | "true_false";
    newQuestions[index].type = val;
    if (val === "true_false") {
      newQuestions[index].options = [];
    } else {
      newQuestions[index].options = ["", "", "", ""];
    }
    newQuestions[index].answer = "";
    setQuestions(newQuestions);
  };

  const handleOptionChange = (qIndex: number, optionIndex: number, event: React.ChangeEvent<HTMLInputElement>): void => {
    const newQuestions = [...questions];
    newQuestions[qIndex].options[optionIndex] = event.target.value;
    setQuestions(newQuestions);
  };

  const handleAnswerChange = (index: number, event: React.ChangeEvent<HTMLSelectElement>): void => {
    const newQuestions = [...questions];
    newQuestions[index].answer = event.target.value;
    setQuestions(newQuestions);
  };

  const addQuestion = (): void => {
    setQuestions([
      ...questions,
      { type: "multiple", question: "", options: ["", "", "", ""], answer: "" },
    ]);
  };

  const removeQuestion = (index: number): void => {
    const newQuestions = questions.filter((_, i) => i !== index);
    setQuestions(newQuestions);
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    const selectedId = e.target.value;
    setAssignmentId(selectedId);
  };

  // ===========================
  // Validation Functions
  // ===========================

  const validateQuestions = (qs: QuestionOption[]): boolean => {
    if (!qs || !qs.length) return false;
    for (const q of qs) {
      if (!q.question || !q.question.toString().trim()) return false;
      if (q.type === "multiple") {
        if (!q.options || q.options.length < 2) return false;
        const filledOptions = q.options.filter((o) => o && o.toString().trim());
        if (filledOptions.length < 2) return false;
        if (!q.answer || !q.answer.toString().trim()) return false;
        if (!filledOptions.includes(q.answer)) return false;
      } else if (q.type === "true_false") {
        if (!["true", "false"].includes(String(q.answer).toLowerCase())) return false;
      }
    }
    return true;
  };

  // ===========================
  // Submit Handlers
  // ===========================

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    if (!assignmentId) {
      toast.error("Please select an assignment first.");
      return;
    }

    if (!validateQuestions(questions)) {
      toast.error("Please fill valid question, options and select correct answer for each question.");
      return;
    }

    setSubmitting(true);
    try {
      await TeacherApiService.addMultipleQuizzes(assignmentId, questions);
      toast.success("Quiz submitted successfully!");
      setQuestions([
        { type: "multiple", question: "", options: ["", "", "", ""], answer: "" },
      ]);

      const res = await TeacherApiService.getQuizByAssignmentId(assignmentId);
      const data = res?.results ?? res?.data ?? res;
      setExistingQuizzes(validateAndCastQuizzes(data));
      setIsModalOpen(false);
    } catch (error) {
      console.error("Failed to add quizzes:", error);
      toast.error("Failed to submit quiz.");
    } finally {
      setSubmitting(false);
    }
  };

  // ===========================
  // Excel Utilities
  // ===========================

  const normalizeKey = (k: string | null | undefined): string =>
    (k || "").toString().trim().toLowerCase();

  const mapRowToQuestion = (row: Record<string, any>, rowIndex: number): ParsedQuestion => {
    const lowered: Record<string, any> = {};
    Object.keys(row).forEach((k) => {
      lowered[normalizeKey(k)] = row[k];
    });

    const rawType = (lowered["type"] || "multiple").toString().trim().toLowerCase();
    const type: "multiple" | "true_false" = rawType === "true_false" ? "true_false" : "multiple";

    const questionText = (lowered["question"] ?? lowered["q"] ?? "").toString().trim();

    const options: string[] = [];
    for (let i = 1; i <= 4; i++) {
      const val = lowered[`option${i}`] ?? lowered[`opt${i}`] ?? lowered[`o${i}`];
      if (val !== undefined && val !== null && val.toString().trim() !== "") {
        options.push(val.toString().trim());
      }
    }

    if (options.length === 0 && lowered["options"]) {
      const raw = lowered["options"].toString();
      const parts = raw.split(/[|;\/,]+/).map((p: string) => p.trim()).filter(Boolean);
      options.push(...parts);
    }

    let answerRaw = lowered["answer"];
    if (answerRaw === undefined || answerRaw === null) answerRaw = "";
    let answer = answerRaw.toString().trim();

    if (type === "true_false") {
      const v = answer.toString().toLowerCase();
      if (v === "1" || v === "yes" || v === "true" || v === "t") answer = "true";
      else answer = "false";
    } else {
      const answerIndex = parseInt(answer, 10);
      if (/^[1-4]$/.test(answer) && options[answerIndex - 1]) {
        answer = options[answerIndex - 1];
      }
    }

    return {
      _rowIndex: rowIndex,
      type,
      question: questionText,
      options: type === "multiple" ? (options.length ? options : ["", "", "", ""]) : [],
      answer,
    };
  };

  const validateParsedQuestions = (parsed: ParsedQuestion[]): ValidationResult => {
    const errors: ValidationError[] = [];
    const cleaned: QuestionOption[] = [];

    parsed.forEach((p, idx) => {
      const qErrors: string[] = [];
      if (!p.question || !p.question.toString().trim()) {
        qErrors.push("Missing question text.");
      }
      if (p.type === "multiple") {
        const filledOptions = (p.options || []).filter((o) => o && o.toString().trim());
        if (filledOptions.length < 2) qErrors.push("Need at least 2 options for multiple choice.");
        if (!p.answer || !p.answer.toString().trim()) qErrors.push("Missing answer.");
        else if (!filledOptions.includes(p.answer)) qErrors.push("Answer does not match provided options.");
      } else if (p.type === "true_false") {
        if (!["true", "false"].includes(String(p.answer).toLowerCase())) {
          qErrors.push("Answer must be 'true' or 'false'.");
        }
        p.answer = String(p.answer).toLowerCase();
      }
      if (qErrors.length) {
        errors.push({
          row: p._rowIndex + 2,
          issues: qErrors,
        });
      } else {
        if (p.type === "multiple") {
          const opts = (p.options || []).slice(0, 4);
          while (opts.length < 4) opts.push("");
          cleaned.push({ type: "multiple", question: p.question, options: opts, answer: p.answer });
        } else {
          cleaned.push({ type: "true_false", question: p.question, options: [], answer: p.answer });
        }
      }
    });

    return { valid: errors.length === 0, errors, cleanedQuestions: cleaned };
  };

  // ===========================
  // Upload Handlers
  // ===========================

  const uploadQuestionsInChunks = async (questionsToUpload: QuestionOption[], chunkSize: number = 50): Promise<UploadResult> => {
    const chunks: QuestionOption[][] = [];
    for (let i = 0; i < questionsToUpload.length; i += chunkSize) {
      chunks.push(questionsToUpload.slice(i, i + chunkSize));
    }

    let successCount = 0;
    let errorCount = 0;

    for (let i = 0; i < chunks.length; i++) {
      try {
        await TeacherApiService.addMultipleQuizzes(assignmentId, chunks[i]);
        successCount += chunks[i].length;

        if (chunks.length > 1) {
          toast(`Uploaded ${successCount} of ${questionsToUpload.length} questions...`);
        }
      } catch (error) {
        console.error(`Failed to upload chunk ${i + 1}:`, error);
        errorCount += chunks[i].length;
        toast.error(`Failed to upload ${chunks[i].length} questions in chunk ${i + 1}`);
      }
    }

    return { successCount, errorCount };
  };

  const handleFileInput = async (e: React.ChangeEvent<HTMLInputElement>): Promise<void> => {
    const file = e.target.files?.[0];
    if (!file) return;

    setExcelPreview([]);
    setExcelErrors([]);
    setParsing(true);
    setExcelFileName(file.name);

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const data = evt.target?.result;
        let workbook: XLSX.WorkBook;

        if (typeof data === "string") {
          workbook = XLSX.read(data, { type: "binary" });
        } else {
          const arr = new Uint8Array(data as ArrayBuffer);
          workbook = XLSX.read(arr, { type: "array" });
        }

        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const jsonRows = XLSX.utils.sheet_to_json(worksheet, { defval: "" });

        if (!jsonRows || !jsonRows.length) {
          setExcelErrors([{ row: "-", issues: ["No data found in the sheet."] }]);
          setParsing(false);
          return;
        }

        const parsed = jsonRows.map((r, idx) => mapRowToQuestion(r as Record<string, any>, idx));
        const { valid, errors, cleanedQuestions } = validateParsedQuestions(parsed);

        if (!valid) {
          setExcelErrors(errors);
          setExcelPreview(cleanedQuestions);
          toast.error("Excel parsed but found validation errors. Please review.");
        } else {
          setExcelErrors([]);
          setExcelPreview(cleanedQuestions);
          toast.success(`Parsed ${cleanedQuestions.length} questions from ${file.name}`);
        }
      } catch (err) {
        console.error("Error parsing excel", err);
        const errorMessage = err instanceof Error ? err.message : String(err);
        toast.error("Failed to parse the uploaded file. Make sure it's a valid Excel/CSV.");
        setExcelErrors([{ row: "-", issues: ["Parsing failed: " + errorMessage] }]);
      } finally {
        setParsing(false);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }
    };

    reader.readAsArrayBuffer(file);
  };

  const handleUploadParsed = async (): Promise<void> => {
    if (!assignmentId) {
      toast.error("Select an assignment before uploading bulk quizzes.");
      return;
    }
    if (!excelPreview || !excelPreview.length) {
      toast.error("No parsed questions to upload. Please upload and parse an Excel file first.");
      return;
    }

    if (!validateQuestions(excelPreview)) {
      toast.error("Parsed questions are invalid. Fix the Excel file or correct before uploading.");
      return;
    }

    setUploadingExcel(true);

    try {
      const { successCount, errorCount } = await uploadQuestionsInChunks(excelPreview, 50);

      if (errorCount === 0) {
        toast.success(`Successfully uploaded all ${successCount} questions!`);
      } else {
        toast.error(`Upload completed with ${successCount} successes and ${errorCount} failures.`);
      }

      const res = await TeacherApiService.getQuizByAssignmentId(assignmentId);
      const data = res?.results ?? res?.data ?? res;
      setExistingQuizzes(validateAndCastQuizzes(data));

      setExcelPreview([]);
      setExcelErrors([]);
      setExcelFileName("");
    } catch (err) {
      console.error("Bulk upload failed:", err);
      toast.error("Bulk upload failed.");
    } finally {
      setUploadingExcel(false);
    }
  };

  const downloadTemplate = (): void => {
    const template = [
      { type: "multiple", question: "What is 2+2?", option1: "3", option2: "4", option3: "2", option4: "5", answer: "4" },
      { type: "true_false", question: "The sky is blue.", answer: "true" },
    ];
    const ws = XLSX.utils.json_to_sheet(template);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "template");
    const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const blob = new Blob([wbout], { type: "application/octet-stream" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "quiz_template.xlsx";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const handleDeleteQuiz = async (id: string): Promise<void> => {
    if (!id) return;
    setDeletingQuizId(id);
    try {
      await TeacherApiService.deleteQuiz(id);
      toast.success("Quiz deleted successfully.");

      const res = await TeacherApiService.getQuizByAssignmentId(assignmentId);
      const data = res?.results ?? res?.data ?? res;
      setExistingQuizzes(validateAndCastQuizzes(data));
    } catch (error) {
      console.error("Failed to delete quiz:", error);
      toast.error("Failed to delete quiz.");
    } finally {
      setDeletingQuizId(null);
    }
  };

  // ===========================
  // Render
  // ===========================

  return (
    <div className="p-6">
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-auto py-8 px-4">
          <div className="absolute inset-0 bg-black opacity-50" />

          <div className="relative z-10 w-full max-w-3xl bg-white rounded-2xl shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-lg md:text-xl font-semibold text-slate-800">Create Quiz</h2>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700 rounded-md p-1"
                  aria-label="close"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Body */}
            <div className="px-6 py-6 max-h-[78vh] overflow-y-auto space-y-6">
              {/* Assignment Select */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Select Assignment*</label>
                <select
                  value={assignmentId}
                  onChange={handleSelectChange}
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-100"
                >
                  <option value="">Select Assignment</option>
                  {assignment?.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.title}
                    </option>
                  ))}
                </select>
              </div>

              {/* Existing Quizzes */}
              <div>
                <h3 className="text-md font-semibold text-slate-800 mb-3">
                  Existing Quizzes for:{" "}
                  <span className="font-medium text-slate-600">{assignmentTitle || "—"}</span>
                </h3>

                <div className="space-y-3">
                  {loadingQuizzes ? (
                    <div className="text-sm text-slate-500">Loading quizzes...</div>
                  ) : existingQuizzes.length === 0 ? (
                    <div className="text-sm text-gray-500">No quizzes available for this assignment.</div>
                  ) : (
                    existingQuizzes.map((q, idx) => (
                      <div key={q.id ?? idx} className="p-3 border rounded-lg bg-gray-50 relative">
                        <button
                          onClick={() => handleDeleteQuiz(q.id)}
                          disabled={deletingQuizId === q.id}
                          className="absolute top-2 right-2 text-red-500 hover:text-red-700 rounded-full p-1 hover:bg-red-50 transition-colors"
                          aria-label="Delete quiz"
                          title="Delete this quiz"
                        >
                          {deletingQuizId === q.id ? (
                            <span className="w-4 h-4 block border-2 border-red-500 border-t-transparent rounded-full animate-spin"></span>
                          ) : (
                            "✕"
                          )}
                        </button>

                        <div className="font-medium text-slate-700 pr-8">
                          Q{idx + 1}: {q.question}
                        </div>

                        {q.type === "multiple" && Array.isArray(q.options) && (
                          <ul className="list-disc pl-6 mt-2 text-sm text-slate-600 space-y-1">
                            {q.options.map((opt, j) => (
                              <li key={j}>
                                {opt}{" "}
                                {String(q.answer) === String(opt) && (
                                  <strong className="text-green-600"> (Correct)</strong>
                                )}
                              </li>
                            ))}
                          </ul>
                        )}

                        {q.type === "true_false" && (
                          <div className="mt-2 text-sm text-slate-600">
                            Answer: <span className="font-medium">{String(q.answer)}</span>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Upload Method Selection */}
              <div className="p-4 border rounded-lg bg-white">
                <h4 className="text-sm font-semibold text-slate-800 mb-3">Select Upload Method</h4>
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => handleUploadMethodChange("manual")}
                    className={`flex-1 py-3 px-4 border rounded-lg text-center transition-colors ${
                      uploadMethod === "manual"
                        ? "bg-blue-100 border-blue-500 text-blue-700"
                        : "bg-gray-50 border-gray-300 text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <div className="font-medium">Manual Entry</div>
                    <div className="text-xs mt-1">Add questions one by one</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleUploadMethodChange("file")}
                    className={`flex-1 py-3 px-4 border rounded-lg text-center transition-colors ${
                      uploadMethod === "file"
                        ? "bg-green-100 border-green-500 text-green-700"
                        : "bg-gray-50 border-gray-300 text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <div className="font-medium">Bulk Upload</div>
                    <div className="text-xs mt-1">Upload Excel/CSV file</div>
                  </button>
                </div>
              </div>

              {/* Manual Entry Form */}
              {uploadMethod === "manual" && (
                <form onSubmit={handleSubmit} className="space-y-5">
                  {questions.map((question, index) => (
                    <div key={index} className="p-4 border rounded-lg bg-white">
                      <div className="flex items-start justify-between">
                        <h4 className="text-sm font-semibold text-slate-800">Question {index + 1}</h4>
                        {questions.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeQuestion(index)}
                            className="text-sm text-red-500 hover:underline"
                          >
                            Remove
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 mt-3">
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1">Question*</label>
                          <input
                            type="text"
                            value={question.question}
                            onChange={(e) => handleQuestionChange(index, e)}
                            required
                            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-100"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1">Type*</label>
                          <select
                            value={question.type}
                            onChange={(e) => handleTypeChange(index, e)}
                            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-100"
                          >
                            <option value="multiple">Multiple Choice</option>
                            <option value="true_false">True/False</option>
                          </select>
                        </div>
                      </div>

                      {question.type === "multiple" && (
                        <div className="mt-4">
                          <h5 className="text-sm font-medium text-slate-700 mb-2">Options</h5>
                          <div className="space-y-2">
                            {question.options.map((option, optionIndex) => (
                              <input
                                key={optionIndex}
                                type="text"
                                value={option}
                                onChange={(e) => handleOptionChange(index, optionIndex, e)}
                                placeholder={`Option ${optionIndex + 1}`}
                                required
                                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-100"
                              />
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="mt-4">
                        <label className="block text-sm font-medium text-slate-700 mb-1">Correct Answer*</label>
                        {question.type === "multiple" ? (
                          <select
                            value={question.answer}
                            onChange={(e) => handleAnswerChange(index, e)}
                            required
                            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-100"
                          >
                            <option value="">Select Correct Answer</option>
                            {question.options.map((opt, i) => (
                              <option key={i} value={opt}>
                                {opt}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <select
                            value={question.answer}
                            onChange={(e) => handleAnswerChange(index, e)}
                            required
                            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-100"
                          >
                            <option value="">Select True/False</option>
                            <option value="true">True</option>
                            <option value="false">False</option>
                          </select>
                        )}
                      </div>
                    </div>
                  ))}

                  <div className="space-y-3">
                    <button
                      type="button"
                      onClick={addQuestion}
                      className="w-full inline-flex justify-center items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-100"
                    >
                      Add Another Question
                    </button>

                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full inline-flex justify-center items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-100 disabled:opacity-50"
                    >
                      {submitting ? "Submitting..." : "Submit Quiz"}
                    </button>
                  </div>
                </form>
              )}

              {/* Bulk Upload Form */}
              {uploadMethod === "file" && (
                <div className="p-4 border rounded-lg bg-white">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-semibold text-slate-800">Bulk Upload Quizzes (Excel / CSV)</h4>
                    <button
                      type="button"
                      onClick={downloadTemplate}
                      className="text-sm px-3 py-1 border rounded-md bg-gray-100 hover:bg-gray-200"
                    >
                      Download Template
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <label className="w-full flex items-center gap-3 cursor-pointer">
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept=".xlsx,.xls,.csv"
                        onChange={handleFileInput}
                        className="block w-full"
                      />
                    </label>

                    <div className="text-sm text-slate-600">
                      <div>
                        <strong>Parsed:</strong>{" "}
                        {parsing ? "Parsing..." : excelPreview.length ? `${excelPreview.length} questions` : "No file parsed"}
                      </div>
                      <div>{excelFileName ? `File: ${excelFileName}` : null}</div>
                    </div>
                  </div>

                  {excelErrors && excelErrors.length > 0 && (
                    <div className="mt-3 text-sm text-red-600">
                      <div className="font-medium">Parsing / Validation issues:</div>
                      <ul className="list-disc pl-6 mt-1">
                        {excelErrors.map((err, i) => (
                          <li key={i}>
                            Row {err.row}: {err.issues.join("; ")}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {excelPreview.length > 0 && (
                    <div className="mt-4">
                      <div className="text-sm font-medium mb-2">Preview of Parsed Questions</div>
                      <div className="space-y-2 max-h-48 overflow-y-auto p-2 border rounded">
                        {excelPreview.map((q, i) => (
                          <div key={i} className="p-2 border rounded bg-gray-50">
                            <div className="text-sm font-semibold">{i + 1}. {q.question}</div>
                            {q.type === "multiple" && (
                              <ul className="list-decimal pl-6 text-sm">
                                {q.options.filter(Boolean).map((opt, j) => (
                                  <li key={j}>
                                    {opt}{" "}
                                    {String(q.answer) === String(opt) && (
                                      <strong className="text-green-600"> (Correct)</strong>
                                    )}
                                  </li>
                                ))}
                              </ul>
                            )}
                            {q.type === "true_false" && (
                              <div className="text-sm">
                                Answer: <span className="font-medium">{String(q.answer)}</span>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>

                      <div className="mt-3 flex gap-2">
                        <button
                          type="button"
                          onClick={handleUploadParsed}
                          disabled={uploadingExcel}
                          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
                        >
                          {uploadingExcel ? "Uploading..." : `Upload ${excelPreview.length} Questions`}
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setExcelPreview([]);
                            setExcelErrors([]);
                            setExcelFileName("");
                            if (fileInputRef.current) {
                              fileInputRef.current.value = "";
                            }
                          }}
                          className="px-4 py-2 border rounded hover:bg-gray-50"
                        >
                          Clear
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherQuizs;
