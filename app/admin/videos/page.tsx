// app/admin/videos/page.tsx
import AdminLayout from "@/components/dashboard/AdminLayout";
import { getSubjects } from "@/app/actions/videos";
import EducationalVideosDashboard from "@/components/dashboard/videos/EducationalVideosDashboard";

// This is a server component that fetches the subjects
export default async function AdminVideosPage() {
  const subjects = await getSubjects();

  return (
    <AdminLayout>
      <EducationalVideosDashboard subjects={subjects} />
    </AdminLayout>
  );
}
