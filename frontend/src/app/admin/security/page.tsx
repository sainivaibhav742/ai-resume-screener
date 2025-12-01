"use client";

import Sidebar from "@/components/Sidebar";
import ProtectedRoute from "@/components/ProtectedRoute";
import { LayoutDashboard, Users, Briefcase, FileText, BarChart3, Activity, Shield, Settings, Lock, Key, AlertTriangle, CheckCircle, Eye } from "lucide-react";

const adminNavItems = [
  { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { name: "Users", href: "/admin/users", icon: Users },
  { name: "Jobs", href: "/admin/jobs", icon: Briefcase },
  { name: "Resumes", href: "/admin/resumes", icon: FileText },
  { name: "Analytics", href: "/admin/analytics", icon: BarChart3 },
  { name: "System Health", href: "/admin/health", icon: Activity },
  { name: "Security", href: "/admin/security", icon: Shield },
  { name: "Settings", href: "/admin/settings", icon: Settings },
];

export default function Security() {
  return (
    <ProtectedRoute requireRole="admin">
      <div className="min-h-screen bg-gradient-to-br from-slate-100 via-rose-50 to-orange-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <Sidebar navItems={adminNavItems} themeColor="rose" portalName="Admin Portal" />
        
        <div className="ml-64">
          <div className="p-8">
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-slate-800 dark:text-slate-100 mb-2">Security</h1>
              <p className="text-slate-600 dark:text-slate-400">Monitor and manage platform security</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-3">
                  <Shield className="w-8 h-8 text-green-600" />
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <div className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-1">Secure</div>
                <div className="text-sm text-slate-600 dark:text-slate-400">Security Status</div>
              </div>

              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-3">
                  <AlertTriangle className="w-8 h-8 text-amber-600" />
                  <span className="text-xl font-bold text-amber-600">2</span>
                </div>
                <div className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-1">Warnings</div>
                <div className="text-sm text-slate-600 dark:text-slate-400">Security Alerts</div>
              </div>

              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-3">
                  <Lock className="w-8 h-8 text-blue-600" />
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <div className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-1">Enabled</div>
                <div className="text-sm text-slate-600 dark:text-slate-400">2FA Status</div>
              </div>

              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-3">
                  <Key className="w-8 h-8 text-purple-600" />
                  <span className="text-xl font-bold text-purple-600">15</span>
                </div>
                <div className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-1">Active</div>
                <div className="text-sm text-slate-600 dark:text-slate-400">API Keys</div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-4">Recent Security Events</h3>
                <div className="space-y-4">
                  {[
                    { event: "Failed login attempt", user: "john@example.com", time: "10 mins ago", severity: "warning" },
                    { event: "Password changed", user: "jane@example.com", time: "2 hours ago", severity: "info" },
                    { event: "New API key created", user: "admin@system", time: "5 hours ago", severity: "info" },
                    { event: "Multiple failed logins", user: "unknown@example.com", time: "1 day ago", severity: "error" },
                  ].map((event, i) => (
                    <div key={i} className="p-4 bg-slate-50 dark:bg-slate-900 rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-semibold text-slate-800 dark:text-slate-100">{event.event}</span>
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${
                          event.severity === "error" ? "bg-red-100 text-red-700" :
                          event.severity === "warning" ? "bg-amber-100 text-amber-700" :
                          "bg-blue-100 text-blue-700"
                        }`}>{event.severity}</span>
                      </div>
                      <div className="flex justify-between text-sm text-slate-600 dark:text-slate-400">
                        <span>{event.user}</span>
                        <span>{event.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-4">Security Settings</h3>
                <div className="space-y-4">
                  {[
                    { name: "Two-Factor Authentication", status: "Enabled", desc: "Require 2FA for admin accounts" },
                    { name: "Password Policy", status: "Strong", desc: "Enforce strong password requirements" },
                    { name: "Session Timeout", status: "30 minutes", desc: "Automatic logout after inactivity" },
                    { name: "IP Whitelisting", status: "Disabled", desc: "Restrict access by IP address" },
                  ].map((setting, i) => (
                    <div key={i} className="p-4 bg-slate-50 dark:bg-slate-900 rounded-lg">
                      <div className="flex justify-between items-start mb-1">
                        <span className="font-semibold text-slate-800 dark:text-slate-100">{setting.name}</span>
                        <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">Edit</button>
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">{setting.desc}</p>
                      <span className="text-sm font-semibold text-green-600">{setting.status}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-4">Access Logs (Last 24 Hours)</h3>
              <div className="space-y-3">
                {[
                  { action: "Admin Login", user: "admin@system", ip: "192.168.1.1", time: "12:34 PM", status: "Success" },
                  { action: "User Created", user: "admin@system", ip: "192.168.1.1", time: "11:22 AM", status: "Success" },
                  { action: "Login Attempt", user: "unknown", ip: "203.45.67.89", time: "10:15 AM", status: "Failed" },
                  { action: "Settings Updated", user: "admin@system", ip: "192.168.1.1", time: "09:45 AM", status: "Success" },
                ].map((log, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900 rounded-lg text-sm">
                    <div className="flex gap-6 flex-1">
                      <span className="font-semibold text-slate-800 dark:text-slate-100 w-32">{log.action}</span>
                      <span className="text-slate-600 dark:text-slate-400 w-48">{log.user}</span>
                      <span className="text-slate-600 dark:text-slate-400 w-32">{log.ip}</span>
                      <span className="text-slate-500 dark:text-slate-400">{log.time}</span>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      log.status === "Success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                    }`}>{log.status}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
