// // components/StudentDashboard.tsx
// // This component contains the UI and logic for the Student Dashboard.
// "use client";
// import React, { useState, useEffect } from "react";

// // Define new types for the timetable and updated reports/profile
// interface StudentReport {
//   id: number;
//   term: string;
//   subject: string;
//   test1: number;
//   test2: number;
//   exam: number;
//   total: number;
//   comment: string;
// }

// interface StudentProfile {
//   name: string;
//   studentId: string;
//   email: string;
//   foundationYear: string;
// }

// interface LearningResource {
//   id: number;
//   title: string;
//   type: "video" | "document";
//   link: string;
// }

// interface TimetableEntry {
//   id: number;
//   day: string;
//   time: string;
//   subject: string;
//   teacher: string;
//   location: string;
// }

// const StudentDashboard: React.FC = () => {
//   // 'content', 'timetable', 'details'
//   const [activeTab, setActiveTab] = useState<string>("content");
//   const [reports, setReports] = useState<StudentReport[]>([]);
//   const [resources, setResources] = useState<LearningResource[]>([]);
//   const [profile, setProfile] = useState<StudentProfile | null>(null);
//   const [timetable, setTimetable] = useState<TimetableEntry[]>([]);

//   useEffect(() => {
//     const fetchStudentData = async () => {
//       // Placeholder data for reports
//       setReports([
//         {
//           id: 1,
//           term: "Term 1",
//           subject: "Mathematics",
//           test1: 20,
//           test2: 25,
//           exam: 40,
//           total: 85,
//           comment: "Good effort",
//         },
//         {
//           id: 2,
//           term: "Term 1",
//           subject: "Physics",
//           test1: 18,
//           test2: 20,
//           exam: 40,
//           total: 78,
//           comment: "Needs more practice",
//         },
//       ]);
//       // Placeholder data for resources
//       setResources([
//         {
//           id: 1,
//           title: "Algebra Fundamentals",
//           type: "video",
//           link: "https://www.youtube.com/watch?v=some_algebra_video",
//         },
//         {
//           id: 2,
//           title: "Newton's Laws Explained",
//           type: "video",
//           link: "https://www.youtube.com/watch?v=some_physics_video",
//         },
//         { id: 3, title: "Essay Writing Guide", type: "document", link: "#" },
//       ]);
//       // Placeholder data for profile
//       setProfile({
//         name: "Alice Smith",
//         studentId: "S001",
//         email: "alice.s@example.com",
//         foundationYear: "2025-2026",
//       });
//       // Placeholder data for timetable
//       setTimetable([
//         {
//           id: 1,
//           day: "Monday",
//           time: "09:00 - 10:00",
//           subject: "Mathematics",
//           teacher: "Mr. Johnson",
//           location: "Room 101",
//         },
//         {
//           id: 2,
//           day: "Monday",
//           time: "10:00 - 11:00",
//           subject: "Physics",
//           teacher: "Ms. Davis",
//           location: "Lab 2B",
//         },
//         {
//           id: 3,
//           day: "Tuesday",
//           time: "11:00 - 12:00",
//           subject: "English",
//           teacher: "Mrs. Williams",
//           location: "Room 205",
//         },
//       ]);
//     };
//     fetchStudentData();
//   }, []);

//   return (
//     <div className="bg-white p-8 rounded-xl shadow-lg">
//       <h2 className="text-3xl font-bold text-indigo-700 mb-6">
//         Student Dashboard
//       </h2>

//       {/* Student Navigation Tabs */}
//       <div className="flex border-b border-gray-200 mb-6">
//         <button
//           className={`py-3 px-6 text-lg font-medium ${
//             activeTab === "content"
//               ? "border-b-4 border-indigo-600 text-indigo-700"
//               : "text-gray-600 hover:text-indigo-600"
//           }`}
//           onClick={() => setActiveTab("content")}
//         >
//           Educational Content
//         </button>
//         <button
//           className={`py-3 px-6 text-lg font-medium ${
//             activeTab === "timetable"
//               ? "border-b-4 border-indigo-600 text-indigo-700"
//               : "text-gray-600 hover:text-indigo-600"
//           }`}
//           onClick={() => setActiveTab("timetable")}
//         >
//           My Timetable
//         </button>
//         <button
//           className={`py-3 px-6 text-lg font-medium ${
//             activeTab === "details"
//               ? "border-b-4 border-indigo-600 text-indigo-700"
//               : "text-gray-600 hover:text-indigo-600"
//           }`}
//           onClick={() => setActiveTab("details")}
//         >
//           My Details
//         </button>
//       </div>

