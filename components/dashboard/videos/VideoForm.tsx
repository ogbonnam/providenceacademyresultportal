// components/dashboard/videos/VideoForm.tsx
"use client";

import React, { useState } from "react";
import { FaPlus, FaSpinner, FaCheckCircle } from "react-icons/fa";
import { addEducationalVideo } from "@/app/actions/videos";

interface Subject {
  id: string;
  name: string;
}

interface VideoFormProps {
  subjects: Subject[];
}

/**
 * A form for admins and teachers to submit new educational video links.
 */
export default function VideoForm({ subjects }: VideoFormProps) {
  const [title, setTitle] = useState("");
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [subjectId, setSubjectId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    // Basic form validation
    if (!title || !youtubeUrl || !subjectId) {
      setMessage({ type: "error", text: "Please fill in all fields." });
      setIsSubmitting(false);
      return;
    }

    // Ensure the URL is in the correct embed format
    const embedUrl = youtubeUrl.includes("youtube.com/watch?v=")
      ? youtubeUrl.replace("watch?v=", "embed/")
      : youtubeUrl;

    const result = await addEducationalVideo(title, embedUrl, subjectId);

    if (result.success) {
      setMessage({ type: "success", text: "Video added successfully!" });
      setTitle("");
      setYoutubeUrl("");
      setSubjectId("");
    } else {
      setMessage({
        type: "error",
        text: result.error || "Failed to add video.",
      });
    }

    setIsSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Add a New Educational Video
      </h2>

      {message && (
        <div
          className={`p-3 rounded-lg flex items-center space-x-2 ${
            message.type === "success"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {message.type === "success" ? <FaCheckCircle /> : <FaSpinner />}
          <p>{message.text}</p>
        </div>
      )}

      <div>
        <label
          htmlFor="videoTitle"
          className="block text-sm font-medium text-gray-700"
        >
          Video Title
        </label>
        <input
          id="videoTitle"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          placeholder="e.g., Introduction to Photosynthesis"
          disabled={isSubmitting}
        />
      </div>

      <div>
        <label
          htmlFor="youtubeUrl"
          className="block text-sm font-medium text-gray-700"
        >
          YouTube URL (Embed Link)
        </label>
        <input
          id="youtubeUrl"
          type="url"
          value={youtubeUrl}
          onChange={(e) => setYoutubeUrl(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          placeholder="Paste the YouTube video link here"
          disabled={isSubmitting}
        />
      </div>

      <div>
        <label
          htmlFor="subjectSelect"
          className="block text-sm font-medium text-gray-700"
        >
          Subject
        </label>
        <select
          id="subjectSelect"
          value={subjectId}
          onChange={(e) => setSubjectId(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          disabled={isSubmitting}
        >
          <option value="" disabled>
            Select a subject
          </option>
          {subjects.map((subject) => (
            <option key={subject.id} value={subject.id}>
              {subject.name}
            </option>
          ))}
        </select>
      </div>

      <button
        type="submit"
        className="inline-flex items-center space-x-2 px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <FaSpinner className="animate-spin" />
            <span>Adding...</span>
          </>
        ) : (
          <>
            <FaPlus />
            <span>Add Video</span>
          </>
        )}
      </button>
    </form>
  );
}
