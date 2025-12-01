"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import ProtectedRoute from "@/components/ProtectedRoute";
import { FileText, LayoutDashboard, User, Settings, MessageSquare, Briefcase, Send, Building2, Calendar, Eye } from "lucide-react";

const candidateNavItems = [
  { name: "Dashboard", href: "/candidate/dashboard", icon: LayoutDashboard },
  { name: "My Resumes", href: "/candidate/resumes", icon: FileText },
  { name: "Browse Jobs", href: "/candidate/jobs", icon: Briefcase },
  { name: "Applications", href: "/candidate/applications", icon: Send },
  { name: "Profile", href: "/candidate/profile", icon: User },
  { name: "Messages", href: "/candidate/messages", icon: MessageSquare },
  { name: "Settings", href: "/candidate/settings", icon: Settings },
];

export default function Applications() {
  const [applications] = useState([
    {
      id: 1,
      jobTitle: "Senior Full Stack Developer",
      company: "Tech Solutions Inc.",
      appliedDate: "2024-11-25",
      status: "Under Review",
      statusColor: "blue",
    },
    {
      id: 2,
      jobTitle: "Backend Engineer",
      company: "CloudTech Corp",
      appliedDate: "2024-11-22",
      status: "Interview Scheduled",
      statusColor: "green",
    },
    {
      id: 3,
      jobTitle: "Frontend Developer",
      company: "Design Studio",
      appliedDate: "2024-11-18",
      status: "Rejected",
      statusColor: "red",
    },
    {
      id: 4,
      jobTitle: "DevOps Engineer",
      company: "Cloud Systems",
      appliedDate: "2024-11-15",
      status: "Pending",
      statusColor: "amber",
    },
  ]);

  const getStatusStyles = (color: string) => {
    const styles = {
      blue: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
      green: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
      red: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300",
      amber: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
    };
    return styles[color as keyof typeof styles] || styles.blue;
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <Sidebar navItems={candidateNavItems} themeColor="blue" portalName="Candidate Portal" />
        
        <div className="ml-64">
          <div className="p-8">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-slate-800 dark:text-slate-100 mb-2">
                My Applications
              </h1>
              <p className="text-slate-600 dark:text-slate-400">
                Track your job applications
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
                <div className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-1">
                  {applications.length}
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-400">
                  Total Applications
                </div>
              </div>
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
                <div className="text-3xl font-bold text-blue-600 mb-1">
                  {applications.filter(a => a.status === "Under Review").length}
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-400">
                  Under Review
                </div>
              </div>
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
                <div className="text-3xl font-bold text-green-600 mb-1">
                  {applications.filter(a => a.status === "Interview Scheduled").length}
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-400">
                  Interviews
                </div>
              </div>
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
                <div className="text-3xl font-bold text-amber-600 mb-1">
                  {applications.filter(a => a.status === "Pending").length}
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-400">
                  Pending
                </div>
              </div>
            </div>

            {/* Applications List */}
            <div className="grid gap-6">
              {applications.map((application) => (
                <div
                  key={application.id}
                  className="bg-white dark:bg-slate-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex gap-4 flex-1">
                      <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg">
                        <Briefcase className="w-7 h-7 text-white" />
                      </div>
                      
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2">
                          {application.jobTitle}
                        </h3>
                        <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 mb-3">
                          <Building2 className="w-4 h-4" />
                          <span className="font-semibold">{application.company}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                          <Calendar className="w-4 h-4" />
                          <span>Applied on {application.appliedDate}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-3">
                      <span
                        className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold ${getStatusStyles(application.statusColor)}`}
                      >
                        {application.status}
                      </span>
                      <button className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors">
                        <Eye className="w-4 h-4" />
                        View Details
                      </button>
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
