// // app/actions/teacher.ts
// "use server";

// import { PrismaClient } from "@prisma/client";
// import { getServerSession } from "next-auth";
// import { authOptions } from "@/lib/auth-options";
// import bcrypt from "bcryptjs";
// import { redirect } from "next/navigation";
// import { revalidatePath } from "next/cache";

// const prisma = new PrismaClient();

// type FormState = {
//   success?: string | null;
//   error?: string | null;
// };

// export interface Subject {
//   id: string;
//   name: string;
// }

// // Helper function to check for admin authorization
// async function isAdmin() {
//   const session = await getServerSession(authOptions);
//   return session && session.user.role === "admin";
// }

// /**
//  * Creates a new teacher.
//  * @param prevState The previous form state.
//  * @param formData The form data.
//  */
// export async function createTeacher(
//   prevState: FormState,
//   formData: FormData
// ): Promise<FormState> {
//   if (!(await isAdmin())) {
//     return { error: "Unauthorized: Only administrators can create teachers." };
//   }

//   const name = formData.get("name")?.toString();
//   const email = formData.get("email")?.toString();
//   const password = formData.get("password")?.toString();
//   const confirmPassword = formData.get("confirmPassword")?.toString();
//   const designation = formData.get("designation")?.toString();
//   const address = formData.get("address")?.toString();
//   const phone = formData.get("phone")?.toString();
//   const gender = formData.get("gender")?.toString();
//   const dateOfBirth = formData.get("dateOfBirth")?.toString();

//   if (
//     !name ||
//     !email ||
//     !password ||
//     !confirmPassword ||
//     !designation ||
//     !address ||
//     !phone ||
//     !gender ||
//     !dateOfBirth
//   ) {
//     return { error: "All required fields must be filled." };
//   }

//   if (password !== confirmPassword) {
//     return { error: "Passwords do not match." };
//   }

//   try {
//     const hashedPassword = await bcrypt.hash(password, 10);
//     const newTeacher = await prisma.user.create({
//       data: {
//         name,
//         email,
//         password: hashedPassword,
//         role: "teacher",
//         designation,
//         address,
//         phone,
//         gender,
//         dateOfBirth: new Date(dateOfBirth),
//       },
//     });

//     return { success: `Teacher '${newTeacher.name}' created successfully!` };
//   } catch (e: any) {
//     if (e.code === "P2002" && e.meta?.target.includes("email")) {
//       return { error: "An account with this email already exists." };
//     }
//     console.error("Error creating teacher:", e);
//     return { error: "Failed to create teacher. An unexpected error occurred." };
//   }
// }

// /**
//  * Creates a new subject.
//  * @param prevState The previous form state.
//  * @param formData The form data.
//  */
// export async function createSubject(
//   prevState: FormState,
//   formData: FormData
// ): Promise<FormState> {
//   if (!(await isAdmin())) {
//     return { error: "Unauthorized: Only administrators can create subjects." };
//   }

//   const name = formData.get("name")?.toString();
//   const description = formData.get("description")?.toString();

//   if (!name) {
//     return { error: "Subject name is required." };
//   }

//   try {
//     const newSubject = await prisma.subject.create({
//       data: {
//         name,
//         description,
//       },
//     });

//     return { success: `Subject '${newSubject.name}' created successfully!` };
//   } catch (e: any) {
//     if (e.code === "P2002" && e.meta?.target.includes("name")) {
//       return { error: "A subject with this name already exists." };
//     }
//     console.error("Error creating subject:", e);
//     return { error: "Failed to create subject. An unexpected error occurred." };
//   }
// }

// /**
//  * Fetches all teachers.
//  */
// export async function getTeachers() {
//   const session = await getServerSession(authOptions);
//   if (!session || session.user.role !== "admin") {
//     return [];
//   }
//   try {
//     const teachers = await prisma.user.findMany({
//       where: {
//         role: "teacher",
//       },
//       orderBy: {
//         name: "asc",
//       },
//     });
//     return teachers;
//   } catch (error) {
//     console.error("Error fetching teachers:", error);
//     return [];
//   }
// }

