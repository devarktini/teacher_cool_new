'use client';
import React from 'react';
import Link from 'next/link';


interface CardProps {
  data: any[];
}

function Card({ data }: CardProps) {
  const onlyPublic = data?.filter((item) => item?.type === 'public') || [];

  // console.log("hh",data)
  const truncateText = (text: string, wordLimit: number) => {
    const words = text.split(' ');
    return words.length > wordLimit
      ? words.slice(0, wordLimit).join(' ') + '...'
      : text;
  };

  return (
    <>
      {onlyPublic && onlyPublic?.map((item) => {
        const bannerImage =
          item.banner ||
          'https://miro.medium.com/v2/resize:fit:720/format:webp/1*U4gZLnRtHEeJuc6tdVLwPw.png';

        const slug = item.title
          ?.toLowerCase()
          // replace spaces (one or more) with a hyphen
          .replace(/\s+/g, '-')
          // replace colons with a hyphen
          .replace(/:/g, '-')
          // optionally remove any characters you don’t want (like punctuation)
          .replace(/[^a-z0-9\-]+/g, '')
          // optionally collapse consecutive hyphens into one
          .replace(/-+/g, '-')
          // optionally trim hyphens from start or end
          .replace(/^-|-$/g, '');

        return (
          <div
            key={item.id}
            className="md:w-[16rem] md:min-w-[16rem] w-full md:h-full xl:h-[80%] flex flex-col border-2 rounded-lg relative min-h-[20rem]"
          >
            {/* Level Tag */}
            <span
              className={`absolute w-fit top-2 md:left-2 text-white text-[10px] md:text-xs md:font-bold py-1 px-3 rounded-full shadow-md ${item?.level === 'unknown'
                  ? 'bg-transparent'
                  : item?.level === 'beginner'
                    ? 'bg-green-500'
                    : item?.level === 'beginer_to_intermediate'
                      ? 'bg-yellow-500'
                      : 'bg-red-500'
                }`}
            >
              {item?.level === 'unknown'
                ? null
                : item?.level === 'beginner'
                  ? 'Beginner'
                  : item?.level === 'beginer_to_intermediate'
                    ? 'Beginer To Intermediate'
                    : item?.level === 'beginner_to_advanced'
                      ? 'Beginner To Advanced'
                      : item?.level}
            </span>

            {/* Image */}
            <div className="aspect-w-16 aspect-h-10 overflow-hidden h-32">
              <img
                src={bannerImage}
                alt="course banner"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Content */}
            <div className="flex flex-col flex-grow p-4 gap-3">
              <p className="text-xs h-12 text-black font-bold uppercase line-clamp-2">
                {item?.title}
              </p>

              <div className="flex items-center gap-3">
                <b className="flex items-center gap-1">
                  {(Math.random() * (5 - 4) + 4).toFixed(1)}
                  <span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="17"
                      height="17"
                      viewBox="0 0 24 24"
                      fill="#0966ED"
                    >
                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                    </svg>
                  </span>
                </b>
                <span className="text-gray-500 text-xs">
                  {Math.floor(Math.random() * (20 - 5 + 1)) + 5}k reviews
                </span>
              </div>

              {/* Description */}
              <p className="text-sm text-gray-600 line-clamp-2 flex-grow">
                {truncateText(item?.description || '', 10)}{' '}
                <Link
                  href={`/courses/${slug}/${item?.id}`}
                  className="text-blue-500 text-sm font-semibold inline-flex items-center"
                >
                  Learn more <span className="ml-1">&raquo;</span>
                </Link>
              </p>
            </div>
          </div>
        );
      })}

      {data?.map((item) => {
        const bannerImage =
          item.banner ||
          'https://miro.medium.com/v2/resize:fit:720/format:webp/1*U4gZLnRtHEeJuc6tdVLwPw.png';
        const slug = item.title
          ?.toLowerCase()
          // replace spaces (one or more) with a hyphen
          .replace(/\s+/g, '-')
          // replace colons with a hyphen
          .replace(/:/g, '-')
          // optionally remove any characters you don’t want (like punctuation)
          .replace(/[^a-z0-9\-]+/g, '')
          // optionally collapse consecutive hyphens into one
          .replace(/-+/g, '-')
          // optionally trim hyphens from start or end
          .replace(/^-|-$/g, '');

        return (
          <div
            key={item.id}
            className="md:w-[16rem] md:min-w-[16rem] w-full md:h-full xl:h-[80%] flex flex-col border-2 rounded-lg relative min-h-[20rem]"
          >
            {/* Level Tag */}
            <span
              className={`absolute w-fit top-2 md:left-2 text-white text-[10px] md:text-xs md:font-bold py-1 px-3 rounded-full shadow-md ${item?.level === 'unknown'
                  ? 'bg-transparent'
                  : item?.level === 'beginner'
                    ? 'bg-green-500'
                    : item?.level === 'intermediate'
                      ? 'bg-yellow-500'
                      : 'bg-red-500'
                }`}
            >
              {item?.level === 'unknown'
                ? null
                : item?.level === 'beginner'
                  ? 'Beginner'
                  : item?.level === 'intermediate'
                    ? 'Intermediate'
                    : item?.level === 'beginner_to_advanced'
                      ? 'Beginner To Advanced'
                      : item?.level}
            </span>

            {/* Image */}
            <div className="aspect-w-16 aspect-h-10 overflow-hidden h-32">
              <img
                src={bannerImage}
                alt="course banner"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Content */}
            <div className="flex flex-col flex-grow p-4 gap-3">
              <p className="text-xs h-12 text-black font-bold uppercase line-clamp-2">
                {item?.title}
              </p>

              <div className="flex items-center gap-3">
                <b className="flex items-center gap-1">
                  {(Math.random() * (5 - 4) + 4).toFixed(1)}
                  <span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="17"
                      height="17"
                      viewBox="0 0 24 24"
                      fill="#0966ED"
                    >
                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                    </svg>
                  </span>
                </b>
                <span className="text-gray-500 text-xs">
                  {Math.floor(Math.random() * (20 - 5 + 1)) + 5}k reviews
                </span>
              </div>

              {/* Description */}
              <p className="text-sm text-gray-600 line-clamp-2 flex-grow">
                {truncateText(item?.description || '', 10)}{' '}
                <Link
                  href={`/courses/${slug}/${item?.id}`}
                  className="text-blue-500 text-sm font-semibold inline-flex items-center"
                >
                  Learn more <span className="ml-1">&raquo;</span>
                </Link>
              </p>
            </div>
          </div>
        );
      })}
    </>
  );
}

