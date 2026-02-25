'use client'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import HomeApiService from '@/services/homeApi'
import Progress from '../Progress'
import Image from 'next/image'
import image from '@/public/images/image.png'
import { FaChevronRight, FaHouse } from 'react-icons/fa6'
import Link from 'next/link'

interface ProgramsProps {
  onClose: () => void
}

function Programs({ onClose }: ProgramsProps) {
  const router = useRouter()
  const defaultBanner =
    "https://miro.medium.com/v2/resize:fit:720/format:webp/1*U4gZLnRtHEeJuc6tdVLwPw.png";

  const [loading, setLoading] = useState(false);
  const [getCategoryData, setGetCategoryData] = useState<any[]>([]);
  const [certificateCourse, setCertificateCourse] = useState<any[]>([]);
  const [degreeCourse, setDegreeCourse] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState("certificate");
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeCategoryName, setActiveCategoryName] = useState<string>("");

  // ✅ Fetch categories and set initial active category
  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        const res = await HomeApiService.getCategoryByPublicAndPrivate();
        if (res?.data?.length > 0) {
          const firstCategory = res.data[0];
          setGetCategoryData(res.data);
          setActiveCategoryName(firstCategory.name);
          setCertificateCourse(firstCategory["certificate programme"]);
          setDegreeCourse(firstCategory["micro degree"]);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);
  // console.log("getCategoryData", getCategoryData);

  // ✅ Handle hover/click on category
  const handleMouseHover = (category: any, index: number) => {
    setActiveTab("certificate");
    setActiveIndex(index);
    setActiveCategoryName(category.name);
    setCertificateCourse(category["certificate programme"]);
    setDegreeCourse(category["micro degree"]);
  };

  // ✅ Handle navigation
  const handleNavigate = (item: any) => {
    setLoading(true);
    const slug = item.title
          ?.toLowerCase()
          .replace(/\s+/g, '-')
          .replace(/:/g, '-')
          .replace(/[^a-z0-9\-]+/g, '')
          .replace(/-+/g, '-')
          .replace(/^-|-$/g, '');
    router.push(`/courses/${slug}`);
    onClose();
    setLoading(false);
  };

  // ✅ Reset when closed
  useEffect(() => {
    return () => {
      setActiveCategoryName("");
      setActiveIndex(0);
      setActiveTab("certificate");
      setCertificateCourse([]);
      setDegreeCourse([]);
    };
  }, [onClose]);

  const handleBulk = () => {
    router.push('/online-courses-combo');
    onClose();
  }


  if (loading) return <Progress />;

  return (
  <div className="border top-0 shadow-xl z-[1000] fixed w-full bg-white border-t">
  <div className="flex flex-col sm:flex-row relative h-screen bg-gray-100">
    {/* Close button - adjusted for mobile */}
    <button
      onClick={onClose}
      className="absolute bg-gray-300 border-gray-400 border rounded-full p-2 right-2 sm:right-4 top-2 sm:top-4 text-gray-600 hover:text-gray-900 transition-colors duration-200 z-10"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-4 w-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M6 18L18 6M6 6l12 12"
        />
      </svg>
    </button>

    {/* --- Sidebar - horizontal scroll on mobile, vertical on larger screens --- */}
    <aside className="w-full sm:w-48 md:w-64 lg:w-72 bg-[#31b5d9] text-white px-2 sm:px-4 py-2 sm:py-4 rounded-none sm:rounded-r-3xl shadow-xl animate-fade-in-left">
     <div className='flex items-center justify-between mb-4'>
      <h2 className="text-base sm:text-lg font-semibold   uppercase tracking-wider hidden sm:block">
        Courses
      </h2>
      <p onClick={()=> {router.push('/'); onClose();}} className='cursor-pointer'>{`<< Back To Home`}</p>
      </div>
      <ul className="flex flex-row sm:flex-col overflow-x-auto sm:overflow-visible space-x-2 sm:space-x-0 sm:space-y-2 pb-1 sm:pb-0">
        {getCategoryData.map((category: any, index: number) => (
          <li
            key={index}
            onClick={() => handleMouseHover(category, index)}
            className={`${
              activeIndex === index
                ? "bg-[#3473dd]"
                : "hover:bg-[#4bc3e3]"
            } py-2 sm:py-3 px-3 sm:px-5 rounded-lg cursor-pointer transition-all duration-300 font-medium whitespace-nowrap sm:whitespace-normal text-sm sm:text-base`}
          >
            {category.name}
          </li>
        ))}
      </ul>
    </aside>

    {/* --- Main Section --- */}
    <main className="flex-1 p-4 sm:p-6 md:p-8 animate-fade-in-up overflow-y-auto">
      {/* Breadcrumb */}
      <div className="flex items-center space-x-2 sm:space-x-4 mb-4">
        <FaHouse
          className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600 cursor-pointer"
          onClick={() => {
            router.push('/');
            onClose();
          }}
        />
        <FaChevronRight className="text-xs text-gray-500" />
        <div className="text-lg sm:text-xl text-gray-700 font-bold truncate">
          {activeCategoryName || "Loading..."}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-4 sm:space-x-6 mt-2 sm:mt-4 border-b pb-2 overflow-x-auto">
        <span
          className={`cursor-pointer transition-all duration-300 whitespace-nowrap ${
            activeTab === "certificate"
              ? "text-[#31b5d9] border-b-4 border-[#31b5d9] pb-1 font-semibold"
              : "text-gray-500 hover:text-[#31b5d9]"
          }`}
          onClick={() => setActiveTab("certificate")}
        >
          Certificate Program
        </span>

        {degreeCourse?.length > 0 && (
          <span
            className={`cursor-pointer transition-all duration-300 whitespace-nowrap ${
              activeTab === "micro"
                ? "text-[#31b5d9] border-b-4 border-[#31b5d9] pb-1 font-semibold"
                : "text-gray-500 hover:text-[#31b5d9]"
            }`}
            onClick={() => setActiveTab("micro")}
          >
            Micro Degree
          </span>
        )}
      </div>

   
     {/* Courses Grid */}
{certificateCourse?.length > 0 || degreeCourse?.length > 0 ? (
  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4 mt-4 sm:mt-6 max-h-[calc(100vh-220px)] overflow-y-auto pb-4">
    {(activeTab === "certificate" ? certificateCourse : degreeCourse)?.map(
      (item: any, index: number) => (
        <div
          key={index}
          className=" p-3 md:p-4 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 animate-fade-in border border-gray-100 flex flex-col justify-between"
        >
         <div className="flex flex-row md:flex-col lg:flex-row gap-2 sm:gap-3">
            <div className="w-16 h-16 md:w-full lg:w-16 sm:w-20 sm:h-20 bg-gradient-to-r from-[#31b5d9] to-[#4bc3e3] rounded-lg overflow-hidden flex-shrink-0">
              <img
                src={item?.banner ? `${item?.banner}` : defaultBanner}
                alt="Course Banner"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-gray-700 text-sm md:text-sm lg:text-base mb-1 line-clamp-2">
                {item.title}
              </h3>
              <div className="flex flex-wrap items-center gap-2 text-xs text-gray-600 min-w-0">
                {item.level !== "unknown" && (
                  <div className="flex items-center whitespace-nowrap min-w-0">
                    <svg
                      className="w-3 h-3 sm:w-4 sm:h-4 mr-1 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <p className="truncate">{item.duration}</p>
                  </div>
                )}
                {item.level !== "unknown" && (
                  <span className="bg-gray-100 px-2 py-0.5 rounded-full text-xs inline-block max-w-full truncate">
                    {item.level}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="mt-3 pt-2 border-t border-gray-100">
            <button
              onClick={() => handleNavigate(item)}
              className="text-blue-500 font-medium text-sm hover:underline"
            >
              Learn more <span>&raquo;</span>
            </button>
          </div>
        </div>
      )
    )}
  </div>
) : (
  
        <div className="flex flex-col items-center justify-center h-[50vh] sm:h-[60vh]">
          <svg
            className="w-16 h-16 sm:w-20 sm:h-20 text-gray-400 mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h3 className="text-lg sm:text-xl font-semibold text-gray-700 mb-2">
            No Courses Found
          </h3>
          <p className="text-sm sm:text-base text-gray-500 text-center px-4">
            There are no courses available in this category yet.
          </p>
        </div>
      )}
    </main>

    {/* --- Right Side Ads Section - hidden on mobile --- */}
    <aside className="hidden sm:block w-28 md:w-32 lg:w-44 xl:w-48 p-2 sm:p-4 animate-fade-in-right">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden sticky top-4">
        <Image
          src={image}
          alt="Promotional content"
          className="w-full h-auto object-cover"
        />
        <div className="p-2 sm:p-3">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900">Bulk Offer</h3>
          <p className="text-gray-600 text-xs sm:text-sm mt-1">
            Get 20% off on all courses this month!
          </p>
          <button
            onClick={handleBulk}
            className="mt-2 w-full bg-[#31b5d9] text-white py-1.5 sm:py-2 text-sm rounded-lg hover:bg-purple-700 transition-colors duration-300"
          >
            Learn More
          </button>
        </div>
      </div>
    </aside>
  </div>
</div>
  );
}

export default Programs;



// 'use client'
// import React, { useEffect, useState } from 'react'
// import { useRouter } from 'next/navigation'
// import HomeApiService from '@/services/homeApi'
// import Progress from '../Progress'
// import Image from 'next/image'
// import image from '@/public/images/image.png'
// import { FaChevronRight, FaHouse } from 'react-icons/fa6'
// import Link from 'next/link'

// interface ProgramsProps {
//   onClose: () => void
// }

// function Programs({ onClose }: ProgramsProps) {
//   const router = useRouter()
//   const defaultBanner =
//     "https://miro.medium.com/v2/resize:fit:720/format:webp/1*U4gZLnRtHEeJuc6tdVLwPw.png";

//   const [loading, setLoading] = useState(false);
//   const [getCategoryData, setGetCategoryData] = useState<any[]>([]);
//   const [certificateCourse, setCertificateCourse] = useState<any[]>([]);
//   const [degreeCourse, setDegreeCourse] = useState<any[]>([]);
//   const [activeTab, setActiveTab] = useState("certificate");
//   const [activeIndex, setActiveIndex] = useState(0);
//   const [activeCategoryName, setActiveCategoryName] = useState<string>("");

//   // ✅ Fetch categories and set initial active category
//   useEffect(() => {
//     const fetchCategories = async () => {
//       setLoading(true);
//       try {
//         const res = await HomeApiService.getCategoryByPublicAndPrivate();
//         if (res?.data?.length > 0) {
//           const firstCategory = res.data[0];
//           setGetCategoryData(res.data);
//           setActiveCategoryName(firstCategory.name);
//           setCertificateCourse(firstCategory["certificate programme"]);
//           setDegreeCourse(firstCategory["micro degree"]);
//         }
//       } catch (error) {
//         console.error(error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchCategories();
//   }, []);
//   // console.log("getCategoryData", getCategoryData);

//   // ✅ Handle hover/click on category
//   const handleMouseHover = (category: any, index: number) => {
//     setActiveTab("certificate");
//     setActiveIndex(index);
//     setActiveCategoryName(category.name);
//     setCertificateCourse(category["certificate programme"]);
//     setDegreeCourse(category["micro degree"]);
//   };

//   // ✅ Handle navigation
//   const handleNavigate = (item: any) => {
//     setLoading(true);
//     const slug = item.title
//           ?.toLowerCase()
//           .replace(/\s+/g, '-')
//           .replace(/:/g, '-')
//           .replace(/[^a-z0-9\-]+/g, '')
//           .replace(/-+/g, '-')
//           .replace(/^-|-$/g, '');
//     router.push(`/courses/${slug}`);
//     onClose();
//     setLoading(false);
//   };

//   // ✅ Reset when closed
//   useEffect(() => {
//     return () => {
//       setActiveCategoryName("");
//       setActiveIndex(0);
//       setActiveTab("certificate");
//       setCertificateCourse([]);
//       setDegreeCourse([]);
//     };
//   }, [onClose]);

//   const handleBulk = () => {
//     router.push('/online-courses-combo');
//     onClose();
//   }


//   if (loading) return <Progress />;

//   return (
//     <div className="border top-0 shadow-xl z-[1000] fixed w-full bg-white border-t">
//       <div className="flex relative h-screen bg-gray-100">
//          <button
//                     onClick={onClose}
//                     className="absolute bg-gray-300 border-gray-400 border rounded-full p-2 right-4 top-4 text-gray-600 hover:text-gray-900 transition-colors duration-200"
//                 >
//                     <svg
//                         xmlns="http://www.w3.org/2000/svg"
//                         className="h-4 w-4"
//                         fill="none"
//                         viewBox="0 0 24 24"
//                         stroke="currentColor"
//                     >
//                         <path
//                             strokeLinecap="round"
//                             strokeLinejoin="round"
//                             strokeWidth={2}
//                             d="M6 18L18 6M6 6l12 12"
//                         />
//                     </svg>
//                 </button>
//         {/* --- Sidebar --- */}
//         <aside className="w-72 bg-[#31b5d9] text-white px-4 rounded-r-3xl shadow-xl animate-fade-in-left">
//           <h2 className="text-lg font-semibold mb-4 uppercase tracking-wider">Categories</h2>
//           <ul className="space-y-2  ">
//             {getCategoryData.map((category: any, index: number) => (
//               <li
//                 key={index}
//                 onClick={() => handleMouseHover(category, index)}
//                 className={`${activeIndex === index
//                   ? "bg-[#3473dd]"
//                   : "hover:bg-[#4bc3e3]"
//                   } py-3 px-5 rounded-lg cursor-pointer transition-all duration-300 font-medium`}
//               >
//                 {category.name}
//               </li>
//             ))}
//           </ul>
//         </aside>

//         {/* --- Main Section --- */}
//         <main className="flex-1 p-8 animate-fade-in-up">
//           <div className="flex items-center space-x-4 mb-4">
//             <FaHouse
//               className="w-6 h-6 text-gray-600 cursor-pointer"
//               onClick={() => {
//                 router.push('/');
//                 onClose();
//               }}
//             />
//             <FaChevronRight className="text-xs text-gray-500" />
//             <div className="text-xl text-gray-700 font-bold">
//               {activeCategoryName || "Loading..."}
//             </div>
//           </div>

//           {/* Courses Section */}
//            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"></div>
//                     <div className="flex space-x-6 mt-4 border-b pb-2">
//                          <span
//                             className={`cursor-pointer transition-all duration-300 ${activeTab === "certificate"
//                                 ? "text-[#31b5d9] border-b-4 border-[#31b5d9] pb-1 font-semibold"
//                                 : "text-gray-500 hover:text-[#31b5d9]"
//                                 }`}
//                             onClick={() => setActiveTab("certificate")}
//                         >
//                             Certificate Program
//                         </span>

//                         {degreeCourse?.length > 0 && (
//                             <span
//                                 className={`cursor-pointer transition-all duration-300 ${activeTab === "micro"
//                                     ? "text-[#31b5d9] border-b-4 border-[#31b5d9] pb-1 font-semibold"
//                                     : "text-gray-500 hover:text-[#31b5d9]"
//                                     }`}
//                                 onClick={() => setActiveTab("micro")}
//                             >
//                                 Micro Degree
//                             </span>
//                         )}
//                     </div>
//                     {certificateCourse?.length > 0 || degreeCourse?.length > 0 ? (
//                         <div className="grid lg:grid-cols-2 xl:grid-cols-3 h-[85%]  overflow-y-scroll gap-2 mt-6">
//                             {(activeTab === "certificate"
//                                 ? certificateCourse
//                                 : degreeCourse
//                             )?.map((item: any, index: number) => (
//                                 <div
//                                     key={index}
//                                     className="bg-white p-4 max-h-44 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 animate-fade-in border border-gray-100 flex flex-col justify-between"
//                                 >
//                                     <div className="flex">
//                                         <div className="bg-gradient-to-r w-1/4 from-[#31b5d9] to-[#4bc3e3] text-white h-20 rounded-lg">
//                                             <img
//                                                 src={
//                                                     item?.banner ? `${item?.banner}` : defaultBanner
//                                                 }
//                                                 alt="Course Banner"
//                                                 className="w-full h-full object-cover rounded"
//                                             />
//                                         </div>

//                                         <div className="flex pl-2 flex-col w-3/4 items-start text-sm text-gray-600 mb-1 ">
//                                             <h3 className=" font-medium text-gray-700 text-sm mb-2">
//                                                 {item.title}
//                                             </h3>
//                                             <div className=" items-start flex-col xl:flex-row lg:flex-row xl:justiny-between lg:justify-between">
//                                                 {item.level !== "unknown" && (
//                                                     <div className="flex whitespace-nowrap">
//                                                         <svg
//                                                             className="w-4 h-4 mr-1"
//                                                             fill="none"
//                                                             stroke="currentColor"
//                                                             viewBox="0 0 24 24"
//                                                         >
//                                                             <path
//                                                                 strokeLinecap="round"
//                                                                 strokeLinejoin="round"
//                                                                 strokeWidth="2"
//                                                                 d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
//                                                             />
//                                                         </svg>
//                                                         <p className="text-xs">{item.duration}</p>
//                                                     </div>
//                                                 )}
//                                                 {item.level !== "unknown" && (
//                                                     <div className="flex text-xs overflow-hidden pt-1 ">
//                                                         {item.level}
//                                                     </div>
//                                                 )}
//                                             </div>
//                                         </div>
//                                     </div>

//                                     <div className="">
//                                         <button
//                                             // onClick={() => onClickNavigate(item?.id)}


//                                             onClick={() => handleNavigate(item)}
//                                             className="text-blue-500 font-medium"
//                                         >
//                                             Learn more <span>&raquo;</span>
//                                         </button>
//                                         {/* <Link
//                                             // onClick={() => onClickNavigate(item?.id)}
                                           
//                                             href={`/courses/${item?.title.toLowerCase()?.replace(/\s+/g, "-")}/${item?.id}`}
//                                              onClick={onClose}
//                                             className="text-blue-500 font-medium"
//                                         >
//                                             Learn more <span>&raquo;</span>
//                                         </Link> */}
//                                     </div>
//                                 </div>
//                             ))}
//                         </div>
//                     ) : (
//                         <div className="flex flex-col items-center justify-center h-[60vh]">
//                             <svg
//                                 className="w-20 h-20 text-gray-400 mb-4"
//                                 fill="none"
//                                 stroke="currentColor"
//                                 viewBox="0 0 24 24"
//                             >
//                                 <path
//                                     strokeLinecap="round"
//                                     strokeLinejoin="round"
//                                     strokeWidth="2"
//                                     d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
//                                 />
//                             </svg>
//                             <h3 className="text-xl font-semibold text-gray-700 mb-2">
//                                 No Courses Found
//                             </h3>
//                             <p className="text-gray-500">
//                                 There are no courses available in this category yet.
//                             </p>
//                         </div>
//                     )}
//         </main>

//         {/* --- Right Side Ads Section --- */}
//         <aside className="w-32 xl:w-48 lg:w-44 space-y-6 animate-fade-in-right">
//           <div className="bg-white rounded-xl shadow-lg overflow-hidden">
//             <Image src={image} alt="Promotional content" className="w-full h-full object-cover" />
//             <div className="p-1">
//               <h3 className="text-lg font-semibold text-gray-900">Bulk Offer</h3>
//               <p className="text-gray-600 text-sm mt-1">
//                 Get 20% off on all courses this month!
//               </p>
//               <button
//               onClick={handleBulk}
//                className="mt-2 w-full bg-[#31b5d9] text-white py-2 rounded-lg hover:bg-purple-700 transition-colors duration-300">
//                 Learn More
//               </button>
//             </div>
//           </div>
//         </aside>
//       </div>
//     </div>
//   );
// }

// export default Programs;



