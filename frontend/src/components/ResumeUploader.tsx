"use client";

import { useState, useRef } from "react";
import { Upload, FileText, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import axios from "axios";

interface ScreeningResult {
  resume_data: {
    name: string;
    skills: string[];
    experience_years: number;
    education: string;
    contact: string;
    raw_text: string;
  };
  predicted_role: string;
  skill_gap: {
    present_skills: string[];
    missing_skills: string[];
    gap_score: number;
  };
  ats_optimization: {
    keyword_coverage: number;
    length_ok: boolean;
    has_contact: boolean;
    has_experience: boolean;
    ats_score: number;
  };
  language_tone: {
    sentiment_score: number;
    formality_score: number;
    tone: string;
  };
  bias_detection: {
    biased_terms: string[];
    bias_score: number;
    bias_level: string;
  };
  fit_score: number;
  recommendation: string;
  ai_summary: string;
  ai_analysis: string;
}

export default function ResumeUploader() {
  const [file, setFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState("");
  const [jobId, setJobId] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<ScreeningResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && (selectedFile.type === "application/pdf" || selectedFile.name.endsWith('.docx'))) {
      setFile(selectedFile);
      setError(null);
    } else {
      setError("Please select a PDF or DOCX file");
      setFile(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !jobDescription.trim()) {
      setError("Please select a file and enter a job description");
      return;
    }

    setIsLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("job_description", jobDescription);
    if (jobId.trim()) {
      formData.append("job_id", jobId);
    }

    try {
      const response = await axios.post("http://127.0.0.1:8001/screen-resume", formData);
      setResult(response.data);
    } catch (err) {
      setError("Failed to screen resume. Please check if the backend is running.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 70) return "text-green-600 bg-green-100";
    if (score >= 50) return "text-yellow-600 bg-yellow-100";
    return "text-red-600 bg-red-100";
  };

  const getRecommendationColor = (recommendation: string) => {
    if (recommendation.includes("Strong")) return "text-green-600";
    if (recommendation.includes("Moderate")) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Screen Resume</h2>
          <p className="text-gray-600">Upload a resume and enter job requirements to get AI-powered analysis</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* File Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Resume File (PDF or DOCX)
            </label>
            <div
              className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.docx"
                onChange={handleFileChange}
                className="hidden"
              />
              {file ? (
                <div className="flex items-center justify-center space-x-3">
                  <FileText className="h-8 w-8 text-blue-600" />
                  <div className="text-left">
                    <p className="font-medium text-gray-900">{file.name}</p>
                    <p className="text-sm text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                </div>
              ) : (
                <div>
                  <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Click to upload or drag and drop</p>
                  <p className="text-sm text-gray-500">PDF or DOCX files only</p>
                </div>
              )}
            </div>
          </div>

          {/* Job Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Job Description
            </label>
            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Enter the job description, requirements, and desired skills..."
              className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              required
            />
          </div>

          {/* Job ID (Optional) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Job ID (Optional)
            </label>
            <input
              type="text"
              value={jobId}
              onChange={(e) => setJobId(e.target.value)}
              placeholder="Enter job posting ID to associate this screening..."
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="flex items-center space-x-2 p-4 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="h-5 w-5 text-red-600" />
              <p className="text-red-700">{error}</p>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading || !file || !jobDescription.trim()}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-6 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center space-x-3 shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-6 w-6 animate-spin" />
                <span className="text-lg">AI Analysis in Progress...</span>
              </>
            ) : (
              <>
                <Upload className="h-6 w-6" />
                <span className="text-lg">Analyze with AI</span>
              </>
            )}
          </button>

          {/* Quick Job Posting */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Quick Job Posting</h4>
            <p className="text-xs text-gray-600 mb-3">Create a job posting to organize screenings</p>
            <button
              type="button"
              onClick={() => window.open('/job-posting', '_blank')}
              className="w-full bg-white border border-gray-300 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-50 transition-colors text-sm"
            >
              Create Job Posting
            </button>
          </div>

          {/* Bulk Upload */}
          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <h4 className="text-sm font-medium text-blue-700 mb-2">Bulk Resume Processing</h4>
            <p className="text-xs text-blue-600 mb-3">Process multiple resumes at once</p>
            <button
              type="button"
              onClick={() => alert('Bulk upload feature coming soon!')}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors text-sm"
            >
              Bulk Upload (Coming Soon)
            </button>
          </div>
        </form>

        {/* Results */}
        {result && (
          <div className="mt-8 space-y-6">
            <div className="border-t pt-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Analysis Results</h3>

              {/* Overall Score */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-8 rounded-2xl mb-8 shadow-lg">
                <div className="text-center">
                  <div className="mb-4">
                    <div className={`inline-flex items-center justify-center w-24 h-24 rounded-full font-bold text-2xl shadow-lg ${getScoreColor(result.fit_score)}`}>
                      {result.fit_score.toFixed(0)}%
                    </div>
                  </div>
                  <h4 className="text-xl font-bold text-gray-900 mb-2">AI Fit Score</h4>
                  <p className={`text-lg font-semibold ${getRecommendationColor(result.recommendation)}`}>
                    {result.recommendation}
                  </p>
                  <div className="mt-4 flex justify-center">
                    <div className="bg-white/50 px-4 py-2 rounded-full">
                      <span className="text-sm text-gray-600">Powered by NVIDIA AI</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Resume Data */}
                <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <FileText className="h-5 w-5 mr-2 text-blue-600" />
                    Resume Summary
                  </h4>
                  <div className="space-y-3">
                    <div>
                      <span className="font-medium text-gray-700">Name:</span>
                      <span className="ml-2 text-gray-900">{result.resume_data.name}</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Predicted Role:</span>
                      <span className="ml-2 text-blue-600 font-medium">{result.predicted_role}</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Experience:</span>
                      <span className="ml-2 text-gray-900">{result.resume_data.experience_years} years</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Skills:</span>
                      <div className="ml-2 mt-1 flex flex-wrap gap-1">
                        {result.resume_data.skills.map((skill, index) => (
                          <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Skill Gap Analysis */}
                <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <span className="mr-2">📊</span>
                    Skill Gap Analysis
                  </h4>
                  <div className="space-y-3">
                    <div>
                      <span className="font-medium text-gray-700">Present Skills:</span>
                      <div className="ml-2 mt-1 flex flex-wrap gap-1">
                        {result.skill_gap.present_skills.map((skill, index) => (
                          <span key={index} className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Missing Skills:</span>
                      <div className="ml-2 mt-1 flex flex-wrap gap-1">
                        {result.skill_gap.missing_skills.map((skill, index) => (
                          <span key={index} className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Gap Score:</span>
                      <span className="ml-2 text-gray-900">{(result.skill_gap.gap_score * 100).toFixed(1)}%</span>
                    </div>
                  </div>
                </div>

                {/* ATS Optimization */}
                <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <span className="mr-2">🎯</span>
                    ATS Optimization
                  </h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-700">Keyword Coverage:</span>
                      <span className="font-medium">{(result.ats_optimization.keyword_coverage * 100).toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-700">Length OK:</span>
                      <span className={`font-medium ${result.ats_optimization.length_ok ? 'text-green-600' : 'text-red-600'}`}>
                        {result.ats_optimization.length_ok ? 'Yes' : 'No'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-700">Has Contact:</span>
                      <span className={`font-medium ${result.ats_optimization.has_contact ? 'text-green-600' : 'text-red-600'}`}>
                        {result.ats_optimization.has_contact ? 'Yes' : 'No'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-700">ATS Score:</span>
                      <span className={`font-medium ${getScoreColor(result.ats_optimization.ats_score)} px-2 py-1 rounded`}>
                        {result.ats_optimization.ats_score.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </div>

                {/* Language & Tone */}
                <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <span className="mr-2">💬</span>
                    Language & Tone Analysis
                  </h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-700">Sentiment:</span>
                      <span className={`font-medium px-2 py-1 rounded text-xs ${
                        result.language_tone.sentiment_score > 0 ? 'bg-green-100 text-green-800' :
                        result.language_tone.sentiment_score < 0 ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {result.language_tone.tone}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-700">Formality Score:</span>
                      <span className="font-medium">{(result.language_tone.formality_score * 100).toFixed(1)}%</span>
                    </div>
                  </div>
                </div>

                {/* Bias Detection */}
                <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <span className="mr-2">⚖️</span>
                    Bias Detection
                  </h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-700">Bias Level:</span>
                      <span className={`font-medium px-2 py-1 rounded text-xs ${
                        result.bias_detection.bias_level === 'low' ? 'bg-green-100 text-green-800' :
                        result.bias_detection.bias_level === 'high' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {result.bias_detection.bias_level}
                      </span>
                    </div>
                    {result.bias_detection.biased_terms.length > 0 && (
                      <div>
                        <span className="font-medium text-gray-700">Biased Terms:</span>
                        <div className="ml-2 mt-1 flex flex-wrap gap-1">
                          {result.bias_detection.biased_terms.map((term, index) => (
                            <span key={index} className="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full">
                              {term}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* AI Summary & Analysis */}
                <div className="bg-gradient-to-br from-purple-50 to-blue-50 border border-purple-200 rounded-xl p-6 md:col-span-2 shadow-lg">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <span className="mr-2 text-2xl">🤖</span>
                    AI-Powered Analysis
                    <span className="ml-2 text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full">NVIDIA Llama</span>
                  </h4>
                  <div className="space-y-4">
                    <div>
                      <h5 className="font-medium text-gray-700 mb-2">Resume Summary:</h5>
                      <p className="text-gray-600 text-sm leading-relaxed bg-gray-50 p-3 rounded-lg">
                        {result.ai_summary}
                      </p>
                    </div>
                    <div>
                      <h5 className="font-medium text-gray-700 mb-2">Detailed Fit Analysis:</h5>
                      <p className="text-gray-600 text-sm leading-relaxed bg-blue-50 p-3 rounded-lg">
                        {result.ai_analysis}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
