'use client'
import axios, { AxiosError } from 'axios';
import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

interface GenerateNewPasswordProps {
  uid: string;
  token: string;
}

interface PasswordFormData {
  newPassword: string;
  confirmPassword: string;
}

interface ApiErrorResponse {
  message?: string;
  detail?: string;
  error?: string;
}

const GenerateNewPassword: React.FC<GenerateNewPasswordProps> = ({ uid, token }) => {
  const router = useRouter();
  const [formData, setFormData] = useState<PasswordFormData>({
    newPassword: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({
    newPassword: '',
    confirmPassword: ''
  });
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState({
    new: false,
    confirm: false
  });

  // Password validation
  const validatePassword = (password: string): string => {
    if (password.length === 0) return '';
    if (password.length < 8) return 'Password must be at least 8 characters long';
    if (!/[A-Z]/.test(password)) return 'Password must contain at least one uppercase letter';
    if (!/[a-z]/.test(password)) return 'Password must contain at least one lowercase letter';
    if (!/[0-9]/.test(password)) return 'Password must contain at least one number';
    return '';
  };

  // Validate form on change
  useEffect(() => {
    const newPasswordError = validatePassword(formData.newPassword);
    const confirmPasswordError =
      formData.confirmPassword && formData.newPassword !== formData.confirmPassword
        ? 'Passwords do not match'
        : '';

    setErrors({
      newPassword: newPasswordError,
      confirmPassword: confirmPasswordError
    });

    // Enable button only if both fields are valid and filled
    const isValid =
      formData.newPassword.length >= 8 &&
      formData.confirmPassword.length >= 8 &&
      formData.newPassword === formData.confirmPassword &&
      !newPasswordError &&
      !confirmPasswordError;

    setIsButtonDisabled(!isValid);
  }, [formData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const resetPasswordApi = async (
    newPassword: string,
    confirmPassword: string,
    uidb64: string,
    tokenValue: string
  ) => {
    try {
      const response = await axios.post(
        `${BASE_URL}user/password-reset-confirm`,
        `new_password=${encodeURIComponent(newPassword)}&confirm_password=${encodeURIComponent(
          confirmPassword
        )}&token=${encodeURIComponent(tokenValue)}&uidb64=${encodeURIComponent(uidb64)}`,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<ApiErrorResponse>;
        const errorMessage =
          axiosError.response?.data?.message ||
          axiosError.response?.data?.detail ||
          axiosError.response?.data?.error ||
          'Failed to reset password';
        throw new Error(errorMessage);
      }
      throw error;
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await resetPasswordApi(
        formData.newPassword,
        formData.confirmPassword,
        uid,
        token
      );
      
      toast.success('Password reset successfully!');
      
      // Redirect to login after 2 seconds
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred while resetting the password';
      toast.error(errorMessage);
      console.error('Password reset error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 to-gray-100">
      <div className="bg-white shadow-2xl rounded-2xl flex overflow-hidden max-w-4xl w-full mx-4 transform hover:scale-[1.02] transition duration-300">
        {/* Left Panel */}
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 hidden md:flex flex-col justify-center items-center w-1/2 p-10 text-white">
          <div className="w-24 h-24 bg-white rounded-full flex justify-center items-center shadow-lg mb-6">
            <svg
              className="w-12 h-12 text-blue-500"
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
          <h3 className="text-2xl font-bold mb-4">Reset Password</h3>
          <p className="text-center text-base leading-relaxed opacity-90">
            Keep your account secure by creating a strong password with a mix of letters, numbers, and symbols.
          </p>
        </div>

        {/* Right Panel - Form */}
        <div className="w-full md:w-1/2 p-8 md:p-10">
          <h2 className="text-3xl font-bold mb-2 text-gray-800">Create New Password</h2>
          <p className="text-gray-600 text-sm mb-6">Enter your new password below</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* New Password Field */}
            <div>
              <label htmlFor="newPassword" className="block text-sm font-semibold mb-2 text-gray-700">
                New Password
              </label>
              <div className="relative">
                <input
                  id="newPassword"
                  name="newPassword"
                  type={showPassword.new ? 'text' : 'password'}
                  className={`w-full border rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition ${
                    errors.newPassword && formData.newPassword
                      ? 'border-red-500'
                      : 'border-gray-300'
                  }`}
                  placeholder="Enter new password"
                  value={formData.newPassword}
                  onChange={handleChange}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(prev => ({ ...prev, new: !prev.new }))}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword.new ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  )}
                </button>
              </div>
              {errors.newPassword && formData.newPassword && (
                <p className="text-red-500 text-xs mt-1">{errors.newPassword}</p>
              )}
            </div>

            {/* Confirm Password Field */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-semibold mb-2 text-gray-700">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showPassword.confirm ? 'text' : 'password'}
                  className={`w-full border rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition ${
                    errors.confirmPassword && formData.confirmPassword
                      ? 'border-red-500'
                      : 'border-gray-300'
                  }`}
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(prev => ({ ...prev, confirm: !prev.confirm }))}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword.confirm ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  )}
                </button>
              </div>
              {errors.confirmPassword && formData.confirmPassword && (
                <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>
              )}
            </div>

            {/* Password Requirements */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-xs font-semibold text-gray-700 mb-2">Password must contain:</p>
              <ul className="text-xs text-gray-600 space-y-1">
                <li className="flex items-center">
                  <span className={formData.newPassword.length >= 8 ? 'text-green-600' : 'text-gray-500'}>
                    {formData.newPassword.length >= 8 ? '✓' : '○'} At least 8 characters
                  </span>
                </li>
                <li className="flex items-center">
                  <span className={/[A-Z]/.test(formData.newPassword) ? 'text-green-600' : 'text-gray-500'}>
                    {/[A-Z]/.test(formData.newPassword) ? '✓' : '○'} One uppercase letter
                  </span>
                </li>
                <li className="flex items-center">
                  <span className={/[a-z]/.test(formData.newPassword) ? 'text-green-600' : 'text-gray-500'}>
                    {/[a-z]/.test(formData.newPassword) ? '✓' : '○'} One lowercase letter
                  </span>
                </li>
                <li className="flex items-center">
                  <span className={/[0-9]/.test(formData.newPassword) ? 'text-green-600' : 'text-gray-500'}>
                    {/[0-9]/.test(formData.newPassword) ? '✓' : '○'} One number
                  </span>
                </li>
              </ul>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className={`bg-blue-600 hover:bg-blue-700 text-white w-full py-3 rounded-lg font-semibold shadow-lg transition duration-200 flex items-center justify-center space-x-2 ${
                isButtonDisabled || isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              disabled={isButtonDisabled || isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Updating...</span>
                </>
              ) : (
                <span>UPDATE PASSWORD</span>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default GenerateNewPassword;
