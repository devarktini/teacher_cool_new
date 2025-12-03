'use client';
import { selectAuth } from '@/store/features/authSlice';
import React, { useState, ChangeEvent } from 'react';
import { useSelector } from 'react-redux';
import * as XLSX from 'xlsx';

interface StudentData {
    name?: string;
    email?: string;
    phone?: string;
    dob?: string;
    [key: string]: string | number | undefined;
}

function ExcelUpload(): JSX.Element {
    const { user_type, user } = useSelector(selectAuth);

    const [fileName, setFileName] = useState<string>('');
    const [unsuccessfulList, setUnsuccessfulList] = useState<StudentData[]>([]);
    const [successMessage, setSuccessMessage] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [showModal, setShowModal] = useState<boolean>(false);
    const [excelData, setExcelData] = useState<StudentData[]>([]);

    const requiredKeys: string[] = ['name', 'email', 'phone', 'dob'];

    const handleFileUpload = (e: ChangeEvent<HTMLInputElement>): void => {
        const file = e.target.files?.[0];
        if (!file) return;

        setFileName(file.name);
        const reader = new FileReader();

        reader.onload = (evt: ProgressEvent<FileReader>): void => {
            const bstr = evt.target?.result;
            const workbook = XLSX.read(bstr, { type: 'binary' });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const jsonData: StudentData[] = XLSX.utils.sheet_to_json(worksheet);

            setExcelData(jsonData);
            uploadStudents(jsonData);
            setShowModal(false);
        };

        reader.readAsBinaryString(file);
    };

    const uploadStudents = async (students: StudentData[]): Promise<void> => {
        setLoading(true);
        setSuccessMessage('');
        setUnsuccessfulList([]);

        // Simulate API request
        setTimeout(() => {
            const unsuccessful = students.filter(
                (s) => !s.name || !s.email || !s.phone || !s.dob
            );
            const successful = students.length - unsuccessful.length;

            setSuccessMessage(`${successful} students uploaded successfully.`);
            setUnsuccessfulList(unsuccessful);
            setLoading(false);
        }, 1500);
    };

    return (
        <>
            <div className="min-h-screen bg-blue-50 flex flex-col items-center p-6">
                <div className="bg-white rounded-xl p-5 w-full max-w-8xl flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-blue-600 mb-6">
                            Upload {user_type === "university" ? "Students" : "Employees"} via Excel
                        </h1>

                        {/* Show required keys */}
                        <div className="mb-6">
                            <h2 className="text-sm font-semibold text-gray-700 mb-2">Required Fields:</h2>
                            <ul className="list-disc list-inside text-sm text-gray-600">
                                {requiredKeys.map((key) => (
                                    <li key={key}>{key}</li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    <div>
                        <button
                            onClick={() => setShowModal(true)}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700"
                        >
                            Upload Excel File
                        </button>

                        {/* Success Message */}
                        {loading && <p className="text-blue-500 mt-4">Uploading students...</p>}

                        {successMessage && (
                            <p className="text-green-600 font-medium mt-4">{successMessage}</p>
                        )}

                        {/* Failed Uploads */}
                        {unsuccessfulList.length > 0 && (
                            <div className="mt-6">
                                <h2 className="text-red-600 font-semibold mb-2">
                                    Failed to upload {unsuccessfulList.length} student(s):
                                </h2>
                                <ul className="text-sm list-disc pl-5 text-gray-800">
                                    {unsuccessfulList.map((student, index) => (
                                        <li key={index}>
                                            {student.name || 'Unnamed'} - {student.email || 'No email'}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>

                <div className='w-full max-w-8x'>
                    {/* Show uploaded data in table */}
                    {excelData.length > 0 && (
                        <div className="mt-8 overflow-x-auto">
                            <h2 className="text-lg font-semibold mb-4">Uploaded Student Data</h2>
                            <table className="min-w-full bg-white border border-gray-300 text-sm">
                                <thead>
                                    <tr className="bg-blue-100 text-gray-700">
                                        {Object.keys(excelData[0]).map((key) => (
                                            <th key={key} className="px-4 py-2 border border-gray-300 text-left">
                                                {key.toUpperCase()}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {excelData.map((student, index) => (
                                        <tr key={index} className="hover:bg-blue-50">
                                            {Object.keys(excelData[0]).map((key) => (
                                                <td key={key} className="px-4 py-2 border border-gray-200">
                                                    {student[key] || '—'}
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Upload Modal */}
                {showModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
                        <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
                            <h3 className="text-xl font-semibold text-gray-700 mb-4">Upload Excel File</h3>
                            <input
                                type="file"
                                accept=".xlsx, .xls"
                                onChange={handleFileUpload}
                                className="mb-4 w-full"
                            />
                            <div className="flex justify-end space-x-3">
                                <button
                                    className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
                                    onClick={() => setShowModal(false)}
                                >
                                    Cancel
                                </button>
                                <button
                                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                                    onClick={() => document.querySelector<HTMLInputElement>('input[type="file"]')?.click()}
                                >
                                    Upload
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}

export default ExcelUpload;
