'use client';
import React, { useEffect, useState, ChangeEvent } from 'react';
import { FiEdit, FiTrash2, FiPlus, FiX } from 'react-icons/fi';
import Pagination from '@/components/common/Pagination';
import { selectAuth } from '@/store/features/authSlice';
import TeacherApiService from '@/services/teacherApi';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import AddSkillAbout from './AddSkillAbout';
import ModuleLectureManager from './ModuleLectureManager';
import DeleteCoursePopup from './DeleteCoursePopup';
import HomeApiService from '@/services/homeApi';

export interface Course {
  id?: number;
  title: string;
  type: string;
  description: string;
  instructor?: string;
  instructor_name?: string;
  category?: string | number;
  level?: string;
  duration?: string;
  banner?: string | File;
  price?: string;
  discount_percentage?: string;
  skills?: string[];
  mode?: string;
  is_active?: boolean;
  visibility?: boolean;
  assignment_link?: string;
  about?: string[];
  outcomes?: string[];
  modules?: Module[];
  published?: boolean;
}

// Also export other interfaces that might be used elsewhere
export interface Lecture {
  name: string;
}

export interface Module {
  module: string;
  lecture: Lecture[];
}

export interface PaginationData {
  current_page: number;
  total_pages: number;
  pageSize: number;
}

export interface Category {
  id: number;
  cat_name: string;
  course_count: number;
}

