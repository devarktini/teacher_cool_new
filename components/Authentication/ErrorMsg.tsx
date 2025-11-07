import { useEffect, useState } from "react";


function ErrorMsg() {
  const [errorMessage, setErrorMessage] = useState("");


  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const error = params.get("error");
    console.log(error)
    if (error) {
      setErrorMessage(decodeURIComponent(error));
    }
  }, [location.search]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <div className="max-w-lg w-full bg-white shadow-2xl rounded-2xl p-8 mx-4 transform hover:scale-105 transition-transform duration-300">
        <div className="flex flex-col items-center space-y-6">
          <div className="relative">
            <div className="absolute -inset-1 bg-red-500 rounded-full opacity-20 animate-pulse"></div>
            <svg className="w-16 h-16 text-red-500 relative" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M4.93 4.93a10.01 10.01 0 0114.14 0m1.41 1.41a10.01 10.01 0 010 14.14m-1.41 1.41a10.01 10.01 0 01-14.14 0m-1.41-1.41a10.01 10.01 0 010-14.14"></path>
            </svg>
          </div>
          
          <div className="text-center space-y-3">
            <h2 className="text-2xl md:text-3xl font-bold text-red-600">Login Error</h2>
            <p className="text-gray-600 text-sm md:text-base px-4">{errorMessage}</p>
          </div>

          <button
            className="bg-gradient-to-r from-blue-500 to-blue-700 text-white px-8 py-3 rounded-full font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200 text-sm md:text-base"
            // onClick={() => navigate("/")}
          >
            Return to Homepage
          </button>

          <div className="w-full border-t border-gray-200 mt-6"></div>
          
          <p className="text-gray-500 text-xs md:text-sm text-center">
            If the problem persists, please contact support or try again later
          </p>
        </div>
      </div>
    </div>
  );
}


export default ErrorMsg
