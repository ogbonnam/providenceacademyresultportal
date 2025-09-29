// app/admin/parents/page.tsx
import ParentTable from "@/components/parent/ParentTable";
import { getParentsWithStudents } from "@/app/actions/parent";
import AdminLayout from "@/components/dashboard/AdminLayout";
/**
 * Renders the page for viewing all parents.
 * This is a Server Component, responsible for initial data fetching.
 */
export default async function ViewParentsPage() {
  // Await the server action and provide a fallback of an empty array
  // in case the action returns undefined.
  const parents = (await getParentsWithStudents()) || [];

  return (
    <AdminLayout>
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">All Parents</h1>
        {/*
        This is the corrected line.
        It uses the proper prop name 'initialParents'
        and passes the now-guaranteed array of parents.
      */}
        <ParentTable initialParents={parents} />
      </div>
    </AdminLayout>
  );
}