// /**
//  * Fetches all subjects.
//  */
// export async function getSubjects() {
//   const session = await getServerSession(authOptions);
//   if (!session || session.user.role !== "admin") {
//     return [];
//   }
//   try {
//     const subjects = await prisma.subject.findMany({
//       orderBy: {
//         name: "asc",
//       },
//     });
//     return subjects;
//   } catch (error) {
//     console.error("Error fetching subjects:", error);
//     return [];
//   }
// }

// /**
//  * Assigns subjects to a teacher.
//  * @param teacherId The ID of the teacher.
//  * @param subjectIds An array of subject IDs to assign.
//  */
// export async function assignSubjectsToTeacher(
//   teacherId: string,
//   subjectIds: string[]
// ) {
//   if (!(await isAdmin())) {
//     return { error: "Unauthorized." };
//   }

//   try {
//     await prisma.teacherSubject.deleteMany({
//       where: { teacherId },
//     });

//     const assignments = subjectIds.map((subjectId) => ({
//       teacherId,
//       subjectId,
//     }));
//     await prisma.teacherSubject.createMany({
//       data: assignments,
//       skipDuplicates: true,
//     });

//     return { success: "Subjects assigned to teacher successfully." };
//   } catch (e: any) {
//     console.error("Error assigning subjects to teacher:", e);
//     return { error: "Failed to assign subjects." };
//   }
// }

// /**
//  * Assigns students to a subject.
//  * @param subjectId The ID of the subject.
//  * @param studentIds An array of student IDs to assign.
//  */
// export async function assignStudentsToSubject(
//   subjectId: string,
//   studentIds: string[]
// ) {
//   if (!(await isAdmin())) {
//     return { error: "Unauthorized." };
//   }

//   try {
//     // Get current enrollments for this subject
//     const existing = await prisma.studentSubject.findMany({
//       where: { subjectId },
//       select: { id: true, studentId: true },
//     });

//     const existingStudentIds = existing.map((e) => e.studentId);

//     // Find students to add
//     const toAdd = studentIds.filter((id) => !existingStudentIds.includes(id));

//     // Find students to remove
//     const toRemove = existingStudentIds.filter(
//       (id) => !studentIds.includes(id)
//     );

//     // Add new enrollments without deleting existing ones
//     if (toAdd.length > 0) {
//       await prisma.studentSubject.createMany({
//         data: toAdd.map((studentId) => ({ studentId, subjectId })),
//         skipDuplicates: true,
//       });
//     }

//     // Remove enrollments and their scores only if necessary
//     if (toRemove.length > 0) {
//       const toRemoveIds = existing
//         .filter((e) => toRemove.includes(e.studentId))
//         .map((e) => e.id);

//       await prisma.score.deleteMany({
//         where: { studentSubjectId: { in: toRemoveIds } },
//       });

//       await prisma.studentSubject.deleteMany({
//         where: { id: { in: toRemoveIds } },
//       });
//     }

//     revalidatePath("/admin/reports/broadsheet");
//     return { success: "Students assigned to subject successfully." };
//   } catch (e: any) {
//     console.error("Error assigning students to subject:", e);
//     return { error: "Failed to assign students." };
//   }
// }

// /**
//  * Fetches subjects for a specific teacher.
//  * @param teacherId The ID of the teacher.
//  */
// export async function getTeacherSubjects(teacherId: string) {
//   try {
//     const teacherWithSubjects = await prisma.user.findUnique({
//       where: { id: teacherId, role: "teacher" },
//       select: {
//         subjectsTeaching: {
//           select: {
//             subject: true,
//           },
//         },
//       },
//     });

//     return teacherWithSubjects?.subjectsTeaching.map((ts) => ts.subject) || [];
//   } catch (error) {
//     console.error("Error fetching teacher's subjects:", error);
//     return [];
//   }
// }

