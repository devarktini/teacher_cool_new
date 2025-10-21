import React from 'react'

function AboutRight() {
    return (
        <>
            <div className="relative  w-full p-4 md:p-6">
                <div>
                    <h1 className="text-blue-700 text-2xl">About us</h1>
                    <h1 className="text-6xl max-sm:text-4xl md:text-5xl font-bold py-3">
                        Who We Are
                    </h1>
                    <p className="text-base xl:text-left md:text-left text-justify text-[#696969] leading-relaxed">
                        TeacherCool - Empowering Minds Through Innovative Trainings for all
                        your needs, whether it is IT/NON-IT for Individuals, Corporates, and
                        Universities.
                        <br />
                        <br />
                        Welcome to TeacherCool, where knowledge meets innovation, and
                        learning becomes an exciting journey! As a premier online platform
                        for IT-based training, TeacherCool is committed to revolutionizing
                        education by providing comprehensive, cutting-edge courses that
                        empower individuals to thrive in the dynamic world of Information
                        Technology.
                    </p>

                    <button
                        // onClick={() => {
                        //     if (localStorage.getItem("userAuth")) {
                        //         navigate("/forIndividual");
                        //     } else {
                        //         dispatch(changeShowLogin(true));
                        //     }
                        // }}
                        className="bg-blue-500 hover:bg-blue-700 text-white font-semibold py-3 px-4 md:px-6 rounded focus:outline-none mt-5"
                        type="button"
                    >
                        Start Learning Now
                    </button>
                </div>
            </div>
        </>
    )
}

export default AboutRight
