'use client'
import HeaderForm from '@/components/Home/Campaigns/HeaderForm';
import { getCompleteUrl } from '@/lib/getCompleteUrl';
import React, { useRef, useState } from 'react'
import { FaCheckCircle } from 'react-icons/fa';
import {
    CodeBracketIcon,
    ChartBarIcon,
    CpuChipIcon,
    CloudIcon,
    CommandLineIcon,
    BeakerIcon,
    BookOpenIcon,
    ShieldCheckIcon,
    CircleStackIcon,
    VariableIcon
} from '@heroicons/react/24/solid';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import { Autoplay } from 'swiper/modules';
import certificate from '@/public/images/certificate_Campaign.jpg';
import Image from 'next/image';
import Success from '@/components/Home/Campaigns/Success';

function CampaignDetails({ data }: any) {
    console.log('data', data.data)
    const campaignsData = data?.data;
    const heroRef = useRef(null);
    const [openModule, setOpenModule] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [showAll, setShowAll] = useState(false);
    const [openIndex, setOpenIndex] = useState(null);
    const toggleDrawer = (index: any) => {
        setOpenIndex((prev) => (prev === index ? null : index));
    };

    const experts = campaignsData?.course_programs?.flatMap((i: any) => i.experts || []) || [];

    const courseCurriculum = campaignsData?.course_programs?.flatMap(
        (program: any) => program.course_curriculum || []
    ) || [];

    // Fixed curriculum processing with error handling
    const curriculumModules = courseCurriculum.flatMap((item: any) => {
        if (!item?.curriculum) return [];

        return Object.entries(item.curriculum).map(([title, topicsStr]) => {
            // Handle strings with nested commas using regex
            const topics = String(topicsStr)
                .split(/(?<!\([^)]*),(?![^(]*\))/g)
                .map(t => t.trim())
                .filter(Boolean);

            return { title, topics };
        });
    });
    // Fixed tools processing
    const tools = courseCurriculum.flatMap((item: any) => {
        if (!item?.tech_list) return [];

        return Object.entries(item.tech_list).map(([name, category]) => ({
            name,
            category,
            icon: null,
            color: "bg-blue-100"
        }));
    });

    const getIconForLabel = (label: any) => {
        if (label.toLowerCase().includes("career")) return "🎓";
        if (label.toLowerCase().includes("internship")) return "🧑‍💼";
        if (label.toLowerCase().includes("hrs") || label.toLowerCase().includes("hours")) return "⏰";
        if (label.toLowerCase().includes("batch") || label.toLowerCase().includes("starts")) return "📅";
        if (label.toLowerCase().includes("discount") || label.toLowerCase().includes("seats")) return "💸";
        if (label.toLowerCase().includes("hiring")) return "🤝";
        // default fallback icon
        if (label.toLowerCase().includes("python")) return <CodeBracketIcon />;
        if (label.toLowerCase().includes("pandas")) return <ChartBarIcon />;
        if (label.toLowerCase().includes("numpy")) return <CpuChipIcon />;
        if (label.toLowerCase().includes("matplotlib")) return <ChartBarIcon />;
        if (label.toLowerCase().includes("seaborn")) return <ChartBarIcon />;
        if (label.toLowerCase().includes("power bi")) return <CloudIcon />;
        if (label.toLowerCase().includes("tableau")) return <CommandLineIcon />;
        if (label.toLowerCase().includes("scikit-learn")) return <BeakerIcon />;
        if (label.toLowerCase().includes("tensorflow")) return <BookOpenIcon />;
        if (label.toLowerCase().includes("keras")) return <ShieldCheckIcon />;
        if (label.toLowerCase().includes("jupyter notebook")) return <VariableIcon />;
        if (label.toLowerCase().includes("google colab")) return <CloudIcon />;
        if (label.toLowerCase().includes("git")) return <CommandLineIcon />;
        if (label.toLowerCase().includes("github")) return <CircleStackIcon />;
        return "✨"; // default fallback icon
    };

    const studentsReview = campaignsData?.course_programs?.flatMap((i: any) => i.reviews || []) || [];
    const visibleReviews = showAll ? studentsReview : studentsReview.slice(0, 3);
    return (
        <div ref={heroRef}>
            <div className="min-h-screen">
                {/* Hero Section */}
                <div className="relative bg-gradient-to-r from-white to-blue-600 py-10">
                    <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 ">
                        {/* <div className="grid grid-cols-1 lg:grid-cols-2 gap-8  "> */}
                        <div className="flex flex-col lg:flex-row items-center justify-around   ">
                            {/* Left Content */}
                            <div className="space-y-6  flex flex-col items-center justify-between w-full lg:w-[40%]">


                                <div>
                                    <h1 className="text-4xl md:text-5xl  font-bold text-gray-900">
                                        {campaignsData.title}
                                    </h1>
                                    {/* <p className="text-gray-700 py-2">Build cutting-edge AI skills to power the future. From zero to deployment-ready.</p> */}

                                    <div className="space-y-4 text-start w-full my-5">
                                        <p className="text-xl text-gray-700">In Collaboration With <span className="font-semibold">{campaignsData.collaborator}</span></p>
                                    </div>


                                    <button
                                        onClick={() => setShowForm(true)}
                                        className="bg-yellow-500 hover:bg-yellow-600 text-white px-8 py-3 rounded-md font-semibold my-5"
                                    >
                                        Apply Now
                                    </button>
                                </div>

                            </div>


                            {/* Course Features */}
                            <div className="h-full w-full lg:w-[50%]  py-3  sm:px-6 lg:px-8">
                                <HeaderForm onSuccess={() => setShowSuccess(true)} />
                            </div>

                        </div>
                    </div>
                </div>

                {/* seconde component  */}
                <div className="py-10">
                    <div className="w-full  text-center ">
                        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 mb-4">
                            {campaignsData.supporting_headline}
                        </h1>

                        <div className="flex justify-center">
                            <div className="flex flex-wrap justify-center gap-3 mb-6">
                                {campaignsData?.skills?.map((skill: any, index: number) => (
                                    <div
                                        key={index}
                                        className="inline-flex items-center space-x-2 bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-sm font-medium shadow-sm"
                                    >
                                        {/* Universal AI Logo (Atom style like OpenAI or DeepSeek style) */}
                                        {/* <svg
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="w-4 h-4"
                                        >
                                            <path
                                                d="M12 2C6.477 2 2 6.478 2 12s4.477 10 10 10 10-4.478 10-10S17.523 2 12 2zm0 18.2a8.2 8.2 0 110-16.4 8.2 8.2 0 010 16.4z"
                                                fill="#4D6BFE"
                                            />
                                            <path
                                                d="M12 6.5a1 1 0 011 1V11h3.5a1 1 0 110 2H13a1 1 0 01-1-1V7.5a1 1 0 011-1z"
                                                fill="#4D6BFE"
                                            />
                                        </svg> */}
                                        <span>{skill}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>

                    {/* Features Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-6 gap-6 mt-14 w-full max-w-6xl px-2 mx-auto">
                        {campaignsData?.key_points?.map((item: any, index: any) => (
                            <FeatureCard
                                key={index}
                                icon={getIconForLabel(item.value)}
                                value={item.key}
                                label={item.value}
                            />
                        ))}
                    </div>

                </div>
                {/* Main Content Container */}
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 mt-5">
                    {/* Course Description and Price Section */}
                    <div className="py-16">
                        <div className="grid grid-cols-1 lg:grid-cols-10 gap-12 p-5 lg-p-0">
                            {/* Left Panel - 60% */}
                            <div className="lg:col-span-6 space-y-8">
                                <h2 className="text-2xl font-bold text-gray-900 mb-2 border-l-4 border-blue-500 pl-4">
                                    Course Description
                                </h2>

                                {campaignsData?.course_programs?.map((course: any) => {
                                    const firstColumn = course.highlights.slice(0, Math.ceil(course.highlights.length / 2));
                                    const secondColumn = course.highlights.slice(Math.ceil(course.highlights.length / 2));

                                    return (
                                        <div key={course.id}>
                                            <h3 className="text-3xl font-bold mb-4">{course.title}</h3>
                                            <p className="text-gray-700">{course.description}</p>

                                            {/* Key Highlights Section */}
                                            <div className="py-5">
                                                <h2 className="text-2xl font-bold text-gray-900 mb-6 border-l-4 border-blue-500 pl-4">
                                                    Key Highlights
                                                </h2>
                                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-4">
                                                    {/* First Column */}
                                                    <div className="space-y-4">
                                                        {firstColumn.map((highlight: any, index: any) => (
                                                            <KeyHighlight key={index}
                                                                icon={<FaCheckCircle className="text-blue-500 w-5 h-5 mt-1" />}
                                                                text={highlight} />
                                                        ))}
                                                    </div>

                                                    {/* Second Column */}
                                                    <div className="space-y-4">
                                                        {secondColumn.map((highlight: any, index: any) => (
                                                            <KeyHighlight key={index + firstColumn.length}
                                                                icon={<FaCheckCircle className="text-blue-500 w-5 h-5 mt-1" />}
                                                                text={highlight} />
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Right Panel - 40% */}
                            <div className="lg:col-span-4 lg:sticky lg:top-4">
                                <div className="bg-white rounded-lg shadow-lg p-6">
                                    {
                                        campaignsData?.course_programs?.map((course: any) => (
                                            // console.log(course),
                                            <div>
                                                <div className="text-center mb-6">
                                                    <div className="mb-6 w-full h-[200px] ">
                                                        <img
                                                            src={getCompleteUrl(course.banner)}
                                                            alt="Loading.."
                                                            // width={300}
                                                            // height={200}
                                                            className="rounded-lg w-full h-full object-cover"
                                                        />
                                                    </div>
                                                    <h2 className="text-3xl font-bold text-gray-900 text-justify tracking-wide">
                                                        {campaignsData.title}
                                                    </h2>
                                                    <div className="flex justify-center items-center gap-4 mt-4">
                                                        <div className="text-3xl font-bold">₹ {course.price}</div>
                                                        <span className="text-gray-600">+ 18% GST</span>

                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-1 gap-x-5 text-sm">
                                                    {course.features.map((feature: any, index: any) => (
                                                        <Feature key={index}
                                                            icon={<FaCheckCircle className="text-blue-500 w-4 h-4 " />}
                                                            text={feature} />
                                                    ))}
                                                </div>


                                                <button
                                                    onClick={() => setShowForm(true)}
                                                    className="w-full bg-blue-600 text-white py-3 rounded-md font-semibold mt-6"
                                                >
                                                    Enroll Now
                                                </button>
                                            </div>
                                        ))
                                    }

                                </div>
                            </div>

                        </div>
                    </div>

                    {/* Additional Sections Container */}
                    <div className="space-y-24 py-16">
                        {/* Course Curriculum Section */}
                        <div className="w-full">
                            <h2 className="text-2xl font-bold text-gray-900 mb-12 border-l-4 border-blue-500 pl-4">
                                Course Curriculum
                            </h2>

                            {curriculumModules.length > 0 ? (
                                <div className="space-y-4">
                                    {curriculumModules?.map((module: any, index: any) => (
                                        <div key={index} className="bg-white rounded-lg shadow-sm overflow-hidden">
                                            <button
                                                onClick={() => setOpenModule(openModule === index ? null : index)}
                                                className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                                            >
                                                <div className="flex items-center space-x-4">
                                                    <div className={`transform transition-transform duration-200 ${openModule === index ? "rotate-90" : ""}`}>
                                                        ▶
                                                    </div>
                                                    <h3 className="text-lg font-semibold">{module.title}</h3>
                                                </div>
                                            </button>

                                            {openModule === index && (
                                                <div className="p-4 pt-0 pl-12 space-y-2 text-gray-600 animate-slideDown">
                                                    {module.topics.map((topic: any, i: any) => (
                                                        <p key={i}>• {topic}</p>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-500">Curriculum not available</p>
                            )}
                        </div>

                        {/* Technologies Section */}
                        <div className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-slate-50 to-blue-50">
                            <div className="max-w-7xl mx-auto">
                                <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">
                                    Technologies You'll Master
                                </h2>

                                {tools.length > 0 ? (
                                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                                        {tools.map((tool: any, index: any) => (
                                            <div
                                                key={`${tool.name}-${index}`}
                                                className="group bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
                                            >
                                                <div className="flex flex-col items-center">
                                                    <div className={`h-20 w-20 mb-4 flex items-center justify-center rounded-full ${tool.color}`}>
                                                        {/* Show first 2 characters if no icon */}

                                                        <span className="h-10 w-10 text-gray-700 transition-transform group-hover:scale-110">{getIconForLabel(tool.name)}</span>
                                                        {/* <span className="text-xl font-bold">
                                                            {tool.name.substring(0, 2)}
                                                        </span> */}
                                                    </div>
                                                    <h3 className="text-lg font-semibold text-gray-900 mb-2 text-center">
                                                        {tool.name}
                                                    </h3>
                                                    <span className="inline-block px-3 py-1 text-sm font-medium text-blue-600 bg-blue-50 rounded-full">
                                                        {tool.category}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-center text-gray-500">No technologies listed</p>
                                )}
                            </div>
                        </div>

                        {/* Instructor Section - Redesigned */}
                        <div className="w-full">
                            <h2 className="text-2xl font-bold text-gray-900 mb-12 border-l-4 border-blue-500 pl-4">
                                Learn from Industry Experts
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {experts?.map((instructor: any, index: any) => (
                                    <div
                                        key={index}
                                        className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                                    >
                                        <div className="flex flex-col items-center text-center">
                                            <div className="relative w-32 h-32 mb-4">
                                                <img
                                                    src={getCompleteUrl(instructor.image)}
                                                    alt={instructor.name}
                                                    // fill
                                                    className="rounded-full h-full w-full object-cover"
                                                />
                                                <div className="absolute -bottom-2 -right-2 bg-blue-500 text-white text-sm px-2 py-1 rounded-full">
                                                    ⭐ {instructor.rating}
                                                </div>
                                            </div>
                                            <h3 className="text-xl font-bold mb-1 capitalize">{instructor.name}</h3>
                                            <p className="text-gray-600 mb-2 capitalize">{instructor.designation}</p>
                                            <p className="text-sm text-gray-500 mb-3 capitalize">{instructor.company}</p>
                                            {/* <div className="flex flex-wrap gap-2 justify-center mb-4">
                      {instructor.expertise.map((skill, i) => (
                        <span key={i} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                          {skill}
                        </span>
                      ))}
                     
                    </div> */}
                                            <div className=" gap-2 text-justify p-2 tracking-tight">

                                                {instructor.bio}
                                            </div>
                                            <div className="text-sm text-gray-600">
                                                {instructor.no_of_students}+ students trained
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>


                        {/* Certifications Section */}
                        <div className="w-full mt-24 ">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                                {/* Left Section - Content */}
                                <div className="space-y-8">
                                    <div>
                                        <h2 className="text-2xl font-bold text-gray-900 mb-6 border-l-4 border-blue-500 pl-4">
                                            Industry-Recognized Certifications
                                        </h2>
                                        <p className="text-gray-700 text-lg mb-8 p-5 lg:p-0">
                                            Get certified by leading organizations and add valuable credentials to your profile.
                                        </p>
                                    </div>
                                    <div className="space-y-4 p-5 lg:p-0">
                                        {[
                                            // "Joint certification from industry partners",
                                            "Globally recognized credentials",
                                            "Verified digital certificates",
                                            "Showcase on LinkedIn",
                                            "Add to your resume"
                                        ].map((point, index) => (
                                            <div key={index} className="flex items-center space-x-3">
                                                <div className="flex-shrink-0 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                                                    <span className="text-white text-sm">✓</span>
                                                </div>
                                                <p className="text-gray-700">{point}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Right Section - Certificate Slider */}

                                <div className="relative">
                                    <Swiper
                                        modules={[Autoplay]}
                                        spaceBetween={30}
                                        slidesPerView={1}
                                        autoplay={{ delay: 3000 }}
                                        className="w-full rounded-xl overflow-hidden shadow-lg"
                                    >
                                        {[
                                            {
                                                image: certificate,
                                                text: `has successfully completed 6 months course in Data Science, Machine Learning and Artificial Intelligence.`,
                                                // logo: gyprc,
                                            },
                                            {
                                                image: certificate,
                                                text: `has successfully completed 2 months internship in Data Science, Machine Learning and Artificial Intelligence in collaboration with GYPR Pvt Ltd.`,
                                                // logo: gyprc,
                                            },
                                            {
                                                image: certificate,
                                                text: `has successfully completed specialization in Business Analytics course.`,
                                                // logo: gyprc,
                                            },
                                        ].map((cert, index) => (
                                            <SwiperSlide key={index}>
                                                <div className="relative aspect-[4/3] rounded-xl overflow-hidden shadow-xl">
                                                    <Image
                                                        src={cert.image}
                                                        alt={`Certificate ${index + 1}`}
                                                        className="object-cover w-full h-full"
                                                    />
                                                    {/* <img src={cert.logo} alt="loading..." className="absolute top-[5%] left-[18%] w-12 h-12" /> */}

                                                    {/* Overlay */}
                                                    <div className=" mt-[18%] absolute inset-0  flex flex-col justify-center items-center text-center px-6">
                                                        <p className=" font-semibold drop-shadow-md">
                                                            {cert.text}
                                                        </p>


                                                    </div>
                                                </div>

                                            </SwiperSlide>
                                        ))}
                                    </Swiper>
                                </div>


                            </div>
                        </div>

                        {/* Student Reviews Section */}
                        <div className="w-full px-4 py-16 bg-gray-50">
                            <div className="max-w-6xl mx-auto">
                                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12 border-l-4 border-blue-600 pl-6 border-opacity-75 transform transition-all duration-300 hover:border-opacity-100 hover:pl-8">
                                    <span className="bg-gradient-to-r from-blue-600 to-blue-600 bg-clip-text text-transparent">
                                        What Our Students Say
                                    </span>
                                </h2>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {visibleReviews.map((review: any, index: any) => (
                                        <div
                                            key={index}
                                            className="relative bg-white rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-50 group overflow-hidden"
                                        >
                                            {/* Gradient overlay */}
                                            <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 to-blue-50/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                                            {/* Profile Section */}
                                            <div className="flex items-center gap-4 mb-4 relative z-10">
                                                <div className="relative">
                                                    <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 to-blue-500 rounded-full blur opacity-25 group-hover:opacity-40 transition-opacity" />
                                                    <img
                                                        src={review?.img || '/default-avatar.svg'}
                                                        alt={review?.name || 'User'}
                                                        className="w-14 h-14 rounded-full border-2 border-white object-cover shadow-sm"
                                                    />
                                                </div>
                                                <div>
                                                    <h3 className="text-lg font-bold text-gray-900 capitalize">{review?.user_details?.name || 'Anonymous'}</h3>
                                                    <p className="text-sm capitalize font-medium bg-gradient-to-r from-blue-600 to-blue-600 bg-clip-text text-transparent">
                                                        {review?.role || 'Student'}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Review Text */}
                                            <div className="relative mb-6 z-10">
                                                <svg
                                                    className="absolute -left-1 -top-2 w-6 h-6 text-blue-100"
                                                    fill="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path d="M10 7L8 11H11V17H5V11L7 7H10M18 7L16 11H19V17H13V11L15 7H18Z" />
                                                </svg>
                                                <p className="text-gray-600 text-sm md:text-base pl-6 italic">
                                                    {review.review}
                                                </p>
                                            </div>

                                            {/* Rating Section */}
                                            <div className="flex items-center justify-between z-10">
                                                <div className="flex items-center gap-1.5">
                                                    <span className="text-sm font-semibold text-gray-600">
                                                        {review.rating.toFixed(1)}
                                                    </span>
                                                    <div className="flex items-center">
                                                        {[...Array(5)].map((_, i) => {
                                                            const filled = i < Math.floor(review.rating);
                                                            const partialFill = review.rating % 1 > 0 && i === Math.floor(review.rating);

                                                            return (
                                                                <div key={i} className="relative">
                                                                    <svg
                                                                        className={`w-5 h-5 ${filled ? 'text-yellow-400' : 'text-gray-300'}`}
                                                                        fill="currentColor"
                                                                        viewBox="0 0 20 20"
                                                                    >
                                                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                                    </svg>
                                                                    {partialFill && (
                                                                        <div className="absolute inset-0 overflow-hidden" style={{ width: `${(review.rating % 1) * 100}%` }}>
                                                                            <svg
                                                                                className="w-5 h-5 text-yellow-400"
                                                                                fill="currentColor"
                                                                                viewBox="0 0 20 20"
                                                                            >
                                                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                                            </svg>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                                <svg
                                                    className="w-6 h-6 text-blue-100"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="1.5"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75" />
                                                </svg>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-12 text-center">
                                    <button
                                        onClick={() => setShowAll(!showAll)}
                                        className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                                    >
                                        {showAll ? 'Less Reviews' : 'Read More Reviews'}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* FAQ Section */}
                        <div className="w-full pb-16">
                            <h2 className="text-2xl font-bold text-gray-900 mb-12 border-l-4 border-blue-500 pl-4">
                                Frequently Asked Questions
                            </h2>
                            <div className="space-y-4">
                                {faqs?.map((faq: any, index: any) => (
                                    <div key={index} className="bg-white rounded-lg border shadow-sm transition-all">
                                        <button
                                            onClick={() => toggleDrawer(index)}
                                            className="w-full text-left p-5 flex justify-between items-center focus:outline-none"
                                        >
                                            <h3 className="text-base font-medium text-gray-800">{faq.question}</h3>
                                            <span className="text-xl text-gray-400 transition-transform duration-200">
                                                {openIndex === index ? '-' : '+'}
                                            </span>
                                        </button>
                                        <div
                                            className={`px-5 pb-5 transition-all duration-300 text-gray-700 ${openIndex === index ? 'block' : 'hidden'
                                                }`}
                                        >
                                            {faq.answer}
                                        </div>
                                    </div>
                                ))}
                            </div>

                        </div>
                    </div>
                </div>
                {showForm && (
                    <HeaderForm
                        isPopUp={true}   
                        onClose={() => setShowForm(false)}
                        onSuccess={() => setShowSuccess(true)}
                        type="masterGenerative"
                    />
                )}
                {showSuccess && <Success onclose={() => setShowSuccess(false)} />}
            </div>
        </div>
    )
}

export default CampaignDetails


const FeatureCard = ({ icon, value, label }: any) => {
    return (
        <div className="bg-white/90 p-2 rounded-md shadow-md text-center w-full h-full border border-blue-500 transform transition-transform duration-300 hover:-translate-y-2 hover:shadow-xl hover:border-blue-700">
            <div className="text-lg mb-1">{icon}</div>
            <div className="font-semibold text-base text-gray-900">{value}</div>
            <div className="text-xs text-gray-600">{label}</div>
        </div>
    );
};


const KeyHighlight = ({ icon, text }: any) => {
    return (
        <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-6 h-6 text-blue-500">
                <span className="text-xl">{icon}</span>
            </div>
            <p className="text-gray-700 text-sm leading-tight">{text}</p>
        </div>
    );
};


const Feature = ({ icon, text }: any) => {
    return (
        <div className="flex items-start space-x-2">
            <span className="mt-1">{icon}</span>
            <span className="text-gray-700">{text}</span>
        </div>

    );
};

const faqs = [
    {
        question: "Who can join the Data Science or Machine Learning courses?",
        answer:
            "Our courses are designed for graduates, working professionals, and anyone with a basic understanding of mathematics and logical thinking. No prior coding experience is required—our curriculum starts from the fundamentals and gradually advances.",
    },
    {
        question: "Do I need a technical background to enroll?",
        answer:
            "No. While having a technical background can be helpful, it's not mandatory. We start with foundational concepts and provide support to help learners from non-technical backgrounds succeed.",
    },
    {
        question: "What tools and programming languages will I learn?",
        answer:
            "You will gain hands-on experience with Python, SQL, Pandas, NumPy, Scikit-learn, TensorFlow, Power BI, and more—ensuring you're job-ready with industry-relevant skills.",
    },
    {
        question: "Is this course 100% online?",
        answer:
            "Yes, our training is fully online with live instructor-led sessions, recorded backups, and continuous mentor support. You can attend from anywhere in the world.",
    },
    {
        question: "Will I receive a certificate after completion?",
        answer:
            "Yes. Upon successful completion of the course and final project, you will receive a certification recognized by industry recruiters and our academic partners.",
    },
    {
        question: "Do you offer placement assistance?",
        answer:
            "Absolutely. We provide 100% placement assistance including resume building, mock interviews, and direct job referrals through our hiring partners.",
    },
    {
        question: "What is the duration of the course?",
        answer:
            "The Data Science program typically takes 5–6 months to complete, while the Machine Learning course is 8–10 weeks long, depending on your pace and batch selection (weekday/weekend).",
    },
    {
        question: "Are there any live projects or practicals included?",
        answer:
            "Yes. All our courses include real-world case studies, industry-relevant capstone projects, and practical assignments to ensure hands-on learning.",
    },
]