import BlogCard from '@/components/BlogCard';
import axios from 'axios';
 async function fetchBlogDetailsByType() {
  try {
    const response = await axios.get(`https://blogapi.gyprc.com/api/blogs/type/TeacherCool`, {
      headers: {
        'accept': '*/*',
      },
    });

    // console.log('Blog Details:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching blog by ID:', error);
    return null;
  }
};

export default async function Page() {
  const data = await fetchBlogDetailsByType();
  // console.log("dd",data)
  const blogData = data.blogs || [];
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