// /**
//  * Fetches students for a given subject, including their scores if available.
//  * @param subjectId The ID of the subject.
//  */
// export async function getStudentsForSubject(subjectId: string) {
//   try {
//     const studentSubjects = await prisma.studentSubject.findMany({
//       where: { subjectId },
//       include: {
//         student: {
//           select: { id: true, name: true, image: true, level: true },
//         },
//         scores: {
//           select: {
//             score1: true,
//             score2: true,
//             exam: true,
//             total: true,
//             comment: true,
//             attendance: true,
//           },
//           orderBy: { createdAt: "desc" },
//           take: 1, // Get the latest score
//         },
//       },
//     });

//     return studentSubjects.map((ss) => ({
//       ...ss.student,
//       latestScore: ss.scores[0] || null,
//       studentSubjectId: ss.id,
//     }));
//   } catch (error) {
//     console.error("Error fetching students for subject:", error);
//     return [];
//   }
// }

// /**
//  * Saves a score for a student in a specific subject.
//  * @param studentSubjectId The ID of the StudentSubject record.
//  * @param score The score to save.
//  * @param notes Optional notes for the score.
//  */
// export async function saveStudentScore(
//   studentSubjectId: string,
//   score: number,
//   notes: string = ""
// ) {
//   const session = await getServerSession(authOptions);

//   if (!session || !session.user || !session.user.id || !session.user.role) {
//     return { error: "Authentication required." };
//   }

//   // A teacher can also save scores for their assigned students, so we need to verify.
//   const isAuthorized = async () => {
//     if (session.user.role === "admin") return true;
//     if (session.user.role === "teacher") {
//       const teacherSubjects = await prisma.teacherSubject.findMany({
//         where: { teacherId: session.user.id },
//       });
//       const studentSubject = await prisma.studentSubject.findUnique({
//         where: { id: studentSubjectId },
//       });
//       if (
//         studentSubject &&
//         teacherSubjects.some((ts) => ts.subjectId === studentSubject.subjectId)
//       ) {
//         return true;
//       }
//     }
//     return false;
//   };

//   if (!(await isAuthorized())) {
//     return { error: "Unauthorized to save scores for this subject." };
//   }

//   try {
//     const updatedScore = await prisma.score.create({
//       data: {
//         studentSubjectId,
//         score1: score, // This needs to be updated with the new fields
//         score2: 0,
//         exam: 0,
//         total: 0,
//         comment: notes,
//         attendance: 0,
//       },
//     });

//     return { success: "Score saved successfully." };
//   } catch (e) {
//     console.error("Error saving score:", e);
//     return { error: "Failed to save score." };
//   }
// }

// /**
//  * Fetches teachers with their assigned subjects for the Admin report page.
//  */
// export async function getTeachersWithSubjects() {
//   const session = await getServerSession(authOptions);
//   if (!session || session.user.role !== "admin") {
//     return [];
//   }
//   try {
//     const teachers = await prisma.user.findMany({
//       where: { role: "teacher" },
//       select: {
//         id: true,
//         name: true,
//         subjectsTeaching: {
//           select: {
//             subject: {
//               select: {
//                 id: true,
//                 name: true,
//               },
//             },
//           },
//         },
//       },
//       orderBy: { name: "asc" },
//     });
//     return teachers;
//   } catch (error) {
//     console.error("Error fetching teachers with subjects:", error);
//     return [];
//   }
// }

// /**
//  * Saves a batch of student scores.
//  * @param scores A list of score objects to save.
//  */
// export async function saveBatchScores(scores: any[]) {
//   const session = await getServerSession(authOptions);

//   if (!session || !session.user || session.user.role !== "admin") {
//     return { error: "Unauthorized." };
//   }

//   if (scores.length === 0) {
//     return { error: "No scores to save." };
//   }

