"use client";

import Sidebar from "@/components/Sidebar";
import ProtectedRoute from "@/components/ProtectedRoute";
import { LayoutDashboard, Users, Briefcase, FileText, BarChart3, Activity, Shield, Settings, TrendingUp } from "lucide-react";

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

export default function AdminAnalytics() {
  return (
    <ProtectedRoute requireRole="admin">
      <div className="min-h-screen bg-gradient-to-br from-slate-100 via-rose-50 to-orange-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <Sidebar navItems={adminNavItems} themeColor="rose" portalName="Admin Portal" />
        
        <div className="ml-64">
          <div className="p-8">
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-slate-800 dark:text-slate-100 mb-2">Platform Analytics</h1>
              <p className="text-slate-600 dark:text-slate-400">Comprehensive platform metrics</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-2xl font-bold text-slate-800 dark:text-slate-100">1,245</div>
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-400 mb-1">Total Users</div>
                <div className="text-xs text-green-600 font-semibold">+15% this month</div>
              </div>
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-2xl font-bold text-slate-800 dark:text-slate-100">485</div>
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-400 mb-1">Active Jobs</div>
                <div className="text-xs text-green-600 font-semibold">+8% this month</div>
              </div>
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-2xl font-bold text-slate-800 dark:text-slate-100">3,567</div>
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-400 mb-1">Applications</div>
                <div className="text-xs text-green-600 font-semibold">+22% this month</div>
              </div>
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-2xl font-bold text-slate-800 dark:text-slate-100">98.5%</div>
                  <Activity className="w-6 h-6 text-green-600" />
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-400 mb-1">Uptime</div>
                <div className="text-xs text-green-600 font-semibold">Excellent</div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-4">User Growth</h3>
                <div className="h-64 flex items-end justify-around gap-2">
                  {[60, 72, 85, 78, 92, 88].map((height, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center">
                      <div className="w-full bg-gradient-to-t from-rose-600 to-orange-500 rounded-t-lg" style={{ height: `${height}%` }}></div>
                      <div className="text-xs text-slate-600 dark:text-slate-400 mt-2">
                        {["Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][i]}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-4">Application Trends</h3>
                <div className="h-64 flex items-end justify-around gap-2">
                  {[70, 85, 92, 88, 95, 90].map((height, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center">
                      <div className="w-full bg-gradient-to-t from-blue-600 to-indigo-500 rounded-t-lg" style={{ height: `${height}%` }}></div>
                      <div className="text-xs text-slate-600 dark:text-slate-400 mt-2">
                        {["Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][i]}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-4">Top Metrics</h3>
              <div className="space-y-4">
                {[
                  { label: "Avg Session Duration", value: "12m 34s", trend: "+5%" },
                  { label: "Application Success Rate", value: "42%", trend: "+8%" },
                  { label: "User Satisfaction", value: "4.7/5", trend: "+0.3" },
                  { label: "API Response Time", value: "145ms", trend: "-12ms" },
                ].map((metric, i) => (
                  <div key={i} className="flex justify-between items-center p-4 bg-slate-50 dark:bg-slate-900 rounded-lg">
                    <span className="font-semibold text-slate-800 dark:text-slate-100">{metric.label}</span>
                    <div className="flex items-center gap-4">
                      <span className="text-2xl font-bold text-slate-800 dark:text-slate-100">{metric.value}</span>
                      <span className="text-sm font-semibold text-green-600">{metric.trend}</span>
                    </div>
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
