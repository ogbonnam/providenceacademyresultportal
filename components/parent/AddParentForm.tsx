"use client";

import React, { useState, useRef, useActionState, useEffect } from "react";
import { useFormStatus } from "react-dom";
import { createParent } from "@/app/actions/parent";

type FormState = {
  success?: string | null;
  error?: string | null;
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-lg focus:outline-none focus:shadow-outline transition duration-300 ease-in-out shadow-md"
      disabled={pending}
    >
      {pending ? "Adding Parent..." : "Add Parent"}
    </button>
  );
}

const AddParentForm: React.FC = () => {
  const [state, formAction] = useActionState<FormState, FormData>(
    createParent,
    { success: null, error: null }
  );
  const formRef = useRef<HTMLFormElement>(null);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMatchError, setPasswordMatchError] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    if (state?.success && formRef.current) {
      formRef.current.reset();
      setPassword("");
      setConfirmPassword("");
      setPasswordMatchError("");
      setImagePreview(null);
    }
  }, [state]);

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (password !== confirmPassword) {
      setPasswordMatchError("Passwords do not match.");
      return;
    }
    setPasswordMatchError("");

    if (formRef.current) {
      const formData = new FormData(formRef.current);
      React.startTransition(() => {
        formAction(formData);
      });
    }
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  return (
    <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-2xl">
      <h2 className="text-3xl font-bold text-center text-indigo-700 mb-6">
        Add New Parent
      </h2>

      {state?.success && (
        <p className="text-green-600 text-center mb-4">{state.success}</p>
      )}
      {state?.error && (
        <p className="text-red-500 text-center mb-4">{state.error}</p>
      )}
      {passwordMatchError && (
        <p className="text-red-500 text-center mb-4">{passwordMatchError}</p>
      )}

      <form
        ref={formRef}
        onSubmit={handleFormSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        {/* ... All your input fields remain the same ... */}
        {/* Name */}
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
          />
        </div>
        {/* Email */}
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
          />
        </div>
        {/* Phone */}
        <div>
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="phone"
          >
            Phone
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            required
            className="shadow appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        {/* Occupation */}
        <div>
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="occupation"
          >
            Occupation
          </label>
          <input
            type="text"
            id="occupation"
            name="occupation"
            required
            className="shadow appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        {/* Address */}
        <div className="md:col-span-2">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="address"
          >
            Address
          </label>
          <textarea
            id="address"
            name="address"
            rows={2}
            required
            className="shadow appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        {/* Parent Image with Preview */}
        <div className="md:col-span-2">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="parentImage"
          >
            Parent Image (Optional)
          </label>
          <input
            type="file"
            id="parentImage"
            name="parentImage"
            accept="image/*"
            className="shadow appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
            onChange={handleImageChange}
          />
          {imagePreview && (
            <div className="mt-4">
              <p className="text-gray-600 text-sm mb-2">Image Preview:</p>
              <img
                src={imagePreview}
                alt="Parent Preview"
                className="w-32 h-32 object-cover rounded-full shadow-lg"
              />
            </div>
          )}
        </div>
        {/* Password */}
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
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {/* Confirm Password */}
        <div>
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="confirmPassword"
          >
            Confirm Password
          </label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            required
            className="shadow appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>
        <div className="md:col-span-2 flex justify-center mt-6">
          <SubmitButton />
        </div>
      </form>
    </div>
  );
};

export default AddParentForm;
