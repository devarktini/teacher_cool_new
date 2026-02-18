"use client";

import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export function verifyAccountApi(uuid: string, verifyToken: string) {
  return axios.post(
    `${process.env.NEXT_PUBLIC_API_URL}user/account/verify-account/activate/${uuid}/${verifyToken}/`,
    {},
    {
      headers: {
        accept: "application/json",
      },
    }
  );
}

function Page() {
  const { uid, token } = useParams();
  const router = useRouter();

  const [isVerified, setIsVerified] = useState(false);
  const [loading, setLoading] = useState(true);

  const handleVerifyEmail = async () => {
    try {
      setLoading(true);
      const res = await verifyAccountApi(uid as string, token as string);

      if (res.status === 200) {
        setIsVerified(true);
      }
    } catch (error) {
      console.error("Verification failed:", error);
      setIsVerified(false);
    } finally {
      setLoading(false);
    }
  };

  const goToHome = () => {
    router.push("/");
  };

  // Auto verify when page loads
  useEffect(() => {
    if (uid && token) {
      handleVerifyEmail();
    }
  }, [uid, token]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-700 overflow-hidden relative">
      
      <div className="relative bg-white rounded-2xl shadow-2xl p-10 max-w-md w-full text-center">

        <div className="relative flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-tr from-green-400 to-green-600 mx-auto mb-8 shadow-lg">
          
          {!isVerified ? (
            <svg
              className="w-12 h-12 text-yellow-500 animate-spin"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="12" cy="12" r="10" />
            </svg>
          ) : (
            <svg
              className="w-12 h-12 text-white"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-10.707a1 1 0 10-1.414-1.414L9 9.586 7.707 8.293a1 1 0 10-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
          )}
        </div>

        {!isVerified ? (
          <>
            <h2 className="text-3xl font-extrabold text-gray-800 mb-2">
              Verification In Progress...
            </h2>
            <p className="text-gray-500 mb-8">
              Please wait while we verify your account.
            </p>

            {!loading && (
              <button
                onClick={handleVerifyEmail}
                className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold px-8 py-3 rounded-lg"
              >
                Retry Verification
              </button>
            )}
          </>
        ) : (
          <>
            <h2 className="text-3xl font-extrabold text-gray-800 mb-2">
              🎉 Congratulations!
            </h2>
            <p className="text-gray-500 mb-8">
              Your account has been successfully verified.
            </p>

            <button
              onClick={goToHome}
              className="bg-gradient-to-r from-green-500 to-indigo-600 text-white font-semibold px-8 py-3 rounded-lg"
            >
              Go To Home
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default Page;