//   try {
//     await prisma.$transaction(
//       scores.map((score) =>
//         prisma.score.create({
//           data: {
//             studentSubjectId: score.studentSubjectId,
//             score1: parseFloat(score.score1),
//             score2: parseFloat(score.score2),
//             exam: parseFloat(score.exam),
//             total: parseFloat(score.total),
//             comment: score.comment,
//             attendance: parseInt(score.attendance, 10),
//           },
//         })
//       )
//     );

//     return { success: "All scores submitted successfully!" };
//   } catch (e: any) {
//     console.error("Error saving batch scores:", e);
//     return { error: "Failed to save scores. An unexpected error occurred." };
//   }
// }

// /**
//  * Fetches a single teacher's profile details.
//  * @param teacherId The ID of the teacher.
//  */
// export async function getTeacherProfile(teacherId: string) {
//   const session = await getServerSession(authOptions);

//   // Authorization check: Only the teacher themselves or an admin can view the full profile.
//   if (
//     !session ||
//     (session.user.id !== teacherId && session.user.role !== "admin")
//   ) {
//     return null;
//   }

//   try {
//     const teacher = await prisma.user.findUnique({
//       where: {
//         id: teacherId,
//         role: "teacher",
//       },
//       select: {
//         id: true,
//         name: true,
//         email: true,
//         designation: true,
//         address: true,
//         phone: true,
//         gender: true,
//         dateOfBirth: true,
//         subjectsTeaching: {
//           select: {
//             subject: {
//               select: {
//                 name: true,
//               },
//             },
//           },
//         },
//       },
//     });

//     if (!teacher) {
//       return null;
//     }

//     // Explicitly handle potential null values to match the frontend type.
//     const formattedProfile = {
//       id: teacher.id,
//       name: teacher.name,
//       email: teacher.email,
//       designation: teacher.designation,
//       address: teacher.address,
//       phone: teacher.phone,
//       gender: teacher.gender,
//       // Date is converted to a string here.
//       dateOfBirth:
//         teacher.dateOfBirth?.toISOString().split("T")[0] ?? "Not specified",
//       subjectsTaught: teacher.subjectsTeaching.map((ts) => ts.subject.name),
//       // Add a simple, optional bio for display purposes
//       bio: `A dedicated teacher with expertise in ${teacher.subjectsTeaching
//         .map((ts) => ts.subject.name)
//         .join(", ")}.`,
//       // Ensure role is a string even if designation is null
//       role: teacher.designation ?? "Teacher",
//     };

//     return formattedProfile;
//   } catch (error) {
//     console.error("Error fetching teacher profile:", error);
//     return null;
//   }
// }

// export async function getSubjectsForTeacherDashboard(teacherId: string) {
//   try {
//     // Just fetch by unique ID without the role filter
//     const teacher = await prisma.user.findUnique({
//       where: { id: teacherId },
//       select: {
//         subjectsTeaching: {
//           select: {
//             subject: true,
//           },
//         },
//       },
//     });

//     if (!teacher) {
//       return [];
//     }

//     return teacher.subjectsTeaching.map((ts) => ts.subject);
//   } catch (error) {
//     console.error("Error fetching teacher subjects for dashboard:", error);
//     return [];
//   }
// }

// /**
//  * Fetches subjects taught by a single teacher by their user ID.
//  */
// export async function getSubjectsForTeacher(teacherId: string): Promise<Subject[]> {
//   try {
//     const teacher = await prisma.user.findUnique({
//       where: { id: teacherId },
//       select: {
//         subjectsTeaching: {
//           select: {
//             subject: {
//               select: {
//                 id: true,
//                 name: true,
//               },
//             },
//           },
//         },
//       },
//     });

//     if (!teacher) {
//       return [];
//     }

//     // Extract just the subjects array
//     return teacher.subjectsTeaching.map((ts) => ts.subject);
//   } catch (error) {
//     console.error("Error fetching subjects for teacher:", error);
//     return [];
//   }
// }

// app/actions/teacher.ts
"use server";

