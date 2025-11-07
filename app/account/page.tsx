'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { useGetCountryListsQuery } from '@/store/services/userApi';
import { setCredentials } from '@/store/features/authSlice';
import toast from 'react-hot-toast';

interface Country {
  name: string;
  code: string;
  id: string;
}

interface UserParams {
  id: string;
  name: string;
  email: string;
  contact: string;
  user_type: string | null;
}

interface UpdateUserPayload {
  user_type: string;
  country: string;
}

interface UpdateUserResponse {
  user_type: string;
  message?: string;
}

interface ErrorResponse {
  message?: string;
  error?: string;
  detail?: string;
}

export default function Account() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useDispatch();

  const [token, setToken] = useState<string | null>(null);
  const [userType, setUserType] = useState<string>('');
  const [country, setCountry] = useState<string>('');
  const [showError, setShowError] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { data: countryListResponse } = useGetCountryListsQuery();
  const countryList: Country[] = countryListResponse?.data || [];
  const sortedCountries = [...countryList].sort((a, b) => a.name.localeCompare(b.name));

  // ✅ Parse user from URL params (used in Google redirect)
  const getUserFromParams = (): UserParams | null => {
    try {
      const userParam = searchParams.get('user');
      if (!userParam) return null;
      return JSON.parse(decodeURIComponent(userParam));
    } catch (error) {
      console.error('Error parsing user from params:', error);
      return null;
    }
  };

  // ✅ Store data in both localStorage & Redux store
  const saveUserSession = (
    authToken: string,
    userTypeValue: string,
    userData: UserParams
  ): void => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', authToken);
      localStorage.setItem('user_type', userTypeValue);
      localStorage.setItem('id', userData.id);
      localStorage.setItem('userName', userData.name);
      localStorage.setItem('userEmail', userData.email);
      localStorage.setItem('userContact', userData.contact);
      localStorage.setItem('user', JSON.stringify(userData));
    }

    dispatch(
      setCredentials({
        id: userData.id,
        user_type: userTypeValue as any,
        token: authToken,
        user: userData,
      })
    );
  };

  // ✅ Navigate to dashboard
  const navigateToDashboard = (userTypeValue: string): void => {
    const dashboardRoutes: Record<string, string> = {
      student: '/dashboard',
      corporate: '/dashboard',
      teacher: '/dashboard',
    };
    const route = dashboardRoutes[userTypeValue] || '/';
    router.push(route);
  };

  // ✅ Update user after Google sign-in
  const updateUser = async (): Promise<void> => {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL;
    if (!baseUrl) {
      toast.error('API base URL is not configured');
      return;
    }

    const authToken = searchParams.get('token');
    if (!authToken) {
      toast.error('Authentication token is missing');
      return;
    }

    const payload: UpdateUserPayload = {
      user_type: userType,
      country: country,
    };

    try {
      setIsLoading(true);
      const response = await fetch(`${baseUrl}/user/update-user/`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data: UpdateUserResponse | ErrorResponse = await response.json();

      if (!response.ok) {
        const errorMsg =
          (data as ErrorResponse).message ||
          (data as ErrorResponse).error ||
          'Something went wrong';
        toast.error(errorMsg);
        return;
      }

      // ✅ Success
      const successData = data as UpdateUserResponse;
      const user = getUserFromParams();
      if (user) {
        saveUserSession(authToken, successData.user_type, user);
        toast.success('Account created successfully');
        navigateToDashboard(successData.user_type);
      }
    } catch (error) {
      console.error('Error updating user:', error);
      toast.error('Failed to update account');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!userType || !country) {
      setShowError(true);
      return;
    }
    setShowError(false);
    await updateUser();
  };

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    setCountry(e.target.value);
  };

  // ✅ On mount, check token and existing user_type
  useEffect(() => {
    const user = getUserFromParams();
    const authToken = searchParams.get('token');

    if (authToken) {
      setToken(authToken);
    } else {
      toast.error('No authentication token found');
      router.push('/login');
      return;
    }

    if (user && user.user_type) {
      saveUserSession(authToken, user.user_type, user);
      toast.success('Welcome back!');
      navigateToDashboard(user.user_type);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex justify-center items-center">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold text-gray-800 text-center">
          Please complete your profile
        </h2>

        {token ? (
          <form onSubmit={handleSubmit} className="space-y-4 mt-6">
            {/* User Type */}
            <div>
              <label
                htmlFor="userType"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                User Type
              </label>
              <select
                id="userType"
                className="w-full px-3 py-2 text-base text-gray-900 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                value={userType}
                onChange={(e) => setUserType(e.target.value)}
              >
                <option value="">Select user type</option>
                <option value="student">Student</option>
                <option value="teacher">Teacher</option>
                <option value="corporate">Corporate</option>
              </select>
            </div>

            {/* Country */}
            <div>
              <label
                htmlFor="country"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Country
              </label>
              <select
                id="country"
                value={country}
                onChange={handleCountryChange}
                className="w-full border-2 border-gray-300 rounded py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 bg-white"
              >
                <option value="">Select Country</option>
                {sortedCountries.map((countryItem) => (
                  <option key={countryItem.id} value={countryItem.id}>
                    {countryItem.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Submitting...' : 'Submit'}
            </button>

            {showError && (
              <p className="mt-2 text-sm text-red-600 text-center">
                Please select user type and country.
              </p>
            )}
          </form>
        ) : (
          <p className="text-red-600 mt-4 text-center">
            Something went wrong. Please try again later.
          </p>
        )}
      </div>
    </div>
  );
}
