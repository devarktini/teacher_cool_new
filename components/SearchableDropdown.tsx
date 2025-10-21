'use client'
import { useState, useEffect, useRef } from 'react'
import { ChevronDownIcon } from '@heroicons/react/24/outline'

interface Option {
  value: string | number
  label: string
}

interface SearchableDropdownProps {
  options: Option[]
  value?: Option
  onChange: (option: Option) => void
  placeholder?: string
  className?: string
  isLoading?: boolean
  disabled?: boolean
  error?: string
}

export default function SearchableDropdown({
  options,
  value,
  onChange,
  placeholder = 'Select an option',
  className = '',
  isLoading = false,
  disabled = false,
  error,
}: SearchableDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState('')
  const dropdownRef = useRef<HTMLDivElement>(null)

  const filteredOptions = options.filter(option =>
    option.label.toLowerCase().includes(search.toLowerCase())
  )

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="relative" ref={dropdownRef}>
      <div
        className={`
          relative cursor-pointer rounded-md border bg-white
          ${error ? 'border-red-500' : 'border-gray-300'}
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-blue-500'}
          ${className}
        `}
      >
        <div
          className="flex items-center justify-between p-2"
          onClick={() => !disabled && setIsOpen(!isOpen)}
        >
          <input
            type="text"
            className={`
              w-full border-none focus:outline-none focus:ring-0
              ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}
            `}
            placeholder={value ? value.label : placeholder}
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setIsOpen(true)
            }}
            onClick={(e) => e.stopPropagation()}
            disabled={disabled}
          />
          <ChevronDownIcon
            className={`h-5 w-5 text-gray-400 transition-transform ${
              isOpen ? 'rotate-180' : ''
            }`}
          />
        </div>

        {isOpen && !disabled && (
          <div className="absolute z-10 mt-1 w-full rounded-md border border-gray-300 bg-white shadow-lg">
            {isLoading ? (
              <div className="p-2 text-center text-gray-500">Loading...</div>
            ) : filteredOptions.length > 0 ? (
              <div className="max-h-60 overflow-auto">
                {filteredOptions.map((option) => (
                  <div
                    key={option.value}
                    className={`
                      cursor-pointer p-2 hover:bg-blue-50
                      ${value?.value === option.value ? 'bg-blue-50' : ''}
                    `}
                    onClick={() => {
                      onChange(option)
                      setIsOpen(false)
                      setSearch('')
                    }}
                  >
                    {option.label}
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-2 text-center text-gray-500">No results found</div>
            )}
          </div>
        )}
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-500">{error}</p>
      )}
    </div>
  )
}
