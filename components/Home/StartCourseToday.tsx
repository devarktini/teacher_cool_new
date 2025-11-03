"use client";
import React, { useEffect, useState } from "react";
import Card from "../ui/cards/Card";
import HomeApiService from "@/services/homeApi";
import Link from "next/link";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

// -----------------------------
// Type Definitions
// -----------------------------
interface SalaryData {
  label: string;
  value: number;
}

interface Category {
  id: string | number;
  cat_name: string;
  description?: string | null;
  course_count: number;
  salary?: SalaryData[];
}

interface Course {
  id: string | number;
  name: string;
  description?: string;
  [key: string]: any;
}

interface PieChartProps {
  selectedCourseData: SalaryData[];
}

// -----------------------------
// Main Component
// -----------------------------
const StartCourseToday: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [filteredCategories, setFilteredCategories] = useState<Category[]>([]);
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [activeCatId, setActiveCatId] = useState<string | number | null>(null);
  const [courseData, setCourseData] = useState<Course[]>([]);

  useEffect(() => {
    HomeApiService.getAllCategory({ all_data: true }).then((res: any) => {
      const allCategories: Category[] = res?.results || [];
      const validCategories = allCategories.filter(
        (cat) => cat.course_count > 0
      );
      setCategories(validCategories);

      if (validCategories.length > 0) {
        setActiveIndex(0);
        setFilteredCategories([validCategories[0]]);
        setActiveCatId(validCategories[0].id);
      }
    });
  }, []);

  useEffect(() => {
    if (activeCatId) {
      HomeApiService.getCourseByCatId(activeCatId)
        .then((res: any) => {
          // console.log(res.data)
          setCourseData(res?.data || []);
        })
        .catch((err: any) => console.error("Error fetching course data:", err));
    }
  }, [activeCatId]);

  const handleItemClick = (index: number) => {
    setActiveIndex(index);
    const selectedCategory = categories[index];
    setFilteredCategories([selectedCategory]);
    setActiveCatId(selectedCategory.id);
  };

  return (
    <div className="container mx-auto px-5 py-4  ">
      <h2 className="font-semibold text-3xl ">
        Get Started with your Courses Today!
      </h2>

      <div className="relative h-[2.23rem] my-4">
        {categories.some((cat) => cat.course_count > 0) && (
          <div
            className="
        flex gap-5 cursor-pointer 
        scroll-container hide-scrollbar   
        whitespace-nowrap                   // ✅ keeps items in one line
        scrollbar-hide                      // ✅ optional: hides scrollbar (needs plugin)
      "
          >
            {categories
              .filter((cat) => cat.course_count > 0)
              .map((cat, index) => (
                <p
                  key={cat.id}
                  className={`px-2 ${
                    activeIndex === index
                      ? "active border-b bottom-6 border-blue-500"
                      : ""
                  }`}
                  onClick={() => handleItemClick(index)}
                >
                  {cat.cat_name}
                </p>
              ))}
          </div>
        )}
      </div>

      <div className="border-2 border-solid border-gray-300 rounded overflow-hidden">
        <div className="mt-6 mx-10 max-sm:mx-2 max-lg:mt-5 ">
          <div className="w-full flex flex-wrap max-sm:flex-row justify-center md:justify-between ">
            <h1 className="font-semibold text-3xl max-lg:text-center max-sm:w-full max-sm:mb-4">
              {filteredCategories[0]?.cat_name}
            </h1>
            <Link
              href="/for-individual"
              className="font-medium text-base w-[10rem] h-8 flex items-center justify-center text-gray-900"
              onClick={() => window.scrollTo(0, 0)}
            >
              Explore all courses <span>&raquo;</span>
            </Link>
          </div>
          <div className="flex mt-4 justify-between items-center">
            {filteredCategories[0]?.description !== "null" && (
              <p className="text-textColor max-lg:text-center">
                {filteredCategories[0]?.description}
              </p>
            )}
          </div>
        </div>
        {filteredCategories?.map((item) => (
          <div
            key={item.id}
            className="flex flex-wrap md:flex-nowrap gap-6 p-4"
          >
            {/* Pie Chart */}
            <div className="w-full md:[200px] lg:w-[300px] flex items-center ">
              {item.salary && Array.isArray(item.salary) ? (
                <PieChartComponent selectedCourseData={item.salary} />
              ) : (
                <p>No salary data found for this category.</p>
              )}
            </div>

            {/* Cards */}
            <div className="w-full md:w-2/3 md:flex items-end gap-2 overflow-x-auto scroll-container hide-scrollbar">
              {courseData?.length > 0 ? (
                // console.log("dd",courseData),
                <Card data={courseData} />
              ) : (
                <p>No courses found for this category.</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StartCourseToday;

// -----------------------------
// PieChart Component
// -----------------------------
const PieChartComponent: React.FC<PieChartProps> = ({ selectedCourseData }) => {
  const labels = selectedCourseData.map((item) => item.label);
  const values = selectedCourseData.map((item) => item.value);

  const data = {
    labels,
    datasets: [
      {
        label: "Salary Distribution",
        data: values,
        backgroundColor: [
          "rgba(255, 99, 132, 0.5)",
          "rgba(54, 162, 235, 0.5)",
          "rgba(75, 192, 192, 0.5)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(75, 192, 192, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top" as const },
      title: { display: true, text: "Salary Distribution by Level" },
    },
  };

  return (
    <div className="bg-white shadow-md rounded-md p-4 w-full h-full flex items-center justify-center gap-10">
      <Pie data={data} options={options} />
    </div>
  );
};
