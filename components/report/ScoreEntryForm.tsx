// "use client";

// import React, { useState, useEffect } from "react";
// import {
//   getTeachersAndSubjects,
//   getStudentsBySubject,
//   getScoresAndAttendanceBySubject,
//   saveStudentScores,
//   Teacher,
//   Subject,
//   Student,
//   FetchedScore
// } from "@/app/actions/reports";
// import { FaSave, FaSync, FaExclamationCircle } from "react-icons/fa";

// interface ReportEntryFormProps {
//   students: Student[];
//   initialScores: FetchedScore[];
//   subjectId: string;
// }


// interface ScoreState {
//   score1: number;
//   score2: number;
//   exam: number;
//   comment: string;
//   attendance: number;
//   status?: "draft" | "submitted";
// }



// export default function ReportEntryForm({
//   students: propStudents,
//   initialScores,
//   subjectId,
// }: ReportEntryFormProps) {
//   const [teachers, setTeachers] = useState<Teacher[]>([]);
//   const [subjects, setSubjects] = useState<Subject[]>([]);
//   const [selectedTeacherId, setSelectedTeacherId] = useState("");
//   const [selectedSubjectId, setSelectedSubjectId] = useState("");
//   const [students, setStudents] = useState<Student[]>([]);
//   const [scores, setScores] = useState<Map<string, ScoreState>>(new Map());
//   const [isLoading, setIsLoading] = useState(false);
//   const [message, setMessage] = useState<{
//     text: string;
//     type: "success" | "error";
//   } | null>(null);
//   const [status, setStatus] = useState<"draft" | "submitted">("draft");

//   // Initial: teachers + subjects
//   useEffect(() => {
//     const fetchInitialData = async () => {
//       setIsLoading(true);
//       try {
//         const fetchedTeachers = await getTeachersAndSubjects();
//         setTeachers(fetchedTeachers);

//         const allSubjects: Subject[] = [];
//         const subjectIds = new Set<string>();
//         fetchedTeachers.forEach((teacher) => {
//           teacher.subjectsTeaching.forEach((subjectTeaching) => {
//             if (!subjectIds.has(subjectTeaching.subject.id)) {
//               allSubjects.push(subjectTeaching.subject);
//               subjectIds.add(subjectTeaching.subject.id);
//             }
//           });
//         });
//         setSubjects(allSubjects);
//       } catch (error) {
//         console.error("Failed to fetch initial data:", error);
//         setMessage({
//           text: "Failed to load teachers and subjects.",
//           type: "error",
//         });
//       } finally {
//         setIsLoading(false);
//       }
//     };
//     fetchInitialData();
//   }, []);

//   // When subject changes: fetch students + scores
//   useEffect(() => {
//     if (!selectedSubjectId) {
//       setStudents([]);
//       setScores(new Map());
//       setStatus("draft"); // reset UI status when nothing selected
//       return;
//     }

//     const fetchStudentsAndScores = async () => {
//       setIsLoading(true);
//       setMessage(null);
//       try {
//         const fetchedStudents = await getStudentsBySubject(selectedSubjectId);
//         const fetchedScores = await getScoresAndAttendanceBySubject(
//           selectedSubjectId
//         );

//         const newScoresMap = new Map<string, ScoreState>();
//         let overallStatus: "draft" | "submitted" = "draft"; // 👈 default

//         fetchedStudents.forEach((student) => {
//           const existingScore = fetchedScores.find(
//             (s) => s.studentSubject.studentId === student.id
//           );

//           const scoreData: ScoreState = existingScore
//             ? {
//                 score1: existingScore.score1,
//                 score2: existingScore.score2,
//                 exam: existingScore.exam,
//                 comment: existingScore.comment || "",
//                 attendance: existingScore.attendance,
//                 status: ((existingScore as any).status as "draft" | "submitted") ?? "draft",

//               }
//             : {
//                 score1: 0,
//                 score2: 0,
//                 exam: 0,
//                 comment: "",
//                 attendance: 0,
//                 status: "draft",
//               };

//           if (scoreData.status === "submitted") {
//             overallStatus = "submitted"; // 👈 if any score is submitted, lock form
//           }

//           newScoresMap.set(student.id, scoreData);
//         });

