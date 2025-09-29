import React from "react";

interface SummaryCardsProps {
  students: number;
  teachers: number;
  subjects: number;
}

export default function SummaryCards({
  students,
  teachers,
  subjects,
}: SummaryCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <div className="bg-white p-6 rounded-lg shadow-lg flex items-center space-x-4">
        <div className="flex-shrink-0 bg-indigo-100 text-indigo-600 p-3 rounded-full">
          <svg
            className="w-8 h-8"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 4.354a4 4 0 110 5.292M15 21v-1a4 4 0 00-4-4H9a4 4 0 00-4 4v1m10-10a4 4 0 110 5.292M15 21v-1a4 4 0 00-4-4H9a4 4 0 00-4 4v1"
            ></path>
          </svg>
        </div>
        <div>
          <p className="text-gray-500 text-sm">Students</p>
          <p className="text-3xl font-semibold text-gray-900">{students}</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-lg flex items-center space-x-4">
        <div className="flex-shrink-0 bg-green-100 text-green-600 p-3 rounded-full">
          <svg
            className="w-8 h-8"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
            ></path>
          </svg>
        </div>
        <div>
          <p className="text-gray-500 text-sm">Teachers</p>
          <p className="text-3xl font-semibold text-gray-900">{teachers}</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-lg flex items-center space-x-4">
        <div className="flex-shrink-0 bg-yellow-100 text-yellow-600 p-3 rounded-full">
          <svg
            className="w-8 h-8"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 6.253v13m0-13C10.832 5.484 9.497 5 8 5c-1.5 0-3 .484-4.5 1.253v13C3.497 19.516 5 20 6.5 20s3-.484 4.5-1.253m0-13C13.168 5.484 14.503 5 16 5c1.5 0 3 .484 4.5 1.253v13C20.503 19.516 19 20 17.5 20s-3-.484-4.5-1.253m-10 .626v-1.751m10 .138v1.751"
            ></path>
          </svg>
        </div>
        <div>
          <p className="text-gray-500 text-sm">Subjects</p>
          <p className="text-3xl font-semibold text-gray-900">{subjects}</p>
        </div>
      </div>
    </div>
  );
}
