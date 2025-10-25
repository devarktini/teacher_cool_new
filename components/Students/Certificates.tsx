'use client'
import React, { useState, useEffect, useRef } from "react";
import { IoSearchOutline } from "react-icons/io5";
import Image from "next/image";
import { useSelector } from "react-redux";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import signagture from '@/public/images/signatureC.png';
import { selectAuth } from "@/store/features/authSlice";
import StudentApiService from "@/services/studentApi";

const CertificatePreview = React.forwardRef(({ studentName, courseTitle, issueDate }: any, ref: any) => {
    const certificateBg = "/images/blank_certificate.jpeg";
    return (
        <div
            ref={ref}
            style={{
                width: "850px",
                height: "600px",
                position: "relative",
                backgroundImage: `url(${certificateBg})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                backgroundColor: "#fff",
            }}
        >
            <div
                style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    textAlign: "center",
                    color: "#000",
                }}
            >
                <h2 className="text-4xl font-italic" style={{ fontSize: "26px", fontWeight: "bold", marginBottom: "20px" }}>
                    Certificate of Completion
                </h2>
                <p style={{ fontSize: "18px", lineHeight: "1.6" }}>
                    This is to certify that<br />
                    <strong>{studentName}</strong><br />
                    has successfully completed the course<br />
                    <strong className="font-bold mb-20">{courseTitle}</strong>
                    <br /><br /><br /><br />
                    on <strong>{issueDate}</strong>
                </p>
            </div>
            <div
                style={{
                    position: "absolute",
                    bottom: "40px",
                    right: "40px",
                    textAlign: "center",
                    fontSize: "16px",
                    color: "#000",
                }}
            >
                <Image
                    className="h-16 w-36"
                    src={signagture}
                    alt="Signature"
                />
                <p>...</p>
            </div>
        </div>
    );
});

const Certificates = () => {
    const { user } = useSelector(selectAuth);

    const [certificates, setCertificates] = useState<any>([]);
    const [studentName, setStudentName] = useState("");
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCertificate, setSelectedCertificate] = useState<any>(null);
    const [showPreview, setShowPreview] = useState<boolean>(false);

    // Separate refs: one for modal view and one for the hidden download container
    const modalPreviewRef = useRef(null);
    const downloadPreviewRef = useRef(null);

    useEffect(() => {
        const fetchCertifications = async () => {
            try {

                const userId = localStorage.getItem("id");

                const response = await StudentApiService.fetchCertifications(userId);
                // console.log(response?.data)

                const responseData = response?.data;
                if (responseData && typeof responseData === "object") {
                    const { student_name, ...courses } = responseData;
                    setStudentName(student_name || user?.name || "User");
                    const certificatesArray = Object.keys(courses).map((key: any) => courses[key]);
                    if (Array.isArray(certificatesArray) && certificatesArray.length > 0) {
                        setCertificates(certificatesArray);
                        setError(null);
                    } else {
                        throw new Error("No certificates found");
                    }
                } else {
                    throw new Error("Invalid data format received from server");
                }
            } catch (err: any) {
                console.error("Error fetching certificates:", err);
                // setError(err.message || "Something went wrong. Please try again later.");
            }
        };
        fetchCertifications();
    }, []);

    const handleViewCertificate = (certificate: any) => {
        setSelectedCertificate(certificate);
        setShowPreview(true);
    };

    const handleDownloadCertificate = (certificate: any) => {
        // Set the certificate to render the hidden download preview
        setSelectedCertificate(certificate);
        // Wait briefly to ensure the hidden component has rendered
        setTimeout(() => {
            if (downloadPreviewRef.current) {
                html2canvas(downloadPreviewRef.current, {
                    onclone: (clonedDoc) => {
                        clonedDoc.querySelectorAll("*").forEach((node: any) => {
                            const computedStyle = clonedDoc?.defaultView?.getComputedStyle(node);
                            if (computedStyle) {
                                if (computedStyle.backgroundColor && computedStyle.backgroundColor.includes("oklch")) {
                                    node.style.backgroundColor = "transparent";
                                }
                                if (computedStyle.color && computedStyle.color.includes("oklch")) {
                                    node.style.color = "#000";
                                }
                                if (computedStyle.borderColor && computedStyle.borderColor.includes("oklch")) {
                                    node.style.borderColor = "transparent";
                                }
                            }
                        });
                    },
                    backgroundColor: "#fff",
                }).then((canvas) => {
                    const imgData = canvas.toDataURL("image/png");
                    const pdf = new jsPDF("landscape", "pt", "a4");
                    const pdfWidth = pdf.internal.pageSize.getWidth();
                    const pdfHeight = pdf.internal.pageSize.getHeight();
                    const imgProps = pdf.getImageProperties(imgData);
                    const imgWidth = imgProps.width;
                    const imgHeight = imgProps.height;
                    const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
                    const finalWidth = imgWidth * ratio;
                    const finalHeight = imgHeight * ratio;
                    const x = (pdfWidth - finalWidth) / 2;
                    const y = (pdfHeight - finalHeight) / 2;
                    pdf.addImage(imgData, "PNG", x, y, finalWidth, finalHeight);
                    pdf.save(`${certificate.title}-certificate.pdf`);
                });
            }
        }, 500);
    };

    const filteredCertificates = certificates.filter((cert: any) =>
        cert.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <>
            <div className="bg-white rounded-md shadow-md py-4 px-4 my-4">
                <div className="flex flex-col md:flex-row justify-between items-center py-4 px-4">
                    <div className="flex flex-col md:flex-row gap-3 items-center w-full md:w-auto">

                        <div className="relative w-full md:w-64">
                            <input
                                type="text"
                                placeholder="Search..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="bg-white w-full h-10 rounded pl-9 pr-1 border outline-none"
                            />
                            <div className="absolute top-3 left-4">
                                <IoSearchOutline />
                            </div>
                        </div>
                    </div>

                    <div className="mt-3 md:mt-0">
                        <span className="font-semibold font-Roboto text-lg text-[#1E1E1E]">
                            Certificates
                        </span>
                    </div>
                </div>

                <div className="">
                    <p className="font-Roboto font-semibold text-xl text-[#0966ED] my-4">
                        All Certificates
                    </p>

                    <div className="p-4">
                        {error ? (
                            <div className="flex flex-col items-center justify-center py-8">
                                <div className="bg-red-50 rounded-lg p-4 max-w-md w-full text-center">
                                    <div className="flex items-center justify-center">
                                        <svg
                                            className="w-5 h-5 text-red-400 mr-3"
                                            fill="none"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                        </svg>
                                        <p className="text-sm text-red-600">{error}</p>
                                    </div>
                                </div>
                            </div>
                        ) : filteredCertificates?.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 py-6">
                                {filteredCertificates?.map((certificate: any, index: number) => (
                                    <div
                                        key={index}
                                        className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-white to-gray-50 shadow-md hover:shadow-2xl transition-all duration-300 border border-gray-100"
                                    >
                                        {/* Card inner content */}
                                        <div className="p-6 flex flex-col justify-between h-full">
                                            {/* Top section */}
                                            <div>
                                                <h2 className="text-2xl font-semibold text-gray-800 group-hover:text-indigo-600 transition-colors duration-300 mb-3">
                                                    {certificate.title}
                                                </h2>

                                                <div className="space-y-1 text-sm text-gray-600">
                                                    <p>
                                                        <span className="font-medium text-gray-700">Student:</span>{" "}
                                                        {studentName}
                                                    </p>
                                                    <p>
                                                        <span className="font-medium text-gray-700">Issued on:</span>{" "}
                                                        {new Date(certificate.awarded_at).toLocaleDateString()}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Divider */}
                                            <div className="my-4 h-px bg-gray-200" />

                                            {/* Buttons */}
                                            <div className="flex flex-col sm:flex-row gap-3">
                                                <button
                                                    onClick={() => handleViewCertificate(certificate)}
                                                    className="flex-1 bg-gradient-to-r from-emerald-500 to-green-500 text-white font-medium py-2.5 rounded-lg hover:from-emerald-600 hover:to-green-600 shadow-md hover:shadow-lg transition-all duration-200"
                                                >
                                                    View
                                                </button>
                                                <button
                                                    onClick={() => handleDownloadCertificate(certificate)}
                                                    className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-medium py-2.5 rounded-lg hover:from-blue-600 hover:to-indigo-600 shadow-md hover:shadow-lg transition-all duration-200"
                                                >
                                                     Download
                                                </button>
                                            </div>
                                        </div>

                                        {/* Subtle hover accent border */}
                                        <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-indigo-400 transition-all duration-300 pointer-events-none" />
                                    </div>
                                ))}
                            </div>

                        ) : (
                            <div className="flex flex-col items-center justify-center py-12">
                                <img
                                    src={process.env.PUBLIC_URL + "/images/no-data.svg"}
                                    alt="No certificates"
                                    className="w-48 h-48 mb-4"
                                />
                                <p className="text-gray-600 text-lg">
                                    {searchTerm
                                        ? "No certificates found matching your search."
                                        : "No certificates available yet."}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Modal Preview using modalPreviewRef */}
            {showPreview && selectedCertificate && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                    onClick={() => setShowPreview(false)}
                >
                    <div
                        className="bg-white p-4 rounded shadow-lg"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <CertificatePreview
                            ref={modalPreviewRef}
                            studentName={studentName}
                            courseTitle={selectedCertificate.title}
                            issueDate={new Date(selectedCertificate.awarded_at).toLocaleDateString()}
                        />
                        <div className="mt-4 text-right">
                            <button
                                onClick={() => setShowPreview(false)}
                                className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Hidden Preview for Download using downloadPreviewRef */}
            {selectedCertificate && (
                <div style={{ position: "absolute", top: "-10000px", left: "-10000px", opacity: 0 }}>
                    <CertificatePreview
                        ref={downloadPreviewRef}
                        studentName={studentName}
                        courseTitle={selectedCertificate.title}
                        issueDate={new Date(selectedCertificate.awarded_at).toLocaleDateString()}
                    />
                </div>
            )}
        </>
    );
};



export default Certificates;