import { PrismaClient } from "@prisma/client";
import { NextAuthOptions, getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

const prisma = new PrismaClient();

type FormState = {
  success?: string | null;
  error?: string | null;
};

export interface Subject {
  id: string;
  name: string;
}

// Helper function to check for admin authorization
async function isAdmin() {
  const session = await getServerSession(authOptions);
  return session && session.user.role === "admin";
}

// Helper function to check if a teacher is authorized for a subject
async function isAuthorizedForSubject(subjectId: string) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user || !session.user.id) {
    return false;
  }

  // Admin is always authorized
  if (session.user.role === "admin") {
    return true;
  }

  // Check if the teacher is assigned to this subject
  if (session.user.role === "teacher") {
    const teacherSubject = await prisma.teacherSubject.findFirst({
      where: {
        teacherId: session.user.id,
        subjectId: subjectId,
      },
    });
    return !!teacherSubject;
  }
  return false;
}

/**
 * Creates a new teacher.
 * @param prevState The previous form state.
 * @param formData The form data.
 */
export async function createTeacher(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  if (!(await isAdmin())) {
    return { error: "Unauthorized: Only administrators can create teachers." };
  }

  const name = formData.get("name")?.toString();
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();
  const confirmPassword = formData.get("confirmPassword")?.toString();
  const designation = formData.get("designation")?.toString();
  const address = formData.get("address")?.toString();
  const phone = formData.get("phone")?.toString();
  const gender = formData.get("gender")?.toString();
  const dateOfBirth = formData.get("dateOfBirth")?.toString();

  if (
    !name ||
    !email ||
    !password ||
    !confirmPassword ||
    !designation ||
    !address ||
    !phone ||
    !gender ||
    !dateOfBirth
  ) {
    return { error: "All required fields must be filled." };
  }

  if (password !== confirmPassword) {
    return { error: "Passwords do not match." };
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newTeacher = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "teacher",
        designation,
        address,
        phone,
        gender,
        dateOfBirth: new Date(dateOfBirth),
      },
    });

    return { success: `Teacher '${newTeacher.name}' created successfully!` };
  } catch (e: any) {
    if (e.code === "P2002" && e.meta?.target.includes("email")) {
      return { error: "An account with this email already exists." };
    }
    console.error("Error creating teacher:", e);
    return { error: "Failed to create teacher. An unexpected error occurred." };
  }
}

/**
 * Creates a new subject.
 * @param prevState The previous form state.
 * @param formData The form data.
 */
export async function createSubject(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  if (!(await isAdmin())) {
    return { error: "Unauthorized: Only administrators can create subjects." };
  }

  const name = formData.get("name")?.toString();
  const description = formData.get("description")?.toString();

  if (!name) {
    return { error: "Subject name is required." };
  }

  try {
    const newSubject = await prisma.subject.create({
      data: {
        name,
        description,
      },
    });

    return { success: `Subject '${newSubject.name}' created successfully!` };
  } catch (e: any) {
    if (e.code === "P2002" && e.meta?.target.includes("name")) {
      return { error: "A subject with this name already exists." };
    }
    console.error("Error creating subject:", e);
    return { error: "Failed to create subject. An unexpected error occurred." };
  }
}

/**
 * Fetches all teachers.
 */
export async function getTeachers() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "admin") {
    return [];
  }
  try {
    const teachers = await prisma.user.findMany({
      where: {
        role: "teacher",
      },
      orderBy: {
        name: "asc",
      },
    });
    return teachers;
  } catch (error) {
    console.error("Error fetching teachers:", error);
    return [];
  }
}

/**
 * Fetches all subjects.
 */
export async function getSubjects() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "admin") {
    return [];
  }
  try {
    const subjects = await prisma.subject.findMany({
      orderBy: {
        name: "asc",
      },
    });
    return subjects;
  } catch (error) {
    console.error("Error fetching subjects:", error);
    return [];
  }
}

/**
 * Assigns subjects to a teacher.
 * @param teacherId The ID of the teacher.
 * @param subjectIds An array of subject IDs to assign.
 */
