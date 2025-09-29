// components/teacher/AssignSubjectsForm.tsx
"use client";

import React, { useState, useTransition, useEffect } from "react";
import {
  assignSubjectsToTeacher,
  getTeacherSubjects,
} from "@/app/actions/teacher";

interface Teacher {
  id: string;
  name: string | null;
}

interface Subject {
  id: string;
  name: string;
}

interface AssignSubjectsFormProps {
  teachers: Teacher[];
  subjects: Subject[];
}

export default function AssignSubjectsForm({
  teachers,
  subjects,
}: AssignSubjectsFormProps) {
  const [selectedTeacherId, setSelectedTeacherId] = useState<string>("");
  const [selectedSubjectIds, setSelectedSubjectIds] = useState<string[]>([]);
  const [isPending, startTransition] = useTransition();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // This useEffect hook fetches and sets the pre-assigned subjects when a teacher is selected.
  useEffect(() => {
    if (selectedTeacherId) {
      setIsLoading(true);
      startTransition(async () => {
        try {
          const assignedSubjects = await getTeacherSubjects(selectedTeacherId);
          setSelectedSubjectIds(assignedSubjects.map((s) => s.id));
        } catch (error) {
          console.error("Failed to fetch teacher's subjects:", error);
          setMessage({
            type: "error",
            text: "Failed to load assigned subjects.",
          });
        } finally {
          setIsLoading(false);
        }
      });
    } else {
      setSelectedSubjectIds([]); // Clear subjects if no teacher is selected
    }
  }, [selectedTeacherId]);

  const handleTeacherChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedTeacherId(e.target.value);
    setMessage(null);
  };

  const handleSubjectChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const subjectId = e.target.value;
    setSelectedSubjectIds((prev) =>
      e.target.checked
        ? [...prev, subjectId]
        : prev.filter((id) => id !== subjectId)
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTeacherId) {
      setMessage({ type: "error", text: "Please select a teacher." });
      return;
    }

    startTransition(async () => {
      const result = await assignSubjectsToTeacher(
        selectedTeacherId,
        selectedSubjectIds
      );
      if (result?.success) {
        setMessage({ type: "success", text: result.success });
      } else if (result?.error) {
        setMessage({ type: "error", text: result.error });
      }
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        {message && (
          <div
            className={`p-3 rounded-md ${
              message.type === "success"
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {message.text}
          </div>
        )}

        <div>
          <label
            htmlFor="teacher"
            className="block text-sm font-medium text-gray-700"
          >
            Select Teacher
          </label>
          <select
            id="teacher"
            value={selectedTeacherId}
            onChange={handleTeacherChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            required
          >
            <option value="">-- Select a teacher --</option>
            {teachers.map((teacher) => (
              <option key={teacher.id} value={teacher.id}>
                {teacher.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Assign Subjects
          </label>
          {isLoading ? (
            <div className="mt-2 text-gray-500">
              Loading assigned subjects...
            </div>
          ) : (
            <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {subjects.map((subject) => (
                <div key={subject.id} className="flex items-center">
                  <input
                    id={`subject-${subject.id}`}
                    type="checkbox"
                    value={subject.id}
                    checked={selectedSubjectIds.includes(subject.id)}
                    onChange={handleSubjectChange}
                    className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                  />
                  <label
                    htmlFor={`subject-${subject.id}`}
                    className="ml-2 text-sm text-gray-900"
                  >
                    {subject.name}
                  </label>
                </div>
              ))}
            </div>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-indigo-600 text-white font-bold py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isPending || !selectedTeacherId || isLoading}
        >
          {isPending ? "Assigning..." : "Assign Subjects"}
        </button>
      </form>
    </div>
  );
}
