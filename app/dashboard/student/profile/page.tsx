'use client'
import { selectAuth, setCredentials } from '@/store/features/authSlice';
import { useGetCountryListsQuery } from '@/store/services/userApi';
import React, { useEffect, useState, FormEvent, ChangeEvent } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import profileNull from '@/public/images/profileNull.jpg'
import StudentApiService from '@/services/studentApi';
import { FaChevronDown } from 'react-icons/fa6';

// Define interfaces for type safety
interface FormDataType {
    firstName?: string;
    middleName?: string;
    lastName?: string;
    email?: string;
    bio: string;
    gender: string;
    age: string | number;
    address: string;
    phone: string;
    dob: string;
    country: string | number;
    city: string;
    pincode: string;
    profile_image: File | null;
    profileImage?: string; // Changed from string | StaticImageData to just string
}

interface CountryType {
    id: number;
    name: string;
}

function Page() {
    // const { user } = useSelector(selectAuth);
    const auth = useSelector(selectAuth); // ✅ fix: get full auth info (user, token, etc.)
    const { user } = auth || {};
    const { data: countryList } = useGetCountryListsQuery();
    const countrylist: CountryType[] = countryList?.data || [];
    const dispatch = useDispatch();

    const [formData, setFormData] = useState<FormDataType>({
        bio: "",
        gender: "M",
        age: "",
        address: "",
        phone: "",
        dob: "",
        country: "",
        city: "",
        pincode: "",
        profile_image: null,
    });

    const [error, setError] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);

    useEffect(() => {
        if (user) {
            const formattedDOB = user?.profile?.birth_date
                ? new Date(user.profile.birth_date).toISOString().split('T')[0]
                : "";

            setFormData({
                firstName: user.name,
                middleName: user.middleName,
                lastName: user.lastName,
                email: user.email,
                phone: user?.profile?.mobile || "",
                dob: formattedDOB,
                country: user?.country || "",
                city: user?.profile?.city === "null" ? "" : user?.profile?.city || "",
                pincode: user?.profile?.pincode || "",
                bio: user?.profile?.bio === "null" ? "" : user?.profile?.bio || "",
                age: user?.profile?.age === 0 ? "" : user?.profile?.age || "",
                address: user?.profile?.address === "null" ? "" : user?.profile?.address || "",
                gender: user?.profile?.gender || "M",
                // Convert StaticImageData to string by accessing .src property
                profileImage: user?.profile?.profile_image
                    ? `${process.env.NEXT_PUBLIC_API_URL}${user?.profile?.profile_image}`
                    : profileNull.src, // Access .src property of StaticImageData
                profile_image: null,
            });
        }
    }, [user]);

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        // Allow only numeric input for specific fields
        if (["age", "phone", "pincode"].includes(name) && !/^\d*$/.test(value)) {
            return;
        }

        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Validate file type
            const validTypes = ['image/png', 'image/jpg', 'image/jpeg'];
            if (!validTypes.includes(file.type)) {
                setError("Please upload a valid image file (PNG, JPG, or JPEG)");
                return;
            }

            // Validate file size (e.g., max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                setError("File size should not exceed 5MB");
                return;
            }

            setFormData((prevData) => ({
                ...prevData,
                profile_image: file,
            }));
            setError("");
        }
    };

    const handleCountryChange = (e: ChangeEvent<HTMLSelectElement>) => {
        setFormData((prev) => ({
            ...prev,
            country: e.target.value,
        }));
    };

    // Helper function to get image source as string
    const getImageSrc = (): string => {
        if (formData.profile_image) {
            return URL.createObjectURL(formData.profile_image);
        }
        if (formData.profileImage) {
            return formData.profileImage;
        }
        // Access .src property of StaticImageData
        return typeof profileNull === 'string' ? profileNull : profileNull.src;
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("");

        if (!formData.dob) {
            setError("Date of Birth is required");
            return;
        }

        setIsLoading(true);

        try {
            const formDataToSend = new FormData();

            // Append all form fields
            formDataToSend.append("user_id", user?.id);
            formDataToSend.append('bio', formData.bio);
            formDataToSend.append('gender', formData.gender || 'M');
            formDataToSend.append('age', String(formData.age || 0));
            formDataToSend.append('address', formData.address);
            formDataToSend.append('mobile', formData.phone);
            formDataToSend.append('birth_date', formData.dob);
            formDataToSend.append('city', formData.city);

            if (formData.country) {
                formDataToSend.append('country_name', String(formData.country));
            }
            if (formData.pincode) {
                formDataToSend.append('pincode', formData.pincode);
            }
            if (formData.profile_image) {
                formDataToSend.append('profile_image', formData.profile_image);
            }

            const updatedData: any = await StudentApiService.updateUserdetail(formDataToSend);

            
            if (updatedData?.success === true) {
                const refreshedUser = await StudentApiService.getUserdetails(user.id);
                // ✅ Dispatch the updated user to Redux store
                dispatch(
                    setCredentials({
                        id: refreshedUser.data.id || user.id,
                        user_type: auth.user_type ?? "student",
                        token: auth.token ?? "",
                        user: refreshedUser.data,
                    })
                );
            }

        } catch (err) {
            setError("Failed to update profile. Please try again.");
            // console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-10">
            {/* Profile Image Section */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                <div className="flex flex-col sm:flex-row items-center sm:items-end gap-6">
                    <div className="relative">
                        <img
                            src={getImageSrc()}
                            alt="Profile Preview"
                            className="rounded-full w-32 h-32 object-cover border-4 border-gray-100 shadow-md"
                        />
                    </div>
                    <div className="flex flex-col items-center sm:items-start gap-2">
                        <label
                            htmlFor="upload-image"
                            className="bg-blue-600 hover:bg-blue-700 transition-colors text-white font-medium px-6 py-2.5 rounded-lg cursor-pointer shadow-sm"
                        >
                            Update Photo
                            <input
                                type="file"
                                id="upload-image"
                                name="profile_image"
                                accept=".png,.jpg,.jpeg"
                                className="hidden"
                                onChange={handleFileChange}
                            />
                        </label>
                        <span className="text-xs text-gray-500">PNG, JPG, or JPEG (max 5MB)</span>
                    </div>
                </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit}>
                {/* Error Message */}
                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                        {error}
                    </div>
                )}

                {/* Personal Information Section */}
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-3">
                        Personal Information
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="flex flex-col">
                            <label className="text-sm font-semibold text-gray-700 mb-2">
                                Bio
                            </label>
                            <input
                                type="text"
                                name="bio"
                                value={formData.bio}
                                onChange={handleChange}
                                className="border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                placeholder="Tell us about yourself"
                            />
                        </div>

                        <div className="flex flex-col">
                            <label className="text-sm font-semibold text-gray-700 mb-2">
                                Age
                            </label>
                            <input
                                type="text"
                                name="age"
                                value={formData.age === null || formData.age === undefined ? "" : formData.age}
                                onChange={handleChange}
                                className="border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                placeholder="Enter your age"
                                maxLength={2}
                                inputMode="numeric"
                            />
                        </div>

                        <div className="flex flex-col">
                            <label className="text-sm font-semibold text-gray-700 mb-2">
                                Gender
                            </label>
                            <select
                                name="gender"
                                value={formData.gender}
                                onChange={handleChange}
                                className="border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            >
                                <option value="M">Male</option>
                                <option value="F">Female</option>
                                <option value="O">Other</option>
                            </select>
                        </div>

                        <div className="flex flex-col">
                            <label className="text-sm font-semibold text-gray-700 mb-2">
                                Phone
                            </label>
                            <input
                                type="text"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                inputMode="numeric"
                                maxLength={10}
                                className="border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                placeholder="Enter 10-digit phone number"
                            />
                        </div>

                        <div className="flex flex-col">
                            <label className="text-sm font-semibold text-gray-700 mb-2">
                                Date of Birth <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <input
                                    type="date"
                                    name="dob"
                                    value={formData.dob}
                                    onChange={handleChange}
                                    required
                                    className="border border-gray-300 rounded-lg px-4 py-2.5 w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                />
                                {/* <FaChevronDown className="absolute top-1/2 right-4 transform -translate-y-1/2 pointer-events-none text-gray-400" /> */}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Address Information Section */}
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-3">
                        Address Information
                    </h2>

                    <div className="mb-6">
                        <label className="text-sm font-semibold text-gray-700 mb-2 block">
                            Address
                        </label>
                        <textarea
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            className="border border-gray-300 rounded-lg px-4 py-2.5 w-full resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            placeholder="Enter your full address"
                            rows={4}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="flex flex-col">
                            <label className="text-sm font-semibold text-gray-700 mb-2">
                                Country
                            </label>
                            <select
                                name="country"
                                value={formData.country}
                                onChange={handleCountryChange}
                                className="border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            >
                                <option value="">Select a Country</option>
                                {countrylist.map((country) => (

                                    <option key={country.id} value={country.id}>
                                        {country.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="flex flex-col">
                            <label className="text-sm font-semibold text-gray-700 mb-2">
                                City/State
                            </label>
                            <input
                                type="text"
                                name="city"
                                value={formData.city}
                                onChange={handleChange}
                                className="border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                placeholder="Enter City/State"
                            />
                        </div>

                        <div className="flex flex-col">
                            <label className="text-sm font-semibold text-gray-700 mb-2">
                                Pincode
                            </label>
                            <input
                                type="text"
                                name="pincode"
                                value={formData.pincode || ""}
                                onChange={handleChange}
                                className="border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                placeholder="6-digit pincode"
                                inputMode="numeric"
                                maxLength={6}
                            />
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex  justify-end items-center gap-4 bg-white rounded-lg shadow-sm p-6">
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold px-8 py-3 rounded-lg shadow-sm transition-all disabled:cursor-not-allowed"
                    >
                        {isLoading ? 'Saving...' : 'Save Changes'}
                    </button>
                    {/* <button
                        type="button"
                        className="w-full sm:w-auto text-red-500 hover:text-red-700 font-semibold px-8 py-3 rounded-lg border border-red-500 hover:border-red-700 transition-all"
                        
                    >
                        Delete Account
                    </button> */}
                </div>
            </form>
        </div>
    );
}

export default Page;
