// app/actions/reportCard.ts
"use server";

import { getStudentSubjects } from "@/app/actions/student"; // your existing fn
import { getScoresAndAttendanceBySubject } from "@/app/actions/reports"; // your existing fn

export async function getStudentReportData(studentId: string) {
  // 1️⃣ Get subjects the student offers
  const subjects = await getStudentSubjects(); // already returns subject id + name + teacher (make sure getStudentSubjects returns teacherName)

  // 2️⃣ Get scores for each subject
  const scoresPromises = subjects.map(async (subject) => {
    const scores = await getScoresAndAttendanceBySubject(subject.id);

    // Find the record for THIS student
    const myScore = scores.find(
      (score) => score.studentSubject.studentId === studentId
    );

    return {
      subjectName: subject.name,
      teacherName:
        (subject as { teacherName?: string }).teacherName ||
        "No Teacher Assigned",
      score1: myScore?.score1 ?? 0,
      score2: myScore?.score2 ?? 0,
      exam: myScore?.exam ?? 0,
      total:
        (myScore?.score1 ?? 0) + (myScore?.score2 ?? 0) + (myScore?.exam ?? 0),
      comment: myScore?.comment ?? "",
    };
  });

  const results = await Promise.all(scoresPromises);

  return {
    student: {
      id: studentId,
      // Add more details if needed
    },
    subjects: results,
  };
}
