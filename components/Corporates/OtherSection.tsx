import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import img2 from '@/public/images/corporates/img2.jpg'
import tickIcon from '@/public/images/university/tick.png'
import groupT from '@/public/images/corporates/groupTwo.png'
import corp from "@/public/images/corporates/corporateTwo.png";
import CorporateForm from './CorporateForm'
import { FaRocket, FaChartLine, FaUsers, FaGraduationCap, FaAward, FaLightbulb, FaArrowRight } from 'react-icons/fa'

function OtherSection() {
    const sections = [
        {
            title: "Elevate Your Organization's Skills",
            subtitle: "WORLD-CLASS CONTENT",
            features: [
                {
                    icon: FaRocket,
                    title: "Empower Teams to Thrive",
                    description: "In a rapidly changing landscape, equip your employees with expert-led training in Generative AI, technology, data, and leadership tailored for every level and role."
                },
                {
                    icon: FaChartLine,
                    title: "Develop Essential Tech, Data, and Business Competencies",
                    description: "Upskill efficiently with high-quality content created and validated by learning and development professionals."
                },
                {
                    icon: FaUsers,
                    title: "Navigate Learning with Clear Pathways",
                    description: "Simplify the learning experience with structured paths that guide employees through their training."
                },
                {
                    icon: FaGraduationCap,
                    title: "Cultivate a Culture of Continuous Learning",
                    description: "Promote a dynamic learning environment with flexible and engaging content that keeps employees motivated."
                }
            ],
            image: img2,
            link: "/world-class-content",
            linkText: "Explore world-class content",
            bgColor: "bg-white"
        },
        {
            title: "Great Learning Opportunities",
            subtitle: "SHOW ROI",
            features: [
                {
                    icon: FaAward,
                    title: "Learn from Industry Leaders",
                    description: "Reduce training expenses with customized content and credentials from over 325 top companies and universities."
                },
                {
                    icon: FaLightbulb,
                    title: "Direct Insights from Leading Business Schools",
                    description: "Access specialized academies tailored to specific roles or upskilling requirements."
                },
                {
                    icon: FaUsers,
                    title: "Combine Workplace and Technical Skill Development",
                    description: "Provide training through a variety of formats, including video tutorials, hands-on projects, and Professional Certificates."
                }
            ],
            image: groupT,
            link: "/skill-dashboard",
            linkText: "Explore Skill Dashboard",
            bgColor: "bg-gradient-to-br from-gray-50 to-blue-50"
        },
        {
            title: "Foster Employee Engagement",
            subtitle: "RETAIN TALENT",
            features: [
                {
                    icon: FaUsers,
                    title: "Attract, Retain, and Develop Your Talent",
                    description: "Encourage ongoing learning to enhance employee engagement, productivity, and career development."
                },
                {
                    icon: FaGraduationCap,
                    title: "Support Employee Growth with 130+ Professional Certificates",
                    description: "Invest in your team's advancement with a wide range of recognized programs."
                },
                {
                    icon: FaRocket,
                    title: "Accelerate Learning with AI Coaching",
                    description: "Utilize our AI Coach to facilitate quicker skill acquisition."
                },
                {
                    icon: FaAward,
                    title: "Enable Employees to Achieve Valued Career Credentials",
                    description: "Assist your workforce in earning credentials that are respected in the industry."
                }
            ],
            image: corp,
            link: "/advantages",
            linkText: "Explore more Teacher Cool advantages",
            bgColor: "bg-white"
        }
    ];

    return (
        <div className="space-y-0">
            {sections.map((section, index) => (
                <SectionComponent key={index} section={section} index={index} />
            ))}
            
            {/* Contact Form Section */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 py-16 lg:py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <CorporateForm />
                </div>
            </div>
        </div>
    )
}

const SectionComponent = ({ section, index }: { section: any; index: number }) => {
    const isEven = index % 2 === 0;
    
    return (
        <section className={`py-16 lg:py-20 ${section.bgColor}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className={`grid lg:grid-cols-2 gap-12 lg:gap-16 items-center ${
                    !isEven ? 'lg:grid-flow-dense' : ''
                }`}>
                    {/* Content */}
                    <div className={`space-y-8 ${!isEven ? 'lg:col-start-2' : ''}`}>
                        {/* Header */}
                        <div className="space-y-4">
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 rounded-full border border-blue-200">
                                <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
                                <span className="text-sm font-semibold text-blue-700 uppercase tracking-wide">
                                    {section.subtitle}
                                </span>
                            </div>
                            
                            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                                {section.title}
                            </h2>
                            
                            <p className="text-lg text-gray-600 leading-relaxed">
                                Use comprehensive metrics and insights to inform, measure, and assess your talent development strategy impact.
                            </p>
                        </div>

                        {/* Features List */}
                        <div className="space-y-6">
                            {section.features.map((feature: any, featureIndex: number) => (
                                <div 
                                    key={featureIndex}
                                    className="flex items-start gap-4 p-2 rounded-2xl bg-white/50 backdrop-blur-sm border border-gray-100 hover:shadow-lg transition-all duration-300 group"
                                >
                                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                                        <feature.icon className="w-6 h-6 text-white" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-300">
                                            {feature.title}
                                        </h3>
                                        <p className="text-gray-600 text-sm leading-relaxed">
                                            {feature.description}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* CTA Link */}
                        <div className="flex items-center gap-3 group cursor-pointer pt-4">
                            <Link 
                                href={section.link}
                                className="text-blue-600 font-semibold text-lg hover:text-blue-700 transition-colors duration-300 flex items-center gap-2 no-underline"
                            >
                                {section.linkText}
                                <FaArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300" />
                            </Link>
                        </div>
                    </div>

                    {/* Image */}
                    <div className={`relative ${!isEven ? 'lg:col-start-1' : ''}`}>
                        <div className="relative group">
                            {/* Background Glow Effect */}
                            <div className="absolute -inset-4 bg-gradient-to-r from-blue-200 to-purple-200 rounded-3xl blur-xl opacity-0 group-hover:opacity-60 transition-opacity duration-500"></div>
                            
                            {/* Main Image */}
                            <Image
                                src={section.image}
                                alt={section.title}
                                className="relative rounded-2xl shadow-2xl w-full h-auto transform group-hover:scale-105 transition-transform duration-500"
                            />
                            
                            {/* Floating Elements */}
                            <div className="absolute -top-4 -right-4 bg-white rounded-2xl shadow-xl p-4 border border-gray-100">
                                <div className="text-center">
                                    <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-2">
                                        <FaAward className="w-5 h-5 text-green-600" />
                                    </div>
                                    <h4 className="font-semibold text-gray-800 text-sm">Proven Results</h4>
                                    <p className="text-gray-600 text-xs">98% Success Rate</p>
                                </div>
                            </div>
                            
                            <div className="absolute -bottom-4 -left-4 bg-white rounded-2xl shadow-xl p-4 border border-gray-100">
                                <div className="text-center">
                                    <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-2">
                                        <FaUsers className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <h4 className="font-semibold text-gray-800 text-sm">3,800+</h4>
                                    <p className="text-gray-600 text-xs">Companies</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default OtherSection