"use client";

import Sidebar from "@/components/Sidebar";
import ProtectedRoute from "@/components/ProtectedRoute";
import { LayoutDashboard, Users, Briefcase, FileText as FileTextIcon, BarChart3, Activity, Shield, Settings, Download, Eye, Trash2 } from "lucide-react";

const adminNavItems = [
  { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { name: "Users", href: "/admin/users", icon: Users },
  { name: "Jobs", href: "/admin/jobs", icon: Briefcase },
  { name: "Resumes", href: "/admin/resumes", icon: FileTextIcon },
  { name: "Analytics", href: "/admin/analytics", icon: BarChart3 },
  { name: "System Health", href: "/admin/health", icon: Activity },
  { name: "Security", href: "/admin/security", icon: Shield },
  { name: "Settings", href: "/admin/settings", icon: Settings },
];

export default function AdminResumes() {
  const resumes = [
    { id: 1, candidateName: "John Doe", uploadDate: "2024-11-25", fileSize: "245 KB", jobApplied: "Senior Full Stack Developer", status: "Screened" },
    { id: 2, candidateName: "Jane Smith", uploadDate: "2024-11-22", fileSize: "198 KB", jobApplied: "Backend Engineer", status: "Pending" },
    { id: 3, candidateName: "Mike Johnson", uploadDate: "2024-11-20", fileSize: "220 KB", jobApplied: "Frontend Developer", status: "Screened" },
  ];

  return (
    <ProtectedRoute requireRole="admin">
      <div className="min-h-screen bg-gradient-to-br from-slate-100 via-rose-50 to-orange-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <Sidebar navItems={adminNavItems} themeColor="rose" portalName="Admin Portal" />
        
        <div className="ml-64">
          <div className="p-8">
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-slate-800 dark:text-slate-100 mb-2">Resumes Management</h1>
              <p className="text-slate-600 dark:text-slate-400">View and manage all resumes</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
                <div className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-1">{resumes.length}</div>
                <div className="text-sm text-slate-600 dark:text-slate-400">Total Resumes</div>
              </div>
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
                <div className="text-3xl font-bold text-emerald-600 mb-1">{resumes.filter(r => r.status === "Screened").length}</div>
                <div className="text-sm text-slate-600 dark:text-slate-400">Screened</div>
              </div>
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
                <div className="text-3xl font-bold text-amber-600 mb-1">{resumes.filter(r => r.status === "Pending").length}</div>
                <div className="text-sm text-slate-600 dark:text-slate-400">Pending</div>
              </div>
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
                <div className="text-3xl font-bold text-blue-600 mb-1">Today</div>
                <div className="text-sm text-slate-600 dark:text-slate-400">Latest Upload</div>
              </div>
            </div>

            <div className="grid gap-6">
              {resumes.map((resume) => (
                <div key={resume.id} className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex gap-4 flex-1">
                      <div className="w-14 h-14 bg-gradient-to-br from-rose-500 to-orange-600 rounded-lg flex items-center justify-center shadow-lg">
                        <FileTextIcon className="w-7 h-7 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-1">{resume.candidateName}</h3>
                        <p className="text-slate-600 dark:text-slate-400 mb-2">Applied for: {resume.jobApplied}</p>
                        <div className="flex gap-4 text-sm text-slate-600 dark:text-slate-400">
                          <span>Uploaded: {resume.uploadDate}</span>
                          <span>•</span>
                          <span>Size: {resume.fileSize}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-3">
                      <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
                        resume.status === "Screened" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
                      }`}>{resume.status}</span>
                      <div className="flex gap-2">
                        <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"><Eye className="w-4 h-4" /></button>
                        <button className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg"><Download className="w-4 h-4" /></button>
                        <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
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
