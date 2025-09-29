// app/admin/parents/deactivated/page.tsx
import ParentTable from "@/components/parent/ParentTable";
import { getDeactivatedParents } from "@/app/actions/parent";
import AdminLayout from "@/components/dashboard/AdminLayout";

/**
 * Renders the page for viewing only deactivated parents.
 * This is a Server Component, responsible for initial data fetching.
 */
export default async function DeactivatedParentsPage() {
  // We call the specific server action to get only deactivated parents.
  // The '|| []' ensures we always have an array, even if the data fetch fails.
  const parents = (await getDeactivatedParents()) || [];

  return (
    <AdminLayout>
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Deactivated Parents
        </h1>
        {/*
          The ParentTable component will now receive an array containing only
          the deactivated parents as its initial state.
        */}

        <ParentTable initialParents={parents} />
      </div>
    </AdminLayout>
  );
}
