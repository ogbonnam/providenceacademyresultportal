// components/dashboard/videos/EducationalVideosDashboard.tsx
"use client";

import React, { useState } from "react";
import VideoForm from "./VideoForm";
import VideoList from "./VideoList";

interface Subject {
  id: string;
  name: string;
}

interface EducationalVideosDashboardProps {
  subjects: Subject[];
}

/**
 * The main component for managing and viewing educational videos in the admin dashboard.
 * It handles state for the selected subject and videos, and coordinates the form and list components.
 */
export default function EducationalVideosDashboard({
  subjects,
}: EducationalVideosDashboardProps) {
  const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>(
    null
  );

  return (
    <div className="space-y-6 p-6 bg-gray-100 text-black rounded-lg shadow-inner">
      <h1 className="text-3xl font-bold text-gray-900">
        Educational Video Management
      </h1>

      {/* Video Submission Form */}
      <div className="bg-white p-6 rounded-lg shadow">
        <VideoForm subjects={subjects} />
      </div>

      {/* Subject Selection for Viewing Videos */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">View Videos by Subject</h2>
        <div className="flex flex-wrap gap-2">
          {subjects.map((subject) => (
            <button
              key={subject.id}
              onClick={() => setSelectedSubjectId(subject.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedSubjectId === subject.id
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-200 text-gray-800 hover:bg-indigo-100"
              }`}
            >
              {subject.name}
            </button>
          ))}
        </div>
      </div>

      {/* Video List */}
      {selectedSubjectId && <VideoList subjectId={selectedSubjectId} />}
    </div>
  );
}
