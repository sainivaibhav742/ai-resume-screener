"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import ProtectedRoute from "@/components/ProtectedRoute";
import { LayoutDashboard, Users, Briefcase, FileText, BarChart3, Activity, Shield, Settings, MapPin, Clock, DollarSign, Edit, Trash2, Eye } from "lucide-react";

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

export default function AdminJobs() {
  const [jobs] = useState([
    { id: 1, title: "Senior Full Stack Developer", company: "Tech Solutions Inc.", location: "San Francisco", type: "Full-time", salary: "$120k-$180k", posted: "2024-11-20", applicants: 45, status: "Active" },
    { id: 2, title: "Backend Engineer", company: "CloudTech Corp", location: "Remote", type: "Full-time", salary: "$100k-$150k", posted: "2024-11-18", applicants: 32, status: "Active" },
    { id: 3, title: "Frontend Developer", company: "Design Studio", location: "New York", type: "Contract", salary: "$80k-$120k", posted: "2024-11-15", applicants: 28, status: "Closed" },
  ]);

  return (
    <ProtectedRoute requireRole="admin">
      <div className="min-h-screen bg-gradient-to-br from-slate-100 via-rose-50 to-orange-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <Sidebar navItems={adminNavItems} themeColor="rose" portalName="Admin Portal" />
        
        <div className="ml-64">
          <div className="p-8">
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-slate-800 dark:text-slate-100 mb-2">Jobs Management</h1>
              <p className="text-slate-600 dark:text-slate-400">Monitor and manage all job postings</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
                <div className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-1">{jobs.length}</div>
                <div className="text-sm text-slate-600 dark:text-slate-400">Total Jobs</div>
              </div>
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
                <div className="text-3xl font-bold text-emerald-600 mb-1">{jobs.filter(j => j.status === "Active").length}</div>
                <div className="text-sm text-slate-600 dark:text-slate-400">Active</div>
              </div>
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
                <div className="text-3xl font-bold text-blue-600 mb-1">{jobs.reduce((sum, j) => sum + j.applicants, 0)}</div>
                <div className="text-sm text-slate-600 dark:text-slate-400">Total Applications</div>
              </div>
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
                <div className="text-3xl font-bold text-slate-600 mb-1">{jobs.filter(j => j.status === "Closed").length}</div>
                <div className="text-sm text-slate-600 dark:text-slate-400">Closed</div>
              </div>
            </div>

            <div className="grid gap-6">
              {jobs.map((job) => (
                <div key={job.id} className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
                  <div className="flex justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100">{job.title}</h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          job.status === "Active" ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-700"
                        }`}>{job.status}</span>
                      </div>
                      <p className="text-slate-600 dark:text-slate-400 mb-3">{job.company}</p>
                      <div className="flex flex-wrap gap-4 text-sm text-slate-600 dark:text-slate-400">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          <span>{job.location}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>{job.type}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <DollarSign className="w-4 h-4" />
                          <span>{job.salary}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          <span>{job.applicants} applicants</span>
                        </div>
                      </div>
                      <p className="text-sm text-slate-500 mt-3">Posted on {job.posted}</p>
                    </div>
                    <div className="flex gap-2">
                      <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"><Eye className="w-5 h-5" /></button>
                      <button className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg"><Edit className="w-5 h-5" /></button>
                      <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg"><Trash2 className="w-5 h-5" /></button>
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
