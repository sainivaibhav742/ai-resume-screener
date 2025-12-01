"use client";

import { useState, useEffect } from "react";
import {
  Briefcase,
  MapPin,
  DollarSign,
  Clock,
  Search,
  Filter,
  Heart,
  ExternalLink,
  TrendingUp,
  Building,
  Calendar,
} from "lucide-react";
import Link from "next/link";

interface Job {
  id: number;
  title: string;
  company: string;
  location: string;
  type: "full-time" | "part-time" | "contract" | "remote";
  salary_min: number;
  salary_max: number;
  posted_date: string;
  description: string;
  requirements: string[];
  match_score: number;
  saved: boolean;
  applied: boolean;
}

/**
 * Candidate Jobs Page Component
 * Allows candidates to browse jobs, see match scores, save jobs, and apply
 */
export default function CandidateJobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<"all" | "full-time" | "part-time" | "contract" | "remote">("all");
  const [sortBy, setSortBy] = useState<"match" | "recent">("match");

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:8000/api/candidate/jobs", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setJobs(data.jobs || []);
      }
    } catch (error) {
      console.error("Failed to load jobs:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveJob = async (jobId: number) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:8000/api/candidate/jobs/${jobId}/save`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setJobs(jobs.map(job => 
          job.id === jobId ? { ...job, saved: !job.saved } : job
        ));
      }
    } catch (error) {
      console.error("Failed to save job:", error);
    }
  };

  const handleApply = async (jobId: number) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:8000/api/candidate/jobs/${jobId}/apply`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setJobs(jobs.map(job => 
          job.id === jobId ? { ...job, applied: true } : job
        ));
      }
    } catch (error) {
      console.error("Failed to apply:", error);
    }
  };

  const getMatchColor = (score: number) => {
    if (score >= 80) return "text-green-600 dark:text-green-400";
    if (score >= 60) return "text-amber-600 dark:text-amber-400";
    return "text-rose-600 dark:text-rose-400";
  };

  const getMatchBgColor = (score: number) => {
    if (score >= 80) return "from-green-500 to-emerald-500";
    if (score >= 60) return "from-amber-500 to-orange-500";
    return "from-rose-500 to-orange-500";
  };

  // Filter and sort jobs
  const filteredJobs = jobs
    .filter(job => {
      const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          job.location.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = filterType === "all" || job.type === filterType;
      return matchesSearch && matchesType;
    })
    .sort((a, b) => {
      if (sortBy === "match") return b.match_score - a.match_score;
      return new Date(b.posted_date).getTime() - new Date(a.posted_date).getTime();
    });

  const stats = {
    total: jobs.length,
    saved: jobs.filter(j => j.saved).length,
    applied: jobs.filter(j => j.applied).length,
    highMatch: jobs.filter(j => j.match_score >= 80).length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fef8f5] via-[#fff5f1] to-[#ffe8df] dark:from-[#1a1212] dark:via-[#2d2424] dark:to-[#1a1212]">
      {/* Header */}
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-b border-rose-100 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                Browse Jobs
              </h1>
              <p className="mt-1 text-slate-600 dark:text-slate-400">
                Find your perfect match with AI-powered job recommendations
              </p>
            </div>
            <Link
              href="/candidate"
              className="px-4 py-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              ← Back to Dashboard
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg rounded-xl shadow-lg p-6 border border-rose-100 dark:border-slate-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 dark:text-slate-400 text-sm font-medium">
                  Total Jobs
                </p>
                <p className="text-3xl font-bold text-slate-900 dark:text-white mt-2">
                  {stats.total}
                </p>
              </div>
              <div className="p-3 bg-gradient-to-br from-rose-400 to-orange-400 rounded-xl">
                <Briefcase className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg rounded-xl shadow-lg p-6 border border-rose-100 dark:border-slate-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 dark:text-slate-400 text-sm font-medium">
                  Saved Jobs
                </p>
                <p className="text-3xl font-bold text-slate-900 dark:text-white mt-2">
                  {stats.saved}
                </p>
              </div>
              <div className="p-3 bg-gradient-to-br from-amber-400 to-orange-400 rounded-xl">
                <Heart className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg rounded-xl shadow-lg p-6 border border-rose-100 dark:border-slate-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 dark:text-slate-400 text-sm font-medium">
                  Applied
                </p>
                <p className="text-3xl font-bold text-slate-900 dark:text-white mt-2">
                  {stats.applied}
                </p>
              </div>
              <div className="p-3 bg-gradient-to-br from-green-400 to-emerald-400 rounded-xl">
                <ExternalLink className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg rounded-xl shadow-lg p-6 border border-rose-100 dark:border-slate-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 dark:text-slate-400 text-sm font-medium">
                  High Matches
                </p>
                <p className="text-3xl font-bold text-slate-900 dark:text-white mt-2">
                  {stats.highMatch}
                </p>
              </div>
              <div className="p-3 bg-gradient-to-br from-purple-400 to-pink-400 rounded-xl">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg rounded-xl shadow-lg p-6 mb-6 border border-rose-100 dark:border-slate-700">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search jobs, companies, or locations..."
                className="w-full pl-11 pr-4 py-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent text-slate-900 dark:text-white"
              />
            </div>

            {/* Type Filter */}
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as any)}
              className="px-4 py-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent text-slate-900 dark:text-white"
            >
              <option value="all">All Types</option>
              <option value="full-time">Full Time</option>
              <option value="part-time">Part Time</option>
              <option value="contract">Contract</option>
              <option value="remote">Remote</option>
            </select>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-4 py-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent text-slate-900 dark:text-white"
            >
              <option value="match">Best Match</option>
              <option value="recent">Most Recent</option>
            </select>
          </div>
        </div>

        {/* Jobs List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-rose-500 border-t-transparent"></div>
            <p className="mt-4 text-slate-600 dark:text-slate-400">Loading jobs...</p>
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg rounded-xl shadow-lg p-12 border border-rose-100 dark:border-slate-700 text-center">
            <Briefcase className="w-16 h-16 text-slate-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
              No jobs found
            </h3>
            <p className="text-slate-600 dark:text-slate-400">
              Try adjusting your search or filters
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredJobs.map((job) => (
              <div
                key={job.id}
                className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg rounded-xl shadow-lg p-6 border border-rose-100 dark:border-slate-700 hover:shadow-xl transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="p-3 bg-gradient-to-br from-rose-100 to-orange-100 dark:from-rose-900/20 dark:to-orange-900/20 rounded-lg">
                      <Building className="w-8 h-8 text-rose-600 dark:text-rose-400" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                            {job.title}
                          </h3>
                          <p className="text-slate-600 dark:text-slate-400 mt-1">
                            {job.company}
                          </p>
                        </div>
                        
                        {/* Match Score Badge */}
                        <div className={`px-4 py-2 bg-gradient-to-r ${getMatchBgColor(job.match_score)} rounded-lg shadow-lg`}>
                          <div className="text-center">
                            <p className="text-2xl font-bold text-white">
                              {job.match_score}%
                            </p>
                            <p className="text-xs text-white/80">Match</p>
                          </div>
                        </div>
                      </div>

                      {/* Job Details */}
                      <div className="flex flex-wrap items-center gap-4 mt-3">
                        <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                          <MapPin className="w-4 h-4" />
                          <span className="text-sm">{job.location}</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                          <Clock className="w-4 h-4" />
                          <span className="text-sm capitalize">{job.type.replace('-', ' ')}</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                          <DollarSign className="w-4 h-4" />
                          <span className="text-sm">
                            ${(job.salary_min / 1000).toFixed(0)}k - ${(job.salary_max / 1000).toFixed(0)}k
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                          <Calendar className="w-4 h-4" />
                          <span className="text-sm">
                            {new Date(job.posted_date).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      {/* Description */}
                      <p className="mt-4 text-slate-700 dark:text-slate-300 line-clamp-2">
                        {job.description}
                      </p>

                      {/* Requirements */}
                      <div className="mt-4 flex flex-wrap gap-2">
                        {job.requirements.slice(0, 5).map((req, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-sm rounded-full"
                          >
                            {req}
                          </span>
                        ))}
                        {job.requirements.length > 5 && (
                          <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-sm rounded-full">
                            +{job.requirements.length - 5} more
                          </span>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="mt-6 flex items-center gap-3">
                        {job.applied ? (
                          <button
                            disabled
                            className="px-6 py-2 bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400 font-medium rounded-lg cursor-not-allowed"
                          >
                            Applied ✓
                          </button>
                        ) : (
                          <button
                            onClick={() => handleApply(job.id)}
                            className="px-6 py-2 bg-gradient-to-r from-rose-500 to-orange-500 hover:from-rose-600 hover:to-orange-600 text-white font-medium rounded-lg transition-all shadow-lg hover:shadow-xl"
                          >
                            Apply Now
                          </button>
                        )}
                        
                        <button
                          onClick={() => handleSaveJob(job.id)}
                          className={`p-2 rounded-lg transition-all ${
                            job.saved
                              ? "bg-rose-100 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400"
                              : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-rose-50 dark:hover:bg-rose-900/10"
                          }`}
                        >
                          <Heart className={`w-5 h-5 ${job.saved ? "fill-current" : ""}`} />
                        </button>

                        <Link
                          href={`/candidate/jobs/${job.id}`}
                          className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-medium rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-all"
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
