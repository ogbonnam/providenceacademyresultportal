"use client";

import React from "react";
import { FaTable, FaSortNumericDown, FaUserGraduate } from "react-icons/fa";
import { Subject, Student } from "@/app/actions/reports";

interface BroadsheetTableProps {
  students: (Student & { averageScore: number; rank: number })[];
  subjects: Subject[];
  scoresMap: {
    [studentId: string]: {
      [subjectId: string]: {
        total: number;
      };
    };
  };
}

/**
 * Helper function to determine the color class based on the score.
 * @param score The total score for a subject.
 * @returns A string of Tailwind CSS classes for color coding.
 */
const getScoreColorClass = (score: number | string): string => {
  if (typeof score !== "number") {
    return ""; // No color for non-numeric scores like "-"
  }
  if (score >= 50) {
    return "bg-green-100 text-green-800"; // Pass
  }
  if (score >= 40) {
    return "bg-yellow-100 text-yellow-800"; // Borderline
  }
  return "bg-red-100 text-red-800"; // Fail
};

export default function BroadsheetTable({
  students,
  subjects,
  scoresMap,
}: BroadsheetTableProps) {
  // Debugging log to see what data the component receives
  console.log("BroadsheetTable props received:", {
    students,
    subjects,
    scoresMap,
  });

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 max-w-full mx-auto overflow-x-auto">
      <div className="flex items-center space-x-4 mb-6 pb-4 border-b">
        <FaTable className="text-3xl text-indigo-500" />
        <h1 className="text-3xl font-bold text-gray-800">Broadsheet Report</h1>
      </div>
      <p className="text-gray-600 mb-6">
        Comprehensive view of all students' scores across all subjects.
      </p>

      {subjects.length === 0 || students.length === 0 ? (
        <div className="text-center py-12 text-gray-500 italic">
          No data available. Please ensure students, subjects, and scores exist
          in the database.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <FaUserGraduate className="inline mr-2 text-indigo-400" />
                  Student Name
                </th>
                {subjects.map((subject) => (
                  <th
                    key={subject.id}
                    className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {subject.name}
                  </th>
                ))}
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Average
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <FaSortNumericDown className="inline mr-2 text-indigo-400" />
                  Position
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {students.map((student) => (
                <tr key={student.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {student.name}
                  </td>
                  {subjects.map((subject) => {
                    const score =
                      scoresMap?.[student.id]?.[subject.id]?.total ?? "-";
                    const scoreClass = getScoreColorClass(score);
                    return (
                      <td
                        key={`${student.id}-${subject.id}`}
                        className={`px-6 py-4 whitespace-nowrap text-center text-sm font-semibold ${scoreClass}`}
                      >
                        {score}
                      </td>
                    );
                  })}
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900 text-center">
                    {student.averageScore.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                    {student.rank}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
