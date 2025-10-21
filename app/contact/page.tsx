'use client'
import { useState } from 'react'
import axios from 'axios'
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaXTwitter } from 'react-icons/fa6';

export default function ContactPage() {
    const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    businessEmail: "",
    contactNumber: "",
    servicesLookingFor: "",
    companyName: "",
    message: "",
  });

  const handleChange = (e:any) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e:any) => {
    e.preventDefault();
    await sendProposalRequest();
  };

  async function sendProposalRequest() {
    // Create a FormData object to store our form fields
    const formDatas = new FormData();
    formDatas.append("first_name", formData.firstName);
    formDatas.append("last_name", formData.lastName);
    formDatas.append("business_email", formData.businessEmail);
    formDatas.append("contact_number", formData.contactNumber);
    formDatas.append("services_looking_for", formData.servicesLookingFor);
    formDatas.append("company_name", formData.companyName);
    formDatas.append("message", formData.message);
    await axios
      .post(
        `${process.env.NEXT_PUBLIC_API_URL}/lms/proposal-request/`,
        formDatas,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            accept: "application/json",
          },
        }
      )
      .then((res) => {
         console.log("submitted successfully!")
      })
      .catch((err) => {
        console.error("error",err)
      });
  }
  return (
     <div className="min-h-screen bg-gray-100 py-10">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800">Contact Us</h1>
          <p className="text-gray-600 mt-2">
            Have questions? We’re here to help! Reach out to us using any of the
            options below.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-12">
          {/* Contact Information Section */}
          <div className="bg-white p-8 shadow-lg rounded-lg">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Get in Touch
            </h2>
            <p className="text-gray-600 mb-4">
              We would love to hear from you. Whether you have questions about
              the platform, need support, or just want to share feedback, feel
              free to contact us!
            </p>
            <div className="text-gray-700 space-y-4">
              <div>
                <h3 className="font-semibold">Email Us</h3>
                <p>info@teachercool.com</p>
              </div>
              <div>
                <h3 className="font-semibold">Call Us</h3>
                <p>+91 8595903939</p>
              </div>
              <div>
                <h3 className="font-semibold">Visit Us</h3>
                <p>
                  B-99, Khirki Extension, Panchsheel Vihar, Sheikh Sarai Village, Malviya Nagar, New Delhi, Delhi 110017
                </p>
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="bg-white p-8 shadow-lg rounded-lg">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-700">
                  How can I reset my password?
                </h3>
                <p className="text-gray-600">
                  Click on the “Forgot Password” link on the login page and
                  follow the instructions. If you need further help, contact our
                  support team.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-700">
                  Can I get a refund?
                </h3>
                <p className="text-gray-600">
                  Refund policies are available under our “Terms and Conditions”
                  page. Please reach out if you need specific support regarding
                  refunds.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-700">
                  How can I become a certified teacher on TeacherCool?
                </h3>
                <p className="text-gray-600">
                  We offer certification programs for educators. Visit our
                  “Become a Teacher” page or contact us for more information.
                </p>
              </div>
            </div>
          </div>

          {/* Request for a Proposal Section */}
          <div className="bg-white p-8 shadow-lg rounded-lg">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Request for a Proposal
            </h2>
            <form
              className="grid grid-cols-1 lg:grid-cols-2 gap-6"
              onSubmit={handleSubmit}
            >
              {/* First Name */}
              <div>
                <label className="block text-gray-700 font-medium">
                  First Name
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (/^[a-zA-Z\s]*$/.test(value)) {
                      handleChange(e);
                    }
                  }}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  placeholder="John"
                  required
                />
              </div>

              {/* Last Name */}
              <div>
                <label className="block text-gray-700 font-medium">
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (/^[a-zA-Z\s]*$/.test(value)) {
                      handleChange(e);
                    }
                  }}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  placeholder="Doe"
                  required
                />
              </div>

              {/* Business Email */}
              <div>
                <label className="block text-gray-700 font-medium">
                  Business Email
                </label>
                <input
                  type="email"
                  name="businessEmail"
                  value={formData.businessEmail}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  placeholder="john.doe@example.com"
                  required
                />
              </div>

              {/* Contact Number */}
              <div>
                <label className="block text-gray-700 font-medium">
                  Contact Number
                </label>
                <input
                  type="tel"
                  name="contactNumber"
                  value={formData.contactNumber}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  placeholder="+1 123 456 7890"
                  required
                />
              </div>

              {/* Services Looking for */}
              <div>
                <label className="block text-gray-700 font-medium">
                  Services{" "}
                </label>
                <select
                  name="servicesLookingFor"
                  value={formData.servicesLookingFor}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  required
                >
                  <option value="">Select</option>
                  <option value="individual">For Individual</option>
                  <option value="university">For University</option>
                  <option value="corporate">For Corporate</option>
                </select>
              </div>

              {/* Company Name */}
              <div>
                <label className="block text-gray-700 font-medium">
                  Company Name
                </label>
                <input
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  placeholder="TeacherCool Inc."
                />
              </div>

              {/* Message */}
              <div className="col-span-1 lg:col-span-2">
                <label className="block text-gray-700 font-medium">
                  Message
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 resize-none"
                  
                  placeholder="Your message here..."

                ></textarea>
              </div>

              {/* Submit Button */}
              <div className="col-span-1 lg:col-span-2 text-center">
                <button
                  type="submit"
                  className="w-full py-3 px-6 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-300"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Additional Information Section */}
        <div className="bg-blue-100 p-8 rounded-lg text-center">
          <h2 className="text-2xl font-semibold text-blue-800 mb-4">
            Connect with Us
          </h2>
          <p className="text-blue-700 mb-4">
            Follow us on our social media channels and stay updated with the
            latest in online learning, courses, and educational resources.
          </p>
          <div className="flex justify-center space-x-6">
            <a
              href="https://www.facebook.com/share/1722px7Njj/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-700 hover:text-blue-800"
            >
              <FaFacebookF />
            </a>
            <a
              href="https://x.com/TeacherCoo81249"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-700 hover:text-blue-800"
            >
              <FaXTwitter />
            </a>
            <a
              href="https://www.instagram.com/teachercool_official/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-700 hover:text-blue-800"
            >
               <FaInstagram />
            </a>
            <a
              href="https://www.linkedin.com/company/teachercoolofficial/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-700 hover:text-blue-800"
            >
                  <FaLinkedinIn />
            </a>
          </div>
        </div>
      </div>
      {/* <ToastContainer /> */}
    </div>
  )
}
