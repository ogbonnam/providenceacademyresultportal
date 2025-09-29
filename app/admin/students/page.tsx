// app/admin/students/page.tsx
import AdminLayout from "@/components/dashboard/AdminLayout";
import StudentTable from "@/components/student/StudentTable";
// Correct the import statement to use the existing getStudents function
import { getStudents } from "@/app/actions/student";

export default async function ViewStudentsPage() {
  // Call the correct function to fetch all active students
  const students = (await getStudents()) || [];

  return (
    <AdminLayout>
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">All Students</h1>
        <StudentTable initialStudents={students} />
      </div>
    </AdminLayout>
  );
}
