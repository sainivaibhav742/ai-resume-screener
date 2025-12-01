"use client";

import { useState, useEffect } from "react";
import { Upload, FileText, BarChart3, User, Briefcase, Award, Settings } from "lucide-react";
import Link from "next/link";

export default function CandidateDashboard() {
  const [stats, setStats] = useState({
    profileCompletion: 0,
    resumesCreated: 0,
    jobApplications: 0,
    matchedJobs: 0
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fef8f5] via-[#fff5f1] to-[#ffe8df] dark:from-[#1a1212] dark:via-[#2d2424] dark:to-[#1a1212]">
      {/* Header */}
      <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-b border-rose-100 dark:border-slate-700">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-rose-600 to-orange-600 bg-clip-text text-transparent">
                Candidate Portal
              </h1>
              <nav className="hidden md:flex gap-6">
                <Link href="/candidate/dashboard" className="text-sm font-medium text-rose-600 hover:text-rose-700">
                  Dashboard
                </Link>
                <Link href="/candidate/profile" className="text-sm font-medium text-slate-600 hover:text-rose-600">
                  Profile
                </Link>
                <Link href="/candidate/resumes" className="text-sm font-medium text-slate-600 hover:text-slate-900">
                  Resumes
                </Link>
                <Link href="/candidate/jobs" className="text-sm font-medium text-slate-600 hover:text-slate-900">
                  Jobs
                </Link>
                <Link href="/candidate/applications" className="text-sm font-medium text-slate-600 hover:text-slate-900">
                  Applications
                </Link>
              </nav>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-lg transition-colors">
              <User className="w-4 h-4" />
              <span className="text-sm font-medium">Profile</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border border-rose-100 dark:border-slate-700">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-rose-100 dark:bg-rose-900/30 rounded-lg">
                <User className="w-6 h-6 text-rose-600" />
              </div>
              <span className="text-2xl font-bold text-slate-900 dark:text-white">
                {stats.profileCompletion}%
              </span>
            </div>
            <h3 className="text-sm font-medium text-slate-600 dark:text-slate-400">Profile Completion</h3>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border border-rose-100 dark:border-slate-700">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                <FileText className="w-6 h-6 text-orange-600" />
              </div>
              <span className="text-2xl font-bold text-slate-900 dark:text-white">
                {stats.resumesCreated}
              </span>
            </div>
            <h3 className="text-sm font-medium text-slate-600 dark:text-slate-400">Resumes Created</h3>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <Briefcase className="w-6 h-6 text-green-600" />
              </div>
              <span className="text-2xl font-bold text-slate-900 dark:text-white">
                {stats.jobApplications}
              </span>
            </div>
            <h3 className="text-sm font-medium text-slate-600 dark:text-slate-400">Applications</h3>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                <Award className="w-6 h-6 text-orange-600" />
              </div>
              <span className="text-2xl font-bold text-slate-900 dark:text-white">
                {stats.matchedJobs}
              </span>
            </div>
            <h3 className="text-sm font-medium text-slate-600 dark:text-slate-400">Job Matches</h3>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Link href="/candidate/resume-builder" className="group">
            <div className="bg-gradient-to-br from-rose-500 to-orange-600 rounded-xl shadow-lg p-8 hover:shadow-xl transition-all">
              <div className="flex items-center justify-between mb-4">
                <FileText className="w-12 h-12 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Build Resume</h3>
              <p className="text-rose-100">Create professional, ATS-optimized resumes</p>
            </div>
          </Link>

          <Link href="/candidate/jobs" className="group">
            <div className="bg-gradient-to-br from-green-500 to-teal-600 rounded-xl shadow-lg p-8 hover:shadow-xl transition-all">
              <div className="flex items-center justify-between mb-4">
                <Briefcase className="w-12 h-12 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Browse Jobs</h3>
              <p className="text-green-100">Find jobs matching your skills and experience</p>
            </div>
          </Link>

          <Link href="/candidate/profile" className="group">
            <div className="bg-gradient-to-br from-amber-500 to-yellow-600 rounded-xl shadow-lg p-8 hover:shadow-xl transition-all">
              <div className="flex items-center justify-between mb-4">
                <User className="w-12 h-12 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Update Profile</h3>
              <p className="text-amber-100">Complete your profile to get better matches</p>
            </div>
          </Link>
        </div>

        {/* Recent Activity */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border border-slate-200 dark:border-slate-700">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Recent Activity</h2>
          <div className="text-center py-8 text-slate-500 dark:text-slate-400">
            No recent activity. Start by building your resume or browsing jobs!
          </div>
        </div>
      </main>
    </div>
  );
}
