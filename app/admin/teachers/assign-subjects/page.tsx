// app/admin/teachers/assign-subjects/page.tsx
import AdminLayout from "@/components/dashboard/AdminLayout";
import { getTeachers, getSubjects } from "@/app/actions/teacher";
import AssignSubjectsForm from "@/components/teacher/AssignSubjectsForm";

export default async function AssignSubjectsPage() {
  const teachers = await getTeachers();
  const subjects = await getSubjects();

  if (!teachers || teachers.length === 0) {
    return (
      <AdminLayout>
        <div className="container mx-auto p-4 text-black">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">
            Assign Subjects to Teacher
          </h1>
          <p className="text-gray-500">
            No teachers found. Please create a teacher first.
          </p>
        </div>
      </AdminLayout>
    );
  }

  if (!subjects || subjects.length === 0) {
    return (
      <AdminLayout>
        <div className="container mx-auto p-4 text-black">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">
            Assign Subjects to Teacher
          </h1>
          <p className="text-gray-500">
            No subjects found. Please create a subject first.
          </p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="container mx-auto p-4 text-black">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Assign Subjects to Teacher
        </h1>
        <AssignSubjectsForm teachers={teachers} subjects={subjects} />
      </div>
    </AdminLayout>
  );
}
