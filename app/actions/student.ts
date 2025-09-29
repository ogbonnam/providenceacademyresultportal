// // app/actions/student.ts
// "use server";

// import { PrismaClient, UserStatus } from "@prisma/client";
// import { getServerSession } from "next-auth";
// import { authOptions } from "@/lib/auth-options";
// import bcrypt from "bcryptjs";
// import { saveFile } from "@/lib/file-storage";
// import { redirect } from "next/navigation";

// const prisma = new PrismaClient();

// type FormState = {
//   success?: string | null;
//   error?: string | null;
// };

// export async function createStudent(
//   prevState: FormState,
//   formData: FormData
// ): Promise<FormState> {
//   const session = await getServerSession(authOptions);

//   if (!session || session.user.role !== "admin") {
//     return { error: "Unauthorized: Only administrators can create students." };
//   }

//   const name = formData.get("name")?.toString();
//   const email = formData.get("email")?.toString();
//   const password = formData.get("password")?.toString();
//   const confirmPassword = formData.get("confirmPassword")?.toString();
//   const dateOfBirth = formData.get("dateOfBirth")?.toString();
//   const nationality = formData.get("nationality")?.toString();
//   const state = formData.get("state")?.toString();
//   const boardingStatus = formData.get("boardingStatus")?.toString();
//   const level = formData.get("level")?.toString();
//   const parentId = formData.get("parentId")?.toString() || undefined;
//   const studentImageFile = formData.get("photo") as File;

//   if (
//     !name ||
//     !email ||
//     !password ||
//     !confirmPassword ||
//     !dateOfBirth ||
//     !nationality ||
//     !state ||
//     !boardingStatus ||
//     !level
//   ) {
//     return { error: "All required fields must be filled." };
//   }

//   if (password.length < 6) {
//     return { error: "Password must be at least 6 characters long." };
//   }

//   if (password !== confirmPassword) {
//     return { error: "Passwords do not match." };
//   }

//   try {
//     const imageUrl =
//       studentImageFile && studentImageFile.size > 0
//         ? await saveFile(studentImageFile)
//         : null;
//     const hashedPassword = await bcrypt.hash(password, 10);

//     const newStudent = await prisma.user.create({
//       data: {
//         name,
//         email,
//         password: hashedPassword,
//         role: "student",
//         parentId: parentId,
//         dateOfBirth: new Date(dateOfBirth),
//         nationality,
//         state,
//         boardingStatus,
//         level,
//         image: imageUrl,
//       },
//     });

//     return { success: `Student '${newStudent.name}' created successfully!` };
//   } catch (e: any) {
//     if (e.code === "P2002" && e.meta?.target.includes("email")) {
//       return { error: "An account with this email already exists." };
//     }
//     console.error("Error creating student:", e);
//     return { error: "Failed to create student. An unexpected error occurred." };
//   }
// }

// export async function toggleStudentStatus(
//   userId: string,
//   newStatus: UserStatus
// ) {
//   const session = await getServerSession(authOptions);

//   if (!session || session.user.role !== "admin") {
//     return { error: "Unauthorized." };
//   }

//   try {
//     const updatedUser = await prisma.user.update({
//       where: { id: userId },
//       data: { status: newStatus },
//     });
//     return {
//       success: `Student status for '${updatedUser.name}' updated to '${newStatus}'.`,
//     };
//   } catch (e: any) {
//     console.error("Error toggling student status:", e);
//     return { error: "Failed to update student status." };
//   }
// }

// /**
//  * Fetches all students with status 'active'.
//  * Returns an array of students or an empty array.
//  */
// export async function getStudents() {
//   const session = await getServerSession(authOptions);

//   if (!session || session.user.role !== "admin") {
//     return [];
//   }

//   try {
//     const students = await prisma.user.findMany({
//       where: {
//         role: "student",
//         status: "active",
//       },
//       include: {
//         parent: {
//           select: {
//             name: true,
//           },
//         },
//       },
//       orderBy: {
//         name: "asc",
//       },
//     });
//     return students;
//   } catch (error) {
//     console.error("Error fetching students:", error);
//     return [];
//   }
// }

