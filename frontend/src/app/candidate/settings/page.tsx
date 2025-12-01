"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import ProtectedRoute from "@/components/ProtectedRoute";
import { FileText, LayoutDashboard, User, Settings, MessageSquare, Briefcase, Send, Bell, Lock, Eye, Mail, Save } from "lucide-react";

const candidateNavItems = [
  { name: "Dashboard", href: "/candidate/dashboard", icon: LayoutDashboard },
  { name: "My Resumes", href: "/candidate/resumes", icon: FileText },
  { name: "Browse Jobs", href: "/candidate/jobs", icon: Briefcase },
  { name: "Applications", href: "/candidate/applications", icon: Send },
  { name: "Profile", href: "/candidate/profile", icon: User },
  { name: "Messages", href: "/candidate/messages", icon: MessageSquare },
  { name: "Settings", href: "/candidate/settings", icon: Settings },
];

export default function CandidateSettings() {
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    jobAlerts: true,
    applicationUpdates: true,
    messages: true,
  });

  const [privacy, setPrivacy] = useState({
    profileVisibility: "public",
    showEmail: false,
    showPhone: false,
  });

  return (
    <ProtectedRoute requireRole="candidate">
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <Sidebar navItems={candidateNavItems} themeColor="blue" portalName="Candidate Portal" />
        
        <div className="ml-64">
          <div className="p-8 max-w-4xl">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-slate-800 dark:text-slate-100 mb-2">
                Settings
              </h1>
              <p className="text-slate-600 dark:text-slate-400">
                Manage your account preferences
              </p>
            </div>

            {/* Notifications */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 mb-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                  <Bell className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                    Notifications
                  </h2>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Manage how you receive notifications
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {Object.entries(notifications).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900 rounded-lg">
                    <div>
                      <h3 className="font-semibold text-slate-800 dark:text-slate-100 capitalize">
                        {key.replace(/([A-Z])/g, " $1").trim()}
                      </h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        {key === "emailNotifications" && "Receive email notifications for important updates"}
                        {key === "jobAlerts" && "Get notified about new job opportunities"}
                        {key === "applicationUpdates" && "Updates on your job applications"}
                        {key === "messages" && "Notifications for new messages"}
                      </p>
                    </div>
                    <button
                      onClick={() => setNotifications({ ...notifications, [key]: !value })}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        value ? "bg-blue-600" : "bg-slate-300 dark:bg-slate-600"
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          value ? "translate-x-6" : "translate-x-1"
                        }`}
                      />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Privacy */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 mb-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Eye className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                    Privacy
                  </h2>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Control your profile visibility
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-lg">
                  <h3 className="font-semibold text-slate-800 dark:text-slate-100 mb-3">
                    Profile Visibility
                  </h3>
                  <select
                    value={privacy.profileVisibility}
                    onChange={(e) => setPrivacy({ ...privacy, profileVisibility: e.target.value })}
                    className="w-full px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 dark:text-slate-100"
                  >
                    <option value="public">Public - Visible to all recruiters</option>
                    <option value="private">Private - Only visible when you apply</option>
                    <option value="hidden">Hidden - Not searchable</option>
                  </select>
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900 rounded-lg">
                  <div>
                    <h3 className="font-semibold text-slate-800 dark:text-slate-100">
                      Show Email Address
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Allow recruiters to see your email
                    </p>
                  </div>
                  <button
                    onClick={() => setPrivacy({ ...privacy, showEmail: !privacy.showEmail })}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      privacy.showEmail ? "bg-blue-600" : "bg-slate-300 dark:bg-slate-600"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        privacy.showEmail ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900 rounded-lg">
                  <div>
                    <h3 className="font-semibold text-slate-800 dark:text-slate-100">
                      Show Phone Number
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Allow recruiters to see your phone
                    </p>
                  </div>
                  <button
                    onClick={() => setPrivacy({ ...privacy, showPhone: !privacy.showPhone })}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      privacy.showPhone ? "bg-blue-600" : "bg-slate-300 dark:bg-slate-600"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        privacy.showPhone ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>

            {/* Security */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
                  <Lock className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                    Security
                  </h2>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Manage your password and security settings
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <button className="w-full p-4 bg-slate-50 dark:bg-slate-900 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-left">
                  <h3 className="font-semibold text-slate-800 dark:text-slate-100 mb-1">
                    Change Password
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Update your password regularly for security
                  </p>
                </button>

                <button className="w-full p-4 bg-slate-50 dark:bg-slate-900 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-left">
                  <h3 className="font-semibold text-slate-800 dark:text-slate-100 mb-1">
                    Two-Factor Authentication
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Add an extra layer of security to your account
                  </p>
                </button>
              </div>
            </div>

            {/* Save Button */}
            <div className="mt-8">
              <button className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105">
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
