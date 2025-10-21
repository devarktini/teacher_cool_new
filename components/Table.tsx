'use client'
import { useState } from 'react'

export interface Column<T> {
  key: string
  header: string
  render?: (row: T) => React.ReactNode
  sortable?: boolean
  width?: string
}

interface TableProps<T> {
  data: T[]
  columns: Column<T>[]
  headerColor?: string
  selectedRowColor?: string
  hoverColor?: string
  onRowClick?: (row: T) => void
  onSort?: (key: string, direction: 'asc' | 'desc') => void
  selectedRow?: T
  rowKey?: keyof T
  isLoading?: boolean
  emptyMessage?: string
  containerClassName?: string
  headerClassName?: string
  rowClassName?: string
  cellClassName?: string
  stickyHeader?: boolean
  maxHeight?: string
  striped?: boolean
  bordered?: boolean
  dense?: boolean
}

export default function Table<T>({
  data,
  columns,
  headerColor = '#F3F4F6',
  selectedRowColor = '#EFF6FF',
  hoverColor = '#F9FAFB',
  onRowClick,
  onSort,
  selectedRow,
  rowKey = 'id' as keyof T,
  isLoading = false,
  emptyMessage = 'No data available',
  containerClassName = '',
  headerClassName = '',
  rowClassName = '',
  cellClassName = '',
  stickyHeader = false,
  maxHeight,
  striped = false,
  bordered = false,
  dense = false,
}: TableProps<T>) {
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: 'asc' | 'desc';
  } | null>(null)

  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc'
    if (sortConfig?.key === key && sortConfig.direction === 'asc') {
      direction = 'desc'
    }
    setSortConfig({ key, direction })
    onSort?.(key, direction)
  }

  return (
    <div 
      className={`overflow-auto relative ${containerClassName}`}
      style={{ maxHeight }}
    >
      <table className={`w-full ${bordered ? 'border border-gray-200' : ''}`}>
        <thead className={`${stickyHeader ? 'sticky top-0' : ''}`}>
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                style={{ 
                  backgroundColor: headerColor,
                  width: column.width,
                }}
                className={`
                  ${dense ? 'px-2 py-1' : 'px-4 py-2'}
                  font-semibold text-left
                  ${bordered ? 'border border-gray-200' : ''}
                  ${headerClassName}
                  ${column.sortable ? 'cursor-pointer' : ''}
                `}
                onClick={() => column.sortable && handleSort(column.key)}
              >
                <div className="flex items-center gap-2">
                  {column.header}
                  {column.sortable && sortConfig?.key === column.key && (
                    <span>{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <tr>
              <td
                colSpan={columns.length}
                className="text-center py-4"
              >
                Loading...
              </td>
            </tr>
          ) : data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="text-center py-4"
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row, index) => (
              <tr
                key={String(row[rowKey])}
                onClick={() => onRowClick?.(row)}
                style={{
                  backgroundColor: selectedRow && row[rowKey] === selectedRow[rowKey]
                    ? selectedRowColor
                    : striped && index % 2 === 1
                    ? hoverColor
                    : undefined,
                }}
                className={`
                  ${onRowClick ? 'cursor-pointer' : ''}
                  hover:bg-opacity-75
                  ${rowClassName}
                `}
              >
                {columns.map((column) => (
                  <td
                    key={column.key}
                    className={`
                      ${dense ? 'px-2 py-1' : 'px-4 py-2'}
                      ${bordered ? 'border border-gray-200' : ''}
                      ${cellClassName}
                    `}
                  >
                    {column.render
                      ? column.render(row)
                      : String(row[column.key as keyof T])}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}