//       {/* Tab Content */}
//       <div>
//         {activeTab === "content" && (
//           <div>
//             <h3 className="text-2xl font-semibold text-gray-800 mb-4">
//               Learning Resources
//             </h3>
//             {resources.length > 0 ? (
//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                 {resources.map((resource) => (
//                   <div
//                     key={resource.id}
//                     className="bg-gray-50 p-4 rounded-lg shadow-sm border border-gray-200"
//                   >
//                     <h4 className="text-lg font-semibold text-gray-800">
//                       {resource.title}
//                     </h4>
//                     <p className="text-gray-600 text-sm mb-2 capitalize">
//                       Type: {resource.type}
//                     </p>
//                     {resource.type === "video" ? (
//                       <a
//                         href={resource.link}
//                         target="_blank"
//                         rel="noopener noreferrer"
//                         className="text-indigo-600 hover:text-indigo-800 font-medium flex items-center"
//                       >
//                         Watch Video
//                         <svg
//                           className="ml-1 w-4 h-4"
//                           fill="none"
//                           stroke="currentColor"
//                           viewBox="0 0 24 24"
//                           xmlns="http://www.w3.org/2000/svg"
//                         >
//                           <path
//                             strokeLinecap="round"
//                             strokeLinejoin="round"
//                             strokeWidth="2"
//                             d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0l-7 7m7-7v6"
//                           ></path>
//                         </svg>
//                       </a>
//                     ) : (
//                       <a
//                         href={resource.link}
//                         target="_blank"
//                         rel="noopener noreferrer"
//                         className="text-indigo-600 hover:text-indigo-800 font-medium flex items-center"
//                       >
//                         View Document
//                         <svg
//                           className="ml-1 w-4 h-4"
//                           fill="none"
//                           stroke="currentColor"
//                           viewBox="0 0 24 24"
//                           xmlns="http://www.w3.org/2000/svg"
//                         >
//                           <path
//                             strokeLinecap="round"
//                             strokeLinejoin="round"
//                             strokeWidth="2"
//                             d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0l-7 7m7-7v6"
//                           ></path>
//                         </svg>
//                       </a>
//                     )}
//                   </div>
//                 ))}
//               </div>
//             ) : (
//               <p className="text-gray-600">
//                 No learning resources available yet.
//               </p>
//             )}
//           </div>
//         )}
//         {activeTab === "timetable" && (
//           <div>
//             <h3 className="text-2xl font-semibold text-gray-800 mb-4">
//               My Timetable
//             </h3>
//             {timetable.length > 0 ? (
//               <div className="overflow-x-auto">
//                 <table className="min-w-full bg-white border border-gray-200 rounded-lg">
//                   <thead>
//                     <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
//                       <th className="py-3 px-6 text-left">Day</th>
//                       <th className="py-3 px-6 text-left">Time</th>
//                       <th className="py-3 px-6 text-left">Subject</th>
//                       <th className="py-3 px-6 text-left">Teacher</th>
//                       <th className="py-3 px-6 text-left">Location</th>
//                     </tr>
//                   </thead>
//                   <tbody className="text-gray-700 text-sm">
//                     {timetable.map((entry) => (
//                       <tr
//                         key={entry.id}
//                         className="border-b border-gray-200 hover:bg-gray-50"
//                       >
//                         <td className="py-3 px-6 text-left whitespace-nowrap">
//                           {entry.day}
//                         </td>
//                         <td className="py-3 px-6 text-left">{entry.time}</td>
//                         <td className="py-3 px-6 text-left">{entry.subject}</td>
//                         <td className="py-3 px-6 text-left">{entry.teacher}</td>
//                         <td className="py-3 px-6 text-left">
//                           {entry.location}
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             ) : (
//               <p className="text-gray-600">No timetable available yet.</p>
//             )}
//           </div>
//         )}
//         {activeTab === "details" && (
//           <div>
//             <h3 className="text-2xl font-semibold text-gray-800 mb-4">
//               My Profile Details
//             </h3>
//             {profile ? (
//               <div className="bg-gray-50 p-6 rounded-lg shadow-sm border border-gray-200">
//                 <p className="text-lg mb-2">
//                   <span className="font-semibold text-gray-700">Name:</span>{" "}
//                   {profile.name}
//                 </p>
//                 <p className="text-lg mb-2">
//                   <span className="font-semibold text-gray-700">
//                     Student ID:
//                   </span>{" "}
//                   {profile.studentId}
//                 </p>
//                 <p className="text-lg mb-2">
//                   <span className="font-semibold text-gray-700">Email:</span>{" "}
//                   {profile.email}
//                 </p>
//                 <p className="text-lg mb-2">
//                   <span className="font-semibold text-gray-700">
//                     Foundation Year:
//                   </span>{" "}
//                   {profile.foundationYear}
//                 </p>
//                 <button className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg shadow-md">
//                   Edit Profile
//                 </button>
//               </div>
//             ) : (
//               <p className="text-gray-600">
//                 Profile information not available.
//               </p>
//             )}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default StudentDashboard;

"use client";

import React, { useEffect, useState } from "react";
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

import {
  getStudentProfile,
  getStudentReports,
  getStudentSubjects,
  getStudentTimetable,
  getVideosBySubjectId,
} from "@/app/actions/student";

import {
  TimetableEntry,
  DayOfWeek,
  TimeSlot,
  User,
  Subject,
  days,
  timeSlots,
} from "@/types/timetable";

import FullTimetableCard from "./dashboard/FullTimetableCard";
import ReportCard from "./ReportCard";

// interface StudentProfile {
//   name: string | null;
//   email: string | null;
//   dateOfBirth: Date | null;
//   nationality: string | null;
//   state: string | null;
//   boardingStatus: string | null;
//   level: string | null;
//   photoUrl: string | null;
//   address: string | null;
//   phone: string | null;
//   gender: string | null;
//   occupation: string | null;
// }

interface StudentProfile {
  id: string; // <-- add this
  name: string | null;
  email: string | null;
  dateOfBirth: Date | null;
  nationality: string | null;
  state: string | null;
  boardingStatus: string | null;
  level: string | null;
  photoUrl: string | null;
  address: string | null;
  phone: string | null;
  gender: string | null;
  occupation: string | null;
}

interface StudentReport {
  id: string;
  term: string;
  subject: string;
  test1: number;
  test2: number;
  exam: number;
  total: number;
  comment: string | null;
}

interface StudentSubject {
  id: string;
  name: string;
}

interface EducationalVideo {
  id: string;
  title: string;
  type: "video";
  link: string;
}

interface RawTimetableEntry {
  id: string;
  day: string;
  time: string;
  subject: string;
  teacher: string;
  location: string;
}

/**
 * Helpers to robustly match incoming day/time strings to
 * the canonical values in `days` and `timeSlots`.
 */
const normalize = (s?: string) =>
  (s || "").toString().trim().toLowerCase().replace(/\s+/g, " ");

const digitsOnly = (s?: string) => (s || "").toString().replace(/\D/g, "");

const tryFindDay = (rawDay?: string): DayOfWeek | undefined => {
  if (!rawDay) return undefined;
  const n = normalize(rawDay);

  // exact match
  let found = days.find((d) => normalize(String(d)) === n);
  if (found) return found as DayOfWeek;

  // startsWith / partial match (e.g., "mon" -> "monday")
  found =
    days.find((d) => normalize(String(d)).startsWith(n)) ||
    days.find((d) => n.startsWith(normalize(String(d))));
  if (found) return found as DayOfWeek;

  // try 3-letter abbreviation mapping
  const abbr = n.slice(0, 3);
  const dayMap: Record<string, string> = {
    mon: "monday",
    tue: "tuesday",
    wed: "wednesday",
    thu: "thursday",
    fri: "friday",
    sat: "saturday",
    sun: "sunday",
  };
  const mapped = dayMap[abbr];
  if (mapped) {
    found = days.find((d) => normalize(String(d)).startsWith(mapped));
    if (found) return found as DayOfWeek;
  }

  return undefined;
};

const tryFindTime = (rawTime?: string): TimeSlot | undefined => {
  if (!rawTime) return undefined;
  const n = normalize(rawTime);
  const rawDigits = digitsOnly(rawTime);

  // exact normalized match
  let found = timeSlots.find((t) => normalize(String(t)) === n);
  if (found) return found as TimeSlot;

  // match by digits (e.g., "08:00-09:00" vs "08:00 - 09:00" or "8:00-9:00")
  if (rawDigits) {
    found =
      timeSlots.find((t) => digitsOnly(String(t)) === rawDigits) ||
      timeSlots.find((t) => digitsOnly(String(t)).startsWith(rawDigits)) ||
      timeSlots.find((t) => rawDigits.startsWith(digitsOnly(String(t))));
    if (found) return found as TimeSlot;
  }

  // partial substring match
  found = timeSlots.find(
    (t) => normalize(String(t)).includes(n) || n.includes(normalize(String(t)))
  );
  if (found) return found as TimeSlot;

  return undefined;
};

/**
 * Transform raw flat DB timetable rows into the nested TimetableEntry[] expected
 * by FullTimetableCard. This attempts to normalize day/time into the canonical
 * `days` and `timeSlots` values so lookups succeed.
 */
const transformTimetableData = (
  rawData: RawTimetableEntry[] = []
): TimetableEntry[] => {
  return rawData.map((item) => {
    // Attempt to find canonical values in the central arrays
    const matchedDay = tryFindDay(item.day);
    const matchedTime = tryFindTime(item.time);

    if (!matchedDay) {
      console.warn(
        `[Timetable] could not match day "${item.day}" to canonical days array.`
      );
    }
    if (!matchedTime) {
      console.warn(
        `[Timetable] could not match time "${item.time}" to canonical timeSlots array.`
      );
    }

    const subject: Subject | null = item.subject
      ? {
          id: item.subject.toLowerCase().replace(/\s+/g, "_"),
          name: item.subject,
        }
      : null;

    const teacher: User | null = item.teacher
      ? {
          id: item.teacher.toLowerCase().replace(/\s+/g, "_"),
          name: item.teacher,
        }
      : null;

    // Use the matched canonical value when found; otherwise fall back to raw value
    return {
      id: item.id,
      // cast to DayOfWeek/TimeSlot because FullTimetableCard expects those union values.
      // When fallback is used (raw string), the cast is still necessary to satisfy TS,
      // and you will see console warnings so you can fix source data.
      day: (matchedDay ?? item.day) as DayOfWeek,
      time: (matchedTime ?? item.time) as TimeSlot,
      subject,
      teacher,
      location: item.location,
    };
  });
};

const getYoutubeVideoId = (url: string) => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
};

const StudentDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("resources");
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [reports, setReports] = useState<StudentReport[]>([]);
  const [subjects, setSubjects] = useState<StudentSubject[]>([]);
  const [videos, setVideos] = useState<EducationalVideo[]>([]);
  const [timetable, setTimetable] = useState<TimetableEntry[]>([]);
  const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const [profileData, subjectsData, reportsData, rawTimetableData] =
          await Promise.all([
            getStudentProfile(),
            getStudentSubjects(),
            getStudentReports(),
            getStudentTimetable(),
          ]);

        if (!profileData) {
          setError("Failed to fetch student profile. Please log in again.");
          return;
        }

        // Ensure rawTimetableData is an array (guard against undefined/null)
        const raw = Array.isArray(rawTimetableData) ? rawTimetableData : [];

        // Transform raw data to nested TimetableEntry[]
        const transformedTimetable = transformTimetableData(raw);

        setProfile(profileData);
        setSubjects(subjectsData ?? []);
        setReports(reportsData ?? []);
        setTimetable(transformedTimetable);
      } catch (e: any) {
        console.error("Dashboard data fetching error:", e);
        setError("An unexpected error occurred while loading your dashboard.");
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  useEffect(() => {
    const fetchVideos = async () => {
      if (selectedSubjectId) {
        setLoading(true);
        try {
          const videosData = await getVideosBySubjectId(selectedSubjectId);
          setVideos(videosData ?? []);
        } catch (e) {
          console.error("Error fetching videos:", e);
          setVideos([]);
        } finally {
          setLoading(false);
        }
      } else {
        setVideos([]);
      }
    };
    fetchVideos();
  }, [selectedSubjectId]);

  const handleSubjectClick = (subjectId: string) => {
    setSelectedSubjectId(subjectId);
    setActiveTab("resources");
  };

  const handleBackToSubjects = () => {
    setSelectedSubjectId(null);
  };

  if (loading && !profile) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100 text-black p-4 font-['Inter']">
        <div className="flex flex-col items-center gap-4 rounded-xl bg-white p-8 shadow-lg">
          <Loader2Icon className="h-10 w-10 animate-spin text-indigo-600" />
          <p className="text-xl font-medium text-gray-700">
            Loading Dashboard...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4 font-['Inter']">
        <div className="rounded-xl bg-red-100 p-6 text-center text-red-700 shadow-md">
          <p className="font-semibold">{error}</p>
        </div>
      </div>
    );
  }

  const formattedEvents = []; // keep placeholder (you had events formatting in previous dashboard component)

  const renderContent = () => {
    switch (activeTab) {
      case "resources":
        return (
          <div className="p-4 md:p-6 text-black">
            <h3 className="mb-4 text-2xl font-semibold text-gray-800">
              Educational Resources
            </h3>
            {selectedSubjectId ? (
              <div>
                <button
                  onClick={handleBackToSubjects}
                  className="mb-4 inline-flex items-center rounded-md bg-indigo-100 px-4 py-2 text-sm font-medium text-indigo-700 transition-colors hover:bg-indigo-200"
                >
                  <ChevronRightIcon className="mr-2 h-4 w-4 rotate-180" /> Back
                  to Subjects
                </button>
                {videos.length > 0 ? (
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {videos.map((video) => {
                      const videoId = getYoutubeVideoId(video.link);
                      return (
                        <div
                          key={video.id}
                          className="overflow-hidden rounded-xl bg-white shadow-md transition-shadow hover:shadow-lg"
                        >
                          {videoId ? (
                            <div className="aspect-video">
                              <iframe
                                className="w-full h-full"
                                src={`https://www.youtube.com/embed/${videoId}?modestbranding=1&rel=0&iv_load_policy=3`}
                                title={video.title}
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                onContextMenu={(e) => e.preventDefault()} // disable right-click
                              ></iframe>
                            </div>
                          ) : (
                            <img
                              src="https://placehold.co/480x360/E2E8F0/1E293B?text=Video+Unavailable"
                              alt={video.title}
                              className="h-48 w-full object-cover"
                            />
                          )}
                          <div className="p-4">
                            <h4 className="text-lg font-semibold text-gray-800">
                              {video.title}
                            </h4>
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                              <YoutubeIcon className="h-4 w-4 text-red-500" />
                              <span>YouTube Video</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-gray-600">
                    No videos available for this subject.
                  </p>
                )}
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {subjects.length > 0 ? (
                  subjects.map((subject) => (
                    <button
                      key={subject.id}
                      onClick={() => handleSubjectClick(subject.id)}
                      className="flex items-center justify-between rounded-xl bg-indigo-50 p-6 text-left transition-colors hover:bg-indigo-100"
                    >
                      <div className="flex items-center gap-4">
                        <BookOpenIcon className="h-8 w-8 text-indigo-600" />
                        <span className="text-lg font-medium text-indigo-900">
                          {subject.name}
                        </span>
                      </div>
                      <ChevronRightIcon className="h-5 w-5 text-indigo-600" />
                    </button>
                  ))
                ) : (
                  <p className="text-gray-600">No subjects assigned yet.</p>
                )}
              </div>
            )}
          </div>
        );

      case "timetable":
        return <FullTimetableCard timetable={timetable} />;

      case "reports":
        return (
          <div className="p-4 md:p-6 text-black">
            <h3 className="mb-4 text-2xl font-semibold text-gray-800">
              My Academic Reports
            </h3>
            <div className="overflow-x-auto rounded-xl shadow-md">
              {reports.length > 0 ? (
                <ReportCard
                  studentName={profile?.name || "Student"}
                  studentId={profile?.id || "N/A"}
                  reports={reports.map((r) => ({
                    subject: r.subject,
                    test1: r.test1,
                    test2: r.test2,
                    exam: r.exam,
                    total: r.total,
                    teacher: "TBD", // or fetch teacher name if available
                    comment: r.comment || "",
                  }))}
                />
              ) : (
                <p className="text-gray-600">No reports available yet.</p>
              )}
            </div>
          </div>
        );

      case "profile":
        return (
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
                  <GlobeIcon className="h-5 w-5 text-indigo-500" />
                  <p className="text-gray-700">
                    <span className="font-semibold">Nationality:</span>{" "}
                    {profile?.nationality || "N/A"}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <MapPinIcon className="h-5 w-5 text-indigo-500" />
                  <p className="text-gray-700">
                    <span className="font-semibold">State:</span>{" "}
                    {profile?.state || "N/A"}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <SchoolIcon className="h-5 w-5 text-indigo-500" />
                  <p className="text-gray-700">
                    <span className="font-semibold">Level:</span>{" "}
                    {profile?.level || "N/A"}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <BookOpenIcon className="h-5 w-5 text-indigo-500" />
                  <p className="text-gray-700">
                    <span className="font-semibold">Boarding Status:</span>{" "}
                    {profile?.boardingStatus || "N/A"}
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
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 font-['Inter'] sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        <h1 className="text-3xl font-bold text-gray-800">Student Dashboard</h1>
        <p className="mt-2 text-gray-600">
          Welcome back, {profile?.name || "Student"}!
        </p>

        <div className="mt-8 flex flex-wrap border-b border-gray-200">
          <button
            className={`-mb-px flex items-center gap-2 border-b-2 px-6 py-3 font-medium transition-colors ${
              activeTab === "resources"
                ? "border-indigo-600 text-indigo-700"
                : "border-transparent text-gray-600 hover:border-gray-300 hover:text-indigo-600"
            }`}
            onClick={() => setActiveTab("resources")}
          >
            <BookOpenIcon className="h-5 w-5" />
            Resources
          </button>
          <button
            className={`-mb-px flex items-center gap-2 border-b-2 px-6 py-3 font-medium transition-colors ${
              activeTab === "timetable"
                ? "border-indigo-600 text-indigo-700"
                : "border-transparent text-gray-600 hover:border-gray-300 hover:text-indigo-600"
            }`}
            onClick={() => setActiveTab("timetable")}
          >
            <CalendarDaysIcon className="h-5 w-5" />
            Timetable
          </button>
          <button
            className={`-mb-px flex items-center gap-2 border-b-2 px-6 py-3 font-medium transition-colors ${
              activeTab === "reports"
                ? "border-indigo-600 text-indigo-700"
                : "border-transparent text-gray-600 hover:border-gray-300 hover:text-indigo-600"
            }`}
            onClick={() => setActiveTab("reports")}
          >
            <FileTextIcon className="h-5 w-5" />
            Reports
          </button>
          <button
            className={`-mb-px flex items-center gap-2 border-b-2 px-6 py-3 font-medium transition-colors ${
              activeTab === "profile"
                ? "border-indigo-600 text-indigo-700"
                : "border-transparent text-gray-600 hover:border-gray-300 hover:text-indigo-600"
            }`}
            onClick={() => setActiveTab("profile")}
          >
            <UserCircleIcon className="h-5 w-5" />
            Profile
          </button>
        </div>

        <div className="mt-6 rounded-xl bg-white shadow-md">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default function App() {
  return <StudentDashboard />;
}
