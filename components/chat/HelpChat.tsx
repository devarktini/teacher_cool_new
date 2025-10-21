'use client'
import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, Send, X, Sparkles, Video, Phone, Bot, User } from 'lucide-react'

interface Message {
  id: number
  text: string
  isUser: boolean
  timestamp: Date
}

export default function HelpChat() {
  const [isOpen, setIsOpen] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [messages, setMessages] = useState<Message[]>([
    { 
      id: 1, 
      text: "👋 Hi! I'm your AI assistant. How can I help you today?", 
      isUser: false, 
      timestamp: new Date() 
    }
  ])
  const [newMessage, setNewMessage] = useState('')

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = () => {
    if (!newMessage.trim()) return

    const userMessage = {
      id: messages.length + 1,
      text: newMessage,
      isUser: true,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setNewMessage('')
    setIsTyping(true)

    // Simulate bot response with typing indicator
    setTimeout(() => {
      const botMessage = {
        id: messages.length + 2,
        text: "Thanks for your message! I understand your query and I'm processing it. Our team will assist you shortly.",
        isUser: false,
        timestamp: new Date()
      }
      setIsTyping(false)
      setMessages(prev => [...prev, botMessage])
    }, 2000)
  }

  return (
    <>
      {/* Floating Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 flex items-center gap-3 px-6 py-4 bg-green-500 text-white rounded-full shadow-lg hover:bg-green-600 transition-all group z-50"
      >
        <MessageCircle className="h-6 w-6" />
        <span className="font-medium">Chat with us</span>
        <span className="absolute -top-1 -right-1 h-3 w-3 bg-white rounded-full animate-ping" />
        <span className="absolute -top-1 -right-1 h-3 w-3 bg-white rounded-full" />
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-6 w-96 bg-white rounded-2xl shadow-2xl z-50 overflow-hidden border border-green-100"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-green-500 to-green-600 p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="relative bg-white/10 p-2 rounded-lg">
                    <Bot className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">AI Assistant</h3>
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 bg-green-300 rounded-full"></span>
                      <p className="text-green-100 text-sm">Online</p>
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="text-white/80 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-lg"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Quick Actions */}
              <div className="flex gap-2">
                <button className="flex items-center gap-2 px-4 py-2 text-sm text-white bg-white/10 rounded-lg hover:bg-white/20 transition-colors">
                  <Video className="h-4 w-4" />
                  <span>Video Call</span>
                </button>
                <button className="flex items-center gap-2 px-4 py-2 text-sm text-white bg-white/10 rounded-lg hover:bg-white/20 transition-colors">
                  <Phone className="h-4 w-4" />
                  <span>Voice Call</span>
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="h-[400px] overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-gray-50 to-white">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-3 ${message.isUser ? 'justify-end' : 'justify-start'}`}
                >
                  {!message.isUser && (
                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                      <Bot className="w-5 h-5 text-green-600" />
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] p-3 rounded-2xl ${
                      message.isUser
                        ? 'bg-green-500 text-white ml-12'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {message.text}
                    <div className={`text-[10px] mt-1 ${message.isUser ? 'text-green-100' : 'text-gray-500'}`}>
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                  {message.isUser && (
                    <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                      <User className="w-5 h-5 text-white" />
                    </div>
                  )}
                </motion.div>
              ))}
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-3"
                >
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                    <Bot className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="bg-gray-100 py-3 px-4 rounded-2xl">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                    </div>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 border-t bg-white">
              <div className="flex gap-2 items-center bg-gray-50 rounded-lg p-1">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Type your message..."
                  className="flex-1 p-2 bg-transparent focus:outline-none"
                />
                <button
                  onClick={handleSend}
                  className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
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
