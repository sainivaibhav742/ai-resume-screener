"use client";

import Sidebar from "@/components/Sidebar";
import ProtectedRoute from "@/components/ProtectedRoute";
import { LayoutDashboard, Users, Briefcase, FileText, BarChart3, Activity, Shield, Settings, Cpu, HardDrive, Zap, Database, CheckCircle, AlertCircle } from "lucide-react";

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

export default function SystemHealth() {
  return (
    <ProtectedRoute requireRole="admin">
      <div className="min-h-screen bg-gradient-to-br from-slate-100 via-rose-50 to-orange-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <Sidebar navItems={adminNavItems} themeColor="rose" portalName="Admin Portal" />
        
        <div className="ml-64">
          <div className="p-8">
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-slate-800 dark:text-slate-100 mb-2">System Health</h1>
              <p className="text-slate-600 dark:text-slate-400">Monitor system performance and status</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-3">
                  <Cpu className="w-8 h-8 text-blue-600" />
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <div className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-1">45%</div>
                <div className="text-sm text-slate-600 dark:text-slate-400">CPU Usage</div>
                <div className="mt-2 w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: "45%" }}></div>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-3">
                  <HardDrive className="w-8 h-8 text-emerald-600" />
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <div className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-1">62%</div>
                <div className="text-sm text-slate-600 dark:text-slate-400">Memory Usage</div>
                <div className="mt-2 w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                  <div className="bg-emerald-600 h-2 rounded-full" style={{ width: "62%" }}></div>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-3">
                  <Database className="w-8 h-8 text-purple-600" />
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <div className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-1">35%</div>
                <div className="text-sm text-slate-600 dark:text-slate-400">Disk Usage</div>
                <div className="mt-2 w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                  <div className="bg-purple-600 h-2 rounded-full" style={{ width: "35%" }}></div>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-3">
                  <Zap className="w-8 h-8 text-amber-600" />
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <div className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-1">145ms</div>
                <div className="text-sm text-slate-600 dark:text-slate-400">Avg Response</div>
                <div className="mt-2 text-xs text-green-600 font-semibold">Excellent</div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-4">Services Status</h3>
                <div className="space-y-4">
                  {[
                    { name: "Web Server", status: "Operational", color: "green" },
                    { name: "Database", status: "Operational", color: "green" },
                    { name: "API Gateway", status: "Operational", color: "green" },
                    { name: "Email Service", status: "Operational", color: "green" },
                    { name: "File Storage", status: "Operational", color: "green" },
                  ].map((service, i) => (
                    <div key={i} className="flex justify-between items-center p-4 bg-slate-50 dark:bg-slate-900 rounded-lg">
                      <div className="flex items-center gap-3">
                        <CheckCircle className={`w-5 h-5 text-${service.color}-600`} />
                        <span className="font-semibold text-slate-800 dark:text-slate-100">{service.name}</span>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold bg-${service.color}-100 text-${service.color}-700`}>
                        {service.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-4">Recent Alerts</h3>
                <div className="space-y-4">
                  {[
                    { type: "Info", message: "System backup completed", time: "2 hours ago", color: "blue" },
                    { type: "Warning", message: "High memory usage detected", time: "5 hours ago", color: "amber" },
                    { type: "Success", message: "Database optimization completed", time: "1 day ago", color: "green" },
                  ].map((alert, i) => (
                    <div key={i} className="p-4 bg-slate-50 dark:bg-slate-900 rounded-lg">
                      <div className="flex items-start gap-3">
                        <AlertCircle className={`w-5 h-5 text-${alert.color}-600 flex-shrink-0 mt-0.5`} />
                        <div className="flex-1">
                          <div className="flex justify-between items-start mb-1">
                            <span className={`font-semibold text-${alert.color}-600`}>{alert.type}</span>
                            <span className="text-xs text-slate-500">{alert.time}</span>
                          </div>
                          <p className="text-sm text-slate-600 dark:text-slate-400">{alert.message}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-4">System Metrics (Last 24 Hours)</h3>
              <div className="h-48 flex items-end justify-around gap-2">
                {[75, 82, 78, 85, 88, 92, 87, 90, 85, 88, 92, 89].map((height, i) => (
                  <div key={i} className="flex-1">
                    <div className="w-full bg-gradient-to-t from-rose-600 to-orange-500 rounded-t" style={{ height: `${height}%` }}></div>
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
