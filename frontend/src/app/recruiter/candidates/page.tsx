"use client";

import { useState, useEffect } from "react";
import {
  Users,
  Search,
  Filter,
  Star,
  MapPin,
  Briefcase,
  Mail,
  Phone,
  Download,
  CheckCircle,
  XCircle,
  Eye,
  Award,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";

interface Candidate {
  id: number;
  name: string;
  email: string;
  phone: string;
  location: string;
  current_position: string;
  years_experience: number;
  skills: string[];
  match_score: number;
  status: "new" | "reviewed" | "shortlisted" | "rejected" | "interviewed";
  applied_date: string;
  resume_url: string;
}

/**
 * Recruiter Candidates Page
 * View and manage all candidates with filtering, ranking, and bulk actions
 */
export default function RecruiterCandidatesPage() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | Candidate["status"]>("all");
  const [sortBy, setSortBy] = useState<"match" | "recent" | "experience">("match");
  const [selectedCandidates, setSelectedCandidates] = useState<number[]>([]);

  useEffect(() => {
    loadCandidates();
  }, []);

  const loadCandidates = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:8000/api/recruiter/candidates", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setCandidates(data.candidates || []);
      }
    } catch (error) {
      console.error("Failed to load candidates:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (candidateId: number, status: Candidate["status"]) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:8000/api/recruiter/candidates/${candidateId}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status }),
        }
      );

      if (response.ok) {
        setCandidates(
          candidates.map((c) => (c.id === candidateId ? { ...c, status } : c))
        );
      }
    } catch (error) {
      console.error("Status change failed:", error);
    }
  };

  const handleBulkAction = async (action: "shortlist" | "reject") => {
    const status = action === "shortlist" ? "shortlisted" : "rejected";
    
    for (const id of selectedCandidates) {
      await handleStatusChange(id, status);
    }
    
    setSelectedCandidates([]);
  };

  const toggleSelectCandidate = (id: number) => {
    setSelectedCandidates((prev) =>
      prev.includes(id) ? prev.filter((cid) => cid !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedCandidates.length === filteredCandidates.length) {
      setSelectedCandidates([]);
    } else {
      setSelectedCandidates(filteredCandidates.map((c) => c.id));
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "new":
        return "bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400";
      case "reviewed":
        return "bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400";
      case "shortlisted":
        return "bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400";
      case "rejected":
        return "bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400";
      case "interviewed":
        return "bg-amber-100 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400";
      default:
        return "";
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

  // Filter and sort
  const filteredCandidates = candidates
    .filter((candidate) => {
      const matchesSearch =
        candidate.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        candidate.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        candidate.skills.some((s) =>
          s.toLowerCase().includes(searchQuery.toLowerCase())
        );
      const matchesStatus = statusFilter === "all" || candidate.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      if (sortBy === "match") return b.match_score - a.match_score;
      if (sortBy === "recent")
        return new Date(b.applied_date).getTime() - new Date(a.applied_date).getTime();
      if (sortBy === "experience") return b.years_experience - a.years_experience;
      return 0;
    });

  const stats = {
    total: candidates.length,
    new: candidates.filter((c) => c.status === "new").length,
    shortlisted: candidates.filter((c) => c.status === "shortlisted").length,
    interviewed: candidates.filter((c) => c.status === "interviewed").length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fef8f5] via-[#fff5f1] to-[#ffe8df] dark:from-[#1a1212] dark:via-[#2d2424] dark:to-[#1a1212]">
      {/* Header */}
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-b border-rose-100 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                Candidates
              </h1>
              <p className="mt-1 text-slate-600 dark:text-slate-400">
                View and manage all candidate applications
              </p>
            </div>
            <Link
              href="/recruiter"
              className="px-4 py-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              ← Back
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
                  Total Candidates
                </p>
                <p className="text-3xl font-bold text-slate-900 dark:text-white mt-2">
                  {stats.total}
                </p>
              </div>
              <div className="p-3 bg-gradient-to-br from-rose-400 to-orange-400 rounded-xl">
                <Users className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg rounded-xl shadow-lg p-6 border border-rose-100 dark:border-slate-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 dark:text-slate-400 text-sm font-medium">
                  New Applications
                </p>
                <p className="text-3xl font-bold text-slate-900 dark:text-white mt-2">
                  {stats.new}
                </p>
              </div>
              <div className="p-3 bg-gradient-to-br from-blue-400 to-indigo-400 rounded-xl">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg rounded-xl shadow-lg p-6 border border-rose-100 dark:border-slate-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 dark:text-slate-400 text-sm font-medium">
                  Shortlisted
                </p>
                <p className="text-3xl font-bold text-slate-900 dark:text-white mt-2">
                  {stats.shortlisted}
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
                  Interviewed
                </p>
                <p className="text-3xl font-bold text-slate-900 dark:text-white mt-2">
                  {stats.interviewed}
                </p>
              </div>
              <div className="p-3 bg-gradient-to-br from-amber-400 to-orange-400 rounded-xl">
                <Award className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg rounded-xl shadow-lg p-6 mb-6 border border-rose-100 dark:border-slate-700">
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search candidates by name, email, or skills..."
                className="w-full pl-11 pr-4 py-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent text-slate-900 dark:text-white"
              />
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="px-4 py-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent text-slate-900 dark:text-white"
            >
              <option value="all">All Status</option>
              <option value="new">New</option>
              <option value="reviewed">Reviewed</option>
              <option value="shortlisted">Shortlisted</option>
              <option value="rejected">Rejected</option>
              <option value="interviewed">Interviewed</option>
            </select>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-4 py-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent text-slate-900 dark:text-white"
            >
              <option value="match">Best Match</option>
              <option value="recent">Most Recent</option>
              <option value="experience">Most Experience</option>
            </select>
          </div>

          {/* Bulk Actions */}
          {selectedCandidates.length > 0 && (
            <div className="flex items-center gap-4 p-4 bg-rose-50 dark:bg-rose-900/20 rounded-lg border border-rose-200 dark:border-rose-800">
              <p className="text-sm font-medium text-slate-900 dark:text-white">
                {selectedCandidates.length} candidate(s) selected
              </p>
              <div className="flex gap-2 ml-auto">
                <button
                  onClick={() => handleBulkAction("shortlist")}
                  className="px-4 py-2 bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400 font-medium rounded-lg hover:bg-green-200 dark:hover:bg-green-900/30 transition-all"
                >
                  Shortlist All
                </button>
                <button
                  onClick={() => handleBulkAction("reject")}
                  className="px-4 py-2 bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 font-medium rounded-lg hover:bg-red-200 dark:hover:bg-red-900/30 transition-all"
                >
                  Reject All
                </button>
                <button
                  onClick={() => setSelectedCandidates([])}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-medium rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
                >
                  Clear
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Candidates List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-rose-500 border-t-transparent"></div>
            <p className="mt-4 text-slate-600 dark:text-slate-400">Loading candidates...</p>
          </div>
        ) : filteredCandidates.length === 0 ? (
          <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg rounded-xl shadow-lg p-12 border border-rose-100 dark:border-slate-700 text-center">
            <Users className="w-16 h-16 text-slate-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
              No candidates found
            </h3>
            <p className="text-slate-600 dark:text-slate-400">
              Try adjusting your search or filters
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Select All */}
            <div className="flex items-center gap-2 px-4">
              <input
                type="checkbox"
                checked={selectedCandidates.length === filteredCandidates.length}
                onChange={toggleSelectAll}
                className="w-4 h-4 text-rose-600 border-slate-300 rounded focus:ring-rose-500"
              />
              <span className="text-sm text-slate-600 dark:text-slate-400">
                Select all candidates
              </span>
            </div>

            {filteredCandidates.map((candidate) => (
              <div
                key={candidate.id}
                className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg rounded-xl shadow-lg p-6 border border-rose-100 dark:border-slate-700 hover:shadow-xl transition-all"
              >
                <div className="flex items-start gap-4">
                  {/* Checkbox */}
                  <input
                    type="checkbox"
                    checked={selectedCandidates.includes(candidate.id)}
                    onChange={() => toggleSelectCandidate(candidate.id)}
                    className="mt-1 w-4 h-4 text-rose-600 border-slate-300 rounded focus:ring-rose-500"
                  />

                  {/* Avatar */}
                  <div className="p-3 bg-gradient-to-br from-rose-100 to-orange-100 dark:from-rose-900/20 dark:to-orange-900/20 rounded-lg">
                    <Users className="w-8 h-8 text-rose-600 dark:text-rose-400" />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                          {candidate.name}
                        </h3>
                        <p className="text-slate-600 dark:text-slate-400 mt-1">
                          {candidate.current_position}
                        </p>
                      </div>

                      {/* Match Score */}
                      <div
                        className={`px-4 py-2 bg-gradient-to-r ${getMatchBgColor(
                          candidate.match_score
                        )} rounded-lg shadow-lg`}
                      >
                        <div className="text-center">
                          <p className="text-2xl font-bold text-white">
                            {candidate.match_score}%
                          </p>
                          <p className="text-xs text-white/80">Match</p>
                        </div>
                      </div>
                    </div>

                    {/* Contact Info */}
                    <div className="flex flex-wrap items-center gap-4 mt-3">
                      <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                        <Mail className="w-4 h-4" />
                        <span className="text-sm">{candidate.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                        <Phone className="w-4 h-4" />
                        <span className="text-sm">{candidate.phone}</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                        <MapPin className="w-4 h-4" />
                        <span className="text-sm">{candidate.location}</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                        <Briefcase className="w-4 h-4" />
                        <span className="text-sm">{candidate.years_experience} years exp</span>
                      </div>
                    </div>

                    {/* Skills */}
                    <div className="mt-4 flex flex-wrap gap-2">
                      {candidate.skills.slice(0, 6).map((skill, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-sm rounded-full"
                        >
                          {skill}
                        </span>
                      ))}
                      {candidate.skills.length > 6 && (
                        <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-sm rounded-full">
                          +{candidate.skills.length - 6} more
                        </span>
                      )}
                    </div>

                    {/* Status and Actions */}
                    <div className="mt-6 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span
                          className={`px-3 py-1 rounded-lg text-sm font-medium capitalize ${getStatusColor(
                            candidate.status
                          )}`}
                        >
                          {candidate.status}
                        </span>
                        <span className="text-sm text-slate-600 dark:text-slate-400">
                          Applied {new Date(candidate.applied_date).toLocaleDateString()}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Link
                          href={`/recruiter/candidates/${candidate.id}`}
                          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-rose-500 to-orange-500 hover:from-rose-600 hover:to-orange-600 text-white font-medium rounded-lg transition-all"
                        >
                          <Eye className="w-4 h-4" />
                          View Profile
                        </Link>
                        <a
                          href={candidate.resume_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-medium rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-all"
                        >
                          <Download className="w-4 h-4" />
                          Resume
                        </a>

                        {candidate.status !== "shortlisted" && (
                          <button
                            onClick={() => handleStatusChange(candidate.id, "shortlisted")}
                            className="px-4 py-2 bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400 font-medium rounded-lg hover:bg-green-200 dark:hover:bg-green-900/30 transition-all"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                        )}

                        {candidate.status !== "rejected" && (
                          <button
                            onClick={() => handleStatusChange(candidate.id, "rejected")}
                            className="px-4 py-2 bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 font-medium rounded-lg hover:bg-red-200 dark:hover:bg-red-900/30 transition-all"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        )}
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
