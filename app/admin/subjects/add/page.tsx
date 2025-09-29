// app/admin/subjects/create/page.tsx
"use client";

import React, { useActionState } from "react";
import { useFormStatus } from "react-dom";
import AdminLayout from "@/components/dashboard/AdminLayout";
import { createSubject } from "@/app/actions/teacher";

const initialState = {
  success: null,
  error: null,
};

const SubmitButton = () => {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      className="w-full bg-indigo-600 text-white font-bold py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors duration-200"
      disabled={pending}
    >
      {pending ? "Creating Subject..." : "Create Subject"}
    </button>
  );
};

export default function CreateSubjectPage() {
  const [state, formAction] = useActionState(createSubject, initialState);

  return (
    <AdminLayout>
      <div className="container p-6 bg-white text-black rounded-lg shadow-lg max-w-lg mt-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Create New Subject
        </h1>
        <form action={formAction} className="space-y-6">
          {state.success && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative">
              <span className="block sm:inline">{state.success}</span>
            </div>
          )}
          {state.error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
              <span className="block sm:inline">{state.error}</span>
            </div>
          )}

          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Subject Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700"
            >
              Description
            </label>
            <textarea
              id="description"
              name="description"
              rows={3}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            ></textarea>
          </div>

          <SubmitButton />
        </form>
      </div>
    </AdminLayout>
  );
}
