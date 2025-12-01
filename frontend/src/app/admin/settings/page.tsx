"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import ProtectedRoute from "@/components/ProtectedRoute";
import { LayoutDashboard, Users, Briefcase, FileText, BarChart3, Activity, Shield, Settings, Bell, Globe, Mail, Save } from "lucide-react";

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

export default function AdminSettings() {
  const [settings, setSettings] = useState({
    siteName: "AI Resume Screener",
    siteUrl: "https://ai-resume-screener.com",
    contactEmail: "admin@ai-resume-screener.com",
    allowRegistration: true,
    requireEmailVerification: true,
    enableNotifications: true,
  });

  return (
    <ProtectedRoute requireRole="admin">
      <div className="min-h-screen bg-gradient-to-br from-slate-100 via-rose-50 to-orange-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <Sidebar navItems={adminNavItems} themeColor="rose" portalName="Admin Portal" />
        
        <div className="ml-64">
          <div className="p-8 max-w-4xl">
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-slate-800 dark:text-slate-100 mb-2">Admin Settings</h1>
              <p className="text-slate-600 dark:text-slate-400">Configure platform settings</p>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 mb-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-rose-500 to-orange-600 rounded-lg flex items-center justify-center">
                  <Globe className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">General Settings</h2>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Basic platform configuration</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Site Name
                  </label>
                  <input
                    type="text"
                    value={settings.siteName}
                    onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 text-slate-800 dark:text-slate-100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Site URL
                  </label>
                  <input
                    type="url"
                    value={settings.siteUrl}
                    onChange={(e) => setSettings({ ...settings, siteUrl: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 text-slate-800 dark:text-slate-100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    <Mail className="inline w-4 h-4 mr-1" />
                    Contact Email
                  </label>
                  <input
                    type="email"
                    value={settings.contactEmail}
                    onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 text-slate-800 dark:text-slate-100"
                  />
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 mb-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center">
                  <Settings className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Platform Settings</h2>
                  <p className="text-sm text-slate-600 dark:text-slate-400">User registration and access</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900 rounded-lg">
                  <div>
                    <h3 className="font-semibold text-slate-800 dark:text-slate-100">Allow User Registration</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Enable new user signups</p>
                  </div>
                  <button
                    onClick={() => setSettings({ ...settings, allowRegistration: !settings.allowRegistration })}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      settings.allowRegistration ? "bg-rose-600" : "bg-slate-300 dark:bg-slate-600"
                    }`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      settings.allowRegistration ? "translate-x-6" : "translate-x-1"
                    }`} />
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900 rounded-lg">
                  <div>
                    <h3 className="font-semibold text-slate-800 dark:text-slate-100">Email Verification Required</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Users must verify email to login</p>
                  </div>
                  <button
                    onClick={() => setSettings({ ...settings, requireEmailVerification: !settings.requireEmailVerification })}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      settings.requireEmailVerification ? "bg-rose-600" : "bg-slate-300 dark:bg-slate-600"
                    }`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      settings.requireEmailVerification ? "translate-x-6" : "translate-x-1"
                    }`} />
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900 rounded-lg">
                  <div>
                    <h3 className="font-semibold text-slate-800 dark:text-slate-100">System Notifications</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Enable platform-wide notifications</p>
                  </div>
                  <button
                    onClick={() => setSettings({ ...settings, enableNotifications: !settings.enableNotifications })}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      settings.enableNotifications ? "bg-rose-600" : "bg-slate-300 dark:bg-slate-600"
                    }`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      settings.enableNotifications ? "translate-x-6" : "translate-x-1"
                    }`} />
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <button className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-rose-600 to-orange-600 hover:from-rose-700 hover:to-orange-700 text-white font-semibold rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105">
                <Save className="w-5 h-5" />
                Save All Settings
              </button>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
