"use server";

import { PrismaClient, Prisma } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { revalidatePath } from "next/cache";

const prisma = new PrismaClient();

// Define interfaces to ensure type safety across the application
export interface Subject {
  id: string;
  name: string;
}

export interface Teacher {
  id: string;
  name: string | null;
  subjectsTeaching: {
    subject: Subject;
  }[];
}

export interface ScoreData {
  studentId: string;
  score1: number;
  score2: number;
  exam: number;
  comment: string;
  attendance: number;
  subjectId: string;
}

export interface Student {
  id: string;
  name: string | null;
}

export interface FetchedScore {
  studentSubject: { studentId: string };
  score1: number;
  score2: number;
  exam: number;
  comment: string | null;
  attendance: number;
}

// New interfaces for the Broadsheet Report
interface StudentWithRankAndAverage extends Student {
  averageScore: number;
  rank: number;
}

/**
 * Fetches all subjects for the dropdown.
 */
export async function getSubjects() {
  // const session = await getServerSession(authOptions);
  // if (!session) {
  //   return []; // Return empty data for unauthorized access
  // }

  try {
    const subjects = await prisma.subject.findMany({
      orderBy: { name: "asc" },
    });
    return subjects;
  } catch (error) {
    console.error("Error fetching subjects:", error);
    return [];
  }
}

/**
 * Fetches all teachers and the subjects they are assigned to.
 */
