'use client'
import { useState } from "react";
import toast from 'react-hot-toast';
import axios from "axios";
import Image from "next/image";

import pic166 from "@/public/images/image166.png";
import pic167 from "@/public/images/image167.png";
import pic168 from "@/public/images/image168.png";
import logo from "@/public/images/Logo.png";

import arc from "@/public/images/Ellipse4.png";
import aboutImg from "@/public/images/aboutImg.jpg";

export default function AboutClient() {
    const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    businessEmail: "",
    contactNumber: "",
    servicesLookingFor: "",
    companyName: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  // const [success, setSuccess] = useState(false);

  // const dispatch = useDispatch();
  const handleChange = (e:any) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e:any) => {
    e.preventDefault();
    setLoading(true);

    await sendProposalRequest();
    // setSuccess(true);
    setFormData({
      firstName: "",
      lastName: "",
      businessEmail: "",
      contactNumber: "",
      servicesLookingFor: "",
      companyName: "",
      message: "",
    });
  };
  async function sendProposalRequest() {
    const formBody = new FormData();
    formBody.append("first_name", formData.firstName);
    formBody.append("last_name", formData.lastName);
    formBody.append("business_email", formData.businessEmail);
    formBody.append("contact_number", formData.contactNumber);
    formBody.append("services_looking_for", formData.servicesLookingFor);
    formBody.append("company_name", formData.companyName);
    formBody.append("message", formData.message);
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}lms/proposal-request/`,
        formBody,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            accept: "application/json",
          },
        }
      );
      toast.success("Proposal request sent successfully!");
    } catch (err) {
      toast.error("Something went wrong!");
    } finally {
      setLoading(false);
    }
  }
  return (
    <>
      {/* section 1  */}
      <div className="flex flex-col items-center justify-center h-[46vh] w-full relative">
        {/* Video Section */}
        <div className="flex justify-center items-center h-full w-full">
          <video
            className="w-full h-full object-cover"
            autoPlay
            loop
            muted
            controls={false}
          >
            <source src="/videos/lmsv2.mp4" type="video/mp4" />
          </video>
        </div>

        {/* Text Section */}
        <div className="absolute inset-0 flex justify-center overflow-hidden items-center text-center text-white bg-black bg-opacity-40 h-full">
          <h3 className="text-sm overflow-hidden md:text-2xl p-10 md:p-20 font-serif leading-relaxed">
            "We believe that learning is the catalyst for human advancement. It
            holds the power to transform our world—from despair to hope, from
            inequality to opportunity, from division to unity. Learning can
            change our lives for the better, enriching our own journeys,
            uplifting our families, and strengthening our communities."
          </h3>
        </div>
      </div>

      {/* section 2  */}

      <div>
        <section className="bg-[#1771f7] py-16">
         
          <div className="text-center text-white px-4">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">We Believe</h1>
            <p className="text-lg md:text-2xl lg:w-[80%] xl:text-left text-justify font-Roboto mx-auto mb-12">
              Learning is the source of human progress. It has the power to
              transform our world from illness to health, from poverty to
              prosperity, from conflict to peace. It has the power to transform
              our lives for ourselves, for our families, for our communities. No
              matter who we are or where we are, learning empowers us to change
              and grow and redefine what's possible. That's why access to the
              best learning is a right, not a privilege. At TeacherCool, we
              envision a future where learning is not confined by physical
              boundaries. We strive to be the catalyst for a global community of
              learners, breaking down barriers and fostering a culture of
              continuous growth and development. Our vision is to create a
              platform that transcends traditional education, offering a diverse
              range of IT courses that cater to learners of all levels, from
              beginners to seasoned professionals.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3 px-4 lg:px-24">
            {/* Vision Card */}
            <div className="bg-white p-6 lg:w-[23rem] rounded-xl shadow-md text-black transition-transform duration-500 ease-in-out card-animation">
              <div className="flex items-center justify-center mb-4">
                <span className="text-2xl">
                  <Image src={logo} alt="loading" />
                </span>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-center"> Vision</h3>
              <p className=" xl:text-left text-justify mb-6 " style={{ wordSpacing: '-0.05em', hyphens: 'auto' }}>
                We believe that learning is the catalyst for human advancement.
                It holds the power to transform our world—from despair to hope,
                from inequality to opportunity, from division to unity. Learning
                can change our lives for the better, enriching our own journeys,
                uplifting our families, and strengthening our communities.
              </p>
            </div>

            {/* Mission Card */}
            <div className="bg-white p-6 lg:w-[23rem] rounded-xl shadow-md transition-transform duration-500 ease-in-out card-animation">
              <div className="flex items-center justify-center mb-4">
                <span className="text-2xl">
                  <Image src={logo} alt="loading" />
                </span>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-center"> Mission</h3>
              <p className=" xl:text-left text-justify mb-6 " style={{ wordSpacing: '-0.05em', hyphens: 'auto' }}>
                TeacherCool platform collaborates with a diverse network of top universities
                and industry leaders to deliver flexible, accessible, and relevant online
                learning experiences for individuals and organizations globally. We provide a
                variety of educational opportunities, including hands-on projects,
                comprehensive courses, job-ready certifications, and degree programs designed
                to empower learners to achieve their professional goals.
              </p>

            </div>

            {/* Values Card */}
            <div className="bg-white p-6 lg:w-[23rem] rounded-xl shadow-md transition-transform duration-500 ease-in-out card-animation">
              <div className="flex items-center justify-center mb-4">
                <span className="text-2xl">
                  <Image src={logo} alt="loading" />
                </span>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-center"> Values</h3>
              <p className=" xl:text-left text-justify mb-6 " style={{ wordSpacing: '-0.05em', hyphens: 'auto' }}>
                Regardless of our backgrounds or locations, education serves as
                a powerful catalyst for transformation and growth. It enables us
                to explore new horizons and unlock our potential. This is why
                everyone deserves access to quality learning opportunities—it's
                a fundamental right.
              </p>
            </div>
          </div>
        </section>
      </div>

      {/* section 3  */}

      <div className="bg-white py-12 px-6 sm:px-12 md:px-24 lg:px-36 relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          {/* Title Section */}
          <h2 className="text-xl text-blue-600 font-bold mb-4">WHO WE ARE</h2>
          <h1 className="text-4xl font-bold text-gray-800 mb-6">Our story</h1>

          {/* Content Section */}
          <div className="md:flex">
            <div className="md:w-1/2">
              <p className="text-gray-600 xl:text-left text-justify mb-4">
                Founded in 2016 by Proprietor Ambrish Anand, TeacherCool emerged
                from a desire to make transformative education accessible to
                learners around the globe. Today, we are a leading online
                platform for education and career growth, enabling anyone,
                anywhere, to explore courses and programs. We strive to create a
                positive impact on society by breaking down barriers to
                high-quality education for all.
              </p>
              <p className="text-gray-600 font-semibold">
                With a community of over 100 million learners and collaborations
                with more than 2000 institutions, businesses, and governments,
                TeacherCool provides the opportunity for world-class
                learning—whenever and wherever you need it.
              </p>
            </div>

            {/* Image Section */}
            {/* <div className="md:w-1/2 md:flex md:justify-between md:ml-8 mt-8 md:mt-0"> */}
            <div className="md:w-1/2 flex justify-between md:ml-8 mt-8 md:mt-0">
              <div className="flex flex-col space-y-4">
                <Image
                  src={pic168}
                  alt="Image 1"
                  className="rounded-lg shadow-lg w-[12rem] md:w-full"
                />
                <Image
                  src={pic167}
                  alt="Image 2"
                  className="rounded-lg shadow-lg w-[10rem] md:w-full"
                />
              </div>
              <div className="flex justify-center mt-4 md:mt-7 ml-5 md:h-[22rem] ">
                <Image
                  src={pic166}
                  alt="Image 3"
                  className="rounded-lg shadow-lg w-[12rem] h-[12rem] md:w-full md:h-full "
                />
              </div>
            </div>
          </div>
        </div>

        {/* arc  */}
        <div className="hidden md:block -rotate-[205deg] w-fit h-fit absolute top-[32rem] left-4">
          <Image src={arc} alt="loading" className="w-fit h-[10rem]" />
        </div>
      </div>

      {/* section 4  */}

      <div className="bg-gradient-to-r from-blue-900 to-blue-600 text-center py-16  ">
        <h2 className="text-white text-xl sm:text-2xl lg:text-3xl font-semibold mb-6">
          Join our global community and start learning today!
        </h2>
        <button
          // onClick={() => dispatch(changeShowLogin(true))}
          className="border border-white text-white py-2 px-6 rounded-full hover:bg-white hover:text-blue-600 transition duration-300"
        >
          Join now
        </button>
      </div>

      {/* contact us  */}

      {/* <div className="min-h-screen bg-cover bg-center flex items-center justify-center" style={{ backgroundImage: 'url(/path-to-your-background-image)' }}> */}
      <div className="min-h-screen bg-cover bg-center flex items-center justify-center bg-gradient-to-r from-white to-black">
        <div className="container mx-auto px-6 lg:px-12 flex flex-col lg:flex-row items-center">
          {/* Left side (Image) */}
          <div className="w-full lg:w-[70rem] flex justify-center mb-8 lg:mb-0">
            <Image
              src={aboutImg}
              alt="Old Phone"
              className="object-contain w-[70rem] h-[30rem]"
            />
          </div>

          {/* Right side (Form) */}
          <div className="w-full lg:w-1/2 bg-transparent text-white">
            <h2 className="text-4xl font-bold text-orange-600 mb-8">
              Request for a Proposal
            </h2>
            <form
              className="grid grid-cols-1 lg:grid-cols-2 gap-6"
              onSubmit={handleSubmit}
            >
              {/* First Name */}
              <div>
                <label className="block text-sm mb-2">First Name *</label>
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
                  className="w-full p-2 border bg-transparent border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-600"
                  required
                />
              </div>

              {/* Last Name */}
              <div>
                <label className="block text-sm mb-2">Last Name *</label>
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
                  className="w-full p-2 border bg-transparent border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-600"
                  required
                />
              </div>

              {/* Business Email */}
              <div>
                <label className="block text-sm mb-2">Business Email *</label>
                <input
                  type="email"
                  name="businessEmail"
                  value={formData.businessEmail}
                  onChange={handleChange}
                  className="w-full p-2 border bg-transparent border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-600"
                  required
                />
              </div>

              {/* Contact Number */}
              <div>
                <label className="block text-sm mb-2">Contact Number *</label>
                <input
                  type="tel"
                  name="contactNumber"
                  value={formData.contactNumber}
                  onChange={handleChange}
                  className="w-full p-2 border bg-transparent border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-600"
                  required
                />
              </div>

              {/* Services Looking for */}
              <div>
                <label className="block text-sm mb-2">
                  Services Looking for *
                </label>
                <select
                  name="servicesLookingFor"
                  value={formData.servicesLookingFor}
                  onChange={handleChange}
                  className="w-full p-2 border bg-transparent border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-600"
                  required
                >
                  <option value="" className="text-black">
                    Select
                  </option>
                  <option value="Service 1 " className="text-black">
                    For Indivdual
                  </option>
                  <option value="Service 2" className="text-black">
                    For University
                  </option>
                  <option value="Service 2" className="text-black">
                    For Corporate
                  </option>
                </select>
              </div>

              {/* Company Name */}
              <div>
                <label className="block text-sm mb-2">Company Name</label>
                <input
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  className="w-full p-2 border bg-transparent border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-600"
                />
              </div>

              {/* Message */}
              <div className="col-span-1 lg:col-span-2">
                <label className="block text-sm mb-2">Message</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full p-2 border resize-none bg-transparent border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-600"
                  // rows="4"
                ></textarea>
              </div>

              {/* Submit Button */}
              <div className="col-span-1 lg:col-span-2 text-center py-2">
                <button
                  type="submit"
                  // className="bg-orange-600 text-white px-6 py-2 rounded-md hover:bg-orange-700 transition-all"
                  className={`bg-orange-600 text-white px-6 py-2 rounded-md transition-all ${loading ? "bg-orange-400" : "hover:bg-orange-700"
                    }`}
                  disabled={loading}
                >
                  {loading ? "Submitting..." : "Submit"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

     
    </>
  )
}
