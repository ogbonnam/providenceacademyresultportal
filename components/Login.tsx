// components/Login.tsx
"use client";

import React, { useState } from "react";
import { signIn } from "next-auth/react";

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>(""); // State for email
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleLoginAttempt = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    const result = await signIn("credentials", {
      redirect: false,
      email, // Pass email instead of username
      password,
    });

    if (result?.error) {
      setError("Invalid email or password.");
    }

    if (result?.ok) {
      window.location.href = "/";
    }

    setIsSubmitting(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-120px)]">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
       <div className="text-center">
        <img 
          src="/images/logo.jpg" 
          alt="Logo" 
          className="mx-auto mb-4 w-16 h-16" 
        />
        <h2 className="text-3xl font-bold text-indigo-700 mb-6">
          Login
        </h2>
      </div>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <form onSubmit={handleLoginAttempt}>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="email"
            >
              Email
            </label>
            <input
              type="email" // Change input type to email for better UX
              id="email"
              className="shadow appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isSubmitting}
            />
          </div>
          <div className="mb-6">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="password"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              className="shadow appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 mb-3 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isSubmitting}
            />
          </div>
          <div className="flex items-center justify-center">
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-lg focus:outline-none focus:shadow-outline transition duration-300 ease-in-out shadow-md"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Signing In..." : "Sign In"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
