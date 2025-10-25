'use client'

import React, { useCallback, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import Progress from '@/components/Progress'
import StudentApiService from '@/services/studentApi'

type Batch = {
  id: string | number
  name?: string
  day?: string
  start_time?: string
  end_time?: string
  start_date?: string
  end_date?: string
  // add any other fields your API returns
}

export default function RecordedSessions() {
  const [batchDetails, setBatchDetails] = useState<Batch[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [debouncedQuery, setDebouncedQuery] = useState(searchQuery)
  const [studentId, setStudentId] = useState<string | null>(null);

  useEffect(() => {
    const id = localStorage.getItem('id');
    setStudentId(id);
  }, []);
  const getBatch = useCallback(async () => {
    if (!studentId) {
      setBatchDetails([])
      return
    }

    try {
      setLoading(true)
      const res = await StudentApiService.fetchStudentDataByBatch(studentId)

      // normalize axios vs fetch results:
      const payload = (res as any)?.data ?? res ?? null
      const batches = Array.isArray(payload) ? payload : (Array.isArray(payload?.data) ? payload.data : [])

      setBatchDetails(batches ?? [])
    } catch (error) {
      console.error('Failed to fetch batch data', error)
      setBatchDetails([])
    } finally {
      setLoading(false)
    }
  }, [studentId])

  useEffect(() => {
    getBatch()
  }, [getBatch])

  // debounce the search query (300ms)
  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(searchQuery.trim().toLowerCase()), 300)
    return () => clearTimeout(t)
  }, [searchQuery])

  const filteredBatchData = useMemo(() => {
    if (!debouncedQuery) return batchDetails
    return batchDetails.filter((batch) =>
      (batch.name ?? '').toLowerCase().includes(debouncedQuery)
    )
  }, [batchDetails, debouncedQuery])

  if (loading) return <Progress />

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <header className="mb-8 text-center">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900">
          Batch Details
        </h1>
        <p className="mt-2 text-sm text-gray-600 max-w-2xl mx-auto">
          View your enrolled batches and session timings.
        </p>
      </header>

      {/* Search */}
      <div className="flex justify-center mb-8">
        <label htmlFor="batch-search" className="sr-only">Search batches</label>
        <div className="w-full max-w-lg">
          <input
            id="batch-search"
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by batch name..."
            className="w-full px-4 py-3 rounded-xl border border-gray-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            aria-label="Search batches"
          />
        </div>
      </div>

      {/* Cards grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBatchData.length > 0 ? (
          filteredBatchData.map((batch) => (
            <BatchCard key={String(batch.id)} batch={batch} />
          ))
        ) : (
          <div className="col-span-full text-center py-16">
            <p className="text-gray-500 text-lg">No batches found.</p>
            <p className="mt-2 text-sm text-gray-400">Try a different search or contact support if you think this is an error.</p>
          </div>
        )}
      </section>
    </main>
  )
}

/* ---------- BatchCard component (kept inside file for simplicity) ---------- */
function BatchCard({ batch }: { batch: Batch }) {
  const dayLabel = batch.day ? `${batch.day.charAt(0).toUpperCase() + batch.day.slice(1)}` : 'N/A'

  // update this href to the actual route in your app
  const detailsHref = `/student/batchs/${batch.id}`

  return (
    <article className="bg-white rounded-2xl shadow-md hover:shadow-lg transition p-5 border border-gray-100 transform hover:-translate-y-1">
      <h3 className="text-base font-semibold mb-3 text-center text-white bg-gradient-to-r from-blue-500 to-indigo-600 py-2 rounded">
        {batch.name ?? 'Untitled Batch'}
      </h3>

      <dl className="grid grid-cols-2 gap-3 text-sm">
        <div className="bg-yellow-50 px-3 py-2 rounded">
          <dt className="text-xs font-medium text-yellow-700">Day</dt>
          <dd className="mt-1 text-sm text-yellow-900">{dayLabel}</dd>
        </div>

        <div className="bg-green-50 px-3 py-2 rounded">
          <dt className="text-xs font-medium text-green-700">Start</dt>
          <dd className="mt-1 text-sm text-green-900">{batch.start_time ?? '—'}</dd>
        </div>

        <div className="bg-red-50 px-3 py-2 rounded">
          <dt className="text-xs font-medium text-red-700">End</dt>
          <dd className="mt-1 text-sm text-red-900">{batch.end_time ?? '—'}</dd>
        </div>

        <div className="bg-purple-50 px-3 py-2 rounded">
          <dt className="text-xs font-medium text-purple-700">Start Date</dt>
          <dd className="mt-1 text-sm text-purple-900">{batch.start_date ?? '—'}</dd>
        </div>

        <div className="bg-blue-50 px-3 py-2 rounded col-span-2">
          <dt className="text-xs font-medium text-blue-700">End Date</dt>
          <dd className="mt-1 text-sm text-blue-900">{batch.end_date ?? '—'}</dd>
        </div>
      </dl>

      <div className="mt-4 text-center">
        <Link
          href={detailsHref}
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-4 rounded-lg shadow"
          aria-label={`View details for ${batch.name ?? 'batch'}`}
        >
          View Details
        </Link>
      </div>
    </article>
  )
}
