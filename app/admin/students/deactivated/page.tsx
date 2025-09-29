// app/admin/students/deactivated/page.tsx
import AdminLayout from "@/components/dashboard/AdminLayout";
import StudentTable from "@/components/student/StudentTable";
import { getDeactivatedStudents } from "@/app/actions/student";

export default async function DeactivatedStudentsPage() {
  // Fetch only students with 'deactivated' status
  const students = (await getDeactivatedStudents()) || [];

  return (
    <AdminLayout>
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Deactivated Students
        </h1>
        {/* Correct prop name from 'students' to 'initialStudents' */}
        <StudentTable initialStudents={students} />
      </div>
    </AdminLayout>
  );
}
