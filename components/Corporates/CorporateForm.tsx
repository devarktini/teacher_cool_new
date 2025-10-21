'use client'
import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import tickIcon from '@/public/images/university/tick.png'
import logo from '@/public/images/Logo.png'
import axios from 'axios'

function CorporateForm() {
     const [formValue, setFormValue] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    institutionType: "",
    institutionName: "",
    jobRole: "",
    department: "",
    country: "",
    needs: "",

  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e:any) => {
    const { name, value } = e.target;

    // console.log(formValue)
    setFormValue({ ...formValue, [name]: value });

  };

  const handleSubmit = async (e:any) => {
    e.preventDefault();
    setLoading(true)
    await sendFormData()
    setSuccess(true);
    setFormValue(
      {
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        institutionType: "",
        institutionName: "",
        jobRole: "",
        department: "",
        country: "",
        needs: "",
      }
    )
  };
  const sendFormData = async () => {
    const formData = new FormData();
    formData.append("first_name", formValue.firstName)
    formData.append("last_name", formValue.lastName)
    formData.append("business_email", formValue.email)
    formData.append("contact_number", formValue.phone)
    formData.append("instution_type", formValue.institutionType)
    formData.append("institution_name", formValue.institutionName)
    formData.append("job_role", formValue.jobRole)
    formData.append("department", formValue.department)
    formData.append("country", formValue.country)
    formData.append("message", formValue.needs)

    try {
      const res = await axios.post(
        `${process.env.REACT_APP_BASEURL}lms/proposal-request/`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            accept: "application/json",
          },
        }
      );
      // console.log("Proposal request sent successfully!");
      // toast.success("Proposal request sent successfully!");
    } catch (err) {
      console.error("Error:", err);
      // toast.error("Something went wrong!");
    } finally {
      setLoading(false);
    }
  }


  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        setSuccess(false);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [success]);
    return (
        <>
            {success && (
                <div className="fixed inset-0 flex items-start justify-center z-50">
                    <div className="toast mt-6 p-4 bg-green-100 border border-green-500 rounded-lg shadow-lg text-green-700 max-w-xs">
                        <div className="flex items-center justify-between">
                            <span>Data submitted successfully!</span>
                            <button
                                onClick={() => setSuccess(false)}
                                className="ml-4 text-green-700 hover:text-green-900 focus:outline-none"
                            >
                                ✕
                            </button>
                        </div>
                    </div>
                </div>
            )}
            <div className='flex bg-[#F5F5F5] py-10 items-center justify-center w-full'>
                <div className="flex flex-col md:flex-row  mx-auto px-4 md:px-0">
                    {/* Left Content Section */}
                    <div className="flex flex-col gap-3 md:w-1/2 px-2 md:px-0">
                        <div className="w-full flex justify-center md:justify-start">
                            <Image src={logo} alt="TeacherCool Logo" className="w-32 md:w-40" />
                        </div>
                        <h1 className='text-xl md:text-3xl font-bold mt-2 text-center md:text-left tracking-wide'>
                            How TeacherCool Powers High-Impact Skill Development
                        </h1>
                        <p className='text-sm md:text-base text-center md:text-left tracking-wide'>
                            At Teachercool, we believe in the transformative power of learning. Our platform is designed to help learners and organizations unlock their full potential through high-impact, hands-on skill development. Here’s how we make it happen:
                        </p>
                        <div className=' grid xl:grid-cols-2 lg:grid-cols-2 grid-cols-1'>
                            {[
                                { title: "Expert-Led Courses for Real-World Impact", text: "Our courses are created by industry leaders and experts, ensuring that learners gain relevant, up-to-date knowledge and practical skills. From technical expertise to soft skills, our expertly crafted curriculum is designed to deliver immediate value, whether you're advancing your career or building a high-performing team." },
                                { title: "Personalized Learning Journeys", text: "Every learner is unique, and we tailor the learning experience to meet your specific goals. Our adaptive platform tracks progress, provides personalized recommendations, and allows you to take ownership of your learning path—empowering you to grow at your own pace." },
                                { title: "Interactive, Engaging Content", text: "We understand that engagement drives results. That’s why we integrate dynamic multimedia, simulations, case studies, and real-world scenarios into our courses. With interactive tools like quizzes, hands-on projects, and group activities, learning is both effective and enjoyable." },
                                { title: "Continuous Support & Feedback", text: "Learning is an ongoing process, and we’re here to support you every step of the way. With access to expert instructors, peer collaboration, and real-time feedback, you’ll have the guidance and resources needed to overcome challenges and achieve mastery." },
                                { title: "Measurable Results", text: "TeacherCool’s platform includes advanced analytics to track your progress and demonstrate the skills you've acquired. For organizations, we provide powerful reporting tools to measure skill development, improve team performance, and ensure a return on your investment in learning." }
                            ].map((item, index) => (
                                <div key={index} className="flex flex-col items-center md:items-start gap-1 mt-2">
                                    <div className='flex items-center gap-2'>
                                        <Image src={tickIcon} alt="Checkmark" className="w-4 h-4 md:w-5 md:h-5" />
                                        <b className="text-sm md:text-base">{item.title}</b>
                                    </div>
                                    <p className='ml-6 md:ml-7 text-xs md:text-sm leading-snug max-w-full md:max-w-lg text-justify'>
                                        {item.text}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Form Section */}
                    <div className='w-full md:w-1/2 lg:w-[34rem] mx-auto'>
                        <form className=' xl:ml-4 mt-6 xl:mt-0 ml-0 p-4 rounded-lg bg-white border-2 shadow-md' onSubmit={handleSubmit}>
                            <div className='lg:grid lg:grid-cols-2'>
                                <input type='text' placeholder='First Name' name='firstName' className='w-full md:w-[95%] mx-auto border rounded-md border-black my-3 py-3 pl-4 placeholder-black' onChange={handleChange} />
                                <input type='text' placeholder='Last Name' name='lastName' className='w-full md:w-[95%] mx-auto border rounded-md border-black my-3 py-3 pl-4 placeholder-black' onChange={handleChange} />
                                <input type='email' placeholder='Email' name='email' className='w-full md:w-[95%] mx-auto border rounded-md border-black my-3 py-3 pl-4 placeholder-black' onChange={handleChange} />
                                <input type='text' placeholder='Phone Number' name='phone' className='w-full md:w-[95%] mx-auto border rounded-md border-black my-3 py-3 pl-4 placeholder-black' onChange={handleChange} />
                                <input type='text' placeholder='Institution Type' name='institutionType' className='w-full md:w-[95%] mx-auto border rounded-md border-black my-3 py-3 pl-4 placeholder-black' onChange={handleChange} />
                                <input type='text' placeholder='Institution Name' name='institutionName' className='w-full md:w-[95%] mx-auto border rounded-md border-black my-3 py-3 pl-4 placeholder-black' onChange={handleChange} />
                                <input type='text' placeholder='Job Role' name='jobRole' className='w-full md:w-[95%] mx-auto border rounded-md border-black my-3 py-3 pl-4 placeholder-black' onChange={handleChange} />
                                <input type='text' placeholder='Department' name='department' className='w-full md:w-[95%] mx-auto border rounded-md border-black my-3 py-3 pl-4 placeholder-black' onChange={handleChange} />
                            </div>

                            <div className='flex flex-col'>
                                <input type='text' placeholder='Country' name='country' className='w-full md:w-[95%] mx-auto border rounded-md border-black my-3 py-3 pl-4 placeholder-black' onChange={handleChange} />
                                <textarea placeholder='Which best describes your needs?' rows={6} name='needs' className='w-full md:w-[95%] mx-auto border rounded-md border-black my-2 py-3 pl-4 placeholder-black resize-none' onChange={handleChange} />
                            </div>

                            <p className='w-full my-3 mx-auto text-justify tracking-tight leading-relaxed text-xs md:text-sm'>
                                By submitting your info in the form above, you agree to our
                                <Link href="/terms"  className="no-underline" ><span className='text-[#0966ED] ml-1 '>Terms of Use</span> </Link>  and
                                <Link href="/policy"  className="no-underline" ><span className='text-[#0966ED] ml-1 '>Privacy Notice</span></Link>. We may use this info to contact you and/or use data from third parties to personalize your experience.
                            </p>

                            <button className='w-full bg-[#0966ED] text-white mt-3 py-2 rounded-sm focus:outline-none'>
                                {loading ? 'Submitting...' : 'Submit'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}

export default CorporateForm