export async function getTeachersAndSubjects(): Promise<Teacher[]> {
  // const session = await getServerSession(authOptions);
  // if (
  //   !session ||
  //   (session.user.role !== "ADMIN" && session.user.role !== "teacher")
  // ) {
  //   return []; // Return empty data for unauthorized access
  // }

  try {
    const teachers = await prisma.user.findMany({
      // IMPORTANT: The role is "teacher" in lowercase based on your database
      where: { role: "teacher" },
      select: {
        id: true,
        name: true,
        subjectsTeaching: {
          select: {
            subject: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
      orderBy: { name: "asc" },
    });
    console.log("Prisma query result for teachers:", teachers);
    return teachers as Teacher[];
  } catch (error) {
    console.error("Error fetching teachers and subjects:", error);
    return [];
  }
}

/**
 * Fetches all students enrolled in a specific subject.
 */
export async function getStudentsBySubject(
  subjectId: string
): Promise<Student[]> {
  // const session = await getServerSession(authOptions);
  // if (
  //   !session ||
  //   (session.user.role !== "ADMIN" && session.user.role !== "teacher")
  // ) {
  //   return []; // Return empty data for unauthorized access
  // }

  try {
    const enrollments = await prisma.studentSubject.findMany({
      where: {
        subjectId,
      },
      select: {
        student: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: { student: { name: "asc" } },
    });
    const students = enrollments.map((enrollment) => enrollment.student);
    return students as Student[];
  } catch (error) {
    console.error("Error fetching students by subject:", error);
    return [];
  }
}

/**
 * Fetches existing scores and attendance for a specific subject.
 */
export async function getScoresAndAttendanceBySubject(
  subjectId: string
): Promise<FetchedScore[]> {
  // const session = await getServerSession(authOptions);
  // if (
  //   !session ||
  //   (session.user.role !== "ADMIN" && session.user.role !== "teacher")
  // ) {
  //   return []; // Return empty data for unauthorized access
  // }

  try {
    const scores = await prisma.score.findMany({
      where: {
        studentSubject: {
          subjectId: subjectId,
        },
      },
      select: {
        score1: true,
        score2: true,
        exam: true,
        comment: true,
        attendance: true,
        status: true, // 👈 add this
        studentSubject: {
          select: {
            studentId: true,
          },
        },
      },
    });

    const formattedScores: FetchedScore[] = scores.map((score) => ({
      studentSubject: {
        studentId: score.studentSubject.studentId,
      },
      score1: score.score1 ?? 0,
      score2: score.score2 ?? 0,
      exam: score.exam ?? 0,
      comment: score.comment ?? "",
      attendance: score.attendance ?? 0,
      status: (score.status as "draft" | "submitted") ?? "draft", // 👈 include here
    }));

    return formattedScores;
  } catch (error) {
    console.error("Error fetching scores and attendance by subject:", error);
    return [];
  }
}

/**
 * Saves or updates student scores and attendance for a specific subject.
 */
// export async function saveStudentScores(
//   scoresToSave: ScoreData[],
//   subjectId: string
// ) {
//   // const session = await getServerSession(authOptions);
//   // if (
//   //   !session ||
//   //   (session.user.role !== "ADMIN" && session.user.role !== "teacher")
//   // ) {
//   //   return { success: false, error: "Unauthorized access." }; // Return an error message
//   // }

//   console.log("--- Starting saveStudentScores server action ---");
//   console.log("Subject ID:", subjectId);
//   console.log("Payload to save:", scoresToSave);

//   try {
//     const studentSubjects = await prisma.studentSubject.findMany({
//       where: {
//         subjectId,
//         studentId: {
//           in: scoresToSave.map((score) => score.studentId),
//         },
//       },
//     });

//     console.log("Found studentSubject records:", studentSubjects);
//     if (studentSubjects.length === 0) {
//       console.error(
//         "No studentSubject records found for the given subject and students."
//       );
//       return {
//         success: false,
//         error: "Student enrollments not found for this subject.",
//       };
//     }

//     const transactionOperations: Prisma.PrismaPromise<any>[] = [];

//     for (const score of scoresToSave) {
//       const studentSubject = studentSubjects.find(
//         (ss) => ss.studentId === score.studentId
//       );

//       if (!studentSubject) {
//         console.warn(
//           `Student ${score.studentId} not found in fetched enrollments. Skipping.`
//         );
//         continue; // Skip this score and move to the next
//       }

//       const total = score.score1 + score.score2 + score.exam;

//       console.log(
//         `Upserting score for student: ${score.studentId}, subject: ${subjectId}, studentSubjectId: ${studentSubject.id}`
//       );
//       console.log("Score data:", { ...score, total });

//       transactionOperations.push(
//         prisma.score.upsert({
//           where: { studentSubjectId: studentSubject.id },
//           update: {
//             score1: score.score1,
//             score2: score.score2,
//             exam: score.exam,
//             total,
//             comment: score.comment,
//             attendance: score.attendance,
//           },
//           create: {
//             studentSubjectId: studentSubject.id,
//             score1: score.score1,
//             score2: score.score2,
//             exam: score.exam,
//             total,
//             comment: score.comment,
//             attendance: score.attendance,
//           },
//         })
//       );
//     }

//     if (transactionOperations.length > 0) {
//       await prisma.$transaction(transactionOperations);
//       console.log("Transaction completed successfully.");
//     } else {
//       console.log("No valid scores to save in the transaction.");
//     }

//     console.log("--- saveStudentScores server action finished ---");
//     return { success: true, message: "Scores saved successfully!" };
//   } catch (error) {
//     console.error("Error saving student scores:", error);
//     return { success: false, error: "Failed to save scores." };
//   }
// }

export async function saveStudentScores(
  scoresToSave: ScoreData[],
  subjectId: string,
  mode: "draft" | "submit" = "draft" // 👈 added default mode
) {
  // const session = await getServerSession(authOptions);
  // if (
  //   !session ||
  //   (session.user.role !== "ADMIN" && session.user.role !== "teacher")
  // ) {
  //   return { success: false, error: "Unauthorized access." }; // Return an error message
  // }

  console.log("--- Starting saveStudentScores server action ---");
  console.log("Subject ID:", subjectId);
  console.log("Payload to save:", scoresToSave);
  console.log("Mode:", mode);

  try {
    const studentSubjects = await prisma.studentSubject.findMany({
      where: {
        subjectId,
        studentId: {
          in: scoresToSave.map((score) => score.studentId),
        },
      },
    });

    console.log("Found studentSubject records:", studentSubjects);
    if (studentSubjects.length === 0) {
      console.error(
        "No studentSubject records found for the given subject and students."
      );
      return {
        success: false,
        error: "Student enrollments not found for this subject.",
      };
    }

    const transactionOperations: Prisma.PrismaPromise<any>[] = [];

    for (const score of scoresToSave) {
      const studentSubject = studentSubjects.find(
        (ss) => ss.studentId === score.studentId
      );

      if (!studentSubject) {
        console.warn(
          `Student ${score.studentId} not found in fetched enrollments. Skipping.`
        );
        continue; // Skip this score and move to the next
      }

      const total = score.score1 + score.score2 + score.exam;

      console.log(
        `Upserting score for student: ${score.studentId}, subject: ${subjectId}, studentSubjectId: ${studentSubject.id}`
      );
      console.log("Score data:", { ...score, total });

      transactionOperations.push(
        prisma.score.upsert({
          where: { studentSubjectId: studentSubject.id },
          update: {
            score1: score.score1,
            score2: score.score2,
            exam: score.exam,
            total,
            comment: score.comment,
            attendance: score.attendance,
            status: mode === "submit" ? "submitted" : "draft", // 👈 added status
          },
          create: {
            studentSubjectId: studentSubject.id,
            score1: score.score1,
            score2: score.score2,
            exam: score.exam,
            total,
            comment: score.comment,
            attendance: score.attendance,
            status: mode === "submit" ? "submitted" : "draft", // 👈 added status
          },
        })
      );
    }

    if (transactionOperations.length > 0) {
      await prisma.$transaction(transactionOperations);
      console.log("Transaction completed successfully.");
    } else {
      console.log("No valid scores to save in the transaction.");
    }

    console.log("--- saveStudentScores server action finished ---");
    return {
      success: true,
      message:
        mode === "submit"
          ? "Scores submitted successfully!"
          : "Scores saved as draft.",
    };
  } catch (error) {
    console.error("Error saving student scores:", error);
    return { success: false, error: "Failed to save scores." };
  }
}

export async function submitScoresForApproval(studentSubjectIds: string[]) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "teacher") {
    return { error: "Only teachers can submit scores for approval." };
  }

  try {
    await prisma.score.updateMany({
      where: {
        studentSubjectId: { in: studentSubjectIds },
        status: "draft",
      },
      data: { status: "submitted" },
    });

    return { success: "Scores submitted for approval." };
  } catch (e) {
    console.error("Error submitting scores:", e);
    return { error: "Failed to submit scores." };
  }
}

// ✅ Fetch all submitted reports grouped by teacher & subject
export async function getSubmittedReports() {
  const reports = await prisma.score.findMany({
    where: { status: "submitted" },
    include: {
      studentSubject: {
        include: {
          student: true,
          subject: {
            include: {
              teachers: {
                include: {
                  teacher: true, // fetch teacher info
                },
              },
            },
          },
        },
      },
    },
  });

  // Group by teacher + subject
  const grouped: Record<string, any> = {};
  for (const r of reports) {
    const subject = r.studentSubject.subject;
    const teacher = subject.teachers[0]?.teacher; // first teacher assigned

    const teacherId = teacher?.id ?? "unknown";
    const subjectName = subject.name;
    const key = `${teacherId}-${subjectName}`;

    if (!grouped[key]) {
      grouped[key] = {
        teacherId,
        subjectName,
        teacherName: teacher?.name ?? "Unknown",
        scores: [],
      };
    }

    grouped[key].scores.push(r);
  }

  return Object.values(grouped);
}

// ✅ Approve all scores for a teacher & subject
/**
 * Approve submitted scores for admin.
 * Only scores with status "submitted" will be approved.
 * Sets `approvedById` to the current admin's user ID.
 */
export async function approveReports(scoreIds: string[]) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.id) {
    throw new Error("Unauthorized");
  }

  const adminId = session.user.id;

  await prisma.score.updateMany({
    where: {
      id: { in: scoreIds },
      status: "submitted", // only submitted scores
    },
    data: {
      status: "approved",
      approvedById: adminId,
      publishedAt: new Date(),
    },
  });
}

