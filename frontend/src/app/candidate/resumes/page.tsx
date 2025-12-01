"use client";

import { useState, useEffect } from "react";
import {
  FileText,
  Plus,
  Download,
  Trash2,
  Edit,
  Eye,
  Upload,
  CheckCircle,
  Clock,
  XCircle,
  Star,
} from "lucide-react";
import Link from "next/link";

interface Resume {
  id: number;
  title: string;
  file_name: string;
  file_url: string;
  status: "active" | "draft" | "archived";
  upload_date: string;
  score: number;
  matches: number;
}

/**
 * Candidate Resumes Page Component
 * Displays all candidate's resumes with options to create, edit, delete, and download
 */
export default function CandidateResumesPage() {
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [filter, setFilter] = useState<"all" | "active" | "draft" | "archived">("all");

  useEffect(() => {
    loadResumes();
  }, []);

  const loadResumes = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:8000/api/candidate/resumes", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setResumes(data.resumes || []);
      }
    } catch (error) {
      console.error("Failed to load resumes:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:8000/api/candidate/resumes/upload", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        await loadResumes();
      }
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this resume?")) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:8000/api/candidate/resumes/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        await loadResumes();
      }
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  const handleDownload = (resume: Resume) => {
    window.open(resume.file_url, "_blank");
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case "draft":
        return <Clock className="w-5 h-5 text-amber-600" />;
      case "archived":
        return <XCircle className="w-5 h-5 text-slate-400" />;
      default:
        return null;
    }
  };

  const filteredResumes = filter === "all" 
    ? resumes 
    : resumes.filter(r => r.status === filter);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fef8f5] via-[#fff5f1] to-[#ffe8df] dark:from-[#1a1212] dark:via-[#2d2424] dark:to-[#1a1212]">
      {/* Header */}
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-b border-rose-100 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                My Resumes
              </h1>
              <p className="mt-1 text-slate-600 dark:text-slate-400">
                Manage your resumes and track their performance
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/resume-maker"
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-medium rounded-lg transition-all shadow-lg hover:shadow-xl"
              >
                <Plus className="w-5 h-5" />
                Create New
              </Link>
              <label className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-rose-500 to-orange-500 hover:from-rose-600 hover:to-orange-600 text-white font-medium rounded-lg transition-all shadow-lg hover:shadow-xl cursor-pointer">
                <Upload className="w-5 h-5" />
                {uploading ? "Uploading..." : "Upload Resume"}
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileUpload}
                  className="hidden"
                  disabled={uploading}
                />
              </label>
              <Link
                href="/candidate"
                className="px-4 py-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
              >
                ← Back
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="flex items-center gap-2 mb-6">
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              filter === "all"
                ? "bg-gradient-to-r from-rose-500 to-orange-500 text-white shadow-lg"
                : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700"
            }`}
          >
            All ({resumes.length})
          </button>
          <button
            onClick={() => setFilter("active")}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              filter === "active"
                ? "bg-gradient-to-r from-rose-500 to-orange-500 text-white shadow-lg"
                : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700"
            }`}
          >
            Active ({resumes.filter(r => r.status === "active").length})
          </button>
          <button
            onClick={() => setFilter("draft")}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              filter === "draft"
                ? "bg-gradient-to-r from-rose-500 to-orange-500 text-white shadow-lg"
                : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700"
            }`}
          >
            Drafts ({resumes.filter(r => r.status === "draft").length})
          </button>
          <button
            onClick={() => setFilter("archived")}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              filter === "archived"
                ? "bg-gradient-to-r from-rose-500 to-orange-500 text-white shadow-lg"
                : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700"
            }`}
          >
            Archived ({resumes.filter(r => r.status === "archived").length})
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg rounded-xl shadow-lg p-6 border border-rose-100 dark:border-slate-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 dark:text-slate-400 text-sm font-medium">
                  Total Resumes
                </p>
                <p className="text-3xl font-bold text-slate-900 dark:text-white mt-2">
                  {resumes.length}
                </p>
              </div>
              <div className="p-3 bg-gradient-to-br from-rose-400 to-orange-400 rounded-xl">
                <FileText className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg rounded-xl shadow-lg p-6 border border-rose-100 dark:border-slate-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 dark:text-slate-400 text-sm font-medium">
                  Avg. Score
                </p>
                <p className="text-3xl font-bold text-slate-900 dark:text-white mt-2">
                  {resumes.length > 0
                    ? Math.round(resumes.reduce((acc, r) => acc + r.score, 0) / resumes.length)
                    : 0}
                  %
                </p>
              </div>
              <div className="p-3 bg-gradient-to-br from-amber-400 to-orange-400 rounded-xl">
                <Star className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg rounded-xl shadow-lg p-6 border border-rose-100 dark:border-slate-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 dark:text-slate-400 text-sm font-medium">
                  Total Matches
                </p>
                <p className="text-3xl font-bold text-slate-900 dark:text-white mt-2">
                  {resumes.reduce((acc, r) => acc + r.matches, 0)}
                </p>
              </div>
              <div className="p-3 bg-gradient-to-br from-green-400 to-emerald-400 rounded-xl">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Resumes List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-rose-500 border-t-transparent"></div>
            <p className="mt-4 text-slate-600 dark:text-slate-400">Loading resumes...</p>
          </div>
        ) : filteredResumes.length === 0 ? (
          <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg rounded-xl shadow-lg p-12 border border-rose-100 dark:border-slate-700 text-center">
            <FileText className="w-16 h-16 text-slate-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
              No resumes yet
            </h3>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              Start building your professional resume or upload an existing one
            </p>
            <div className="flex items-center justify-center gap-4">
              <Link
                href="/resume-maker"
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-rose-500 to-orange-500 hover:from-rose-600 hover:to-orange-600 text-white font-medium rounded-lg transition-all shadow-lg hover:shadow-xl"
              >
                <Plus className="w-5 h-5" />
                Create Resume
              </Link>
              <label className="flex items-center gap-2 px-6 py-3 bg-white dark:bg-slate-800 border-2 border-rose-300 dark:border-rose-700 text-rose-600 dark:text-rose-400 font-medium rounded-lg hover:bg-rose-50 dark:hover:bg-slate-700 transition-all cursor-pointer">
                <Upload className="w-5 h-5" />
                Upload Resume
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {filteredResumes.map((resume) => (
              <div
                key={resume.id}
                className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg rounded-xl shadow-lg p-6 border border-rose-100 dark:border-slate-700 hover:shadow-xl transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-gradient-to-br from-rose-100 to-orange-100 dark:from-rose-900/20 dark:to-orange-900/20 rounded-lg">
                      <FileText className="w-8 h-8 text-rose-600 dark:text-rose-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                        {resume.title}
                      </h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                        {resume.file_name}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        {getStatusIcon(resume.status)}
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300 capitalize">
                          {resume.status}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Resume Stats */}
                <div className="grid grid-cols-2 gap-4 mb-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                  <div>
                    <p className="text-xs text-slate-600 dark:text-slate-400">Score</p>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex-1 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-rose-500 to-orange-500 transition-all"
                          style={{ width: `${resume.score}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-bold text-slate-900 dark:text-white">
                        {resume.score}%
                      </span>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-slate-600 dark:text-slate-400">Matches</p>
                    <p className="text-lg font-bold text-slate-900 dark:text-white mt-1">
                      {resume.matches}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm text-slate-600 dark:text-slate-400 mb-4">
                  <span>Uploaded {new Date(resume.upload_date).toLocaleDateString()}</span>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-rose-500 to-orange-500 hover:from-rose-600 hover:to-orange-600 text-white font-medium rounded-lg transition-all">
                    <Eye className="w-4 h-4" />
                    View
                  </button>
                  <button className="flex items-center justify-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-medium rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-all">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDownload(resume)}
                    className="flex items-center justify-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-medium rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-all"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(resume.id)}
                    className="flex items-center justify-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-red-300 dark:border-red-700 text-red-600 dark:text-red-400 font-medium rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
