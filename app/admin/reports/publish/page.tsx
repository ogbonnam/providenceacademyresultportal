"use client";

import { SessionProvider } from "next-auth/react";
import PublishReportsContent from "./PublishReportsContent";

export default function PublishReportsPage() {
  return (
    <SessionProvider>
      <div className="text-black">

      <PublishReportsContent />
      </div>
    </SessionProvider>
  );
}
