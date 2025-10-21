'use client'
import { cn } from '@/lib/utils'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  color?: string
  className?: string
  showFirstLast?: boolean
  showPageNumbers?: boolean
  size?: 'sm' | 'md' | 'lg'
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  color = 'blue',
  className = '',
  showFirstLast = true,
  showPageNumbers = true,
  size = 'md',
}: PaginationProps) {
  const colorStyles = {
    blue: 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500',
    red: 'bg-red-600 hover:bg-red-700 focus:ring-red-500',
    green: 'bg-green-600 hover:bg-green-700 focus:ring-green-500',
    purple: 'bg-purple-600 hover:bg-purple-700 focus:ring-purple-500',
    gray: 'bg-gray-600 hover:bg-gray-700 focus:ring-gray-500',
  }

  const sizeStyles = {
    sm: 'h-8 w-8 text-sm',
    md: 'h-10 w-10 text-base',
    lg: 'h-12 w-12 text-lg',
  }

  const baseButtonStyles = cn(
    'relative inline-flex items-center justify-center rounded-full',
    'text-white focus:outline-none focus:ring-2 focus:ring-offset-2',
    'disabled:opacity-50 disabled:cursor-not-allowed transition-colors',
    sizeStyles[size],
  )

  const getPageNumbers = () => {
    const pages = []
    const maxVisiblePages = 5
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2))
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1)

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1)
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i)
    }
    return pages
  }

  return (
    <nav
      className={cn('flex items-center justify-center space-x-2', className)}
      aria-label="Pagination"
    >
      {showFirstLast && (
        <button
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          className={cn(baseButtonStyles, colorStyles[color as keyof typeof colorStyles])}
          aria-label="Go to first page"
        >
          <ChevronLeftIcon className="h-5 w-5" />
          <ChevronLeftIcon className="h-5 w-5 -ml-4" />
        </button>
      )}

      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={cn(baseButtonStyles, colorStyles[color as keyof typeof colorStyles])}
        aria-label="Previous page"
      >
        <ChevronLeftIcon className="h-5 w-5" />
      </button>

      {showPageNumbers && (
        <div className="flex items-center space-x-2">
          {getPageNumbers().map((page) => (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={cn(
                baseButtonStyles,
                page === currentPage
                  ? colorStyles[color as keyof typeof colorStyles]
                  : 'text-gray-700 ring-1 ring-gray-300 hover:bg-gray-50'
              )}
              aria-current={page === currentPage ? 'page' : undefined}
            >
              {page}
            </button>
          ))}
        </div>
      )}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={cn(baseButtonStyles, colorStyles[color as keyof typeof colorStyles])}
        aria-label="Next page"
      >
        <ChevronRightIcon className="h-5 w-5" />
      </button>

      {showFirstLast && (
        <button
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
          className={cn(baseButtonStyles, colorStyles[color as keyof typeof colorStyles])}
          aria-label="Go to last page"
        >
          <ChevronRightIcon className="h-5 w-5" />
          <ChevronRightIcon className="h-5 w-5 -ml-4" />
        </button>
      )}
    </nav>
  )
}
