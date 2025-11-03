'use client';
import React, { useState, useEffect } from "react";
import HomeApiService from "@/services/homeApi";
import { useGetCountryListsQuery } from "@/store/services/userApi";

// Type definitions
interface Course {
  id: string | number;
  title: string;
}

interface Country {
  name: string;
  code: string;
}

interface FormData {
  describesYouBest: string;
  selectCourse: string;
  subject: string;
  email: string;
  country: string;
  phone: string;
  message: string;
}

interface FormErrors {
  describesYouBest?: string;
  selectCourse?: string;
  subject?: string;
  email?: string;
  phone?: string;
  message?: string;
  country?:string;
}

interface TouchedFields {
  describesYouBest?: boolean;
  selectCourse?: boolean;
  subject?: boolean;
  email?: boolean;
  country?: boolean;
  phone?: boolean;
  message?: boolean;
}

export const ExpertHelpLeft = () => {
  const [selectedCode, setSelectedCode] = useState<string>("+91");
  const [courseData, setCourseData] = useState<Course[]>([]);
  const [toggleInput, setToggleInput] = useState<boolean>(false);
  const [customCourse, setCustomCourse] = useState<string>("");
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  
  const { data: countryList } = useGetCountryListsQuery();
  const countrylist: Country[] = countryList?.data || [];

//    console.log("dd",countryList)
  const sortedCountries = [...countrylist].sort((a, b) =>
    a?.name.localeCompare(b?.name)
  );

  // Form state
  const [formData, setFormData] = useState<FormData>({
    describesYouBest: "",
    selectCourse: "",
    subject: "",
    email: "",
    country: "India",
    phone: "",
    message: ""
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<TouchedFields>({});

  useEffect(() => {
    HomeApiService.getCourseList()
      ?.then((res: any) => {
        if (res && res.results) {
          setCourseData(res.results);
        }
      })
      .catch((error: any) => console.error("Error fetching course data:", error));
  }, []);

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    
    if (!formData.describesYouBest) {
      newErrors.describesYouBest = "Please select an option";
    }
    if (!formData.selectCourse) {
      newErrors.selectCourse = "Please select a course";
    }
    if (!formData.subject) {
      newErrors.subject = "Subject is required";
    }
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)) {
      newErrors.email = "Invalid email address";
    }
    if (!formData.phone) {
      newErrors.phone = "Phone number is required";
    } else if (!/^[0-9]+$/.test(formData.phone)) {
      newErrors.phone = "Phone number is not valid";
    } else if (formData.phone.length < 10) {
      newErrors.phone = "Phone number should be at least 10 digits";
    }
    if (!formData.message) {
      newErrors.message = "Message is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    if (validate()) {
      const formPayload = new FormData();
      formPayload.append("type", formData.describesYouBest);
      formPayload.append("subject", formData.subject);
      formPayload.append("email", formData.email);
      formPayload.append("phone_number", formData.phone);
      formPayload.append("country", formData.country);
      formPayload.append("message", formData.message);
      formPayload.append("course", formData.selectCourse);

      HomeApiService.createUserRequest(formPayload)
        .then((res: any) => {
          if (res) {
            setIsModalVisible(true);
            setFormData({
              describesYouBest: "",
              selectCourse: "",
              subject: "",
              email: "",
              country: "India",
              phone: "",
              message: ""
            });
            setToggleInput(false);
            setCustomCourse("");
          }
        })
        .catch(() => setIsModalVisible(true));
    }
  };

  const handleFieldChange = (field: keyof FormData, value: string): void => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const handleBlur = (field: keyof TouchedFields): void => {
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  const handleCountryChange = (value: string): void => {
    const selectedCountry = countrylist.find(c => c.name === value);
    setSelectedCode(selectedCountry?.code || "+91");
    handleFieldChange("country", value);
  };

  const handleOk = (): void => {
    setIsModalVisible(false);
  };

  return (
    <>
      <div className="expertLeft">
        <h1 className="text-black text-[2rem] font-bold mb-1">Get Expert Help</h1>
      </div>

      <form className="bg-white px-1 pt-6 pb-1 mb-1" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          <div className="relative mb-4">
            <select
              value={formData.describesYouBest}
              onChange={(e) => handleFieldChange("describesYouBest", e.target.value)}
              onBlur={() => handleBlur("describesYouBest")}
              className={`w-full bg-white pr-2 border-2 border-gray-300 rounded-md pl-2 py-2 focus:outline-none ${
                errors.describesYouBest && touched.describesYouBest ? "border-red-500" : ""
              }`}
            >
              <option disabled value="">What describes you best</option>
              <option value="Individuals">Individuals</option>
              <option value="Corporates">Corporates</option>
              <option value="University">University</option>
            </select>
            {errors.describesYouBest && touched.describesYouBest && (
              <span className="text-red-500 text-sm">{errors.describesYouBest}</span>
            )}
          </div>

          <div className="relative">
            <select
              value={toggleInput ? "Others" : formData.selectCourse}
              onChange={(e) => {
                const value = e.target.value;
                if (value === "Others") {
                  setToggleInput(true);
                  handleFieldChange("selectCourse", "");
                } else {
                  setToggleInput(false);
                  setCustomCourse("");
                  handleFieldChange("selectCourse", value);
                }
              }}
              onBlur={() => handleBlur("selectCourse")}
              className={`w-full bg-white border-2 border-gray-300 rounded-md pl-2 pr-16 py-2 focus:outline-none ${
                errors.selectCourse && touched.selectCourse ? "border-red-500" : ""
              }`}
            >
              <option value="" disabled>
                {toggleInput ? "Enter your course" : "Select a course"}
              </option>
              {courseData?.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.title}
                </option>
              ))}
              <option value="Others">Others</option>
            </select>
            {errors.selectCourse && touched.selectCourse && (
              <span className="text-red-500 text-sm">{errors.selectCourse}</span>
            )}
          </div>

          {toggleInput && (
            <div className="col-span-2 pt-0">
              <input
                type="text"
                placeholder="Enter your course"
                value={customCourse}
                onChange={(e) => {
                  setCustomCourse(e.target.value);
                  handleFieldChange("selectCourse", e.target.value);
                }}
                className="w-full bg-white border-2 border-gray-300 rounded-md pl-2 pr-16 py-2 focus:outline-none"
              />
            </div>
          )}

          <div className="mb-4">
            <input
              value={formData.subject}
              onChange={(e) => handleFieldChange("subject", e.target.value)}
              onBlur={() => handleBlur("subject")}
              className={`w-full border-2 border-gray-300 rounded py-2 px-3 focus:outline-none ${
                errors.subject && touched.subject ? "border-red-500" : ""
              }`}
              placeholder="Subject"
            />
            {errors.subject && touched.subject && (
              <span className="text-red-500 text-sm">{errors.subject}</span>
            )}
          </div>

          <div className="mb-4">
            <input
              value={formData.email}
              onChange={(e) => handleFieldChange("email", e.target.value)}
              onBlur={() => handleBlur("email")}
              className={`w-full border-2 border-gray-300 rounded py-2 px-3 focus:outline-none ${
                errors.email && touched.email ? "border-red-500" : ""
              }`}
              placeholder="Email"
            />
            {errors.email && touched.email && (
              <span className="text-red-500 text-sm">{errors.email}</span>
            )}
          </div>

          <div className="mb-4 relative">
            <select
              value={formData.country}
              onChange={(e) => handleCountryChange(e.target.value)}
              onBlur={() => handleBlur("country")}
              className="w-full border-2 border-gray-300 rounded py-2 px-3 focus:outline-none bg-white"
            >
              <option value="">Select Country</option>
              {sortedCountries.map((country) => (
                <option key={country.name} value={country.name}>
                  {country.name}
                </option>
              ))}
            </select>
            {/* <RiArrowDropDownFill className="absolute right-2 top-3" size={34} /> */}
          </div>

          <div className="mb-4 flex">
            <div className="flex items-center bg-gray-100 px-2 rounded-l-md border-2 border-gray-300">
              {selectedCode}
            </div>
            <input
              value={formData.phone}
              onChange={(e) => {
                if (/^[0-9]*$/.test(e.target.value) && e.target.value.length <= 10) {
                  handleFieldChange("phone", e.target.value);
                }
              }}
              onBlur={() => handleBlur("phone")}
              className={`w-full border-2 border-gray-300 rounded-r-md py-2 px-3 focus:outline-none ${
                errors.phone && touched.phone ? "border-red-500" : ""
              }`}
              placeholder="Phone Number"
            />
          </div>
          {errors.phone && touched.phone && (
            <div className="col-span-2 -mt-4">
              <span className="text-red-500 text-sm">{errors.phone}</span>
            </div>
          )}
        </div>

        <div className="mb-4">
          <textarea
            value={formData.message}
            onChange={(e) => handleFieldChange("message", e.target.value)}
            onBlur={() => handleBlur("message")}
            className={`w-full border-2 border-gray-300 rounded py-2 px-3 focus:outline-none ${
              errors.message && touched.message ? "border-red-500" : ""
            }`}
            rows={5}
            placeholder="Your Message"
          ></textarea>
          {errors.message && touched.message && (
            <span className="text-red-500 text-sm">{errors.message}</span>
          )}
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-white rounded-md px-6 py-2 w-full hover:bg-blue-600"
        >
          Submit
        </button>
      </form>

      {isModalVisible && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl p-8 w-96 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-500">
              <svg 
                className="h-8 w-8 text-white"
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth="2" 
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-bold mb-3">Request Submitted! 🎉</h1>
            <p className="text-gray-500 mb-6">
              We've received your request and will get back to you within 24 hours.
            </p>
            <button
              onClick={handleOk}
              className="w-full px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600"
            >
              Got It!
            </button>
          </div>
        </div>
      )}
    </>
  );
};
