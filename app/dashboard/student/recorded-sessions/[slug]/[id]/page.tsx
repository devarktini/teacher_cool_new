import React from 'react'
import RecordedSessionsDetails from '@/components/Students/Batchs/RecordedSessionsDetails';


export default function RecordedSessionDetails({
  params,
}: {
  params: { slug: string; id: string }
}) {
  const { slug, id } = params

  return (
    <div className="p-6">
      
      <RecordedSessionsDetails slug={slug} id={id} />
    </div>
  )
}
