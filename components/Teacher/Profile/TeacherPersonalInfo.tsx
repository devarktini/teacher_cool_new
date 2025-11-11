'use client';

import React, { useEffect, useState, ChangeEvent, FormEvent } from "react";
import {
  FiEdit,
  FiX,
  FiCheck,
  FiUpload,
  FiInfo,
} from "react-icons/fi";
import { motion } from "framer-motion";
import {
  AcademicCapIcon,
  CurrencyRupeeIcon,
  BookOpenIcon,
  ClockIcon,
  BriefcaseIcon,
  IdentificationIcon,
  DocumentTextIcon,
  DocumentCheckIcon,
  DocumentChartBarIcon,
  ArrowTopRightOnSquareIcon,
} from "@heroicons/react/24/outline";
import { useDispatch, useSelector } from "react-redux";
import { selectAuth } from "@/store/features/authSlice";
import TeacherApiService from "@/services/teacherApi";
import toast from "react-hot-toast";

// =======================
// Types
// =======================
interface TeacherDetails {
  id?: number;
  qualification?: string;
  exp_income?: string;
  subject?: string;
  avail_hours?: string;
  experience?: string;
  pan_card?: string;
  specialization?: string;
  category?: string;
  id_proof?: string;
  education_copy?: string;
  experience_letter?: string;
  is_approved?: boolean;
}

// Build FormDataState by taking TeacherDetails (except docs) and overriding doc fields
type FormDataState = Omit<TeacherDetails, 'id_proof' | 'education_copy' | 'experience_letter'> & {
  id_proof: File | string | null;
  education_copy: File | string | null;
  experience_letter: File | string | null;
};



