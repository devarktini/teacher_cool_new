'use client';

import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { selectAuth } from '@/store/features/authSlice';
import { showLoginPopup } from '@/store/features/loginSlice';
import toast from 'react-hot-toast';
import Progress from '@/components/Progress';
import HomeApiService from '@/services/homeApi';
import { v4 as uuidv4 } from "uuid";
import Card from '@/components/ui/cards/Card';
import SuccessPayment from '@/components/common/SuccessPayment';

declare global {
    interface Window {
        Razorpay: any;
    }
}
function BulkCoursesPricing({ params }: { params: { slug: string } }) {
    const { slug } = params;
    const name = slug || '';

    const userId = localStorage.getItem("id");
    const dispatch = useDispatch();
    const [coursesLists, setCoursesLists] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    // const { displayRazorpay, setShowSuccess, showSuccess } = useRazorpay();
    const [orderDetails, setOrderDetails] = useState<null | any>(null);
    const [sdkLoaded, setSdkLoaded] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const { isAuthenticated } = useSelector(selectAuth);
    // console.log("isAuthenticated", isAuthenticated)

    const slugify = (text = '') =>
        text
            .toString()
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '');

    useEffect(() => {

        setLoading(true);
        HomeApiService.getCourseList()
            .then((res) => {
                if (res) {
                    setCoursesLists(res?.results || []);
                }
            })
            .catch((error: any) => console.error("Failed to fetch courses", error))
            .finally(() => setLoading(false));
    }, [name]);

    const matchedBundle = useMemo(() => {
        if (!name) return null;
        return bundles.find(b => slugify(b.name) === name.toLowerCase());
    }, [name]);

    const bundleCourseIdSet = useMemo(() => {
        return new Set(
            (matchedBundle?.coursesId || []).map((id) =>
                id ? id.toString().toLowerCase() : ''
            )
        );
    }, [matchedBundle]);

    const filteredCourses = useMemo(() => {
        if (!bundleCourseIdSet.size) return [];
        return coursesLists.filter((course) =>
            course?.id && bundleCourseIdSet.has(course.id.toString().toLowerCase())
        );
    }, [coursesLists, bundleCourseIdSet]);

    const coursesId = filteredCourses.map((item) => item.id).toString();
    // console.log("coursesid", coursesId)
    useEffect(() => {

        if (matchedBundle?.price) {
            setOrderDetails({
                razorpay_order_id: uuidv4(),
                amount: matchedBundle.price,
                currency: "INR",
                receipt: uuidv4(),
                status: "Completed",
                other_info: { coursesID: coursesId },
            });
        }
    }, [showSuccess]);


    // razor pay

    useEffect(() => {
        const loadRazorpay = () => {
            const script = document.createElement("script");
            script.src = "https://checkout.razorpay.com/v1/checkout.js";
            script.onload = () => {
                setSdkLoaded(true);
            };
            script.onerror = () => {
                setSdkLoaded(false);
            };
            document.body.appendChild(script);
        };
        loadRazorpay();
    }, []);


    const handlePayment = async () => {
        if (!isAuthenticated) {
            dispatch(showLoginPopup());
            return;
        }
        if (!sdkLoaded) {
            toast.error("Razorpay SDK failed to load. Are you online?");
            return;
        }
        // console.log("order deatils", orderDetails);
        const result = await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}lms/order/create_order/`,
            orderDetails,
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            }
        );
        if (!result) {
            toast.error("Server error. Are you online?");
            return;
        }
        // console.log("orderpaymentData", result.data);
        const {
            amount,
            status,
            razorpay_order_id,
            id,
            currency,
        } = result.data;

        const options = {
            key: "rzp_live_44by8SG2OOgTOL",
            // key: "rzp_test_DiDtTS7CUND6hK",
            amount: parseInt(amount),
            currency: currency,
            name: "GYPRC",
            description: "Payment for your Course",
            image:
                "https://pixabay.com/vectors/windows-windows-icon-windows-logo-3384024/",
            order_id: razorpay_order_id,
            handler: async (response: any) => {

                // console.log("respose", response)
                const data = {

                    others: { "bundleName": matchedBundle?.name },
                    //  orderCreationId: order_id,
                    razorpay_payment_id: response.razorpay_payment_id,
                    razorpay_signature: response.razorpay_signature,
                    verified: true,
                    amount: amount,
                    payment_option: "prepaid",
                    status: status,
                    student_id: userId,
                    course_id: coursesId,
                    razorpay_order: id

                };

                const result = await axios.post(
                    `${process.env.NEXT_PUBLIC_API_URL}lms/payment/bulk-purchase/`,
                    data,
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('token')}`,
                        },
                    }
                );
                if (result) {
                    // const enrollData = {
                    //   student: localStorage.getItem("userId"),
                    //   course: id,
                    // };
                    // addEnrollement(enrollData);
                    // localStorage.setItem("courseId", id);
                    setShowSuccess(true);
                    toast.success("Payment successful, Course added successfully!, Visit dashboard to view the course.");
                }
            },
            prefill: {
                name: localStorage.getItem("userName"),
                email: localStorage.getItem("userEmail"),
                contact: localStorage.getItem("userContact"),
            },
            notes: {
                address: "Razorpay Corporate Office",
            },
            theme: {
                color: "#F37254",
            },
        };


        const paymentObject = new window.Razorpay(options);
        paymentObject.open();
    };

    return (
        <div className="bg-gray-50 min-h-screen">
            {loading && <Progress />}

            <div className='w-full flex my-2 items-center justify-end  h-10 '>

                <button className=' w-[100px] h-full bg-blue-600 text-white  px-2 py-1 rounded-md shadow cursor-pointer hover:bg-blue-700 transition duration-200 mr-10'
                    onClick={() => window.history.back()}>
                    Back
                </button>
            </div>

            {!loading && (
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                    {/* Top details (exact text) */}
                    <div className="bg-white shadow rounded-lg p-6 mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-3">{matchedBundle?.name || "Bundle Not Found"}</h2>
                        {matchedBundle?.header && (
                            <p className="text-gray-700 mb-4 whitespace-pre-line">{matchedBundle.header}</p>
                        )}

                        {matchedBundle?.items && (
                            <div className="space-y-4">
                                {matchedBundle.items.map((it, idx) => (
                                    <div key={idx} className="p-4 bg-gray-50 rounded-md border border-gray-100">
                                        <h3 className="text-lg font-semibold text-gray-800">{it.title}</h3>
                                        <ul className="mt-2 list-disc list-inside text-gray-700 text-sm">
                                            {it.bullets.map((b, i) => <li key={i}>{b}</li>)}
                                        </ul>
                                    </div>
                                ))}
                            </div>
                        )}


                        {/* Cards */}
                        {matchedBundle ? (
                            filteredCourses?.length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 mt-5">
                                    {/* keep Card usage the same as before */}
                                    <Card data={filteredCourses} />
                                </div>
                            ) : (
                                <div className="bg-yellow-50 border-l-4 border-yellow-300 text-yellow-800 p-6 rounded-md shadow-md">
                                    <p className="text-base font-semibold">
                                        No courses found for the "{matchedBundle.name}" bundle.
                                    </p>
                                    <p className="text-sm mt-2">(Make sure the course IDs in the bundle match the API results.)</p>
                                </div>
                            )
                        ) : (
                            <div className="bg-red-50 border-l-4 border-red-300 text-red-800 p-6 rounded-md shadow-md">
                                <p className="text-base font-semibold">Bundle not found for route: "{name}"</p>
                            </div>
                        )}

                        {matchedBundle && (
                            <div className="mt-10">
                                <div className="relative bg-gradient-to-r from-blue-50 via-indigo-50 to-blue-100 rounded-xl border border-blue-200 shadow-lg p-6 md:p-8">
                                    {/* Heading */}
                                    {/* <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
                                    Price
                                </h3> */}

                                    {/* Price */}
                                    <div className="text-3xl md:text-4xl font-extrabold text-blue-700 mb-4">
                                        ₹ {matchedBundle.priceLabel}
                                    </div>

                                    {/* Action */}
                                    <button className="inline-block w-full sm:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:from-blue-700 hover:to-indigo-700 transition-all duration-300"
                                        onClick={handlePayment}
                                    >
                                        {matchedBundle.name === 'Get Starter Pack' ? matchedBundle.name : matchedBundle.name + ' Pack'}
                                    </button>

                                    {/* Decorative glow */}
                                    <div className="absolute -top-3 -right-3 bg-blue-600 text-white text-xs px-2 py-1 rounded-md shadow">
                                        Best Value
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                </div>
            )}
            
            {showSuccess && (
                <SuccessPayment setShowSuccess={setShowSuccess} /> 
            )}


        </div>
    );
}