export default Card;



// 'use client'
// import Link from 'next/link';
// import React, { useEffect } from 'react'

// function Card(props: any) {

//     const userCurrency = "INR"
//     const priceInINR = 100;



//     function truncateText(text: string, wordLimit: number) {
//         const words = text.split(" ");
//         if (words.length > wordLimit) {
//             return words.slice(0, wordLimit).join(" ") + "...";
//         }
//         return text;
//     }

//     const onlyPublic = props?.data?.filter((item: any) => item?.type !== "private")
//     return (
//         <>
//             {onlyPublic.map((item: any, index: any) => {

//                 const bannerImage =
//                     "https://miro.medium.com/v2/resize:fit:720/format:webp/1*U4gZLnRtHEeJuc6tdVLwPw.png";
//                 return (
//                     <React.Fragment key={index}>
//                         {/* new added card  */}

//                         <div className="md:w-[16rem] md:min-w-[16rem] w-full md:h-full xl:h-[80%] flex flex-col border-2 rounded-lg relative min-h-[20rem]">
//                             {/* Level Tag */}
//                             <span
//                                 className={`absolute w-fit top-2 md:left-2 text-white text-[10px] md:text-xs md:font-bold py-1 px-3 rounded-full shadow-md ${item?.level === "unknown"
//                                     ? "bg-transparent"
//                                     : item?.level === "beginner"
//                                         ? "bg-green-500"
//                                         : item?.level === "intermediate"
//                                             ? "bg-yellow-500"
//                                             : "bg-red-500"
//                                     }`}
//                             >
//                                 {/* {item?.level === "unknown" ? null : item?.level} */}
//                                 {item?.level === "unknown"
//                                     ? null
//                                     : item?.level === "beginner"
//                                         ? "Beginner"
//                                         : item?.level === "intermediate"
//                                             ? "Intermediate"
//                                             : item?.level === "beginner_to_advanced"
//                                                 ? "Beginner To Advanced"
//                                                 : item?.level}

//                             </span>

//                             {/* Image Container */}
//                             <div className="aspect-w-16 aspect-h-10 overflow-hidden h-32">
//                                 <img
//                                     src={item?.banner ? item.banner : bannerImage}
//                                     alt="course banner"
//                                     className="w-full h-full object-cover"
//                                 />
//                             </div>

//                             {/* Content Section */}
//                             <div className="flex flex-col flex-grow p-4 gap-3">
//                                 <p className="text-xs h-12 text-black font-bold uppercase line-clamp-2">
//                                     {item?.title}
//                                 </p>

//                                 <div className="flex items-center gap-3">
//                                     <b className="flex items-center gap-1">
//                                         {(Math.random() * (5 - 4) + 4).toFixed(1)}
//                                         <span>
//                                             <svg
//                                                 xmlns="http://www.w3.org/2000/svg"
//                                                 width="17"
//                                                 height="17"
//                                                 viewBox="0 0 24 24"
//                                                 fill="#0966ED"
//                                             >
//                                                 <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
//                                             </svg>
//                                         </span>
//                                     </b>
//                                     <span className="text-gray-500 text-xs">  {Math.floor(Math.random() * (20 - 5 + 1)) + 5}k reviews</span>
//                                 </div>

//                                 {/* Description with Fixed Height */}
//                                 <p className="text-sm text-gray-600 line-clamp-2 flex-grow">
//                                     {truncateText(item?.description, 3)}{" "}
//                                     <Link
//                                         // onClick={() => localStorage.setItem("courseId", item?.id)}
//                                         href="/"
//                                         // to={`/courses/${item?.title?.toLowerCase()?.replace(/\s+/g, "-")}/${item?.id}`}
//                                         className="text-blue-500 text-sm font-semibold inline-flex items-center"
//                                     >
//                                         Learn more <span className="ml-1">&raquo;</span>
//                                     </Link>
//                                 </p>
//                             </div>
//                         </div>

//                     </React.Fragment>
//                 );
//             })}
//         </>
//     )
// }

// export default Card
