import React, { useEffect, useState } from "react";

/**
 * Professional exam-style MCQ component
 * Compact design for large questions, responsive for mobile & tablet
 */

const letterForIndex = (i:any) => String.fromCharCode(65 + i); // A, B, C, D

const MCQ = ({ question = "", options = [], type = "multiple", onAnswer, selectedAnswer = null ,assignmentData}:any) => {
  const [selected, setSelected] = useState(selectedAnswer);
  const [answered, setAnswered] = useState(selectedAnswer !== null);

  useEffect(() => {
    setSelected(selectedAnswer);
    setAnswered(selectedAnswer !== null);
  }, [question, type, selectedAnswer]);

  const handleSelect = (val:any) => {
    setSelected(val);
    setAnswered(true);
    if (typeof onAnswer === "function") onAnswer(val);
  };

  // Prepare exactly 4 slots for multiple-choice (A-D)
  const prepareSlots = () => {
    const slots = Array.isArray(options) ? options.slice(0, 4) : [];
    while (slots.length < 4) slots.push("");
    return slots;
  };

  const renderOptions = () => {
    if (type === "truefalse") {
      const isTrue = selected === "true" || selected === true;
      const isFalse = selected === "false" || selected === false;

      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
          <button
            type="button"
            onClick={() => handleSelect("true")}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                handleSelect("true");
              }
            }}
            aria-pressed={isTrue}
            className={`flex items-center justify-start gap-3 p-4 rounded-lg border-2 transition-all w-full
              ${isTrue ? "bg-green-50 border-green-500 shadow-md" : "bg-white border-gray-300 hover:border-blue-400"}
            `}
          >
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center text-sm ${
                isTrue ? "bg-green-500 text-white" : "bg-gray-100 text-gray-600"
              }`}
            >
              ✓
            </div>
            <span className="font-semibold text-base">True</span>
          </button>

          <button
            type="button"
            onClick={() => handleSelect("false")}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                handleSelect("false");
              }
            }}
            aria-pressed={isFalse}
            className={`flex items-center justify-start gap-3 p-4 rounded-lg border-2 transition-all w-full
              ${isFalse ? "bg-red-50 border-red-500 shadow-md" : "bg-white border-gray-300 hover:border-blue-400"}
            `}
          >
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center text-sm ${
                isFalse ? "bg-red-500 text-white" : "bg-gray-100 text-gray-600"
              }`}
            >
              ✕
            </div>
            <span className="font-semibold text-base">False</span>
          </button>
        </div>
      );
    }

    const slots = prepareSlots();

    // responsive: single column on xs, two columns on sm+
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
        {slots.map((opt, idx) => {
          const letter = letterForIndex(idx);
          const isEmpty = opt === "" || opt == null;
          const isSelected = selected === opt;

          return (
            <button
              key={idx}
              type="button"
              onClick={() => handleSelect(opt)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  handleSelect(opt);
                }
              }}
              aria-pressed={isSelected}
              className={`flex items-start gap-3 w-full text-left rounded-lg border-2 p-4 transition-all min-h-[72px]
                ${isSelected ? "bg-blue-50 border-blue-500 shadow-md" : "bg-white border-gray-300 hover:border-blue-400"}
                ${isEmpty ? "opacity-50 cursor-not-allowed" : ""}
              `}
              disabled={isEmpty}
            >
              {/* Compact Letter Badge */}
              <div
                className={`flex items-center justify-center flex-shrink-0 w-12 h-12 rounded-lg font-bold text-sm
                  ${isSelected ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 border border-gray-300"}
                `}
              >
                {letter}
              </div>

              {/* Option content */}
              <div className="flex-1 min-w-0">
                <div
                  className={`text-sm sm:text-base leading-tight break-words ${
                    isEmpty ? "italic text-gray-500" : "text-gray-800"
                  }`}
                >
                  {isEmpty ? `Option ${letter}` : opt}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    );
  };

  return (
    <div className="w-full">
      {/* Status Bar */}
      <div className="flex flex-col-reverse lg:flex-row items-center justify-between mb-3">
        <div className="flex items-center gap-2 ">
          <div className={`w-2 h-2 rounded-full ${answered ? "bg-green-500" : "bg-yellow-500"}`}></div>
          <span className="text-xs font-medium text-gray-600">{answered ? "Answered" : "Not Answered"}</span>
        </div>
        <div className="lg:w-[60%] text-start text-xs text-gray-700  ">
          {assignmentData?.description}
        </div>
        {/* <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">Select one</div> */}
      </div>

      {/* Question Card */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 mb-4">
        <div className="text-xs font-semibold text-gray-500 mb-2">QUESTION</div>
        <div className="text-sm sm:text-base leading-relaxed text-gray-800 whitespace-pre-line break-words">
          {question || "No question text provided."}
        </div>
      </div>

      {/* Options Section */}
      <div>
        <div className="text-xs font-semibold text-gray-500 mb-2">OPTIONS</div>
        {renderOptions()}
      </div>

      {/* Keyboard Help */}
      <div className="mt-4 text-xs text-black text-center">
        <div className="inline-flex items-center gap-2 flex-wrap justify-center">
          <kbd className="px-2 py-1 bg-gray-100 border border-gray-300 rounded text-black text-xs">A</kbd>
          <kbd className="px-2 py-1 bg-gray-100 border border-gray-300 rounded text-black text-xs">B</kbd>
          <kbd className="px-2 py-1 bg-gray-100 border border-gray-300 rounded text-black text-xs">C</kbd>
          <kbd className="px-2 py-1 bg-gray-100 border border-gray-300 rounded text-black text-xs">D</kbd>
        </div>
        <div className="text-xs text-gray-500 mt-2">Press the keys above to select (or tap an option)</div>
      </div>
    </div>
  );
};

export default MCQ;