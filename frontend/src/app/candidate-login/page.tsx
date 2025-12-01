"use client";

import { useState } from "react";
import { UserCircle, Mail, Lock, ArrowRight, Eye, EyeOff, Briefcase, TrendingUp, Award } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

export default function CandidateLoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(formData.email, formData.password);
    } catch (err: any) {
      setError(err.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-slate-900 dark:via-indigo-950 dark:to-slate-900">
      <div className="flex min-h-screen">
        {/* Left Side - Branding & Features */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 p-12 flex-col justify-between relative overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-purple-400/20 rounded-full blur-3xl"></div>
          
          <div className="relative z-10">
            <Link href="/" className="flex items-center gap-3 text-white mb-12">
              <div className="p-2.5 bg-white/20 backdrop-blur-lg rounded-xl">
                <UserCircle className="w-8 h-8" />
              </div>
              <span className="text-2xl font-bold">Smart Hiring OS</span>
            </Link>

            <div className="space-y-8">
              <h1 className="text-5xl font-bold text-white leading-tight">
                Your Dream Job<br />Starts Here
              </h1>
              <p className="text-xl text-blue-100">
                Join thousands of professionals finding their perfect career match with AI-powered job recommendations.
              </p>

              {/* Feature highlights */}
              <div className="space-y-4 mt-12">
                <div className="flex items-start gap-4 bg-white/10 backdrop-blur-sm rounded-xl p-4">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <Briefcase className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white mb-1">Smart Job Matching</h3>
                    <p className="text-sm text-blue-100">AI analyzes your skills and preferences to find perfect opportunities</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 bg-white/10 backdrop-blur-sm rounded-xl p-4">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white mb-1">Career Growth Tracking</h3>
                    <p className="text-sm text-blue-100">Monitor your applications and get insights on your job search</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 bg-white/10 backdrop-blur-sm rounded-xl p-4">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <Award className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white mb-1">Resume Optimization</h3>
                    <p className="text-sm text-blue-100">Get AI-powered suggestions to make your resume stand out</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="relative z-10 text-blue-100 text-sm">
            © 2025 Smart Hiring OS. Empowering careers worldwide.
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
          <div className="w-full max-w-md">
            {/* Mobile Logo */}
            <Link href="/" className="lg:hidden flex items-center justify-center gap-3 mb-8">
              <div className="p-2.5 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl">
                <UserCircle className="w-8 h-8 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Smart Hiring OS
              </span>
            </Link>

            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-8 border border-blue-100 dark:border-slate-700">
              {/* Header */}
              <div className="mb-8">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium mb-4">
                  <UserCircle className="w-4 h-4" />
                  Candidate Portal
                </div>
                <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                  Welcome Back!
                </h2>
                <p className="text-slate-600 dark:text-slate-400">
                  Sign in to continue your job search
                </p>
              </div>

              {error && (
                <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-slate-900 dark:text-white"
                      placeholder="candidate@example.com"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="w-full pl-11 pr-12 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-slate-900 dark:text-white"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Remember & Forgot */}
                <div className="flex items-center justify-between">
                  <label className="flex items-center">
                    <input type="checkbox" className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500" />
                    <span className="ml-2 text-sm text-slate-600 dark:text-slate-400">Remember me</span>
                  </label>
                  <Link href="/forgot-password" className="text-sm font-medium text-blue-600 hover:text-blue-700">
                    Forgot password?
                  </Link>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 px-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {loading ? "Signing in..." : (
                    <>
                      Sign In to Dashboard
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </form>

              {/* Sign Up Link */}
              <p className="mt-6 text-center text-sm text-slate-600 dark:text-slate-400">
                Don't have an account?{" "}
                <Link href="/signup" className="font-medium text-blue-600 hover:text-blue-700">
                  Create candidate account
                </Link>
              </p>

              {/* Other Login Options */}
              <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
                <p className="text-xs text-center text-slate-500 mb-3">Are you a recruiter?</p>
                <Link href="/recruiter-login" className="block text-center py-2 text-sm text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 border border-emerald-300 dark:border-emerald-600 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors font-medium">
                  Switch to Recruiter Login
                </Link>
              </div>
            </div>

            <div className="mt-6 text-center">
              <Link href="/" className="text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 transition-colors">
                ← Back to home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
