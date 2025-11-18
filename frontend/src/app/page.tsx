"use client";

import { useState } from "react";
import { Upload, FileText, BarChart3, Users, Zap, Shield } from "lucide-react";
import ResumeUploader from "../components/ResumeUploader";
import Dashboard from "../components/Dashboard";
import ResumeMakerForm from "../components/ResumeMakerForm";

export default function Home() {
  const [activeTab, setActiveTab] = useState<"upload" | "dashboard" | "resume-maker">("upload");

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
                <FileText className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">AI Resume Screener</h1>
                <p className="text-sm text-gray-600">NLP-powered talent matching</p>
              </div>
            </div>
            <nav className="flex space-x-4">
              <button
                onClick={() => setActiveTab("upload")}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === "upload"
                    ? "bg-blue-600 text-white"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                }`}
              >
                Screen Resume
              </button>
              <button
                onClick={() => setActiveTab("resume-maker")}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === "resume-maker"
                    ? "bg-blue-600 text-white"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                }`}
              >
                Resume Maker
              </button>
              <button
                onClick={() => setActiveTab("dashboard")}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === "dashboard"
                    ? "bg-blue-600 text-white"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                }`}
              >
                Dashboard
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === "upload" ? (
          <ResumeUploader />
        ) : activeTab === "resume-maker" ? (
          <ResumeMakerForm />
        ) : (
          <Dashboard />
        )}
      </main>

      {/* Features Section */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Advanced AI-Powered Screening</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Leverage cutting-edge NLP and machine learning to find the perfect candidates for your roles
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center p-6 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100">
              <div className="bg-blue-600 p-3 rounded-full w-fit mx-auto mb-4">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Job Role Prediction</h3>
              <p className="text-gray-600">Automatically classify candidates based on their experience and skills</p>
            </div>
            <div className="text-center p-6 rounded-xl bg-gradient-to-br from-purple-50 to-purple-100">
              <div className="bg-purple-600 p-3 rounded-full w-fit mx-auto mb-4">
                <BarChart3 className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Skill Gap Analysis</h3>
              <p className="text-gray-600">Identify missing skills and provide actionable insights for development</p>
            </div>
            <div className="text-center p-6 rounded-xl bg-gradient-to-br from-green-50 to-green-100">
              <div className="bg-green-600 p-3 rounded-full w-fit mx-auto mb-4">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Bias Detection</h3>
              <p className="text-gray-600">Ensure fair hiring practices with automated bias detection</p>
            </div>
            <div className="text-center p-6 rounded-xl bg-gradient-to-br from-orange-50 to-orange-100">
              <div className="bg-orange-600 p-3 rounded-full w-fit mx-auto mb-4">
                <Users className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">ATS Optimization</h3>
              <p className="text-gray-600">Check resume compatibility with Applicant Tracking Systems</p>
            </div>
            <div className="text-center p-6 rounded-xl bg-gradient-to-br from-red-50 to-red-100">
              <div className="bg-red-600 p-3 rounded-full w-fit mx-auto mb-4">
                <FileText className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Semantic Matching</h3>
              <p className="text-gray-600">Advanced semantic similarity scoring beyond keyword matching</p>
            </div>
            <div className="text-center p-6 rounded-xl bg-gradient-to-br from-purple-50 to-purple-100">
              <div className="bg-purple-600 p-3 rounded-full w-fit mx-auto mb-4">
                <span className="text-white text-lg">🤖</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">AI Assistant</h3>
              <p className="text-gray-600">NVIDIA-powered chatbot for HR guidance and resume analysis</p>
            </div>
            <div className="text-center p-6 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100">
              <div className="bg-gray-600 p-3 rounded-full w-fit mx-auto mb-4">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Privacy First</h3>
              <p className="text-gray-600">GDPR-compliant data handling with encryption and anonymization</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
