'use client'
import axios from 'axios';
import Image from 'next/image';
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import pic1 from '@/public/images/university/pic1.png'
import pic2 from '@/public/images/university/pic2.png'
import pic5 from '@/public/images/university/pic5.png'
import pic4 from '@/public/images/university/pic4.png'
import pic6 from '@/public/images/university/pic1.png'
import logo from '@/public/images/Logo.png'
import frame1 from '@/public/images/university/frame1.png'
import frame2 from '@/public/images/university/frame2.png'
import frame3 from '@/public/images/university/frame3.png'
import tick from '@/public/images/university/tick.png'
import img4 from '@/public/images/university/img4.jpg'
import img6 from '@/public/images/university/img6.jpg'


function UniversityClient() {
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

    const handleChange = (e: any) => {
        const { name, value } = e.target;

        // console.log(formValue)
        setFormValue({ ...formValue, [name]: value });

    };

    const handleSubmit = async (e: any) => {
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
                `${process.env.NEXT_PUBLIC_API_URL}lms/proposal-request/`,
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


            {/* section 1  */}
            <div className='bg-gray-100 flex items-center justify-center'>
                <div className='bg-gray-100 w-full max-w-[1600px] lg:w-[90%] flex flex-col-reverse pt-12 pb-16 lg:flex-row lg:items-start justify-between'>

                    <div className='w-full mt-5 px-3 lg:w-[50%] ' style={{ position: 'relative' }}>
                        <h1 className='font-bold text-4xl mb-5'>
                            Boost Employability to Attract More Students
                        </h1>
                        <p className="flex items-center md:text-xl gap-2 w-full my-2 text-justify leading-relaxed tracking-tight">
                            <span><Image src={tick} alt='loading' className='w-5 lg:w-4' /></span>
                            Prepare Students for Success in the Job Market
                        </p>

                        <div className='flex items-start gap-2 md:text-xl'>
                            <Image src={tick} alt='loading' className='w-5 lg:w-4 mt-2' />
                            <p>Equip them with the essential skills that are highly sought after by employers.</p>
                        </div>

                        <button className='bg-[#0966ED] text-white py-2 px-2 rounded-md my-6 focus:outline-none'>
                            <Link href="/contact" className="text-white no-underline" >Connect Us</Link>
                        </button>

                        {/* <div className='flex items-center justify-start gap-2 my-5'>
              <p>See your options,<span className='text-primary cursor-pointer'> Compare plans</span> </p>
              <Image src={arrow} alt='loading...' className='cursor-pointer' />
            </div> */}
                    </div>

                    {/* images */}
                    <div className="w-full lg:w-[45%]" style={{ position: 'relative' }}>
                        <Image src={img6} alt="loadingg..." className="w-full h-auto max-w-full" />
                    </div>
                </div>
            </div>


            {/* section 2  */}
            <div className="w-full flex items-center justify-center px-4">
                <div className="w-full max-w-[1600px] lg:w-[90%] flex flex-col-reverse pt-12 pb-16 lg:flex-row-reverse lg:items-start justify-between gap-8">


                    <div className="mt-6 ml-6 lg:w-[50%] space-y-6 text-gray-700">
                        <h1 className="font-medium xl:text-left text-left w-full md:w-[35rem] text-xl leading-tight tracking-tight text-gray-800 break-words">
                            Teacher&nbsp;Cool is designed specifically to meet the unique needs of universities, providing a comprehensive,&nbsp;flexible,&nbsp;and student-centered learning experience.
                        </h1>
                        <p>Here’s how Teachercool LMS stands out as the best solution for higher education institutions:</p>

                        <ul className="space-y-1 text-sm md:text-xl">
                            <li className='flex gap-2'><Image src={tick} alt='' className='w-4 h-4' /><span>Seamless Course Management</span> </li>
                            <li className='flex gap-2'><Image src={tick} alt='' className='w-4 h-4' /><span>Flexible Learning Options</span> </li>
                            <li className='flex gap-2'><Image src={tick} alt='' className='w-4 h-4' /><span>Advanced Analytics for Student Success</span> </li>
                            <li className='flex gap-2'><Image src={tick} alt='' className='w-4 h-4' /><span>Streamlined Communication & Collaboration</span> </li>
                            <li className='flex gap-2'><Image src={tick} alt='' className='w-4 h-4' /><span>Integrated Assessment & Feedback Tools</span></li>
                            <li className='flex gap-2'><Image src={tick} alt='' className='w-4 h-4' /><span>Mobile Accessibility for On-the-Go Learning</span> </li>
                            <li className='flex gap-2'><Image src={tick} alt='' className='w-4 h-4' /><span>Integration with University Systems</span> </li>
                            <li className='flex gap-2'><Image src={tick} alt='' className='w-4 h-4' /><span>Career-Readiness Modules</span> </li>
                            <li className='flex gap-2'><Image src={tick} alt='' className='w-4 h-4' /><span>Scalable for Large Institutions</span></li>
                            <li className='flex gap-2'><Image src={tick} alt='' className='w-4 h-4' /><span>Dedicated Support & Training</span> </li>
                        </ul>
                    </div>


                    <div className="w-full lg:w-[45%]">
                        <Image src={pic4} alt="Teachercool Platform Preview" className="w-full h-auto rounded-lg shadow-md" />
                    </div>

                </div>
            </div>

            {/* section 3  */}
            <div className='bg-gray-100 w-full flex items-center justify-center'>
                <div className='bg-gray-100 w-full max-w-[1600px] lg:w-[90%] flex flex-col gap-6 pt-12 pb-16 md:flex-row md:items-center justify-between'>

                    {/* Text content */}
                    <div className='lg:mt-5 ml-6 w-fit lg:w-[50%]' style={{ position: 'relative' }}>
                        <h2 className='text-sm my-3 font-bold w-fit'>CAREER ACADEMY</h2>
                        <h1 className='w-[20rem] text-3xl font-bold lg:w-full lg:text-4xl'>
                            Professional Development Hub
                        </h1>
                        <p className='my-1 w-full mt-4 md:text-xl text-justify tracking-tighter'>
                            Equip Your Students for High-Demand Careers
                        </p>
                        <p className='my-2 w-full text-justify tracking-tighter leading-relaxed md:text-xl'>
                            Enhance student employability through skills training from top global companies.
                        </p>

                        <div className='w-[21rem] text-sm lg:w-full lg:text-xl text-justify tracking-tighter leading-relaxed'>
                            <p>With our Professional Development Hub, your students can:</p>
                            <div>
                                <p className='flex items-center gap-2 w-full my-1 md:text-xl'>
                                    <span><Image src={tick} alt='loading' className='w-5 lg:w-4' /></span>
                                    Achieve a Professional Certificate to Become Job-Ready
                                </p>
                                <p className='flex items-center gap-2 w-full my-1 md:text-xl'>
                                    <span><Image src={tick} alt='loading' className='w-5 lg:w-4' /></span>
                                    Acquire Essential Job Skills that Employers Seek
                                </p>
                                <p className='flex items-center gap-2 w-full my-1 md:text-xl'>
                                    <span><Image src={tick} alt='loading' className='w-5 lg:w-4' /></span>
                                    Demonstrate Skill Mastery with a Comprehensive Portfolio
                                </p>
                                <p className='flex items-center gap-2 w-full my-1 md:text-xl'>
                                    <span><Image src={tick} alt='loading' className='w-5 lg:w-4' /></span>
                                    Explore Various In-Demand Positions Across Different Industries
                                </p>
                            </div>
                        </div>

                        {/* <h2 className='w-fit flex items-center gap-2 my-2 cursor-pointer text-[#0966ED]'>
              Learn about Career Academy
              <span className='w-6 mt-1'>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="#0966ED">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </span>
            </h2> */}
                    </div>

                    {/* Images */}
                    <div className='w-full lg:w-[45%]' style={{ position: 'relative' }}>
                        <Image src={pic2} alt='loadingg...' className='w-full h-auto max-w-full' />
                    </div>

                </div>
            </div>


            {/* section 4  */}

            <div className='w-full flex items-center justify-center'>
                <div className='w-full max-w-[1600px] lg:w-[90%] flex flex-col pt-12 pb-16 lg:flex-row-reverse lg:items-start justify-between'>

                    {/* Text content */}
                    <div className='mt-6 ml-6 lg:w-[50%]'>
                        <h2 className='text-sm font-bold'>PROFESSIONAL CERTIFICATES</h2>
                        <h1 className='font-medium text-3xl mt-3 mb-4'>
                            Learn more about Professional Development Hub
                        </h1>
                        <p className='lg:w-full lg:my-1 md:text-xl text-justify tracking-tighter leading-relaxed pr-5'>
                            A survey of 3,000 students and employers across 10 countries reveals that most participants recognize Professional Certificates as crucial for improving employment prospects. These certificates help students showcase their qualifications and readiness for the job market.
                        </p>
                        <p className='my-3 lg:w-full md:text-xl text-justify tracking-tighter leading-relaxed pr-4'>
                            Leverage these insights to enhance your curriculum and improve employment outcomes.
                        </p>

                    </div>

                    {/* Images */}
                    <div className='w-full lg:w-[45%]'>
                        <Image src={img4} alt='loading...' className='w-full h-auto' />
                    </div>

                </div>
            </div>


            {/* section 5  */}

            <div className='bg-gradient-to-r from-blue-600 to-blue-900 flex items-center justify-center'>
                <div className="w-full lg:w-[85%] text-white py-10 lg:flex justify-around items-start gap-5">

                    {/* Left Section */}
                    <div className='w-full text-center mb-10 lg:w-[30rem] lg:h-fit lg:mt-24'>
                        <h1 className='text-[2.4rem] mb-7 leading-tight'>
                            Broaden Your Curriculum and Support Your Faculty
                        </h1>
                        <p>
                            Offer hands-on, career-oriented learning experiences with high-quality courses and resources developed by leading university and industry professionals.
                        </p>
                    </div>

                    {/* Right Section */}
                    <div className='mt-10 w-full lg:w-[50rem] lg:h-[30rem] lg:relative'>

                        {/* Feature 1 */}
                        <div className="flex flex-col items-center w-[13rem] mx-auto my-14 lg:absolute lg:left-10 ">
                            <Image src={frame1} alt="loading" className="mb-4" />
                            <h3 className="text-xl font-bold mb-2">World-Class Content</h3>
                            <p className="text-sm text-center">
                                Connect students to a wide range of content from hundreds of industry leaders and universities.
                            </p>
                        </div>

                        {/* Feature 2 */}
                        <div className="flex flex-col items-center w-[13rem] mx-auto my-14 lg:absolute lg:right-0 ">
                            <Image src={frame2} alt="loading..." className="mb-1" />
                            <h3 className="text-xl font-bold mb-2">Guided Projects</h3>
                            <p className="text-sm text-center">
                                Give students hands-on projects to practice skills and stand out to employers.
                            </p>
                        </div>

                        {/* Feature 3 */}
                        <div className="flex flex-col items-center w-[15rem] mx-auto my-14 lg:absolute lg:top-[14rem] lg:left-1/3 xl:left-[18rem]">
                            <Image src={frame3} alt="loading..." className="mb-4" />
                            <h3 className="text-xl font-bold mb-2">Professional Certificates</h3>
                            <p className="text-sm text-center">
                                Help your students grow job confidence, apply learning, and hone critical skills in high-growth fields.
                            </p>
                        </div>

                    </div>
                </div>
            </div>



            {/* section 6  */}
            <div className='my-7 py-5 w-full lg:text-center'>
                <h2 className='font-bold text-3xl text-center lg:w-[90%] lg:mx-auto leading-tight'>
                    Discover How Forward-Thinking Universities Leverage Teachercool for Campus
                </h2>
                <p className='my-5 text-center xl:text-left  tracking-tight leading-relaxed px-5 lg:w-[60%] lg:mx-auto md:text-xl'>
                    Teachercool ensures that we deliver a high-quality education that enhances our students' career prospects. Without Teachercool, transitioning to ‘University 4.0’ would be challenging, as we wouldn't be able to develop courses as rapidly on our own.
                </p>
            </div>


            {/* extra added section  */}
            <div className='my-7 py-5 w-full lg:text-center bg-gradient-to-r from-blue-600 to-blue-900 text-white'>
                <h2 className='font-bold text-3xl text-center lg:w-[38rem] lg:mx-auto'>
                    Become Part of a Global Network of Forward-Thinking Colleges and Universities that Choose TeacherCool for Their Students
                </h2>
                <p className='my-5 text-center tracking-tight leading-tight px-5 lg:w-[62%] lg:mx-auto'>
                    “No individual professor or institution can match the wide array of choices available through Teachercool. By offering courses that are relevant to various industries, Teachercool effectively connects classroom education with practical workplace skills.”
                </p>
            </div>

            {/* section 7 input fields  */}
            <div className='bg-gray-100 w-full flex justify-center items-center'>
                <div className='bg-gray-100 w-full lg:w-[75%] flex flex-col gap-6 pt-12 pb-16 md:flex-row md:items-start justify-between'>

                    {/* Left Content Section */}
                    <div className='lg:mt-5 mx-auto w-fit lg:w-[40%]'>
                        <Image src={logo} alt='loading...' className="mx-auto" />
                        <h1 className='my-6 w-full text-3xl font-bold lg:w-full lg:text-4xl lg:mt-5 text-center'>
                            Contact Our Sales Team
                        </h1>

                        <div className='w-[21rem] text-sm lg:w-full lg:text-md lg:my-5 mx-auto md:text-xl'>
                            <p>Discover how you can:</p>
                            <div className='lg:my-3'>
                                <p className="flex items-center gap-2 w-full my-2 text-left tracking-normal leading-relaxed md:text-xl">
                                    <span className='w-4'><Image src={tick} alt='loading' /></span>
                                    Align Curriculum with Career Opportunities
                                </p>
                                <p className="flex items-center gap-2 w-full my-2 text-left tracking-normal leading-relaxed md:text-xl">
                                    <span className='w-4'><Image src={tick} alt='loading' /></span>
                                    Improve Employment Outcomes
                                </p>
                                <p className="flex items-center gap-2 w-full my-2 text-left tracking-normal leading-relaxed md:text-xl">
                                    <span className='w-4'><Image src={tick} alt='loading' /></span>
                                    Enhance Learning Experiences
                                </p>
                            </div>
                        </div>
                    </div>


                    <div className='w-full lg:w-[50%] mx-auto'>
                        <form className='pt-5 px-8  pb-3   bg-white border-2 shadow-md' onSubmit={handleSubmit}>
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                                <input type='text' placeholder='First Name' name='firstName' className='w-full border rounded-md border-black  py-2.5 pl-4 placeholder-black' onChange={handleChange} />
                                <input type='text' placeholder='Last Name' name='lastName' className='w-full border rounded-md border-black  py-2.5 pl-4 placeholder-black' onChange={handleChange} />
                                <input type='email' placeholder='Email' name='email' className='w-full border rounded-md border-black  py-2.5 pl-4 placeholder-black' onChange={handleChange} />
                                <input type='text' placeholder='Phone Number' name='phone' className='w-full border rounded-md border-black  py-2.5 pl-4 placeholder-black' onChange={handleChange} />
                                <input type='text' placeholder='Institution Type' name='institutionType' className='w-full border rounded-md border-black  py-2.5 pl-4 placeholder-black' onChange={handleChange} />
                                <input type='text' placeholder='Institution Name' name='institutionName' className='w-full border rounded-md border-black  py-2.5 pl-4 placeholder-black' onChange={handleChange} />
                                <input type='text' placeholder='Job Role' name='jobRole' className='w-full border rounded-md border-black  py-2.5 pl-4 placeholder-black' onChange={handleChange} />
                                <input type='text' placeholder='Department' name='department' className='w-full border rounded-md border-black  py-2.5 pl-4 placeholder-black' onChange={handleChange} />
                            </div>

                            <div className='flex flex-col mt-4'>
                                <input type='text' placeholder='Country' name='country' className='w-full border rounded-md border-black  py-2.5 pl-4 placeholder-black' onChange={handleChange} />
                                <textarea placeholder='Which best describes your needs?' className='w-full resize-none border rounded-md border-black my-2 py-2.5 pl-4 placeholder-black' onChange={handleChange} />
                            </div>

                            <p className='w-full my-3 mx-auto text-justify tracking-tight leading-relaxed text-xs md:text-sm'>
                                By submitting your info in the form above, you agree to our
                                <Link href="/terms" onClick={() => window.scrollTo(0, 0)} className="no-underline"><span className='text-[#0966ED] ml-1 '>Terms of Use</span> </Link>  and
                                <Link href="/policy" onClick={() => window.scrollTo(0, 0)} className="no-underline"><span className='text-[#0966ED] ml-1 '>Privacy Notice</span></Link>. We may use this info to contact you and/or use data from third parties to personalize your experience.
                            </p>

                            <button className='w-full bg-[#0966ED] text-white mt-3 py-2 rounded-sm focus:outline-none'>
                                {loading ? 'Submitting...' : 'Submit'}
                            </button>
                        </form>
                    </div>

                </div>
            </div>


            {/* section 8  */}
            <div className=" w-full bg-gradient-to-r from-blue-950 to-blue-800 text-white py-16 text-center lg:w-[80%] mx-auto my-20" >

                {/* <h1 className='text-4xl my-5'>Help prepare career-ready graduates</h1> */}
                <h1 className='text-4xl my-5 '>Prepare Graduates for Career Success</h1>
                {/* <h2 className='my-7'>Widen your reach, enhance your curriculum, and empower students and faculty with CoolTeacher for Campus</h2> */}
                <h2 className='my-7 px-4 text-justify md:text-xl tracking-tight leading-relaxed lg:w-fit lg:mx-auto'>Expand your reach, enrich your curriculum, and empower both students and faculty with
                    Teachercool for Campus.</h2>

                <Link href="/contact"
                    onClick={() => window.scroll(0, 0)}
                    className='bg-white py-2 px-2 text-blue-800 w-[10rem] my-5 rounded-md no-underline'>Contact us</Link>
            </div>

        </>
    )
}

export default UniversityClient
