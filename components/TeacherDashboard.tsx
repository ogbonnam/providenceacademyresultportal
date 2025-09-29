"use client";

import React, { useState, useEffect, useActionState } from "react";
import { useFormStatus } from "react-dom";
import {
  getSubjectsForTeacherDashboard,
  createVideoResource,
  getVideoResourcesBySubject,
  getTeacherProfile,
} from "@/app/actions/teacher";
import { getSession } from "next-auth/react";
import FullTimetableCard from "@/components/dashboard/FullTimetableCard";
import { getPublicTimetableData } from "@/app/actions/timetable";
import SingleTeacherProfile from "@/components/teacher/SingleTeacherProfile";

import {
  UserCircleIcon,
  BookOpenIcon,
  CalendarDaysIcon,
  ChevronRightIcon,
  SchoolIcon,
  MapPinIcon,
  User2Icon,
  CakeIcon,
  GlobeIcon,
  FlagIcon,
  PhoneIcon,
  MapIcon,
  Loader2Icon,
  FileTextIcon,
  YoutubeIcon,
} from "lucide-react";
import ReportEntryForm from "./report/ScoreEntryForm";

// Define the detailed type for the teacher object based on your server action's return type.
// This type definition is derived directly from the TypeScript error you shared.
// We'll define the complex nested types first for clarity.
type SubjectTeaching = {
  subject: {
    id: string;
    name: string;
    description: string | null;
  };
} & {
  subjectId: string;
  id: string;
  teacherId: string;
};

type TeacherDetails = {
  subjectsTeaching: SubjectTeaching[];
  address: string | null;

  id: string;
  name: string | null;
  email: string;

  role: string;
  status: any; // Assuming $Enums.UserStatus is an imported type, or can be 'any' for now.
  dateOfBirth: Date | null;

  photoUrl: string | null;
  phone: string | null;
  gender: string | null;
  occupation: string | null;
  designation: string | null;
};

interface TeacherDashboardProps {
  teacher: TeacherDetails;
}

interface Subject {
  id: string;
  name: string;
}

interface Video {
  id: string;
  title: string;
  youtubeUrl: string;
  uploader: {
    name: string | null;
    role: string;
  };
}

interface FormState {
  success?: string | null;
  error?: string | null;
}

const initialFormState: FormState = {
  success: null,
  error: null,
};

const PAGE_SIZE = 6; // number of videos per page

const VideoForm = ({
  subjectId,
  onVideoAdded,
}: {
  subjectId: string;
  onVideoAdded: () => void;
}) => {
  const [state, formAction] = useActionState(
    (prevState: FormState, formData: FormData) =>
      createVideoResource(prevState, formData),
    initialFormState
  );
  const { pending } = useFormStatus();

  React.useEffect(() => {
    if (state.success) {
      onVideoAdded();
    }
  }, [state.success, onVideoAdded]);

  return (
    <form
      action={formAction}
      className="bg-white p-6 rounded-lg shadow-md space-y-4"
    >
      <h3 className="text-xl font-semibold text-gray-800">Add a New Video</h3>
      {state.success && (
        <p className="bg-green-100 text-green-700 p-2 rounded-md">
          {state.success}
        </p>
      )}
      {state.error && (
        <p className="bg-red-100 text-red-700 p-2 rounded-md">{state.error}</p>
      )}
      <input type="hidden" name="subjectId" value={subjectId} />
      <div>
        <label
          htmlFor="title"
          className="block text-sm font-medium text-gray-700"
        >
          Video Title
        </label>
        <input
          type="text"
          id="title"
          name="title"
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
        />
      </div>
      <div>
        <label
          htmlFor="youtubeUrl"
          className="block text-sm font-medium text-gray-700"
        >
          YouTube Embed URL
        </label>
        <input
          type="text"
          id="youtubeUrl"
          name="youtubeUrl"
          required
          placeholder="e.g., https://www.youtube.com/embed/dQw4w9WgXcQ"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
        />
      </div>
      <button
        type="submit"
        disabled={pending}
        className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
      >
        {pending ? "Adding..." : "Add Video"}
      </button>
    </form>
  );
};

type Tab = "Educational Resources" | "Timetable" | "Report Entry" | "Profile";