// /**
//  * Fetches all students with status 'deactivated'.
//  * Returns an array of students or an empty array.
//  */
// export async function getDeactivatedStudents() {
//   const session = await getServerSession(authOptions);

//   if (!session || session.user.role !== "admin") {
//     return [];
//   }

//   try {
//     const students = await prisma.user.findMany({
//       where: {
//         role: "student",
//         status: "deactivated",
//       },
//       include: {
//         parent: {
//           select: {
//             name: true,
//           },
//         },
//       },
//       orderBy: {
//         name: "asc",
//       },
//     });
//     return students;
//   } catch (error) {
//     console.error("Error fetching deactivated students:", error);
//     return [];
//   }
// }

// /**
//  * Searches for students by name or parent's name.
//  * Returns an array of students or an empty array.
//  */
// export async function searchStudents(search: string = "") {
//   const session = await getServerSession(authOptions);

//   if (!session || session.user.role !== "admin") {
//     return [];
//   }

//   const students = await prisma.user.findMany({
//     where: {
//       role: "student",
//       OR: [
//         { name: { contains: search, mode: "insensitive" } },
//         {
//           parent: {
//             name: { contains: search, mode: "insensitive" },
//           },
//         },
//       ],
//     },
//     include: {
//       parent: {
//         select: {
//           name: true,
//         },
//       },
//     },
//     orderBy: {
//       name: "asc",
//     },
//   });

//   return students;
// }

// /**
//  * Fetches a single student by ID.
//  * @param studentId The ID of the student to fetch.
//  */
// export async function getStudentById(studentId: string) {
//   try {
//     const student = await prisma.user.findUnique({
//       where: { id: studentId, role: "student" },
//       include: {
//         parent: {
//           select: {
//             id: true,
//             name: true,
//             email: true,
//             phone: true,
//           },
//         },
//         subjectsTaking: {
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
//     return student;
//   } catch (error) {
//     console.error("Error fetching student by ID:", error);
//     return null;
//   }
// }

// /**
//  * Fetches all existing student-subject assignments.
//  * This is used to pre-populate the assignment table.
//  */
// export async function getStudentSubjectAssignments() {
//   const session = await getServerSession(authOptions);
//   if (!session || session.user.role !== "admin") {
//     redirect("/dashboard");
//   }
//   try {
//     const assignments = await prisma.studentSubject.findMany({
//       select: {
//         studentId: true,
//         subjectId: true,
//       },
//     });
//     return assignments;
//   } catch (error) {
//     console.error("Error fetching student subject assignments:", error);
//     return [];
//   }
// }

// app/actions/student.ts
"use server";

import { PrismaClient, UserStatus } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import bcrypt from "bcryptjs";
import { saveFile } from "@/lib/file-storage";
import { redirect } from "next/navigation";

const prisma = new PrismaClient();

type FormState = {
  success?: string | null;
  error?: string | null;
};

export async function createStudent(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "admin") {
    return { error: "Unauthorized: Only administrators can create students." };
  }

  const name = formData.get("name")?.toString();
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();
  const confirmPassword = formData.get("confirmPassword")?.toString();
  const dateOfBirth = formData.get("dateOfBirth")?.toString();
  const nationality = formData.get("nationality")?.toString();
  const state = formData.get("state")?.toString();
  const boardingStatus = formData.get("boardingStatus")?.toString();
  const level = formData.get("level")?.toString();
  const parentId = formData.get("parentId")?.toString() || undefined;
  const studentImageFile = formData.get("photo") as File;

  if (
    !name ||
    !email ||
    !password ||
    !confirmPassword ||
    !dateOfBirth ||
    !nationality ||
    !state ||
    !boardingStatus ||
    !level
  ) {
    return { error: "All required fields must be filled." };
  }

  if (password.length < 6) {
    return { error: "Password must be at least 6 characters long." };
  }

  if (password !== confirmPassword) {
    return { error: "Passwords do not match." };
  }

  try {
    const imageUrl =
      studentImageFile && studentImageFile.size > 0
        ? await saveFile(studentImageFile)
        : null;
    const hashedPassword = await bcrypt.hash(password, 10);

    const newStudent = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "student",
        parentId: parentId,
        dateOfBirth: new Date(dateOfBirth),
        nationality,
        state,
        boardingStatus,
        level,
        image: imageUrl,
      },
    });

    return { success: `Student '${newStudent.name}' created successfully!` };
  } catch (e: any) {
    if (e.code === "P2002" && e.meta?.target.includes("email")) {
      return { error: "An account with this email already exists." };
    }
    console.error("Error creating student:", e);
    return { error: "Failed to create student. An unexpected error occurred." };
  }
}

