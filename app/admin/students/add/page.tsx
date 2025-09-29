// app/admin/students/add/page.tsx
import AddStudentForm from "@/components/student/AddStudentForm";
import { getParents } from "@/app/actions/parent";
import AdminLayout from "@/components/dashboard/AdminLayout";

export default async function AddStudentPage() {
  // Fetch the list of parents on the server
  // The '|| []' ensures that 'parents' is always an array
  const parents = (await getParents()) || [];

  return (
    <AdminLayout>
      <div className="container p-4 mx-auto">
        {/*
        We pass the fetched parents array as a prop to the
        client component. This is the crucial step.
      */}
        <AddStudentForm parents={parents} />
      </div>
    </AdminLayout>
  );
}
