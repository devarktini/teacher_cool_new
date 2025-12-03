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
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [activeCatId, setActiveCatId] = useState<string | number | null>(null);
  const [courseData, setCourseData] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch all categories on mount
  useEffect(() => {
    HomeApiService.getAllCategory({ all_data: true })
      .then((res: any) => {
        const allCategories: Category[] = res?.results || [];
        const validCategories = allCategories.filter(
          (cat) => cat.course_count > 0
        );
        setCategories(validCategories);

        if (validCategories.length > 0) {
          setActiveIndex(0);
          setActiveCatId(validCategories[0].id);
        }
      })
      .catch((err: any) => {
        console.error("Error fetching categories:", err);
        setError("Failed to load categories");
      });
  }, []);

  // Fetch courses when active category changes
  useEffect(() => {
    if (activeCatId) {
      setIsLoading(true);
      setError(null);
      setCourseData([]); // Clear previous data

      // console.log("ddd", activeCatId)
      HomeApiService.getCourseByCatId(activeCatId)
        .then((res: any) => {
          const courses = res?.data || [];
          setCourseData(courses);
          // console.log("Fetched courses:", courses);
        })
        .catch((err: any) => {
          console.error("Error fetching course data:", err);
          setError("Failed to load courses");
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [activeCatId]);

  const handleItemClick = (index: number) => {
    // console.log("Category index clicked:", index);
    setActiveIndex(index);
    const selectedCategory = categories[index];
    // console.log("Selected category ID:", selectedCategory.id);
    setActiveCatId(selectedCategory.id);
  };

  const activeCategory = categories[activeIndex];


  return (
    <div className="container mx-auto px-5 py-4">
      <h2 className="font-semibold text-3xl">
        Get Started with your Courses Today!
      </h2>

      {/* Category Navigation */}
      {/* <div className="relative h-[2.23rem] my-4">
        {categories.length > 0 && (
          <div className="flex gap-5 cursor-pointer scroll-container  whitespace-nowrap">
            {categories.map((cat, index) => (
              <p
                key={cat.id}
                className={`px-2 transition-all ${activeIndex === index
                    ? "active border-b-2 border-blue-500 font-semibold"
                    : "hover:text-blue-500"
                  }`}
                onClick={() => handleItemClick(index)}
              >
                {cat.cat_name}
              </p>
            ))}
          </div>
        )}
      </div> */}
      <div className="relative h-[2.23rem] my-4 ">
        {categories.length > 0 && (
          <div className="flex gap-5 py-2 cursor-pointer scroll-container whitespace-nowrap overflow-x-auto">
            {categories.map((cat, index) => (
              <p
                key={cat.id}
                className={`px-2 transition-all ${activeIndex === index
                    ? "active border-b-2 border-blue-500 font-semibold"
                    : "hover:text-blue-500"
                  }`}
                onClick={() => handleItemClick(index)}
              >
                {cat.cat_name}
              </p>
            ))}
          </div>
        )}
      </div>



      {/* Main Content */}
      <div className="border-2 border-solid border-gray-300 rounded overflow-hidden">
        <div className="mt-6 mx-10 max-sm:mx-2 max-lg:mt-5">
          <div className="w-full flex flex-wrap max-sm:flex-row justify-center md:justify-between">
            <h1 className="font-semibold text-3xl max-lg:text-center max-sm:w-full max-sm:mb-4">
              {activeCategory?.cat_name || "Select a Category"}
            </h1>
            <Link
              href="/for-individual"
              className="font-medium text-base w-[10rem] h-8 flex items-center justify-center text-gray-900 hover:text-blue-500 transition-colors"
              onClick={() => window.scrollTo(0, 0)}
            >
              Explore all courses <span>&raquo;</span>
            </Link>
          </div>

          {/* Category Description */}
          {activeCategory?.description &&
            activeCategory.description !== "null" && (
              <div className="flex mt-4 justify-between items-center">
                <p className="text-textColor max-lg:text-center">
                  {activeCategory.description}
                </p>
              </div>
            )}
        </div>

        {/* Content Area with Pie Chart and Course Cards */}
        {activeCategory && (
          <div className="flex flex-wrap md:flex-nowrap gap-6 p-4">
            {/* Pie Chart Section */}
            <div className="w-full md:w-[200px] lg:w-[300px] flex items-center">
              {activeCategory.salary &&
                Array.isArray(activeCategory.salary) &&
                activeCategory.salary.length > 0 ? (
                <PieChartComponent selectedCourseData={activeCategory.salary} />
              ) : (
                <div className="bg-white shadow-md rounded-md p-4 w-full h-full flex items-center justify-center">
                  <p className="text-gray-500 text-center">
                    No salary data available for this category
                  </p>
                </div>
              )}
            </div>

            {/* Course Cards Section */}
            <div className="w-full md:w-[73%] md:flex items-end gap-2 overflow-x-auto scroll-container hide-scrollbar ">
              {error ? (
                <div className="w-full p-4 bg-red-50 text-red-600 rounded">
                  <p>{error}</p>
                </div>
              ) : isLoading ? (
                <div className="w-full p-4 flex items-center justify-center">
                  <div className="flex flex-col items-center gap-2">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                    <p className="text-gray-600">Loading courses...</p>
                  </div>
                </div>
              ) : courseData && courseData.length > 0 ? (
                // console.log("dd", courseData),
                <Card data={courseData} />
              ) : (
                <div className="w-full p-4 bg-gray-50 rounded">
                  <p className="text-gray-600 text-center">
                    No courses found for this category
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* No Categories Message */}
        {categories.length === 0 && (
          <div className="p-8 text-center text-gray-600">
            <p>No categories available at the moment</p>
          </div>
        )}
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
          "rgba(255, 99, 132, 0.6)",
          "rgba(54, 162, 235, 0.6)",
          "rgba(75, 192, 192, 0.6)",
          "rgba(255, 206, 86, 0.6)",
          "rgba(153, 102, 255, 0.6)",
          "rgba(255, 159, 64, 0.6)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
        ],
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: "bottom" as const,
        labels: {
          padding: 15,
          font: {
            size: 12,
          },
        },
      },
      title: {
        display: true,
        text: "Salary Distribution by Level",
        font: {
          size: 16,
          weight: "bold" as const,
        },
        padding: {
          top: 10,
          bottom: 20,
        },
      },
      tooltip: {
        callbacks: {
          label: function (context: any) {
            const label = context.label || "";
            const value = context.parsed || 0;
            const total = context.dataset.data.reduce(
              (acc: number, curr: number) => acc + curr,
              0
            );
            const percentage = ((value / total) * 100).toFixed(1);
            return `${label}: ${value} (${percentage}%)`;
          },
        },
      },
    },
  };

  return (
    <div className="bg-white shadow-md rounded-md p-4 w-full h-full flex items-center justify-center">
      <div className="w-full max-w-[280px]">
        <Pie data={data} options={options} />
      </div>
    </div>
  );
};

