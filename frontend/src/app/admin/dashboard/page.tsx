"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Sidebar from "@/components/Sidebar";
import {
  Users,
  Briefcase,
  FileText,
  Shield,
  TrendingUp,
  Activity,
  Database,
  Settings,
  Eye,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Search,
  Filter,
  Download,
  RefreshCw,
  LayoutDashboard,
  BarChart3,
  Bell,
  Lock,
} from "lucide-react";
import Link from "next/link";

const adminNavItems = [
  { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { name: "Users", href: "/admin/users", icon: Users },
  { name: "Jobs", href: "/admin/jobs", icon: Briefcase },
  { name: "Resumes", href: "/admin/resumes", icon: FileText },
  { name: "Analytics", href: "/admin/analytics", icon: BarChart3 },
  { name: "System Health", href: "/admin/system", icon: Activity },
  { name: "Security", href: "/admin/security", icon: Lock },
  { name: "Settings", href: "/admin/settings", icon: Settings },
];

interface AdminStats {
  totalUsers: number;
  totalCandidates: number;
  totalRecruiters: number;
  totalJobs: number;
  totalResumes: number;
  totalApplications: number;
  activeUsers: number;
  pendingApprovals: number;
}

interface RecentUser {
  id: number;
  email: string;
  role: string;
  createdAt: string;
  status: string;
}

export default function AdminDashboard() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 1547,
    totalCandidates: 982,
    totalRecruiters: 565,
    totalJobs: 423,
    totalResumes: 3241,
    totalApplications: 8965,
    activeUsers: 1203,
    pendingApprovals: 47,
  });

  const [recentUsers] = useState<RecentUser[]>([
    {
      id: 1,
      email: "john.doe@example.com",
      role: "candidate",
      createdAt: "2 hours ago",
      status: "active",
    },
    {
      id: 2,
      email: "techcorp@company.com",
      role: "recruiter",
      createdAt: "5 hours ago",
      status: "active",
    },
    {
      id: 3,
      email: "jane.smith@example.com",
      role: "candidate",
      createdAt: "1 day ago",
      status: "pending",
    },
    {
      id: 4,
      email: "startup@company.com",
      role: "recruiter",
      createdAt: "1 day ago",
      status: "active",
    },
  ]);

  useEffect(() => {
    setTimeout(() => setLoading(false), 800);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-100 via-rose-50 to-orange-50 dark:from-slate-950 dark:via-slate-900 dark:to-rose-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-rose-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <ProtectedRoute requireRole="admin">
      <div className="flex min-h-screen bg-gradient-to-br from-slate-100 via-rose-50 to-orange-50 dark:from-slate-950 dark:via-slate-900 dark:to-rose-950">
        {/* Sidebar */}
        <Sidebar navItems={adminNavItems} themeColor="rose" portalName="Admin Portal" />

        {/* Main Content */}
        <div className="flex-1 overflow-x-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-gradient-to-br from-rose-500 to-orange-500 rounded-lg">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                    Admin Dashboard
                  </h1>
                </div>
                <p className="text-slate-600 dark:text-slate-400">
                  System overview and management • Logged in as {user?.email}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Link
                  href="/candidate/dashboard"
                className="px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-all text-sm font-medium"
              >
                👤 Candidate View
              </Link>
              <Link
                href="/recruiter/dashboard"
                className="px-4 py-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 rounded-lg hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-all text-sm font-medium"
              >
                💼 Recruiter View
              </Link>
              <button className="p-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-all">
                <RefreshCw className="w-5 h-5 text-slate-600 dark:text-slate-400" />
              </button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-lg p-6 border border-rose-100 dark:border-slate-700 hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <TrendingUp className="w-5 h-5 text-green-500" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
                {stats.totalUsers.toLocaleString()}
              </h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm">Total Users</p>
              <div className="mt-3 flex items-center gap-2 text-xs text-green-600 dark:text-green-400">
                <span className="font-medium">+12.5%</span>
                <span className="text-slate-500 dark:text-slate-400">vs last month</span>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-lg p-6 border border-rose-100 dark:border-slate-700 hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-lg">
                  <Briefcase className="w-6 h-6 text-white" />
                </div>
                <TrendingUp className="w-5 h-5 text-green-500" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
                {stats.totalJobs.toLocaleString()}
              </h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm">Active Jobs</p>
              <div className="mt-3 flex items-center gap-2 text-xs text-green-600 dark:text-green-400">
                <span className="font-medium">+8.3%</span>
                <span className="text-slate-500 dark:text-slate-400">vs last month</span>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-lg p-6 border border-rose-100 dark:border-slate-700 hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gradient-to-br from-amber-500 to-orange-500 rounded-lg">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <TrendingUp className="w-5 h-5 text-green-500" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
                {stats.totalResumes.toLocaleString()}
              </h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm">Resumes Processed</p>
              <div className="mt-3 flex items-center gap-2 text-xs text-green-600 dark:text-green-400">
                <span className="font-medium">+15.7%</span>
                <span className="text-slate-500 dark:text-slate-400">vs last month</span>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-lg p-6 border border-rose-100 dark:border-slate-700 hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gradient-to-br from-rose-500 to-pink-500 rounded-lg">
                  <Activity className="w-6 h-6 text-white" />
                </div>
                <Eye className="w-5 h-5 text-slate-400" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
                {stats.activeUsers.toLocaleString()}
              </h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm">Active Now</p>
              <div className="mt-3 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                <span>Real-time</span>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-lg p-6 border border-rose-100 dark:border-slate-700 hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-lg">
                  <Users className="w-6 h-6 text-white" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
                {stats.totalCandidates.toLocaleString()}
              </h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm">Total Candidates</p>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-lg p-6 border border-rose-100 dark:border-slate-700 hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg">
                  <Briefcase className="w-6 h-6 text-white" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
                {stats.totalRecruiters.toLocaleString()}
              </h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm">Total Recruiters</p>
            </div>

            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg rounded-xl shadow-lg p-6 border border-rose-100 dark:border-slate-700">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gradient-to-br from-green-400 to-emerald-400 rounded-lg">
                  <Database className="w-6 h-6 text-white" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
                {stats.totalApplications.toLocaleString()}
              </h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm">Applications</p>
            </div>

            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg rounded-xl shadow-lg p-6 border border-rose-100 dark:border-slate-700">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gradient-to-br from-orange-400 to-red-400 rounded-lg">
                  <AlertTriangle className="w-6 h-6 text-white" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
                {stats.pendingApprovals}
              </h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm">Pending Approvals</p>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Recent Users */}
            <div className="lg:col-span-2">
              <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg rounded-xl shadow-lg p-6 border border-rose-100 dark:border-slate-700">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                    Recent Users
                  </h2>
                  <div className="flex items-center gap-2">
                    <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
                      <Search className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                    </button>
                    <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
                      <Filter className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                    </button>
                    <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
                      <Download className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  {recentUsers.map((user) => (
                    <div
                      key={user.id}
                      className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-750 transition-colors"
                    >
                      <div className="flex items-center gap-4 flex-1">
                        <div className="w-10 h-10 bg-gradient-to-br from-rose-400 to-orange-400 rounded-full flex items-center justify-center text-white font-bold">
                          {user.email.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-slate-900 dark:text-white">
                            {user.email}
                          </h3>
                          <div className="flex items-center gap-3 mt-1">
                            <span
                              className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                                user.role === "candidate"
                                  ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400"
                                  : "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400"
                              }`}
                            >
                              {user.role}
                            </span>
                            <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                              <Clock className="w-3 h-3" />
                              {user.createdAt}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {user.status === "active" ? (
                          <span className="flex items-center gap-1 px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-xs font-medium">
                            <CheckCircle className="w-3 h-3" />
                            Active
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 px-3 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 rounded-full text-xs font-medium">
                            <Clock className="w-3 h-3" />
                            Pending
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="space-y-6">
              <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg rounded-xl shadow-lg p-6 border border-rose-100 dark:border-slate-700">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">
                  Quick Actions
                </h2>
                <div className="space-y-3">
                  <button className="w-full flex items-center gap-3 p-4 bg-gradient-to-r from-rose-50 to-orange-50 dark:from-rose-900/20 dark:to-orange-900/20 rounded-lg border border-rose-200 dark:border-rose-800 hover:shadow-md transition-shadow text-left">
                    <Users className="w-5 h-5 text-rose-600" />
                    <div className="flex-1">
                      <span className="font-medium text-slate-900 dark:text-white block">
                        Manage Users
                      </span>
                      <span className="text-xs text-slate-500 dark:text-slate-400">
                        View and edit user accounts
                      </span>
                    </div>
                  </button>

                  <button className="w-full flex items-center gap-3 p-4 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-lg border border-amber-200 dark:border-amber-800 hover:shadow-md transition-shadow text-left">
                    <Settings className="w-5 h-5 text-amber-600" />
                    <div className="flex-1">
                      <span className="font-medium text-slate-900 dark:text-white block">
                        System Settings
                      </span>
                      <span className="text-xs text-slate-500 dark:text-slate-400">
                        Configure platform settings
                      </span>
                    </div>
                  </button>

                  <button className="w-full flex items-center gap-3 p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg border border-green-200 dark:border-green-800 hover:shadow-md transition-shadow text-left">
                    <Database className="w-5 h-5 text-green-600" />
                    <div className="flex-1">
                      <span className="font-medium text-slate-900 dark:text-white block">
                        Database Backup
                      </span>
                      <span className="text-xs text-slate-500 dark:text-slate-400">
                        Backup and restore data
                      </span>
                    </div>
                  </button>

                  <button className="w-full flex items-center gap-3 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg border border-blue-200 dark:border-blue-800 hover:shadow-md transition-shadow text-left">
                    <Activity className="w-5 h-5 text-blue-600" />
                    <div className="flex-1">
                      <span className="font-medium text-slate-900 dark:text-white block">
                        View Logs
                      </span>
                      <span className="text-xs text-slate-500 dark:text-slate-400">
                        System activity logs
                      </span>
                    </div>
                  </button>
                </div>
              </div>

              {/* System Status */}
              <div className="bg-gradient-to-br from-rose-400 via-orange-400 to-amber-400 rounded-xl shadow-lg p-6 text-white">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  System Status
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-white/20 backdrop-blur rounded-lg">
                    <span className="text-sm font-medium">API Server</span>
                    <span className="flex items-center gap-1 text-xs">
                      <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                      Online
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-white/20 backdrop-blur rounded-lg">
                    <span className="text-sm font-medium">Database</span>
                    <span className="flex items-center gap-1 text-xs">
                      <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                      Connected
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-white/20 backdrop-blur rounded-lg">
                    <span className="text-sm font-medium">AI Service</span>
                    <span className="flex items-center gap-1 text-xs">
                      <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                      Active
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
