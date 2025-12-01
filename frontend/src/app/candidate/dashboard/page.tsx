"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Sidebar from "@/components/Sidebar";
import {
  FileText,
  Briefcase,
  TrendingUp,
  Award,
  Clock,
  Eye,
  Target,
  Calendar,
  ArrowRight,
  Download,
  Star,
  LayoutDashboard,
  User,
  Settings,
  MessageSquare,
} from "lucide-react";
import Link from "next/link";

const candidateNavItems = [
  { name: "Dashboard", href: "/candidate/dashboard", icon: LayoutDashboard },
  { name: "My Resumes", href: "/candidate/resumes", icon: FileText },
  { name: "Browse Jobs", href: "/candidate/jobs", icon: Briefcase },
  { name: "Applications", href: "/candidate/applications", icon: Target },
  { name: "Profile", href: "/candidate/profile", icon: User },
  { name: "Messages", href: "/candidate/messages", icon: MessageSquare },
  { name: "Settings", href: "/candidate/settings", icon: Settings },
];

interface DashboardStats {
  totalResumes: number;
  activeApplications: number;
  avgMatchScore: number;
  profileViews: number;
  savedJobs: number;
  interviewsScheduled: number;
}

interface RecentActivity {
  id: number;
  type: string;
  title: string;
  description: string;
  timestamp: string;
  icon: string;
}

