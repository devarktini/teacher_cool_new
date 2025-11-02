'use client'
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import logo from '@/public/images/Logo.png'
import Image from 'next/image';

function CareerClient() {
    const [jobs, setJobs] = useState([]); // Store all jobs
    const [filteredJobs, setFilteredJobs] = useState([]); // Store filtered jobs
    const [search, setSearch] = useState("");
    const [toggleModal, setToggleModal] = useState(false);
  

    useEffect(() => {
        fetchJobs();
    }, []);

    const fetchJobs = async () => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/lms/career/`);
            if (Array.isArray(response.data.data)) {
                setJobs(response.data.data);
                setFilteredJobs(response.data.data); // Keep original jobs as backup
            } 
        } catch (error) {
            // console.error("Error fetching jobs", error);
            return;
        }
    };

    const handleSearch = (e: any) => {
        const searchTerm = e.target.value.toLowerCase();
        setSearch(searchTerm);

        if (!searchTerm.trim()) {
            setFilteredJobs(jobs);
            return;
        }

        const updatedJobs = jobs.filter((job: any) => {
            const titleMatch = job.title?.toLowerCase().includes(searchTerm);
            const categoryMatch = job.category?.toLowerCase().includes(searchTerm);
            const departmentMatch = job.department?.toLowerCase().includes(searchTerm);
            const locationMatch = job.location?.toLowerCase().includes(searchTerm);

            return titleMatch || categoryMatch || departmentMatch || locationMatch;
        });

        setFilteredJobs(updatedJobs);
    };

    const handleConfirm = () => {
        setToggleModal(!toggleModal);
    };
    return (
        <>
            <div className="bg-gradient-to-r from-blue-100 via-white to-purple-100 min-h-screen py-10">
                <div className="container mx-auto px-4">
                    <h1 className="text-4xl font-extrabold text-center mb-8 text-blue-800">
                        🌟 Explore Your Dream Job
                    </h1>
                    {/* Search Input */}
                    <div className="flex justify-center mb-8">
                        <input
                            type="text"
                            placeholder="Search by Job Title, Category, Department, or Location"
                            value={search}
                            onChange={handleSearch}
                            className="w-full md:w-1/3 px-4 py-2 border rounded-lg shadow-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    {/* Job Cards */}
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {filteredJobs.length > 0 ? (
                            filteredJobs.map((job: any) => (
                                <div
                                    key={job.id}
                                    className="bg-white rounded-lg shadow-lg p-6 hover:shadow-2xl transition duration-300"
                                >
                                    <h2 className="text-2xl font-bold text-blue-700 mb-2">
                                        {typeof job.title === "string" ? job.title : "Untitled"}
                                    </h2>
                                    <div className="flex items-center gap-2 flex-wrap mb-4">
                                        <span className="px-3 py-1 rounded-full text-sm font-medium">
                                            {typeof job.type === "string" ? job.type : "N/A"}
                                        </span>
                                        <span className="px-3 py-1 rounded-full text-sm font-medium">
                                            {typeof job.department === "string" ? job.department : "N/A"}
                                        </span>
                                        <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm font-medium">
                                            {typeof job.location === "string" ? job.location : "Unknown Location"}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <p className="text-lg font-semibold text-blue-500">
                                            Salary: {job.salary.from} - {job.salary.to}
                                        </p>
                                        <button
                                            onClick={handleConfirm}
                                            className="text-gray-500 px-4 py-2 rounded-lg shadow-md transition duration-300 hover:bg-blue-200"
                                        >
                                            Apply Now
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center text-gray-500 mt-10">
                                <p>No jobs found. Try modifying your search criteria.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            {/* Confirmation Modal */}
            {toggleModal && (
                <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full relative">
                        <div className="text-center">
                            <Image src={logo} alt="logo" className="w-24 mx-auto mb-4" />
                            <p className="text-gray-600 font-bold mb-6 capitalize">
                                Please send your resume to the email address below:
                            </p>
                            <p className="text-blue-500 font-medium mb-6">
                                info@teachercool.com
                            </p>
                            <button
                                onClick={handleConfirm}
                                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors"
                            >
                                OK
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </>
    )
}

export default CareerClient
