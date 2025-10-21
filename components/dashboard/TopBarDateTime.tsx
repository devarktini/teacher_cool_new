'use client'
import { useState, useEffect } from 'react'
import { format } from 'date-fns'
import { Clock } from 'lucide-react'

export default function TopBarDateTime() {
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="flex items-center gap-4">
      {/* Date & Time */}
      <div className="flex items-center gap-2 text-gray-600">
        <Clock className="h-5 w-5" />
        <span className="text-sm font-medium">
          {format(currentTime, 'MMMM d, yyyy')} | {format(currentTime, 'HH:mm:ss')}
        </span>
      </div>
    </div>
  )
}
