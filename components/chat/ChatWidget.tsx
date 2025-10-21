'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, Send, X } from 'lucide-react'

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<{ text: string; isUser: boolean }[]>([
    { text: "Hello! How can I help you today?", isUser: false }
  ])
  const [newMessage, setNewMessage] = useState('')

  const handleSend = () => {
    if (!newMessage.trim()) return

    setMessages(prev => [...prev, { text: newMessage, isUser: true }])
    setNewMessage('')

    // Simulate response after 1 second
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        text: "Thanks for your message! Our team will get back to you soon.", 
        isUser: false 
      }])
    }, 1000)
  }

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 z-50 flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-full shadow-lg hover:bg-primary-700 transition-all group"
      >
        <MessageCircle className="h-5 w-5" />
        <span className="animate-pulse">Need help ?</span>
        <span className="absolute top-0 right-0 h-3 w-3 bg-green-500 rounded-full border-2 border-white animate-ping"/>
      </button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            className="fixed bottom-20 right-4 w-96 h-[500px] bg-white/80 backdrop-blur-md rounded-2xl shadow-2xl border border-white/20 overflow-hidden z-50"
          >
            {/* Header */}
            <div className="p-4 bg-primary-600 text-white flex justify-between items-center">
              <h3 className="font-semibold">Customer Support</h3>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-white/80 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 p-4 space-y-4 h-[380px] overflow-y-auto">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-lg ${
                      message.isUser
                        ? 'bg-primary-600 text-white rounded-br-none'
                        : 'bg-gray-100 text-gray-800 rounded-bl-none'
                    }`}
                  >
                    {message.text}
                  </div>
                </div>
              ))}
            </div>

            {/* Input */}
            <div className="p-4 border-t bg-white/50">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Type your message..."
                  className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white/50"
                />
                <button
                  onClick={handleSend}
                  className="p-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                >
                  <Send className="h-5 w-5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
