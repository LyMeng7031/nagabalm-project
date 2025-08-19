"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import Link from "next/link";
import { FormEvent } from "react";
import { useMutation } from "@tanstack/react-query";
import { loginSchema, LoginFormData } from "./validation";
import { z } from "zod";
import { setAuthTokens } from "@/lib/auth";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formErrors, setFormErrors] = useState<Partial<LoginFormData>>({});
  const [apiError, setApiError] = useState("");
  const router = useRouter();
  const locale = useLocale();

  // Mutation for login
  const loginMutation = useMutation({
    mutationFn: async (credentials: LoginFormData) => {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        let errorMsg = "Login failed";
        try {
          const errorData = await response.json();
          errorMsg = errorData.error || errorData.message || errorMsg;
        } catch {}
        throw new Error(errorMsg);
      }

      return response.json();
    },
    onSuccess: (data) => {
      // Log the API response to debug
      console.log("API Response:", data);

      // Check if the response has the expected structure
      if (
        !data.success ||
        !data.data ||
        !data.data.accessToken ||
        !data.data.refreshToken
      ) {
        setApiError(
          "Login successful, but no tokens received. Please try again."
        );
        return;
      }

      // Store the complete auth payload (consistent with ProtectedRoute expectations)
      localStorage.setItem("authPayload", JSON.stringify(data));

      // Also store individual tokens for backward compatibility
      setAuthTokens(data.data.accessToken, data.data.refreshToken);

      // Check if there's a redirect path stored
      const redirectPath = localStorage.getItem("redirectAfterLogin");
      if (redirectPath) {
        // Clear the stored redirect path
        localStorage.removeItem("redirectAfterLogin");
        // Navigate to the originally intended path
        router.push(redirectPath);
      } else {
        // Default navigation to dashboard
        router.push(`/${locale}/dashboard`);
      }
    },
    onError: (error: Error) => {
      setApiError(error.message || "An error occurred during login");
    },
  });

  // Handle form submission
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setApiError("");
    setFormErrors({});

    // Validate form data with Zod
    try {
      const formData = loginSchema.parse({ email, password });
      loginMutation.mutate(formData);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors: Partial<LoginFormData> = {};
        error.issues.forEach((issue) => {
          if (issue.path[0]) {
            errors[issue.path[0] as keyof LoginFormData] = issue.message;
          }
        });
        setFormErrors(errors);
      } else {
        setApiError("An unexpected error occurred");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-center text-2xl font-bold text-gray-800 mb-6">
          Sign in to your account
        </h2>

        {(apiError || formErrors.email || formErrors.password) && (
          <div className="mb-4 text-sm text-red-700 bg-red-100 border border-red-300 rounded-md p-3">
            {apiError && <p>{apiError}</p>}
            {formErrors.email && <p>{formErrors.email}</p>}
            {formErrors.password && <p>{formErrors.password}</p>}
          </div>
        )}


        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="email"
              id="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md placeholder-gray-500 text-sm text-black focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            />
            {formErrors.email && (
              <p className="mt-1 text-sm text-red-600">{formErrors.email}</p>
            )}
          </div>

          <div>
            <input
              type="password"
              id="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md placeholder-gray-500 text-sm text-black focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            />
            {formErrors.password && (
              <p className="mt-1 text-sm text-red-600">{formErrors.password}</p>
            )}
          </div>

          <div className="flex items-center justify-between text-sm text-gray-600">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                className="text-orange-600 rounded focus:ring-orange-500"
              />
              <span className="ml-2">Remember me</span>
            </label>
            <Link
              href="/forgot-password"
              className="text-orange-600 hover:underline"
            >
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loginMutation.isPending}
            className={`w-full py-2 px-4 rounded-md text-white bg-orange-600 hover:bg-orange-700 transition text-sm font-medium focus:outline-none focus:ring-2 focus:ring-orange-500 ${
              loginMutation.isPending ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {loginMutation.isPending ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
