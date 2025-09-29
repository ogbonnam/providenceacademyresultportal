"use client";

import React from "react";
import AdminLayout from "./dashboard/AdminLayout";
import DashboardContent from "./dashboard/DashboardContent";

export default function AdminDashboard() {
  return (
    <AdminLayout>
      <DashboardContent />
    </AdminLayout>
  );
}
