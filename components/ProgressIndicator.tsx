'use client'
import { useSelector } from 'react-redux'
import { selectProgress } from '@/store/features/progressSlice'
import Progress from './Progress'

export default function ProgressIndicator() {
  const { isLoading, color } = useSelector(selectProgress)
  if (!isLoading) return null
  return <Progress color={color} />
}
