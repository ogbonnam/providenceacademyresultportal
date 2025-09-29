// app/admin/reports/approve/page.tsx
"use client";

import { SessionProvider } from "next-auth/react";
import ApproveReportsContent from "./ApproveReportContent";

export default function ApproveReportsPage() {
  return (
    <SessionProvider>
      <div className="text-black">

      <ApproveReportsContent />
      </div>
    </SessionProvider>
  );
}