export default BulkCoursesPricing


// Bundles: use only the exact text content provided by you
const bundles = [
    {
        name: "Get Starter Pack",
        header: "From zero to hero. Launch your data journey. Learn fast, build smart, and grow into a confident, job-ready analyst.",
        price: "1999",
        priceLabel: "1,999",
        items: [
            {
                title: "Python",
                bullets: [
                    "Learn the language that powers data and automation",
                    "Master Pandas, NumPy, and real-world data workflows"
                ]
            },
            {
                title: "Statistics",
                bullets: [
                    "Understand data distributions, probability, and hypothesis testing",
                    "Apply statistical techniques for real-world decision-making and analytics"
                ]
            },
            {
                title: "Power BI Basics",
                bullets: [
                    "Learn to connect, clean, and transform data with ease",
                    "Build interactive dashboards and visualizations from scratch"
                ]
            }
        ],
        coursesId: [
            "e7598fb3-8895-4e06-a1f2-3be5c9fb505b",
            "3ba83be4-b81f-451e-806e-17181abf408e",
            "5693bebc-5a21-4643-9e66-75096d347fed"
        ]
    },
    {
        name: "Get Professional ",
        price: "3999",
        priceLabel: "3,999",
        header: "Level up with the Professional Pack. Master Python, ML, Statistics, Power BI & NLP — build smarter models, sharper dashboards, and unlock career-ready skills with real-world projects.",
        items: [
            {
                title: "Python",
                bullets: [
                    "Learn the language that powers data and automation",
                    "Master Pandas, NumPy, and real-world data workflows"
                ]
            },
            {
                title: "Machine Learning (ML)",
                bullets: [
                    "Build predictive models with Scikit-learn",
                    "Apply ML to solve business problems hands-on"
                ]
            },
            {
                title: "Statistics",
                bullets: [
                    "Understand data distributions, probability, and hypothesis testing",
                    "Apply statistical techniques for real-world decision-making and analytics"
                ]
            },
            {
                title: "Power BI Advanced",
                bullets: [
                    "Design dynamic dashboards with DAX and KPIs",
                    "Connect live data and tell stories with visuals"
                ]
            },
            {
                title: "Natural Language Processing (NLP)",
                bullets: [
                    "Analyze text, sentiment, and keywords with Python",
                    "Build smart apps using transformer-based models"
                ]
            }
        ],
        coursesId: [
            "e7598fb3-8895-4e06-a1f2-3be5c9fb505b",
            "69a4b702-352a-4d0d-a032-7873b9ff1213",
            "31a68bfe-a760-4003-aa0d-b0e4e89c055d",
            "5693bebc-5a21-4643-9e66-75096d347fed",
            "4fc88cf6-dfb9-4fba-8665-4fb4a79cb0b6"
        ]
    },
    {
        name: "Get Advanced AI ",
        header: "Go beyond basics with the Advanced AI Pack Master Python, ML, CV, Power BI Advanced, Tableau & NLP — build intelligent systems, craft powerful dashboards, and lead with data-driven innovation.",
        price: "5999",
        priceLabel: "5,999",
        items: [
            {
                title: "Python",
                bullets: [
                    "Learn the language that powers data and automation",
                    "Master Pandas, NumPy, and real-world data workflows"
                ]
            },
            {
                title: "Machine Learning (ML)",
                bullets: [
                    "Build predictive models with Scikit-learn",
                    "Apply ML to solve business problems hands-on"
                ]
            },
            {
                title: "Computer Vision (CV)",
                bullets: [
                    "Detect, classify, and analyze images with OpenCV",
                    "Train deep learning models for real-world use cases"
                ]
            },
            {
                title: "Power BI Advanced",
                bullets: [
                    "Design dynamic dashboards with DAX and KPIs",
                    "Connect live data and tell stories with visuals"
                ]
            },
            {
                title: "Tableau",
                bullets: [
                    "Create stunning, interactive dashboards",
                    "Turn raw data into clear business insights"
                ]
            },
            {
                title: "Natural Language Processing (NLP)",
                bullets: [
                    "Analyze text, sentiment, and keywords with Python",
                    "Build smart apps using transformer-based models"
                ]
            }
        ],
        coursesId: [
            "e7598fb3-8895-4e06-a1f2-3be5c9fb505b",
            "69a4b702-352a-4d0d-a032-7873b9ff1213",
            "5693bebc-5a21-4643-9e66-75096d347fed",
            "df6f23a7-24cb-4f05-bb40-60b28d3dafb2",
            "4fc88cf6-dfb9-4fba-8665-4fb4a79cb0b6",
            "27ec4a6a-17c4-44d4-b9e1-18bd6fd7da6a"
        ]
    },
    {
        name: "Get Master Bundle",
        price: "7999",
        priceLabel: "7,999",
        header: "Master Data Science. Get certified in Python, Statistics, ML, CV & Power BI — build real-world projects, master end-to-end workflows, and become a full-stack data professional with lifetime access.",
        items: [
            {
                title: "DS Professional Certificate",
                bullets: [
                    "Full Certification – Shareable certificate for your resume & LinkedIn",
                    "Lifetime Access – No subscription, future updates included",
                    "Industry Projects – Real-world use cases: churn prediction, defect detection, sales dashboards"
                ]
            },
            {
                title: "Python",
                bullets: [
                    "Learn the language that powers data and automation",
                    "Master Pandas, NumPy, and real-world data workflows"
                ]
            },
            {
                title: "Statistics",
                bullets: [
                    "Understand data distributions, probability, and hypothesis testing",
                    "Apply statistical techniques for real-world decision-making and analytics"
                ]
            },
            {
                title: "Machine Learning (ML)",
                bullets: [
                    "Build predictive models with Scikit-learn",
                    "Apply ML to solve business problems hands-on"
                ]
            },
            {
                title: "Computer Vision (CV)",
                bullets: [
                    "Detect, classify, and analyze images with OpenCV",
                    "Train deep learning models for real-world use cases"
                ]
            },
            {
                title: "Power BI Advanced",
                bullets: [
                    "Design dynamic dashboards with DAX and KPIs",
                    "Connect live data and tell stories with visuals"
                ]
            }
        ],
        coursesId: [
            "aa5cea90-03bb-445e-8fcd-ae0a1f9d7743",
            "e7598fb3-8895-4e06-a1f2-3be5c9fb505b",
            "31a68bfe-a760-4003-aa0d-b0e4e89c055d",
            "69a4b702-352a-4d0d-a032-7873b9ff1213",
            "27ec4a6a-17c4-44d4-b9e1-18bd6fd7da6a",
            "e54bb092-32f7-4fe9-9148-77d80e38d88b"
        ]
    }
];