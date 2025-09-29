// app/admin/subjects/assign-students/page.tsx
import AdminLayout from "@/components/dashboard/AdminLayout";
import {
  getStudents,
  getStudentSubjectAssignments,
} from "@/app/actions/student";
import { getSubjects } from "@/app/actions/teacher";
import AssignStudentsForm from "@/components/subject/AssignStudentsForm";

export default async function AssignStudentsPage() {
  const students = await getStudents();
  const subjects = await getSubjects();
  const assignments = await getStudentSubjectAssignments();

  if (students.length === 0) {
    return (
      <AdminLayout>
        <div className="container mx-auto p-4">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">
            Assign Students to Subjects
          </h1>
          <p className="text-gray-500">
            No students found. Please create a student first.
          </p>
        </div>
      </AdminLayout>
    );
  }

  if (subjects.length === 0) {
    return (
      <AdminLayout>
        <div className="container mx-auto p-4">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">
            Assign Students to Subjects
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
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Assign Students to Subjects
        </h1>
        <AssignStudentsForm
          students={students}
          subjects={subjects}
          initialAssignments={assignments}
        />
      </div>
    </AdminLayout>
  );
}
