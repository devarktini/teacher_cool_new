'use client'
import React, { useEffect, useState } from 'react'
import SelectedCourseDetail from './SelectedCourseDetail';
import { useDispatch, useSelector } from 'react-redux';
import { selectAuth } from '@/store/features/authSlice';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import StudentApiService from '@/services/studentApi';
import usersIcon from '@/public/images/people.png'
import clock from '@/public/images/time.png'
import Image from 'next/image';
import { FaChevronRight, FaHouse } from 'react-icons/fa6';
import Link from 'next/link';
import useRazorpay from '../payment/PaymentComponent';
import { v4 as uuidv4 } from "uuid";
import { parse } from 'path';
import { RxCross2 } from 'react-icons/rx';
import HomeApiService from '@/services/homeApi';
import Progress from '../Progress';
import { setCourseBatch } from '@/store/features/courseSlice';


function CourseDetails({ specificCourse }: any) {
    const { displayRazorpay, setShowSuccess, showSuccess } = useRazorpay();
    const { user_type, user, isAuthenticated } = useSelector(selectAuth);
    const [students, setStudents] = useState<number | null>(null);
    const [enrollmentCourse, setEnrollmentCourse] = useState([]);
    const [formOpen, setFormOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const dispatch = useDispatch()

    const handleDispatch = (item: any) => {
        // console.log("in batch",item)
        dispatch(setCourseBatch(item))
        router.push(`/dashboard/student/learn-course`);
    }
    //   console.log(user)
    const fetchEnrolmmentData = async () => {
        const userId = user?.id
        setLoading(true)
        try {
            const response = await StudentApiService.getEnrollement(userId);
            // console.log("ken", response?.data?.map((item: any) => item?.course))
            setEnrollmentCourse(response?.data?.map((item: any) => item?.course));
        } catch (error) {
            toast.error('something went wrong')
        } finally {
            setLoading(false)
        }
    };
    const handleWish = async (course: any) => {
        if (!isAuthenticated) {
            toast('Please Login!')
            return;
        }

        const payload: any = {
            user: user.id,
            course,
        };

        const formData = new FormData();
        formData.append("user", payload.user);
        formData.append("course", payload.course);

        const res = await StudentApiService.studentPostWish(formData);
        // console.log("wishlist:",res?.msg)

        if (res) {
            toast.success("added to wishlist");
        } else {
            toast.error("Unable to add to wishlist");
        }
    };

    useEffect(() => {
        // Runs only on the client
        setStudents(Math.floor(Math.random() * (20 - 5 + 1)) + 5)
    }, [])
    useEffect(() => {
        if (isAuthenticated) {
            fetchEnrolmmentData();
        }

    }, [isAuthenticated])

    const orderDetails = {
        razorpay_order_id: uuidv4(),
        amount: parseInt(specificCourse?.price),
        currency: "INR",
        receipt: uuidv4(),
        status: "created",
        other_info: {},
    };
    const handleByCoursePayment = () => {
        if (!isAuthenticated) {
            toast('Please Login!')
            return;
        } else {
            displayRazorpay(orderDetails, specificCourse.id);
        }
    }

    const isCourseIdMatched = enrollmentCourse?.some((course: any) => course?.id === specificCourse?.id);

    // console.log('iscoursmatch', isCourseIdMatched)

    if (loading) {
        return <Progress />
    }
    return (
        <>
            <div className=" mt-5 mx-auto">
                <div className="  w-[85%] m-auto mb-2 ">
                    <ul className=" flex items-center gap-1 md:gap-3">
                        <li>
                            <FaHouse
                                className="lg:w-[22px] lg:h-[22px] text-[#767777] cursor-pointer"
                                onClick={() => router.push("/")}
                            />
                        </li>
                        <li>
                            <FaChevronRight className="text-[10px] md:text-sm text-[#767777] " />
                        </li>
                        <Link
                            href={{
                                pathname: "/courses",
                                search: "?query=free",
                            }}
                        >
                            <li className="text-[10px] text-nowrap md:text-sm text-[#767777] font-Roboto cursor-pointer">
                                Browse
                            </li>
                        </Link>
                        <li>
                            <FaChevronRight className="text-[10px] md:text-sm text-[#767777] " />
                        </li>
                        <li
                            onClick={() => router.push(`/browse/${specificCourse.catname.toLowerCase().replace(/\s+/g, '-')}`)}
                            className="text-[10px] text-nowrap md:text-sm text-[#767777] font-Roboto cursor-pointer">
                            {specificCourse?.catname}
                        </li>
                        <li>
                            <FaChevronRight className="text-[10px] md:text-sm text-[#767777] " />
                        </li>
                        <li className="text-[10px] overflow-hidden text-nowrap md:text-sm text-[#767777] font-Roboto cursor-pointer">
                            {specificCourse?.title}
                        </li>
                    </ul>
                </div>
            </div>
            {/* <div className="bg-[#F4F6FC] "> */}
            <div className="bg-white ">
                <div className="container mx-auto">
                    <div className="w-[90%] mx-auto grid grid-cols-1 md:grid-cols-2 pb-10 gap-5">
                        <div className="flex flex-col gap-3 items-start pt-16">
                            <div className="flex items-end">
                                <button
                                    className={`${specificCourse?.level === "unknown"
                                        ? ""
                                        : "text-[#0966ED] bg-[#DBE6FE] h-8 px-2 w-auto text-sm font-medium rounded-full font-Roboto uppercase"
                                        }`}
                                >
                                    {/* {getLabel(specificCourse?.level)} */}
                                    {specificCourse?.level === 'unknown'
                                        ? null
                                        : specificCourse?.level === 'beginner'
                                            ? 'Beginner'
                                            : specificCourse?.level === 'beginer_to_intermediate'
                                                ? 'Beginer To Intermediate'
                                                : specificCourse?.level === 'beginner_to_advanced'
                                                    ? 'Beginner To Advanced'
                                                    : specificCourse?.level}
                                </button>
                            </div>
                            <span className="text-3xl md:text-4xl text-[#1E1E1E] text-opacity-90 font-bold font-Roboto">
                                {specificCourse?.title}
                            </span>
                            <h1 className="text-base text-[#1E1E1E] xl:text-left text-justify text-opacity-60 font-Roboto">
                                {specificCourse?.description}
                            </h1>
                            {/* <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-sm"> */}
                            <div className={`flex items-center gap-2 ${specificCourse?.total_price ? "bg-white" : ""} px-4 py-2 rounded-lg shadow-sm`}>

                                {specificCourse?.total_price ? (
                                    <>
                                        <span className="text-gray-600 font-medium">Price:</span>
                                        <span className="text-xl font-bold text-[#0966ED]">
                                            ₹ {specificCourse?.total_price ? specificCourse?.total_price : "Free"}
                                        </span>
                                    </>
                                ) : null
                                }


                            </div>
                            <div className="flex gap-6 items-center py-2">
                                <div className="flex items-center gap-3">
                                    <Image
                                        src={usersIcon}
                                        alt="img"
                                    />
                                    <span className="text-base font-Roboto font-medium text-[#656565]">
                                        {students ? `${students}K+ Students` : 'Loading...'}
                                    </span>
                                </div>
                                {specificCourse?.duration && (
                                    <div className="flex items-center gap-3">
                                        <Image
                                            src={clock}
                                            alt="img"
                                        />
                                        <span className="text-base font-medium font-Roboto text-[#656565]">
                                            {specificCourse?.duration}
                                        </span>
                                    </div>
                                )}

                            </div>

                            <>
                                {specificCourse?.total_price > 0 ? (
                                    <div className="flex flex-col xl:flex-row w-full items-center gap-6">
                                        {isCourseIdMatched ? (
                                            <button className="w-full xl:w-[182px] h-[46px] flex items-center justify-center text-base font-Roboto font-semibold text-white bg-green-500 rounded-md"
                                                onClick={() => handleDispatch(specificCourse)}
                                            >
                                                Go to Course
                                            </button>
                                        ) : (
                                            <button
                                                onClick={handleByCoursePayment}
                                                className="w-full xl:w-[182px] h-[46px] text-base font-Roboto font-semibold text-white bg-[#0966ED] rounded-md"
                                            >
                                                Buy Course
                                            </button>
                                        )}

                                        <button
                                            onClick={() => handleWish(specificCourse?.id)}
                                            className="w-full xl:w-[182px] h-[46px] text-base font-Roboto font-semibold text-white bg-[#FF5733] rounded-md"
                                        >
                                            Add to Wishlist
                                        </button>

                                        <a
                                            href="#courseDetail"
                                            className="text-base font-Roboto font-medium text-[#1E1E1E] border-b border-[#1E1E1E] whitespace-nowrap"
                                        >
                                            View Course Materials
                                        </a>
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => setFormOpen(!formOpen)}
                                        className="w-full xl:w-[182px] h-[46px] flex items-center justify-center text-base font-Roboto font-semibold text-white bg-[#0966ED] rounded-md uppercase"
                                    >
                                        Contact Us
                                    </button>
                                )}
                            </>
                        </div>

                        <div className="pt-20 flex justify-center">
                            {specificCourse?.banner == null ? (
                                <div className="flex items-center gap-3 animate-pulse">
                                    <div className="w-6 h-6 bg-gray-200 rounded-full"></div>
                                    <div className="h-4 w-20 bg-gray-200 rounded"></div>
                                </div>
                            ) : (
                                <img
                                    src={specificCourse?.banner}
                                    alt="img"
                                    className="max-w-full h-auto"
                                />
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div id="courseDetail" className="container mx-auto">
                <div className="w-[90%] mx-auto">
                    <SelectedCourseDetail specificCourse={specificCourse} />
                </div>
            </div>

            <ContactForm
                formOpen={formOpen}
                setFormOpen={setFormOpen}
                courseData={specificCourse}
            />
        </>
    )
}

export default CourseDetails;


const ContactForm = ({ formOpen, setFormOpen, courseData }: any) => {
    //  console.log("dkdk", courseData?.id)
    const [formValue, setFormValue] = useState({
        // courseId: courseData?.id,
        email: courseData?.email,
        phone: courseData?.phone,
        message: courseData?.message,
        courseName: courseData?.title || "Course",
        country: "India",
        type: "Individuals",
    });

    const onchangeHandle = (e: any) => {
        setFormValue({ ...formValue, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: any) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("course", courseData?.id);
        formData.append("email", formValue.email);
        formData.append("phone_number", formValue.phone);
        formData.append("message", formValue.message);
        formData.append("country", formValue.country);
        formData.append("type", formValue.type);
        formData.append("subject", formValue.courseName);

        HomeApiService.createUserRequest(formData)
            .then((res) => {
                if (res) {
                    setFormOpen(false);
                    setFormValue(
                        {
                            email: "",
                            phone: "",
                            message: "",
                            courseName: "",
                            country: "India",
                            type: "Individuals",
                        }
                    );
                    toast.success("Form submitted successfully");
                }
            })
            .catch((err) => {
                console.error("Error submitting form:", err);
            });
    };

    return (
        <>
            {formOpen && (
                <div className="fixed inset-0 bg-transparent flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full relative animate-in fade-in zoom-in duration-200">
                        {/* Close Button */}
                        <button
                            onClick={() => setFormOpen(!formOpen)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full p-2 transition-all"
                            aria-label="Close form"
                        >
                            <RxCross2 className="w-5 h-5" />
                        </button>

                        {/* Content Container */}
                        <div className="p-8">
                            {/* Form Heading */}
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">
                                Get in Touch
                            </h2>
                            <p className="text-sm text-gray-500 mb-6">
                                Fill in your details and we'll get back to you soon
                            </p>

                            {/* Form */}
                            <form className="space-y-5" onSubmit={handleSubmit}>
                                {/* Email Field */}
                                <div>
                                    <label
                                        htmlFor="email"
                                        className="block text-sm font-medium text-gray-700 mb-1.5"
                                    >
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        id="email"
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                        placeholder="you@example.com"
                                        value={formValue.email}
                                        onChange={onchangeHandle}
                                        required
                                    />
                                </div>

                                {/* Phone Field */}
                                <div>
                                    <label
                                        htmlFor="phone"
                                        className="block text-sm font-medium text-gray-700 mb-1.5"
                                    >
                                        Phone
                                    </label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        id="phone"
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                        placeholder="+91 98765 43210"
                                        value={formValue.phone}
                                        onChange={onchangeHandle}
                                        required
                                    />
                                </div>

                                {/* Message Field */}
                                <div>
                                    <label
                                        htmlFor="message"
                                        className="block text-sm font-medium text-gray-700 mb-1.5"
                                    >
                                        Message
                                    </label>
                                    <textarea
                                        name="message"
                                        id="message"
                                        rows={4}
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                                        placeholder="Tell us how we can help you..."
                                        value={formValue.message}
                                        onChange={onchangeHandle}
                                        required
                                    ></textarea>
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium px-4 py-3 rounded-lg transition-all shadow-md hover:shadow-lg active:scale-95"
                                >
                                    Send Message
                                </button>
                            </form>
                        </div>
                    </div>
                </div>

            )}
        </>
    );
};