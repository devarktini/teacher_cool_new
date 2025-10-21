'use client'
import { SunIcon, MoonIcon, LaptopIcon } from 'lucide-react'
import { useTheme } from './providers/ThemeProvider'

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <div className="flex items-center gap-2 p-2">
      <button
        onClick={() => setTheme('light')}
        className={`p-2 rounded-lg ${
          theme === 'light' ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'
        }`}
      >
        <SunIcon className="h-5 w-5" />
      </button>
      <button
        onClick={() => setTheme('dark')}
        className={`p-2 rounded-lg ${
          theme === 'dark' ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'
        }`}
      >
        <MoonIcon className="h-5 w-5" />
      </button>
      <button
        onClick={() => setTheme('system')}
        className={`p-2 rounded-lg ${
          theme === 'system' ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'
        }`}
      >
        <LaptopIcon className="h-5 w-5" />
      </button>
    </div>
  )
}
