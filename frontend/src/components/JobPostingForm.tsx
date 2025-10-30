"use client";

import { useState } from "react";
import { Briefcase, Plus, Loader2 } from "lucide-react";
import axios from "axios";

export default function JobPostingForm() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [requirements, setRequirements] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [jobId, setJobId] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim() || !requirements.trim()) {
      return;
    }

    setIsLoading(true);

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("requirements", requirements);

    try {
      const response = await axios.post("http://127.0.0.1:8001/create-job-posting", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setJobId(response.data.job_id);
      setSuccess(true);
    } catch (err) {
      console.error("Failed to create job posting:", err);
    } finally {
      setIsLoading(false);
    }
  };

  if (success && jobId) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <div className="bg-green-100 p-3 rounded-full w-fit mx-auto mb-4">
            <Briefcase className="h-8 w-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Job Posting Created!</h2>
          <p className="text-gray-600 mb-4">Your job posting has been successfully created.</p>
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <p className="text-sm text-gray-600">Job ID:</p>
            <p className="font-mono text-lg font-bold text-gray-900">{jobId}</p>
          </div>
          <div className="space-y-3">
            <button
              onClick={() => {
                setSuccess(false);
                setJobId(null);
                setTitle("");
                setDescription("");
                setRequirements("");
              }}
              className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors"
            >
              Create Another Job Posting
            </button>
            <button
              onClick={() => window.close()}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Close Window
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Create Job Posting</h2>
          <p className="text-gray-600">Define a job posting to organize your resume screenings</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Job Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Job Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Senior Software Engineer"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          {/* Job Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Job Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the role, responsibilities, and company information..."
              className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              required
            />
          </div>

          {/* Requirements */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Requirements & Skills
            </label>
            <textarea
              value={requirements}
              onChange={(e) => setRequirements(e.target.value)}
              placeholder="List required skills, experience, qualifications..."
              className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading || !title.trim() || !description.trim() || !requirements.trim()}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center space-x-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Creating Job Posting...</span>
              </>
            ) : (
              <>
                <Plus className="h-5 w-5" />
                <span>Create Job Posting</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}