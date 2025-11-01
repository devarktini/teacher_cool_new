'use client';
import React from "react";
import confetti from "@/public/images/confeti.gif";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { selectAuth } from "@/store/features/authSlice";
import Image from "next/image";


const SuccessPayment = ({ setShowSuccess, showSuccess }: any) => {
    const router = useRouter();
    const { user_type } = useSelector(selectAuth)

    const OnClickGoDashboard = (e?: React.MouseEvent<HTMLButtonElement>) => {
        if (e && e.preventDefault) e.preventDefault();
        setShowSuccess(false);

        if (user_type === "student") {
            router.push("/dashboard/student/my-learning");
        } else if (user_type === "admin") {
            router.push("/dashboard/");
        } else if (user_type === "corporate") {
            router.push("/dashboard");
        } else if (user_type === "teacher") {
            router.push("/dashboard");
        } else if (user_type === "university") {
            router.push("/dashboard");
        } else {
            router.push("/");
        }
    };

    return (
        <div>
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                <div className="bg-gray-800 text-white rounded-xl shadow-lg p-8 w-96 relative overflow-hidden">
                    <div className="absolute inset-0">
                        <div className=" antialiased">
                            <Image
                                src={confetti}
                                alt="Confetti"
                                className="w-full opacity-50"
                            />
                        </div>
                    </div>
                    <div className="relative z-10 flex flex-col items-center">
                        <div className="bg-green-500 text-white rounded-full p-4 shadow-lg">
                            <svg
                                className="h-6 w-6 flex-none fill-sky-100 stroke-sky-500 stroke-2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <circle cx="12" cy="12" r="11" />
                                <path
                                    d="m8 13 2.165 2.165a1 1 0 0 0 1.521-.126L16 9"
                                    fill="none"
                                />
                            </svg>
                        </div>
                        <h1 className="text-2xl font-bold mt-4">Payment succeeded!</h1>
                        <p className="text-gray-400 mt-2 text-center">
                            Your transaction was completed successfully. Thank you for your
                            purchase!
                        </p>
                        <button
                            onClick={() => OnClickGoDashboard()}
                            className="bg-green-500 hover:bg-green-600 text-white font-semibold px-4 py-2 mt-6 rounded-lg shadow-lg"
                        >
                            Go to Your Dashboard
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SuccessPayment;
