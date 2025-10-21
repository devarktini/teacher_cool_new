'use client'
import React, { useState } from 'react'

function page() {
    const [openSection, setOpenSection] = useState(null);

    const toggleSection = (section:any) => {
        setOpenSection(openSection === section ? null : section);
    };

    const sections = [
        {
            title: "Engaging Courses",
            content: (
                <p>
                    We offer a wide range of high-quality courses tailored to meet diverse learning needs.
                    Our courses are created by industry experts and designed to keep learners engaged through:
                    <ul className="list-disc ml-5">
                        <li>Interactive multimedia content (videos, quizzes, and simulations)</li>
                        <li>Real-world applications and case studies</li>
                        <li>Structured modules for self-paced learning</li>
                    </ul>
                </p>
            ),
        },
        {
            title: "Flexible Learning",
            content: (
                <p>
                    Learn at your own pace, on your own time. Teachercool is available 24/7, so you can access
                    materials anytime, anywhere, on any device.
                </p>
            ),
        },
        {
            title: "Personalized Learning Pathways",
            content: (
                <p>
                    Every learner is unique, and Teachercool allows for personalized learning journeys. With customizable
                    learning paths, you can:
                    <ul className="list-disc ml-5">
                        <li>Choose courses based on career goals, interests, or job requirements.</li>
                        <li>Track progress and set milestones to stay motivated.</li>
                        <li>Receive recommendations tailored to your skills and learning preferences.</li>
                    </ul>
                </p>
            ),
        },
        {
            title: "Certification and Badging",
            content: (
                <p>
                    Showcase your achievements with recognized certifications and digital badges. Upon completion of each course,
                    receive a certificate and share it with employers or add it to your resume.
                </p>
            ),
        },
        {
            title: "Seamless Collaboration Tools",
            content: (
                <p>
                    Teachercool fosters collaboration through discussion forums, group projects, and real-time chat features,
                    allowing you to connect and learn with others.
                </p>
            ),
        },
        {
            title: "Scalable Solutions for Organizations",
            content: (
                <p>
                    Teachercool provides scalable solutions for managing employee training. Features include:
                    <ul className="list-disc ml-5">
                        <li>Centralized training management</li>
                        <li>Customizable learning paths for teams</li>
                        <li>Progress tracking and detailed analytics</li>
                        <li>Integration with HR systems</li>
                    </ul>
                </p>
            ),
        },
        {
            title: "Continuous Support",
            content: (
                <p>
                    Our dedicated support team is available 24/7. Access helpful tutorials, technical support, and academic guidance.
                </p>
            ),
        },
        {
            title: "Advanced Analytics & Reporting",
            content: (
                <p>
                    Track learning progress with analytics tools, and for organizations, gain insights into employee performance and
                    course completion rates to make data-driven decisions.
                </p>
            ),
        },
        {
            title: "Mobile-Friendly Experience",
            content: (
                <p>
                    Access your learning materials on-the-go with our mobile-responsive platform, ensuring a seamless experience
                    across devices.
                </p>
            ),
        },
        {
            title: "Continuous Content Updates",
            content: (
                <p>
                    We regularly update our courses to reflect the latest industry trends and best practices, keeping our course
                    catalog dynamic and relevant.
                </p>
            ),
        },
    ];
    return (
        <>

            <div className="p-6 max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold text-center text-blue-700 mb-6">What We Offer</h1>
                <p className="text-center text-lg text-gray-700 mb-8">
                    Welcome to Teachercool! We are committed to providing a comprehensive, user-friendly platform to support
                    your educational journey and empower your organization’s learning goals.
                </p>

                {sections.map((section, index) => (
                    <div key={index} className="mb-6">
                        <button
                            onClick={() => toggleSection(index)}
                            className="w-full text-left flex justify-between items-center p-4 bg-blue-100 hover:bg-blue-200 text-blue-900 font-semibold rounded-lg shadow-md transition-colors"
                        >
                            {section.title}
                            <span>{openSection === index ? "-" : "+"}</span>
                        </button>
                        {openSection === index && (
                            <div className="mt-4 p-4 bg-white rounded-lg shadow-inner text-gray-800">
                                {section.content}
                            </div>
                        )}
                    </div>
                ))}

                <p className="text-center text-lg text-gray-700 mt-8">
                    Whether you're an individual looking to advance your skills or an organization aiming to boost employee performance,
                    we offer everything you need to succeed in your learning journey. Join us today and take the next step toward achieving
                    your goals!
                </p>


            </div>

        </>
    )
}

export default page
