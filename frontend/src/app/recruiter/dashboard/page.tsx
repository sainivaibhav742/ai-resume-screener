"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import {
  Briefcase,
  Users,
  TrendingUp,
  Eye,
  Target,
  Clock,
  FileText,
  Calendar,
  ArrowRight,
  Plus,
  CheckCircle,
  Star,
} from "lucide-react";
import Link from "next/link";

interface DashboardStats {
  totalJobs: number;
  activeJobs: number;
  totalCandidates: number;
  shortlistedCandidates: number;
  avgMatchScore: number;
  totalViews: number;
  scheduledInterviews: number;
  applicationsThisWeek: number;
}

interface RecentApplication {
  id: number;
  candidateName: string;
  jobTitle: string;
  matchScore: number;
  appliedAt: string;
  status: string;
}

export default function RecruiterDashboard() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    totalJobs: 15,
    activeJobs: 8,
    totalCandidates: 234,
    shortlistedCandidates: 45,
    avgMatchScore: 78,
    totalViews: 1847,
    scheduledInterviews: 12,
    applicationsThisWeek: 67,
  });
  const [recentApplications] = useState<RecentApplication[]>([
    {
      id: 1,
      candidateName: "Sarah Johnson",
      jobTitle: "Senior Frontend Developer",
      matchScore: 92,
      appliedAt: "2 hours ago",
      status: "new",
    },
    {
      id: 2,
      candidateName: "Michael Chen",
      jobTitle: "Full Stack Engineer",
      matchScore: 88,
      appliedAt: "5 hours ago",
      status: "reviewed",
    },
    {
      id: 3,
      candidateName: "Emily Davis",
      jobTitle: "Product Manager",
      matchScore: 85,
      appliedAt: "1 day ago",
      status: "shortlisted",
    },
    {
      id: 4,
      candidateName: "David Wilson",
      jobTitle: "DevOps Engineer",
      matchScore: 81,
      appliedAt: "1 day ago",
      status: "new",
    },
  ]);

  useEffect(() => {
    setTimeout(() => setLoading(false), 800);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#fef8f5] via-[#fff5f1] to-[#ffe8df] dark:from-[#1a1212] dark:via-[#2d2424] dark:to-[#1a1212] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-rose-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <ProtectedRoute requireRole="recruiter">
      <div className="min-h-screen bg-gradient-to-br from-[#fef8f5] via-[#fff5f1] to-[#ffe8df] dark:from-[#1a1212] dark:via-[#2d2424] dark:to-[#1a1212">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Welcome Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                Welcome back, {user?.company_name || "Recruiter"}! 👋
              </h1>
              <p className="text-slate-600 dark:text-slate-400">
                Here's your recruitment overview for today.
              </p>
            </div>
            <Link
              href="/recruiter/jobs"
              className="px-6 py-3 bg-gradient-to-r from-rose-500 to-orange-500 hover:from-rose-600 hover:to-orange-600 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Post New Job
            </Link>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg rounded-xl shadow-lg p-6 border border-rose-100 dark:border-slate-700">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gradient-to-br from-rose-400 to-orange-400 rounded-lg">
                  <Briefcase className="w-6 h-6 text-white" />
                </div>
                <span className="text-sm text-green-600 dark:text-green-400 font-medium">
                  +3 this month
                </span>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
                {stats.totalJobs}
              </h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm">Total Jobs Posted</p>
            </div>

            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg rounded-xl shadow-lg p-6 border border-rose-100 dark:border-slate-700">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gradient-to-br from-green-400 to-emerald-400 rounded-lg">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
                <span className="text-sm text-slate-400">Active</span>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
                {stats.activeJobs}
              </h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm">Active Job Postings</p>
            </div>

            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg rounded-xl shadow-lg p-6 border border-rose-100 dark:border-slate-700">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gradient-to-br from-blue-400 to-indigo-400 rounded-lg">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <span className="text-sm text-green-600 dark:text-green-400 font-medium">
                  +{stats.applicationsThisWeek} this week
                </span>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
                {stats.totalCandidates}
              </h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm">Total Candidates</p>
            </div>

            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg rounded-xl shadow-lg p-6 border border-rose-100 dark:border-slate-700">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gradient-to-br from-amber-400 to-orange-400 rounded-lg">
                  <Star className="w-6 h-6 text-white" />
                </div>
                <span className="text-sm text-slate-400">Top picks</span>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
                {stats.shortlistedCandidates}
              </h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm">Shortlisted</p>
            </div>

            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg rounded-xl shadow-lg p-6 border border-rose-100 dark:border-slate-700">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gradient-to-br from-purple-400 to-pink-400 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <span className="text-sm text-green-600 dark:text-green-400 font-medium">
                  +5% this month
                </span>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
                {stats.avgMatchScore}%
              </h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm">Avg Match Score</p>
            </div>

            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg rounded-xl shadow-lg p-6 border border-rose-100 dark:border-slate-700">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gradient-to-br from-cyan-400 to-blue-400 rounded-lg">
                  <Eye className="w-6 h-6 text-white" />
                </div>
                <span className="text-sm text-green-600 dark:text-green-400 font-medium">
                  +234 today
                </span>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
                {stats.totalViews.toLocaleString()}
              </h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm">Total Job Views</p>
            </div>

            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg rounded-xl shadow-lg p-6 border border-rose-100 dark:border-slate-700">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gradient-to-br from-orange-400 to-red-400 rounded-lg">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <span className="text-sm text-rose-600 dark:text-rose-400 font-medium">
                  Upcoming
                </span>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
                {stats.scheduledInterviews}
              </h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm">Scheduled Interviews</p>
            </div>

            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg rounded-xl shadow-lg p-6 border border-rose-100 dark:border-slate-700">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gradient-to-br from-teal-400 to-green-400 rounded-lg">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <span className="text-sm text-green-600 dark:text-green-400 font-medium">
                  This week
                </span>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
                {stats.applicationsThisWeek}
              </h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm">New Applications</p>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Recent Applications */}
            <div className="lg:col-span-2">
              <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg rounded-xl shadow-lg p-6 border border-rose-100 dark:border-slate-700">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                    Recent Applications
                  </h2>
                  <Link
                    href="/recruiter/candidates"
                    className="text-sm text-rose-600 hover:text-rose-700 dark:text-rose-400 font-medium"
                  >
                    View All
                  </Link>
                </div>

                <div className="space-y-4">
                  {recentApplications.map((application) => (
                    <div
                      key={application.id}
                      className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-750 transition-colors"
                    >
                      <div className="flex items-center gap-4 flex-1">
                        <div className="w-12 h-12 bg-gradient-to-br from-rose-400 to-orange-400 rounded-full flex items-center justify-center text-white font-bold">
                          {application.candidateName.charAt(0)}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-slate-900 dark:text-white mb-1">
                            {application.candidateName}
                          </h3>
                          <p className="text-sm text-slate-600 dark:text-slate-400">
                            {application.jobTitle}
                          </p>
                          <div className="flex items-center gap-3 mt-2">
                            <div className="flex items-center gap-1">
                              <Target className="w-4 h-4 text-green-500" />
                              <span className="text-xs font-medium text-green-600 dark:text-green-400">
                                {application.matchScore}% match
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4 text-slate-400" />
                              <span className="text-xs text-slate-500 dark:text-slate-400">
                                {application.appliedAt}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {application.status === "new" && (
                          <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs font-medium rounded-full">
                            New
                          </span>
                        )}
                        {application.status === "reviewed" && (
                          <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 text-xs font-medium rounded-full">
                            Reviewed
                          </span>
                        )}
                        {application.status === "shortlisted" && (
                          <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-medium rounded-full">
                            Shortlisted
                          </span>
                        )}
                        <button className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors">
                          <ArrowRight className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                        </button>
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
                    href="/recruiter/jobs"
                    className="flex items-center justify-between p-4 bg-gradient-to-r from-rose-50 to-orange-50 dark:from-rose-900/20 dark:to-orange-900/20 rounded-lg border border-rose-200 dark:border-rose-800 hover:shadow-md transition-shadow group"
                  >
                    <div className="flex items-center gap-3">
                      <Plus className="w-5 h-5 text-rose-600" />
                      <span className="font-medium text-slate-900 dark:text-white">
                        Post New Job
                      </span>
                    </div>
                    <ArrowRight className="w-5 h-5 text-rose-600 group-hover:translate-x-1 transition-transform" />
                  </Link>

                  <Link
                    href="/recruiter/screening"
                    className="flex items-center justify-between p-4 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-lg border border-amber-200 dark:border-amber-800 hover:shadow-md transition-shadow group"
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-amber-600" />
                      <span className="font-medium text-slate-900 dark:text-white">
                        Screen Resumes
                      </span>
                    </div>
                    <ArrowRight className="w-5 h-5 text-amber-600 group-hover:translate-x-1 transition-transform" />
                  </Link>

                  <Link
                    href="/recruiter/candidates"
                    className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg border border-green-200 dark:border-green-800 hover:shadow-md transition-shadow group"
                  >
                    <div className="flex items-center gap-3">
                      <Users className="w-5 h-5 text-green-600" />
                      <span className="font-medium text-slate-900 dark:text-white">
                        View Candidates
                      </span>
                    </div>
                    <ArrowRight className="w-5 h-5 text-green-600 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>

              {/* AI Insights */}
              <div className="bg-gradient-to-br from-rose-400 via-orange-400 to-amber-400 rounded-xl shadow-lg p-6 text-white">
                <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  AI Insights
                </h3>
                <div className="space-y-3">
                  <div className="p-3 bg-white/20 backdrop-blur rounded-lg">
                    <p className="text-sm font-medium mb-1">Top Performing Job</p>
                    <p className="text-xs text-white/90">
                      "Senior Developer" has 45 applications with 87% avg match
                    </p>
                  </div>
                  <div className="p-3 bg-white/20 backdrop-blur rounded-lg">
                    <p className="text-sm font-medium mb-1">Best Time to Post</p>
                    <p className="text-xs text-white/90">
                      Monday mornings get 3x more views and quality candidates
                    </p>
                  </div>
                  <div className="p-3 bg-white/20 backdrop-blur rounded-lg">
                    <p className="text-sm font-medium mb-1">Hiring Trend</p>
                    <p className="text-xs text-white/90">
                      Full-stack roles are 40% more popular this month
                    </p>
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
