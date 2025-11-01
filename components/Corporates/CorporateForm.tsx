'use client'
import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import tickIcon from '@/public/images/university/tick.png'
import logo from '@/public/images/Logo.png'
import axios from 'axios'
import { FaCheckCircle, FaRocket, FaUserGraduate, FaPlay, FaChartLine, FaAward, FaArrowRight } from 'react-icons/fa'

function CorporateForm() {
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
            console.error("Error:", err);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (success) {
            const timer = setTimeout(() => {
                setSuccess(false);
            }, 4000);
            return () => clearTimeout(timer);
        }
    }, [success]);

    const features = [
        {
            icon: FaRocket,
            title: "Expert-Led Courses for Real-World Impact",
            description: "Our courses are created by industry leaders and experts, ensuring that learners gain relevant, up-to-date knowledge and practical skills."
        },
        {
            icon: FaUserGraduate,
            title: "Personalized Learning Journeys",
            description: "Every learner is unique, and we tailor the learning experience to meet your specific goals with adaptive learning paths."
        },
        {
            icon: FaPlay,
            title: "Interactive, Engaging Content",
            description: "Dynamic multimedia, simulations, case studies, and real-world scenarios make learning both effective and enjoyable."
        },
        {
            icon: FaChartLine,
            title: "Measurable Results",
            description: "Advanced analytics track progress and demonstrate skills acquired, ensuring return on your learning investment."
        },
        {
            icon: FaAward,
            title: "Continuous Support & Feedback",
            description: "Access to expert instructors, peer collaboration, and real-time feedback for ongoing learning success."
        }
    ];

    return (
        <>
            {/* Success Toast */}
            {success && (
                <div className="fixed top-6 right-6 z-50 animate-slideIn">
                    <div className="bg-green-500 text-white px-6 py-4 rounded-2xl shadow-2xl border border-green-300 flex items-center space-x-3">
                        <FaCheckCircle className="w-6 h-6 text-white" />
                        <div>
                            <p className="font-semibold">Thank you for your interest!</p>
                            <p className="text-green-100 text-sm">We'll contact you within 24 hours.</p>
                        </div>
                    </div>
                </div>
            )}

            <section className="relative bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-16 lg:py-20 overflow-hidden">
                {/* Background Elements */}
                <div className="absolute top-0 right-0 w-72 h-72 bg-blue-100 rounded-full blur-3xl opacity-50"></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-100 rounded-full blur-3xl opacity-30"></div>
                
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
                        {/* Left Content Section */}
                        <div className="space-y-8">
                            <div className="text-center lg:text-left">
                                <Image src={logo} alt="TeacherCool Logo" className="h-12 w-auto mx-auto lg:mx-0 mb-6" />
                                
                                <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 rounded-full border border-blue-200 mb-4">
                                    <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
                                    <span className="text-sm font-semibold text-blue-700 uppercase tracking-wide">
                                        GET STARTED
                                    </span>
                                </div>
                                
                                <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                                    Transform Your Organization with 
                                    <span className="text-blue-600 block">High-Impact Learning</span>
                                </h1>
                                
                                <p className="text-lg text-gray-600 leading-relaxed mb-8">
                                    At TeacherCool, we believe in the transformative power of learning. Our platform is designed to help organizations unlock their full potential through hands-on skill development.
                                </p>
                            </div>

                            {/* Features Grid */}
                            <div className="space-y-4">
                                {features.map((feature, index) => (
                                    <div 
                                        key={index}
                                        className="flex items-start gap-4 p-2 rounded-2xl bg-white/50 backdrop-blur-sm border border-gray-100 hover:shadow-lg transition-all duration-300 group"
                                    >
                                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                                            <feature.icon className="w-6 h-6 text-white" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-gray-800 text-md mb-2 group-hover:text-blue-600 transition-colors duration-300">
                                                {feature.title}
                                            </h3>
                                            <p className="text-gray-600 text-sm leading-relaxed">
                                                {feature.description}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Trust Indicators */}
                            {/* <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                                <h4 className="font-semibold text-gray-800 mb-4">Why 3,800+ Companies Choose Us</h4>
                                <div className="grid grid-cols-2 gap-4 text-center">
                                    {[
                                        { number: "98%", label: "Satisfaction Rate" },
                                        { number: "45%", label: "Faster Skill Growth" },
                                        { number: "3.2x", label: "ROI on Training" },
                                        { number: "24/7", label: "Support" }
                                    ].map((stat, index) => (
                                        <div key={index}>
                                            <div className="text-xl font-bold text-blue-600">{stat.number}</div>
                                            <div className="text-sm text-gray-600">{stat.label}</div>
                                        </div>
                                    ))}
                                </div>
                            </div> */}
                        </div>

                        {/* Form Section */}
                        <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-6 lg:p-8">
                            <div className="text-center mb-8">
                                <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
                                    Request a Demo
                                </h2>
                                <p className="text-gray-600">
                                    Let's discuss how we can transform your organization's learning experience
                                </p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid sm:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            First Name *
                                        </label>
                                        <input
                                            type="text"
                                            name="firstName"
                                            value={formValue.firstName}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                                            placeholder="Enter your first name"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Last Name *
                                        </label>
                                        <input
                                            type="text"
                                            name="lastName"
                                            value={formValue.lastName}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                                            placeholder="Enter your last name"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="grid sm:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Email *
                                        </label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formValue.email}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                                            placeholder="Enter your business email"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Phone Number *
                                        </label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formValue.phone}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                                            placeholder="Enter your phone number"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="grid sm:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Institution Type *
                                        </label>
                                        <input
                                            type="text"
                                            name="institutionType"
                                            value={formValue.institutionType}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                                            placeholder="Enter institution type"
                                            required
                                        />
                                        {/* <select
                                            name="institutionType"
                                            value={formValue.institutionType}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 appearance-none bg-white"
                                            required
                                        >
                                            <option value="">Select institution type</option>
                                            <option value="corporate">Corporate</option>
                                            <option value="enterprise">Enterprise</option>
                                            <option value="sme">SME</option>
                                            <option value="startup">Startup</option>
                                        </select> */}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Institution Name *
                                        </label>
                                        <input
                                            type="text"
                                            name="institutionName"
                                            value={formValue.institutionName}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                                            placeholder="Enter institution name"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="grid sm:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Job Role *
                                        </label>
                                        <input
                                            type="text"
                                            name="jobRole"
                                            value={formValue.jobRole}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                                            placeholder="Enter your job role"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Department *
                                        </label>
                                        <input
                                            type="text"
                                            name="department"
                                            value={formValue.department}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                                            placeholder="Enter your department"
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Country *
                                    </label>
                                    <input
                                        type="text"
                                        name="country"
                                        value={formValue.country}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                                        placeholder="Enter your country"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Your Needs & Requirements *
                                    </label>
                                    <textarea
                                        name="needs"
                                        value={formValue.needs}
                                        onChange={handleChange}
                                        rows={4}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 resize-none"
                                        placeholder="Tell us about your learning and development needs..."
                                        required
                                    />
                                </div>

                                {/* <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                                    <p className="text-sm text-gray-600 text-center">
                                        By submitting your info, you agree to our{' '}
                                        <Link href="/terms" className="text-blue-600 font-semibold hover:text-blue-700 no-underline">
                                            Terms of Use
                                        </Link>{' '}
                                        and{' '}
                                        <Link href="/policy" className="text-blue-600 font-semibold hover:text-blue-700 no-underline">
                                            Privacy Notice
                                        </Link>
                                        . We may use this info to contact you and/or use data from third parties to personalize your experience.
                                    </p>
                                </div> */}

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className={`w-full py-4 px-6 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 ${
                                        loading 
                                            ? 'bg-gray-400 cursor-not-allowed' 
                                            : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-xl'
                                    } text-white flex items-center justify-center gap-2`}
                                >
                                    {loading ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            Processing...
                                        </>
                                    ) : (
                                        <>
                                            <FaArrowRight className="w-4 h-4" />
                                            Request Free Demo
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>
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
                    animation: slideIn 0.5s ease-out;
                }
            `}</style>
        </>
    )
}

export default CorporateForm