//         setStudents(fetchedStudents);
//         setScores(newScoresMap);
//         setStatus(overallStatus); // 👈 set global subject status here
//       } catch (error) {
//         console.error("Failed to fetch students or scores:", error);
//         setMessage({
//           text: "Failed to load students or scores.",
//           type: "error",
//         });
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchStudentsAndScores();
//   }, [selectedSubjectId]);

//   const handleScoreChange = (
//     studentId: string,
//     field: keyof ScoreState,
//     value: string
//   ) => {
//     // Prevent editing if subject has been submitted
//     if (status === "submitted") return;

//     const studentScore = scores.get(studentId);
//     if (!studentScore || studentScore.status === "submitted") return;

//     const newScores = new Map(scores);
//     newScores.set(studentId, {
//       ...studentScore,
//       [field]: field === "comment" ? value : parseInt(value) || 0,
//     });
//     setScores(newScores);
//   };

//   const handleSaveScores = async (mode: "draft" | "submit") => {
//     if (!selectedSubjectId || !students.length) {
//       setMessage({
//         text: "Please select a subject and ensure there are students.",
//         type: "error",
//       });
//       return;
//     }

//     setIsLoading(true);
//     setMessage(null);

//     const scoresToSave = students.map((student) => ({
//       ...scores.get(student.id)!,
//       studentId: student.id,
//       subjectId: selectedSubjectId,
//     }));

//     try {
//       const result = await saveStudentScores(
//         scoresToSave,
//         selectedSubjectId,
//         mode
//       );

//       if (result.success) {
//         setMessage({
//           text:
//             mode === "submit"
//               ? "Scores submitted for approval."
//               : "Scores saved as draft.",
//           type: "success",
//         });

//         if (mode === "submit") {
//           // Lock the UI right away
//           const updatedScores = new Map(scores);
//           students.forEach((student) => {
//             const s = updatedScores.get(student.id);
//             if (s) updatedScores.set(student.id, { ...s, status: "submitted" });
//           });
//           setScores(updatedScores);
//           setStatus("submitted"); // ← critical for surviving refresh along with server persistence
//         }
//       } else {
//         setMessage({
//           text: result.error || "Failed to save scores.",
//           type: "error",
//         });
//       }
//     } catch (error) {
//       console.error("Failed to save scores:", error);
//       setMessage({
//         text: "An unexpected error occurred while saving scores.",
//         type: "error",
//       });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const currentTeacher = teachers.find((t) => t.id === selectedTeacherId);
//   const availableSubjects =
//     currentTeacher?.subjectsTeaching.map((st) => st.subject) || [];

//   const isGloballyLocked = status === "submitted";

//   return (
//     <div className="bg-white rounded-xl shadow-lg p-6 max-w-full mx-auto">
//       <h1 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-4">
//         Report Entry
//       </h1>

//       {/* Teacher & Subject Selectors */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
//         <div>
//           <label className="block text-sm font-medium text-gray-700">
//             Select Teacher
//           </label>
//           <select
//             value={selectedTeacherId}
//             onChange={(e) => {
//               setSelectedTeacherId(e.target.value);
//               setSelectedSubjectId(""); // resetting selection also resets local UI
//               setStatus("draft");
//             }}
//             className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
//           >
//             <option value="">Select a Teacher</option>
//             {teachers.map((teacher) => (
//               <option key={teacher.id} value={teacher.id}>
//                 {teacher.name}
//               </option>
//             ))}
//           </select>
//         </div>

//         <div>
//           <label className="block text-sm font-medium text-gray-700">
//             Select Subject
//           </label>
//           <select
//             value={selectedSubjectId}
//             onChange={(e) => setSelectedSubjectId(e.target.value)}
//             className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
//             disabled={!selectedTeacherId}
//           >
//             <option value="">Select a Subject</option>
//             {availableSubjects.map((subject) => (
//               <option key={subject.id} value={subject.id}>
//                 {subject.name}
//               </option>
//             ))}
//           </select>
//         </div>
//       </div>

//       {isLoading && (
//         <div className="text-center py-8">
//           <FaSync className="animate-spin text-indigo-500 text-3xl mx-auto mb-4" />
//           <p className="text-gray-600">Loading data...</p>
//         </div>
//       )}

