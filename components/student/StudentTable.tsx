// components/student/StudentTable.tsx
"use client";

import React, { useState, useEffect, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { toggleStudentStatus, searchStudents } from "@/app/actions/student";

interface Student {
  id: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  image: string | null;
  status: "active" | "deactivated";
  level: string | null;
  boardingStatus: string | null;
  parent: {
    name: string | null;
  } | null;
}

interface StudentTableProps {
  initialStudents: Student[];
}

interface StatusToggleButtonProps {
  userId: string;
  currentStatus: "active" | "deactivated";
}

const StatusToggleButton: React.FC<StatusToggleButtonProps> = ({
  userId,
  currentStatus,
}) => {
  const [isPending, startTransition] = useTransition();

  const newStatus = currentStatus === "active" ? "deactivated" : "active";
  const buttonText = currentStatus === "active" ? "Deactivate" : "Activate";
  const buttonColor =
    currentStatus === "active"
      ? "bg-red-500 hover:bg-red-600"
      : "bg-green-500 hover:bg-green-600";

  const handleToggle = () => {
    startTransition(async () => {
      // This is the correct call, passing both required arguments.
      // If the error persists, there may be a file sync issue.
      const result = await toggleStudentStatus(userId, newStatus);
      if (result?.success) {
        console.log(result.success);
      }
      if (result?.error) {
        console.error(result.error);
      }
    });
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      className={`text-white text-sm font-semibold py-1 px-3 rounded-full transition-colors duration-200 ${buttonColor}`}
      disabled={isPending}
    >
      {isPending ? "Updating..." : buttonText}
    </button>
  );
};

const StudentTable: React.FC<StudentTableProps> = ({ initialStudents }) => {
  const [students, setStudents] = useState<Student[]>(initialStudents);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setStudents(initialStudents);
      return;
    }

    setIsLoading(true);
    const handler = setTimeout(async () => {
      const result = await searchStudents(searchTerm);

      if (Array.isArray(result)) {
        const filteredResults = result.filter(
          (student) => student.status === initialStudents[0]?.status
        );
        setStudents(filteredResults);
        setError(null);
      } else {
        setStudents([]);
        setError("An unexpected error occurred while fetching data.");
        console.error(result);
      }

      setIsLoading(false);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm, initialStudents]);

  return (
    <div className="p-4 bg-white rounded-lg shadow-md mb-6">
      <input
        type="text"
        placeholder="Search students by name or parent's name..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-4"
      />

      {error && (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
          role="alert"
        >
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      {isLoading ? (
        <p className="text-center text-indigo-600 font-semibold my-4">
          Loading...
        </p>
      ) : (
        <>
          {students.length === 0 && searchTerm !== "" ? (
            <div className="text-center p-8 bg-gray-50 rounded-xl shadow-inner mt-4">
              <p className="text-gray-500 text-lg">
                No students found matching your search.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-lg shadow-lg">
              <table className="min-w-full bg-white divide-y divide-gray-200">
                <thead className="bg-indigo-600">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                      Image
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                      Parent
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                      Level
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {students.map((student) => (
                    <tr
                      key={student.id}
                      className="hover:bg-indigo-50 transition-colors duration-200"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <Image
                              className="h-10 w-10 rounded-full"
                              src={
                                student.image ||
                                "https://placehold.co/40x40/E5E7EB/4B5563?text=S"
                              }
                              alt={student.name || "Student Photo"}
                              width={40}
                              height={40}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {student.name}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {student.email}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {student.parent?.name || "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {student.level || "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            student.status === "active"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {student.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <Link
                            href={`/admin/students/${student.id}`}
                            className="text-indigo-600 hover:text-indigo-900 transition-colors duration-200"
                          >
                            Details
                          </Link>
                          <button
                            className="text-yellow-600 hover:text-yellow-900 transition-colors duration-200"
                            onClick={() => alert("Edit not implemented yet")}
                          >
                            Edit
                          </button>
                          <StatusToggleButton
                            userId={student.id}
                            currentStatus={student.status}
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default StudentTable;
