// components/dashboard/videos/VideoList.tsx
"use client";

import React, { useEffect, useState } from "react";
import { getVideosBySubjectId } from "@/app/actions/videos";
import { FaVideo, FaUserCircle, FaSpinner } from "react-icons/fa";
import { format } from "date-fns";

interface Video {
  id: string;
  title: string;
  youtubeUrl: string;
  uploader: { name: string | null; role: string };
  createdAt: Date;
}

interface VideoListProps {
  subjectId: string;
}

/**
 * Displays a list of videos for a given subject, with an embedded player.
 */
export default function VideoList({ subjectId }: VideoListProps) {
  const [videos, setVideos] = useState<Video[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchVideos() {
      setIsLoading(true);
      const fetchedVideos = await getVideosBySubjectId(subjectId);
      setVideos(fetchedVideos as Video[]);
      setIsLoading(false);
    }
    fetchVideos();
  }, [subjectId]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-40 bg-white rounded-lg shadow">
        <FaSpinner className="animate-spin text-indigo-500 text-3xl" />
      </div>
    );
  }

  if (videos.length === 0) {
    return (
      <div className="p-6 bg-white rounded-lg shadow text-center text-gray-500">
        No videos available for this subject yet.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {videos.map((video) => (
        <div
          key={video.id}
          className="bg-white p-6 rounded-lg shadow flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-6"
        >
          <div className="flex-shrink-0 w-full md:w-1/2 rounded-lg overflow-hidden">
            <div className="relative" style={{ paddingBottom: "56.25%" }}>
              {" "}
              {/* 16:9 Aspect Ratio */}
              <iframe
                className="absolute top-0 left-0 w-full h-full rounded-lg"
                src={video.youtubeUrl}
                title={video.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>
          <div className="flex-1 flex flex-col justify-between">
            <div>
              <h3 className="text-xl font-semibold text-gray-800">
                {video.title}
              </h3>
              <div className="flex items-center space-x-2 text-sm text-gray-500 mt-2">
                <FaUserCircle />
                <span>
                  By: {video.uploader.name} ({video.uploader.role})
                </span>
              </div>
            </div>
            <div className="mt-4 text-sm text-gray-500">
              <p>
                Added on: {format(new Date(video.createdAt), "MMM dd, yyyy")}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
