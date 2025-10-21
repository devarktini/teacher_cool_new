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
  // use index (number) to track open item — safer than storing the whole object
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const handleDropDown = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index))
  }

  /**
   * Convert HTML string to a safe-ish HTML string with styled <strong>.
   * - We avoid DOM APIs like document.* so this is safe during SSR import.
   * - We only perform simple replacements (no parsing).
   */
  const styleStrongTags = (html: string) => {
    // replace <strong> with <strong class="text-blue-600"> (keeps closing tags intact)
    // note: this is a simple approach; if you expect complex attributes inside <strong>,
    // you'd want a proper HTML sanitizer/parser.
    return { __html: html.replace(/<strong>/gi, '<strong class="text-blue-600">') }
  }

  return (
    <div className={`${bgColor} pb-10 ${pt}`}>
      <div className="container mx-auto min-h-0 flex items-center max-sm:items-start max-sm:px-4 flex-col ">
        <h1 className="text-4xl max-sm:text-2xl font-bold mb-4 text-center w-full">
          Frequently Asked Questions
        </h1>

        <div className="w-full space-y-4">
          {faqData?.map((item, index) => {
            const isOpen = openIndex === index
            return (
              <div key={index} className="w-full">
                <div
                  className={`lg:w-[70vw] w-[95%] cursor-pointer flex items-center justify-between border-2 rounded-lg mx-auto border-gray-200 bg-white p-4 transition-colors duration-200 ${
                    isOpen ? 'bg-blue-50' : ''
                  }`}
                  onClick={() => handleDropDown(index)}
                  role="button"
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${index}`}
                >
                  {/* Question */}
                  <p
                    className="text-gray-800"
                    dangerouslySetInnerHTML={styleStrongTags(item.question.__html)}
                  />

                  <ChevronDownIcon
                    className={`text-2xl transition-transform duration-300 ${isOpen ? 'rotate-180 text-blue-600' : 'rotate-0 text-gray-400'}`}
                    aria-hidden="true"
                  />
                </div>

                {isOpen && (
                  <div
                    id={`faq-answer-${index}`}
                    className="w-[70vw] max-sm:w-full mx-auto border rounded-lg border-gray-200 p-4 mb-4 bg-white"
                    role="region"
                    aria-labelledby={`faq-question-${index}`}
                  >
                    <p dangerouslySetInnerHTML={styleStrongTags(item.answer.__html)} />
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default Faq
