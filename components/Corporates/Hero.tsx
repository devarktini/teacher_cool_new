'use client'
import React, { useEffect, useState } from 'react'
import Image from 'next/image';
import Link from 'next/link';
import img1 from '@/public/images/corporates/img1.jpg';
import img4 from '@/public/images/corporates/img4.jpg';
import img3 from '@/public/images/corporates/img3.jpg';
import tickIcon from '@/public/images/university/tick.png'
import pexels from '@/public/images/corporates/pexels.png'
import { 
    FaRocket, 
    FaUsers, 
    FaChartLine, 
    FaAward, 
    FaShieldAlt, 
    FaLightbulb,
    FaCogs,
    FaHandshake,
    FaUserTie,
    FaGraduationCap,
    FaHeadset
} from 'react-icons/fa';

function Hero() {
    const sliderImages = [img1, img4, img3];
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setIndex((prev) => (prev + 1) % sliderImages.length);
        }, 4000);
        return () => clearInterval(interval);
    }, [sliderImages.length]);

    const allFeatures = [
        {
            icon: FaRocket,
            title: "Customized Training Pathways for Skill Development",
            description: "Tailored learning paths for specific team needs"
        },
        {
            icon: FaCogs,
            title: "On-Demand Learning for Flexibility & Convenience",
            description: "Learn anytime, anywhere at your own pace"
        },
        {
            icon: FaLightbulb,
            title: "Real-World Simulations and Scenario-Based Training",
            description: "Practical exercises for real business challenges"
        },
        {
            icon: FaChartLine,
            title: "Performance Tracking & Analytics",
            description: "Monitor progress with detailed insights"
        },
        {
            icon: FaAward,
            title: "Skill Certification & Recognition",
            description: "Industry-recognized credentials and badges"
        },
        {
            icon: FaUsers,
            title: "Collaboration & Knowledge Sharing",
            description: "Team-based learning and peer interaction"
        },
        {
            icon: FaHandshake,
            title: "Integration with Existing Tools",
            description: "Seamless connection with your current systems"
        },
        {
            icon: FaUserTie,
            title: "Soft Skills Development for Enhanced Performance",
            description: "Communication, leadership, and teamwork skills"
        },
        {
            icon: FaGraduationCap,
            title: "Leadership & Talent Development Programs",
            description: "Grow your next generation of leaders"
        },
        {
            icon: FaShieldAlt,
            title: "Compliance Training Made Easy",
            description: "Meet regulatory requirements effortlessly"
        },
        {
            icon: FaHeadset,
            title: "Dedicated Support for Seamless Implementation",
            description: "24/7 assistance for smooth onboarding"
        }
    ];

    const stats = [
        { number: "3,800+", label: "Companies Trust Us" },
        { number: "98%", label: "Satisfaction Rate" },
        { number: "45%", label: "Faster Skill Development" },
        { number: "3.2x", label: "ROI on Training" }
    ];

    return (
        <div className="min-h-screen">
            {/* Main Hero Section */}
            <section className="relative bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-12 lg:py-16 overflow-hidden">
                {/* Background Elements */}
                <div className="absolute top-0 right-0 w-72 h-72 bg-blue-100 rounded-full blur-3xl opacity-50"></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-100 rounded-full blur-3xl opacity-30"></div>
                
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                        {/* Content Section */}
                        <div className="space-y-6">
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 rounded-full border border-blue-200">
                                <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
                                <span className="text-sm font-semibold text-blue-700 uppercase tracking-wide">
                                    ENTERPRISE SOLUTIONS
                                </span>
                            </div>
                            
                            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                                Unlock Your Team's 
                                <span className="text-blue-600 block">Full Potential</span>
                            </h1>
                            
                            <p className="text-lg text-gray-600 leading-relaxed">
                                Drive business growth with comprehensive corporate training solutions designed 
                                to enhance skills, boost productivity, and foster continuous learning culture.
                            </p>

                            {/* Key Features Grid - First 6 */}
                            <div className="grid sm:grid-cols-2 gap-3">
                                {allFeatures.slice(0, 4).map((feature, index) => (
                                    <div key={index} className="flex items-start gap-3 p-3 rounded-xl bg-white/50 backdrop-blur-sm border border-gray-100 hover:shadow-md transition-all duration-300 group">
                                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-blue-600 transition-colors duration-300">
                                            <feature.icon className="w-5 h-5 text-blue-600 group-hover:text-white transition-colors duration-300" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-gray-800 text-sm leading-tight mb-1">
                                                {feature.title}
                                            </h3>
                                            <p className="text-gray-600 text-xs leading-relaxed">
                                                {feature.description}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* CTA Buttons */}
                            <div className="flex flex-col sm:flex-row gap-4 pt-4">
                                <Link
                                    href="/contact"
                                    className="inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                                >
                                    Start Free Trial
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                    </svg>
                                </Link>
                                {/* <Link
                                    href="/demo"
                                    className="inline-flex items-center justify-center gap-2 border border-blue-600 text-blue-600 px-8 py-3 rounded-xl font-semibold hover:bg-blue-50 transition-all duration-300"
                                >
                                    Book Demo
                                </Link> */}
                            </div>
                        </div>

                        {/* Image Slider Section */}
                        <div className="relative">
                            <div className="relative overflow-hidden rounded-2xl shadow-2xl">
                                <Image
                                    src={sliderImages[index]}
                                    alt={`Corporate training ${index + 1}`}
                                    className="w-full h-[400px] lg:h-[500px] object-cover transition-transform duration-1000 transform hover:scale-105"
                                    priority
                                />
                                
                                {/* Slide Indicator */}
                                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                                    {sliderImages.map((_, i) => (
                                        <button
                                            key={i}
                                            onClick={() => setIndex(i)}
                                            className={`w-3 h-3 rounded-full transition-all duration-300 ${
                                                i === index ? "bg-white scale-125" : "bg-white/50"
                                            }`}
                                        />
                                    ))}
                                </div>
                                
                                {/* Overlay Gradient */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                            </div>
                            
                            {/* Floating Stats */}
                            <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-xl p-4 border border-gray-100">
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-blue-600">3,800+</div>
                                    <div className="text-sm text-gray-600">Companies</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* All Features Section */}
            <section className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                            Comprehensive Corporate <span className="text-blue-600">Learning Solutions</span>
                        </h2>
                        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                            Everything you need to build a skilled, productive, and future-ready workforce
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {allFeatures.map((feature, index) => (
                            <div 
                                key={index}
                                className="group p-6 rounded-2xl border border-gray-200 hover:border-blue-200 hover:shadow-lg transition-all duration-300 bg-white hover:bg-blue-50/30"
                            >
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                                        <feature.icon className="w-6 h-6 text-white" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-gray-800 text-lg mb-2 group-hover:text-blue-600 transition-colors duration-300">
                                            {feature.title.split(' for')[0].split(' &')[0]}
                                        </h3>
                                        <p className="text-gray-600 text-sm leading-relaxed">
                                            {feature.description}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Trust Section */}
            <section className="py-16 bg-gradient-to-br from-gray-50 to-blue-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        {/* Image */}
                        <div className="relative group">
                            <div className="absolute -inset-4 bg-gradient-to-r from-blue-200 to-purple-200 rounded-2xl blur-xl opacity-0 group-hover:opacity-60 transition-opacity duration-500"></div>
                            <Image
                                src={pexels}
                                alt="Corporate leaders developing talent"
                                className="relative rounded-2xl shadow-lg w-full h-auto transform group-hover:scale-105 transition-transform duration-500"
                            />
                        </div>

                        {/* Content */}
                        <div className="space-y-8">
                            <div>
                                <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 leading-tight mb-4">
                                    Trusted by Industry 
                                    <span className="text-blue-600 block">Leaders Worldwide</span>
                                </h2>
                                
                                <p className="text-lg text-gray-600 leading-relaxed">
                                    Join 3,800+ forward-thinking companies that develop their talent, 
                                    drive innovation, and achieve remarkable business growth with TeacherCool's 
                                    enterprise learning platform.
                                </p>
                            </div>

                            {/* Stats Grid */}
                            <div className="grid grid-cols-2 gap-6">
                                {stats.map((stat, index) => (
                                    <div key={index} className="text-center p-4 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
                                        <div className="text-2xl lg:text-3xl font-bold text-blue-600 mb-1">{stat.number}</div>
                                        <div className="text-sm text-gray-600 font-medium">{stat.label}</div>
                                    </div>
                                ))}
                            </div>

                            {/* Additional Highlights */}
                            <div className="bg-white rounded-2xl p-6 border border-blue-100 shadow-sm">
                                <h4 className="font-semibold text-gray-800 mb-3">Why Companies Choose Us:</h4>
                                <div className="grid gap-2">
                                    {[
                                        "Scalable solutions for organizations of all sizes",
                                        "Proven track record of success across industries", 
                                        "Continuous platform updates and innovation",
                                        "Dedicated account management and support"
                                    ].map((item, index) => (
                                        <div key={index} className="flex items-center gap-2 text-gray-700">
                                            <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                                                <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                </svg>
                                            </div>
                                            <span className="text-sm">{item}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Final CTA Section */}
        </div>
    )
}

export default Hero