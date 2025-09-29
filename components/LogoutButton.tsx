// components/LogoutButton.tsx
"use client";

import { signOut } from "next-auth/react";

const LogoutButton: React.FC = () => {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/" })}
      className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out"
    >
      Logout
    </button>
  );
};

export default LogoutButton;
