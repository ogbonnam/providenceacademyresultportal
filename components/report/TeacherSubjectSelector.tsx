"use client";

import React, { useState, useEffect } from "react";
import ReportEntryForm from "./ScoreEntryForm";
import {
  getStudentsBySubject,
  getScoresAndAttendanceBySubject,
  Teacher,
  Subject,
  Student,
  FetchedScore,
} from "@/app/actions/reports";
import { FaSpinner } from "react-icons/fa";

interface TeacherSubjectSelectorProps {
  teachersWithSubjects: Teacher[];
}

/**
 * A client component for selecting a teacher and subject to display report entry.
 */
export default function TeacherSubjectSelector({
  teachersWithSubjects,
}: TeacherSubjectSelectorProps) {
  const [selectedTeacher, setSelectedTeacher] = useState<string>("");
  const [selectedSubject, setSelectedSubject] = useState<string>("");
  const [availableSubjects, setAvailableSubjects] = useState<Subject[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [scores, setScores] = useState<FetchedScore[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);

  useEffect(() => {
    // Reset subject when teacher changes
    setSelectedSubject("");
    const teacher = teachersWithSubjects.find((t) => t.id === selectedTeacher);
    if (teacher) {
      // The field name is corrected here to match the schema
      setAvailableSubjects(teacher.subjectsTeaching.map((s) => s.subject));
    } else {
      setAvailableSubjects([]);
    }
  }, [selectedTeacher, teachersWithSubjects]);

  const handleSubjectChange = async (subjectId: string) => {
    setSelectedSubject(subjectId);
    if (subjectId) {
      setIsLoading(true);
      setDataLoaded(false);
      try {
        const [fetchedStudents, fetchedScores] = await Promise.all([
          getStudentsBySubject(subjectId),
          getScoresAndAttendanceBySubject(subjectId),
        ]);
        setStudents(fetchedStudents);
        setScores(fetchedScores);
        setDataLoaded(true);
      } catch (error) {
        console.error("Failed to fetch student or score data:", error);
        // Handle error state appropriately
      } finally {
        setIsLoading(false);
      }
    } else {
      setStudents([]);
      setScores([]);
      setDataLoaded(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Teacher and Subject Selectors */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Teacher Dropdown */}
        <div>
          <label
            htmlFor="teacher-select"
            className="block text-sm font-medium text-gray-700"
          >
            Select Teacher:
          </label>
          <select
            id="teacher-select"
            value={selectedTeacher}
            onChange={(e) => setSelectedTeacher(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="">-- Select a Teacher --</option>
            {teachersWithSubjects.map((teacher) => (
              <option key={teacher.id} value={teacher.id}>
                {teacher.name ?? "N/A"}
              </option>
            ))}
          </select>
        </div>

        {/* Subject Dropdown */}
        <div>
          <label
            htmlFor="subject-select"
            className="block text-sm font-medium text-gray-700"
          >
            Select Subject:
          </label>
          <select
            id="subject-select"
            value={selectedSubject}
            onChange={(e) => handleSubjectChange(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            disabled={!selectedTeacher}
          >
            <option value="">-- Select a Subject --</option>
            {availableSubjects.map((subject) => (
              <option key={subject.id} value={subject.id}>
                {subject.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Loading State or Report Form */}
      {isLoading ? (
        <div className="flex justify-center items-center h-48 bg-white rounded-lg shadow-inner">
          <FaSpinner className="animate-spin text-4xl text-indigo-500" />
          <p className="ml-4 text-gray-600">Loading student data...</p>
        </div>
      ) : dataLoaded && selectedSubject ? (
        <ReportEntryForm
          students={students}
          initialScores={scores}
          subjectId={selectedSubject}
        />
      ) : (
        <div className="bg-gray-50 p-6 rounded-lg shadow-inner text-center text-gray-500">
          <p>Please select a teacher and a subject to begin.</p>
        </div>
      )}
    </div>
  );
}
