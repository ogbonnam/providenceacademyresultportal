// app/actions/admin.ts
"use server";

import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export async function createUser(formData: FormData) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "admin") {
    return { error: "Unauthorized: Only administrators can create users." };
  }

  const name = formData.get("name")?.toString(); // We'll keep the name field for display
  const email = formData.get("email")?.toString(); // Get the email
  const password = formData.get("password")?.toString();
  const role = formData.get("role")?.toString();

  if (!name || !email || !password || !role) {
    return { error: "All fields are required." };
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        name,
        email, // Save the email
        password: hashedPassword,
        role,
      },
    });

    return {
      success: `User '${newUser.name}' (${newUser.email}) with role '${newUser.role}' created successfully!`,
    };
  } catch (e: any) {
    // Check for unique email constraint violation
    if (e.code === "P2002" && e.meta?.target.includes("email")) {
      return { error: "An account with this email already exists." };
    }
    console.error("Error creating user:", e);
    return { error: "Failed to create user. An unexpected error occurred." };
  }
}
