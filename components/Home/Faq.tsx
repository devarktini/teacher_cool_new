'use client'
import React, { useState } from 'react'
import { ChevronDownIcon } from '@radix-ui/react-icons'

export const faqData = [
  {
    question: { __html: '1. What is this course about?' },
    answer: {
      __html:
        "This course is designed to provide you with comprehensive knowledge and practical skills in website development. You'll learn everything from the fundamentals of HTML, CSS, and JavaScript to advanced topics like responsive design and web accessibility.",
    },
  },
  {
    question: {
      __html:
        '2. Do I need any prior experience in programming or web development?',
    },
    answer: {
      __html:
        "No prior experience is required. This course is suitable for beginners as well as those with some experience in programming. Our modules are structured to accommodate learners with varying levels of expertise.",
    },
  },
  {
    question: { __html: '3. How is the course structured?' },
    answer: {
      __html:
        "The course is divided into modules, each covering a specific aspect of website development. You'll have access to video lectures, hands-on coding exercises, quizzes, and projects to reinforce your learning.",
    },
  },
  {
    question: {
      __html: '4. What software/tools do I need to complete the course?',
    },
    answer: {
      __html:
        "You'll need a computer with internet access. Additionally, you'll need a text editor for writing code. We recommend popular text editors like Visual Studio Code, Sublime Text, or Atom, but any text editor will suffice.",
    },
  },
  {
    question: {
      __html: '5. How much time should I dedicate to the course each week?',
    },
    answer: {
      __html:
        'The time commitment varies depending on your learning pace and prior experience. On average, students spend about 4-6 hours per week on lectures, exercises, and projects. However, you\'re free to study at your own pace.',
    },
  },
  {
    question: {
      __html: '6. Is there a certificate upon completion of the course?',
    },
    answer: {
      __html:
        "Yes, upon successful completion of all course requirements, including quizzes and projects, you'll receive a certificate of completion from TeacherCool. This certificate can be shared on LinkedIn or added to your resume.",
    },
  },
  {
    question: {
      __html: '7. Can I access the course material after completing it?',
    },
    answer: {
      __html:
        "Yes, you'll have access to the course material even after completing it. You can review the lectures and exercises at any time, which is especially useful for reinforcing your learning or refreshing your skills.",
    },
  },
  {
    question: {
      __html:
        '8. Will I receive support from instructors or peers during the course?',
    },
    answer: {
      __html:
        "Absolutely! Our instructors and teaching assistants are available to answer your questions and provide guidance throughout the course. You'll also have access to a community forum where you can interact with fellow learners, ask questions, and share insights.",
    },
  },
  {
    question: { __html: '9. Can I audit the course for free?' },
    answer: {
      __html:
        "Yes, you can audit the course for free to access the lectures and some course materials. However, auditing does not grant access to graded assignments or the certificate of completion. To receive a certificate, you'll need to enroll in the paid version of the course.",
    },
  },
  {
    question: { __html: '10. How do I enroll in the course?' },
    answer: {
      __html:
        "To enroll in the course, simply visit the course page on TeacherCool, click on the <strong>Login</strong> button, and follow the instructions to complete the enrollment process.",
    },
  },
]

function Faq({ bgColor = '', pt = '' }: { bgColor?: string; pt?: string }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const [heights, setHeights] = useState<{ [key: number]: number }>({})

  const handleDropDown = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index))
  }

  const styleStrongTags = (html: string) => {
    return { __html: html.replace(/<strong>/gi, '<strong class="text-blue-600 font-semibold">') }
  }

  return (
    <div className={`${bgColor} pb-16 ${pt} bg-gradient-to-br from-slate-50 to-blue-50`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          {/* <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 rounded-full border border-blue-200 mb-4">
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
            <span className="text-sm font-semibold text-blue-700 uppercase tracking-wide">
              FAQ
            </span>
          </div> */}
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Find answers to common questions about our courses, enrollment process, and learning experience.
          </p>
        </div>

        {/* FAQ Items */}
        <div className="max-w-4xl mx-auto space-y-4">
          {faqData?.map((item, index) => {
            const isOpen = openIndex === index
            
            return (
              <div 
                key={index} 
                className="group"
              >
                {/* Question Button */}
                <button
                  className={`w-full cursor-pointer flex items-center justify-between rounded-2xl mx-auto p-6 transition-all duration-500 ease-out ${
                    isOpen 
                      ? 'bg-white shadow-lg border border-blue-100 scale-[1.02]' 
                      : 'bg-white shadow-sm border border-gray-100 hover:shadow-md hover:border-blue-100'
                  }`}
                  onClick={() => handleDropDown(index)}
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${index}`}
                >
                  {/* Question Content */}
                  <div className="flex items-start gap-4 text-left">
                    <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                      isOpen 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-blue-100 text-blue-600 group-hover:bg-blue-200'
                    }`}>
                      <span className="text-sm font-semibold">{index + 1}</span>
                    </div>
                    <div>
                      <p
                        className={`text-lg font-semibold transition-colors duration-300 text-left ${
                          isOpen ? 'text-blue-700' : 'text-gray-800 group-hover:text-blue-600'
                        }`}
                        dangerouslySetInnerHTML={styleStrongTags(item.question.__html)}
                      />
                    </div>
                  </div>

                  {/* Animated Chevron */}
                  <div className={`flex-shrink-0 transition-all duration-500 ease-out ${
                    isOpen ? 'rotate-180 text-blue-600' : 'rotate-0 text-gray-400 group-hover:text-blue-500'
                  }`}>
                    <ChevronDownIcon className="w-6 h-6" />
                  </div>
                </button>

                {/* Answer Section with Smooth Animation */}
                <div
                  id={`faq-answer-${index}`}
                  className={`overflow-hidden transition-all duration-500 ease-out ${
                    isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  <div className={`mx-auto p-2 pt-4 ${
                    isOpen ? 'translate-y-0' : '-translate-y-4'
                  } transition-transform duration-500 ease-out`}>
                    <div className="bg-blue-50 rounded-xl p-6 border border-blue-100">
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mt-1">
                          <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <p 
                          className="text-gray-700 leading-relaxed text-lg"
                          dangerouslySetInnerHTML={styleStrongTags(item.answer.__html)}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Additional Help Section */}
        {/* <div className="text-center mt-12">
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Still have questions?</h3>
            <p className="text-gray-600 mb-6">
              Can't find the answer you're looking for? Please chat with our friendly team.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
                Contact Support
              </button>
              <button className="border border-gray-300 hover:border-gray-400 text-gray-700 font-semibold py-3 px-8 rounded-xl transition-all duration-300 transform hover:scale-105">
                Visit Help Center
              </button>
            </div>
          </div>
        </div> */}
      </div>
    </div>
  )
}

export default Faq