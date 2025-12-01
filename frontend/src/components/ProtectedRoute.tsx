"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireRole?: "candidate" | "recruiter";
}

/**
 * Protected Route Wrapper Component
 * Redirects to login if user is not authenticated
 * Optionally checks for specific role
 */
export default function ProtectedRoute({
  children,
  requireRole,
}: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      // Not authenticated - redirect to login
      if (!user) {
        router.push("/login");
        return;
      }

      // Check role if required
      if (requireRole && user.role !== requireRole) {
        // Redirect to correct dashboard based on actual role
        if (user.role === "candidate") {
          router.push("/candidate");
        } else if (user.role === "recruiter") {
          router.push("/recruiter");
        }
      }
    }
  }, [user, loading, requireRole, router]);

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#fef8f5] via-[#fff5f1] to-[#ffe8df] dark:from-[#1a1212] dark:via-[#2d2424] dark:to-[#1a1212] flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-rose-500 border-t-transparent"></div>
          <p className="mt-4 text-slate-600 dark:text-slate-400">Loading...</p>
        </div>
      </div>
    );
  }

  // Not authenticated - don't render protected content
  if (!user) {
    return null;
  }

  // Wrong role - don't render protected content
  if (requireRole && user.role !== requireRole) {
    return null;
  }

  // Authenticated and authorized - render children
  return <>{children}</>;
}
