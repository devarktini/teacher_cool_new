'use client';
import React, { useState, useEffect, useRef } from "react";

const HeroSection = ({ onScrollToSection }: any) => {
    // ✅ Store current video (use public path)
    const [currentVideo, setCurrentVideo] = useState("/videos/Module1.mp4");
    const videoRef = useRef<HTMLVideoElement | null>(null);


    // ✅ Auto play whenever video changes
    useEffect(() => {
        if (videoRef.current) {
            videoRef.current?.load();
            videoRef.current?.play().catch(() => {
                // Autoplay might be blocked by the browser
            });
        }
    }, [currentVideo]);

    return (
        <div className="bg-gradient-to-b from-white to-gray-50 py-12 px-6 md:px-16 lg:px-24">
            <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-10 items-center">
                {/* Left Content */}
                <div>
                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-snug">
                        Master Data Science & <br /> Machine Learning —{" "}
                        <span className="text-blue-600">Affordable Bundles</span> with
                        Lifetime Access
                    </h1>

                    <p className="text-gray-600 mt-4 text-lg">
                        Learn Python, Statistics, Machine Learning, Computer Vision & Power BI.
                        Get certified, build projects, and become job-ready on your schedule.
                    </p>

                    {/* Buttons */}
                    <div className="mt-6 flex gap-4">
                        <button
                            className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-700 transition"
                            onClick={() => onScrollToSection("pricing")}
                        >
                            Explore Bundles
                        </button>
                        <button
                            className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow-md border hover:bg-blue-700 transition"
                            onClick={() => onScrollToSection("why")}
                        >
                            Why Teachercool?
                        </button>
                    </div>

                    {/* Features */}
                    <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-3 text-gray-700 text-sm">
                        <div className="flex items-center gap-2">
                            <span className="text-green-500">✔</span> Lifetime Access
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-green-500">✔</span> Certificate of Completion
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-green-500">✔</span> Industry Projects
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-green-500">✔</span> Affordable Pricing
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-green-500">✔</span> Learn from Experts
                        </div>
                    </div>
                </div>

                {/* Right Card */}
                <div className="bg-white rounded-2xl shadow-lg p-6">
                    <div className="flex items-center mb-4">
                        <span className="h-2 w-2 rounded-full bg-green-500 mr-2"></span>
                        <p className="text-sm font-medium text-gray-600">Course Player Preview</p>
                    </div>

                    {/* ✅ Video Preview */}
                    <div className="bg-gray-200 rounded-lg overflow-hidden">
                        <video
                            ref={videoRef}
                            controls
                            className="w-full h-48 md:h-72 object-cover rounded-lg"
                        >
                            <source src={currentVideo} type="video/mp4" />
                            Your browser does not support the video tag.
                        </video>
                    </div>

                    {/* ✅ Course List Buttons */}
                    <div className="grid grid-cols-2 gap-3 mt-6">
                        <button
                            onClick={() => setCurrentVideo("/videos/SimpleExpressions.mp4")}
                            className="border px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-700 text-white transition"
                        >
                            Python for Data Science
                        </button>
                        <button
                            onClick={() => setCurrentVideo("/videos/TypesofStats.mp4")}
                            className="border px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-700 text-white transition"
                        >
                            Statistics for DS
                        </button>
                        <button
                            onClick={() => setCurrentVideo("/videos/Module1.mp4")}
                            className="border px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-700 text-white transition col-span-2"
                        >
                            Power BI
                        </button>
                    </div>
                </div>
            </div>

            {/* Bottom Highlights */}
            <div className="flex flex-wrap justify-center gap-4 mt-12">
                <span className="bg-blue-600 text-white px-6 py-2 rounded-full shadow">
                    Corporate Training Ready
                </span>
                <span className="bg-blue-600 text-white px-6 py-2 rounded-full shadow">
                    Hands-on Projects
                </span>
                <span className="bg-blue-600 text-white px-6 py-2 rounded-full shadow">
                    Beginner → Advanced
                </span>
                <span className="bg-blue-600 text-white px-6 py-2 rounded-full shadow">
                    Community Support
                </span>
            </div>
        </div>
    );
};

export default HeroSection;
