'use client'
import axios from 'axios';
import Image from 'next/image';
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import pic2 from '@/public/images/university/pic2.png'
import pic4 from '@/public/images/university/pic4.png'
import logo from '@/public/images/Logo.png'
import tick from '@/public/images/university/tick.png'
import img4 from '@/public/images/university/img4.jpg'
import img6 from '@/public/images/university/img6.jpg'
import { FaGraduationCap, FaUniversity, FaChalkboardTeacher, FaRocket, FaUsers, FaChartLine, FaMobileAlt, FaShieldAlt, FaCertificate, FaHandshake } from 'react-icons/fa';

function UniversityClient() {
    const [formValue, setFormValue] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        institutionType: "",
        institutionName: "",
        jobRole: "",
        department: "",
        country: "",
        needs: "",
    });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleChange = (e: any) => {
        const { name, value } = e.target;
        setFormValue({ ...formValue, [name]: value });
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        setLoading(true)
        await sendFormData()
        setSuccess(true);
        setFormValue({
            firstName: "",
            lastName: "",
            email: "",
            phone: "",
            institutionType: "",
            institutionName: "",
            jobRole: "",
            department: "",
            country: "",
            needs: "",
        })
    };

    const sendFormData = async () => {
        const formData = new FormData();
        formData.append("first_name", formValue.firstName)
        formData.append("last_name", formValue.lastName)
        formData.append("business_email", formValue.email)
        formData.append("contact_number", formValue.phone)
        formData.append("instution_type", formValue.institutionType)
        formData.append("institution_name", formValue.institutionName)
        formData.append("job_role", formValue.jobRole)
        formData.append("department", formValue.department)
        formData.append("country", formValue.country)
        formData.append("message", formValue.needs)

        try {
            const res = await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}lms/proposal-request/`,
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        accept: "application/json",
                    },
                }
            );
        } catch (err) {
            // console.error("Error:", err);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (success) {
            const timer = setTimeout(() => {
                setSuccess(false);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [success]);

    const features = [
        { icon: FaGraduationCap, text: "Course Management" },
        { icon: FaUniversity, text: "Flexible Learning" },
        { icon: FaChartLine, text: "Advanced Analytics" },
        { icon: FaUsers, text: "Communication Tools" },
        { icon: FaChalkboardTeacher, text: "Assessment Tools" },
        { icon: FaMobileAlt, text: "Mobile Access" }
    ];

    const benefits = [
        "Industry-recognized certificates",
        "Essential job skills training", 
        "Real-world project portfolio",
        "Career exploration guidance"
    ];

    return (
        <div className="min-h-screen">
            {/* Success Toast */}
            {success && (
                <div className="fixed top-4 right-4 z-50 animate-slideIn">
                    <div className="bg-green-500 text-white px-4 py-3 rounded-lg shadow-lg border border-green-300 flex items-center space-x-2">
                        <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center">
                            <svg className="w-3 h-3 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <span className="font-semibold text-sm">Submitted successfully!</span>
                    </div>
                </div>
            )}

            {/* Hero Section - Compact */}
            <section className="bg-gradient-to-br from-blue-50 to-indigo-50 py-12">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="grid lg:grid-cols-2 gap-8 items-center">
                        <div className="space-y-6">
                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 rounded-full border border-blue-200">
                                <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
                                <span className="text-xs font-semibold text-blue-700 uppercase">FOR UNIVERSITIES</span>
                            </div>
                            
                            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
                                Boost Employability &<br />
                                <span className="text-blue-600">Attract More Students</span>
                            </h1>
                            
                            <p className="text-gray-600">
                                Prepare students for success with industry-relevant skills highly sought after by employers.
                            </p>

                            <div className="space-y-3">
                                <div className="flex items-center gap-2 text-gray-700">
                                    <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                                        <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <span className="text-sm">Industry-relevant curriculum</span>
                                </div>
                                <div className="flex items-center gap-2 text-gray-700">
                                    <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                                        <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <span className="text-sm">Project-based learning</span>
                                </div>
                            </div>

                            <Link 
                                href="/contact" 
                                className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors text-sm"
                            >
                                Connect With Us
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                            </Link>
                        </div>

                        <div className="relative">
                            <Image 
                                src={img6} 
                                alt="University students" 
                                className="rounded-xl shadow-lg w-full h-auto"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section - Compact */}
            <section className="py-12 bg-white">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="grid lg:grid-cols-2 gap-8 items-center">
                        <div className="relative">
                            <Image 
                                src={pic4} 
                                alt="Platform" 
                                className="rounded-xl shadow-lg w-full h-auto"
                            />
                        </div>

                        <div className="space-y-6">
                            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
                                Built for <span className="text-blue-600">Higher Education</span>
                            </h2>
                            <p className="text-gray-600">
                                TeacherCool provides comprehensive, flexible, and student-centered learning experiences tailored for universities.
                            </p>

                            <div className="grid grid-cols-2 gap-3">
                                {features.map((feature, index) => (
                                    <div key={index} className="flex items-center gap-2 p-2 rounded-lg hover:bg-blue-50 transition-colors">
                                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                            <feature.icon className="w-4 h-4 text-blue-600" />
                                        </div>
                                        <span className="text-sm text-gray-700 font-medium">{feature.text}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Career Academy - Compact */}
            <section className="py-12 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="grid lg:grid-cols-2 gap-8 items-center">
                        <div className="space-y-6">
                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 rounded-full border border-blue-200">
                                <FaGraduationCap className="w-3 h-3 text-blue-600" />
                                <span className="text-xs font-semibold text-blue-700 uppercase">CAREER ACADEMY</span>
                            </div>
                            
                            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
                                Professional Development Hub
                            </h2>
                            
                            <p className="text-gray-600">
                                Equip students for high-demand careers with training from top global companies.
                            </p>

                            <div className="space-y-3">
                                {benefits.map((benefit, index) => (
                                    <div key={index} className="flex items-center gap-2 text-gray-700">
                                        <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                                            <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                        <span className="text-sm">{benefit}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="relative">
                            <Image 
                                src={pic2} 
                                alt="Career Academy" 
                                className="rounded-xl shadow-lg w-full h-auto"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Certificates Section - Compact */}
            <section className="py-12 bg-white">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="grid lg:grid-cols-2 gap-8 items-center">
                        <div className="relative">
                            <Image 
                                src={img4} 
                                alt="Certificates" 
                                className="rounded-xl shadow-lg w-full h-auto"
                            />
                        </div>

                        <div className="space-y-6">
                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 rounded-full border border-blue-200">
                                <FaCertificate className="w-3 h-3 text-blue-600" />
                                <span className="text-xs font-semibold text-blue-700 uppercase">PROFESSIONAL CERTIFICATES</span>
                            </div>
                            
                            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
                                Industry-Recognized Credentials
                            </h2>
                            
                            <p className="text-gray-600">
                                Professional Certificates are crucial for improving employment prospects and demonstrating job market readiness.
                            </p>
                            
                            <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                                <p className="text-blue-800 font-semibold text-sm">
                                    Enhance your curriculum and improve student employment outcomes.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Grid - Compact */}
            <section className="py-12 bg-blue-600 text-white">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="text-center mb-8">
                        <h2 className="text-2xl sm:text-3xl font-bold mb-4">
                            Broaden Your Curriculum
                        </h2>
                        <p className="text-blue-100">
                            Offer career-oriented learning with courses from industry professionals.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-4">
                        {[
                            {
                                icon: FaGraduationCap,
                                title: "World-Class Content",
                                description: "Content from industry leaders"
                            },
                            {
                                icon: FaChalkboardTeacher,
                                title: "Guided Projects",
                                description: "Hands-on practical experience"
                            },
                            {
                                icon: FaCertificate,
                                title: "Professional Certificates",
                                description: "Build job-ready skills"
                            }
                        ].map((feature, index) => (
                            <div key={index} className="bg-white/10 rounded-xl p-4 text-center">
                                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center mx-auto mb-3">
                                    <feature.icon className="w-5 h-5 text-blue-600" />
                                </div>
                                <h3 className="font-semibold mb-1 text-sm">{feature.title}</h3>
                                <p className="text-blue-100 text-xs">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonial - Compact */}
            <section className="py-12 bg-blue-800 text-white">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <h2 className="text-2xl font-bold mb-4">
                        Join Forward-Thinking Universities
                    </h2>
                    <blockquote className="text-blue-100 italic mb-4 text-sm">
                        "TeacherCool ensures we deliver high-quality education that enhances career prospects. Essential for modern education."
                    </blockquote>
                    <p className="text-blue-200 text-xs">
                        Global network choosing TeacherCool for their students
                    </p>
                </div>
            </section>

            {/* Contact Form - Compact */}
            <section className="py-12 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="grid lg:grid-cols-2 gap-8">
                        <div className="space-y-6">
                            <div className="text-center lg:text-left">
                                <Image src={logo} alt="TeacherCool" className="h-10 w-auto mx-auto lg:mx-0 mb-4" />
                                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                                    Contact Sales Team
                                </h2>
                                <p className="text-gray-600 text-sm">
                                    Discover how to transform your institution's educational offerings.
                                </p>
                            </div>

                            <div className="space-y-3">
                                {[
                                    "Align curriculum with careers",
                                    "Improve employment outcomes", 
                                    "Enhance learning experiences"
                                ].map((item, index) => (
                                    <div key={index} className="flex items-center gap-2 text-gray-700">
                                        <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                                            <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                        <span className="text-sm">{item}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid sm:grid-cols-2 gap-4">
                                    <input
                                        type="text"
                                        name="firstName"
                                        placeholder="First Name *"
                                        value={formValue.firstName}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                        required
                                    />
                                    <input
                                        type="text"
                                        name="lastName"
                                        placeholder="Last Name *"
                                        value={formValue.lastName}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                        required
                                    />
                                </div>

                                <div className="grid sm:grid-cols-2 gap-4">
                                    <input
                                        type="email"
                                        name="email"
                                        placeholder="Email *"
                                        value={formValue.email}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                        required
                                    />
                                    <input
                                        type="tel"
                                        name="phone"
                                        placeholder="Phone *"
                                        value={formValue.phone}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                        required
                                    />
                                </div>

                                <div className="grid sm:grid-cols-2 gap-4">
                                    <input
                                        type="text"
                                        name="institutionType"
                                        placeholder="Institution Type *"
                                        value={formValue.institutionType}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                        required
                                    />
                                    <input
                                        type="text"
                                        name="institutionName"
                                        placeholder="Institution Name *"
                                        value={formValue.institutionName}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                        required
                                    />
                                </div>

                                <div className="grid sm:grid-cols-2 gap-4">
                                    <input
                                        type="text"
                                        name="jobRole"
                                        placeholder="Job Role *"
                                        value={formValue.jobRole}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                        required
                                    />
                                    <input
                                        type="text"
                                        name="department"
                                        placeholder="Department *"
                                        value={formValue.department}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                        required
                                    />
                                </div>

                                <input
                                    type="text"
                                    name="country"
                                    placeholder="Country *"
                                    value={formValue.country}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                    required
                                />

                                <textarea
                                    name="needs"
                                    placeholder="Your Needs *"
                                    value={formValue.needs}
                                    onChange={handleChange}
                                    rows={3}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none text-sm"
                                    required
                                />

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors ${
                                        loading 
                                            ? 'bg-gray-400 cursor-not-allowed' 
                                            : 'bg-blue-600 hover:bg-blue-700'
                                    } text-white text-sm`}
                                >
                                    {loading ? 'Submitting...' : 'Submit Request'}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </section>

            {/* Final CTA - Compact */}
            <section className="py-12 bg-blue-800 text-white">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <h2 className="text-2xl font-bold mb-4">
                        Prepare Graduates for Success
                    </h2>
                    <p className="text-blue-100 mb-6 text-sm">
                        Expand your reach and empower students with TeacherCool for Campus.
                    </p>
                    <Link 
                        href="/contact"
                        className="inline-flex items-center gap-2 bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors text-sm"
                    >
                        Contact Us
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                    </Link>
                </div>
            </section>

            <style jsx>{`
                @keyframes slideIn {
                    from {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }
                .animate-slideIn {
                    animation: slideIn 0.3s ease-out;
                }
            `}</style>
        </div>
    )
}

export default UniversityClient