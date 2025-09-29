"use client";

import React, { useState } from "react";
import { createUser } from "@/app/actions/admin";
import AdminLayout from "./dashboard/AdminLayout";

export default function AdminDashboard() {
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleCreateUser = async (formData: FormData) => {
    setIsSubmitting(true);
    setMessage(null);

    const result = await createUser(formData);

    if (result?.success) {
      setMessage({ type: "success", text: result.success });
      (document.getElementById("createUserForm") as HTMLFormElement)?.reset();
    } else if (result?.error) {
      setMessage({ type: "error", text: result.error });
    }
    setIsSubmitting(false);
  };

  return (
    <AdminLayout>
      <h2 className="text-3xl font-bold text-indigo-700 mb-6">Admin Panel</h2>
      <div className="bg-white p-8 rounded-xl shadow-lg mb-8">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">
          Create New User
        </h3>
        {message && (
          <p
            className={`text-center mb-4 ${
              message.type === "success" ? "text-green-600" : "text-red-500"
            }`}
          >
            {message.text}
          </p>
        )}
        <form
          id="createUserForm"
          action={handleCreateUser}
          className="space-y-4"
        >
          <div>
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="name"
            >
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              className="shadow appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500"
              disabled={isSubmitting}
            />
          </div>
          <div>
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="email"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              className="shadow appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500"
              disabled={isSubmitting}
            />
          </div>
          <div>
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="password"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              required
              className="shadow appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500"
              disabled={isSubmitting}
            />
          </div>
          <div>
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="role"
            >
              Role
            </label>
            <select
              id="role"
              name="role"
              required
              className="shadow appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500"
              disabled={isSubmitting}
            >
              <option value="student">Student</option>
              <option value="teacher">Teacher</option>
              <option value="parent">Parent</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <button
            type="submit"
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg focus:outline-none focus:shadow-outline transition duration-300 ease-in-out shadow-md"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Creating User..." : "Create User"}
          </button>
        </form>
      </div>
      <div className="bg-white p-8 rounded-xl shadow-lg">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">
          Manage Existing Users
        </h3>
        <p className="text-gray-600">
          (Future functionality: List, edit, or delete users here.)
        </p>
      </div>
    </AdminLayout>
  );
}
