'use client';

import UserRegistrationApiService from '@/services/userRegistration';
import { hideLoginPopup } from '@/store/features/loginSlice';
import { useGetCountryListsQuery, useGetUserTypeQuery } from '@/store/services/userApi';
import { RootState } from '@/store/store';
import { useRouter } from 'next/navigation';
import React, { useState, useRef } from 'react';
import toast from 'react-hot-toast';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import { useDispatch, useSelector } from 'react-redux';

interface FormData {
  profile_image: File | null;
  full_name: string;
  email: string;
  mobile_number: string;
  password: string;
  confirm_password: string;
  country: string;
  university_name: string;
  university_email: string;
  university_address: string;
}

interface Country {
  id: string;
  name: string;
}

interface UserType {
  id: string;
  name: string;
}

function UniversityRegistration({ onclose }: { onclose?: () => void }) {
  const router = useRouter();
  const dispatch = useDispatch();
  const { data: userType } = useGetUserTypeQuery();
  const { data: countryList } = useGetCountryListsQuery();
  const { isOpen } = useSelector((state: RootState) => state.loginPopup);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const user_types: UserType[] = userType?.data || [];
  const universityType = user_types?.find((item: any) => item.name === 'university');
  const countries: Country[] = countryList?.data || [];

  const [formData, setFormData] = useState<FormData>({
    profile_image: null,
    full_name: '',
    email: '',
    mobile_number: '',
    password: '',
    confirm_password: '',
    country: '',
    university_name: '',
    university_email: '',
    university_address: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const passwordPattern =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{6,}$/;
  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  // Validation functions
  const validateFullName = (name: string): string => {
    const trimmedName = name.trim();
    const words = trimmedName.split(/\s+/).filter(Boolean);
    if (!trimmedName) return 'Name is required';
    if (words.length < 2) return 'Name must have at least 2 words';
    if (trimmedName.length < 3) return 'Name must be at least 3 characters';
    if (trimmedName.length > 50) return 'Name must not exceed 50 characters';
    if (!/^[a-zA-Z\s'-]+$/.test(trimmedName))
      return 'Name can only contain letters, spaces, hyphens, and apostrophes';
    return '';
  };

  const validateUniversityName = (name: string): string => {
    const trimmedName = name.trim();
    if (!trimmedName) return 'University name is required';
    if (trimmedName.length < 3) return 'University name must be at least 3 characters';
    if (trimmedName.length > 100) return 'University name must not exceed 100 characters';
    if (!/^[a-zA-Z0-9\s'&,().-]+$/.test(trimmedName))
      return 'University name can only contain letters, numbers, spaces, and special characters (-&,.)';
    return '';
  };

  const validateUniversityAddress = (address: string): string => {
    const trimmedAddress = address.trim();
    if (!trimmedAddress) return 'University address is required';
    if (trimmedAddress.length < 5) return 'Address must be at least 5 characters';
    if (trimmedAddress.length > 200) return 'Address must not exceed 200 characters';
    if (!/^[a-zA-Z0-9\s',-./()#&]+$/.test(trimmedAddress))
      return 'Address contains invalid characters';
    return '';
  };

  const validateEmail = (email: string): string => {
    if (!email) return 'Email is required';
    if (!emailPattern.test(email)) return 'Please enter a valid email address';
    return '';
  };

  const validateMobileNumber = (mobile: string): string => {
    const cleanMobile = mobile.replace(/\D/g, '');
    if (!mobile) return 'Mobile number is required';
    if (!/^\d+$/.test(mobile)) return 'Mobile number can only contain digits';
    if (cleanMobile.length !== 10) return 'Mobile number must be exactly 10 digits';
    return '';
  };

  const validatePassword = (password: string): string => {
    if (!password) return 'Password is required';
    if (!passwordPattern.test(password)) {
      return 'Password must be at least 6 characters with uppercase, lowercase, number, and special character (!@#$%^&*)';
    }
    return '';
  };

  const validateConfirmPassword = (confirmPassword: string): string => {
    if (!confirmPassword) return 'Please confirm your password';
    if (confirmPassword !== formData.password) return 'Passwords do not match';
    return '';
  };

  const validateProfileImage = (file: File | null): string => {
    if (!file) return 'Profile image is required';
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type))
      return 'Only JPEG, PNG, GIF, and WebP images are allowed';
    if (file.size > 5 * 1024 * 1024) return 'Image size must not exceed 5MB';
    return '';
  };

  // Handlers
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      const error = validateProfileImage(file);
      if (error) {
        setErrors((prev) => ({ ...prev, profile_image: error }));
        toast.error(error);
      } else {
        setFormData((prev) => ({ ...prev, profile_image: file }));
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prev: FormData): FormData => {
      const updated = { ...prev, [name]: value };

      // Real-time validation
      let error = '';
      if (name === 'full_name') {
        error = validateFullName(value);
      } else if (name === 'email') {
        error = validateEmail(value);
      } else if (name === 'mobile_number') {
        const cleanValue = value.replace(/[^0-9]/g, '').slice(0, 10);
        updated.mobile_number = cleanValue;
        error = validateMobileNumber(cleanValue);
      } else if (name === 'password') {
        error = validatePassword(value);
        // Also validate confirm password if it exists
        if (prev.confirm_password) {
          const confirmError =
            value !== prev.confirm_password ? 'Passwords do not match' : '';
          setErrors((prevErrors) => ({
            ...prevErrors,
            confirm_password: confirmError,
          }));
        }
      } else if (name === 'confirm_password') {
        error = validateConfirmPassword(value);
      } else if (name === 'country') {
        error = value ? '' : 'Please select a country';
      } else if (name === 'university_name') {
        error = validateUniversityName(value);
      } else if (name === 'university_address') {
        error = validateUniversityAddress(value);
      } else if (name === 'university_email') {
        error = validateEmail(value);
      }

      setErrors((prevErrors) => ({ ...prevErrors, [name]: error }));
      return updated;
    });
  };

  const filteredCountries = countries.filter((country: Country) =>
    country.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCountrySelect = (countryId: string, countryName: string) => {
    setFormData((prev: FormData): FormData => ({ ...prev, country: countryId }));
    setSearchTerm(countryName);
    setIsDropdownOpen(false);
    setErrors((prev) => ({ ...prev, country: '' }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    // Validate all fields
    const newErrors: Record<string, string> = {};
    newErrors.full_name = validateFullName(formData.full_name);
    newErrors.email = validateEmail(formData.email);
    newErrors.mobile_number = validateMobileNumber(formData.mobile_number);
    newErrors.password = validatePassword(formData.password);
    newErrors.confirm_password = validateConfirmPassword(formData.confirm_password);
    newErrors.country = formData.country ? '' : 'Please select a country';
    newErrors.profile_image = validateProfileImage(formData.profile_image);
    newErrors.university_name = validateUniversityName(formData.university_name);
    newErrors.university_address = validateUniversityAddress(formData.university_address);
    newErrors.university_email = validateEmail(formData.university_email);

    setErrors(newErrors);

    // Check if there are any errors
    if (Object.values(newErrors).some((error) => error)) {
      setIsLoading(false);
      return;
    }

    try {
      // Submit form
      const universityDetails = {
        uni_name: formData.university_name,
        address: formData.university_address,
        email: formData.university_email,
      };
      const submitData = new FormData();
      if (universityType?.id) {
        submitData.append('type', universityType?.id.toString());
      }
      submitData.append('name', formData.full_name);
      submitData.append('email', formData.email);
      submitData.append('mobile', formData.mobile_number);
      submitData.append('password', formData.password);
      submitData.append('confirm_password', formData.confirm_password);
      submitData.append('country', formData.country);
      submitData.append('university_details', JSON.stringify(universityDetails));
      if (formData.profile_image) {
        submitData.append('profile_image', formData.profile_image);
      }

      // Make API call here
      const response: any =
        await UserRegistrationApiService.corporateOrUniversityRegister(submitData);
      if (response.success === true) {
        toast.success(
          response?.message ||
          'Registration successful! Please check your email to verify your account.'
        );
        onclose?.();
        router.push('/login');
        if (isOpen) {
          dispatch(hideLoginPopup());
        }
      }

      if (response.success !== true) {
        const errorMessage = response.message || 'An error occurred';

        // Ensure toast fires
        setTimeout(() => {
          toast.error(errorMessage);
        }, 100);
      }
    } catch (error) {
      console.error('Registration error:', error);
      toast.error('An error occurred during registration. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Profile Image Upload */}
      <div className="space-y-2">
        <label className="block text-sm font-semibold text-gray-900">
          Profile Image <span className="text-red-500">*</span>
        </label>
        <div
          onClick={() => fileInputRef.current?.click()}
          className="relative border-2 border-dashed border-gray-300 rounded-lg p-6 cursor-pointer hover:border-blue-500 transition-colors"
        >
          {imagePreview ? (
            <div className="relative w-full">
              <img
                src={imagePreview}
                alt="Preview"
                className="w-32 h-32 object-cover rounded-lg mx-auto"
              />
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setImagePreview(null);
                  setFormData((prev) => ({ ...prev, profile_image: null }));
                  if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                  }
                }}
                className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
              >
                ✕
              </button>
            </div>
          ) : (
            <div className="text-center">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 48 48"
              >
                <path
                  d="M28 8H12a4 4 0 00-4 4v20a4 4 0 004 4h24a4 4 0 004-4V20m-14-8l-4-4m0 0l-4 4m4-4v12"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <p className="mt-2 text-sm text-gray-600">Click to upload or drag and drop</p>
              <p className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB</p>
            </div>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />
        </div>
        {errors.profile_image && (
          <p className="text-sm text-red-500 flex items-center">
            <span className="mr-1">⚠️</span> {errors.profile_image}
          </p>
        )}
      </div>

      {/* Full Name */}
      <div className="space-y-2">
        <label className="block text-sm font-semibold text-gray-900">
          Full Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="full_name"
          placeholder="John Doe Smith"
          value={formData.full_name}
          onChange={handleInputChange}
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition ${errors.full_name ? 'border-red-500 bg-red-50' : 'border-gray-300'
            }`}
        />
        {errors.full_name && (
          <p className="text-sm text-red-500 flex items-center">
            <span className="mr-1">⚠️</span> {errors.full_name}
          </p>
        )}
      </div>

      <div className='grid xl:grid-cols-2 gap-4'>

        {/* Email */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-900">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            name="email"
            placeholder="you@example.com"
            value={formData.email}
            onChange={handleInputChange}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition ${errors.email ? 'border-red-500 bg-red-50' : 'border-gray-300'
              }`}
          />
          {errors.email && (
            <p className="text-sm text-red-500 flex items-center">
              <span className="mr-1">⚠️</span> {errors.email}
            </p>
          )}
        </div>

        {/* Mobile Number */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-900">
            Mobile Number <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="mobile_number"
            placeholder="9876543210"
            value={formData.mobile_number}
            onChange={handleInputChange}
            maxLength={10}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition ${errors.mobile_number ? 'border-red-500 bg-red-50' : 'border-gray-300'
              }`}
          />
          {errors.mobile_number && (
            <p className="text-sm text-red-500 flex items-center">
              <span className="mr-1">⚠️</span> {errors.mobile_number}
            </p>
          )}
        </div>

        {/* Country Searchable Dropdown */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-900">
            Country <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type="text"
              placeholder="Search and select your country"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => setIsDropdownOpen(true)}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition ${errors.country ? 'border-red-500 bg-red-50' : 'border-gray-300'
                }`}
            />

            {/* Dropdown */}
            {isDropdownOpen && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                {filteredCountries.length > 0 ? (
                  filteredCountries.map((country: Country) => (
                    <button
                      key={country.id}
                      type="button"
                      onClick={() => handleCountrySelect(country.id, country.name)}
                      className="w-full text-left px-4 py-3 hover:bg-blue-50 transition-colors flex items-center justify-between"
                    >
                      <span>{country.name}</span>
                      {formData.country === country.id && (
                        <span className="text-blue-600 font-bold">✓</span>
                      )}
                    </button>
                  ))
                ) : (
                  <p className="px-4 py-3 text-gray-500 text-center">No countries found</p>
                )}
              </div>
            )}
          </div>
          {errors.country && (
            <p className="text-sm text-red-500 flex items-center">
              <span className="mr-1">⚠️</span> {errors.country}
            </p>
          )}
        </div>

        {/* Password */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-900">
            Password <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder="Min 6 chars with uppercase, number, special char (!@#$%^&*)"
              value={formData.password}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition pr-12 ${errors.password ? 'border-red-500 bg-red-50' : 'border-gray-300'
                }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
            </button>
          </div>
          {errors.password && (
            <p className="text-sm text-red-500 flex items-center">
              <span className="mr-1">⚠️</span> {errors.password}
            </p>
          )}
        </div>

        {/* Confirm Password */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-900">
            Confirm Password <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              name="confirm_password"
              placeholder="Re-enter your password"
              value={formData.confirm_password}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition pr-12 ${errors.confirm_password ? 'border-red-500 bg-red-50' : 'border-gray-300'
                }`}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showConfirmPassword ? (
                <AiOutlineEyeInvisible size={20} />
              ) : (
                <AiOutlineEye size={20} />
              )}
            </button>
          </div>
          {errors.confirm_password && (
            <p className="text-sm text-red-500 flex items-center">
              <span className="mr-1">⚠️</span> {errors.confirm_password}
            </p>
          )}
        </div>

        {/* University Name */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-900">
            University Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="university_name"
            placeholder="Enter your university name"
            value={formData.university_name}
            onChange={handleInputChange}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition ${errors.university_name ? 'border-red-500 bg-red-50' : 'border-gray-300'
              }`}
          />
          {errors.university_name && (
            <p className="text-sm text-red-500 flex items-center">
              <span className="mr-1">⚠️</span> {errors.university_name}
            </p>
          )}
        </div>

        {/* University Email */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-900">
            University Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            name="university_email"
            placeholder="Enter your university email"
            value={formData.university_email}
            onChange={handleInputChange}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition ${errors.university_email ? 'border-red-500 bg-red-50' : 'border-gray-300'
              }`}
          />
          {errors.university_email && (
            <p className="text-sm text-red-500 flex items-center">
              <span className="mr-1">⚠️</span> {errors.university_email}
            </p>
          )}
        </div>
      </div>
      {/* University Address */}
      <div className="space-y-2">
        <label className="block text-sm font-semibold text-gray-900">
          University Address <span className="text-red-500">*</span>
        </label>
        <textarea
          name="university_address"
          placeholder="Enter your university address (e.g., 123 Main St, Building A, City, State 12345)"
          value={formData.university_address}
          onChange={(e) => {
            const value = e.target.value;
            setFormData((prev) => ({ ...prev, university_address: value }));
            const error = validateUniversityAddress(value);
            setErrors((prev) => ({ ...prev, university_address: error }));
          }}
          rows={3}
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition resize-none ${errors.university_address ? 'border-red-500 bg-red-50' : 'border-gray-300'
            }`}
        />
        <p className="text-xs text-gray-500">Min 5 - Max 200 characters</p>
        {errors.university_address && (
          <p className="text-sm text-red-500 flex items-center">
            <span className="mr-1">⚠️</span> {errors.university_address}
          </p>
        )}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-blue-400 disabled:to-blue-400 text-white font-semibold py-3 rounded-lg transition duration-200 flex items-center justify-center space-x-2"
      >
        {isLoading ? (
          <>
            <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <span>Registering...</span>
          </>
        ) : (
          <span>Complete Registration</span>
        )}
      </button>

      {/* Terms */}
      <p className="text-xs text-gray-600 text-center">
        By registering, you agree to our{' '}
        <a href="/terms" className="text-blue-600 hover:text-blue-700 font-semibold">
          Terms of Service
        </a>{' '}
        and{' '}
        <a href="/privacy" className="text-blue-600 hover:text-blue-700 font-semibold">
          Privacy Policy
        </a>
      </p>
    </form>
  );
}

export default UniversityRegistration;