export async function assignSubjectsToTeacher(
  teacherId: string,
  subjectIds: string[]
) {
  if (!(await isAdmin())) {
    return { error: "Unauthorized." };
  }

  try {
    await prisma.teacherSubject.deleteMany({
      where: { teacherId },
    });

    const assignments = subjectIds.map((subjectId) => ({
      teacherId,
      subjectId,
    }));
    await prisma.teacherSubject.createMany({
      data: assignments,
      skipDuplicates: true,
    });

    return { success: "Subjects assigned to teacher successfully." };
  } catch (e: any) {
    console.error("Error assigning subjects to teacher:", e);
    return { error: "Failed to assign subjects." };
  }
}

/**
 * Assigns students to a subject.
 * @param subjectId The ID of the subject.
 * @param studentIds An array of student IDs to assign.
 */
export async function assignStudentsToSubject(
  subjectId: string,
  studentIds: string[]
) {
  if (!(await isAdmin())) {
    return { error: "Unauthorized." };
  }

  try {
    // Get current enrollments for this subject
    const existing = await prisma.studentSubject.findMany({
      where: { subjectId },
      select: { id: true, studentId: true },
    });

    const existingStudentIds = existing.map((e) => e.studentId);

    // Find students to add
    const toAdd = studentIds.filter((id) => !existingStudentIds.includes(id));

    // Find students to remove
    const toRemove = existingStudentIds.filter(
      (id) => !studentIds.includes(id)
    );

    // Add new enrollments without deleting existing ones
    if (toAdd.length > 0) {
      await prisma.studentSubject.createMany({
        data: toAdd.map((studentId) => ({ studentId, subjectId })),
        skipDuplicates: true,
      });
    }

    // Remove enrollments and their scores only if necessary
    if (toRemove.length > 0) {
      const toRemoveIds = existing
        .filter((e) => toRemove.includes(e.studentId))
        .map((e) => e.id);

      await prisma.score.deleteMany({
        where: { studentSubjectId: { in: toRemoveIds } },
      });

      await prisma.studentSubject.deleteMany({
        where: { id: { in: toRemoveIds } },
      });
    }

    revalidatePath("/admin/reports/broadsheet");
    return { success: "Students assigned to subject successfully." };
  } catch (e: any) {
    console.error("Error assigning students to subject:", e);
    return { error: "Failed to assign students." };
  }
}

/**
 * Fetches subjects for a specific teacher.
 * @param teacherId The ID of the teacher.
 */
export async function getTeacherSubjects(teacherId: string) {
  try {
    const teacherWithSubjects = await prisma.user.findUnique({
      where: { id: teacherId, role: "teacher" },
      select: {
        subjectsTeaching: {
          select: {
            subject: true,
          },
        },
      },
    });

    return teacherWithSubjects?.subjectsTeaching.map((ts) => ts.subject) || [];
  } catch (error) {
    console.error("Error fetching teacher's subjects:", error);
    return [];
  }
}

/**
 * Fetches students for a given subject, including their scores if available.
 * @param subjectId The ID of the subject.
 */
export async function getStudentsForSubject(subjectId: string) {
  try {
    const studentSubjects = await prisma.studentSubject.findMany({
      where: { subjectId },
      include: {
        student: {
          select: { id: true, name: true, image: true, level: true },
        },
        scores: {
          select: {
            score1: true,
            score2: true,
            exam: true,
            total: true,
            comment: true,
            attendance: true,
          },
          orderBy: { createdAt: "desc" },
          take: 1, // Get the latest score
        },
      },
    });

    return studentSubjects.map((ss) => ({
      ...ss.student,
      latestScore: ss.scores[0] || null,
      studentSubjectId: ss.id,
    }));
  } catch (error) {
    console.error("Error fetching students for subject:", error);
    return [];
  }
}

/**
 * Saves a score for a student in a specific subject.
 * @param studentSubjectId The ID of the StudentSubject record.
 * @param score The score to save.
 * @param notes Optional notes for the score.
 */
