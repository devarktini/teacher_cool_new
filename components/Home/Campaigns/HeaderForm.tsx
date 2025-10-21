'use client'
import axios from 'axios';
import React, { useState } from 'react';
import toast from 'react-hot-toast';

function HeaderForm({ onClose, onSuccess, isPopUp = false }: any) {
  const currentUrl = typeof window !== "undefined" ? window.location.origin + location.pathname : "";
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    last_name: "",
    phone_number: "",
    services_looking_for: "",
    message: ""
  });

  const [loading, setLoading] = useState(false);

  const sendProposalRequest = async () => {
    const formDatas = new FormData();
    formDatas.append("first_name", formData.name);
    formDatas.append("last_name", formData.last_name);
    formDatas.append("business_email", formData.email);
    formDatas.append("contact_number", formData.phone_number);
    formDatas.append("type", "campaign");
    formDatas.append("services_looking_for", formData.services_looking_for);
    formDatas.append("company_name", "company_name");
    formDatas.append("message", formData.message);
    formDatas.append("file_url", currentUrl);

    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}lms/proposal-request/`,
        formDatas,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Accept: "application/json",
          },
        }
      );

      if (res) {
        toast.success("Submitted successfully!");
        onSuccess?.();
        setFormData({
          name: "",
          email: "",
          last_name: "",
          phone_number: "",
          services_looking_for: "",
          message: "",
        });
      } else {
        throw new Error("Submission failed");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to submit. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    await sendProposalRequest();
  };

  // Form JSX
  const formContent = (
    <div className="bg-white rounded-lg p-4 lg:p-6 w-full max-w-2xl mx-auto relative">
      {isPopUp && (
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-600 hover:text-black"
        >
          ✕
        </button>
      )}
      <h3 className="text-2xl font-bold mb-6 text-center">Enroll Now</h3>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid lg:grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              First Name *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Last Name *
            </label>
            <input
              type="text"
              required
              value={formData.last_name}
              onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address *
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Services Looking*
            </label>
            <select
              required
              value={formData.services_looking_for}
              onChange={(e) => setFormData({ ...formData, services_looking_for: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="" disabled>Select a service</option>
              <option value="Individual">Individual</option>
              <option value="Corporate">Corporate</option>
              <option value="University">University</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number *
            </label>
            <input
              type="tel"
              required
              pattern="[0-9]{10}"
              value={formData.phone_number}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, '');
                setFormData({ ...formData, phone_number: value });
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Message
          </label>
          <textarea
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="w-full flex items-center justify-center">
          <button
            type="submit"
            disabled={loading}
            className="w-[40%] lg:w-[30%] mx-auto bg-blue-500 text-white py-3 rounded-md font-semibold hover:bg-blue-700 disabled:bg-blue-400"
          >
            {loading ? "Submitting..." : "Submit"}
          </button>
        </div>
      </form>
    </div>
  );

  // Conditionally render popup or inline
  if (isPopUp) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
        {formContent}
      </div>
    );
  }

  return <div className="w-full">{formContent}</div>;
}

export default HeaderForm;
