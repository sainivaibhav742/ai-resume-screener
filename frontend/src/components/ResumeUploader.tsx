"use client";

import { useState, useRef, useEffect } from "react";
import { Upload, FileText, Loader2, CheckCircle, AlertCircle, Sparkles, Zap, Target, TrendingUp, Shield, Users, Brain, ArrowRight, ArrowLeft, X, Download, Eye, Star, Award, Clock, Check } from "lucide-react";
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

type Step = 'upload' | 'details' | 'analyze' | 'results';

export default function ResumeUploader() {
  const [currentStep, setCurrentStep] = useState<Step>('upload');
  const [file, setFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState("");
  const [jobId, setJobId] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<ScreeningResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const steps = [
    { id: 'upload' as Step, label: 'Upload Resume', icon: Upload },
    { id: 'details' as Step, label: 'Job Details', icon: FileText },
    { id: 'analyze' as Step, label: 'AI Analysis', icon: Brain },
    { id: 'results' as Step, label: 'Results', icon: CheckCircle }
  ];

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

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && (droppedFile.type === "application/pdf" || droppedFile.name.endsWith('.docx'))) {
      setFile(droppedFile);
      setError(null);
    } else {
      setError("Please drop a PDF or DOCX file");
    }
  };

  const nextStep = () => {
    const stepOrder: Step[] = ['upload', 'details', 'analyze', 'results'];
    const currentIndex = stepOrder.indexOf(currentStep);
    if (currentIndex < stepOrder.length - 1) {
      setCurrentStep(stepOrder[currentIndex + 1]);
    }
  };

  const prevStep = () => {
    const stepOrder: Step[] = ['upload', 'details', 'analyze', 'results'];
    const currentIndex = stepOrder.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(stepOrder[currentIndex - 1]);
    }
  };

  const resetProcess = () => {
    setCurrentStep('upload');
    setFile(null);
    setJobDescription('');
    setJobId('');
    setResult(null);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !jobDescription.trim()) {
      setError("Please select a file and enter a job description");
      return;
    }

    setCurrentStep('analyze');
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
      setCurrentStep('results');
    } catch (err) {
      setError("Failed to screen resume. Please check if the backend is running.");
      setCurrentStep('details');
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400/10 dark:bg-blue-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-400/10 dark:bg-purple-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/50 dark:to-purple-900/50 rounded-full px-4 py-2 mb-6">
            <Brain className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">AI Analysis Engine</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="gradient-text">Screen Resume</span>
            <br />
            <span className="text-slate-900 dark:text-white">with Advanced AI</span>
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">
            Upload a resume and enter job requirements to get comprehensive AI-powered analysis
            with detailed insights and recommendations.
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-12">
          <div className="flex justify-center items-center space-x-4 mb-8">
            {steps.map((step, index) => {
              const StepIcon = step.icon;
              const isActive = currentStep === step.id;
              const isCompleted = steps.findIndex(s => s.id === currentStep) > index;
              const isAccessible = index <= steps.findIndex(s => s.id === currentStep);

              return (
                <div key={step.id} className="flex items-center">
                  <div className={`relative flex items-center justify-center w-12 h-12 rounded-full transition-all duration-300 ${
                    isCompleted
                      ? 'bg-green-500 text-white shadow-lg'
                      : isActive
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg scale-110'
                        : isAccessible
                          ? 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-600'
                  }`}>
                    {isCompleted ? (
                      <Check className="h-6 w-6" />
                    ) : (
                      <StepIcon className="h-6 w-6" />
                    )}
                    {isActive && (
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full animate-ping opacity-20"></div>
                    )}
                  </div>
                  <span className={`ml-3 font-medium transition-colors duration-300 ${
                    isActive ? 'text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-400'
                  }`}>
                    {step.label}
                  </span>
                  {index < steps.length - 1 && (
                    <ArrowRight className="h-4 w-4 mx-4 text-slate-400" />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 dark:border-slate-700/50 overflow-hidden min-h-[600px]">
          {/* Step Content */}
          <div className="p-8 md:p-12">
            {currentStep === 'upload' && (
              <div className="space-y-8">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Upload Your Resume</h2>
                  <p className="text-slate-600 dark:text-slate-300">Drag and drop your resume file or click to browse</p>
                </div>

                {/* File Upload Area */}
                <div
                  className={`relative border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 cursor-pointer group ${
                    isDragOver
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 scale-105'
                      : 'border-slate-300 dark:border-slate-600 hover:border-blue-400 hover:bg-slate-50 dark:hover:bg-slate-700/50'
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
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
                    <div className="space-y-4">
                      <div className="flex justify-center">
                        <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-6 rounded-2xl shadow-lg">
                          <FileText className="h-12 w-12 text-white" />
                        </div>
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{file.name}</h3>
                        <p className="text-slate-600 dark:text-slate-300 mb-4">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                        <div className="inline-flex items-center space-x-2 bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-200 px-4 py-2 rounded-full">
                          <CheckCircle className="h-4 w-4" />
                          <span className="text-sm font-medium">File ready for analysis</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <div className={`bg-gradient-to-r from-blue-500 to-purple-600 p-8 rounded-2xl shadow-lg mx-auto w-fit transition-transform duration-300 ${isDragOver ? 'scale-110' : 'group-hover:scale-110'}`}>
                        <Upload className="h-16 w-16 text-white" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                          {isDragOver ? 'Drop your resume here' : 'Drop your resume here'}
                        </h3>
                        <p className="text-slate-600 dark:text-slate-300 mb-4">or click to browse files</p>
                        <div className="flex justify-center space-x-4 text-sm text-slate-500 dark:text-slate-400">
                          <span className="flex items-center space-x-1">
                            <Check className="h-4 w-4 text-green-500" />
                            <span>PDF</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <Check className="h-4 w-4 text-green-500" />
                            <span>DOCX</span>
                          </span>
                          <span>Up to 10MB</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Animated border */}
                  <div className="absolute inset-0 rounded-2xl border-2 border-transparent bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="flex items-center space-x-3 p-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl">
                    <AlertCircle className="h-6 w-6 text-red-600 flex-shrink-0" />
                    <p className="text-red-700 dark:text-red-300 font-medium">{error}</p>
                  </div>
                )}

                {/* Navigation */}
                <div className="flex justify-end pt-6">
                  <button
                    onClick={nextStep}
                    disabled={!file}
                    className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    Next Step
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </button>
                </div>
              </div>
            )}

            {currentStep === 'details' && (
              <div className="space-y-8">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Job Details</h2>
                  <p className="text-slate-600 dark:text-slate-300">Provide detailed job requirements for accurate analysis</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                  {/* Job Description */}
                  <div className="space-y-4">
                    <label className="block text-lg font-semibold text-slate-900 dark:text-white">
                      Job Description
                      <span className="text-red-500 ml-1">*</span>
                    </label>
                    <div className="relative">
                      <textarea
                        value={jobDescription}
                        onChange={(e) => setJobDescription(e.target.value)}
                        placeholder="Describe the role, responsibilities, required skills, experience level, and any specific qualifications..."
                        className="w-full h-48 px-6 py-4 border border-slate-300 dark:border-slate-600 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 resize-none"
                        required
                      />
                      <div className="absolute bottom-4 right-4 text-sm text-slate-400">
                        {jobDescription.length} characters
                      </div>
                    </div>
                    <p className="text-sm text-slate-500 dark:text-slate-400">The more detailed your job description, the better the AI analysis will be.</p>
                  </div>

                  {/* Job ID (Optional) */}
                  <div className="space-y-4">
                    <label className="block text-lg font-semibold text-slate-900 dark:text-white">
                      Job ID (Optional)
                    </label>
                    <input
                      type="text"
                      value={jobId}
                      onChange={(e) => setJobId(e.target.value)}
                      placeholder="Enter job posting ID to associate this screening..."
                      className="w-full px-6 py-4 border border-slate-300 dark:border-slate-600 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400"
                    />
                  </div>

                  {/* Error Message */}
                  {error && (
                    <div className="flex items-center space-x-3 p-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl">
                      <AlertCircle className="h-6 w-6 text-red-600 flex-shrink-0" />
                      <p className="text-red-700 dark:text-red-300 font-medium">{error}</p>
                    </div>
                  )}

                  {/* Navigation */}
                  <div className="flex justify-between pt-6">
                    <button
                      type="button"
                      onClick={prevStep}
                      className="btn-secondary"
                    >
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Back
                    </button>
                    <button
                      type="submit"
                      disabled={!jobDescription.trim() || isLoading}
                      className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Analyzing...
                        </>
                      ) : (
                        <>
                          <Sparkles className="h-4 w-4 mr-2" />
                          Start Analysis
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {currentStep === 'analyze' && (
              <div className="space-y-8">
                <div className="text-center mb-8">
                  <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/50 dark:to-purple-900/50 rounded-full px-4 py-2 mb-4">
                    <Brain className="h-4 w-4 text-blue-600 animate-pulse" />
                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">AI Analysis in Progress...</span>
                  </div>
                  <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Analyzing Your Resume</h2>
                  <p className="text-slate-600 dark:text-slate-300">Our AI is processing your resume with advanced NLP algorithms</p>
                </div>

                {/* Analysis Progress */}
                <div className="max-w-md mx-auto">
                  <div className="bg-slate-200 dark:bg-slate-700 rounded-full h-3 mb-4">
                    <div className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full animate-pulse" style={{width: '60%'}}></div>
                  </div>
                  <div className="text-center text-sm text-slate-600 dark:text-slate-300">
                    Processing resume data...
                  </div>
                </div>

                {/* Analysis Steps */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                  {[
                    { icon: FileText, title: 'Resume Parsing', status: 'completed' },
                    { icon: Brain, title: 'AI Analysis', status: 'processing' },
                    { icon: Target, title: 'Skill Matching', status: 'pending' }
                  ].map((step, index) => {
                    const StepIcon = step.icon;
                    return (
                      <div key={index} className="text-center p-6 bg-slate-50 dark:bg-slate-700/50 rounded-2xl">
                        <div className={`w-12 h-12 mx-auto mb-4 rounded-full flex items-center justify-center ${
                          step.status === 'completed' ? 'bg-green-500' :
                          step.status === 'processing' ? 'bg-blue-500 animate-pulse' :
                          'bg-slate-300 dark:bg-slate-600'
                        }`}>
                          <StepIcon className="h-6 w-6 text-white" />
                        </div>
                        <h3 className="font-semibold text-slate-900 dark:text-white mb-2">{step.title}</h3>
                        <p className="text-sm text-slate-600 dark:text-slate-300">
                          {step.status === 'completed' ? '✓ Complete' :
                           step.status === 'processing' ? 'Processing...' :
                           'Waiting...'}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {currentStep === 'results' && result && (
              <div className="space-y-8">
                {/* Success Header */}
                <div className="text-center mb-8">
                  <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/50 dark:to-emerald-900/50 rounded-full px-4 py-2 mb-4">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-semibold text-green-700 dark:text-green-300">Analysis Complete</span>
                  </div>
                  <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">AI Analysis Results</h2>
                  <p className="text-slate-600 dark:text-slate-300">Comprehensive evaluation powered by NVIDIA AI</p>
                </div>

                {/* Overall Score */}
                <div className="bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-blue-900/20 dark:via-purple-900/20 dark:to-pink-900/20 p-8 rounded-3xl mb-8 shadow-xl border border-white/50 dark:border-slate-700/50 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-200/20 to-purple-200/20 rounded-full blur-2xl"></div>
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-pink-200/20 to-purple-200/20 rounded-full blur-2xl"></div>

                  <div className="text-center relative z-10">
                    <div className="mb-6">
                      <div className={`inline-flex items-center justify-center w-32 h-32 rounded-full font-bold text-3xl shadow-2xl border-4 border-white ${getScoreColor(result.fit_score)}`}>
                        {result.fit_score.toFixed(0)}%
                      </div>
                    </div>
                    <h4 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">AI Fit Score</h4>
                    <p className={`text-xl font-semibold mb-4 ${getRecommendationColor(result.recommendation)}`}>
                      {result.recommendation}
                    </p>
                    <div className="flex justify-center">
                      <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg">
                        <span className="text-sm text-slate-600 dark:text-slate-300 font-medium">Powered by NVIDIA Llama</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Results Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Resume Summary */}
                  <div className="card hover-lift">
                    <div className="p-8">
                      <div className="flex items-center space-x-3 mb-6">
                        <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-3 rounded-xl shadow-lg">
                          <FileText className="h-6 w-6 text-white" />
                        </div>
                        <h4 className="text-xl font-bold text-slate-900 dark:text-white">Resume Summary</h4>
                      </div>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                          <span className="font-semibold text-slate-700 dark:text-slate-300">Name:</span>
                          <span className="text-slate-900 dark:text-white font-medium">{result.resume_data.name}</span>
                        </div>
                        <div className="flex justify-between items-center p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                          <span className="font-semibold text-slate-700 dark:text-slate-300">Predicted Role:</span>
                          <span className="text-blue-600 dark:text-blue-400 font-bold">{result.predicted_role}</span>
                        </div>
                        <div className="flex justify-between items-center p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                          <span className="font-semibold text-slate-700 dark:text-slate-300">Experience:</span>
                          <span className="text-slate-900 dark:text-white font-medium">{result.resume_data.experience_years} years</span>
                        </div>
                        <div className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                          <span className="font-semibold text-slate-700 dark:text-slate-300 block mb-3">Skills:</span>
                          <div className="flex flex-wrap gap-2">
                            {result.resume_data.skills.map((skill, index) => (
                              <span key={index} className="px-3 py-1 bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200 text-sm rounded-full font-medium">
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Skill Gap Analysis */}
                  <div className="card hover-lift">
                    <div className="p-8">
                      <div className="flex items-center space-x-3 mb-6">
                        <div className="bg-gradient-to-r from-green-500 to-teal-600 p-3 rounded-xl shadow-lg">
                          <TrendingUp className="h-6 w-6 text-white" />
                        </div>
                        <h4 className="text-xl font-bold text-slate-900 dark:text-white">Skill Gap Analysis</h4>
                      </div>
                      <div className="space-y-4">
                        <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800">
                          <span className="font-semibold text-green-700 dark:text-green-300 block mb-3">Present Skills:</span>
                          <div className="flex flex-wrap gap-2">
                            {result.skill_gap.present_skills.map((skill, index) => (
                              <span key={index} className="px-3 py-1 bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-200 text-sm rounded-full font-medium">
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-800">
                          <span className="font-semibold text-red-700 dark:text-red-300 block mb-3">Missing Skills:</span>
                          <div className="flex flex-wrap gap-2">
                            {result.skill_gap.missing_skills.map((skill, index) => (
                              <span key={index} className="px-3 py-1 bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-200 text-sm rounded-full font-medium">
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="flex justify-between items-center p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                          <span className="font-semibold text-slate-700 dark:text-slate-300">Gap Score:</span>
                          <span className="text-slate-900 dark:text-white font-bold">{(result.skill_gap.gap_score * 100).toFixed(1)}%</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* ATS Optimization */}
                  <div className="card hover-lift">
                    <div className="p-8">
                      <div className="flex items-center space-x-3 mb-6">
                        <div className="bg-gradient-to-r from-cyan-500 to-blue-600 p-3 rounded-xl shadow-lg">
                          <Target className="h-6 w-6 text-white" />
                        </div>
                        <h4 className="text-xl font-bold text-slate-900 dark:text-white">ATS Optimization</h4>
                      </div>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                          <span className="text-slate-700 dark:text-slate-300">Keyword Coverage:</span>
                          <span className="font-bold text-slate-900 dark:text-white">{(result.ats_optimization.keyword_coverage * 100).toFixed(1)}%</span>
                        </div>
                        <div className="flex justify-between items-center p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                          <span className="text-slate-700 dark:text-slate-300">Length OK:</span>
                          <span className={`font-bold px-3 py-1 rounded-full text-sm ${result.ats_optimization.length_ok ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200' : 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-200'}`}>
                            {result.ats_optimization.length_ok ? 'Yes' : 'No'}
                          </span>
                        </div>
                        <div className="flex justify-between items-center p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                          <span className="text-slate-700 dark:text-slate-300">Has Contact:</span>
                          <span className={`font-bold px-3 py-1 rounded-full text-sm ${result.ats_optimization.has_contact ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200' : 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-200'}`}>
                            {result.ats_optimization.has_contact ? 'Yes' : 'No'}
                          </span>
                        </div>
                        <div className="flex justify-between items-center p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                          <span className="text-slate-700 dark:text-slate-300">ATS Score:</span>
                          <span className={`font-bold px-3 py-1 rounded-full text-sm ${getScoreColor(result.ats_optimization.ats_score)}`}>
                            {result.ats_optimization.ats_score.toFixed(1)}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Language & Tone */}
                  <div className="card hover-lift">
                    <div className="p-8">
                      <div className="flex items-center space-x-3 mb-6">
                        <div className="bg-gradient-to-r from-purple-500 to-pink-600 p-3 rounded-xl shadow-lg">
                          <Users className="h-6 w-6 text-white" />
                        </div>
                        <h4 className="text-xl font-bold text-slate-900 dark:text-white">Language & Tone Analysis</h4>
                      </div>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                          <span className="text-slate-700 dark:text-slate-300">Sentiment:</span>
                          <span className={`font-bold px-3 py-1 rounded-full text-sm ${
                            result.language_tone.sentiment_score > 0 ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200' :
                            result.language_tone.sentiment_score < 0 ? 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-200' :
                            'bg-gray-100 text-gray-800 dark:bg-gray-900/50 dark:text-gray-200'
                          }`}>
                            {result.language_tone.tone}
                          </span>
                        </div>
                        <div className="flex justify-between items-center p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                          <span className="text-slate-700 dark:text-slate-300">Formality Score:</span>
                          <span className="font-bold text-slate-900 dark:text-white">{(result.language_tone.formality_score * 100).toFixed(1)}%</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Bias Detection */}
                  <div className="card hover-lift">
                    <div className="p-8">
                      <div className="flex items-center space-x-3 mb-6">
                        <div className="bg-gradient-to-r from-orange-500 to-red-600 p-3 rounded-xl shadow-lg">
                          <Shield className="h-6 w-6 text-white" />
                        </div>
                        <h4 className="text-xl font-bold text-slate-900 dark:text-white">Bias Detection</h4>
                      </div>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                          <span className="text-slate-700 dark:text-slate-300">Bias Level:</span>
                          <span className={`font-bold px-3 py-1 rounded-full text-sm ${
                            result.bias_detection.bias_level === 'low' ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200' :
                            result.bias_detection.bias_level === 'high' ? 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-200' :
                            'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-200'
                          }`}>
                            {result.bias_detection.bias_level}
                          </span>
                        </div>
                        {result.bias_detection.biased_terms.length > 0 && (
                          <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-800">
                            <span className="font-semibold text-red-700 dark:text-red-300 block mb-3">Biased Terms:</span>
                            <div className="flex flex-wrap gap-2">
                              {result.bias_detection.biased_terms.map((term, index) => (
                                <span key={index} className="px-3 py-1 bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-200 text-sm rounded-full font-medium">
                                  {term}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* AI Summary & Analysis */}
                  <div className="card hover-lift lg:col-span-2">
                    <div className="p-8">
                      <div className="flex items-center space-x-3 mb-6">
                        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-3 rounded-xl shadow-lg">
                          <Brain className="h-6 w-6 text-white" />
                        </div>
                        <h4 className="text-xl font-bold text-slate-900 dark:text-white">AI-Powered Analysis</h4>
                        <span className="bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/50 dark:to-purple-900/50 text-blue-800 dark:text-blue-200 text-sm px-3 py-1 rounded-full font-medium">NVIDIA Llama</span>
                      </div>
                      <div className="space-y-6">
                        <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 p-6 rounded-2xl border border-blue-200 dark:border-blue-800">
                          <h5 className="font-bold text-slate-900 dark:text-white mb-3 flex items-center">
                            <FileText className="h-5 w-5 mr-2 text-blue-600" />
                            Resume Summary
                          </h5>
                          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                            {result.ai_summary}
                          </p>
                        </div>
                        <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 p-6 rounded-2xl border border-purple-200 dark:border-purple-800">
                          <h5 className="font-bold text-slate-900 dark:text-white mb-3 flex items-center">
                            <Zap className="h-5 w-5 mr-2 text-purple-600" />
                            Detailed Fit Analysis
                          </h5>
                          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                            {result.ai_analysis}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8 border-t border-slate-200 dark:border-slate-700">
                  <button
                    onClick={resetProcess}
                    className="btn-secondary"
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Start New Analysis
                  </button>
                  <button
                    onClick={() => window.print()}
                    className="btn-primary"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Export Report
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
