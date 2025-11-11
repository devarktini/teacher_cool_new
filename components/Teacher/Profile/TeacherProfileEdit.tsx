'use client';

import React, { useState, ChangeEvent, FormEvent } from 'react';
import { DatePicker } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { FiCamera } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import { selectAuth, setCredentials } from '@/store/features/authSlice';
import { useGetCountryListsQuery } from '@/store/services/userApi';
import StudentApiService from '@/services/studentApi';

interface TeacherProfileEditProps {
  setIsModelOpen: (isOpen: boolean) => void;
}

interface ProfileState {
  first_name: string;
  last_name: string;
  bio: string;
  dob: Dayjs | null;
  gender: string;
  phone: string;
  address: string;
  city: string;
  pincode: string;
  country: string;
  profileImage: File | string | null;
}

const TeacherProfileEdit: React.FC<TeacherProfileEditProps> = ({ setIsModelOpen }) => {
  const auth = useSelector(selectAuth);
  const dispatch = useDispatch();
  const { data: countryList } = useGetCountryListsQuery();
  const user = auth?.user;

  // console.log("ss",countryList)

  const [profile, setProfile] = useState<ProfileState>({
    first_name: user?.profile?.first_name || '',
    last_name: user?.profile?.last_name || '',
    bio: user?.profile?.bio || '',
    dob: user?.profile?.birth_date ? dayjs(user.profile.birth_date) : null,
    gender: user?.profile?.gender || '',
    phone: user?.profile?.mobile || '',
    address: user?.profile?.address || '',
    city: user?.profile?.city || '',
    pincode: user?.profile?.pincode || '',
    country: user?.country || '',
    profileImage: user?.profile?.profile_image || null,
  });

  const [imagePreview, setImagePreview] = useState<string | null>(
    typeof profile.profileImage === 'string' ? profile.profileImage : null
  );
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (['phone', 'pincode'].includes(name) && !/^\d*$/.test(value)) return;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ Fix: handle DatePicker value properly (Dayjs object)
  const handleDateChange = (date: Dayjs | null) => {
    setProfile((prev) => ({ ...prev, dob: date }));
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      setProfile((prev) => ({ ...prev, profileImage: file }));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!profile.dob) {
      setError('DOB is required');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('user_id', String(user?.id || ''));
      formDataToSend.append('bio', profile.bio);
      formDataToSend.append('gender', profile.gender || 'M');
      formDataToSend.append('address', profile.address);
      formDataToSend.append('mobile', profile.phone);
      formDataToSend.append('birth_date', profile.dob.format('YYYY-MM-DD')); // ✅ Convert to string here
      formDataToSend.append('city', profile.city);
      formDataToSend.append('first_name', profile.first_name);
      formDataToSend.append('last_name', profile.last_name);

      if (profile.country) formDataToSend.append('country_name', String(profile.country));
      if (profile.pincode) formDataToSend.append('pincode', profile.pincode);
      if (profile.profileImage && typeof profile.profileImage !== 'string') {
        formDataToSend.append('profile_image', profile.profileImage);
      }

      const updatedData: any = await StudentApiService.updateUserdetail(formDataToSend);

      if (updatedData?.success === true) {
        const refreshedUser = await StudentApiService.getUserdetails(user.id);

        dispatch(
          setCredentials({
            id: refreshedUser.data.id || user.id,
            user_type: auth.user_type ?? 'teacher',
            token: auth.token ?? '',
            user: refreshedUser.data,
          })
        );

        setIsModelOpen(false);
      }
    } catch (err) {
      console.error('Profile update error:', err);
      setError('Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-4xl relative max-h-[90vh] overflow-hidden">
        <button
          className="absolute top-4 right-4 z-10 p-1 text-gray-500 hover:text-gray-700"
          onClick={() => setIsModelOpen(false)}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="p-6 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-800">Edit Profile</h1>
        </div>

        <div className="overflow-y-auto h-[calc(90vh-140px)]">
          {/* Profile Picture */}
       
          <div className="flex justify-center mt-6 mb-4">
            <div className="relative">
              <input
                type="file"
                id="profile-image-upload"
                className="hidden"
                accept="image/*"
                onChange={handleImageChange}
              />
              <label htmlFor="profile-image-upload" className="cursor-pointer">
                <div className="relative">
                  <img
                    src={
                      imagePreview ||
                      (typeof profile.profileImage === 'string'
                        ? profile.profileImage.startsWith('http')
                          ? profile.profileImage
                          : `${process.env.NEXT_PUBLIC_BASE_URL || ''}${profile.profileImage}`
                        : '/default-profile.png')
                    }
                    alt="Profile"
                    className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md"
                  />
                  <div className="absolute bottom-0 right-0 bg-blue-500 p-1.5 rounded-full">
                    <FiCamera className="w-4 h-4 text-white" />
                  </div>
                </div>
              </label>
            </div>
          </div>


          {/* Form */}
          <form onSubmit={handleSubmit} className="px-6 pb-6 space-y-6">
            {/* Personal Info */}
            <section className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-800 flex items-center">
                <span className="w-2 h-5 bg-blue-500 mr-2 rounded-full"></span>
                Personal Information
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="first_name"
                    value={profile.first_name}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                  <input
                    type="text"
                    name="last_name"
                    value={profile.last_name}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  />
                </div>

                {/* ✅ Fixed DatePicker */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Birth Date</label>
                  <DatePicker
                    value={profile.dob}
                    onChange={handleDateChange}
                    className="w-full"
                    placeholder="Select date"
                  />
                  {error && <span className="text-red-500 text-sm">{error}</span>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                  <select
                    name="gender"
                    value={profile.gender}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm bg-white"
                  >
                    <option value="">Select Gender</option>
                    <option value="M">Male</option>
                    <option value="F">Female</option>
                    <option value="O">Other</option>
                  </select>
                </div>
              </div>
            </section>

            {/* Contact Info */}
            <section className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-800 flex items-center">
                <span className="w-2 h-5 bg-blue-500 mr-2 rounded-full"></span>
                Contact Information
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number</label>
                  <div className="flex">
                    <span className="px-3 py-2 border bg-gray-100 text-gray-600 text-sm">+91</span>
                    <input
                      type="text"
                      name="phone"
                      value={profile.phone}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '');
                        if (value.length <= 10) handleChange({ target: { name: 'phone', value } } as any);
                      }}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-r-md text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                  <input
                    type="text"
                    name="city"
                    value={profile.city}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Pincode</label>
                  <input
                    type="text"
                    name="pincode"
                    value={profile.pincode}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                  <select
                    name="country"
                    value={profile.country}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm bg-white"
                  >
                    <option value="">Select Country</option>
                    {countryList?.data?.map((item: any) => (
                      <option key={item.id} value={item.id}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                  <input
                    type="text"
                    name="address"
                    value={profile.address}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  />
                </div>
              </div>
            </section>

            {/* Bio */}
            <section className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-800 flex items-center">
                <span className="w-2 h-5 bg-blue-500 mr-2 rounded-full"></span>
                Professional Bio
              </h2>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">About You</label>
                <textarea
                  name="bio"
                  value={profile.bio}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm resize-none"
                  placeholder="Tell students about your teaching experience..."
                ></textarea>
                <p className="text-xs text-gray-500 mt-1">Max 500 characters</p>
              </div>
            </section>

            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-500 text-white py-2.5 px-4 rounded-md text-sm font-medium hover:bg-blue-600"
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TeacherProfileEdit;
