// app/admin/timetable/page.tsx
import AdminLayout from "@/components/dashboard/AdminLayout";
import { getTimetableData } from "@/app/actions/timetable";
import { getTeachers, getSubjects } from "@/app/actions/teacher";
import TimetableEditor from "@/components/timetable/TimetableEditor";

export default async function TimetablePage() {
  const [timetable, teachers, subjects] = await Promise.all([
    getTimetableData(),
    getTeachers(),
    getSubjects(),
  ]);

  return (
    <AdminLayout>
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          School Timetable
        </h1>
        <TimetableEditor
          initialTimetable={timetable}
          teachers={teachers}
          subjects={subjects}
        />
      </div>
    </AdminLayout>
  );
}
