import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import img2 from '@/public/images/corporates/img2.jpg'
import tickIcon from '@/public/images/university/tick.png'
import groupT from '@/public/images/corporates/groupTwo.png'
import corp from "@/public/images/corporates/corporateTwo.png";
import CorporateForm from './CorporateForm'

function OtherSection() {
    return (
        <>
            <div className="flex items-center justify-center mt-10 lg:w-[95%] mx-auto">
                <div className="flex flex-col lg:flex-row lg:w-full gap-3 mx-auto py-10 ">
                    {/* Text Content Section */}
                    <div className="flex-1 flex flex-col gap-1 px-2 md:px-5 lg:px-0 ">
                        <p className='uppercase font-bold w-fit ml-2 md:ml-0'>World-class content</p>
                        <h2 className='md:text-4xl text-2xl font-bold w-fit ml-2 md:ml-0'>Elevate Your Organization&#39;s Skills</h2>

                        {/* Learning Opportunities List */}
                        <div className="flex flex-col gap-3 mt-3 md:mt-5">
                            <div className="flex">
                                <div className="flex flex-col">
                                    <b className='text-justify tracking-tight flex gap-1'>
                                        <span><Image src={tickIcon} alt="Checkmark" /></span>
                                        Empower Teams to Thrive
                                    </b>
                                    <p className="px-4 text-justify tracking-tight md:px-0">
                                        In a rapidly changing landscape, equip your employees with expert-led
                                        training in Generative AI, technology, data, and leadership tailored for every
                                        level and role.
                                    </p>
                                </div>
                            </div>

                            <div className="flex">
                                <div className="flex flex-col">
                                    <b className='text-justify tracking-tight flex gap-1'>
                                        <span><Image src={tickIcon} alt="Checkmark" /></span>
                                        Develop Essential Tech, Data, and Business Competencies
                                    </b>
                                    <p className="px-4 text-justify tracking-tight md:px-0">
                                        Upskill efficiently with high-quality content created and validated by learning
                                        and development professionals.
                                    </p>
                                </div>
                            </div>

                            <div className="flex">
                                <div className="flex flex-col">
                                    <b className='text-justify tracking-tight flex gap-1'>
                                        <span><Image src={tickIcon} alt="Checkmark" /></span>
                                        Navigate Learning with Clear Pathways
                                    </b>
                                    <p className="px-4 text-justify tracking-tight md:px-0">
                                        Simplify the learning experience with structured paths that guide employees
                                        through their training.
                                    </p>
                                </div>
                            </div>
                            <div className="flex">
                                <div className="flex flex-col">
                                    <b className='text-justify tracking-tight flex gap-1'>
                                        <span><Image src={tickIcon} alt="Checkmark" /></span>
                                        Cultivate a Culture of Continuous Learning
                                    </b>
                                    <p className="px-4 text-justify tracking-tight md:px-0">
                                        Promote a dynamic learning environment with flexible and engaging content
                                        that keeps employees motivated.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Explore Link */}
                        <div className="flex items-center gap-3 mt-3 w-fit ml-1 md:ml-0">
                            <Link href="/world-class-content" className='text-[#0966ED] font-bold no-underline'>
                                Explore world-class content
                            </Link>
                            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" clipRule="evenodd" d="M15.293 8.50048L8.146 1.35448L8.854 0.646484L17.207 9.00048L8.854 17.3545L8.146 16.6475L15.293 9.50048H0.5V8.50048H15.293Z" fill="#0966ED" />
                            </svg>
                        </div>
                    </div>

                    {/* Image Section */}
                    <div className="flex-1 flex items-center justify-center mt-5 lg:mt-0">
                        <Image
                            src={img2}
                            className='md:w-full w-[100%] h-full rounded-md'
                            alt="Learning Opportunities"
                        />
                    </div>
                </div>
            </div>

            {/* <Academies /> */}

            <div className="flex items-center justify-center py-10 bg-[#F5F5F5] ">
                <div className="flex flex-col md:flex-row lg:w-[95%] max-w-10xl  mx-auto gap-5 py-10">
                    {/* Image Section */}
                    <div className="flex-1 flex items-center justify-center md:px-2 lg:px-0">
                        <Image
                            src={groupT}
                            alt=""
                            className="w-[95%] rounded-md"
                        />
                    </div>

                    {/* Text Content Section */}
                    <div className="flex-1 flex flex-col px-3 md:px-5 lg:px-0 gap-1">
                        <p className="uppercase font-bold">Show ROI</p>
                        <h1 className="md:text-4xl text-3xl font-bold">Great Learning Opportunities</h1>
                        <p>
                            Use comprehensive metrics and insights to inform, measure, and assess your talent development strategy impact.
                        </p>

                        {/* List of Benefits */}
                        <div className="text-sm md:text-[15px] mt-3 flex flex-col gap-3">

                            <div className="flex">
                                <div className="flex flex-col">
                                    <b className='text-justify flex gap-1'>
                                        <span><Image src={tickIcon} alt="Checkmark" /></span>
                                        Learn from Industry Leaders
                                    </b>
                                    <p className="px-4 text-justify tracking-tight">
                                        Reduce training expenses with customized content and credentials from over 325 top
                                        companies and universities.
                                    </p>
                                </div>
                            </div>
                            <div className="flex">
                                <div className="flex flex-col">
                                    <b className='text-justify flex gap-1'>
                                        <span><Image src={tickIcon} alt="Checkmark" /></span>
                                        Direct Insights from Leading Business Schools
                                    </b>
                                    <p className="px-4 text-justify tracking-tight">
                                        Access specialized academies tailored to specific roles or upskilling requirements.
                                    </p>
                                </div>
                            </div>
                            <div className="flex">
                                <div className="flex flex-col">
                                    <b className='text-justify flex gap-1'>
                                        <span><Image src={tickIcon} alt="Checkmark" /></span>
                                        Combine Workplace and Technical Skill Development
                                    </b>
                                    <p className="px-4 text-justify tracking-tight">
                                        Provide training through a variety of formats, including video tutorials, hands-on
                                        projects, and Professional Certificates.
                                    </p>
                                </div>
                            </div>

                        </div>

                        {/* Explore Link */}
                        <div className="flex items-center gap-4 mt-3 md:text-[15px]">
                            <p className="text-[#0966ED]">Explore Skill Dashboard</p>
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path
                                    fillRule="evenodd"
                                    clipRule="evenodd"
                                    d="M16.793 9.50048L9.646 2.35448L10.354 1.64648L18.707 10.0005L10.354 18.3545L9.646 17.6475L16.793 10.5005H2V9.50048H16.793Z"
                                    fill="#0966ED"
                                />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-center py-10">
                <div className="flex flex-col md:flex-row lg:w-[95%] max-w-10xl mx-auto gap-5 py-10 tracking-wide">
                    {/* Text Content Section */}
                    <div className="flex-1 flex flex-col gap-2 px-3 lg:px-0">
                        <p className="uppercase font-bold mt-4 md:mt-0">Retain Talent</p>
                        <h1 className="md:text-4xl text-3xl font-bold">Foster Employee Engagement</h1>
                        <p>
                            Use comprehensive metrics and insights to inform, measure, and assess your talent development strategy impact.
                        </p>

                        {/* List of Benefits */}
                        <div className="text-[15px] tracking-wide flex flex-col gap-3">

                            {/* <p className="flex items-center gap-2 md:gap-1">
                <span><img src={tickIcon} alt="" className="w-7" /></span>
                Encourage ongoing learning to enhance employee engagement, productivity, and
                career development.
              </p> */}

                            <div className="flex ">
                                <div className="flex flex-col">
                                    <b className='text-justify tracking-wide flex gap-1'>
                                        <span><Image src={tickIcon} alt="Checkmark" /></span>
                                        Attract, Retain, and Develop Your Talent
                                    </b>
                                    <p className="px-4 text-justify tracking-tight">
                                        Encourage ongoing learning to enhance employee engagement, productivity, and
                                        career development.
                                    </p>
                                </div>
                            </div>



                            <div className="flex">
                                <div className="flex flex-col">
                                    <b className='text-justify tracking-wide flex gap-1'>
                                        <span><Image src={tickIcon} alt="Checkmark" /></span>
                                        Support Employee Growth with 130+ Professional Certificates
                                    </b>
                                    <p className="px-4 text-justify tracking-tight">
                                        Invest in your team&#39;s advancement with a wide range of recognized programs.
                                    </p>
                                </div>
                            </div>
                            <div className="flex">
                                <div className="flex flex-col">
                                    <b className='text-justify tracking-wide flex gap-1'>
                                        <span><Image src={tickIcon} alt="Checkmark" /></span>
                                        Accelerate Learning with AI Coaching
                                    </b>
                                    <p className="px-4 text-justify tracking-tight">
                                        Utilize our AI Coach to facilitate quicker skill acquisition.
                                    </p>
                                </div>
                            </div>
                            <div className="flex">
                                <div className="flex flex-col">
                                    <b className='text-justify tracking-wide flex gap-1'>
                                        <span><Image src={tickIcon} alt="Checkmark" /></span>
                                        Enable Employees to Achieve Valued Career Credentials
                                    </b>
                                    <p className="px-4 text-justify tracking-tight">
                                        Assist your workforce in earning credentials that are respected in the industry.
                                    </p>
                                </div>
                            </div>

                        </div>

                        {/* Explore Link */}
                        <div className="flex items-center mt-2 gap-4">
                            <p className="text-[#0966ED]">Explore more Teacher Cool advantages</p>
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path
                                    fillRule="evenodd"
                                    clipRule="evenodd"
                                    d="M16.793 9.50048L9.646 2.35448L10.354 1.64648L18.707 10.0005L10.354 18.3545L9.646 17.6475L16.793 10.5005H2V9.50048H16.793Z"
                                    fill="#0966ED"
                                />
                            </svg>
                        </div>
                    </div>

                    {/* Image Section */}
                    <div className="flex-1 flex items-center justify-center">
                        <Image
                            src={corp}
                            alt=""
                            className="md:w-[90%] w-[100%] rounded-md"
                        />
                    </div>
                </div>
            </div>

            <div className="w-full px-4 sm:px-6 md:px-8 bg-[#F5F5F5]">
                <CorporateForm />
            </div>

        </>
    )
}

export default OtherSection
