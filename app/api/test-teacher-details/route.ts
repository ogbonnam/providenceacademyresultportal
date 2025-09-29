// File location: app/api/test-teacher-details/route.ts

import { NextRequest, NextResponse } from "next/server";
import { getLoggedInTeacherDetails } from "@/app/actions/teacher"; // Adjust the path as needed

// A simple handler function to test the server action.
// The Next.js App Router uses named exports for HTTP methods (GET, POST, etc.)
export async function GET(request: NextRequest) {
  // We don't need to check for the session here, because the
  // getLoggedInTeacherDetails function handles that for us.
  try {
    const teacherDetails = await getLoggedInTeacherDetails();

    if (teacherDetails) {
      // If the function returns a teacher object, send it as a JSON response.
      return NextResponse.json(
        { status: "success", data: teacherDetails },
        { status: 200 }
      );
    } else {
      // If the function returns null, it means the user is not a teacher
      // or not logged in.
      return NextResponse.json(
        {
          status: "error",
          message:
            "Access Denied: You must be a logged-in teacher to view this content.",
        },
        { status: 403 }
      );
    }
  } catch (error) {
    console.error("Test API Route Error:", error);
    return NextResponse.json(
      { status: "error", message: "An internal server error occurred." },
      { status: 500 }
    );
  }
}
