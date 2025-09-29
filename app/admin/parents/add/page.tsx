import React from "react";
import AdminLayout from "@/components/dashboard/AdminLayout";
import AddParentForm from "@/components/parent/AddParentForm";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { redirect } from "next/navigation";

export default async function AddParentPage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "admin") {
    redirect("/");
  }

  return (
    <AdminLayout>
      <AddParentForm />
    </AdminLayout>
  );
}
