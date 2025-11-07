'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { useGetCountryListsQuery } from '@/store/services/userApi';
import toast from 'react-hot-toast';

interface Country {
  name: string;
  code: string;
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
}

export default function Account() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [token, setToken] = useState<string | null>(null);
  const [userType, setUserType] = useState<string>('');
  const [country, setCountry] = useState<string>('');
  const [showError, setShowError] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const dispatch = useDispatch();

  const { data: countryListResponse } = useGetCountryListsQuery();
  const countryList: Country[] = countryListResponse?.data || [];
  const sortedCountries = [...countryList].sort((a, b) =>
    a.name.localeCompare(b.name)
  );

  // Parse user from URL params
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

  const updateDataToLocalStorage = (
    authToken: string,
    userTypeValue: string,
    userId: string,
    userName: string,
    userEmail: string,
    userContact: string
  ): void => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', JSON.stringify(authToken));
      localStorage.setItem('user_type', JSON.stringify(userTypeValue));
      localStorage.setItem('id', JSON.stringify(userId));
      localStorage.setItem('userName', JSON.stringify(userName));
      localStorage.setItem('userEmail', JSON.stringify(userEmail));
      localStorage.setItem('userContact', JSON.stringify(userContact));
    }
  };

  const navigateToDashboard = (userTypeValue: string): void => {
    const dashboardRoutes: Record<string, string> = {
      student: 'dashboard/student',
      corporate: '/dashboard/corporates',
      teacher: '/dashboard/teacher',
    };

    const route = dashboardRoutes[userTypeValue] || '/';
    router.push(route);
  };

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
          'Accept': 'application/json',
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        toast.error('Token expired. Please login again');
        return;
      }

      const data: UpdateUserResponse = await response.json();
      const user = getUserFromParams();

      if (user) {
        updateDataToLocalStorage(
          authToken,
          data.user_type,
          user.id,
          user.name,
          user.email,
          user.contact
        );

        toast.success('Account created successfully');
        navigateToDashboard(data.user_type);
      }
    } catch (error) {
      console.error('Error updating user:', error);
      toast.error('An error occurred while updating your account');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    if (!userType || !country) {
      setShowError(true);
      return;
    }

    setShowError(false);
    await updateUser();
  };

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    const selectedCountryName = e.target.value;
    const selectedCountry = countryList.find(c => c.name === selectedCountryName);
    setCountry(selectedCountryName);
  };

  // Initialize on component mount
  useEffect(() => {
    const user = getUserFromParams();
    const authToken = searchParams.get('token');

    if (authToken) {
      setToken(authToken);
    }

    if (user && user.user_type) {
      // User already has a type, redirect to dashboard
      if (authToken) {
        updateDataToLocalStorage(
          authToken,
          user.user_type,
          user.id,
          user.name,
          user.email,
          user.contact
        );
      }
      toast.success('Account created successfully');
      navigateToDashboard(user.user_type);
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex justify-center items-center">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold text-gray-800 text-center">
          Please select to complete your profile
        </h2>

        {token ? (
          <form onSubmit={handleSubmit} className="space-y-4 mt-6">
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
                  <option key={countryItem.name} value={countryItem.name}>
                    {countryItem.name}
                  </option>
                ))}
              </select>
            </div>

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