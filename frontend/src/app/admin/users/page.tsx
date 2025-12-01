"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import ProtectedRoute from "@/components/ProtectedRoute";
import { LayoutDashboard, Users, Briefcase, FileText, BarChart3, Activity, Shield, Settings, Search, Edit, Trash2, UserCheck, UserX, Mail } from "lucide-react";

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

export default function AdminUsers() {
  const [users] = useState([
    { id: 1, name: "John Doe", email: "john@example.com", role: "candidate", status: "Active", joined: "2024-10-15", applications: 12 },
    { id: 2, name: "Jane Smith", email: "jane@example.com", role: "recruiter", status: "Active", joined: "2024-09-20", jobPostings: 8 },
    { id: 3, name: "Mike Johnson", email: "mike@example.com", role: "candidate", status: "Suspended", joined: "2024-11-01", applications: 3 },
    { id: 4, name: "Sarah Wilson", email: "sarah@example.com", role: "recruiter", status: "Active", joined: "2024-08-10", jobPostings: 15 },
  ]);

  return (
    <ProtectedRoute requireRole="admin">
      <div className="min-h-screen bg-gradient-to-br from-slate-100 via-rose-50 to-orange-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <Sidebar navItems={adminNavItems} themeColor="rose" portalName="Admin Portal" />
        
        <div className="ml-64">
          <div className="p-8">
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-slate-800 dark:text-slate-100 mb-2">Users Management</h1>
              <p className="text-slate-600 dark:text-slate-400">Manage all platform users</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
                <div className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-1">{users.length}</div>
                <div className="text-sm text-slate-600 dark:text-slate-400">Total Users</div>
              </div>
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
                <div className="text-3xl font-bold text-blue-600 mb-1">{users.filter(u => u.role === "candidate").length}</div>
                <div className="text-sm text-slate-600 dark:text-slate-400">Candidates</div>
              </div>
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
                <div className="text-3xl font-bold text-emerald-600 mb-1">{users.filter(u => u.role === "recruiter").length}</div>
                <div className="text-sm text-slate-600 dark:text-slate-400">Recruiters</div>
              </div>
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
                <div className="text-3xl font-bold text-green-600 mb-1">{users.filter(u => u.status === "Active").length}</div>
                <div className="text-sm text-slate-600 dark:text-slate-400">Active</div>
              </div>
            </div>

            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search users..."
                  className="w-full pl-12 pr-4 py-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-lg focus:outline-none focus:ring-2 focus:ring-rose-500 text-slate-800 dark:text-slate-100"
                />
              </div>
            </div>

            <div className="grid gap-6">
              {users.map((user) => (
                <div key={user.id} className="bg-white dark:bg-slate-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex gap-4 flex-1">
                      <div className="w-14 h-14 bg-gradient-to-br from-rose-500 to-orange-600 rounded-full flex items-center justify-center text-white text-xl font-bold shadow-lg">
                        {user.name.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-1">{user.name}</h3>
                        <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 mb-2">
                          <Mail className="w-4 h-4" />
                          <span>{user.email}</span>
                        </div>
                        <div className="flex gap-4 text-sm text-slate-600 dark:text-slate-400">
                          <span>Joined: {user.joined}</span>
                          <span>•</span>
                          <span className="capitalize">Role: {user.role}</span>
                          {user.applications && <><span>•</span><span>{user.applications} applications</span></>}
                          {user.jobPostings && <><span>•</span><span>{user.jobPostings} job postings</span></>}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-3">
                      <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
                        user.status === "Active" ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300" : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300"
                      }`}>
                        {user.status}
                      </span>
                      <div className="flex gap-2">
                        <button className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/30 rounded-lg transition-colors">
                          {user.status === "Active" ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                        </button>
                        <button className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
