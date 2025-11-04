'use client'
import { useCallback, useState } from "react";
import toast from 'react-hot-toast';
import axios from "axios";
import Image from "next/image";
import pic166 from "@/public/images/image166.png";
import pic167 from "@/public/images/image167.png";
import pic168 from "@/public/images/image168.png";
import arc from "@/public/images/Ellipse4.png";
import aboutImg from "@/public/images/aboutImg.jpg";
import { useDispatch, useSelector } from "react-redux";
import { selectAuth } from "@/store/features/authSlice";
import { showLoginPopup } from "@/store/features/loginSlice";
import Link from "next/link";

export default function AboutClient() {
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        businessEmail: "",
        contactNumber: "",
        servicesLookingFor: "",
        companyName: "",
        message: "",
    });
    const [loading, setLoading] = useState(false);
    const { isAuthenticated } = useSelector(selectAuth);
    const dispatch = useDispatch<any>()

    const handleChange = (e: any) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        setLoading(true);

        await sendProposalRequest();
        setFormData({
            firstName: "",
            lastName: "",
            businessEmail: "",
            contactNumber: "",
            servicesLookingFor: "",
            companyName: "",
            message: "",
        });
    };

    async function sendProposalRequest() {
        const formBody = new FormData();
        formBody.append("first_name", formData.firstName);
        formBody.append("last_name", formData.lastName);
        formBody.append("business_email", formData.businessEmail);
        formBody.append("contact_number", formData.contactNumber);
        formBody.append("services_looking_for", formData.servicesLookingFor);
        formBody.append("company_name", formData.companyName);
        formBody.append("message", formData.message);
        try {
            const res = await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}lms/proposal-request/`,
                formBody,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        accept: "application/json",
                    },
                }
            );
            toast.success("Proposal request sent successfully!");
        } catch (err) {
            toast.error("Something went wrong!");
        } finally {
            setLoading(false);
        }
    }

    const handleStartLearning = useCallback(() => {
        if (!isAuthenticated) {
            dispatch(showLoginPopup())
        } else {
            // navigate to courses / dashboard if authenticated (implement as needed)
            // router.push('/courses')
        }
    }, [dispatch, isAuthenticated])

    const stats = [
        { number: "10K+", label: "Active Learners" },
        { number: "20+", label: "Partners" },
        { number: "2+", label: "Countries" },
        { number: "2016", label: "Founded" }
    ];

    return (
        <div className="relative">
            {/* Hero Section */}
            <div className="relative h-[70vh] w-full overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 to-purple-900/60 z-10"></div>
                <video
                    className="w-full h-full object-cover"
                    autoPlay
                    loop
                    muted
                    playsInline
                >
                    <source src="/videos/lmsv2.mp4" type="video/mp4" />
                </video>

                <div className="absolute inset-0 z-20 flex items-center justify-center">
                    <div className="text-center text-white max-w-4xl px-4">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 rounded-full border border-white/30 mb-6 backdrop-blur-sm">
                            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                            <span className="text-sm font-semibold">WELCOME TO TEACHERCOOL</span>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                            Transforming Lives Through <span className="text-blue-300">Education</span>
                        </h1>
                        <p className="text-lg md:text-xl text-blue-100 leading-relaxed max-w-3xl mx-auto">
                            "We believe that learning is the catalyst for human advancement. It holds the power to
                            transform our world—from despair to hope, from inequality to opportunity, from division to unity."
                        </p>
                    </div>
                </div>

                {/* Scroll Indicator */}
                <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
                    <div className="animate-bounce">
                        <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
                            <div className="w-1 h-3 bg-white rounded-full mt-2"></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Section */}
            <div className="bg-white py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                        {stats.map((stat, index) => (
                            <div key={index} className="text-center group">
                                <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl p-6 shadow-sm border border-gray-100 group-hover:shadow-lg transition-all duration-300">
                                    <div className="text-3xl lg:text-4xl font-bold text-blue-600 mb-2">
                                        {stat.number}
                                    </div>
                                    <div className="text-gray-600 font-medium">
                                        {stat.label}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Vision Mission Values Section */}
            <div className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 py-20 overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 left-0 w-72 h-72 bg-white rounded-full blur-3xl"></div>
                    <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
                </div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 rounded-full border border-white/30 mb-4 backdrop-blur-sm">
                            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                            <span className="text-sm font-semibold text-white">OUR PHILOSOPHY</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                            Our Guiding Principles
                        </h1>
                        <p className="text-xl text-blue-100 max-w-3xl mx-auto">
                            Learning is the source of human progress. It has the power to transform our world
                            from illness to health, from poverty to prosperity, from conflict to peace.
                        </p>
                    </div>

                    {/* Cards Grid */}
                    <div className="grid gap-8 md:grid-cols-3">
                        {[
                            {
                                title: "Vision",
                                icon: "👁️",
                                content: "We believe that learning is the catalyst for human advancement. It holds the power to transform our world—from despair to hope, from inequality to opportunity, from division to unity.",
                                gradient: "from-blue-500 to-cyan-500"
                            },
                            {
                                title: "Mission",
                                icon: "🎯",
                                content: "TeacherCool platform collaborates with a diverse network of top universities and industry leaders to deliver flexible, accessible, and relevant online learning experiences for individuals and organizations globally.",
                                gradient: "from-purple-500 to-pink-500"
                            },
                            {
                                title: "Values",
                                icon: "💎",
                                content: "Regardless of our backgrounds or locations, education serves as a powerful catalyst for transformation and growth. It enables us to explore new horizons and unlock our potential.",
                                gradient: "from-green-500 to-emerald-500"
                            }
                        ].map((item, index) => (
                            <div
                                key={index}
                                className="group relative bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 hover:bg-white/15 transition-all duration-500 hover:scale-105"
                            >
                                {/* Icon */}
                                <div className={`w-16 h-16 bg-gradient-to-r ${item.gradient} rounded-2xl flex items-center justify-center text-2xl text-white mb-6 group-hover:scale-110 transition-transform duration-300`}>
                                    {item.icon}
                                </div>

                                {/* Content */}
                                <h3 className="text-2xl font-bold text-white mb-4">{item.title}</h3>
                                <p className="text-blue-100 leading-relaxed">
                                    {item.content}
                                </p>

                                {/* Hover Effect */}
                                <div className={`absolute inset-0 bg-gradient-to-r ${item.gradient} rounded-2xl opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Our Story Section */}
            <div className="bg-white py-20 relative overflow-hidden">
                {/* Background Elements */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-blue-50 rounded-full blur-3xl opacity-50"></div>
                <div className="absolute bottom-0 left-0 w-80 h-80 bg-purple-50 rounded-full blur-3xl opacity-30"></div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        {/* Content */}
                        <div className="space-y-8">
                            <div>
                                <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 rounded-full border border-blue-200 mb-4">
                                    <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
                                    <span className="text-sm font-semibold text-blue-700 uppercase tracking-wide">
                                        OUR JOURNEY
                                    </span>
                                </div>
                                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                                    Our <span className="text-blue-600">Story</span>
                                </h1>
                            </div>

                            <div className="space-y-6">
                                <p className="text-lg text-gray-600 leading-relaxed">
                                    Founded in 2016 by Proprietor Ambrish Anand, TeacherCool emerged from a desire
                                    to make transformative education accessible to learners around the globe. Today,
                                    we are a leading online platform for education and career growth.
                                </p>

                                <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
                                    <p className="text-blue-800 font-semibold text-lg">
                                        With a community of over 100 million learners and collaborations with more
                                        than 2000 institutions, businesses, and governments, TeacherCool provides
                                        the opportunity for world-class learning—whenever and wherever you need it.
                                    </p>
                                </div>
                            </div>

                            {/* Founder Quote */}
                            <div className="flex items-start gap-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 text-white">
                                <div className="text-4xl">"</div>
                                <div>
                                    <p className="text-lg italic mb-2">
                                        Education is the most powerful weapon which you can use to change the world.
                                    </p>
                                    <p className="font-semibold">— Ambrish Anand, Founder</p>
                                </div>
                            </div>
                        </div>

                        {/* Image Gallery */}
                        <div className="relative">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-4">
                                    <div className="relative group">
                                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                                        <Image
                                            src={pic168}
                                            alt="TeacherCool Campus"
                                            className="rounded-2xl shadow-lg w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                    </div>
                                    <div className="relative group">
                                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                                        <Image
                                            src={pic167}
                                            alt="Learning Environment"
                                            className="rounded-2xl shadow-lg w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                    </div>
                                </div>
                                <div className="flex items-center">
                                    <div className="relative group">
                                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                                        <Image
                                            src={pic166}
                                            alt="Student Success"
                                            className="rounded-2xl shadow-lg w-full h-80 object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Floating Element */}
                            <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-xl p-4 border border-gray-100">
                                <div className="text-center">
                                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                                        <span className="text-xl">🚀</span>
                                    </div>
                                    <h3 className="font-bold text-gray-800">Since 2016</h3>
                                    <p className="text-gray-600 text-sm">Transforming Education</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <div className="relative bg-gradient-to-r from-blue-900 via-blue-800 to-purple-900 py-20 overflow-hidden">
                <div className="absolute inset-0">
                    <div className="absolute top-0 left-0 w-72 h-72 bg-white/10 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
                </div>

                <div className="relative max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
                        Join Our Global Learning Community
                    </h2>
                    <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                        Start your learning journey today and be part of the revolution in online education.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button className="bg-white text-blue-600 font-semibold py-4 px-8 rounded-xl hover:bg-blue-50 transition-all duration-300 transform hover:scale-105 shadow-lg"
                        onClick={handleStartLearning}
                        >
                            Start Learning Free
                        </button>
                        <Link className="border-2 border-white text-white font-semibold py-4 px-8 rounded-xl hover:bg-white hover:text-blue-600 transition-all duration-300 transform hover:scale-105"
                         href='/for-individual'
                        >
                            Explore Courses
                        </Link>
                    </div>
                </div>
            </div>

            {/* Contact Form Section */}
            <div className="bg-gradient-to-br from-gray-50 to-blue-50 py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        {/* Image Section */}
                        <div className="relative">
                            <div className="relative group">
                                <div className="absolute -inset-4 bg-gradient-to-r from-blue-200 to-purple-200 rounded-3xl blur-xl opacity-0 group-hover:opacity-60 transition-opacity duration-500"></div>
                                <Image
                                    src={aboutImg}
                                    alt="Contact TeacherCool"
                                    className="rounded-2xl shadow-2xl w-full h-auto object-cover relative group-hover:scale-105 transition-transform duration-500"
                                />
                            </div>

                            {/* Floating Info Cards */}
                            <div className="absolute -top-4 -left-4 bg-white rounded-2xl shadow-lg p-4 border border-gray-100">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                                        <span className="text-xl">💬</span>
                                    </div>
                                    <div>
                                        <p className="font-semibold text-gray-800">24/7 Support</p>
                                        <p className="text-gray-600 text-sm">Always here to help</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Form Section */}
                        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
                            <div className="mb-8">
                                <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 rounded-full border border-blue-200 mb-4">
                                    <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
                                    <span className="text-sm font-semibold text-blue-700 uppercase tracking-wide">
                                        GET IN TOUCH
                                    </span>
                                </div>
                                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                                    Request a Proposal
                                </h2>
                                <p className="text-gray-600">
                                    Let's discuss how we can help transform your learning experience.
                                </p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            First Name *
                                        </label>
                                        <input
                                            type="text"
                                            name="firstName"
                                            value={formData.firstName}
                                            onChange={(e) => {
                                                const value = e.target.value;
                                                if (/^[a-zA-Z\s]*$/.test(value)) {
                                                    handleChange(e);
                                                }
                                            }}
                                            className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
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
                                            value={formData.lastName}
                                            onChange={(e) => {
                                                const value = e.target.value;
                                                if (/^[a-zA-Z\s]*$/.test(value)) {
                                                    handleChange(e);
                                                }
                                            }}
                                            className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Business Email *
                                        </label>
                                        <input
                                            type="email"
                                            name="businessEmail"
                                            value={formData.businessEmail}
                                            onChange={handleChange}
                                            className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Contact Number *
                                        </label>
                                        <input
                                            type="tel"
                                            name="contactNumber"
                                            value={formData.contactNumber}
                                            onChange={handleChange}
                                            className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Services *
                                        </label>
                                        <select
                                            name="servicesLookingFor"
                                            value={formData.servicesLookingFor}
                                            onChange={handleChange}
                                            className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 appearance-none bg-white"
                                            required
                                        >
                                            <option value="">Select Service Type</option>
                                            <option value="individual">For Individual</option>
                                            <option value="university">For University</option>
                                            <option value="corporate">For Corporate</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Company Name
                                        </label>
                                        <input
                                            type="text"
                                            name="companyName"
                                            value={formData.companyName}
                                            onChange={handleChange}
                                            className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Message *
                                    </label>
                                    <textarea
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        rows={4}
                                        className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 resize-none"
                                        required
                                    ></textarea>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className={`w-full py-4 px-6 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 ${loading
                                            ? 'bg-gray-400 cursor-not-allowed'
                                            : 'bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl'
                                        } text-white`}
                                >
                                    {loading ? (
                                        <div className="flex items-center justify-center gap-2">
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            Sending Request...
                                        </div>
                                    ) : (
                                        'Send Proposal Request'
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}