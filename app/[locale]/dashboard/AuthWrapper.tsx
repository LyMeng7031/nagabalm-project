"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";

interface AuthWrapperProps {
  children: React.ReactNode;
}

export default function AuthWrapper({ children }: AuthWrapperProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const locale = useLocale();

  useEffect(() => {
    const checkAuthentication = () => {
      try {
        // Check for auth payload in localStorage
        const authPayload = localStorage.getItem("authPayload");

        if (!authPayload) {
          console.log("No auth payload found, redirecting to login");
          setIsAuthenticated(false);
          router.replace(`/${locale}/login`);
          return;
        }

        const parsedAuth = JSON.parse(authPayload);

        // Check if the auth payload has the expected structure
        if (!parsedAuth.success || !parsedAuth.data?.accessToken) {
          console.log("Invalid auth payload structure, redirecting to login");
          setIsAuthenticated(false);
          localStorage.removeItem("authPayload");
          router.replace(`/${locale}/login`);
          return;
        }

        // Optionally: Check if token is expired
        const token = parsedAuth.data.accessToken;
        if (isTokenExpired(token)) {
          console.log("Token expired, redirecting to login");
          setIsAuthenticated(false);
          localStorage.removeItem("authPayload");
          router.replace(`/${locale}/login`);
          return;
        }

        console.log("User authenticated successfully");
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Authentication check failed:", error);
        setIsAuthenticated(false);
        localStorage.removeItem("authPayload");
        router.replace(`/${locale}/login`);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthentication();
  }, [router, locale]);

  // Function to check if JWT token is expired
  const isTokenExpired = (token: string): boolean => {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const currentTime = Date.now() / 1000;
      return payload.exp < currentTime;
    } catch (error) {
      console.error("Error parsing token:", error);
      return true; // If we can't parse it, consider it expired
    }
  };

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render children if not authenticated (redirect is in progress)
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  // Render children if authenticated
  return <>{children}</>;
}
