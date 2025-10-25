'use client'
import React, { useState, useEffect } from "react";
import { IoSearchOutline } from "react-icons/io5";
import { Pagination } from "antd";
import StudentApiService from "@/services/studentApi";
import Progress from "../Progress";
import Table, { Column } from "../Table";
import RefundProcess from "./RefundCourse";

interface Payment {
  id: string;
  course_title: string;
  payment_date: string;
  status: string;
}

const Payments = () => {
  const [paymentData, setPaymentData] = useState<Payment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Payment[]>([]);
  const [activePaymentId, setActivePaymentId] = useState<string | null>(null);

  // ✅ Fetch payment data
  useEffect(() => {
    const fetchPaymentDetails = async () => {
      try {
        setLoading(true);
        const studentId = localStorage.getItem("id");
        if (!studentId) throw new Error("Student ID not found in localStorage.");

        const data:any = await StudentApiService.getPaymentApi(studentId);
        setPaymentData(data?.results || []);
        setSearchResults(data?.results || []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchPaymentDetails();
  }, []);

  // ✅ Search handler
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setQuery(value);
    if (value.trim()) {
      const filteredResults = paymentData.filter((item) =>
        item?.course_title?.toLowerCase().includes(value.toLowerCase())
      );
      setSearchResults(filteredResults);
    } else {
      setSearchResults(paymentData);
    }
  };

  // ✅ Toggle refund modal
  const toggleModal = (id: string | null) => {
    setIsModalOpen((prev) => !prev);
    setActivePaymentId(id);
  };

  const handleRefund = (paymentId: string) => {
    toggleModal(paymentId);
    console.log("Refund initiated for:", paymentId);
  };

  const displayData = searchResults.length > 0 ? searchResults : paymentData;

  // ✅ Define table columns
  const columns: Column<Payment>[] = [
    {
      key: "id",
      header: "Payment ID",
      sortable: true,
      render: (row) => (
        <span className="font-medium text-gray-800">{row.id}</span>
      ),
      width: "180px",
    },
    {
      key: "course_title",
      header: "Course Name",
      sortable: true,
      render: (row) => <span className="text-gray-700">{row.course_title}</span>,
      width: "220px",
    },
    {
      key: "payment_date",
      header: "Purchase Date",
      render: (row) => (
        <span className="text-gray-600">
          {row.payment_date?.split("T")[0]}
        </span>
      ),
      width: "180px",
    },
    {
      key: "status",
      header: "Status",
      render: (row) => (
        <span
          className={`block py-1 px-3 rounded-full w-fit text-xs font-medium m-auto text-center ${
            row.status === "Completed"
              ? "text-emerald-600 bg-emerald-50"
              : row.status === "Pending"
              ? "text-yellow-600 bg-yellow-50"
              : "text-orange-600 bg-orange-50"
          }`}
        >
          {row.status}
        </span>
      ),
      width: "150px",
    },
    {
      key: "refund",
      header: "Apply for Refund",
      render: (row) => (
        <>
          <button
            onClick={() => handleRefund(row.id)}
            className="text-red-500 hover:text-red-600 border-b border-red-500 text-sm"
          >
            Refund Course
          </button>

          {isModalOpen && activePaymentId === row.id && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
              <div className="bg-white rounded-lg shadow-xl p-8 w-[95%] max-w-lg h-auto relative">
                <button
                  className="text-gray-500 hover:text-gray-700 text-2xl absolute top-4 right-4 transition-colors duration-300"
                  onClick={() => toggleModal(null)}
                >
                  ✕
                </button>
                <div className="mt-4">
                  <RefundProcess paymentId={row.id} courseName={row.course_title} />
                  <p className="text-center text-gray-700 font-medium">
                    Refund request for {row.course_title}
                  </p>
                </div>
              </div>
            </div>
          )}
        </>
      ),
      width: "160px",
    },
  ];

  // ✅ Loading & error states
  if (loading) return <Progress />;
  if (error) return <p className="text-red-600 text-center py-6">{error}</p>;

  // ✅ Render
  return (
    <div className="bg-white rounded-md shadow-md my-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center py-4 px-4">
        {/* Search */}
        <div className="relative w-full md:w-64 mb-2 md:mb-0">
          <input
            type="text"
            placeholder="Search..."
            value={query}
            onChange={handleChange}
            className="bg-white w-full h-10 rounded pl-9 pr-1 border outline-none"
          />
          <div className="absolute top-3 left-4 text-gray-500">
            <IoSearchOutline />
          </div>
        </div>

        {/* Title */}
        <span className="font-semibold text-lg text-[#1E1E1E] font-Roboto">
          Payments
        </span>
      </div>

      {/* Table */}
      <div className="border-t border-gray-200">
        <Table<Payment>
          data={displayData}
          columns={columns}
          striped
          bordered
          dense
          stickyHeader
          headerColor="#F9FAFB"
          hoverColor="#F6F9FE"
          emptyMessage="No payments found."
          containerClassName="overflow-x-auto"
        />
      </div>

      {/* Optional Pagination */}
      <div className="py-4 flex justify-end px-6">
        <Pagination
          showSizeChanger
          showQuickJumper
          defaultCurrent={1}
          total={displayData.length}
          pageSize={10}
        />
      </div>
    </div>
  );
};

export default Payments;


// 'use client'
// import React, { useState, useEffect } from "react";
// import { IoSearchOutline } from "react-icons/io5";
// import { Pagination } from "antd";
// import StudentApiService from "@/services/studentApi";
// import Progress from "../Progress";



// const Payments = () => {
//   const [paymentData, setPaymentData] = useState<any>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState(null);
//   const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
//   const [query, setQuery] = useState("");
//   const [searchResults, setSearchResults] = useState<any>([]);
//   const [activePaymentId, setActivePaymentId] = useState(null);
 
//   const toggleModal = (id:any) => {
//     setIsModalOpen((prev) => !prev);
//     setActivePaymentId(id);
//   };


//   useEffect(() => {
//     const fetchPaymentDetails = async () => {
//       try {
//         setLoading(true);

//         const studentId = localStorage.getItem("id");
//         if (!studentId) {
//           throw new Error("Student ID not found in localStorage.");
//         }

//         const data = await StudentApiService.getPaymentApi(studentId);
//         // console.log(data?.results)
//         setPaymentData(data?.results);
//         setSearchResults(data?.results);
//       } catch (err:any) {
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchPaymentDetails();
//   }, []);

//   const handleChange = (e:any) => {
//     const { value } = e.target;
//     setQuery(value);
//     if (value.trim()) {
//       const filteredResults = paymentData.filter((item:any) =>
//         item?.course_title?.toLowerCase().includes(value.toLowerCase())
//       );
//       setSearchResults(filteredResults);
//     } else {
//       setSearchResults(paymentData);
//     }
//   };

//   // Displaying either filtered or all data
//   const displayData = searchResults.length > 0 ? searchResults : paymentData;

//   if (loading) return <Progress/>;
//   if (error) return <p>Error fetching data: {error} 🚨</p>;

//   return (
//     <>
//        <div className="bg-white rounded-md shadow-md  my-4 ">
//         <div className="flex flex-col md:flex-row justify-between items-center py-4 px-4">
//           {/* Sort and Search Section */}
//           <div className="flex flex-col md:flex-row gap-3 items-center w-full md:w-auto">
  
//             <div className="relative w-full md:w-64">
//               <input
//                 type="text"
//                 placeholder="Search..."
//                 value={query}
//                 onChange={handleChange} // Correct event binding
//                 className="bg-white w-full h-10 rounded pl-9 pr-1 border outline-none"
//               />
//               <div className="absolute top-3 left-4">
//                 <IoSearchOutline />
//               </div>
//             </div>
//           </div>

//           {/* Title Section */}
//           <div className="mt-3 md:mt-0">
//             <span className="font-semibold font-Roboto text-lg text-[#1E1E1E]">
//               Payments
//             </span>
//           </div>
//         </div>
//         <div className="border-t border-gray-200">
//           <div className="flex flex-col">
//             <div className="overflow-x-auto ">
//               <div className="inline-block min-w-full py-2 ">
//                 <div className="overflow-x-auto">
//                   <table className=" text-left overflow-x-scroll   divide-y    ">
//                     <thead className="">
//                       <tr>
//                         <th
//                           scope="col"
//                           className=" px-4 font-Roboto text-sm  text-[#1E1E1E] font-semibold text-opacity-90 whitespace-nowrap py-3 w-[200px] text-center tracking-wider"
//                         >
//                           Payment Id
//                         </th>
//                         <th
//                           scope="col"
//                           className=" px-4 whitespace-nowrap text-center font-Roboto font-semibold text-sm  text-[#1E1E1E] text-opacity-90 py-3 w-[200px]  tracking-wider rounded-lg"
//                         >
//                           Course Name
//                         </th>

//                         <th
//                           scope="col"
//                           className=" px-4 font-Roboto text-sm font-semibold text-[#1E1E1E] text-opacity-90 whitespace-nowrap py-3 w-[200px] text-center tracking-wider"
//                         >
//                           Purchase Date
//                         </th>

//                         <th
//                           scope="col"
//                           className=" px-4 font-Roboto text-sm font-semibold text-[#1E1E1E] text-opacity-90 whitespace-nowrap py-3 w-[200px] text-center tracking-wider"
//                         >
//                           Status
//                         </th>

//                         {/* <th
//                           scope="col"
//                           className=" px-4 font-Roboto text-sm font-semibold text-[#1E1E1E] text-opacity-90 whitespace-nowrap py-3 w-[200px] text-center tracking-wider"
//                         >
//                           Invoice
//                         </th> */}
//                         <th
//                           scope="col"
//                           className=" px-4 font-Roboto text-sm font-semibold text-[#1E1E1E] text-opacity-90 whitespace-nowrap py-3 w-[200px] text-center tracking-wider"
//                         >
//                           Apply for Refund
//                         </th>
//                       </tr>
//                     </thead>

//                     <tbody className="bg-white divide-y divide-gray-200">
//                       {displayData.length > 0 ? (
//                         displayData?.map((item:any, ind:any) => (
//                           <tr key={ind} className="hover:bg-[#f6f9fe]">
//                             <td className="px-4 py-4 font-normal whitespace-nowrap font-Roboto text-center text-[#1E1E1E] text-opacity-90 text-sm">
//                               {item?.id}
//                             </td>
//                             <td className="px-4 py-4 font-normal whitespace-nowrap font-Roboto text-center text-[#1E1E1E] text-opacity-90 text-sm">
//                               {item?.course_title}
//                             </td>
//                             <td className="px-4 py-4 font-normal whitespace-nowrap font-Roboto text-opacity-90 text-center text-[#1E1E1E] text-sm">
//                               {item?.payment_date?.split("T")[0]}
//                             </td>
//                             <td className="px-4 py-4 whitespace-nowrap text-center m-auto">
//                               <span
//                                 className={`${item?.status === "Completed"
//                                   ? "text-[#07B89E] bg-[#DCF6F3]"
//                                   : "text-[rgb(253,137,57)] bg-[#FFEBDD]"
//                                   } block py-2 rounded-full w-28 font-Montserrat font-medium text-center m-auto text-xs`}
//                               >
//                                 {item?.status}
//                               </span>
//                             </td>
//                             <td className="px-4 py-4 whitespace-nowrap font-medium font-Roboto text-center text-[#F54348] text-sm">
//                               <button
//                                 className="border-b-[1px] leading-3 border-[#F54348]"
//                                 // onClick={toggleModal}
//                                 onClick={() => toggleModal(item?.id)}
//                               >
//                                 Refund Course
//                               </button>

//                               {isModalOpen && activePaymentId === item?.id && (
//                                 <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
//                                   <div className="bg-white rounded-lg shadow-xl p-8 w-[95%] max-w-lg h-auto relative">
//                                     <button
//                                       className="text-gray-500 hover:text-gray-700 text-2xl absolute top-4 right-4 transition-colors duration-300"
//                                       onClick={toggleModal}
//                                     >
//                                       ✕
//                                     </button>
//                                     <div className="mt-4">
//                                       {/* <RefundProcess paymentId={item?.id} courseName={item?.course_title} /> */}
//                                     </div>
//                                   </div>
//                                 </div>
//                               )}
//                             </td>

//                           </tr>
//                         ))
//                       ) : (
//                         <tr>
//                           <td
//                             colSpan={5}
//                             className="px-4 py-4 text-center text-sm text-gray-500 font-Roboto"
//                           >
//                             No payments.
//                           </td>
//                         </tr>
//                       )}
//                     </tbody>



//                   </table>
//                 </div>
//               </div>
//             </div>
//           </div>


//           {/* <div className="py-4 ">
//             <Pagination
//               showSizeChanger
//               showQuickJumper
//               onShowSizeChange={onShowSizeChange}
//               defaultCurrent={1}
//               total={50}
//             />
//           </div> */}

//         </div>
//       </div>
   
//     </>
//   );
// };

// export default Payments;