export async function toggleStudentStatus(
  userId: string,
  newStatus: UserStatus
) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "admin") {
    return { error: "Unauthorized." };
  }

  try {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { status: newStatus },
    });
    return {
      success: `Student status for '${updatedUser.name}' updated to '${newStatus}'.`,
    };
  } catch (e: any) {
    console.error("Error toggling student status:", e);
    return { error: "Failed to update student status." };
  }
}

/**
 * Fetches all students with status 'active'.
 * Returns an array of students or an empty array.
 */
export async function getStudents() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "admin") {
    return [];
  }

  try {
    const students = await prisma.user.findMany({
      where: {
        role: "student",
        status: "active",
      },
      include: {
        parent: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        name: "asc",
      },
    });
    return students;
  } catch (error) {
    console.error("Error fetching students:", error);
    return [];
  }
}

/**
 * Fetches all students with status 'deactivated'.
 * Returns an array of students or an empty array.
 */
export async function getDeactivatedStudents() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "admin") {
    return [];
  }

  try {
    const students = await prisma.user.findMany({
      where: {
        role: "student",
        status: "deactivated",
      },
      include: {
        parent: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        name: "asc",
      },
    });
    return students;
  } catch (error) {
    console.error("Error fetching deactivated students:", error);
    return [];
  }
}

/**
 * Searches for students by name or parent's name.
 * Returns an array of students or an empty array.
 */
export async function searchStudents(search: string = "") {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "admin") {
    return [];
  }

  const students = await prisma.user.findMany({
    where: {
      role: "student",
      OR: [
        { name: { contains: search, mode: "insensitive" } },
        {
          parent: {
            name: { contains: search, mode: "insensitive" },
          },
        },
      ],
    },
    include: {
      parent: {
        select: {
          name: true,
        },
      },
    },
    orderBy: {
      name: "asc",
    },
  });

  return students;
}

/**
 * Fetches a single student by ID.
 * @param studentId The ID of the student to fetch.
 */
export async function getStudentById(studentId: string) {
  try {
    const student = await prisma.user.findUnique({
      where: { id: studentId, role: "student" },
      include: {
        parent: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
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
      },
    });
    return student;
  } catch (error) {
    console.error("Error fetching student by ID:", error);
    return null;
  }
}

/**
 * Fetches all existing student-subject assignments.
 * This is used to pre-populate the assignment table.
 */
export async function getStudentSubjectAssignments() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "admin") {
    redirect("/dashboard");
  }
  try {
    const assignments = await prisma.studentSubject.findMany({
      select: {
        studentId: true,
        subjectId: true,
      },
    });
    return assignments;
  } catch (error) {
    console.error("Error fetching student subject assignments:", error);
    return [];
  }
}

// Helper function to get the current student's ID from the session
async function getStudentId() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "student") {
    return null;
  }
  return session.user.id;
}

/**
 * Fetches the logged-in student's full profile information.
 */
export async function getStudentProfile() {
  const studentId = await getStudentId();
  if (!studentId) {
    return null;
  }

  try {
    const profile = await prisma.user.findUnique({
      where: { id: studentId },
      select: {
        id: true,
        name: true,
        email: true,
        // Including all new fields for a complete profile
        dateOfBirth: true,
        nationality: true,
        state: true,
        boardingStatus: true,
        level: true,
        photoUrl: true,
        address: true,
        phone: true,
        gender: true,
        occupation: true,
      },
    });
    return profile;
  } catch (error) {
    console.error("Error fetching student profile:", error);
    return null;
  }
}

