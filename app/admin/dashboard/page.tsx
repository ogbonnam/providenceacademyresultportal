// app/admin/dashboard/page.tsx
import AdminLayout from "@/components/dashboard/AdminLayout";
import DashboardContent from "@/components/dashboard/DashboardContent";
import {
  getDashboardSummary,
  getUpcomingEvents,
  getStudentsPerformance,
} from "@/app/actions/dashboard";
import { getTimetableData } from "@/app/actions/timetable";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { redirect } from "next/navigation";

// This is a server component that fetches all data
export default async function AdminDashboardPage() {
  const session = await getServerSession(authOptions);

  // Authorization check for the entire page
  if (!session || session.user.role !== "admin") {
    redirect("/dashboard");
  }

  // Fetch all the data concurrently
  const [summary, events, timetable, studentPerformance] = await Promise.all([
    getDashboardSummary(),
    getUpcomingEvents(),
    getTimetableData(),
    getStudentsPerformance(),
  ]);

  return (
    <AdminLayout>
      <DashboardContent
        summary={summary}
        performance={studentPerformance} // Pass the real data here
        events={events}
        timetable={timetable}
      />
    </AdminLayout>
  );
}