// =======================
// Component
// =======================
const TeacherPersonalInfo: React.FC = () => {

  const auth = useSelector(selectAuth);
  const user = auth?.user;
  const [details, setDetails] = useState<TeacherDetails | null>(null);
  const [formData, setFormData] = useState<FormDataState>({
    qualification: "",
    exp_income: "",
    subject: "",
    avail_hours: "",
    experience: "",
    pan_card: "",
    specialization: "",
    category: "",
    id_proof: null,
    education_copy: null,
    experience_letter: null,
    is_approved: false,
  });

  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"personal" | "documents">("personal");
  const [saving, setSaving] = useState(false);

  // Fetch teacher details
  const getDetails = async () => {
    try {
      if (!user?.id) return;
      const res = await TeacherApiService.fetchTeacherDetails(user.id);
      // console.log("getDetaisl", res)
      if (res?.data) {
        setDetails(res.data);
      }
    } catch (error) {
      console.error("Error fetching teacher details:", error);
    }
  };

  useEffect(() => {
    getDetails();
  }, []);

  // Handle input change
  // Handle input change
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const target = e.target as HTMLInputElement;
    const { name, value, type, checked, files } = target;

    let inputValue: string | boolean | File | null = value;

    if (type === "checkbox") inputValue = checked;
    if (type === "file") inputValue = files && files.length ? files[0] : null;

    // fix exp_income typing restriction
    if (name === "exp_income") {
      inputValue = value.replace(/\D/g, ""); // allow only digits
    }

    setFormData((prev) => ({ ...prev, [name]: inputValue }));
  };


  // Handle submit
  // Handle submit
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const teacherId = user?.teacher_details?.id;

    if (!teacherId) {
      toast.error("Teacher ID not found");
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append("user", String(user.id));

    // Only append values that changed or have valid data
    Object.entries(formData).forEach(([key, value]) => {
      if (value === undefined || value === null) return;

      // only include File objects (new uploads)
      if (value instanceof File) {
        formDataToSend.append(key, value);
      } else if (typeof value === "boolean") {
        formDataToSend.append(key, value ? "true" : "false");
      } else if (
        key !== "id_proof" &&
        key !== "education_copy" &&
        key !== "experience_letter"
      ) {
        // exclude doc URLs if not replaced
        formDataToSend.append(key, String(value));
      }
    });

    try {
      setSaving(true);
      const res = await TeacherApiService.updatetDetails(teacherId, formDataToSend);

      if (res?.data?.errors) {
        toast.error("Please check document upload fields");
      } else {
        toast.success("Details updated successfully!");
        await getDetails();
        setIsPopupOpen(false);
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    } finally {
      setSaving(false);
    }
  };


  const handleUpdateClick = () => {
    if (details) {
      // Map details into formData while keeping doc fields null (so user can re-upload)
      setFormData((prev) => ({
        ...prev,
        qualification: details.qualification ?? "",
        exp_income: details.exp_income ?? "",
        subject: details.subject ?? "",
        avail_hours: details.avail_hours ?? "",
        experience: details.experience ?? "",
        pan_card: details.pan_card ?? "",
        specialization: details.specialization ?? "",
        category: details.category ?? "",
        // show existing URLs in details but keep file inputs null by default
        id_proof: details.id_proof ?? null,
        education_copy: details.education_copy ?? null,
        experience_letter: details.experience_letter ?? null,
        is_approved: details.is_approved ?? false,
      }));
    }
    setIsPopupOpen(true);
  };

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <div>
      {/* Info Display */}
      <motion.div
        className="bg-white rounded-xl shadow-md p-6"
        initial="hidden"
        animate="visible"
        variants={fadeIn}
      >
        {/* Header */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-3 mb-6">
          <div className="flex items-center gap-3">
            <FiInfo className="text-2xl text-blue-600" />
            <h3 className="text-xl font-bold text-gray-800">Your Information</h3>
          </div>
          <button
            onClick={handleUpdateClick}
            className="flex items-center gap-2 border-2 border-blue-500 text-blue-500 px-4 py-2 rounded-lg shadow-md hover:bg-blue-50 transition-all duration-300"
          >
            <FiEdit className="text-lg" /> Update Details
          </button>
        </div>

        {/* Professional Details */}
        <section className="space-y-5">
          <h2 className="text-lg font-semibold text-gray-700">Professional Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { label: "Qualification", value: details?.qualification, icon: <AcademicCapIcon className="w-5 h-5 text-purple-500" /> },
              { label: "Expected Income", value: details?.exp_income, icon: <CurrencyRupeeIcon className="w-5 h-5 text-green-500" /> },
              { label: "Subject", value: details?.subject, icon: <BookOpenIcon className="w-5 h-5 text-blue-500" /> },
              { label: "Available Hours", value: details?.avail_hours, icon: <ClockIcon className="w-5 h-5 text-orange-500" /> },
              { label: "Experience", value: details?.experience, icon: <BriefcaseIcon className="w-5 h-5 text-red-500" /> },
              { label: "PAN Card", value: details?.pan_card, icon: <IdentificationIcon className="w-5 h-5 text-teal-500" /> },
            ].map((item, index) => (
              <motion.div
                key={index}
                className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md border-l-4 border-blue-200"
                variants={fadeIn}
              >
                <div className="flex items-start gap-3">
                  <div>{item.icon}</div>
                  <div>
                    <h3 className="text-xs font-medium text-gray-500 uppercase">{item.label}</h3>
                    <p className="text-gray-800 font-medium mt-1">
                      {item.value ? (
                        item.label.includes("Income")
                          ? `₹${item.value}`
                          : item.label.includes("Experience")
                            ? `${item.value} years`
                            : item.value
                      ) : (
                        <span className="text-gray-400">Not provided</span>
                      )}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Document Status */}
        <section className="space-y-5 mt-8">
          <h2 className="text-lg font-semibold text-gray-700">Document Status</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { label: "ID Proof", value: details?.id_proof, icon: <DocumentTextIcon className="w-5 h-5 text-indigo-500" /> },
              { label: "Education Certificate", value: details?.education_copy, icon: <DocumentCheckIcon className="w-5 h-5 text-green-500" /> },
              { label: "Experience Certificate", value: details?.experience_letter, icon: <DocumentChartBarIcon className="w-5 h-5 text-yellow-500" /> },
            ].map((doc, index) => {
              const hasDocument = Boolean(doc.value);
              return (
                <motion.div
                  key={index}
                  className={`bg-white rounded-xl p-4 shadow-sm hover:shadow-md border-l-4 ${hasDocument ? "border-green-200" : "border-gray-200"
                    }`}
                  variants={fadeIn}
                >
                  <div className="flex items-start gap-3">
                    {doc.icon}
                    <div className="flex-1">
                      <h3 className="text-xs font-medium text-gray-500 uppercase">{doc.label}</h3>
                      <div className="flex items-center justify-between mt-1">
                        <span className={hasDocument ? "text-green-600 text-sm" : "text-gray-400 text-sm"}>
                          {hasDocument ? "Uploaded" : "Not uploaded"}
                        </span>
                        {hasDocument && (
                          <a
                            href={String(doc.value)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1"
                          >
                            <ArrowTopRightOnSquareIcon className="w-4 h-4" /> View
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* Approval Status */}
        <motion.div
          className={`mt-6 p-4 rounded-lg ${user?.teacher_details?.is_approved || formData.is_approved ? "bg-blue-50 border border-blue-200" : "bg-yellow-50 border border-yellow-200"
            }`}
          variants={fadeIn}
        >
          <div className="flex items-center gap-3">
            {user?.teacher_details?.is_approved || formData.is_approved ? (
              <FiCheck className="text-xl text-blue-600" />
            ) : (
              <FiInfo className="text-xl text-yellow-600" />
            )}
            <p className={user?.teacher_details?.is_approved || formData.is_approved ? "text-blue-700" : "text-yellow-700"}>
              {user?.teacher_details?.is_approved || formData.is_approved
                ? "Your profile has been approved and is visible to students."
                : "Your profile is pending approval. Complete all details for faster verification."}
            </p>
          </div>
        </motion.div>
      </motion.div>

      {/* Popup */}
      {isPopupOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl h-[90vh] flex flex-col overflow-hidden">
            {/* Header */}
            <div className="flex justify-between items-center border-b p-4">
              <h3 className="text-xl font-bold text-gray-800">Update Your Information</h3>
              <button onClick={() => setIsPopupOpen(false)} className="text-gray-500 hover:text-gray-700">
                <FiX className="text-2xl" />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b">
              {["personal", "documents"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab as "personal" | "documents")}
                  className={`px-6 py-3 font-medium ${activeTab === tab ? "text-indigo-600 border-b-2 border-indigo-600" : "text-gray-500 hover:text-gray-700"
                    }`}
                >
                  {tab === "personal" ? "Personal Info" : "Documents"}
                </button>
              ))}
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex-1 overflow-auto p-6 space-y-6">
              {activeTab === "personal" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Qualification
                    </label>
                    <select
                      name="qualification"
                      value={formData.qualification}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border rounded-lg"
                    >
                      <option value="">Select Qualification</option>
                      <option value="post_graduate">Post Graduate</option>
                      <option value="graduate">Graduate</option>
                      <option value="other">Others</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Expected Income (₹)
                    </label>
                    <input
                      type="number"
                      name="exp_income"
                      value={formData.exp_income || ""}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border rounded-lg"
                      placeholder="e.g. 50000"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Subject
                    </label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border rounded-lg"
                      placeholder="e.g. Mathematics"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Available Hours
                    </label>
                    <select
                      name="avail_hours"
                      value={formData.avail_hours}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border rounded-lg"
                    >
                      <option value="">Select Hours</option>
                      <option value="1-2">1-2 hours</option>
                      <option value="2-3">2-3 hours</option>
                      <option value="3-4">3-4 hours</option>
                      <option value="4-5">4-5 hours</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Experience
                    </label>
                    <select
                      name="experience"
                      value={formData.experience}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border rounded-lg"
                    >
                      <option value="">Select Experience</option>
                      <option value="1-2">1-2 years</option>
                      <option value="2-3">2-3 years</option>
                      <option value="3-4">3-4 years</option>
                      <option value="4-5">4-5 years</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      PAN Card
                    </label>
                    <input
                      type="text"
                      name="pan_card"
                      value={formData.pan_card}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border rounded-lg"
                      placeholder="ABCDE1234F"
                    />
                  </div>
                </div>
              )}

              {activeTab === "documents" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    { name: "id_proof", label: "ID Proof", existing: details?.id_proof },
                    { name: "education_copy", label: "Education Certificate", existing: details?.education_copy },
                    { name: "experience_letter", label: "Experience Letter", existing: details?.experience_letter },
                  ].map((doc, index) => (
                    <div key={index}>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {doc.label}
                      </label>
                      <div className="flex items-center gap-4">
                        <label className="flex-1 cursor-pointer">
                          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-indigo-500 transition">
                            <FiUpload className="mx-auto text-2xl text-indigo-500 mb-2" />
                            <p className="text-sm text-gray-600">Click to upload</p>
                            <input
                              type="file"
                              name={doc.name}
                              onChange={handleChange}
                              className="hidden"
                              accept=".png,.jpg,.jpeg,.pdf"
                              required={!doc.existing}
                            />
                          </div>
                        </label>
                        {formData[doc.name as keyof FormDataState] && (
                          <span className="text-sm text-green-600 flex items-center gap-1">
                            <FiCheck /> Selected
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Footer */}
              <div className="flex justify-end border-t pt-4">
                <button
                  type="button"
                  onClick={() => setIsPopupOpen(false)}
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  disabled={saving}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="ml-3 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center gap-2"
                  disabled={saving}
                >
                  <FiCheck /> {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherPersonalInfo;
