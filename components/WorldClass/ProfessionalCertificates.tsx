import React from 'react'

function ProfessionalCertificates() {
    return (
        <div className="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-16 p-8 lg:p-16 md:mt-[5px] lg:mt-[-130px] xl:mt-[-180px] sm:mt-[400px] ">
            {/* Image Section */}
            <div className="lg:w-1/2 self-center">
                <img
                    src="https://img.freepik.com/premium-photo/side-view-portrait-warning-attractive-young-girl-freelancer-with-blonde-short-hair-is-sitting-cafe-making-video-call-laptop-with-raised-arms-showing-pause-gesture-indoor_416530-24443.jpg" // Replace with the actual image URL
                    alt="Professional Certificate"
                    className="rounded-lg shadow-lg"
                />
            </div>

            {/* Text Content */}
            <div className="lg:w-1/2 self-center">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">
                    Professional Certificates
                </h1>
                <p className="text-gray-700 mb-4">
                    Assist students in obtaining an important career micro-credential. Give students the opportunity to develop vital skills and employment confidence in high-growth sectors
                </p>
                <p className="text-gray-700 mb-4">
                    Assist students in obtaining an important career micro-credential. Give students the opportunity to develop vital skills and employment confidence in high-growth sectors
                </p>
                <p className="text-gray-700">
                    Give students the opportunity to obtain a Professional Certificate and prove they are prepared for entry-level employment
                </p>
            </div>
        </div>
    )
}

export default ProfessionalCertificates
