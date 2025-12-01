"use client";

import { useState } from "react";
import { Shield, Mail, Lock, ArrowRight, Eye, EyeOff, Server, Database, Activity } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

export default function AdminLoginPage() {
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
      {/* Animated background grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px]"></div>
      
      {/* Glowing orbs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-rose-500/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-orange-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Logo with Shield */}
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center gap-3 mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-rose-500 to-orange-500 rounded-xl blur-lg opacity-75"></div>
                <div className="relative p-3 bg-gradient-to-br from-rose-500 to-orange-500 rounded-xl">
                  <Shield className="w-10 h-10 text-white" />
                </div>
              </div>
              <span className="text-2xl font-bold text-white">
                Smart Hiring OS
              </span>
            </Link>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-rose-500/10 border border-rose-500/30 text-rose-400 rounded-full text-sm font-medium backdrop-blur-sm">
              <Shield className="w-4 h-4" />
              Administrative Access
            </div>
          </div>

          {/* Login Card */}
          <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-slate-700/50">
            {/* Header */}
            <div className="mb-8 text-center">
              <h2 className="text-3xl font-bold text-white mb-2">
                Admin Portal
              </h2>
              <p className="text-slate-400">
                Secure access to system administration
              </p>
            </div>

            {/* Security Notice */}
            <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/30 rounded-lg">
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-rose-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-rose-300 font-medium mb-1">Restricted Area</p>
                  <p className="text-xs text-slate-400">
                    This portal is restricted to authorized administrators only. All access attempts are logged.
                  </p>
                </div>
              </div>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                <p className="text-sm text-red-400">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Administrator Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-500" />
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full pl-11 pr-4 py-3 bg-slate-900/50 border border-slate-600 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all text-white placeholder-slate-500"
                    placeholder="admin@company.com"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-500" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full pl-11 pr-12 py-3 bg-slate-900/50 border border-slate-600 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all text-white placeholder-slate-500"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-500 hover:text-slate-300"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Remember */}
              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input type="checkbox" className="w-4 h-4 text-rose-600 bg-slate-900 border-slate-600 rounded focus:ring-rose-500" />
                  <span className="ml-2 text-sm text-slate-400">Remember this device</span>
                </label>
                <Link href="/forgot-password" className="text-sm font-medium text-rose-400 hover:text-rose-300">
                  Reset password
                </Link>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-6 bg-gradient-to-r from-rose-600 to-orange-600 hover:from-rose-700 hover:to-orange-700 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Authenticating...
                  </>
                ) : (
                  <>
                    <Shield className="w-5 h-5" />
                    Access Admin Dashboard
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>

            {/* System Status */}
            <div className="mt-8 pt-6 border-t border-slate-700">
              <p className="text-xs text-slate-500 mb-3 text-center">System Status</p>
              <div className="grid grid-cols-3 gap-3">
                <div className="text-center p-3 bg-slate-900/50 rounded-lg border border-slate-700">
                  <Server className="w-5 h-5 text-green-400 mx-auto mb-1" />
                  <div className="text-xs text-slate-400">API</div>
                  <div className="text-xs font-medium text-green-400">Online</div>
                </div>
                <div className="text-center p-3 bg-slate-900/50 rounded-lg border border-slate-700">
                  <Database className="w-5 h-5 text-green-400 mx-auto mb-1" />
                  <div className="text-xs text-slate-400">Database</div>
                  <div className="text-xs font-medium text-green-400">Active</div>
                </div>
                <div className="text-center p-3 bg-slate-900/50 rounded-lg border border-slate-700">
                  <Activity className="w-5 h-5 text-green-400 mx-auto mb-1" />
                  <div className="text-xs text-slate-400">Services</div>
                  <div className="text-xs font-medium text-green-400">Running</div>
                </div>
              </div>
            </div>

            {/* Other Login Options */}
            <div className="mt-6 pt-6 border-t border-slate-700">
              <p className="text-xs text-center text-slate-500 mb-3">Not an administrator?</p>
              <div className="flex gap-3">
                <Link href="/candidate-login" className="flex-1 text-center py-2 text-sm text-slate-400 hover:text-white border border-slate-700 rounded-lg hover:bg-slate-700/50 transition-colors">
                  Candidate Portal
                </Link>
                <Link href="/recruiter-login" className="flex-1 text-center py-2 text-sm text-slate-400 hover:text-white border border-slate-700 rounded-lg hover:bg-slate-700/50 transition-colors">
                  Recruiter Portal
                </Link>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-6 text-center space-y-2">
            <Link href="/" className="text-sm text-slate-500 hover:text-slate-300 transition-colors block">
              ← Back to home
            </Link>
            <p className="text-xs text-slate-600">
              © 2025 Smart Hiring OS. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
