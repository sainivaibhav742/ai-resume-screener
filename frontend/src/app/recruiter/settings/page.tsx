"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import ProtectedRoute from "@/components/ProtectedRoute";
import { LayoutDashboard, Users, Briefcase, FileText, BarChart3, MessageSquare, Settings, Bell, Lock, Save } from "lucide-react";

const recruiterNavItems = [
  { name: "Dashboard", href: "/recruiter/dashboard", icon: LayoutDashboard },
  { name: "Job Postings", href: "/recruiter/jobs", icon: Briefcase },
  { name: "Candidates", href: "/recruiter/candidates", icon: Users },
  { name: "Screen Resumes", href: "/recruiter/screen", icon: FileText },
  { name: "Analytics", href: "/recruiter/analytics", icon: BarChart3 },
  { name: "Messages", href: "/recruiter/messages", icon: MessageSquare },
  { name: "Settings", href: "/recruiter/settings", icon: Settings },
];

export default function RecruiterSettings() {
  const [notifications, setNotifications] = useState({
    newApplications: true,
    candidateMessages: true,
    interviewReminders: true,
    systemUpdates: false,
  });

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <Sidebar navItems={recruiterNavItems} themeColor="emerald" portalName="Recruiter Portal" />
        
        <div className="ml-64">
          <div className="p-8 max-w-4xl">
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-slate-800 dark:text-slate-100 mb-2">Settings</h1>
              <p className="text-slate-600 dark:text-slate-400">Manage your recruiter account preferences</p>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 mb-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
                  <Bell className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Notifications</h2>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Manage notification preferences</p>
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
                        {key === "newApplications" && "Get notified when candidates apply"}
                        {key === "candidateMessages" && "New messages from candidates"}
                        {key === "interviewReminders" && "Upcoming interview notifications"}
                        {key === "systemUpdates" && "Platform updates and announcements"}
                      </p>
                    </div>
                    <button
                      onClick={() => setNotifications({ ...notifications, [key]: !value })}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        value ? "bg-emerald-600" : "bg-slate-300 dark:bg-slate-600"
                      }`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        value ? "translate-x-6" : "translate-x-1"
                      }`} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-lg flex items-center justify-center">
                  <Lock className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Security</h2>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Password and security settings</p>
                </div>
              </div>

              <div className="space-y-4">
                <button className="w-full p-4 bg-slate-50 dark:bg-slate-900 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-left">
                  <h3 className="font-semibold text-slate-800 dark:text-slate-100 mb-1">Change Password</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Update your password regularly</p>
                </button>

                <button className="w-full p-4 bg-slate-50 dark:bg-slate-900 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-left">
                  <h3 className="font-semibold text-slate-800 dark:text-slate-100 mb-1">Two-Factor Authentication</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Extra security for your account</p>
                </button>
              </div>
            </div>

            <div className="mt-8">
              <button className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105">
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
