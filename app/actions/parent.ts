// app/actions/parent.ts
"use server";

import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import bcrypt from "bcryptjs";
import { saveFile } from "@/lib/file-storage";

const prisma = new PrismaClient();

type FormState = {
  success?: string | null;
  error?: string | null;
};

interface StudentProfile {
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

export async function createParent(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "admin") {
    return { error: "Unauthorized: Only administrators can create parents." };
  }

  const name = formData.get("name")?.toString();
  const address = formData.get("address")?.toString();
  const occupation = formData.get("occupation")?.toString();
  const phone = formData.get("phone")?.toString();
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();
  const confirmPassword = formData.get("confirmPassword")?.toString();
  const parentImageFile = formData.get("parentImage") as File;

  if (
    !name ||
    !email ||
    !password ||
    !confirmPassword ||
    !phone ||
    !address ||
    !occupation
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
    const imageUrl = await saveFile(parentImageFile);

    const hashedPassword = await bcrypt.hash(password, 10);
    const newParent = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "parent",
        address,
        occupation,
        phone,
        image: imageUrl,
      },
    });

    return { success: `Parent '${newParent.name}' created successfully!` };
  } catch (e: any) {
    if (e.code === "P2002" && e.meta?.target.includes("email")) {
      return { error: "An account with this email already exists." };
    }
    console.error("Error creating parent:", e);
    return { error: "Failed to create parent. An unexpected error occurred." };
  }
}

/**
 * Fetches all users with the 'parent' role.
 * Returns an array of parents with id, name, and email.
 */
export async function getParents() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "admin") {
    // Return an empty array on unauthorized access to prevent errors
    return [];
  }

  try {
    const parents = await prisma.user.findMany({
      where: {
        role: "parent",
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
      orderBy: {
        name: "asc",
      },
    });
    return parents;
  } catch (error) {
    console.error("Error fetching parents:", error);
    return []; // Return an empty array on error
  }
}

// ... (other functions like getParentsWithStudents, getDeactivatedParents, searchParents) ...

export async function toggleUserStatus(
  userId: string,
  newStatus: "active" | "deactivated"
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
      success: `User status for '${updatedUser.name}' updated to '${newStatus}'.`,
    };
  } catch (e: any) {
    console.error("Error toggling user status:", e);
    return { error: "Failed to update user status." };
  }
}

/**
 * Fetches all active parents with a list of their students.
 * Returns an array of parents or an empty array.
 */
export async function getParentsWithStudents() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "admin") {
    return [];
  }

  try {
    const parents = await prisma.user.findMany({
      where: {
        role: "parent",
        status: "active",
      },
      include: {
        students: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        name: "asc",
      },
    });
    return parents;
  } catch (error) {
    console.error("Error fetching parents with students:", error);
    return [];
  }
}

/**
 * Fetches all deactivated parents.
 * Returns an array of parents or an empty array.
 */
export async function getDeactivatedParents() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "admin") {
    return [];
  }

  try {
    const parents = await prisma.user.findMany({
      where: {
        role: "parent",
        status: "deactivated",
      },
      include: {
        students: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        name: "asc",
      },
    });
    return parents;
  } catch (error) {
    console.error("Error fetching deactivated parents:", error);
    return [];
  }
}

/**
 * Searches for parents by name or student's name.
 * Returns an array of parents or an empty array.
 */
export async function searchParents(search: string = "") {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "admin") {
    return [];
  }

  const parents = await prisma.user.findMany({
    where: {
      role: "parent",
      OR: [
        { name: { contains: search, mode: "insensitive" } },
        {
          students: {
            some: { name: { contains: search, mode: "insensitive" } },
          },
        },
      ],
    },
    include: {
      students: {
        select: {
          id: true,
          name: true,
        },
      },
    },
    orderBy: {
      name: "asc",
    },
  });

  return parents;
}

/**
 * Fetches all students linked to the currently authenticated parent.
 * This function runs securely on the server.
 * @returns An array of linked students, or an empty array if the user is not a parent or no students are found.
 */
export async function getLinkedStudents(): Promise<
  {
    id: string;
    name: string | null;
    reports: StudentReport[];
    profile: StudentProfile;
  }[]
> {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      console.log("No authenticated user found. Cannot fetch linked students.");
      return [];
    }

    // Use Prisma to find all students where the parentId matches the current user's ID.
    // We also include the related subjects and scores to get all necessary data in one query.
    const students = await prisma.user.findMany({
      where: {
        parentId: session.user.id,
        role: "student",
      },
      select: {
        id: true,
        name: true,
        email: true,
        nationality: true,
        dateOfBirth: true,
        // Include the subjects and their scores.
        subjectsTaking: {
          include: {
            subject: true,
            scores: true,
          },
        },
      },
    });

    // Now, we map the Prisma result to the expected format for the client component.
    const linkedStudents = students.map((student) => {
      // Create the StudentProfile from the student's User data.
      const profile: StudentProfile = {
        name: student.name || "N/A",
        email: student.email,
        dateOfBirth: student.dateOfBirth ?? null,
        nationality: student.nationality ?? null,
        state: null,
        boardingStatus: null,
        level: null,
        photoUrl: null,
        address: null,
        phone: null,
        gender: null,
        occupation: null,
      };

      // Create the StudentReport array by iterating through the subjects and their scores.
      const reports: StudentReport[] = student.subjectsTaking.flatMap(
        (studentSubject) =>
          studentSubject.scores.map((score) => ({
            id: score.id,
            term: "Term 1", // The schema doesn't have a term field, so we'll use a placeholder.
            subject: studentSubject.subject.name,
            test1: score.score1,
            test2: score.score2,
            exam: score.exam,
            total: score.total,
            comment: score.comment || "",
          }))
      );

      return {
        id: student.id,
        name: student.name || "N/A",
        reports: reports,
        profile: profile,
      };
    });

    return linkedStudents;
  } catch (error) {
    console.error("Failed to fetch linked students:", error);
    return [];
  }
}
