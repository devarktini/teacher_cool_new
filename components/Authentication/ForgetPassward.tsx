'use client'
import React, { useState, useEffect } from "react";
import HomeApiService from "@/services/homeApi";

interface ForgetPasswordProps {
  onBackToLogin: () => void;
}

// Custom email validation function
const validateEmailFormat = (email: string): boolean => {
  // Comprehensive email regex pattern
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
};

// Custom validation rules
const customEmailValidator = {
  isValid: (value: string): boolean => {
    if (!value) return false;
    
    // Check minimum length
    if (value.length < 5) return false;
    
    // Check email format
    if (!validateEmailFormat(value)) return false;
    
    // Additional custom rules
    // Prevent common typos
    const commonDomains = ['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com'];
    const domain = value.split('@')[1]?.toLowerCase();
    
    // Check if domain exists
    if (!domain || domain.length < 4) return false;
    
    return true;
  },
  
  getErrorMessage: (value: string): string => {
    if (!value) return "Email is required";
    if (value.length < 5) return "Email must be at least 5 characters";
    if (!value.includes('@')) return "Email must contain @";
    if (!validateEmailFormat(value)) return "Invalid email format";
    return "";
  }
};

const ForgetPassword: React.FC<ForgetPasswordProps> = ({ onBackToLogin }) => {
  const [forgetPassLogin, setForgetPassLogin] = useState("");
  const [errors, setErrors] = useState<{ email?: string }>({});
  const [nextMove, setNextMove] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Custom validate email function
  const validateEmail = (email: string) => {
    if (customEmailValidator.isValid(email)) {
      setErrors({ email: "" });
      setNextMove(true);
    } else {
      setErrors({ email: customEmailValidator.getErrorMessage(email) });
      setNextMove(false);
    }
  };

  // Handle forget password
  const handleForgetPassword = () => {
    if (forgetPassLogin !== "" && nextMove === true) {
      setIsLoading(true);
      const payload = {
        email: forgetPassLogin,
      };
      const forgetApi = HomeApiService.forgetPasswordApi(payload);
      handleApiResponse(forgetApi);
    }
  };

  // Handle API response
  const handleApiResponse = (promise: Promise<any>) => {
    promise
      .then((response) => {
        setIsLoading(false);
        // Show popup
        setShowPopup(true);
        // Hide popup after 3 seconds
        setTimeout(() => {
          setShowPopup(false);
          onBackToLogin();
        }, 3000);
        // Reset email input
        setForgetPassLogin("");
      })
      .catch((error) => {
        setIsLoading(false);
        console.error("API call failed: ", error);
        setErrors({ email: "Failed to send verification email. Please try again." });
      });
  };

  // Validate email on change
  useEffect(() => {
    if (forgetPassLogin !== "" && forgetPassLogin !== undefined) {
      validateEmail(forgetPassLogin);
    } else {
      setNextMove(false);
    }
  }, [forgetPassLogin]);

  return (
    <div className="p-8 space-y-6">
      {/* Title */}
      <div className="text-center space-y-2">
        <div className="flex justify-center mb-3">
          <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Forgot Password</h2>
        <p className="text-gray-600 text-sm">
          Enter your email address to receive a verification code
        </p>
      </div>

      {/* Email Input */}
      <div className="space-y-4">
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-gray-700">
            Email Address
          </label>
          <input
            value={forgetPassLogin}
            name="forgetPassLogin"
            type="email"
            onChange={(e) => {
              setForgetPassLogin(e.target.value);
              if (e.target.value) {
                validateEmail(e.target.value);
              }
            }}
            className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.email && forgetPassLogin !== "" 
                ? "border-red-500" 
                : "border-gray-300"
            }`}
            placeholder="you@example.com"
          />
          {forgetPassLogin === "" ? (
            <span className="block text-sm text-red-500 pt-1">
              This field is required
            </span>
          ) : (
            errors.email && (
              <span className="block text-sm text-red-600 pt-1">
                {errors.email}
              </span>
            )
          )}
        </div>

        {/* Send Verification Mail Button */}
        <button
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-2.5 rounded-lg transition duration-200 flex items-center justify-center space-x-2"
          onClick={handleForgetPassword}
          disabled={!nextMove || forgetPassLogin === "" || isLoading}
        >
          {isLoading ? (
            <>
              <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <span>Sending...</span>
            </>
          ) : (
            <span>Send Verification Mail</span>
          )}
        </button>

        {/* Go Back Button */}
        <div className="text-center">
          <button
            className="text-blue-600 hover:text-blue-700 font-medium text-sm"
            onClick={onBackToLogin}
          >
            &laquo; Back to Login
          </button>
        </div>
      </div>

      {/* Success Popup */}
      {showPopup && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-8 rounded-lg shadow-xl transform transition-all duration-300 ease-in-out">
            <div className="flex flex-col items-center">
              {/* Checkmark Icon */}
              <svg
                className="w-12 h-12 text-green-500 mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>

              {/* Message */}
              <p className="text-lg text-gray-800 font-semibold text-center">
                Verification mail sent to your email.
              </p>

              {/* Close Button */}
              <button
                className="mt-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-all duration-200 ease-in-out transform hover:scale-105"
                onClick={() => {
                  setShowPopup(false);
                  onBackToLogin();
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ForgetPassword;
