// components/Dashboard.tsx
// This component acts as a router for different user dashboards.
import React from "react";
import AdminDashboard from "./AdminDashboard";
import StudentDashboard from "./StudentDashboard";
import TeacherDashboard from "./TeacherDashboard";
import ParentDashboard from "./ParentDashboard";

// Define the possible user roles
type UserRole = "guest" | "student" | "teacher" | "parent" | "admin";

// Define props interface for Dashboard component
interface DashboardProps {
  userRole: UserRole;
}

const Dashboard: React.FC<DashboardProps> = ({ userRole }) => {
  switch (userRole) {
    case "admin":
      return <AdminDashboard />;
    case "student":
      return <StudentDashboard />;
    case "teacher":
      return <TeacherDashboard teacher={{} as any} />;
    case "parent":
      return <ParentDashboard />;
    default:
      return (
        <div className="text-center py-10">
          <h2 className="text-2xl font-semibold text-gray-800">
            Please log in to access the dashboard.
          </h2>
        </div>
      );
  }
};

export default Dashboard;
