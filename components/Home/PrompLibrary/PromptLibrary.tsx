'use client';

import React, { useEffect, useState } from 'react';
import HomeApiService from '@/services/homeApi';
import ViewPrompts from '@/components/Home/PrompLibrary/ViewPrompts';
import { useRouter } from 'next/navigation';

interface Category {
  id: string;
  title: string;
  description: string;
  prompt_count: number;
  slug:string
  // add other fields if needed (slug, etc.)
}

function PromptLibrary() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isView, setIsView] = useState<Boolean>(false);
  const [promptDetails, setPromtDetails] = useState(null);

  const fetchPromts = async () => {
    try {
      const res = await HomeApiService.promptLibraries();
      // adjust depending on your API: res or res.data or res.results
      const data: any = res;
      setCategories(data);
    } catch (err) {
      console.error('Failed to fetch prompt libraries', err);
    }
  };

  useEffect(() => {
    fetchPromts();
  }, []);

  const handleView = (data: any) => {
    setPromtDetails(data);
    setIsView(true)
  }
  return (
    <>
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-12">
            What's Inside the Library
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {categories.map((category) => (
              <div
                key={category.id}
                className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-gray-100"
              >
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  {category.title}
                </h3>
                <p className="text-gray-600 text-sm mb-3">
                  {category.description}
                </p>
                <div className="text-indigo-600 font-semibold cursor-pointer"
                  // onClick={() => handleView(category)}
                  onClick={() =>  router.push(`${category.slug}`)}
                >
                  {category.prompt_count} prompts
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* {isView && <ViewPrompts promtDetails={promptDetails} onClose={() => setIsView(false)} />} */}

    </>
  );
}

export default PromptLibrary;
