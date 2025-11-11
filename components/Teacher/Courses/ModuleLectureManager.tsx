'use client';
import React, { useEffect, useState } from 'react';
// import { Course, Lecture, Module } from './TeacherCourse';

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

interface ModuleLectureManagerProps {
  data?: Module[];
  editCourseData?: Course;
  courseInformation: Course;
  setCourseInformation: React.Dispatch<React.SetStateAction<Course>>;
}

const ModuleLectureManager: React.FC<ModuleLectureManagerProps> = ({
  data,
  editCourseData,
  courseInformation,
  setCourseInformation,
}) => {
  const [modules, setModules] = useState<Module[]>(data || []);
  const [moduleName, setModuleName] = useState('');
  const [lectureName, setLectureName] = useState('');
  const [currentLectures, setCurrentLectures] = useState<Lecture[]>([]);

  const handleAddLecture = () => {
    if (lectureName.trim()) {
      setCurrentLectures([...currentLectures, { name: lectureName.trim() }]);
      setLectureName('');
    }
  };

  useEffect(() => {
    if (editCourseData && editCourseData.modules) {
      setModules([...editCourseData.modules]);
    }
  }, [editCourseData]);

  const handleAddModule = () => {
    if (moduleName.trim() && currentLectures.length > 0) {
      const newModule: Module = {
        module: moduleName.trim(),
        lecture: currentLectures,
      };
      const updatedModules = [...modules, newModule];
      setModules(updatedModules);
      setCourseInformation({ ...courseInformation, modules: updatedModules });
      setModuleName('');
      setCurrentLectures([]);
    }
  };

  const handleDeleteModule = (index: number) => {
    const updatedModules = modules.filter((_, i) => i !== index);
    setModules(updatedModules);
    setCourseInformation({ ...courseInformation, modules: updatedModules });
  };

  const handleRemoveLecture = (index: number) => {
    const updatedLectures = currentLectures.filter((_, i) => i !== index);
    setCurrentLectures(updatedLectures);
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Module and Lecture Manager</h1>

      <div className="mb-4">
        <input
          type="text"
          value={moduleName}
          onChange={(e) => setModuleName(e.target.value)}
          placeholder="Enter Module Name"
          className="border border-gray-300 rounded px-2 py-1 w-full mb-2"
        />
      </div>

      <div className="mb-4">
        <div className="flex mb-2">
          <input
            type="text"
            value={lectureName}
            onChange={(e) => setLectureName(e.target.value)}
            placeholder="Enter Lecture Name"
            className="border border-gray-300 rounded px-2 py-1 flex-grow"
          />
          <button
            onClick={handleAddLecture}
            className="bg-blue-500 text-white px-4 py-1 rounded ml-2"
          >
            Add Lecture
          </button>
        </div>
        {currentLectures.length > 0 && (
          <ul className="list-disc list-inside bg-gray-50 p-2 rounded">
            {currentLectures.map((lecture, index) => (
              <li key={index} className="flex justify-between items-center py-1">
                <span>{lecture.name}</span>
                <button
                  onClick={() => handleRemoveLecture(index)}
                  className="text-red-500 hover:text-red-700 ml-2"
                >
                  ✕
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <button
        onClick={handleAddModule}
        className="bg-green-500 text-white px-4 py-2 rounded mb-4 disabled:bg-gray-400 disabled:cursor-not-allowed"
        disabled={!moduleName.trim() || currentLectures.length === 0}
      >
        Add Module
      </button>

      <h2 className="text-lg font-semibold mb-2">Modules</h2>

      <div className="space-y-4">
        {modules.map((moduleItem, index) => (
          <div key={index} className="border p-4 rounded relative bg-white shadow-sm">
            <button
              onClick={() => handleDeleteModule(index)}
              className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
            >
              ✕
            </button>
            <h3 className="font-bold text-lg mb-2">{moduleItem.module}</h3>
            <ul className="list-disc list-inside ml-4">
              {moduleItem.lecture.map((lecture, idx) => (
                <li key={idx} className="py-1">{lecture.name}</li>
              ))}
            </ul>
          </div>
        ))}
        {modules.length === 0 && (
          <div className="text-center py-4 text-gray-500">
            No modules added yet. Add a module with lectures above.
          </div>
        )}
      </div>
    </div>
  );
};

export default ModuleLectureManager;