'use client'

import React from 'react'

function CourseBrief({courseBrief}:any) {
  return (
    <>
      {courseBrief?.briefs.length > 0 && (
        <>
          <h3 className="text-4xl pb-4 text-center pt-12 font-bold mb-4">
            Course Brief
          </h3>
          <div className="border w-full shadow-md rounded-md p-4">
            <h3 className="text-xl font-bold mb-4">PDF Preview</h3>
            {courseBrief?.briefs?.[0] && (
              <div className="overflow-auto border">
                <iframe
                  src={`${process.env.NEXT_PUBLIC_API_URL}${courseBrief.briefs[0].file}`}
                  style={{ width: "100%", height: "580px", border: "none" }}
                  title="PDF Document"
                />
              </div>
            )}
          </div>
        </>
      )}
    </>
  )
}

export default CourseBrief
