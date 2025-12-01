"use client";

import { useEffect } from "react";
import { Brain, UserCircle, Building2, Shield, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to candidate login by default after a brief moment
    const timer = setTimeout(() => {
      router.push("/candidate-login");
    }, 3000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fef8f5] via-[#fff5f1] to-[#ffe8df] dark:from-[#1a1212] dark:via-[#2d2424] dark:to-[#1a1212] flex items-center justify-center px-4 py-12">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-rose-400/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-orange-400/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative w-full max-w-2xl">
        {/* Logo */}
        <Link href="/" className="flex items-center justify-center gap-3 mb-12">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-rose-400 to-orange-400 rounded-xl blur-md opacity-50"></div>
            <div className="relative p-2.5 bg-gradient-to-br from-rose-400 to-orange-400 rounded-xl shadow-lg">
              <Brain className="w-8 h-8 text-white" />
            </div>
          </div>
          <span className="text-2xl font-bold bg-gradient-to-r from-rose-600 via-orange-600 to-amber-600 bg-clip-text text-transparent">
            Smart Hiring OS
          </span>
        </Link>

        {/* Portal Selection */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Choose Your Portal
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-lg">
            Select the login page for your role
          </p>
        </div>

        {/* Portal Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Candidate Portal */}
          <Link
            href="/candidate-login"
            className="group bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg rounded-2xl shadow-xl p-8 border-2 border-blue-200 dark:border-blue-800 hover:border-blue-400 dark:hover:border-blue-600 transition-all hover:scale-105 hover:shadow-2xl"
          >
            <div className="flex flex-col items-center text-center">
              <div className="p-4 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl mb-4 group-hover:scale-110 transition-transform">
                <UserCircle className="w-12 h-12 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                Candidate
              </h3>
              <p className="text-slate-600 dark:text-slate-400 mb-4">
                Find your dream job and manage applications
              </p>
              <div className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 font-medium">
                Continue
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>

          {/* Recruiter Portal */}
          <Link
            href="/recruiter-login"
            className="group bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg rounded-2xl shadow-xl p-8 border-2 border-emerald-200 dark:border-emerald-800 hover:border-emerald-400 dark:hover:border-emerald-600 transition-all hover:scale-105 hover:shadow-2xl"
          >
            <div className="flex flex-col items-center text-center">
              <div className="p-4 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl mb-4 group-hover:scale-110 transition-transform">
                <Building2 className="w-12 h-12 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                Recruiter
              </h3>
              <p className="text-slate-600 dark:text-slate-400 mb-4">
                Source top talent and manage hiring
              </p>
              <div className="inline-flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-medium">
                Continue
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>
        </div>

        {/* Sign Up Link */}
        <div className="text-center">
          <p className="text-slate-600 dark:text-slate-400">
            Don't have an account?{" "}
            <Link
              href="/signup"
              className="font-medium text-rose-600 hover:text-rose-700 dark:text-rose-400"
            >
              Sign up for free
            </Link>
          </p>
        </div>

        {/* Back to Home */}
        <div className="mt-8 text-center">
          <Link
            href="/"
            className="text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            ← Back to home
          </Link>
        </div>

        {/* Auto-redirect message */}
        <div className="mt-4 text-center">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Redirecting to candidate login in 3 seconds...
          </p>
        </div>
      </div>
    </div>
  );
}
