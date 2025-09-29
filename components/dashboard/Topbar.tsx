"use client";

import React from "react";
import { MdMenu } from "react-icons/md";
import LogoutButton from "../LogoutButton";

interface TopbarProps {
  toggleSidebar: () => void;
  isSidebarOpen: boolean;
}

const Topbar: React.FC<TopbarProps> = ({ toggleSidebar, isSidebarOpen }) => {
  return (
    <div
      className={`fixed top-0 right-0 z-30 transition-all duration-300 bg-white shadow-md p-4 flex justify-between items-center ${
        isSidebarOpen ? "left-64" : "left-20"
      }`}
    >
      <button
        onClick={toggleSidebar}
        className="text-gray-600 focus:outline-none"
      >
        <MdMenu className="h-6 w-6" />
      </button>

      <div className="flex items-center space-x-4">
        {/* You can add user profile info here if needed */}
        <LogoutButton />
      </div>
    </div>
  );
};

export default Topbar;
