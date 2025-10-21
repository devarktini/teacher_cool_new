'use client'
import { useState } from 'react'
import { Send } from 'lucide-react'
import SuccessPopup from './SuccessPopup'

interface FormData {
  name: string
  email: string
  subject: string
  message: string
}

export default function ContactForm() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Add your form submission logic here
      await new Promise(resolve => setTimeout(resolve, 1500))
      setShowSuccess(true)
      // Reset form
      setFormData({ name: '', email: '', subject: '', message: '' })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Your Name
            </label>
            <input
              type="text"
              id="name"
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>
        </div>
        
        <div>
          <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
            Subject
          </label>
          <input 
            type="text"
            id="subject"
            required
            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
            value={formData.subject}
            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
          />
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
            Message
          </label>
          <textarea
            id="message"
            rows={4}
            required
            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          ></textarea>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center justify-center w-full px-6 py-3 rounded-lg bg-primary-600 text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isSubmitting ? (
            <span>Sending...</span>
          ) : (
            <>
              <Send className="w-5 h-5 mr-2" />
              <span>Send Message</span>
            </>
          )}
        </button>
      </form>

      <SuccessPopup 
        isOpen={showSuccess} 
        onClose={() => setShowSuccess(false)} 
      />
    </>
  )
}
