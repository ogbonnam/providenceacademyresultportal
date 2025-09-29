"use client";

import { Session } from "next-auth";
import { SessionProvider } from "./SessionContext";
import Dashboard from "./Dashboard";

// It's a good practice to define this type in a shared file
// so it's consistent across your application.
type UserRole = "student" | "teacher" | "parent" | "admin";

// This component receives the session as a prop from the server
// and makes it available to its children via context.
export default function ClientWrapper({
  session,
}: {
  session: Session | null;
}) {
  if (!session || !session.user || !session.user.role) {
    return null; // Ensure we only render if the session and role exist
  }

  return (
    <SessionProvider session={session}>
      {/* Explicitly cast session.user.role to UserRole */}
      <Dashboard userRole={session.user.role as UserRole} />
    </SessionProvider>
  );
}
