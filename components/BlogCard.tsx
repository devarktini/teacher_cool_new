import Link from 'next/link';
export default function BlogCard({ blog }: any) {
  // console.log("BlogCard", blog);
  return (
    //  <Link href={`/blog-listing/${blog.title.replace(/\s+/g, "-")}/${blog._id}`} className="no-underline ">
    <Link href={`/blogs/${blog.title
      .toLowerCase()                // convert to lowercase
      .replace(/[^a-z0-9\s-]/g, "") // remove special chars except spaces and -
      .trim()                       // remove leading/trailing spaces
      .replace(/\s+/g, "-")         // replace spaces with -
      }/${blog._id}`} 
      className="no-underline ">
      <div className="bg-white shadow-md w-[300px] rounded-xl overflow-hidden hover:shadow-lg transition">
        {/* <img src={blog.banner} alt={blog.title} className="w-full h-48 object-cover" /> */}
        <img src={`https://blogapi.gyprc.com${blog.imageUrl}`} alt={blog.title} className="w-full h-48 object-cover "
        />
        <div className="p-4">
          <h2 className="text-xl font-semibold">{blog.title}</h2>
          <p className="text-sm text-gray-600 mt-2">{blog.description}</p>
          <p className="text-xs text-gray-400 mt-1">{blog.date}</p>
        </div>
      </div>
    </Link>
  );
}
