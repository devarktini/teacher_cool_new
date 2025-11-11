'use client';
import React, { useEffect, useState } from 'react';

interface AddSkillAboutProps {
  type: string;
  placeholder: string;
  buttonLabel: string;
  value?: string[];
  onChange: (updatedValue: string[]) => void;
  editCourseData?: string[];
}

const AddSkillAbout: React.FC<AddSkillAboutProps> = ({
  type,
  placeholder,
  buttonLabel,
  value = [],
  onChange,
  editCourseData = [],
}) => {
  const [inputValue, setInputValue] = useState('');
  const [items, setItems] = useState<string[]>(value);

  useEffect(() => {
    if (editCourseData && editCourseData.length > 0) {
      setItems([...editCourseData]);
    }
  }, [editCourseData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleAddItem = () => {
    if (inputValue.trim()) {
      const updatedValue = [...items, inputValue.trim()];
      setItems(updatedValue);
      onChange(updatedValue);
      setInputValue('');
    }
  };

  const handleDeleteItem = (index: number) => {
    const updatedValue = items.filter((_, i) => i !== index);
    setItems(updatedValue);
    onChange(updatedValue);
  };

  return (
    <div className="flex flex-col w-full space-y-6 mt-10">
      <div className="text-left text-lg font-bold">
        <span>{type}</span>
      </div>

      <div className="flex items-center w-full space-x-4">
        <input
          type="text"
          placeholder={placeholder}
          value={inputValue}
          onChange={handleInputChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
        />
        <button
          onClick={handleAddItem}
          className="px-2 py-2 rounded-full text-white bg-blue-600 hover:bg-blue-700 shadow-md transition duration-300"
        >
          {buttonLabel}
        </button>
      </div>

      <ul className="w-full space-y-2">
        {items.map((item, index) => (
          <li
            key={index}
            className="p-3 bg-gray-100 relative rounded-lg shadow-sm hover:bg-gray-200 transition"
          >
            <span className="text-gray-700 font-medium">{item}</span>
            <button
              onClick={() => handleDeleteItem(index)}
              className="absolute top-2 right-2 bg-red-500 text-white rounded-full px-2 py-1 text-xs"
            >
              ✕
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AddSkillAbout;