export async function saveStudentScore(
  studentSubjectId: string,
  score: number,
  notes: string = ""
) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user || !session.user.id || !session.user.role) {
    return { error: "Authentication required." };
  }

  // A teacher can also save scores for their assigned students, so we need to verify.
  const isAuthorized = async () => {
    if (session.user.role === "admin") return true;
    if (session.user.role === "teacher") {
      const teacherSubjects = await prisma.teacherSubject.findMany({
        where: { teacherId: session.user.id },
      });
      const studentSubject = await prisma.studentSubject.findUnique({
        where: { id: studentSubjectId },
      });
      if (
        studentSubject &&
        teacherSubjects.some((ts) => ts.subjectId === studentSubject.subjectId)
      ) {
        return true;
      }
    }
    return false;
  };

  if (!(await isAuthorized())) {
    return { error: "Unauthorized to save scores for this subject." };
  }

  try {
    const updatedScore = await prisma.score.create({
      data: {
        studentSubjectId,
        score1: score, // This needs to be updated with the new fields
        score2: 0,
        exam: 0,
        total: 0,
        comment: notes,
        attendance: 0,
        status: "draft",
      },
    });

    return { success: "Score saved successfully." };
  } catch (e) {
    console.error("Error saving score:", e);
    return { error: "Failed to save score." };
  }
}

/**
 * Fetches teachers with their assigned subjects for the Admin report page.
 */
export async function getTeachersWithSubjects() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "admin") {
    return [];
  }
  try {
    const teachers = await prisma.user.findMany({
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
    return teachers;
  } catch (error) {
    console.error("Error fetching teachers with subjects:", error);
    return [];
  }
}

/**
 * Saves a batch of student scores.
 * @param scores A list of score objects to save.
 */
export async function saveBatchScores(scores: any[]) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user || session.user.role !== "admin") {
    return { error: "Unauthorized." };
  }

  if (scores.length === 0) {
    return { error: "No scores to save." };
  }

  try {
    await prisma.$transaction(
      scores.map((score) =>
        prisma.score.create({
          data: {
            studentSubjectId: score.studentSubjectId,
            score1: parseFloat(score.score1),
            score2: parseFloat(score.score2),
            exam: parseFloat(score.exam),
            total: parseFloat(score.total),
            comment: score.comment,
            attendance: parseInt(score.attendance, 10),
          },
        })
      )
    );

    return { success: "All scores submitted successfully!" };
  } catch (e: any) {
    console.error("Error saving batch scores:", e);
    return { error: "Failed to save scores. An unexpected error occurred." };
  }
}

// Helper function to get the current student's ID from the session
async function getTeacherId() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "teacher") {
    return null;
  }
  return session.user.id;
}

/**
 * Fetches a single teacher's profile details.
 * @param teacherId The ID of the teacher.
 */
export async function getTeacherProfile() {
  const teacherId = await getTeacherId();
  if (!teacherId) {
    return null;
  }

  try {
    const profile = await prisma.user.findUnique({
      where: { id: teacherId },
      select: {
        name: true,
        email: true,
        // Including all new fields for a complete profile
        dateOfBirth: true,
        designation: true,

        photoUrl: true,
        address: true,
        phone: true,
        gender: true,
        occupation: true,
      },
    });
    return profile;
  } catch (error) {
    console.error("Error fetching teacher profile:", error);
    return null;
  }
}

export async function getSubjectsForTeacherDashboard(teacherId: string) {
  try {
    // Just fetch by unique ID without the role filter
    const teacher = await prisma.user.findUnique({
      where: { id: teacherId },
      select: {
        subjectsTeaching: {
          select: {
            subject: true,
          },
        },
      },
    });

    if (!teacher) {
      return [];
    }

    return teacher.subjectsTeaching.map((ts) => ts.subject);
  } catch (error) {
    console.error("Error fetching teacher subjects for dashboard:", error);
    return [];
  }
}

