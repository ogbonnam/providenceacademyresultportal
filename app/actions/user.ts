// app/actions/user.ts
// This file contains server-only functions for user-related actions.
"use server";

// app/actions/user.ts
// This file contains server-only functions for user-related actions.
"use server";

import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";

const prisma = new PrismaClient();

// Define the possible user roles
type UserRole = "guest" | "student" | "teacher" | "parent" | "admin";

/**
 * Fetches detailed user information. This action is restricted to admin users.
 * @param userId The ID of the user to fetch details for.
 * @returns An object containing either the user details or an error message.
 */
export async function getUserDetails(userId: string) {
  // Use getServerSession to get the session, which is consistent with the rest of the file.
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "admin") {
    return { error: "Unauthorized." };
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        parent: {
          select: {
            name: true,
            email: true,
          },
        },
        students: {
          select: {
            id: true,
            name: true,
            email: true,
            photoUrl: true,
          },
        },
      },
    });

    if (!user) {
      return { error: "User not found." };
    }

    return { user };
  } catch (error) {
    console.error("Error fetching user details:", error);
    return { error: "Failed to fetch user details." };
  }
}

export async function getCurrentUserRole(): Promise<UserRole> {
  try {
    // 1. Get the session on the server.
    const session = await getServerSession(authOptions);

    // 2. Check if the session exists and if the role is present on the user object.
    // Thanks to your auth-options.ts file, the role is now part of the session!
    if (session?.user?.role) {
      // 3. If a role is found, return it directly. No database query needed!
      return session.user.role as UserRole;
    }

    // 4. If there is no session or no role, the user is a guest.
    console.log("No valid session or role found. Returning 'guest' role.");
    return "guest";
  } catch (error) {
    console.error("Failed to get current user role from session:", error);
    return "guest"; // Return a safe default in case of any error.
  }
}
