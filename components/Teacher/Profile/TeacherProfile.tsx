'use client'
import React, { useState } from 'react';
import { RiVerifiedBadgeFill } from "react-icons/ri";

import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { selectAuth } from '@/store/features/authSlice';
import TeacherApiService from '@/services/teacherApi';
import TeacherProfileInfo from './TeacherProfileInfo';
import TeacherPersonalInfo from './TeacherPersonalInfo';

function TeacherProfile() {
    const { user } = useSelector(selectAuth);
    const userDetails = user;
    const [activeTab, setActiveTab] = useState('profile');

    // console.log("dd",userDetails)
    const handleVerify = async () => {
        try {
            const data = {
                status: "pending",
                user: userDetails?.id,
                teacher: userDetails?.teacher_details?.id,
                verified_by: ""
            }
            const res = await TeacherApiService.sendVerification(data)

            if (res) {
                toast.success("verification send successfully")
            }
        } catch (error) {
            console.error(error)
        }
    }
    return (
        <div className='w-full h-screen md:h-[78vh] flex flex-col md:flex-row overflow-hidden gap-2'>
            {/* Left Sidebar - Top on mobile, Side on desktop */}
            <div className='w-full md:w-[25%] lg:w-[20%] h-auto md:h-full bg-gray-100 p-2 md:p-4 border-b md:border-r border-gray-200 shadow-lg rounded-md
              flex flex-col items-center justify-between
            '>
                <div>


                    <div className='flex items-center text-2xl mb-6 justify-between'>
                        <h2 className='text-lg md:text-xl font-bold  text-gray-700'>My Profile</h2>

                        <RiVerifiedBadgeFill
                            className={`${userDetails?.teacher_details?.is_approved ? 'text-green-500' : ''
                                }`}
                        />

                    </div>

                    <div className='flex md:flex-col gap-2 md:space-y-2 overflow-x-auto md:overflow-visible '>
                        <div
                            onClick={() => setActiveTab('profile')}
                            className={`min-w-[120px] md:w-full p-2 rounded-lg cursor-pointer transition-colors text-sm md:text-base ${activeTab === 'profile'
                                ? 'bg-blue-500 text-white'
                                : 'hover:bg-gray-200 text-gray-600'
                                }`}
                        >
                            My Profile
                        </div>
                        <div
                            onClick={() => setActiveTab('details')}
                            className={`min-w-[120px] md:w-full p-2 rounded-lg cursor-pointer transition-colors text-sm md:text-base ${activeTab === 'details'
                                ? 'bg-blue-500 text-white'
                                : 'hover:bg-gray-200 text-gray-600'
                                }`}
                        >
                            Personal Information
                        </div>
                    </div>

                </div>

                <button className={`requestVerification px-2 py-2 border-1 border-blue-500 rounded-md shadow-lg text-blue-500 ${userDetails?.teacher_details?.is_approved ? 'hidden' : 'block'}`}
                    onClick={handleVerify}
                    disabled={!userDetails?.teacher_details?.profile_completed}
                >
                    {userDetails?.teacher_details?.profile_completed ? 'Request for Verification' : 'Complete Personal Details'}
                </button>

                {/* <button className={`requestVerification px-2 py-2 border-1 border-blue-500 rounded-md shadow-lg text-blue-500 ${userDetails?.teacher_details?.is_approved ? 'hidden':'block'}`}
                    onClick={handleVerify}
                    // disabled={!userDetails?.teacher_details?.profile_completed}
                >
                Request for Verification
                </button> */}

            </div>

            {/* Right Content Area - Below on mobile, Side on desktop */}
            <div className='w-full md:w-[75%] lg:w-[80%] h-full  rounded-md overflow-y-auto'>
                {activeTab === 'profile' && <TeacherProfileInfo />}
                {activeTab === 'details' && <TeacherPersonalInfo />}
            </div>

        </div>
    );
}


export default TeacherProfile
