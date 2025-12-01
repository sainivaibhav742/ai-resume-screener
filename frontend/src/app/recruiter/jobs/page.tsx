"use client";

import { useState, useEffect } from "react";
import {
  Briefcase,
  Plus,
  Edit,
  Trash2,
  Eye,
  Users,
  Clock,
  CheckCircle,
  XCircle,
  Archive,
  MapPin,
  DollarSign,
} from "lucide-react";
import Link from "next/link";

interface Job {
  id: number;
  title: string;
  department: string;
  location: string;
  type: "full-time" | "part-time" | "contract" | "remote";
  salary_min: number;
  salary_max: number;
  status: "active" | "draft" | "closed" | "archived";
  posted_date: string;
  applications: number;
  views: number;
  shortlisted: number;
}

/**
 * Recruiter Jobs Management Page
 * Allows recruiters to create, edit, delete, and manage job postings
 */
export default function RecruiterJobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "active" | "draft" | "closed" | "archived">("all");
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:8000/api/recruiter/jobs", {
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

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this job posting?")) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:8000/api/recruiter/jobs/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        await loadJobs();
      }
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  const handleStatusChange = async (id: number, status: string) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:8000/api/recruiter/jobs/${id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });

      if (response.ok) {
        await loadJobs();
      }
    } catch (error) {
      console.error("Status change failed:", error);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case "draft":
        return <Clock className="w-5 h-5 text-amber-600" />;
      case "closed":
        return <XCircle className="w-5 h-5 text-red-600" />;
      case "archived":
        return <Archive className="w-5 h-5 text-slate-400" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400";
      case "draft":
        return "bg-amber-100 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400";
      case "closed":
        return "bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400";
      case "archived":
        return "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400";
      default:
        return "";
    }
  };

  const filteredJobs = filter === "all" ? jobs : jobs.filter(job => job.status === filter);

  const stats = {
    total: jobs.length,
    active: jobs.filter(j => j.status === "active").length,
    draft: jobs.filter(j => j.status === "draft").length,
    closed: jobs.filter(j => j.status === "closed").length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fef8f5] via-[#fff5f1] to-[#ffe8df] dark:from-[#1a1212] dark:via-[#2d2424] dark:to-[#1a1212]">
      {/* Header */}
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-b border-rose-100 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                Job Postings
              </h1>
              <p className="mt-1 text-slate-600 dark:text-slate-400">
                Manage your job listings and track applications
              </p>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowCreateModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-rose-500 to-orange-500 hover:from-rose-600 hover:to-orange-600 text-white font-medium rounded-lg transition-all shadow-lg hover:shadow-xl"
              >
                <Plus className="w-5 h-5" />
                Create Job
              </button>
              <Link
                href="/recruiter"
                className="px-4 py-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
              >
                ← Back
              </Link>
            </div>
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
                  Active
                </p>
                <p className="text-3xl font-bold text-slate-900 dark:text-white mt-2">
                  {stats.active}
                </p>
              </div>
              <div className="p-3 bg-gradient-to-br from-green-400 to-emerald-400 rounded-xl">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg rounded-xl shadow-lg p-6 border border-rose-100 dark:border-slate-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 dark:text-slate-400 text-sm font-medium">
                  Drafts
                </p>
                <p className="text-3xl font-bold text-slate-900 dark:text-white mt-2">
                  {stats.draft}
                </p>
              </div>
              <div className="p-3 bg-gradient-to-br from-amber-400 to-orange-400 rounded-xl">
                <Clock className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg rounded-xl shadow-lg p-6 border border-rose-100 dark:border-slate-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 dark:text-slate-400 text-sm font-medium">
                  Closed
                </p>
                <p className="text-3xl font-bold text-slate-900 dark:text-white mt-2">
                  {stats.closed}
                </p>
              </div>
              <div className="p-3 bg-gradient-to-br from-red-400 to-rose-400 rounded-xl">
                <XCircle className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 mb-6">
          {["all", "active", "draft", "closed", "archived"].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status as any)}
              className={`px-4 py-2 rounded-lg font-medium capitalize transition-all ${
                filter === status
                  ? "bg-gradient-to-r from-rose-500 to-orange-500 text-white shadow-lg"
                  : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700"
              }`}
            >
              {status} ({status === "all" ? jobs.length : jobs.filter(j => j.status === status).length})
            </button>
          ))}
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
              No job postings yet
            </h3>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              Create your first job posting to start attracting talent
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-rose-500 to-orange-500 hover:from-rose-600 hover:to-orange-600 text-white font-medium rounded-lg transition-all shadow-lg hover:shadow-xl"
            >
              <Plus className="w-5 h-5" />
              Create Job Posting
            </button>
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
                      <Briefcase className="w-8 h-8 text-rose-600 dark:text-rose-400" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                            {job.title}
                          </h3>
                          <p className="text-slate-600 dark:text-slate-400 mt-1">
                            {job.department}
                          </p>
                        </div>
                        <div className={`flex items-center gap-2 px-3 py-1 rounded-lg ${getStatusColor(job.status)}`}>
                          {getStatusIcon(job.status)}
                          <span className="text-sm font-medium capitalize">{job.status}</span>
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
                        <div className="text-sm text-slate-600 dark:text-slate-400">
                          Posted {new Date(job.posted_date).toLocaleDateString()}
                        </div>
                      </div>

                      {/* Stats */}
                      <div className="grid grid-cols-3 gap-4 mt-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                        <div>
                          <p className="text-xs text-slate-600 dark:text-slate-400">Applications</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Users className="w-4 h-4 text-rose-600" />
                            <span className="text-lg font-bold text-slate-900 dark:text-white">
                              {job.applications}
                            </span>
                          </div>
                        </div>
                        <div>
                          <p className="text-xs text-slate-600 dark:text-slate-400">Views</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Eye className="w-4 h-4 text-amber-600" />
                            <span className="text-lg font-bold text-slate-900 dark:text-white">
                              {job.views}
                            </span>
                          </div>
                        </div>
                        <div>
                          <p className="text-xs text-slate-600 dark:text-slate-400">Shortlisted</p>
                          <div className="flex items-center gap-2 mt-1">
                            <CheckCircle className="w-4 h-4 text-green-600" />
                            <span className="text-lg font-bold text-slate-900 dark:text-white">
                              {job.shortlisted}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 mt-4">
                        <Link
                          href={`/recruiter/jobs/${job.id}`}
                          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-rose-500 to-orange-500 hover:from-rose-600 hover:to-orange-600 text-white font-medium rounded-lg transition-all"
                        >
                          <Eye className="w-4 h-4" />
                          View Details
                        </Link>
                        <Link
                          href={`/recruiter/jobs/${job.id}/edit`}
                          className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-medium rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-all"
                        >
                          <Edit className="w-4 h-4" />
                          Edit
                        </Link>

                        {/* Status Actions */}
                        {job.status === "draft" && (
                          <button
                            onClick={() => handleStatusChange(job.id, "active")}
                            className="px-4 py-2 bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400 font-medium rounded-lg hover:bg-green-200 dark:hover:bg-green-900/30 transition-all"
                          >
                            Publish
                          </button>
                        )}
                        {job.status === "active" && (
                          <button
                            onClick={() => handleStatusChange(job.id, "closed")}
                            className="px-4 py-2 bg-amber-100 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 font-medium rounded-lg hover:bg-amber-200 dark:hover:bg-amber-900/30 transition-all"
                          >
                            Close
                          </button>
                        )}
                        {(job.status === "closed" || job.status === "draft") && (
                          <button
                            onClick={() => handleStatusChange(job.id, "archived")}
                            className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-medium rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
                          >
                            <Archive className="w-4 h-4" />
                            Archive
                          </button>
                        )}

                        <button
                          onClick={() => handleDelete(job.id)}
                          className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-red-300 dark:border-red-700 text-red-600 dark:text-red-400 font-medium rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-all ml-auto"
                        >
                          <Trash2 className="w-4 h-4" />
                          Delete
                        </button>
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