/**
 * Fetches subjects taught by a single teacher by their user ID.
 */
export async function getSubjectsForTeacher(
  teacherId: string
): Promise<Subject[]> {
  try {
    const teacher = await prisma.user.findUnique({
      where: { id: teacherId },
      select: {
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
    });

    if (!teacher) {
      return [];
    }

    // Extract just the subjects array
    return teacher.subjectsTeaching.map((ts) => ts.subject);
  } catch (error) {
    console.error("Error fetching subjects for teacher:", error);
    return [];
  }
}

/**
 * Creates a new educational video resource for a subject.
 * @param prevState The previous form state.
 * @param formData The form data.
 */
export async function createVideoResource(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const subjectId = formData.get("subjectId")?.toString();
  const title = formData.get("title")?.toString();
  const youtubeUrl = formData.get("youtubeUrl")?.toString();

  const session = await getServerSession(authOptions);

  if (!session || !session.user || !session.user.id) {
    return { error: "Authentication required." };
  }

  if (!subjectId || !title || !youtubeUrl) {
    return {
      error:
        "All required fields (Subject ID, Title, YouTube URL) must be filled.",
    };
  }

  if (!youtubeUrl.includes("youtube.com/embed/")) {
    return { error: "Invalid YouTube embed URL." };
  }

  if (!(await isAuthorizedForSubject(subjectId))) {
    return { error: "Unauthorized to add resources for this subject." };
  }

  try {
    const newVideo = await prisma.educationalVideo.create({
      data: {
        subjectId,
        title,
        youtubeUrl,
        uploaderId: session.user.id,
      },
    });
    // Revalidate the path where the educational resources are displayed
    revalidatePath(`/teacher/educational-resources/${subjectId}`);
    return { success: `Video '${newVideo.title}' added successfully!` };
  } catch (e) {
    console.error("Error creating video resource:", e);
    return {
      error: "Failed to create video resource. An unexpected error occurred.",
    };
  }
}

/**
 * Fetches all educational video resources for a specific subject.
 * @param subjectId The ID of the subject.
 */
export async function getVideoResourcesBySubject(subjectId: string) {
  if (!(await isAuthorizedForSubject(subjectId))) {
    return [];
  }

  try {
    const videos = await prisma.educationalVideo.findMany({
      where: { subjectId },
      include: {
        uploader: { select: { name: true, role: true } },
      },
      orderBy: { createdAt: "desc" },
    });
    return videos;
  } catch (error) {
    console.error("Error fetching video resources:", error);
    return [];
  }
}

/**
 * Fetches the details of the currently logged-in teacher.
 * This function should only be called from a server component or server action.
 *
 * @returns The teacher's full details including their subjects, or null if not found or not a teacher.
 */
export async function getLoggedInTeacherDetails() {
  try {
    // 1. Get the server-side session using your defined auth options.
    const session = await getServerSession(authOptions as NextAuthOptions);

    // 2. Check if a session exists and if the user has the 'teacher' role.
    // The role is now available in the session object, thanks to your `jwt` callback.
    if (!session || !session.user || session.user.role !== "teacher") {
      console.error("Access Denied: User is not a teacher or not logged in.");
      return null;
    }

    // 3. Use the user ID from the session to find the teacher's details.
    // This is a secure way to ensure a user can only query their own data.
    const teacherDetails = await prisma.user.findUnique({
      where: {
        id: session.user.id,
      },
      include: {
        // We include the related subjects using the junction table.
        subjectsTeaching: {
          include: {
            subject: true, // Fetch the full subject details
          },
        },
      },
    });

    if (!teacherDetails) {
      console.error("Teacher not found for the given session ID.");
      return null;
    }

    // 4. Return the complete teacher object.
    return teacherDetails;
  } catch (error) {
    console.error("Error fetching logged-in teacher details:", error);
    return null; // Return null on any error to prevent application crashes
  } finally {
    // 5. Always disconnect Prisma to clean up the connection.
    await prisma.$disconnect();
  }
}
