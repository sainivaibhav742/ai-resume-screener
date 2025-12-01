"use client";

import { useState, useEffect } from "react";
import { Users, Briefcase, CheckCircle, Clock, TrendingUp, FileText, Settings } from "lucide-react";
import Link from "next/link";

export default function RecruiterDashboard() {
  const [stats, setStats] = useState({
    activeJobs: 0,
    totalApplications: 0,
    pendingReviews: 0,
    resumesScreened: 0,
    monthlyLimit: 50,
    shortlisted: 0
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fef8f5] via-[#fff5f1] to-[#ffe8df] dark:from-[#1a1212] dark:via-[#2d2424] dark:to-[#1a1212]">
      {/* Header */}
      <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-b border-amber-100 dark:border-slate-700">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                Recruiter Portal
              </h1>
              <nav className="hidden md:flex gap-6">
                <Link href="/recruiter/dashboard" className="text-sm font-medium text-amber-600 hover:text-amber-700">
                  Dashboard
                </Link>
                <Link href="/recruiter/jobs" className="text-sm font-medium text-slate-600 hover:text-amber-600">
                  Jobs
                </Link>
                <Link href="/recruiter/candidates" className="text-sm font-medium text-slate-600 hover:text-slate-900">
                  Candidates
                </Link>
                <Link href="/recruiter/screening" className="text-sm font-medium text-slate-600 hover:text-slate-900">
                  Screen Resumes
                </Link>
                <Link href="/recruiter/team" className="text-sm font-medium text-slate-600 hover:text-slate-900">
                  Team
                </Link>
              </nav>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-lg transition-colors">
              <Settings className="w-4 h-4" />
              <span className="text-sm font-medium">Settings</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border border-amber-100 dark:border-slate-700">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
                <Briefcase className="w-6 h-6 text-amber-600" />
              </div>
              <span className="text-2xl font-bold text-slate-900 dark:text-white">
                {stats.activeJobs}
              </span>
            </div>
            <h3 className="text-sm font-medium text-slate-600 dark:text-slate-400">Active Jobs</h3>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border border-amber-100 dark:border-slate-700">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-rose-100 dark:bg-rose-900/30 rounded-lg">
                <Users className="w-6 h-6 text-rose-600" />
              </div>
              <span className="text-2xl font-bold text-slate-900 dark:text-white">
                {stats.totalApplications}
              </span>
            </div>
            <h3 className="text-sm font-medium text-slate-600 dark:text-slate-400">Total Applications</h3>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                <Clock className="w-6 h-6 text-orange-600" />
              </div>
              <span className="text-2xl font-bold text-slate-900 dark:text-white">
                {stats.pendingReviews}
              </span>
            </div>
            <h3 className="text-sm font-medium text-slate-600 dark:text-slate-400">Pending Reviews</h3>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <span className="text-2xl font-bold text-slate-900 dark:text-white">
                {stats.shortlisted}
              </span>
            </div>
            <h3 className="text-sm font-medium text-slate-600 dark:text-slate-400">Shortlisted</h3>
          </div>
        </div>

        {/* Usage Meter */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border border-slate-200 dark:border-slate-700 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Monthly Usage</h3>
            <span className="text-sm text-slate-600 dark:text-slate-400">
              {stats.resumesScreened} / {stats.monthlyLimit} resumes screened
            </span>
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-amber-500 to-orange-600 h-3 rounded-full transition-all"
              style={{ width: `${(stats.resumesScreened / stats.monthlyLimit) * 100}%` }}
            />
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
            {stats.monthlyLimit - stats.resumesScreened} credits remaining
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Link href="/recruiter/jobs/create" className="group">
            <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl shadow-lg p-8 hover:shadow-xl transition-all">
              <div className="flex items-center justify-between mb-4">
                <Briefcase className="w-12 h-12 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Post a Job</h3>
              <p className="text-amber-100">Create and publish a new job posting</p>
            </div>
          </Link>

          <Link href="/recruiter/screening" className="group">
            <div className="bg-gradient-to-br from-rose-500 to-pink-600 rounded-xl shadow-lg p-8 hover:shadow-xl transition-all">
              <div className="flex items-center justify-between mb-4">
                <FileText className="w-12 h-12 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Screen Resumes</h3>
              <p className="text-rose-100">Upload and analyze candidate resumes</p>
            </div>
          </Link>

          <Link href="/recruiter/candidates" className="group">
            <div className="bg-gradient-to-br from-green-500 to-teal-600 rounded-xl shadow-lg p-8 hover:shadow-xl transition-all">
              <div className="flex items-center justify-between mb-4">
                <Users className="w-12 h-12 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">View Candidates</h3>
              <p className="text-green-100">Browse and rank candidate profiles</p>
            </div>
          </Link>
        </div>

        {/* Recent Applications */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Recent Applications</h2>
            <Link href="/recruiter/candidates" className="text-sm font-medium text-amber-600 hover:text-amber-700">
              View All
            </Link>
          </div>
          <div className="text-center py-8 text-slate-500 dark:text-slate-400">
            No recent applications. Post a job to start receiving applications!
          </div>
        </div>
      </main>
    </div>
  );
}
