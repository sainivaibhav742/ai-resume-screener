"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import ProtectedRoute from "@/components/ProtectedRoute";
import { LayoutDashboard, Users, Briefcase, FileText, BarChart3, MessageSquare, Settings, Upload, Search, Download, CheckCircle, XCircle, Star } from "lucide-react";

const recruiterNavItems = [
  { name: "Dashboard", href: "/recruiter/dashboard", icon: LayoutDashboard },
  { name: "Job Postings", href: "/recruiter/jobs", icon: Briefcase },
  { name: "Candidates", href: "/recruiter/candidates", icon: Users },
  { name: "Screen Resumes", href: "/recruiter/screen", icon: FileText },
  { name: "Analytics", href: "/recruiter/analytics", icon: BarChart3 },
  { name: "Messages", href: "/recruiter/messages", icon: MessageSquare },
  { name: "Settings", href: "/recruiter/settings", icon: Settings },
];

export default function ScreenResumes() {
  const [resumes] = useState([
    {
      id: 1,
      candidateName: "John Doe",
      position: "Senior Full Stack Developer",
      matchScore: 92,
      skills: ["React", "Node.js", "TypeScript"],
      experience: "5 years",
      education: "BS Computer Science",
      screening: "Passed",
    },
    {
      id: 2,
      candidateName: "Jane Smith",
      position: "Backend Engineer",
      matchScore: 88,
      skills: ["Python", "Django", "PostgreSQL"],
      experience: "7 years",
      education: "MS Software Engineering",
      screening: "Passed",
    },
    {
      id: 3,
      candidateName: "Mike Johnson",
      position: "Frontend Developer",
      matchScore: 75,
      skills: ["React", "Next.js", "Tailwind"],
      experience: "3 years",
      education: "BS Information Technology",
      screening: "Under Review",
    },
  ]);

  return (
    <ProtectedRoute requireRole="recruiter">
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <Sidebar navItems={recruiterNavItems} themeColor="emerald" portalName="Recruiter Portal" />
        
        <div className="ml-64">
          <div className="p-8">
            {/* Header */}
            <div className="mb-8 flex justify-between items-center">
              <div>
                <h1 className="text-4xl font-bold text-slate-800 dark:text-slate-100 mb-2">
                  Screen Resumes
                </h1>
                <p className="text-slate-600 dark:text-slate-400">
                  AI-powered resume screening and analysis
                </p>
              </div>
              <button className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105">
                <Upload className="w-5 h-5" />
                Upload Resumes
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
                <div className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-1">
                  {resumes.length}
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-400">
                  Resumes Screened
                </div>
              </div>
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
                <div className="text-3xl font-bold text-emerald-600 mb-1">
                  {resumes.filter(r => r.screening === "Passed").length}
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-400">
                  Qualified
                </div>
              </div>
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
                <div className="text-3xl font-bold text-amber-600 mb-1">
                  {resumes.filter(r => r.screening === "Under Review").length}
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-400">
                  Under Review
                </div>
              </div>
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
                <div className="text-3xl font-bold text-blue-600 mb-1">
                  {Math.round(resumes.reduce((sum, r) => sum + r.matchScore, 0) / resumes.length)}%
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-400">
                  Avg Match Score
                </div>
              </div>
            </div>

            {/* Search */}
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search resumes..."
                  className="w-full pl-12 pr-4 py-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800 dark:text-slate-100"
                />
              </div>
            </div>

            {/* Resumes List */}
            <div className="grid gap-6">
              {resumes.map((resume) => (
                <div
                  key={resume.id}
                  className="bg-white dark:bg-slate-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex gap-4 flex-1">
                      <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center shadow-lg">
                        <FileText className="w-8 h-8 text-white" />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                            {resume.candidateName}
                          </h3>
                          {resume.screening === "Passed" ? (
                            <CheckCircle className="w-6 h-6 text-green-600" />
                          ) : (
                            <span className="px-3 py-1 bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300 rounded-full text-xs font-semibold">
                              {resume.screening}
                            </span>
                          )}
                        </div>
                        <p className="text-lg text-slate-600 dark:text-slate-400 mb-3">
                          {resume.position}
                        </p>
                        <div className="grid grid-cols-2 gap-4 text-sm text-slate-600 dark:text-slate-400 mb-3">
                          <div>
                            <span className="font-semibold">Experience:</span> {resume.experience}
                          </div>
                          <div>
                            <span className="font-semibold">Education:</span> {resume.education}
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {resume.skills.map((skill, index) => (
                            <span
                              key={index}
                              className="px-3 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 rounded-full text-sm font-medium"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-3">
                      <div className="text-right">
                        <div className="flex items-center gap-2 mb-1">
                          <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                          <span className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                            {resume.matchScore}%
                          </span>
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          Match Score
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
                    <button className="flex-1 px-4 py-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 font-semibold rounded-lg hover:bg-emerald-200 dark:hover:bg-emerald-900/50 transition-colors">
                      View Full Resume
                    </button>
                    <button className="px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-semibold rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors">
                      <Download className="w-4 h-4" />
                    </button>
                    <button className="px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 font-semibold rounded-lg hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors">
                      Accept
                    </button>
                    <button className="px-4 py-2 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 font-semibold rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors">
                      Reject
                    </button>
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
