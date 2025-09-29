import BroadsheetTable from "@/components/report/BroadsheetTable";
import { getBroadsheetData } from "@/app/actions/reports";
import AdminLayout from "@/components/dashboard/AdminLayout";

/**
 * A server component that displays the broadsheet report for admins.
 */
export default async function BroadsheetPage() {
  // const session = await getServerSession(authOptions);

  // // Centralized authorization logic for the page
  // if (!session || session.user.role !== "ADMIN") {
  //   redirect("/");
  // }

  const { students, subjects, scoresMap } = await getBroadsheetData();

  return (
    <AdminLayout>
      <main className="container mx-auto p-4 md:p-8">
        <BroadsheetTable
          students={students}
          subjects={subjects}
          scoresMap={scoresMap}
        />
      </main>
    </AdminLayout>
  );
}
