"use client";

import Sidebar from "@/components/Sidebar";
import ProtectedRoute from "@/components/ProtectedRoute";
import { LayoutDashboard, Users, Briefcase, FileText, BarChart3, MessageSquare, Settings, TrendingUp, TrendingDown } from "lucide-react";

const recruiterNavItems = [
  { name: "Dashboard", href: "/recruiter/dashboard", icon: LayoutDashboard },
  { name: "Job Postings", href: "/recruiter/jobs", icon: Briefcase },
  { name: "Candidates", href: "/recruiter/candidates", icon: Users },
  { name: "Screen Resumes", href: "/recruiter/screen", icon: FileText },
  { name: "Analytics", href: "/recruiter/analytics", icon: BarChart3 },
  { name: "Messages", href: "/recruiter/messages", icon: MessageSquare },
  { name: "Settings", href: "/recruiter/settings", icon: Settings },
];

export default function Analytics() {
  return (
    <ProtectedRoute requireRole="recruiter">
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <Sidebar navItems={recruiterNavItems} themeColor="emerald" portalName="Recruiter Portal" />
        
        <div className="ml-64">
          <div className="p-8">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-slate-800 dark:text-slate-100 mb-2">
                Analytics
              </h1>
              <p className="text-slate-600 dark:text-slate-400">
                Track your recruitment performance
              </p>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                    245
                  </div>
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-400 mb-1">
                  Total Applications
                </div>
                <div className="text-xs text-green-600 font-semibold">
                  +12% from last month
                </div>
              </div>

              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                    42
                  </div>
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-400 mb-1">
                  Interviews Scheduled
                </div>
                <div className="text-xs text-green-600 font-semibold">
                  +8% from last month
                </div>
              </div>

              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                    18
                  </div>
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-400 mb-1">
                  Offers Made
                </div>
                <div className="text-xs text-green-600 font-semibold">
                  +15% from last month
                </div>
              </div>

              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                    12 days
                  </div>
                  <TrendingDown className="w-6 h-6 text-emerald-600" />
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-400 mb-1">
                  Avg. Time to Hire
                </div>
                <div className="text-xs text-emerald-600 font-semibold">
                  -3 days improved
                </div>
              </div>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-4">
                  Applications by Month
                </h3>
                <div className="h-64 flex items-end justify-around gap-2">
                  {[65, 75, 85, 70, 95, 88].map((height, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center">
                      <div
                        className="w-full bg-gradient-to-t from-emerald-600 to-teal-500 rounded-t-lg"
                        style={{ height: `${height}%` }}
                      ></div>
                      <div className="text-xs text-slate-600 dark:text-slate-400 mt-2">
                        {["Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][i]}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-4">
                  Top Performing Jobs
                </h3>
                <div className="space-y-4">
                  {[
                    { job: "Senior Full Stack Developer", apps: 45 },
                    { job: "Backend Engineer", apps: 32 },
                    { job: "Frontend Developer", apps: 28 },
                    { job: "DevOps Engineer", apps: 24 },
                    { job: "Data Scientist", apps: 20 },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="flex-1">
                        <div className="text-sm font-semibold text-slate-800 dark:text-slate-100 mb-1">
                          {item.job}
                        </div>
                        <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-emerald-600 to-teal-500 h-2 rounded-full"
                            style={{ width: `${(item.apps / 45) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                      <div className="text-sm font-bold text-slate-800 dark:text-slate-100">
                        {item.apps}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Source & Conversion */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-4">
                  Application Sources
                </h3>
                <div className="space-y-4">
                  {[
                    { source: "Direct Applications", percent: 45, color: "emerald" },
                    { source: "LinkedIn", percent: 30, color: "blue" },
                    { source: "Job Boards", percent: 15, color: "purple" },
                    { source: "Referrals", percent: 10, color: "amber" },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="flex-1">
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                            {item.source}
                          </span>
                          <span className="text-sm font-bold text-slate-600 dark:text-slate-400">
                            {item.percent}%
                          </span>
                        </div>
                        <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                          <div
                            className={`bg-${item.color}-600 h-2 rounded-full`}
                            style={{ width: `${item.percent}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-4">
                  Conversion Funnel
                </h3>
                <div className="space-y-4">
                  {[
                    { stage: "Applications Received", count: 245, percent: 100 },
                    { stage: "Screening Passed", count: 98, percent: 40 },
                    { stage: "Interviews Conducted", count: 42, percent: 17 },
                    { stage: "Offers Made", count: 18, percent: 7 },
                    { stage: "Offers Accepted", count: 12, percent: 5 },
                  ].map((item, i) => (
                    <div key={i}>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                          {item.stage}
                        </span>
                        <span className="text-sm font-bold text-slate-600 dark:text-slate-400">
                          {item.count}
                        </span>
                      </div>
                      <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-emerald-600 to-teal-500 h-2 rounded-full"
                          style={{ width: `${item.percent}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