export default function CandidateDashboard() {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    totalResumes: 3,
    activeApplications: 12,
    avgMatchScore: 85,
    profileViews: 47,
    savedJobs: 8,
    interviewsScheduled: 2,
  });
  const [recentActivity] = useState<RecentActivity[]>([
    {
      id: 1,
      type: "application",
      title: "Applied to Senior Developer",
      description: "Tech Corp Inc.",
      timestamp: "2 hours ago",
      icon: "briefcase",
    },
    {
      id: 2,
      type: "match",
      title: "New Job Match (92%)",
      description: "Full Stack Engineer at StartupXYZ",
      timestamp: "5 hours ago",
      icon: "target",
    },
    {
      id: 3,
      type: "interview",
      title: "Interview Scheduled",
      description: "Product Manager role - Tomorrow at 2 PM",
      timestamp: "1 day ago",
      icon: "calendar",
    },
    {
      id: 4,
      type: "view",
      title: "Profile Viewed",
      description: "3 recruiters viewed your profile",
      timestamp: "2 days ago",
      icon: "eye",
    },
  ]);

  useEffect(() => {
    setTimeout(() => setLoading(false), 800);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-slate-950 dark:via-blue-950 dark:to-indigo-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <ProtectedRoute requireRole="candidate">
      <div className="flex min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-slate-950 dark:via-blue-950 dark:to-indigo-950">
        {/* Sidebar */}
        <Sidebar navItems={candidateNavItems} themeColor="blue" portalName="Candidate Portal" />

        {/* Main Content */}
        <div className="flex-1 overflow-x-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Welcome Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                Welcome back, {user?.email?.split("@")[0] || "Candidate"}! 👋
              </h1>
              <p className="text-slate-600 dark:text-slate-400">
                Here's what's happening with your job search today.
              </p>
            </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-lg p-6 border border-blue-100 dark:border-slate-700 hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gradient-to-br from-rose-400 to-orange-400 rounded-lg">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <span className="text-sm text-green-600 dark:text-green-400 font-medium">
                  +2 this month
                </span>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
                {stats.totalResumes}
              </h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm">Total Resumes</p>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-lg p-6 border border-blue-100 dark:border-slate-700 hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg">
                  <Briefcase className="w-6 h-6 text-white" />
                </div>
                <span className="text-sm text-green-600 dark:text-green-400 font-medium">
                  +5 this week
                </span>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
                {stats.activeApplications}
              </h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm">Active Applications</p>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-lg p-6 border border-blue-100 dark:border-slate-700 hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <span className="text-sm text-green-600 dark:text-green-400 font-medium">
                  +3% this week
                </span>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
                {stats.avgMatchScore}%
              </h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm">Avg Match Score</p>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-lg p-6 border border-blue-100 dark:border-slate-700 hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-lg">
                  <Eye className="w-6 h-6 text-white" />
                </div>
                <span className="text-sm text-green-600 dark:text-green-400 font-medium">
                  +12 today
                </span>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
                {stats.profileViews}
              </h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm">Profile Views</p>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-lg p-6 border border-blue-100 dark:border-slate-700 hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gradient-to-br from-amber-500 to-orange-500 rounded-lg">
                  <Star className="w-6 h-6 text-white" />
                </div>
                <span className="text-sm text-slate-400">Updated 1h ago</span>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
                {stats.savedJobs}
              </h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm">Saved Jobs</p>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-lg p-6 border border-blue-100 dark:border-slate-700 hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <span className="text-sm text-rose-600 dark:text-rose-400 font-medium">
                  Upcoming
                </span>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
                {stats.interviewsScheduled}
              </h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm">Interviews Scheduled</p>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Recent Activity */}
            <div className="lg:col-span-2">
              <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg rounded-xl shadow-lg p-6 border border-rose-100 dark:border-slate-700">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                    Recent Activity
                  </h2>
                  <Link
                    href="/candidate/jobs"
                    className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 font-medium"
                  >
                    View All
                  </Link>
                </div>

                <div className="space-y-4">
                  {recentActivity.map((activity) => (
                    <div
                      key={activity.id}
                      className="flex items-start gap-4 p-4 bg-slate-50 dark:bg-slate-800 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-750 transition-colors"
                    >
                      <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex-shrink-0">
                        {activity.icon === "briefcase" && <Briefcase className="w-5 h-5 text-white" />}
                        {activity.icon === "target" && <Target className="w-5 h-5 text-white" />}
                        {activity.icon === "calendar" && <Calendar className="w-5 h-5 text-white" />}
                        {activity.icon === "eye" && <Eye className="w-5 h-5 text-white" />}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-slate-900 dark:text-white mb-1">
                          {activity.title}
                        </h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          {activity.description}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <Clock className="w-4 h-4 text-slate-400" />
                          <span className="text-xs text-slate-500 dark:text-slate-400">
                            {activity.timestamp}
                          </span>
                        </div>
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
                  <Link
                    href="/candidate/resumes"
                    className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg border border-blue-200 dark:border-blue-800 hover:shadow-md transition-shadow group"
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-blue-600" />
                      <span className="font-medium text-slate-900 dark:text-white">
                        Upload Resume
                      </span>
                    </div>
                    <ArrowRight className="w-5 h-5 text-blue-600 group-hover:translate-x-1 transition-transform" />
                  </Link>

                  <Link
                    href="/candidate/jobs"
                    className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg border border-purple-200 dark:border-purple-800 hover:shadow-md transition-shadow group"
                  >
                    <div className="flex items-center gap-3">
                      <Briefcase className="w-5 h-5 text-purple-600" />
                      <span className="font-medium text-slate-900 dark:text-white">
                        Browse Jobs
                      </span>
                    </div>
                    <ArrowRight className="w-5 h-5 text-purple-600 group-hover:translate-x-1 transition-transform" />
                  </Link>

                  <Link
                    href="/candidate/profile"
                    className="flex items-center justify-between p-4 bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-cyan-900/20 dark:to-blue-900/20 rounded-lg border border-cyan-200 dark:border-cyan-800 hover:shadow-md transition-shadow group"
                  >
                    <div className="flex items-center gap-3">
                      <Award className="w-5 h-5 text-cyan-600" />
                      <span className="font-medium text-slate-900 dark:text-white">
                        Update Profile
                      </span>
                    </div>
                    <ArrowRight className="w-5 h-5 text-cyan-600 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>

              {/* Profile Completion */}
              <div className="bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-500 rounded-xl shadow-lg p-6 text-white">
                <h3 className="text-lg font-bold mb-3">Profile Strength</h3>
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span>85% Complete</span>
                    <span>Strong</span>
                  </div>
                  <div className="h-2 bg-white/30 rounded-full overflow-hidden">
                    <div className="h-full bg-white rounded-full" style={{ width: "85%" }}></div>
                  </div>
                </div>
                <p className="text-sm text-white/90 mb-4">
                  Add certifications to reach 100% profile completion!
                </p>
                <Link
                  href="/candidate/profile"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-white text-blue-600 font-medium rounded-lg hover:shadow-lg transition-all"
                >
                  Complete Profile
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