export async function rejectReports(scoreIds: string[]) {
  await prisma.score.updateMany({
    where: { id: { in: scoreIds } },
    data: {
      status: "rejected",
    },
  });
}

// // ✅ Reject reports
// export async function rejectReports(scoreIds: string[]) {
//   await prisma.score.updateMany({
//     where: { id: { in: scoreIds } },
//     data: { status: "rejected" },
//   });

//   revalidatePath("/reports/approve");
// }

/**
 * Fetches all data required for the broadsheet report.
 * Now includes average scores and calculated rank.
 */
export async function getBroadsheetData() {
  // const session = await getServerSession(authOptions);
  // if (!session || session.user.role !== "ADMIN") {
  //   // Return empty data for unauthorized access
  //   return {
  //     students: [],
  //     subjects: [],
  //     scoresMap: {},
  //   };
  // }

  try {
    const students = await prisma.user.findMany({
      // Corrected role to be lowercase
      where: { role: "student" },
      select: {
        id: true,
        name: true,
        subjectsTaking: {
          select: {
            subject: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        subjectsTeaching: {
          select: {
            subjectId: true,
          },
        },
      },
      orderBy: { name: "asc" },
    });

    const subjects = await prisma.subject.findMany({
      select: {
        id: true,
        name: true,
      },
      orderBy: { name: "asc" },
    });

    const scores = await prisma.score.findMany({
      select: {
        total: true,
        studentSubject: {
          select: {
            studentId: true,
            subjectId: true,
          },
        },
      },
    });

    // Create the scores map and calculate student averages
    const scoresMap: { [key: string]: { [key: string]: { total: number } } } =
      {};
    const studentAverages = new Map<
      string,
      { totalScore: number; subjectCount: number }
    >();

    scores.forEach((score) => {
      const studentId = score.studentSubject.studentId;
      const subjectId = score.studentSubject.subjectId;

      if (!scoresMap[studentId]) {
        scoresMap[studentId] = {};
      }
      scoresMap[studentId][subjectId] = score;

      if (!studentAverages.has(studentId)) {
        studentAverages.set(studentId, { totalScore: 0, subjectCount: 0 });
      }
      const averageData = studentAverages.get(studentId)!;
      averageData.totalScore += score.total;
      averageData.subjectCount++;
    });

    // Combine student data with calculated averages
    const studentsWithAverages = students.map((student) => {
      const averageData = studentAverages.get(student.id) || {
        totalScore: 0,
        subjectCount: 0,
      };
      // The average is correctly calculated as the sum of total scores divided by the count of subjects that have a score.
      const averageScore =
        averageData.subjectCount > 0
          ? averageData.totalScore / averageData.subjectCount
          : 0;
      return {
        ...student,
        averageScore: parseFloat(averageScore.toFixed(2)),
      };
    });

    // Sort students by average score to determine rank
    const sortedStudents = studentsWithAverages.sort(
      (a, b) => b.averageScore - a.averageScore
    );

    // Assign rank based on sorted order
    const rankedStudents = sortedStudents.map((student, index) => ({
      ...student,
      rank: index + 1,
    }));

    // Log the data to the console for debugging
    console.log("Broadsheet Data fetched:");
    console.log("Subjects:", subjects);
    console.log("Students with Averages and Ranks:", rankedStudents);
    console.log("Scores Map:", scoresMap);

    return {
      students: rankedStudents,
      subjects,
      scoresMap,
    };
  } catch (error) {
    console.error("Error fetching broadsheet data:", error);
    return {
      students: [],
      subjects: [],
      scoresMap: {},
    };
  }
}

// Fetch all approved scores
export async function getApprovedReports() {
  const reports = await prisma.score.findMany({
    where: { status: "approved" },
    include: {
      studentSubject: {
        include: {
          student: true,
          subject: {
            include: {
              teachers: {
                // <-- include TeacherSubject
                include: {
                  teacher: true, // get the actual teacher object
                },
              },
            },
          },
        },
      },
    },
  });

  // Group by teacher + subject
  const grouped: Record<string, any> = {};
  for (const r of reports) {
    const subject = r.studentSubject.subject;
    const teacher = subject.teachers[0]?.teacher; // first teacher assigned

    const teacherId = teacher?.id ?? "unknown";
    const subjectName = subject.name;
    const key = `${teacherId}-${subjectName}`;

    if (!grouped[key]) {
      grouped[key] = {
        teacherId,
        subjectName,
        teacherName: teacher?.name ?? "Unknown",
        scores: [],
      };
    }

    grouped[key].scores.push(r);
  }

  return Object.values(grouped);
}

export async function publishReports(scoreIds: string[], publish = true) {
  await prisma.score.updateMany({
    where: { id: { in: scoreIds }, status: "approved" },
    data: { publishedAt: publish ? new Date() : null },
  });

  return { success: true };
}

export async function unpublishReports(scoreIds: string[]) {
  await prisma.score.updateMany({
    where: { id: { in: scoreIds } },
    data: { status: "submitted" },
  });
}

// Unpublish all approved scores for a student
export async function unpublishStudentScores(studentId: string) {
  await prisma.score.updateMany({
    where: {
      studentSubject: { studentId },
      status: "approved", // Only affects approved scores
    },
    data: {
      status: "submitted", // Back to submitted
      approvedById: null,
      publishedAt: null,
    },
  });
}

// Approve all submitted scores for a student (for "Unblock / Approve")
export async function approveAllStudentScores(studentId: string) {
  const admin = await prisma.user.findFirst({ where: { role: "admin" } });
  if (!admin) throw new Error("Admin user not found");

  await prisma.score.updateMany({
    where: {
      studentSubject: { studentId },
      status: "submitted", // Only submitted scores get approved
    },
    data: {
      status: "approved",
      approvedById: admin.id,
      publishedAt: new Date(),
    },
  });
}

// Returns true if student has any approved scores
export async function getStudentScoreStatus(studentId: string) {
  const count = await prisma.score.count({
    where: {
      studentSubject: { studentId },
      status: "approved",
    },
  });
  return count > 0;
}
