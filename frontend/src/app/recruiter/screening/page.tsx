"use client";

import { useState } from "react";
import {
  Upload,
  FileText,
  Download,
  Trash2,
  TrendingUp,
  Users,
  CheckCircle,
  Award,
  Brain,
  Zap,
} from "lucide-react";
import Link from "next/link";

interface Resume {
  id: string;
  name: string;
  score: number;
  skills: string[];
  experience: number;
  education: string;
  status: "pending" | "parsed" | "scored";
}

/**
 * Recruiter Resume Screening Page
 * Bulk upload and AI-powered resume screening
 */
export default function RecruiterScreeningPage() {
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [processing, setProcessing] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const handleFiles = async (files: FileList) => {
    setProcessing(true);

    const formData = new FormData();
    Array.from(files).forEach((file) => {
      formData.append("files", file);
    });

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        "http://localhost:8000/api/recruiter/screening/upload",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (response.ok) {
        const data = await response.json();
        setResumes([...resumes, ...data.resumes]);
      }
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setProcessing(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  };

  const handleDelete = (id: string) => {
    setResumes(resumes.filter((r) => r.id !== id));
  };

  const handleExport = () => {
    const csv = [
      ["Name", "Score", "Experience", "Education", "Skills"],
      ...resumes.map((r) => [
        r.name,
        r.score.toString(),
        `${r.experience} years`,
        r.education,
        r.skills.join("; "),
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `screening-results-${new Date().toISOString()}.csv`;
    a.click();
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600 dark:text-green-400";
    if (score >= 60) return "text-amber-600 dark:text-amber-400";
    return "text-rose-600 dark:text-rose-400";
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return "from-green-500 to-emerald-500";
    if (score >= 60) return "from-amber-500 to-orange-500";
    return "from-rose-500 to-orange-500";
  };

  const stats = {
    total: resumes.length,
    highScore: resumes.filter((r) => r.score >= 80).length,
    mediumScore: resumes.filter((r) => r.score >= 60 && r.score < 80).length,
    avgScore:
      resumes.length > 0
        ? Math.round(resumes.reduce((acc, r) => acc + r.score, 0) / resumes.length)
        : 0,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fef8f5] via-[#fff5f1] to-[#ffe8df] dark:from-[#1a1212] dark:via-[#2d2424] dark:to-[#1a1212]">
      {/* Header */}
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-b border-rose-100 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                Resume Screening
              </h1>
              <p className="mt-1 text-slate-600 dark:text-slate-400">
                AI-powered bulk resume parsing and ranking
              </p>
            </div>
            <Link
              href="/recruiter"
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
                  Total Resumes
                </p>
                <p className="text-3xl font-bold text-slate-900 dark:text-white mt-2">
                  {stats.total}
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
                  High Score (80+)
                </p>
                <p className="text-3xl font-bold text-slate-900 dark:text-white mt-2">
                  {stats.highScore}
                </p>
              </div>
              <div className="p-3 bg-gradient-to-br from-green-400 to-emerald-400 rounded-xl">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg rounded-xl shadow-lg p-6 border border-rose-100 dark:border-slate-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 dark:text-slate-400 text-sm font-medium">
                  Medium Score (60-79)
                </p>
                <p className="text-3xl font-bold text-slate-900 dark:text-white mt-2">
                  {stats.mediumScore}
                </p>
              </div>
              <div className="p-3 bg-gradient-to-br from-amber-400 to-orange-400 rounded-xl">
                <Award className="w-8 h-8 text-white" />
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
                  {stats.avgScore}%
                </p>
              </div>
              <div className="p-3 bg-gradient-to-br from-purple-400 to-pink-400 rounded-xl">
                <Brain className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Upload Area */}
        <div
          className={`bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg rounded-xl shadow-lg p-8 mb-8 border-2 border-dashed transition-all ${
            dragActive
              ? "border-rose-500 bg-rose-50 dark:bg-rose-900/20"
              : "border-rose-200 dark:border-rose-800"
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <div className="text-center">
            <div className="mx-auto w-16 h-16 mb-6 relative">
              <div className="absolute inset-0 bg-gradient-to-r from-rose-400 to-orange-400 rounded-xl blur-md opacity-50"></div>
              <div className="relative p-4 bg-gradient-to-br from-rose-400 to-orange-400 rounded-xl">
                <Upload className="w-8 h-8 text-white" />
              </div>
            </div>

            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
              Upload Resumes for AI Screening
            </h3>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              Drag and drop multiple resumes here, or click to browse
            </p>

            <label className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-rose-500 to-orange-500 hover:from-rose-600 hover:to-orange-600 text-white font-medium rounded-lg transition-all shadow-lg hover:shadow-xl cursor-pointer">
              <Upload className="w-5 h-5" />
              {processing ? "Processing..." : "Select Files"}
              <input
                type="file"
                multiple
                accept=".pdf,.doc,.docx"
                onChange={handleFileInput}
                className="hidden"
                disabled={processing}
              />
            </label>

            <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
              Supports PDF, DOC, DOCX (Max 10MB per file)
            </p>
          </div>
        </div>

        {/* AI Features */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg rounded-xl shadow-lg p-6 border border-rose-100 dark:border-slate-700">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-gradient-to-br from-rose-100 to-orange-100 dark:from-rose-900/20 dark:to-orange-900/20 rounded-lg">
                <Brain className="w-6 h-6 text-rose-600 dark:text-rose-400" />
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white">
                AI-Powered Parsing
              </h3>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Advanced NLP extracts skills, experience, education, and more from any resume format
            </p>
          </div>

          <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg rounded-xl shadow-lg p-6 border border-rose-100 dark:border-slate-700">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/20 dark:to-orange-900/20 rounded-lg">
                <Zap className="w-6 h-6 text-amber-600 dark:text-amber-400" />
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white">
                Instant Ranking
              </h3>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Automated scoring system ranks candidates based on job requirements and qualifications
            </p>
          </div>

          <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg rounded-xl shadow-lg p-6 border border-rose-100 dark:border-slate-700">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white">
                Bulk Processing
              </h3>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Process hundreds of resumes simultaneously with parallel AI analysis
            </p>
          </div>
        </div>

        {/* Results */}
        {resumes.length > 0 && (
          <>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                Screening Results
              </h2>
              <button
                onClick={handleExport}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-medium rounded-lg transition-all shadow-lg hover:shadow-xl"
              >
                <Download className="w-5 h-5" />
                Export CSV
              </button>
            </div>

            <div className="space-y-4">
              {resumes
                .sort((a, b) => b.score - a.score)
                .map((resume) => (
                  <div
                    key={resume.id}
                    className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg rounded-xl shadow-lg p-6 border border-rose-100 dark:border-slate-700 hover:shadow-xl transition-all"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4 flex-1">
                        <div className="p-3 bg-gradient-to-br from-rose-100 to-orange-100 dark:from-rose-900/20 dark:to-orange-900/20 rounded-lg">
                          <FileText className="w-8 h-8 text-rose-600 dark:text-rose-400" />
                        </div>

                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                                {resume.name}
                              </h3>
                              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                                {resume.experience} years experience • {resume.education}
                              </p>
                            </div>

                            {/* Score Badge */}
                            <div
                              className={`px-4 py-2 bg-gradient-to-r ${getScoreBgColor(
                                resume.score
                              )} rounded-lg shadow-lg`}
                            >
                              <div className="text-center">
                                <p className="text-2xl font-bold text-white">
                                  {resume.score}
                                </p>
                                <p className="text-xs text-white/80">Score</p>
                              </div>
                            </div>
                          </div>

                          {/* Skills */}
                          <div className="flex flex-wrap gap-2 mb-4">
                            {resume.skills.map((skill, index) => (
                              <span
                                key={index}
                                className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-sm rounded-full"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>

                          {/* Progress Bar */}
                          <div className="mb-4">
                            <div className="flex justify-between text-sm text-slate-600 dark:text-slate-400 mb-2">
                              <span>Match Quality</span>
                              <span className={getScoreColor(resume.score)}>
                                {resume.score >= 80
                                  ? "Excellent"
                                  : resume.score >= 60
                                  ? "Good"
                                  : "Fair"}
                              </span>
                            </div>
                            <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                              <div
                                className={`h-full bg-gradient-to-r ${getScoreBgColor(
                                  resume.score
                                )} transition-all`}
                                style={{ width: `${resume.score}%` }}
                              ></div>
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex items-center gap-2">
                            <button className="px-4 py-2 bg-gradient-to-r from-rose-500 to-orange-500 hover:from-rose-600 hover:to-orange-600 text-white font-medium rounded-lg transition-all">
                              View Details
                            </button>
                            <button className="px-4 py-2 bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400 font-medium rounded-lg hover:bg-green-200 dark:hover:bg-green-900/30 transition-all">
                              <CheckCircle className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => handleDelete(resume.id)}
                              className="px-4 py-2 bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 font-medium rounded-lg hover:bg-red-200 dark:hover:bg-red-900/30 transition-all"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
