'use client'
import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useDispatch, useSelector } from 'react-redux'
import { hideLoginPopup, selectLoginPopup } from '@/store/features/loginSlice'
import { useRouter } from 'next/navigation'
import { useLoginMutation } from '@/store/services/userApi'
import { setCredentials } from '@/store/features/authSlice'
import { UserRole } from '@/types/auth'
import { FaRegEye } from 'react-icons/fa6'
import { IoEyeOffOutline } from 'react-icons/io5'
import Registration from '@/components/Authentication/Registration'
import ForgetPassword from './ForgetPassward'
import { X } from 'lucide-react'

export default function LoginPopup() {
  const dispatch = useDispatch()
  const { isOpen } = useSelector(selectLoginPopup)
  const router = useRouter()
  const [login, { isLoading }] = useLoginMutation()

  const [formData, setFormData] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [isRegistrationOpen, setIsRegistrationOpen] = useState(false)
  const [showForgotPassword, setShowForgotPassword] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    try {
      const result = await login(formData).unwrap()

      dispatch(setCredentials({
        ...result,
        user_type: result.user_type as UserRole,
      }))

      localStorage.setItem('id', result.id)
      localStorage.setItem('user_type', result.user_type)
      localStorage.setItem('token', result.token)

      router.push('/dashboard')
      dispatch(hideLoginPopup())
    } catch (err: any) {
      setError(err?.data?.error || 'Invalid credentials')
    }
  }

  const handleGoogleClick = () => {
    setGoogleLoading(true);
    try {
      const GOOGLE_AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth";
      const REDIRECT_URI = "auth/api/login/google/";
      const scope = [
        "https://www.googleapis.com/auth/userinfo.email",
        "https://www.googleapis.com/auth/userinfo.profile",
      ].join(" ");
      const BASE_API_URL = process.env.NEXT_PUBLIC_API_URL;
      const params = {
        response_type: "code",
        client_id: "92086793642-8o73e40mi4o1f0o9vrin5h46pq3s80r6.apps.googleusercontent.com",// process.env.CLIENT_ID,
        redirect_uri: `${BASE_API_URL}${REDIRECT_URI}`,
        prompt: "select_account",
        access_type: "offline",
        scope,
      };
      const urlParams = new URLSearchParams(params).toString();
      window.location.href = `${GOOGLE_AUTH_URL}?${urlParams}`
    } catch (error) {
      console.error("Google Sign-In Error:", error);
    } finally {
      setGoogleLoading(false);
    }

  };

  const closePopup = () => {
    dispatch(hideLoginPopup())
    setShowForgotPassword(false)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Background Overlay */}
          <motion.div
            key="overlay"
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closePopup}
          />

          {/* Centered Popup */}
          <motion.div
            key="modal"
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ scale: 0.9, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 50 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          >
            <div
              className="relative w-full max-w-md bg-white rounded-xl shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={closePopup}
                className="absolute right-4 top-4 z-10 text-gray-500 hover:text-gray-700 transition-colors"
              >
                <X size={22} />
              </button>

              {/* Conditional Rendering: Login or Forgot Password */}
              {!showForgotPassword ? (
                /* Login UI */
                <div className="p-8 space-y-6">
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
                    <h2 className="text-2xl font-bold text-gray-900">Welcome Back</h2>
                    <p className="text-gray-600 text-sm">Sign in to your account</p>
                  </div>

                  {/* Google Button */}
                  <button
                    onClick={handleGoogleClick}
                    disabled={googleLoading}
                    className="w-full flex items-center justify-center space-x-3 bg-white border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50 text-gray-700 font-semibold py-2.5 rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {googleLoading ? (
                      <>
                        <svg className="animate-spin h-5 w-5 text-gray-700" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                        <span>Signing in...</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
                          <g clipPath="url(#clip0)">
                            <path d="M23.766 12.2764C23.766 11.4607 23.6999 10.6406 23.5588 9.8383H12.24V14.4928H18.7217C18.4528 15.9457 17.5885 17.2719 16.323 18.1271V21.1039H20.19C22.4945 19.0139 23.766 15.9274 23.766 12.2764Z" fill="#4285F4" />
                            <path d="M12.24 24C15.4765 24 18.2059 22.9945 20.1888 21.1039L16.3221 18.1271C15.3165 18.8575 14.0402 19.3195 12.24 19.3195C9.11588 19.3195 6.45873 17.1001 5.50691 14.3039H1.507V17.3917C3.55504 21.4328 7.7063 24 12.24 24Z" fill="#34A853" />
                            <path d="M5.50625 14.3039C5.20231 13.5995 5.00582 12.8287 5.00582 12.0282C5.00582 11.2274 5.20231 10.4565 5.50625 9.75231V6.66428H1.50731C0.631982 8.41987 0.115234 10.4306 0.115234 12.0282C0.115234 13.6257 0.631982 15.6365 1.50731 17.3921L5.50625 14.3039Z" fill="#FBBC04" />
                            <path d="M12.24 4.75971C14.3385 4.75971 16.2635 5.50865 17.773 7.07278L21.3662 3.59081C18.2054 0.985989 15.4765 0 12.24 0C7.70625 0 3.55504 2.56723 1.507 6.66428L5.50691 9.75231C6.45873 6.95659 9.11588 4.75971 12.24 4.75971Z" fill="#EA4335" />
                          </g>
                          <defs>
                            <clipPath id="clip0">
                              <rect width="24" height="24" fill="white" />
                            </clipPath>
                          </defs>
                        </svg>
                        <span>Sign in with Google</span>
                      </>
                    )}
                  </button>

                  {/* Divider */}
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-white text-gray-500">Or continue with email</span>
                    </div>
                  </div>

                  {/* Email/Password Form */}
                  <form className="space-y-4" onSubmit={handleSubmit}>
                    {error && (
                      <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-2.5 rounded-lg text-sm">
                        {error}
                      </div>
                    )}

                    <div className="space-y-1.5">
                      <label className="block text-sm font-medium text-gray-700">
                        Email Address
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="you@example.com"
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData((prev) => ({ ...prev, email: e.target.value }))
                        }
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-sm font-medium text-gray-700">
                        Password
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          required
                          placeholder="Enter your password"
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-12"
                          value={formData.password}
                          onChange={(e) =>
                            setFormData((prev) => ({ ...prev, password: e.target.value }))
                          }
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition"
                        >
                          {showPassword ? <IoEyeOffOutline size={20} /> : <FaRegEye size={20} />}
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <span className="ml-2 text-gray-600">Remember me</span>
                      </label>
                      <button
                        type="button"
                        onClick={() => setShowForgotPassword(true)}
                        className="text-blue-600 hover:text-blue-700 font-medium"
                      >
                        Forgot password?
                      </button>
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-2.5 rounded-lg transition duration-200 flex items-center justify-center space-x-2"
                    >
                      {isLoading ? (
                        <>
                          <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          <span>Signing in...</span>
                        </>
                      ) : (
                        <span>Sign In</span>
                      )}
                    </button>
                  </form>

                  <div className="text-center">
                    <p className="text-gray-600 text-sm">
                      Don't have an account?{' '}
                      <button
                        onClick={() => setIsRegistrationOpen(true)}
                        className="text-blue-600 hover:text-blue-700 font-semibold"
                      >
                        Sign up
                      </button>
                    </p>
                  </div>
                </div>
              ) : (
                /* Forgot Password UI */
                <ForgetPassword onBackToLogin={() => setShowForgotPassword(false)} />
              )}
            </div>

            {isRegistrationOpen && (
              <Registration onclose={() => setIsRegistrationOpen(false)} />
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}






// 'use client'
// import React, { useState } from 'react'
// import { motion, AnimatePresence } from 'framer-motion'
// import { useDispatch, useSelector } from 'react-redux'
// import { hideLoginPopup, selectLoginPopup } from '@/store/features/loginSlice'
// import { useRouter } from 'next/navigation'
// import { useLoginMutation } from '@/store/services/userApi'
// import { setCredentials } from '@/store/features/authSlice'
// import { UserRole } from '@/types/auth'
// import { FaRegEye } from 'react-icons/fa6'
// import { IoEyeOffOutline } from 'react-icons/io5'
// import Registration from '@/components/Authentication/Registration'
// import { X } from 'lucide-react'

// export default function LoginPopup() {
//   const dispatch = useDispatch()
//   const { isOpen } = useSelector(selectLoginPopup)
//   const router = useRouter()
//   const [login, { isLoading }] = useLoginMutation()

//   const [formData, setFormData] = useState({ email: '', password: '' })
//   const [error, setError] = useState('')
//   const [showPassword, setShowPassword] = useState(false)
//   const [googleLoading, setGoogleLoading] = useState(false)
//   const [isRegistrationOpen, setIsRegistrationOpen] = useState(false)

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
//     setError('')
//     try {
//       const result = await login(formData).unwrap()

//       dispatch(setCredentials({
//         ...result,
//         user_type: result.user_type as UserRole,
//       }))

//       localStorage.setItem('id', result.id)
//       localStorage.setItem('user_type', result.user_type)
//       localStorage.setItem('token', result.token)

//       router.push('/dashboard')
//       dispatch(hideLoginPopup())
//     } catch (err: any) {
//       setError(err?.data?.error || 'Invalid credentials')
//     }
//   }

//   const handleGoogleClick = () => {
//     setGoogleLoading(true);
//     try {
//       const GOOGLE_AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth";
//       const REDIRECT_URI = "auth/api/login/google/";
//       const scope = [
//         "https://www.googleapis.com/auth/userinfo.email",
//         "https://www.googleapis.com/auth/userinfo.profile",
//       ].join(" ");
//       const BASE_API_URL = process.env.NEXT_PUBLIC_API_URL;
//       const params = {
//         response_type: "code",
//         client_id: "92086793642-8o73e40mi4o1f0o9vrin5h46pq3s80r6.apps.googleusercontent.com",// process.env.CLIENT_ID,
//         redirect_uri: `${BASE_API_URL}${REDIRECT_URI}`,
//         prompt: "select_account",
//         access_type: "offline",
//         scope,
//       };
//       const urlParams = new URLSearchParams(params).toString();
//       window.location.href = `${GOOGLE_AUTH_URL}?${urlParams}`
//     } catch (error) {
//       console.error("Google Sign-In Error:", error);
//     } finally {
//       setGoogleLoading(false);
//     }

//   };

//   const closePopup = () => {
//     dispatch(hideLoginPopup())
//   }

//   return (
//     <AnimatePresence>
//       {isOpen && (
//         <>
//           {/* Background Overlay */}
//           <motion.div
//             key="overlay"
//             className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             onClick={closePopup}
//           />

//           {/* Centered Popup */}
//           <motion.div
//             key="modal"
//             className="fixed inset-0 z-50 flex items-center justify-center p-4"
//             initial={{ scale: 0.9, opacity: 0, y: 50 }}
//             animate={{ scale: 1, opacity: 1, y: 0 }}
//             exit={{ scale: 0.9, opacity: 0, y: 50 }}
//             transition={{ type: 'spring', stiffness: 200, damping: 20 }}
//           >
//             <div
//               className="relative w-full max-w-md bg-white rounded-xl shadow-2xl"
//               onClick={(e) => e.stopPropagation()}
//             >
//               {/* Close Button */}
//               <button
//                 onClick={closePopup}
//                 className="absolute right-4 top-4 z-10 text-gray-500 hover:text-gray-700 transition-colors"
//               >
//                 <X size={22} />
//               </button>

//               {/* Login UI */}
//               <div className="p-8 space-y-6">
//                 <div className="text-center space-y-2">
//                   <div className="flex justify-center mb-3">
//                     <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
//                       <svg
//                         className="w-6 h-6 text-white"
//                         fill="none"
//                         stroke="currentColor"
//                         viewBox="0 0 24 24"
//                       >
//                         <path
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                           strokeWidth={2}
//                           d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
//                         />
//                       </svg>
//                     </div>
//                   </div>
//                   <h2 className="text-2xl font-bold text-gray-900">Welcome Back</h2>
//                   <p className="text-gray-600 text-sm">Sign in to your account</p>
//                 </div>

//                 {/* Google Button */}
//                 <button
//                   onClick={handleGoogleClick}
//                   disabled={googleLoading}
//                   className="w-full flex items-center justify-center space-x-3 bg-white border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50 text-gray-700 font-semibold py-2.5 rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
//                 >
//                   {googleLoading ? (
//                     <>
//                       <svg className="animate-spin h-5 w-5 text-gray-700" fill="none" viewBox="0 0 24 24">
//                         <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
//                         <path
//                           className="opacity-75"
//                           fill="currentColor"
//                           d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
//                         />
//                       </svg>
//                       <span>Signing in...</span>
//                     </>
//                   ) : (
//                     <>
//                       <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
//                         <g clipPath="url(#clip0)">
//                           <path d="M23.766 12.2764C23.766 11.4607 23.6999 10.6406 23.5588 9.8383H12.24V14.4928H18.7217C18.4528 15.9457 17.5885 17.2719 16.323 18.1271V21.1039H20.19C22.4945 19.0139 23.766 15.9274 23.766 12.2764Z" fill="#4285F4" />
//                           <path d="M12.24 24C15.4765 24 18.2059 22.9945 20.1888 21.1039L16.3221 18.1271C15.3165 18.8575 14.0402 19.3195 12.24 19.3195C9.11588 19.3195 6.45873 17.1001 5.50691 14.3039H1.507V17.3917C3.55504 21.4328 7.7063 24 12.24 24Z" fill="#34A853" />
//                           <path d="M5.50625 14.3039C5.20231 13.5995 5.00582 12.8287 5.00582 12.0282C5.00582 11.2274 5.20231 10.4565 5.50625 9.75231V6.66428H1.50731C0.631982 8.41987 0.115234 10.4306 0.115234 12.0282C0.115234 13.6257 0.631982 15.6365 1.50731 17.3921L5.50625 14.3039Z" fill="#FBBC04" />
//                           <path d="M12.24 4.75971C14.3385 4.75971 16.2635 5.50865 17.773 7.07278L21.3662 3.59081C18.2054 0.985989 15.4765 0 12.24 0C7.70625 0 3.55504 2.56723 1.507 6.66428L5.50691 9.75231C6.45873 6.95659 9.11588 4.75971 12.24 4.75971Z" fill="#EA4335" />
//                         </g>
//                         <defs>
//                           <clipPath id="clip0">
//                             <rect width="24" height="24" fill="white" />
//                           </clipPath>
//                         </defs>
//                       </svg>
//                       <span>Sign in with Google</span>
//                     </>
//                   )}
//                 </button>

//                 {/* Divider */}
//                 <div className="relative">
//                   <div className="absolute inset-0 flex items-center">
//                     <div className="w-full border-t border-gray-300"></div>
//                   </div>
//                   <div className="relative flex justify-center text-sm">
//                     <span className="px-2 bg-white text-gray-500">Or continue with email</span>
//                   </div>
//                 </div>

//                 {/* Email/Password Form */}
//                 <form className="space-y-4" onSubmit={handleSubmit}>
//                   {error && (
//                     <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-2.5 rounded-lg text-sm">
//                       {error}
//                     </div>
//                   )}

//                   <div className="space-y-1.5">
//                     <label className="block text-sm font-medium text-gray-700">
//                       Email Address
//                     </label>
//                     <input
//                       type="email"
//                       required
//                       placeholder="you@example.com"
//                       className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                       value={formData.email}
//                       onChange={(e) =>
//                         setFormData((prev) => ({ ...prev, email: e.target.value }))
//                       }
//                     />
//                   </div>

//                   <div className="space-y-1.5">
//                     <label className="block text-sm font-medium text-gray-700">
//                       Password
//                     </label>
//                     <div className="relative">
//                       <input
//                         type={showPassword ? 'text' : 'password'}
//                         required
//                         placeholder="Enter your password"
//                         className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-12"
//                         value={formData.password}
//                         onChange={(e) =>
//                           setFormData((prev) => ({ ...prev, password: e.target.value }))
//                         }
//                       />
//                       <button
//                         type="button"
//                         onClick={() => setShowPassword(!showPassword)}
//                         className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition"
//                       >
//                         {showPassword ? <IoEyeOffOutline size={20} /> : <FaRegEye size={20} />}
//                       </button>
//                     </div>
//                   </div>

//                   <div className="flex items-center justify-between text-sm">
//                     <label className="flex items-center">
//                       <input
//                         type="checkbox"
//                         className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
//                       />
//                       <span className="ml-2 text-gray-600">Remember me</span>
//                     </label>
//                     <a href="#" className="text-blue-600 hover:text-blue-700 font-medium">
//                       Forgot password?
//                     </a>
//                   </div>

//                   <button
//                     type="submit"
//                     disabled={isLoading}
//                     className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-2.5 rounded-lg transition duration-200 flex items-center justify-center space-x-2"
//                   >
//                     {isLoading ? (
//                       <>
//                         <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
//                           <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
//                           <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
//                         </svg>
//                         <span>Signing in...</span>
//                       </>
//                     ) : (
//                       <span>Sign In</span>
//                     )}
//                   </button>
//                 </form>

//                 <div className="text-center">
//                   <p className="text-gray-600 text-sm">
//                     Don't have an account?{' '}
//                     <button
//                       onClick={() => setIsRegistrationOpen(true)}
//                       className="text-blue-600 hover:text-blue-700 font-semibold"
//                     >
//                       Sign up
//                     </button>
//                   </p>
//                 </div>
//               </div>
//             </div>

//             {isRegistrationOpen && (
//               <Registration onclose={() => setIsRegistrationOpen(false)} />
//             )}
//           </motion.div>
//         </>
//       )}
//     </AnimatePresence>

//   )
// }