/**
 * Fetches the logged-in student's academic reports (scores).
 */
export async function getStudentReports() {
  const studentId = await getStudentId();
  if (!studentId) {
    return [];
  }

  try {
    // Find all student-subject relationships for the current student
    const studentSubjects = await prisma.studentSubject.findMany({
      where: { studentId },
      include: {
        subject: true, // Include subject details to get the name
        scores: {
          orderBy: { createdAt: "desc" },
          take: 1, // Only get the latest score for each subject
        },
      },
    });

    // Map the data to a more usable format for the dashboard
    const reports = studentSubjects.flatMap((ss) => {
      // Ensure there is a score before trying to map it
      if (ss.scores.length > 0) {
        const latestScore = ss.scores[0];
        return {
          id: latestScore.id,
          term: "Term 1", // This is a placeholder, as 'term' is not in your schema
          subject: ss.subject.name,
          test1: latestScore.score1,
          test2: latestScore.score2,
          exam: latestScore.exam,
          total: latestScore.total,
          comment: latestScore.comment || "N/A",
        };
      }
      return []; // Return an empty array if no scores exist for a subject
    });

    return reports;
  } catch (error) {
    console.error("Error fetching student reports:", error);
    return [];
  }
}

/**
 * Fetches the subjects a student is enrolled in.
 */
export async function getStudentSubjects() {
  const studentId = await getStudentId();
  if (!studentId) {
    return [];
  }

  try {
    const subjects = await prisma.studentSubject.findMany({
      where: { studentId },
      include: {
        subject: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
    return subjects.map((ss) => ss.subject);
  } catch (error) {
    console.error("Error fetching student subjects:", error);
    return [];
  }
}

/**
 * Fetches educational videos for a specific subject.
 */
export async function getVideosBySubjectId(subjectId: string) {
  const studentId = await getStudentId();
  if (!studentId) {
    return [];
  }

  try {
    const videos = await prisma.educationalVideo.findMany({
      where: { subjectId },
      select: {
        id: true,
        title: true,
        youtubeUrl: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return videos.map((video) => ({
      ...video,
      type: "video" as "video", // Type is hardcoded as 'video' based on the model
      link: video.youtubeUrl,
    }));
  } catch (error) {
    console.error("Error fetching videos for subject:", error);
    return [];
  }
}

/**
 * Fetches the student's timetable.
 */
export async function getStudentTimetable() {
  const studentId = await getStudentId();
  if (!studentId) {
    return [];
  }

  try {
    // First, find all subjects the student is taking
    const studentSubjects = await prisma.studentSubject.findMany({
      where: { studentId },
      select: {
        subjectId: true,
      },
    });

    const subjectIds = studentSubjects.map((ss) => ss.subjectId);

    // Then, find all timetable entries for those subjects
    const timetableEntries = await prisma.timetableEntry.findMany({
      where: {
        subjectId: { in: subjectIds },
      },
      include: {
        subject: {
          select: {
            name: true,
          },
        },
        teacher: {
          select: {
            name: true,
          },
        },
      },
      orderBy: [{ day: "asc" }, { time: "asc" }],
    });

    // Map to a cleaner format for the dashboard
    const timetable = timetableEntries.map((entry) => ({
      id: entry.id,
      day: entry.day.toLowerCase(),
      time: entry.time
        .replace(/_/g, " ")
        .replace("TIME ", "")
        .replace(/(\d{2}) (\d{2})/, "$1:$2"),
      subject: entry.subject?.name || "N/A",
      teacher: entry.teacher?.name || "N/A",
      // You'll need a location field on your TimetableEntry model if you want this
      location: "Room 101", // Placeholder location
    }));

    return timetable;
  } catch (error) {
    console.error("Error fetching student timetable:", error);
    return [];
  }
}
