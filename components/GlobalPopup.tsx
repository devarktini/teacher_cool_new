'use client'
import { motion, AnimatePresence } from 'framer-motion'
import { useSelector, useDispatch } from 'react-redux'
import { selectPopup, hidePopup } from '@/store/features/popupSlice'
import { 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Info, 
  X 
} from 'lucide-react'

const themeConfig = {
  success: {
    icon: CheckCircle2,
    bgColor: 'bg-green-50',
    iconColor: 'text-green-500',
    borderColor: 'border-green-200',
    textColor: 'text-green-700'
  },
  error: {
    icon: XCircle,
    bgColor: 'bg-red-50',
    iconColor: 'text-red-500',
    borderColor: 'border-red-200',
    textColor: 'text-red-700'
  },
  warning: {
    icon: AlertTriangle,
    bgColor: 'bg-yellow-50',
    iconColor: 'text-yellow-500',
    borderColor: 'border-yellow-200',
    textColor: 'text-yellow-700'
  },
  info: {
    icon: Info,
    bgColor: 'bg-blue-50',
    iconColor: 'text-blue-500',
    borderColor: 'border-blue-200',
    textColor: 'text-blue-700'
  }
}

export default function GlobalPopup() {
  const dispatch = useDispatch()
  const { isOpen, title, description, additionalData, theme = 'info', onConfirm } = useSelector(selectPopup)
  
  const currentTheme = themeConfig[theme]
  const Icon = currentTheme.icon

  const handleClose = () => {
    dispatch(hidePopup())
  }

  const handleConfirm = () => {
    if (onConfirm) onConfirm()
    handleClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={handleClose}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              className="relative w-[min(400px,100%-32px)] aspect-square bg-white/80 backdrop-blur-md rounded-2xl shadow-2xl overflow-hidden border border-white/20"
            >
              <button
                onClick={handleClose}
                className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
              
              <div className="flex flex-col items-center justify-center h-full p-6">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ 
                    delay: 0.2, 
                    type: "spring", 
                    stiffness: 200, 
                    damping: 15 
                  }}
                  className="mb-4"
                >
                  <div className="relative">
                    <div className={`absolute inset-0 rounded-full blur-xl opacity-75 ${
                      theme === 'success' ? 'bg-green-500/30' :
                      theme === 'error' ? 'bg-red-500/30' :
                      theme === 'warning' ? 'bg-yellow-500/30' :
                      'bg-blue-500/30'
                    }`} />
                    <Icon className={`w-16 h-16 relative z-10 ${currentTheme.iconColor}`} />
                  </div>
                </motion.div>
                
                <motion.h2
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-2xl font-bold text-center mb-2"
                >
                  {title}
                </motion.h2>
                
                <motion.p
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="text-gray-600 text-center text-sm mb-4"
                >
                  {description}
                </motion.p>

                {additionalData && additionalData.length > 0 && (
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="w-full max-h-[120px] overflow-y-auto mb-4 bg-black/5 rounded-lg p-3"
                  >
                    <div className="space-y-1">
                      {additionalData.map((data, index) => (
                        <div key={index} className="flex justify-between text-sm">
                          <span className="text-gray-600">{data.key}:</span>
                          <span className="font-medium">{data.value}</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

                <div className="flex gap-3 mt-auto">
                  <motion.button
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    onClick={handleClose}
                    className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-sm transition-colors"
                  >
                    Close
                  </motion.button>
                  {onConfirm && (
                    <motion.button
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.6 }}
                      onClick={handleConfirm}
                      className={`px-4 py-2 rounded-lg text-white text-sm ${
                        theme === 'error' ? 'bg-red-500 hover:bg-red-600' :
                        theme === 'warning' ? 'bg-yellow-500 hover:bg-yellow-600' :
                        theme === 'success' ? 'bg-green-500 hover:bg-green-600' :
                        'bg-blue-500 hover:bg-blue-600'
                      } transition-colors`}
                    >
                      Confirm
                    </motion.button>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
