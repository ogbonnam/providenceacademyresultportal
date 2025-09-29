// components/TeacherDashboardWrapper.tsx
// This is a Server Component that fetches the data.
import TeacherDashboard from "./TeacherDashboard";
import { getLoggedInTeacherDetails } from "@/app/actions/teacher";

export default async function TeacherDashboardWrapper() {
  const teacherDetails = await getLoggedInTeacherDetails();

  // Handle the case where the user is not a teacher or not logged in.
  if (!teacherDetails) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
        <div className="bg-white p-8 rounded-xl shadow-lg border border-red-300 text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">
            Access Denied
          </h1>
          <p className="text-gray-700">
            You must be logged in as a teacher to view this page.
          </p>
        </div>
      </div>
    );
  }

  // Pass the server-fetched data as a prop to the Client Component.
  return <TeacherDashboard teacher={teacherDetails} />;
}
