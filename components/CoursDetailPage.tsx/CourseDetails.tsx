'use client'
import React from 'react'
import SelectedCourseDetail from './SelectedCourseDetail';

function CourseDetails({ specificCourse }: any) {
    // console.log("sss", specificCourse)
    const getLabel = (level: string) => {
        if (level === "unknown") {
            return "Corporate";
        } else if (level === "beginer_to_intermediate") {
            return "beginner_to_intermediate";
        } else if (level === "advanced") {
            return "Advanced";
        } else {
            return level;
        }
    };
    return (
        <>
            <div className="bg-[#F4F6FC] ">
                <div className="container mx-auto">
                    <div className="w-[90%] mx-auto grid grid-cols-1 md:grid-cols-2 pb-10 gap-5">
                        <div className="flex flex-col gap-3 items-start pt-16">
                            <div className="flex items-end">
                                <button
                                    className={`${specificCourse?.level === "unknown"
                                        ? ""
                                        : "text-[#0966ED] bg-[#DBE6FE] h-8 px-2 w-auto text-sm font-medium rounded-full font-Roboto uppercase"
                                        }`}
                                >
                                    {getLabel(specificCourse?.level)}
                                </button>
                            </div>
                            <span className="text-3xl md:text-4xl text-[#1E1E1E] text-opacity-90 font-bold font-Roboto">
                                {specificCourse?.title}
                            </span>
                            <h1 className="text-base text-[#1E1E1E] xl:text-left text-justify text-opacity-60 font-Roboto">
                                {specificCourse?.description}
                            </h1>
                            {/* <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-sm"> */}
                            <div className={`flex items-center gap-2 ${specificCourse?.total_price ? "bg-white" : ""} px-4 py-2 rounded-lg shadow-sm`}>

                                {specificCourse?.total_price ? (
                                    <>
                                        <span className="text-gray-600 font-medium">Price:</span>
                                        <span className="text-xl font-bold text-[#0966ED]">
                                            ₹ {specificCourse?.total_price ? specificCourse?.total_price : "Free"}
                                        </span>
                                    </>
                                ) : null
                                    // (
                                    //   <ScratchCard onContactClick={() => setFormOpen(!formOpen)} />
                                    // )
                                }


                            </div>
                            <div className="flex gap-6 items-center py-2">
                                <div className="flex items-center gap-3">
                                    <img
                                        src={
                                            process.env.PUBLIC_URL + "/images/student/people.png"
                                        }
                                        alt="img"
                                    />
                                    <span className="text-base font-Roboto font-medium text-[#656565]">
                                        {Math.floor(Math.random() * (20 - 5 + 1)) + 5}K+ Students
                                    </span>
                                </div>
                                {specificCourse?.duration && (
                                    <div className="flex items-center gap-3">
                                        <img
                                            src={
                                                process.env.PUBLIC_URL + "/images/student/people.png"
                                            }
                                            alt="img"
                                        />
                                        <span className="text-base font-medium font-Roboto text-[#656565]">
                                            {specificCourse?.duration}
                                        </span>
                                    </div>
                                )}

                            </div>

                            {/* {isCourseIdMatched ? (
                                <button
                                    className="text-base font-Roboto text-[#fff] font-semibold rounded-md bg-[#28A745] w-full xl:w-[182px] h-[46px]"
                                    onClick={() =>
                                        navigate("/student/learn/course", {
                                            state: { ci: courseId },
                                        })
                                    }
                                >
                                    Go to Course
                                </button>
                            ) : (
                                <>
                                    {coursePrice > 0 ? (
                                        <div className="flex xl:flex-row flex-col w-full items-center gap-6">
                                            <button
                                                onClick={() => {
                                                    const userAccess = localStorage.getItem("userAuth");
                                                    if (userAccess) {
                                                        handlePayment();
                                                    } else {
                                                        dispatch(changeShowLogin(true));
                                                    }
                                                }}
                                                className="text-base font-Roboto text-[#fff] font-semibold rounded-md bg-[#0966ED] w-full xl:w-[182px] h-[46px]"
                                            >
                                                BUY COURSE
                                            </button>
                                            <button
                                                onClick={() => handleWish(userId, specificCourse.id)}
                                                className="text-base font-Roboto text-[#fff] font-semibold rounded-md bg-[#FF5733] w-full xl:w-[182px] h-[46px]"
                                            >
                                                ADD TO WISHLIST
                                            </button>
                                            <a
                                                href="#courseDetail"
                                                className="text-base whitespace-nowrap font-medium font-Roboto leading-3 border-b border-[#1E1E1E] text-[#1E1E1E]"
                                            >
                                                View course materials
                                            </a>
                                        </div>
                                    ) :
                                        (
                                            <button
                                                onClick={() => setFormOpen(!formOpen)}
                                                className="text-base flex items-center justify-center font-Roboto text-[#fff] font-semibold rounded-md bg-[#0966ED] w-full xl:w-[182px] h-[46px] uppercase"
                                            >
                                                contact us
                                            </button>
                                        )
                                    }
                                </>
                            )} */}
                        </div>

                        <div className="pt-20 flex justify-center">
                            {specificCourse?.banner == null ? (
                                <div className="flex items-center gap-3 animate-pulse">
                                    <div className="w-6 h-6 bg-gray-200 rounded-full"></div>
                                    <div className="h-4 w-20 bg-gray-200 rounded"></div>
                                </div>
                            ) : (
                                <img
                                    src={specificCourse?.banner}
                                    alt="img"
                                    className="max-w-full h-auto"
                                />
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div id="courseDetail" className="container mx-auto">
                <div className="w-[90%] mx-auto">
                    <SelectedCourseDetail specificCourse={specificCourse} />
                </div>
            </div>
        </>
    )
}

export default CourseDetails