const TeacherDashboard: React.FC<TeacherDashboardProps> = ({ teacher }) => {
  const [activeTab, setActiveTab] = useState<Tab>("Educational Resources");

  // Educational Resources states
  const [subjects, setSubjects] = React.useState<Subject[]>([]);
  const [selectedSubjectId, setSelectedSubjectId] = React.useState<
    string | null
  >(null);
  const [videos, setVideos] = React.useState<Video[]>([]);
  const [loadingSubjects, setLoadingSubjects] = React.useState(true);
  const [loadingVideos, setLoadingVideos] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [timetable, setTimetable] = useState<any[]>([]);
  const [profile, setProfile] = useState<TeacherDetails | null>(null);

  // Pagination state for videos
  const [currentPage, setCurrentPage] = React.useState(1);

  // Fetch subjects on mount or when tab changes to Educational Resources
  React.useEffect(() => {
    if (activeTab !== "Educational Resources") return;

    const fetchSubjects = async () => {
      try {
        setLoadingSubjects(true);
        const session = await getSession();
        if (session?.user?.id) {
          const fetchedSubjects = await getSubjectsForTeacherDashboard(
            session.user.id
          );
          setSubjects(fetchedSubjects);
          if (fetchedSubjects.length > 0) {
            setSelectedSubjectId(fetchedSubjects[0].id);
          } else {
            setSelectedSubjectId(null);
          }
          setError(null);
        } else {
          setError("User session not found.");
        }
      } catch (err) {
        console.error("Failed to fetch subjects:", err);
        setError("Failed to load subjects. Please try again.");
      } finally {
        setLoadingSubjects(false);
      }
    };
    fetchSubjects();
  }, [activeTab]);

  // Fetch videos whenever selectedSubjectId changes or tab is active
  React.useEffect(() => {
    if (activeTab !== "Educational Resources") return;
    if (!selectedSubjectId) {
      setVideos([]);
      return;
    }

    const fetchVideos = async () => {
      try {
        setLoadingVideos(true);
        const fetchedVideos = await getVideoResourcesBySubject(
          selectedSubjectId
        );
        setVideos(fetchedVideos);
        setCurrentPage(1); // reset to first page on new subject
        setError(null);
      } catch (err) {
        console.error("Failed to fetch videos:", err);
        setError("Failed to load videos for this subject.");
      } finally {
        setLoadingVideos(false);
      }
    };
    fetchVideos();
  }, [selectedSubjectId, activeTab]);

  // Callback after adding a video: re-fetch videos for current subject
  const handleVideoAdded = async () => {
    if (!selectedSubjectId) return;
    setLoadingVideos(true);
    const fetchedVideos = await getVideoResourcesBySubject(selectedSubjectId);
    setVideos(fetchedVideos);
    setCurrentPage(1); // reset pagination on new video
    setLoadingVideos(false);
  };

  // Calculate pagination
  const totalPages = Math.ceil(videos.length / PAGE_SIZE);
  const paginatedVideos = videos.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const handlePrevPage = () => {
    setCurrentPage((p) => Math.max(p - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((p) => Math.min(p + 1, totalPages));
  };

  useEffect(() => {
    if (activeTab !== "Timetable") return;
    async function loadTimetable() {
      const tt = await getPublicTimetableData();
      setTimetable(tt);
    }
    loadTimetable();
  }, [activeTab]);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">
        Teacher Dashboard
      </h1>

      {/* Tabs */}
      <div className="flex space-x-4 mb-8 border-b pb-2 border-gray-300">
        {(
          [
            "Educational Resources",
            "Timetable",
            "Report Entry",
            "Profile",
          ] as Tab[]
        ).map((tab) => (
          <button
            key={tab}
            className={`px-4 py-2 rounded-md font-semibold transition-colors duration-200 ${
              activeTab === tab
                ? "bg-indigo-600 text-white shadow"
                : "bg-gray-200 text-gray-700 hover:bg-indigo-100 hover:text-indigo-700"
            }`}
            onClick={() => {
              setError(null);
              setActiveTab(tab);
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === "Educational Resources" && (
        <>
          {error && (
            <div className="bg-red-100 text-red-700 p-4 rounded-md mb-4">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Subjects List */}
            <div className="col-span-1">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                  My Subjects
                </h2>
                {loadingSubjects ? (
                  <p>Loading subjects...</p>
                ) : subjects.length > 0 ? (
                  <ul className="space-y-2">
                    {subjects.map((subject) => (
                      <li key={subject.id}>
                        <button
                          onClick={() => setSelectedSubjectId(subject.id)}
                          className={`w-full text-left p-3 rounded-md transition-colors duration-200 ${
                            selectedSubjectId === subject.id
                              ? "bg-indigo-600 text-white"
                              : "bg-gray-100 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600"
                          }`}
                        >
                          {subject.name}
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500">No subjects assigned.</p>
                )}
              </div>
            </div>

            {/* Video Management Section */}
            <div className="col-span-1 md:col-span-2">
              {selectedSubjectId ? (
                <div className="space-y-6">
                  <VideoForm
                    subjectId={selectedSubjectId}
                    onVideoAdded={handleVideoAdded}
                  />

                  <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                      Videos for{" "}
                      {subjects.find((s) => s.id === selectedSubjectId)?.name}
                    </h2>

                    {loadingVideos ? (
                      <p>Loading videos...</p>
                    ) : paginatedVideos.length > 0 ? (
                      <>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          {paginatedVideos.map((video) => (
                            <div
                              key={video.id}
                              className="border border-gray-200 rounded-lg p-4"
                            >
                              <h3 className="text-lg font-medium text-gray-900 mb-2">
                                {video.title}
                              </h3>
                              <div className="aspect-w-16 aspect-h-9">
                                <iframe
                                  src={video.youtubeUrl}
                                  title={video.title}
                                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                  allowFullScreen
                                  className="w-full h-full rounded-md"
                                ></iframe>
                              </div>
                              <p className="mt-2 text-sm text-gray-500">
                                Uploaded by: {video.uploader.name} (
                                {video.uploader.role})
                              </p>
                            </div>
                          ))}
                        </div>

                        {/* Pagination Controls */}
                        <div className="flex justify-center items-center space-x-4 mt-6">
                          <button
                            onClick={handlePrevPage}
                            disabled={currentPage === 1}
                            className="px-4 py-2 bg-indigo-600 text-white rounded-md disabled:bg-gray-300 disabled:cursor-not-allowed"
                          >
                            Previous
                          </button>
                          <span>
                            Page {currentPage} of {totalPages}
                          </span>
                          <button
                            onClick={handleNextPage}
                            disabled={currentPage === totalPages}
                            className="px-4 py-2 bg-indigo-600 text-white rounded-md disabled:bg-gray-300 disabled:cursor-not-allowed"
                          >
                            Next
                          </button>
                        </div>
                      </>
                    ) : (
                      <p className="text-gray-500">
                        No videos found for this subject.
                      </p>
                    )}
                  </div>
                </div>
              ) : (
                <div className="bg-white p-6 rounded-lg shadow-md text-center">
                  <p className="text-lg text-gray-500">
                    Select a subject from the left to manage educational videos.
                  </p>
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {activeTab === "Timetable" && (
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">
            General Timetable
          </h2>
          <FullTimetableCard timetable={timetable} />
        </div>
      )}

      {activeTab === "Report Entry" && (
        <div className="bg-white p-6 rounded-lg shadow-md text-center text-gray-700">
          <ReportEntryForm />
        </div>
      )}

      {activeTab === "Profile" && (
        <div className="p-4 md:p-6">
          <h3 className="mb-4 text-2xl font-semibold text-gray-800">
            My Profile Details
          </h3>
          <div className="space-y-4 rounded-xl bg-white p-6 shadow-md">
            <div className="flex items-center gap-6">
              <div className="h-24 w-24 flex-shrink-0">
                {profile?.photoUrl ? (
                  <img
                    src={profile.photoUrl}
                    alt="Student Profile"
                    className="h-full w-full rounded-full object-cover"
                  />
                ) : (
                  <UserCircleIcon className="h-full w-full text-gray-400" />
                )}
              </div>
              <div>
                <h4 className="text-xl font-semibold text-gray-900">
                  {profile?.name}
                </h4>
                <p className="text-sm text-gray-600">{profile?.email}</p>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex items-center gap-3">
                <User2Icon className="h-5 w-5 text-indigo-500" />
                <p className="text-gray-700">
                  <span className="font-semibold">Gender:</span>{" "}
                  {profile?.gender || "N/A"}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <CakeIcon className="h-5 w-5 text-indigo-500" />
                <p className="text-gray-700">
                  <span className="font-semibold">Date of Birth:</span>{" "}
                  {profile?.dateOfBirth
                    ? new Date(profile.dateOfBirth).toLocaleDateString()
                    : "N/A"}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <BookOpenIcon className="h-5 w-5 text-indigo-500" />
                <p className="text-gray-700">
                  <span className="font-semibold">Boarding Status:</span>{" "}
                  {profile?.designation || "N/A"}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <MapIcon className="h-5 w-5 text-indigo-500" />
                <p className="text-gray-700">
                  <span className="font-semibold">Address:</span>{" "}
                  {profile?.address || "N/A"}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <PhoneIcon className="h-5 w-5 text-indigo-500" />
                <p className="text-gray-700">
                  <span className="font-semibold">Phone:</span>{" "}
                  {profile?.phone || "N/A"}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <FlagIcon className="h-5 w-5 text-indigo-500" />
                <p className="text-gray-700">
                  <span className="font-semibold">Occupation:</span>{" "}
                  {profile?.occupation || "N/A"}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherDashboard;
