'use client';

import React, { useState } from "react";
import {
  EyeIcon,
  EyeSlashIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";
import { signIn } from "next-auth/react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

const Login: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleFillDefault = () => {
    setUsername("applicant@icebrg.uk");
    setPassword("assignment_task375");
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    signIn("credentials", {
      email: username,
      password,
      redirect: false,
    })
      .then((response) => {
        if (response?.ok) {
          router.push("/");
        } else {
          toast.error("Login failed. Please check your credentials.");
        }
      })
      .catch((error) => {
        toast.error(error.message || "An unexpected error occurred");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const isFormValid = username.trim() !== "" && password.trim() !== "";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="p-6 max-w-sm w-full bg-gray-800 rounded-md shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-400 mb-8">
          Login
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              className="block text-gray-400 text-sm font-bold mb-2"
              htmlFor="username"
            >
              Username
            </label>
            <input
              className="shadow appearance-none w-full py-2 px-3 text-gray-400 rounded bg-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="username"
              type="text"
              placeholder="Username"
              value={username}
              required
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="mb-6 relative">
            <label
              className="block text-gray-400 text-sm font-bold mb-2"
              htmlFor="password"
            >
              Password
            </label>
            <input
              className="shadow appearance-none w-full py-2 pl-3 pr-10 text-white rounded bg-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              required
              onChange={(e) => setPassword(e.target.value)}
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm pt-4 mt-3">
              <button type="button" onClick={togglePasswordVisibility}>
                {showPassword ? (
                  <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                ) : (
                  <EyeIcon className="h-5 w-5 text-gray-400" />
                )}
              </button>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <button
              className="bg-gray-800 hover:bg-gray-700 border border-gray-500 text-gray-300 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="button"
              onClick={handleFillDefault}
            >
              Use Default Data
            </button>
            <button
              className={`bg-green-500 text-gray-100 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${
                !isFormValid || loading
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-green-700"
              }`}
              type="submit"
              disabled={loading || !isFormValid}
            >
              {loading ? (
                <ArrowPathIcon className="h-5 w-5 text-gray-100 animate-spin" />
              ) : (
                "Sign In"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
