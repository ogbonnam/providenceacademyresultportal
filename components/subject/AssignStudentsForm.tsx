// components/subject/AssignStudentsForm.tsx
"use client";

import React, { useState, useTransition } from "react";
import { assignStudentsToSubject } from "@/app/actions/teacher";

interface Student {
  id: string;
  name: string | null;
}

interface Subject {
  id: string;
  name: string;
}

interface Assignment {
  studentId: string;
  subjectId: string;
}

interface AssignStudentsFormProps {
  students: Student[];
  subjects: Subject[];
  initialAssignments: Assignment[];
}

export default function AssignStudentsForm({
  students,
  subjects,
  initialAssignments,
}: AssignStudentsFormProps) {
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Use a Map for efficient lookup of assignments
  const [assignments, setAssignments] = useState<Map<string, boolean>>(() => {
    const map = new Map<string, boolean>();
    initialAssignments.forEach((assignment) => {
      map.set(`${assignment.studentId}-${assignment.subjectId}`, true);
    });
    return map;
  });

  const handleCheckboxChange = (
    studentId: string,
    subjectId: string,
    isChecked: boolean
  ) => {
    const key = `${studentId}-${subjectId}`;
    setAssignments((prev) => {
      const newMap = new Map(prev);
      if (isChecked) {
        newMap.set(key, true);
      } else {
        newMap.delete(key);
      }
      return newMap;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Construct the final list of student IDs for the selected subject
    const newAssignments: { studentId: string; subjectId: string }[] = [];
    assignments.forEach((value, key) => {
      const [studentId, subjectId] = key.split("-");
      newAssignments.push({ studentId, subjectId });
    });

    // Group assignments by subjectId
    const assignmentsBySubject: { [key: string]: string[] } = {};
    newAssignments.forEach((assignment) => {
      if (!assignmentsBySubject[assignment.subjectId]) {
        assignmentsBySubject[assignment.subjectId] = [];
      }
      assignmentsBySubject[assignment.subjectId].push(assignment.studentId);
    });

    startTransition(async () => {
      let allSuccess = true;
      let errorMessage = "";

      for (const subjectId in assignmentsBySubject) {
        const result = await assignStudentsToSubject(
          subjectId,
          assignmentsBySubject[subjectId]
        );
        if (result?.error) {
          allSuccess = false;
          errorMessage = result.error;
          break;
        }
      }

      if (allSuccess) {
        setMessage({
          type: "success",
          text: "Student enrollments updated successfully!",
        });
      } else {
        setMessage({
          type: "error",
          text: `Failed to update enrollments: ${errorMessage}`,
        });
      }
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-full overflow-x-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        {message && (
          <div
            className={`p-3 rounded-md mb-4 ${
              message.type === "success"
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {message.text}
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sticky left-0 bg-gray-50 z-10"
                >
                  Student Name
                </th>
                {subjects.map((subject) => (
                  <th
                    key={subject.id}
                    scope="col"
                    className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {subject.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {students.map((student) => (
                <tr key={student.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 sticky left-0 bg-white z-10">
                    {student.name}
                  </td>
                  {subjects.map((subject) => {
                    const isEnrolled = assignments.has(
                      `${student.id}-${subject.id}`
                    );
                    return (
                      <td
                        key={subject.id}
                        className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center"
                      >
                        <input
                          type="checkbox"
                          checked={isEnrolled}
                          onChange={(e) =>
                            handleCheckboxChange(
                              student.id,
                              subject.id,
                              e.target.checked
                            )
                          }
                          className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                        />
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <button
          type="submit"
          className="w-full mt-4 bg-indigo-600 text-white font-bold py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isPending}
        >
          {isPending ? "Saving..." : "Save Enrollments"}
        </button>
      </form>
    </div>
  );
}
