'use client'
import React, { useState } from "react";
import { CiEdit } from "react-icons/ci";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import {
    PhoneIcon,
    CalendarIcon,
    GlobeAltIcon,
    CakeIcon,
    UserIcon,
    MapPinIcon,
    BuildingOfficeIcon,
    FlagIcon,
    AtSymbolIcon
} from "@heroicons/react/24/outline";
import { selectAuth } from "@/store/features/authSlice";
import { getCompleteUrl } from "@/lib/getCompleteUrl";
import TeacherProfileEdit from "./TeacherProfileEdit";


const TeacherProfileInfo = () => {
    const { user } = useSelector(selectAuth);
    const userDetails = user;
    const [isModelOpen, setIsModelOpen] = useState(false);
    const fadeIn = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
    };

    const InfoCard = ({ label, value, icon, className = '' }: any) => (
        <motion.div
            className={`bg-white rounded-xl p-4 md:p-5 shadow-sm hover:shadow-md transition-shadow ${className}`}
            variants={{
                hidden: { opacity: 0, y: 10 },
                visible: { opacity: 1, y: 0 }
            }}
        >
            <div className="flex items-start gap-3">
                <div className="p-2 bg-opacity-10 bg-current rounded-lg">{icon}</div>
                <div>
                    <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider">{label}</h3>
                    <p className="text-gray-800 font-[500] mt-1">
                        {value || <span className="text-gray-400">Not specified</span>}
                    </p>
                </div>
            </div>
        </motion.div>
    );

    return (
        <>
            <div className="max-w-6xl mx-auto bg-gradient-to-br from-blue-50 via-purple-50 to-gray-50 min-h-screen">
                <motion.div
                    className="bg-white rounded-3xl shadow-2xl overflow-hidden"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    {/* Header */}
                    {/* <div className="bg-gradient-to-r from-secondary to-logoPrimary px-6 py-8 md:px-10 md:py-10"> */}
                    <div className="bg-gradient-to-r from-logoPrimary to-secondary px-6 py-8 md:px-10 md:py-10">
                        <div className="flex flex-wrap justify-between items-center gap-6">
                            <div className="flex items-center gap-6 flex-wrap md:flex-nowrap">
                                <div className="relative">
                                    <motion.img
                                        src={
                                            userDetails?.profile?.profile_image
                                                ? getCompleteUrl(userDetails?.profile?.profile_image)
                                                : process.env.PUBLIC_URL + "/images/profile.png"
                                        }
                                        alt="Profile"
                                        className="w-28 h-28 rounded-full object-cover border-4 border-white shadow-lg"
                                        whileHover={{ scale: 1.05 }}
                                        transition={{ type: "spring", stiffness: 400, damping: 10 }}
                                    />
                                </div>
                                <div>
                                    <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
                                        {userDetails?.name}
                                    </h1>
                                    <p className="text-gray-900 mt-2 flex items-center">
                                        <svg
                                            className="w-5 h-5 mr-2 text-gray-900"
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                        >
                                            <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                                            <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                                        </svg>
                                        {userDetails?.email}
                                    </p>
                                </div>
                            </div>
                            <motion.button
                                onClick={() => setIsModelOpen(true)}
                                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-indigo-700 hover:to-purple-700 text-white text-sm font-medium rounded-xl shadow-md transition-all duration-300"
                                whileHover={{
                                    scale: 1.05,
                                    boxShadow: "0 10px 15px -3px rgba(99, 102, 241, 0.4)",
                                }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <CiEdit className="w-5 h-5" />
                                Edit Profile
                            </motion.button>
                        </div>
                    </div>

                    {/* Body Content */}
                    <div className="px-6 md:px-10 py-4 md:py-8 space-y-8">
                        {/* Personal Info Section */}
                        <section className="space-y-5">
                            <h2 className="text-lg font-semibold text-gray-700">Personal Info</h2>
                            <motion.div
                                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
                                variants={{ visible: { transition: { staggerChildren: 0.1 } } }} // Properly closed with 3 braces
                                initial="hidden"
                                animate="visible"
                            >
                                <InfoCard
                                    label="Phone Number"
                                    value={userDetails?.mobile}
                                    icon={<PhoneIcon className="w-5 h-5 text-blue-500" />}
                                />
                                <InfoCard
                                    label="Date of Birth"
                                    value={userDetails?.profile?.birth_date}
                                    icon={<CalendarIcon className="w-5 h-5 text-purple-500" />}
                                />
                                <InfoCard
                                    label="Country"
                                    value={userDetails?.country_name}
                                    icon={<GlobeAltIcon className="w-5 h-5 text-green-500" />}
                                />
                                <InfoCard
                                    label="Age"
                                    value={userDetails?.profile?.age}
                                    icon={<CakeIcon className="w-5 h-5 text-red-500" />}
                                />
                                <InfoCard
                                    label="Gender"
                                    value={
                                        userDetails?.profile?.gender === 'F'
                                            ? 'Female'
                                            : userDetails?.profile?.gender === 'M'
                                                ? 'Male'
                                                : 'Others'
                                    }
                                    icon={<UserIcon className="w-5 h-5 text-yellow-500" />}
                                />
                            </motion.div>
                        </section>

                        <div className="border-t border-gray-200" />

                        {/* Address Section */}
                        <section className="space-y-5">
                            <h2 className="text-lg font-semibold text-gray-700">Address</h2>
                            <motion.div
                                className="grid grid-cols-1 gap-4"
                                variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
                                initial="hidden"
                                animate="visible"
                            >
                                {/* Full width street address */}
                                <InfoCard
                                    label="Street Address"
                                    value={userDetails?.profile?.address}
                                    className="col-span-full"
                                    icon={<MapPinIcon className="w-5 h-5 text-indigo-500" />}
                                />

                                {/* Nested grid for city/state/pincode */}
                                <motion.div
                                    className="grid grid-cols-1 md:grid-cols-3 gap-4"
                                    variants={{ visible: { transition: { staggerChildren: 0.2 } } }}
                                >
                                    <InfoCard
                                        label="City"
                                        value={userDetails?.profile?.city}
                                        icon={<BuildingOfficeIcon className="w-5 h-5 text-teal-500" />}
                                    />

                                    <InfoCard
                                        label="Pincode"
                                        value={userDetails?.profile?.pincode}
                                        icon={<AtSymbolIcon className="w-5 h-5 text-pink-500" />}
                                    />
                                    <InfoCard
                                        label="Country"
                                        value={userDetails?.country_name}
                                        icon={<FlagIcon className="w-5 h-5 text-orange-500" />}
                                    />
                                </motion.div>
                            </motion.div>
                        </section>

                        <div className="border-t border-gray-200" />

                        {/* Bio Section */}
                        <section className="space-y-5">
                            <h2 className="text-lg font-semibold text-gray-700">Bio</h2>
                            <motion.div
                                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
                                variants={{ visible: { transition: { staggerChildren: 0.1 } } }} // Properly closed with 3 braces
                                initial="hidden"
                                animate="visible"
                            >
                                <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow border-l-4 border-blue-200">
                                    <p className="text-gray-600 text-sm leading-relaxed">
                                        {userDetails?.profile?.bio ||
                                            "No biography added yet. Share something about yourself!"}
                                    </p>
                                </div>
                            </motion.div>
                        </section>
                    </div>
                </motion.div>
            </div>

            {isModelOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm transition-all duration-300">
                    <div className="relative max-w-2xl w-full mx-4">
                        <TeacherProfileEdit setIsModelOpen={setIsModelOpen} />
                    </div>
                </div>
            )}
        </>
    );
};


export default TeacherProfileInfo
