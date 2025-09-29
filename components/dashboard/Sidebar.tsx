"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { adminMenuItems } from "@/lib/menuItems";
import { MdKeyboardArrowDown } from "react-icons/md";

interface SidebarProps {
  isOpen: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen }) => {
  const pathname = usePathname();

  // Initialize the state with all menu names that have submenus,
  // so they are all open by default.
  const [openSubmenus, setOpenSubmenus] = useState<string[]>(() =>
    adminMenuItems.filter((item) => item.submenus).map((item) => item.name)
  );

  const toggleSubmenu = (menuName: string) => {
    setOpenSubmenus((prev) =>
      prev.includes(menuName)
        ? prev.filter((name) => name !== menuName)
        : [...prev, menuName]
    );
  };

  return (
    <div
      className={`fixed top-0 left-0 h-full bg-gray-900 text-white transition-all duration-300 z-40 ${
        isOpen ? "w-64" : "w-20"
      } flex flex-col`}
    >
      <div className="flex-shrink-0 p-4 border-b border-gray-700">
        <h1 className="text-xl font-bold">
          {isOpen ? "Admin Dashboard" : "AD"}
        </h1>
      </div>

      <nav className="flex-1 overflow-y-auto p-4 space-y-2">
        {adminMenuItems.map((item) => (
          <div key={item.name}>
            {/* Main menu item */}
            <div
              className={`flex items-center rounded-lg p-2 transition-colors duration-200 ${
                pathname === item.href
                  ? "bg-indigo-600 text-white"
                  : "hover:bg-gray-700"
              }`}
            >
              {item.submenus ? (
                <button
                  onClick={() => toggleSubmenu(item.name)}
                  className="w-full flex items-center justify-between text-left focus:outline-none"
                >
                  <div className="flex items-center">
                    <item.icon className="h-6 w-6" />
                    {isOpen && <span className="ml-3">{item.name}</span>}
                  </div>
                  {isOpen && (
                    <MdKeyboardArrowDown
                      className={`h-5 w-5 transform transition-transform duration-200 ${
                        openSubmenus.includes(item.name) ? "rotate-180" : ""
                      }`}
                    />
                  )}
                </button>
              ) : (
                <Link
                  href={item.href || "#"}
                  className="w-full flex items-center"
                >
                  <item.icon className="h-6 w-6" />
                  {isOpen && <span className="ml-3">{item.name}</span>}
                </Link>
              )}
            </div>

            {/* Submenu items */}
            {isOpen && item.submenus && openSubmenus.includes(item.name) && (
              <div className="mt-2 space-y-1 pl-8">
                {item.submenus.map((submenu) => (
                  <Link
                    key={submenu.name}
                    href={submenu.href}
                    className={`block rounded-lg p-2 text-sm transition-colors duration-200 ${
                      pathname === submenu.href
                        ? "bg-indigo-500 text-white"
                        : "hover:bg-gray-700"
                    }`}
                  >
                    {submenu.name}
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
