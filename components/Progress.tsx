'use client'
import { motion } from 'framer-motion'

interface ProgressProps {
  color?: string
  size?: number
  thickness?: number
}

export default function Progress({ 
  color = '#3B82F6', 
  size = 60, 
  thickness = 6 
}: ProgressProps) {
  return (
    <div 
      className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black/20 backdrop-blur-sm z-50"
      style={{ pointerEvents: 'none' }}
    >
      <motion.div
        className="relative"
        style={{ width: size, height: size }}
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      >
        <svg
          className="absolute"
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
        >
          <circle
            cx={size / 2}
            cy={size / 2}
            r={(size - thickness) / 2}
            strokeWidth={thickness}
            stroke={color}
            fill="none"
            strokeLinecap="round"
            strokeDasharray={(size - thickness) * Math.PI * 0.75}
            strokeDashoffset={(size - thickness) * Math.PI * 0.25}
          />
        </svg>
      </motion.div>
    </div>
  )
}