//       {/* Messages */}
//       {message && (
//         <div
//           className={`rounded-md p-4 mb-4 ${
//             message.type === "success"
//               ? "bg-green-100 text-green-800"
//               : "bg-red-100 text-red-800"
//           }`}
//         >
//           <div className="flex items-center">
//             <FaExclamationCircle className="h-5 w-5 mr-3" />
//             <p className="font-medium">{message.text}</p>
//           </div>
//         </div>
//       )}

//       {/* Table */}
//       {!isLoading && selectedSubjectId && students.length > 0 && (
//         <>
//           <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm mt-6">
//             <table className="min-w-full divide-y divide-gray-200">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th className="px-6 py-3 text-left text-xs">Student Name</th>
//                   <th className="px-6 py-3 text-center text-xs">Test 1 (40)</th>
//                   <th className="px-6 py-3 text-center text-xs">Test 2 (40)</th>
//                   <th className="px-6 py-3 text-center text-xs">Exam (120)</th>
//                   <th className="px-6 py-3 text-center text-xs">Total (200)</th>
//                   <th className="px-6 py-3 text-center text-xs">Comment</th>
//                   <th className="px-6 py-3 text-center text-xs">
//                     Attendance (%)
//                   </th>
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {students.map((student) => {
//                   const studentScores = scores.get(student.id);
//                   const total =
//                     (studentScores?.score1 || 0) +
//                     (studentScores?.score2 || 0) +
//                     (studentScores?.exam || 0);

//                   return (
//                     <tr key={student.id}>
//                       <td className="px-6 py-4">{student.name}</td>
//                       <td className="px-6 py-4">
//                         <input
//                           type="number"
//                           value={studentScores?.score1 ?? ""}
//                           onChange={(e) =>
//                             handleScoreChange(
//                               student.id,
//                               "score1",
//                               e.target.value
//                             )
//                           }
//                           disabled={isGloballyLocked}
//                           min={0}
//                           max={40}
//                           className="w-full text-center border-gray-300 rounded-md shadow-sm text-sm"
//                         />
//                       </td>
//                       <td className="px-6 py-4">
//                         <input
//                           type="number"
//                           value={studentScores?.score2 ?? ""}
//                           onChange={(e) =>
//                             handleScoreChange(
//                               student.id,
//                               "score2",
//                               e.target.value
//                             )
//                           }
//                           disabled={isGloballyLocked}
//                           min={0}
//                           max={40}
//                           className="w-full text-center border-gray-300 rounded-md shadow-sm text-sm"
//                         />
//                       </td>
//                       <td className="px-6 py-4">
//                         <input
//                           type="number"
//                           value={studentScores?.exam ?? ""}
//                           onChange={(e) =>
//                             handleScoreChange(
//                               student.id,
//                               "exam",
//                               e.target.value
//                             )
//                           }
//                           disabled={isGloballyLocked}
//                           min={0}
//                           max={120}
//                           className="w-full text-center border-gray-300 rounded-md shadow-sm text-sm"
//                         />
//                       </td>
//                       <td className="px-6 py-4 text-center font-bold">
//                         {total}
//                       </td>
//                       <td className="px-6 py-4">
//                         <input
//                           type="text"
//                           value={studentScores?.comment ?? ""}
//                           onChange={(e) =>
//                             handleScoreChange(
//                               student.id,
//                               "comment",
//                               e.target.value
//                             )
//                           }
//                           disabled={isGloballyLocked}
//                           className="w-full border-gray-300 rounded-md shadow-sm text-sm"
//                         />
//                       </td>
//                       <td className="px-6 py-4">
//                         <input
//                           type="number"
//                           value={studentScores?.attendance ?? ""}
//                           onChange={(e) =>
//                             handleScoreChange(
//                               student.id,
//                               "attendance",
//                               e.target.value
//                             )
//                           }
//                           disabled={isGloballyLocked}
//                           min={0}
//                           max={100}
//                           className="w-full text-center border-gray-300 rounded-md shadow-sm text-sm"
//                         />
//                       </td>
//                     </tr>
//                   );
//                 })}
//               </tbody>
//             </table>
//           </div>

//           {/* Action buttons */}
//           <div className="mt-6 flex justify-end space-x-3">
//             {status === "draft" && (
//               <>
//                 <button
//                   onClick={() => handleSaveScores("draft")}
//                   disabled={isLoading}
//                   className="px-4 py-2 rounded-md bg-white border text-gray-700 disabled:opacity-50"
//                 >
//                   Save as Draft
//                 </button>
//                 <button
//                   onClick={() => handleSaveScores("submit")}
//                   disabled={isLoading}
//                   className="px-4 py-2 rounded-md bg-indigo-600 text-white disabled:opacity-50"
//                 >
//                   Submit for Approval
//                 </button>
//               </>
//             )}

//             {status === "submitted" && (
//               <button
//                 disabled
//                 className="px-4 py-2 rounded-md bg-yellow-500 text-white cursor-not-allowed"
//               >
//                 Pending Approval
//               </button>
//             )}
//           </div>
//         </>
//       )}
//     </div>
//   );
// }


"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  getTeachersAndSubjects,
  getStudentsBySubject,
  getScoresAndAttendanceBySubject,
  saveStudentScores,
  Teacher,
  Subject,
  Student,
  FetchedScore,
} from "@/app/actions/reports";
import { FaSave, FaSync, FaExclamationCircle } from "react-icons/fa";

/* -- types used inside component -- */
interface ScoreState {
  score1: number;
  score2: number;
  exam: number;
  comment: string;
  attendance: number;
  status?: "draft" | "submitted";
}

interface ReportEntryFormProps {
  // if these are provided, component runs in *controlled* mode and
  // DOES NOT show teacher/subject selectors (parent handles selection).
  students?: Student[];
  initialScores?: FetchedScore[];
  subjectId?: string;
}

/* --- component --- */
export default function ReportEntryForm({
  students: propStudents,
  initialScores: propInitialScores,
  subjectId: propSubjectId,
}: ReportEntryFormProps) {
  // mode detection
  const isControlled = Boolean(propSubjectId);

  // Common state (used in both modes)
  const [students, setStudents] = useState<Student[]>(propStudents ?? []);
  const [scores, setScores] = useState<Map<string, ScoreState>>(
    new Map()
  );
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<
    { text: string; type: "success" | "error" } | null
  >(null);
  const [status, setStatus] = useState<"draft" | "submitted">("draft");

  // Uncontrolled-only state (selectors & teacher/subject data)
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [selectedTeacherId, setSelectedTeacherId] = useState("");
  const [selectedSubjectId, setSelectedSubjectId] = useState("");

  // Helper to build initial scores map from students + fetchedScores
  const buildScoresMap = (
    studentsList: Student[],
    fetchedScores: FetchedScore[]
  ) => {
    const map = new Map<string, ScoreState>();
    let overallStatus: "draft" | "submitted" = "draft";

    studentsList.forEach((student) => {
      const existingScore = fetchedScores.find(
        (s) => s.studentSubject.studentId === student.id
      );

      const state: ScoreState = existingScore
        ? {
            score1: existingScore.score1 ?? 0,
            score2: existingScore.score2 ?? 0,
            exam: existingScore.exam ?? 0,
            comment: existingScore.comment ?? "",
            attendance: existingScore.attendance ?? 0,
            // safe read + type assertion + default
            status:
              ((existingScore as any)?.status as "draft" | "submitted") ??
              "draft",
          }
        : {
            score1: 0,
            score2: 0,
            exam: 0,
            comment: "",
            attendance: 0,
            status: "draft",
          };

      if (state.status === "submitted") overallStatus = "submitted";
      map.set(student.id, state);
    });

    return { map, overallStatus };
  };

  /* -------------------------
     Controlled-mode initialization
     ------------------------- */
  useEffect(() => {
    if (!isControlled) return;
    // Controlled mode: initialize from props.
    const sList = propStudents ?? [];
    const fetchedScores = propInitialScores ?? [];
    const { map, overallStatus } = buildScoresMap(sList, fetchedScores);

    setStudents(sList);
    setScores(map);
    setStatus(overallStatus);
    // we don't fetch teachers/subjects or show selectors in controlled mode
  }, [isControlled, propStudents, propInitialScores]);

  /* -------------------------
     Uncontrolled-mode: fetch teachers & subjects on mount
     ------------------------- */
  useEffect(() => {
    if (isControlled) return;

    const fetchInitial = async () => {
      setIsLoading(true);
      try {
        const fetchedTeachers = await getTeachersAndSubjects();
        setTeachers(fetchedTeachers);

        const allSubjects: Subject[] = [];
        const seen = new Set<string>();
        fetchedTeachers.forEach((t) =>
          t.subjectsTeaching.forEach((st) => {
            if (!seen.has(st.subject.id)) {
              allSubjects.push(st.subject);
              seen.add(st.subject.id);
            }
          })
        );
        setSubjects(allSubjects);
      } catch (err) {
        console.error("Failed to fetch teachers/subjects:", err);
        setMessage({ text: "Failed to load teachers and subjects.", type: "error" });
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitial();
  }, [isControlled]);

  /* -------------------------
     Uncontrolled-mode: when selectedSubjectId changes, fetch students & scores
     ------------------------- */
  useEffect(() => {
    if (isControlled) return;
    if (!selectedSubjectId) {
      setStudents([]);
      setScores(new Map());
      setStatus("draft");
      return;
    }

    const fetchStudentsAndScores = async () => {
      setIsLoading(true);
      setMessage(null);
      try {
        const [fetchedStudents, fetchedScores] = await Promise.all([
          getStudentsBySubject(selectedSubjectId),
          getScoresAndAttendanceBySubject(selectedSubjectId),
        ]);

        const { map, overallStatus } = buildScoresMap(fetchedStudents, fetchedScores);

        setStudents(fetchedStudents);
        setScores(map);
        setStatus(overallStatus);
      } catch (err) {
        console.error("Failed to fetch students/scores:", err);
        setMessage({ text: "Failed to load students or scores.", type: "error" });
      } finally {
        setIsLoading(false);
      }
    };

    fetchStudentsAndScores();
  }, [isControlled, selectedSubjectId]);

  /* -------------------------
     If uncontrolled, compute available subjects from selected teacher
     ------------------------- */
  const availableSubjects = useMemo(() => {
    if (isControlled) return [];
    const teacher = teachers.find((t) => t.id === selectedTeacherId);
    return teacher ? teacher.subjectsTeaching.map((st) => st.subject) : [];
  }, [isControlled, teachers, selectedTeacherId]);

  /* -------------------------
     Handlers (shared)
     ------------------------- */
  const isGloballyLocked = status === "submitted";

  const handleScoreChange = (
    studentId: string,
    field: keyof ScoreState,
    value: string
  ) => {
    if (isGloballyLocked) return;

    const current = scores.get(studentId);
    if (!current || current.status === "submitted") return;

    const newScores = new Map(scores);
    newScores.set(studentId, {
      ...current,
      [field]: field === "comment" ? value : parseInt(value) || 0,
    });
    setScores(newScores);
  };

  const handleSaveScores = async (mode: "draft" | "submit") => {
    // determine current subject id
    const currentSubjectId = isControlled ? propSubjectId : selectedSubjectId;
    if (!currentSubjectId || students.length === 0) {
      setMessage({ text: "Please select a subject and ensure there are students.", type: "error" });
      return;
    }

    setIsLoading(true);
    setMessage(null);

    const scoresToSave = students.map((student) => ({
      ...scores.get(student.id)!,
      studentId: student.id,
      subjectId: currentSubjectId,
    }));

    try {
      const result = await saveStudentScores(scoresToSave, currentSubjectId, mode);

      if (result.success) {
        setMessage({
          text: mode === "submit" ? "Scores submitted for approval." : "Scores saved as draft.",
          type: "success",
        });

        if (mode === "submit") {
          // lock UI
          const updated = new Map(scores);
          students.forEach((st) => {
            const s = updated.get(st.id);
            if (s) updated.set(st.id, { ...s, status: "submitted" });
          });
          setScores(updated);
          setStatus("submitted");
        }
      } else {
        setMessage({ text: result.error || "Failed to save scores.", type: "error" });
      }
    } catch (err) {
      console.error("Failed to save scores:", err);
      setMessage({ text: "An unexpected error occurred while saving scores.", type: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  /* -------------------------
     Render
     ------------------------- */
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 max-w-full mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-4">Report Entry</h1>

      {/* If uncontrolled, show Teacher & Subject selectors */}
      {!isControlled && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Select Teacher</label>
            <select
              value={selectedTeacherId}
              onChange={(e) => {
                setSelectedTeacherId(e.target.value);
                setSelectedSubjectId("");
                setStatus("draft");
              }}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
            >
              <option value="">Select a Teacher</option>
              {teachers.map((t) => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Select Subject</label>
            <select
              value={selectedSubjectId}
              onChange={(e) => setSelectedSubjectId(e.target.value)}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
              disabled={!selectedTeacherId}
            >
              <option value="">Select a Subject</option>
              {availableSubjects.map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Loading */}
      {isLoading && (
        <div className="text-center py-8">
          <FaSync className="animate-spin text-indigo-500 text-3xl mx-auto mb-4" />
          <p className="text-gray-600">Loading data...</p>
        </div>
      )}

      {/* Messages */}
      {message && (
        <div className={`rounded-md p-4 mb-4 ${message.type === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
          <div className="flex items-center">
            <FaExclamationCircle className="h-5 w-5 mr-3" />
            <p className="font-medium">{message.text}</p>
          </div>
        </div>
      )}

      {/* Table: shown when controlled OR (uncontrolled and subject selected) */}
      {(!isLoading && (isControlled ? Boolean(propSubjectId) : Boolean(selectedSubjectId)) && students.length > 0) && (
        <>
          <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm mt-6">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs">Student Name</th>
                  <th className="px-6 py-3 text-center text-xs">Test 1 (40)</th>
                  <th className="px-6 py-3 text-center text-xs">Test 2 (40)</th>
                  <th className="px-6 py-3 text-center text-xs">Exam (120)</th>
                  <th className="px-6 py-3 text-center text-xs">Total (200)</th>
                  <th className="px-6 py-3 text-center text-xs">Comment</th>
                  <th className="px-6 py-3 text-center text-xs">Attendance (%)</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {students.map((student) => {
                  const studentScores = scores.get(student.id);
                  const total = (studentScores?.score1 || 0) + (studentScores?.score2 || 0) + (studentScores?.exam || 0);

                  return (
                    <tr key={student.id}>
                      <td className="px-6 py-4">{student.name}</td>
                      <td className="px-6 py-4">
                        <input
                          type="number"
                          value={studentScores?.score1 ?? ""}
                          onChange={(e) => handleScoreChange(student.id, "score1", e.target.value)}
                          disabled={isGloballyLocked}
                          min={0}
                          max={40}
                          className="w-full text-center border-gray-300 rounded-md shadow-sm text-sm"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <input
                          type="number"
                          value={studentScores?.score2 ?? ""}
                          onChange={(e) => handleScoreChange(student.id, "score2", e.target.value)}
                          disabled={isGloballyLocked}
                          min={0}
                          max={40}
                          className="w-full text-center border-gray-300 rounded-md shadow-sm text-sm"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <input
                          type="number"
                          value={studentScores?.exam ?? ""}
                          onChange={(e) => handleScoreChange(student.id, "exam", e.target.value)}
                          disabled={isGloballyLocked}
                          min={0}
                          max={120}
                          className="w-full text-center border-gray-300 rounded-md shadow-sm text-sm"
                        />
                      </td>
                      <td className="px-6 py-4 text-center font-bold">{total}</td>
                      <td className="px-6 py-4">
                        <input
                          type="text"
                          value={studentScores?.comment ?? ""}
                          onChange={(e) => handleScoreChange(student.id, "comment", e.target.value)}
                          disabled={isGloballyLocked}
                          className="w-full border-gray-300 rounded-md shadow-sm text-sm"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <input
                          type="number"
                          value={studentScores?.attendance ?? ""}
                          onChange={(e) => handleScoreChange(student.id, "attendance", e.target.value)}
                          disabled={isGloballyLocked}
                          min={0}
                          max={100}
                          className="w-full text-center border-gray-300 rounded-md shadow-sm text-sm"
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Action buttons */}
          <div className="mt-6 flex justify-end space-x-3">
            {status === "draft" && (
              <>
                <button
                  onClick={() => handleSaveScores("draft")}
                  disabled={isLoading}
                  className="px-4 py-2 rounded-md bg-white border text-gray-700 disabled:opacity-50"
                >
                  Save as Draft
                </button>
                <button
                  onClick={() => handleSaveScores("submit")}
                  disabled={isLoading}
                  className="px-4 py-2 rounded-md bg-indigo-600 text-white disabled:opacity-50"
                >
                  Submit for Approval
                </button>
              </>
            )}

            {status === "submitted" && (
              <button disabled className="px-4 py-2 rounded-md bg-yellow-500 text-white cursor-not-allowed">
                Pending Approval
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}
