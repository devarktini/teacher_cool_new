'use client'
import axios from 'axios';
import Link from 'next/link';
import React, { useEffect, useState } from 'react'

function CourseCard(props: any) {
  //   const navigate = useNavigate();
  // const dispatch = useDispatch();

  const priceInINR = 100;
  const userCurrency = "INR";
  const [conversionRate, setConversionRate] = useState<any>();

  async function fetchExchangeRate(country: string) {
    try {
      const response = await axios.get(
        `https://api.exchangerate-api.com/v4/latest/INR`
      ); // Replace with your API
      const rate = response.data.rates[country];
      setConversionRate(rate);

    } catch (error) {
      console.error("Error fetching exchange rates", error);
    }
  }

  useEffect(() => {
    fetchExchangeRate(userCurrency)
  }, [priceInINR])




  function truncateText(text: string, wordLimit: number) {
    const words = text.split(" ");
    if (words.length > wordLimit) {
      return words.slice(0, wordLimit).join(" ") + "...";
    }
    return text;
  }
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-5 py-5 max-sm:m-6">
      {props?.dataOne?.map((item: any, index: any) => {
        const defaultBanner = "https://miro.medium.com/v2/resize:fit:720/format:webp/1*U4gZLnRtHEeJuc6tdVLwPw.png";
  
        return (
          <React.Fragment key={index}>
            <div className="relative mt-4 border border-gray-200 hover:shadow-md rounded-lg overflow-hidden h-auto flex flex-col min-h-[24rem]">
              <span
                className={`absolute top-2 left-2 text-white text-xs font-bold py-1 px-3 rounded-full shadow-md ${item?.level === "unknown"
                  ? "bg-transparent"
                  : item?.level === "beginner"
                    ? "bg-green-500"
                    : item?.level === "intermediate"
                      ? "bg-yellow-500"
                      : "bg-red-500"
                  }`}
              >
                {item?.level === "unknown"
                  ? null
                  : item?.level === "beginner"
                    ? "Beginner"
                    : item?.level === "intermediate"
                      ? "Intermediate"
                      : item?.level === "beginner_to_advanced"
                        ? "Beginner To Advanced"
                        : item?.level}
              </span>

              <img
                className="w-full h-[10rem] rounded-t-lg object-cover"
                src={item?.banner ? item?.banner : defaultBanner}
                alt="card-image"
              />

              <div className="p-3 flex-grow">
                <h2 className="font-semibold h-6 overflow-hidden text-sm text-gray-900 uppercase">
                  {item?.title}
                </h2>
                <p className="text-sm pt-1 text-gray-600 pr-1">
                  {truncateText(item?.description, 20)}{" "}

                  <Link
                    // onClick={() => localStorage.setItem("courseId", item?.id)}

                    // to={`/courses/${item?.title?.toLowerCase()?.replace(/\s+/g, "-")}/${item?.id}`}
                    href="#"
                    className="text-blue-500"
                  >
                    Read more
                  </Link>

                </p>
              </div>

              <div className="p-3 pb-2 flex flex-col gap-1">
                {item?.price > 0 && (
                  <div className="flex items-center text-sm text-gray-600">
                    <span className="font-bold text-gray-800">
                      Price: {(item.price * conversionRate).toFixed(2)} {userCurrency}
                    </span>
                  </div>
                )}
              </div>

              <div className="flex justify-between items-center p-3 space-x-2 mt-auto">
                <Link

                  // href={`/courses/${slug}/${item?.id}`}
                  href={`/courses/${item.slug}/`}

                  className="text-xs bg-[#0966ED] text-center text-white font-bold py-2 px-4 rounded-md shadow-lg hover:shadow-2xl hover:scale-105 transition duration-300 ease-in-out cursor-pointer flex-1"
                >
                  View Details
                </Link>


                <button
                  onClick={() => {
                    const userType = localStorage.getItem("user_type");
                    const expirationTime = new Date().getTime() + 2 * 60 * 1000;
                    // localStorage.setItem("freeCourseExpiration", expirationTime);
                    localStorage.setItem("freeCourseExpiration", expirationTime.toString());
                    localStorage.setItem("courseId", item.id);
                    localStorage.setItem("courseTitle", item.title);
                    // if (!localStorage.getItem("userAuth")) {
                    //   dispatch(changeShowLogin(true));
                    // } else {
                    //   navigate(`/courses/${item.id}/${item.title}`);
                    // }
                  }}
                  disabled={parseFloat(item?.price) === 0}
                  className={`text-xs text-center text-white font-bold py-2 px-4 rounded-md shadow-lg transition duration-300 ease-in-out flex-1 ${parseFloat(item?.price) === 0
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-[#0966ED] hover:shadow-2xl hover:scale-105 cursor-pointer"
                    }`}
                >
                  Try for Free
                </button>
              </div>
            </div>

          </React.Fragment>
        );
      })}
    </div>
  )
}

export default CourseCard
