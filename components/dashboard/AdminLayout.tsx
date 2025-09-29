"use client";

import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex">
      <Sidebar isOpen={isSidebarOpen} />
      <div
        className={`flex flex-col min-h-screen transition-all duration-300 ${
          isSidebarOpen
            ? "ml-64 w-[calc(100%-16rem)]"
            : "ml-20 w-[calc(100%-5rem)]"
        }`}
      >
        <Topbar toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
        <main className="flex-1 p-6 bg-gray-100 mt-16">{children}</main>
      </div>
    </div>
  );
};

export default AdminLayout;
