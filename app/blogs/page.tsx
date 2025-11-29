import BlogCard from '@/components/BlogCard';


export const metadata = {
  title: "TeacherCool Blog | LMS Trends, EdTech Insights and Learning Tips",
  description:
    "Stay ahead in your tech career with TeacherCool’s expert blogs on Data Science, Analytics, Python, and IT skills. Get tips, trends, and learning strategies from industry mentors.",
  keywords:
    "Data Science blog, Analytics career tips, Python tutorials, IT training insights, TeacherCool blog, Machine Learning articles",
};


 async function fetchBlogDetailsByType() {
  try {
    
    const response = await fetch(`https://blogapi.gyprc.com/api/blogs/type/TeacherCool`, {
      headers: {
        'accept': '*/*',
      },
      cache: "no-store",
    });

    if (!response.ok) {
      // optionally handle non-2xx responses
      return null;
    }

    const data = await response.json();
    // console.log('Blog Details:', data);
    return data;
  } catch (error) {
    // console.error('Error fetching blog by ID:', error);
    return null;
  }
};
export default async function Page() {
  const data = await fetchBlogDetailsByType();
  console.log("dd",data)
  const blogData = data?.blogs || [];
  // console.log("dd",blogData)

  return (
    <main className="mx-auto px-4 py-8 mt-[4%]  w-full">
    
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-6 w-full justify-items-center">
        {blogData.map((blog: any) => (
          <BlogCard key={blog._id} blog={blog} />
        ))}
      </div>
    </main>

 
  );
}