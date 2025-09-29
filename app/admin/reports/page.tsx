import ReportEntryForm from "@/components/report/ScoreEntryForm";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { redirect } from "next/navigation";
import AdminLayout from "@/components/dashboard/AdminLayout";

export default async function ReportEntryPage() {
  // const session = await getServerSession(authOptions);

  // if (!session || session.user.role !== "ADMIN" && session.user.role !== "teacher") {
  //   redirect("/");
  // }

  return (
    <AdminLayout>
      <main className="container mx-auto p-4 md:p-8 text-black">
        <ReportEntryForm />
      </main>
    </AdminLayout>
  );
}
