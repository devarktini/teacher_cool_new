'use client'
import { useState } from 'react'
import axios from 'axios'
import {  FaMapMarkerAlt, FaPhone, FaEnvelope, FaClock, FaCheckCircle } from 'react-icons/fa';
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaXTwitter } from 'react-icons/fa6';

export default function ContactClient() {
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        businessEmail: "",
        contactNumber: "",
        servicesLookingFor: "",
        companyName: "",
        message: "",
    });
    
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

    const handleChange = (e: any) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitStatus('idle');
        
        try {
            await sendProposalRequest();
            setSubmitStatus('success');
            setFormData({
                firstName: "",
                lastName: "",
                businessEmail: "",
                contactNumber: "",
                servicesLookingFor: "",
                companyName: "",
                message: "",
            });
        } catch (error) {
            setSubmitStatus('error');
        } finally {
            setIsSubmitting(false);
        }
    };

    async function sendProposalRequest() {
        const formDatas = new FormData();
        formDatas.append("first_name", formData.firstName);
        formDatas.append("last_name", formData.lastName);
        formDatas.append("business_email", formData.businessEmail);
        formDatas.append("contact_number", formData.contactNumber);
        formDatas.append("services_looking_for", formData.servicesLookingFor);
        formDatas.append("company_name", formData.companyName);
        formDatas.append("message", formData.message);
        
        await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}/lms/proposal-request/`,
            formDatas,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                    accept: "application/json",
                },
            }
        );
    }

    const contactInfo = [
        {
            icon: FaEnvelope,
            title: "Email Us",
            detail: "info@teachercool.com",
            subtitle: "We'll respond within 24 hours"
        },
        {
            icon: FaPhone,
            title: "Call Us",
            detail: "+91 8595903939",
            subtitle: "Mon to Fri, 9AM to 6PM"
        },
        {
            icon: FaMapMarkerAlt,
            title: "Visit Us",
            detail: "B-99, Khirki Extension, Panchsheel Vihar",
            subtitle: "New Delhi, Delhi 110017"
        },
        {
            icon: FaClock,
            title: "Response Time",
            detail: "Within 24 Hours",
            subtitle: "For all business inquiries"
        }
    ];

    const features = [
        {
            title: "Expert Support",
            description: "Get help from our dedicated support team"
        },
        {
            title: "Quick Response",
            description: "We guarantee a response within 24 hours"
        },
        {
            title: "Custom Solutions",
            description: "Tailored solutions for your needs"
        },
        {
            title: "24/7 Availability",
            description: "Round-the-clock support for urgent matters"
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
            {/* Header Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
                <div className="text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 rounded-full border border-blue-200 mb-4">
                        <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
                        <span className="text-sm font-semibold text-blue-700 uppercase tracking-wide">
                            Get In Touch
                        </span>
                    </div>
                    <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
                        Let's Start a <span className="text-blue-600">Conversation</span>
                    </h1>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Have questions? We're here to help! Reach out to us and let's create something amazing together.
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
                    {/* Contact Information Section */}
                    <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                            <div className="w-2 h-8 bg-blue-600 rounded-full"></div>
                            Get in Touch
                        </h2>
                        <p className="text-gray-600 mb-8 leading-relaxed">
                            We would love to hear from you. Whether you have questions about the platform, 
                            need support, or just want to share feedback, feel free to contact us!
                        </p>
                        
                        <div className="space-y-6">
                            {contactInfo.map((item, index) => (
                                <div key={index} className="flex items-start gap-4 group">
                                    <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center group-hover:bg-blue-600 transition-colors duration-300">
                                        <item.icon className="w-5 h-5 text-blue-600 group-hover:text-white transition-colors duration-300" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900">{item.title}</h3>
                                        <p className="text-gray-800 font-medium">{item.detail}</p>
                                        <p className="text-gray-500 text-sm">{item.subtitle}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Features Grid */}
                        <div className="mt-8 pt-8 border-t border-gray-200">
                            <h3 className="font-semibold text-gray-900 mb-4">Why Choose Us</h3>
                            <div className="grid grid-cols-2 gap-3">
                                {features.map((feature, index) => (
                                    <div key={index} className="flex items-center gap-2">
                                        <FaCheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                                        <span className="text-sm text-gray-700">{feature.title}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Request for a Proposal Section */}
                    <div className="lg:col-span-2 bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                            <div className="w-2 h-8 bg-blue-600 rounded-full"></div>
                            Request a Proposal
                        </h2>
                        
                        {submitStatus === 'success' && (
                            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3">
                                <FaCheckCircle className="w-5 h-5 text-green-600" />
                                <div>
                                    <p className="font-semibold text-green-800">Thank you for your message!</p>
                                    <p className="text-green-600 text-sm">We'll get back to you within 24 hours.</p>
                                </div>
                            </div>
                        )}

                        {submitStatus === 'error' && (
                            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                                <p className="text-red-800">There was an error submitting your message. Please try again.</p>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* First Name */}
                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-gray-700">
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
                                    placeholder="John"
                                    required
                                />
                            </div>

                            {/* Last Name */}
                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-gray-700">
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
                                    placeholder="Doe"
                                    required
                                />
                            </div>

                            {/* Business Email */}
                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-gray-700">
                                    Business Email *
                                </label>
                                <input
                                    type="email"
                                    name="businessEmail"
                                    value={formData.businessEmail}
                                    onChange={handleChange}
                                    className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                                    placeholder="john.doe@example.com"
                                    required
                                />
                            </div>

                            {/* Contact Number */}
                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-gray-700">
                                    Contact Number *
                                </label>
                                <input
                                    type="tel"
                                    name="contactNumber"
                                    value={formData.contactNumber}
                                    onChange={handleChange}
                                    className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                                    placeholder="+91 123 456 7890"
                                    required
                                />
                            </div>

                            {/* Services Looking for */}
                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-gray-700">
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

                            {/* Company Name */}
                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-gray-700">
                                    Company Name
                                </label>
                                <input
                                    type="text"
                                    name="companyName"
                                    value={formData.companyName}
                                    onChange={handleChange}
                                    className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                                    placeholder="TeacherCool Inc."
                                />
                            </div>

                            {/* Message */}
                            <div className="lg:col-span-2 space-y-2">
                                <label className="block text-sm font-semibold text-gray-700">
                                    Message *
                                </label>
                                <textarea
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    rows={5}
                                    className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 resize-none"
                                    placeholder="Tell us about your project or inquiry..."
                                    required
                                ></textarea>
                            </div>

                            {/* Submit Button */}
                            <div className="lg:col-span-2">
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className={`w-full py-4 px-6 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 ${
                                        isSubmitting 
                                            ? 'bg-gray-400 cursor-not-allowed' 
                                            : 'bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl'
                                    } text-white`}
                                >
                                    {isSubmitting ? (
                                        <div className="flex items-center justify-center gap-2">
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            Sending...
                                        </div>
                                    ) : (
                                        'Send Message'
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                {/* FAQ Section */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 mb-12">
                    <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-2">
                        <div className="w-2 h-8 bg-blue-600 rounded-full"></div>
                        Frequently Asked Questions
                    </h2>
                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="space-y-6">
                            <div className="group">
                                <h3 className="font-semibold text-gray-800 text-lg mb-2 flex items-center gap-3">
                                    <div className="w-2 h-2 bg-blue-500 rounded-full group-hover:scale-150 transition-transform duration-300"></div>
                                    How can I reset my password?
                                </h3>
                                <p className="text-gray-600 pl-5">
                                    Click on the "Forgot Password" link on the login page and follow the instructions. 
                                    If you need further help, contact our support team.
                                </p>
                            </div>
                            <div className="group">
                                <h3 className="font-semibold text-gray-800 text-lg mb-2 flex items-center gap-3">
                                    <div className="w-2 h-2 bg-blue-500 rounded-full group-hover:scale-150 transition-transform duration-300"></div>
                                    Can I get a refund?
                                </h3>
                                <p className="text-gray-600 pl-5">
                                    Refund policies are available under our "Terms and Conditions" page. 
                                    Please reach out if you need specific support regarding refunds.
                                </p>
                            </div>
                        </div>
                        <div className="space-y-6">
                            <div className="group">
                                <h3 className="font-semibold text-gray-800 text-lg mb-2 flex items-center gap-3">
                                    <div className="w-2 h-2 bg-blue-500 rounded-full group-hover:scale-150 transition-transform duration-300"></div>
                                    How can I become a certified teacher?
                                </h3>
                                <p className="text-gray-600 pl-5">
                                    We offer certification programs for educators. Visit our "Become a Teacher" 
                                    page or contact us for more information.
                                </p>
                            </div>
                            <div className="group">
                                <h3 className="font-semibold text-gray-800 text-lg mb-2 flex items-center gap-3">
                                    <div className="w-2 h-2 bg-blue-500 rounded-full group-hover:scale-150 transition-transform duration-300"></div>
                                    Do you offer enterprise solutions?
                                </h3>
                                <p className="text-gray-600 pl-5">
                                    Yes! We provide custom enterprise solutions for universities and corporations. 
                                    Contact our sales team for a personalized demo.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Social Media Section */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-8 text-center text-white">
                    <h2 className="text-2xl font-bold mb-4">Connect With Us</h2>
                    <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
                        Follow us on our social media channels and stay updated with the latest in online learning, 
                        courses, and educational resources.
                    </p>
                    <div className="flex justify-center space-x-6">
                        {[
                            { icon: FaFacebookF, href: "https://www.facebook.com/share/1722px7Njj/" },
                            { icon: FaXTwitter, href: "https://x.com/TeacherCoo81249" },
                            { icon: FaInstagram, href: "https://www.instagram.com/teachercool_official/" },
                            { icon: FaLinkedinIn, href: "https://www.linkedin.com/company/teachercoolofficial/" }
                        ].map((social, index) => (
                            <a
                                key={index}
                                href={social.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-12 h-12 bg-white/20 hover:bg-white/30 rounded-xl flex items-center justify-center transition-all duration-300 transform hover:scale-110"
                            >
                                <social.icon className="w-5 h-5" />
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}