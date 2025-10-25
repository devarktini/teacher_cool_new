'use client'
import React, { useState, useEffect } from "react";
import { IoSearchOutline } from "react-icons/io5";
import toast from "react-hot-toast";
import StudentApiService from "@/services/studentApi";
import BookmarkCard from "@/components/ui/cards/BookmarkCard";



const BookMarks = () => {
  const studentId = localStorage.getItem('id')
  const [wishList, setWishList] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<any>([]);
  const [query, setQuery] = useState('');

  const getWishListData = async () => {
    try {
      setLoading(true);
      const res = await StudentApiService.getWishList(studentId);
      setWishList(res?.results); 
      setSearchResults(res?.results)
      // console.log("API Response: ", res.results);
      // toast.success("Wishlist fetched successfully");
    } catch (error:any) {
      console.error("Error fetching wishlist:", error);
      toast.error(error.response?.data?.message || "Failed to fetch wishlist");
    }finally{
      setLoading(false);
    }
  };
  useEffect(() => {
    getWishListData();
  }, []);

  const handleChange = (e:any)=>{
    const {value} = e.target;
    setQuery(value);
    if(value){
      const filteredResults = wishList.filter((item:any)=>
        item.course_details.title.toLowerCase().includes(value.toLowerCase())
      );

      setSearchResults(filteredResults)
    }else{
      setSearchResults(wishList)
    }
  }

 

  const handleDelete = async (id:any) => {
    try {
      const response = await StudentApiService.removeWishList(id);
      if (response) {
        toast.success("Wishlist removed");
  
        // Remove the deleted item from both wishList and searchResults
        setWishList((prevList:any) => prevList.filter((item:any) => item.id !== id));
        setSearchResults((prevResults:any) => prevResults?.filter((item:any) => item.id !== id));
        
      } else {
        toast.error("Failed to remove wishlist");
      }
    } catch (error) {
      console.error("Error deleting wishlist:", error);
      toast.error("Something went wrong");
    }
  };
  
  
  return (
    <div>
      
      <div className="bg-white rounded-md shadow-md py-4 px-4 my-4 ">
        <div className="flex flex-col md:flex-row justify-between items-center py-4 px-4">
          {/* Sort and Search Section */}
          <div className="flex flex-col md:flex-row gap-3 items-center w-full md:w-auto">
      
            <div className="relative w-full md:w-64">
              <input
                type="text"
                placeholder="Search..."
                value={query}
                onChange={handleChange}
                className="bg-white w-full h-10 rounded pl-9 pr-1 border outline-none"
              />
              <div className="absolute top-3 left-4">
                <IoSearchOutline />
              </div>
            </div>
          </div>

          {/* Title Section */}
          <div className="mt-3 md:mt-0">
            <span className="font-semibold font-Roboto text-lg text-[#1E1E1E]">
              Bookmarked
            </span>
          </div>
        </div>
        <div className="">
          <p className="font-Roboto font-semibold text-xl text-[#1E1E1E] text-opacity-90 my-4">
            All Bookmarked Courses
          </p>

          <BookmarkCard
          wishList= {wishList}
          loading= {loading}
          searchResults= {searchResults}
          handleDelete = {handleDelete}

          />
        </div>
      
      </div>
     
    </div>
  );
};
export default BookMarks;