const TeacherCourse: React.FC = () => {
  const { user } = useSelector(selectAuth);
  const userDetails = user;

  const [courses, setCourses] = useState<Course[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [currentCourse, setCurrentCourse] = useState<Course | null>(null);
  const [showDeletePopup, setShowDeletePopup] = useState<boolean>(false);
  const [deletedId, setDeletedId] = useState<number | undefined>();
  const [categoryList, setCategoryList] = useState<Category[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [paginationData, setPaginationData] = useState<PaginationData>({
    current_page: 1,
    total_pages: 1,
    pageSize: 10,
  });

  const courseTypes = ['private', 'public', 'corporate', 'free'];
  const levels = [
    'beginner',
    'intermediate',
    'advanced',
    'beginner_to_advanced',
    'beginner_to_intermediate',
    'intermediate_to_advanced',
  ];
  const modes = ['online', 'offline', 'hybrid', 'instructor based'];

  const initialCourseState: Course = {
    title: '',
    type: 'public',
    description: '',
    instructor: '',
    instructor_name: '',
    category: '',
    level: '',
    duration: '',
    banner: '',
    price: '',
    discount_percentage: '0.00',
    skills: [],
    mode: '',
    is_active: false,
    visibility: false,
    assignment_link: '',
    about: [],
    outcomes: [],
    modules: [],
  };

  const [courseInformation, setCourseInformation] = useState<Course>(initialCourseState);

  // ==============================
  // Fetch courses and categories
  // ==============================
  const fetchCourses = async (page = 1, pageSize = 10) => {
    if (!userDetails?.id) return;
    setIsLoading(true);
    try {
      const res = await TeacherApiService.getCoursesByUser(
        userDetails.id,
        page,
        pageSize
      );
      if (res?.data) {
        setCourses(res.data.results || []);
        setFilteredCourses(res.data.results || []);
        setPaginationData({
          current_page: res.data.current_page || 1,
          total_pages: res.data.total_pages || 1,
          pageSize: res.data.page_size || pageSize,
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res :any = await HomeApiService.getAllCategory({ all_data: true });
      setCategoryList(res?.results || []);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchCourses();
    fetchCategories();
  }, []);

  useEffect(() => {
    const filtered = courses.filter((course) =>
      course.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCourses(filtered);
  }, [searchTerm, courses]);

  const handlePageChange = (page: number) => {
    fetchCourses(page, paginationData.pageSize);
  };

  const handleOpenModal = (course: Course | null = null) => {
    setCurrentCourse(course);
    setCourseInformation(course ?? initialCourseState);
    setImagePreview(
      course?.banner && typeof course.banner === 'string' 
        ? course.banner 
        : course?.banner instanceof File 
        ? URL.createObjectURL(course.banner) 
        : null
    );
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentCourse(null);
    setCourseInformation(initialCourseState);
    setImagePreview(null);
  };

  // ✅ Universal field change
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const target = e.target as HTMLInputElement;
    const { name, value, type } = target;
    const isCheckbox = type === 'checkbox';

    setCourseInformation((prev) => ({
      ...prev,
      [name]: isCheckbox ? target.checked : value,
    }));
  };

  // ✅ Handle array field updates (skills, about, outcomes)
  const handleArrayFieldUpdate = (field: keyof Course, updatedValue: string[]) => {
    setCourseInformation(prev => ({
      ...prev,
      [field]: updatedValue
    }));
  };

  // ✅ Image Upload + Preview
  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64String = event.target?.result as string;
        setImagePreview(base64String);
        setCourseInformation((prev) => ({
          ...prev,
          banner: file,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // ✅ Convert base64 string to File (only used when editing)
  const base64ToFile = (base64String: string, fileName: string): File | null => {
    try {
      const arr = base64String.split(',');
      const mime = arr[0].match(/:(.*?);/)?.[1];
      const bstr = atob(arr[1]);
      let n = bstr.length;
      const u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      return new File([u8arr], fileName, { type: mime });
    } catch (err) {
      console.error('Error converting base64 to File:', err);
      return null;
    }
  };

  // ✅ Add or Update Course
  const handleSubmit = async () => {
    try {
      const submissionData = { ...courseInformation };

      // Handle base64 image conversion for old banner
      if (
        typeof submissionData.banner === 'string' &&
        submissionData.banner.startsWith('data:image/')
      ) {
        const file = base64ToFile(submissionData.banner, 'banner.png');
        if (file) {
          submissionData.banner = file;
        }
      }

      const formData = new FormData();
      formData.append('title', submissionData.title);
      formData.append('description', submissionData.description);
      formData.append('instructor', submissionData.instructor || '');
      formData.append('instructor_name', submissionData.instructor_name || '');
      formData.append('type', submissionData.type);
      formData.append('category', String(submissionData.category || ''));
      formData.append('level', submissionData.level || '');
      formData.append('duration', submissionData.duration || '');

      if (submissionData.banner instanceof File) {
        formData.append('banner', submissionData.banner);
      }

      formData.append('price', submissionData.price || '');
      formData.append(
        'discount_percentage',
        submissionData.discount_percentage || '0.00'
      );
      formData.append('skills', JSON.stringify(submissionData.skills || []));
      formData.append('mode', submissionData.mode || '');
      formData.append('is_active', submissionData.is_active ? 'true' : 'false');
      formData.append('visibility', submissionData.visibility ? 'true' : 'false');
      formData.append('assignment_link', submissionData.assignment_link || '');
      formData.append('about', JSON.stringify(submissionData.about || []));
      formData.append('outcomes', JSON.stringify(submissionData.outcomes || []));
      formData.append('modules', JSON.stringify(submissionData.modules || []));

      let res;
      if (currentCourse?.id) {
        res = await TeacherApiService.updateCourseByCourseId(
          currentCourse.id,
          formData
        );
      } else {
        res = await TeacherApiService.addCoursePartial(formData);
      }

      if (res?.success) {
        toast.success(currentCourse ? 'Course updated successfully' : 'Course created successfully');
        fetchCourses();
        handleCloseModal();
      } else {
        toast.error('Something went wrong while saving the course.');
      }
    } catch (error: any) {
      console.error(error);
      toast.error(error?.response?.data?.detail || 'Error saving course');
    }
  };

  const handleDeleteCourse = async (id: number) => {
    try {
      await TeacherApiService.deleteCourseById(id);
      toast.success('Course deleted successfully!');
      fetchCourses();
      setShowDeletePopup(false);
    } catch (error: any) {
      toast.error(error?.response?.data?.detail || 'Error deleting course');
    }
  };

  const handleShowPopup = (id: number) => {
    setDeletedId(id);
    setShowDeletePopup(true);
  };

  return (
    <>
      {showDeletePopup && (
        <DeleteCoursePopup
          setShowDeletePopup={setShowDeletePopup}
          handleCourseDelete={handleDeleteCourse}
          deletedId={deletedId}
        />
      )}

      <div className="container mx-auto p-4">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <h1 className="text-2xl font-bold text-gray-800">My Courses</h1>
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <input
              type="text"
              placeholder="Search Courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300 flex-grow"
            />
            <button
              onClick={() => handleOpenModal()}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition whitespace-nowrap"
            >
              <FiPlus className="mr-2" />
              Add Course
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : filteredCourses.length === 0 ? (
          <div className="text-center py-12 text-gray-500">No courses found.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => (
              <div
                key={course.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:scale-105 transition"
              >
                <img
                  src={
                    course?.banner && typeof course.banner === 'string'
                      ? course.banner
                      : 'https://via.placeholder.com/400x200'
                  }
                  alt={course.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-lg font-semibold">{course.title}</h3>
                  <p className="text-gray-600 text-sm">{course.type}</p>
                  <div className="flex justify-between mt-3">
                    <button
                      onClick={() => handleOpenModal(course)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <FiEdit />
                    </button>
                    <button
                      onClick={() => course.id && handleShowPopup(course.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Pagination
        currentPage={paginationData.current_page}
        totalPages={paginationData.total_pages}
        onPageChange={handlePageChange}
      />

      {/* Modal for Add/Edit Course */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white p-4 border-b flex justify-between items-center">
              <h2 className="text-xl font-bold">
                {currentCourse ? 'Edit Course' : 'Add New Course'}
              </h2>
              <button
                onClick={handleCloseModal}
                className="text-gray-500 hover:text-gray-700"
              >
                <FiX size={24} />
              </button>
            </div>

            <div className="p-6">
              {/* Course Title and Type */}
              <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-lg font-semibold mb-2">
                    Course Title<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={courseInformation.title}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-300"
                  />
                </div>

                <div>
                  <label className="block text-lg font-semibold mb-2">
                    Course Type<span className="text-red-500">*</span>
                  </label>
                  <select
                    name="type"
                    value={courseInformation.type}
                    onChange={handleChange}
                    disabled={!!currentCourse}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md bg-white focus:ring-2 focus:ring-blue-300"
                  >
                    {courseTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Basic Information */}
              <div className="border-b pb-4 mb-4">
                <label className="block text-sm font-medium mb-1">
                  Description<span className="text-red-500">*</span>
                </label>
                <textarea
                  name="description"
                  value={courseInformation.description}
                  onChange={handleChange}
                  rows={3}
                  className="w-full h-40 px-3 py-2 border rounded-md focus:ring focus:ring-blue-200"
                />
              </div>

              {/* Course Details */}
              <div className="border-b pb-4 mb-4">
                <h3 className="text-lg font-semibold mb-3">Course Details</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Category<span className="text-red-500">*</span>
                    </label>
                    <select
                      name="category"
                      value={courseInformation.category}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border rounded-md focus:ring focus:ring-blue-200"
                    >
                      <option value="">Select a category</option>
                      {categoryList.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.cat_name} ({category.course_count})
                        </option>
                      ))}
                    </select>
                  </div>

                  {courseInformation.type !== 'corporate' && (
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Level
                      </label>
                      <select
                        name="level"
                        value={courseInformation.level}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded-md focus:ring focus:ring-blue-200"
                      >
                        <option value="">Select a level</option>
                        {levels.map((level) => (
                          <option key={level} value={level}>
                            {level}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Duration<span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="duration"
                      value={courseInformation.duration}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border rounded-md focus:ring focus:ring-blue-200"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Mode<span className="text-red-500">*</span>
                    </label>
                    <select
                      name="mode"
                      value={courseInformation.mode}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border rounded-md focus:ring focus:ring-blue-200"
                    >
                      <option value="">Select a mode</option>
                      {modes.map((mode) => (
                        <option key={mode} value={mode}>
                          {mode}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Banner */}
              <div className="p-6">
                {/* Image Upload Section */}
                <div className="border-b pb-4 mb-4">
                  <h3 className="text-lg font-semibold mb-3">Banner Image</h3>
                  <div className="flex flex-col items-center gap-4">
                    <input
                      id="banner"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageChange}
                    />
                    <label
                      htmlFor="banner"
                      className="cursor-pointer px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                      Choose Image
                    </label>
                    {imagePreview && (
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-1/2 h-48 object-cover rounded-md border"
                      />
                    )}
                  </div>
                </div>

                {/* Pricing */}
                {['public', 'free'].includes(courseInformation.type) && (
                  <div className="border-b pb-4 mb-4">
                    <h3 className="text-lg font-semibold mb-3">Pricing</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Price
                        </label>
                        <input
                          type="text"
                          name="price"
                          value={courseInformation.price}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border rounded-md focus:ring focus:ring-blue-200"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Discount Percentage
                        </label>
                        <input
                          type="text"
                          name="discount_percentage"
                          value={courseInformation.discount_percentage}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border rounded-md focus:ring focus:ring-blue-200"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Course Status */}
                <div className="border-b pb-4 mb-4">
                  <h3 className="text-lg font-semibold mb-3">Course Status</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="is_active"
                        name="is_active"
                        checked={!!courseInformation.is_active}
                        onChange={handleChange}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label
                        htmlFor="is_active"
                        className="ml-2 block text-sm text-gray-900"
                      >
                        Active Course
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="visibility"
                        name="visibility"
                        checked={!!courseInformation.visibility}
                        onChange={handleChange}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label
                        htmlFor="visibility"
                        className="ml-2 block text-sm text-gray-900"
                      >
                        Visible to Students
                      </label>
                    </div>
                  </div>
                </div>

                {/* Content Section */}
                <div className="pb-4">
                  {['public', 'free'].includes(courseInformation.type) && (
                    <h3 className="text-lg font-semibold mb-3">Course Content</h3>
                  )}

                  <div className="grid grid-cols-1 gap-4">
                    {['public', 'free'].includes(courseInformation.type) && (
                      <AddSkillAbout
                        editCourseData={courseInformation.skills}
                        type="Skills"
                        placeholder="Enter a skill"
                        buttonLabel="Add Skill"
                        value={courseInformation.skills || []}
                        onChange={(updatedValue) =>
                          handleArrayFieldUpdate('skills', updatedValue)
                        }
                      />
                    )}

                    <AddSkillAbout
                      editCourseData={courseInformation.about}
                      type="About"
                      placeholder="Enter About details"
                      buttonLabel="Add About"
                      value={courseInformation.about || []}
                      onChange={(updatedValue) =>
                        handleArrayFieldUpdate('about', updatedValue)
                      }
                    />

                    {['public', 'free'].includes(courseInformation.type) && (
                      <AddSkillAbout
                        editCourseData={courseInformation.outcomes}
                        type="Outcomes"
                        placeholder="Enter an Outcome"
                        buttonLabel="Add Outcome"
                        value={courseInformation.outcomes || []}
                        onChange={(updatedValue) =>
                          handleArrayFieldUpdate('outcomes', updatedValue)
                        }
                      />
                    )}

                    <div>
                      {['public', 'free'].includes(courseInformation.type) && (
                        <ModuleLectureManager
                          data={courseInformation.modules}
                          editCourseData={courseInformation}
                          courseInformation={courseInformation}
                          setCourseInformation={setCourseInformation}
                        />
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex justify-end mt-6">
                  <button
                    onClick={handleSubmit}
                    className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition duration-300"
                  >
                    {currentCourse ? 'Update Course' : 'Create Course'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TeacherCourse;