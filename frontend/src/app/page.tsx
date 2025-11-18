"use client";

import { useState, useEffect } from "react";
import { Upload, FileText, BarChart3, Users, Zap, Shield, Sparkles, ArrowRight, CheckCircle, Star, TrendingUp, Target, Brain, Clock } from "lucide-react";
import ResumeUploader from "../components/ResumeUploader";
import Dashboard from "../components/Dashboard";
import ResumeMakerForm from "../components/ResumeMakerForm";
import ThemeToggle from "../components/ThemeToggle";

export default function Home() {
  const [activeTab, setActiveTab] = useState<"upload" | "dashboard" | "resume-maker">("upload");
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const tabs = [
    {
      id: "upload" as const,
      label: "Screen Resume",
      icon: Upload,
      description: "AI-powered resume analysis"
    },
    {
      id: "resume-maker" as const,
      label: "Resume Maker",
      icon: FileText,
      description: "Create professional resumes"
    },
    {
      id: "dashboard" as const,
      label: "Dashboard",
      icon: BarChart3,
      description: "Analytics & insights"
    }
  ];

  const features = [
    {
      icon: Brain,
      title: "AI-Powered Analysis",
      description: "Advanced NLP and machine learning for intelligent candidate evaluation",
      gradient: "from-blue-500 to-purple-600",
      delay: "0s"
    },
    {
      icon: Target,
      title: "Job Role Prediction",
      description: "Automatically classify candidates based on experience and skills",
      gradient: "from-purple-500 to-pink-600",
      delay: "0.1s"
    },
    {
      icon: TrendingUp,
      title: "Skill Gap Analysis",
      description: "Identify missing skills and provide actionable development insights",
      gradient: "from-green-500 to-teal-600",
      delay: "0.2s"
    },
    {
      icon: Shield,
      title: "Bias Detection",
      description: "Ensure fair hiring practices with automated bias detection",
      gradient: "from-orange-500 to-red-600",
      delay: "0.3s"
    },
    {
      icon: Users,
      title: "ATS Optimization",
      description: "Check resume compatibility with Applicant Tracking Systems",
      gradient: "from-cyan-500 to-blue-600",
      delay: "0.4s"
    },
    {
      icon: Sparkles,
      title: "AI Assistant",
      description: "NVIDIA-powered chatbot for HR guidance and resume analysis",
      gradient: "from-indigo-500 to-purple-600",
      delay: "0.5s"
    }
  ];

  const stats = [
    { number: "99%", label: "Accuracy Rate", icon: CheckCircle },
    { number: "50K+", label: "Resumes Analyzed", icon: FileText },
    { number: "24/7", label: "AI Availability", icon: Clock },
    { number: "15+", label: "Languages Supported", icon: Star }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 transition-colors duration-300">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 via-purple-600/5 to-pink-600/5 dark:from-blue-600/10 dark:via-purple-600/10 dark:to-pink-600/10"></div>
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400/10 dark:bg-blue-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-400/10 dark:bg-purple-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>

        {/* Floating Elements */}
        <div className="absolute top-32 right-20 w-4 h-4 bg-blue-500 rounded-full animate-bounce opacity-60"></div>
        <div className="absolute top-48 left-1/4 w-6 h-6 bg-purple-500 rounded-full animate-bounce delay-300 opacity-40"></div>
        <div className="absolute bottom-32 left-20 w-3 h-3 bg-pink-500 rounded-full animate-bounce delay-700 opacity-50"></div>
        <div className="absolute top-1/3 right-1/3 w-5 h-5 bg-indigo-500 rounded-full animate-bounce delay-500 opacity-30"></div>
        <div className="absolute bottom-1/3 left-1/3 w-4 h-4 bg-cyan-500 rounded-full animate-bounce delay-900 opacity-45"></div>

        {/* Geometric Shapes */}
        <div className="absolute top-16 left-1/2 w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-400 rotate-45 animate-spin opacity-70"></div>
        <div className="absolute bottom-16 right-1/4 w-3 h-3 bg-gradient-to-r from-purple-400 to-pink-400 rotate-12 animate-spin delay-1000 opacity-60"></div>
        <div className="absolute top-1/4 right-10 w-2 h-2 bg-gradient-to-r from-pink-400 to-red-400 rotate-45 animate-spin delay-500 opacity-50"></div>

        {/* Header */}
        <header className={`relative z-10 transition-all duration-1000 ${isLoaded ? 'animate-fade-in-up' : 'opacity-0'}`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-2xl shadow-lg hover-glow transition-all duration-300">
                    <FileText className="h-8 w-8 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full animate-pulse"></div>
                </div>
                <div>
                  <h1 className="text-3xl font-bold gradient-text">AI Resume Screener</h1>
                  <p className="text-slate-600 dark:text-slate-400 font-medium">NLP-powered talent matching platform</p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                {/* Theme Toggle */}
                <ThemeToggle />

                {/* Navigation Tabs */}
                <nav className="hidden md:flex space-x-2 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl p-1 shadow-lg border border-white/20 dark:border-slate-700/50">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`relative px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center space-x-2 ${
                          isActive
                            ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg transform scale-105"
                            : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-slate-700/50"
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                        <span>{tab.label}</span>
                        {isActive && (
                          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl opacity-20 animate-pulse"></div>
                        )}
                      </button>
                    );
                  })}
                </nav>

                {/* Mobile Navigation */}
                <div className="md:hidden">
                  <select
                    value={activeTab}
                    onChange={(e) => setActiveTab(e.target.value as typeof activeTab)}
                    className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl px-4 py-2 shadow-lg border border-white/20 dark:border-slate-700/50 font-semibold text-slate-900 dark:text-white"
                  >
                    {tabs.map((tab) => (
                      <option key={tab.id} value={tab.id}>{tab.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Hero Content */}
        <div className={`relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 transition-all duration-1000 delay-300 ${isLoaded ? 'animate-fade-in-up' : 'opacity-0'}`}>
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center space-x-2 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-full px-4 py-2 mb-6 shadow-lg border border-white/20 dark:border-slate-700/50">
              <Sparkles className="h-4 w-4 text-yellow-500" />
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Powered by NVIDIA AI</span>
            </div>

            <h2 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              <span className="gradient-text">Revolutionize</span>
              <br />
              <span className="text-slate-900 dark:text-white">Your Hiring Process</span>
            </h2>

            <p className="text-xl text-slate-600 dark:text-slate-300 mb-8 max-w-2xl mx-auto leading-relaxed">
              Leverage cutting-edge AI to find the perfect candidates. Our platform combines advanced NLP,
              machine learning, and intelligent analysis to streamline your recruitment workflow.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <button
                onClick={() => setActiveTab("upload")}
                className="btn-primary group"
              >
                <span>Start Screening</span>
                <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={() => setActiveTab("resume-maker")}
                className="btn-secondary"
              >
                Create Resume
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div key={index} className="text-center">
                    <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-white/20 dark:border-slate-700/50 hover-lift">
                      <Icon className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-slate-900 dark:text-white mb-1">{stat.number}</div>
                      <div className="text-sm text-slate-600 dark:text-slate-300 font-medium">{stat.label}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className={`transition-all duration-1000 delay-500 ${isLoaded ? 'animate-fade-in' : 'opacity-0'}`}>
          {activeTab === "upload" ? (
            <ResumeUploader />
          ) : activeTab === "resume-maker" ? (
            <ResumeMakerForm />
          ) : (
            <Dashboard />
          )}
        </div>
      </main>

      {/* Features Section */}
      <section className="bg-gradient-to-br from-white via-blue-50/50 to-purple-50/50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 py-24 relative overflow-hidden transition-colors duration-300">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-10 left-10 w-32 h-32 border border-blue-300 dark:border-blue-700 rounded-full"></div>
          <div className="absolute top-40 right-20 w-24 h-24 border border-purple-300 dark:border-purple-700 rounded-full"></div>
          <div className="absolute bottom-20 left-1/4 w-20 h-20 border border-pink-300 dark:border-pink-700 rounded-full"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/50 dark:to-purple-900/50 rounded-full px-4 py-2 mb-6">
              <Zap className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Advanced Features</span>
            </div>

            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6">
              Why Choose Our
              <span className="gradient-text block">AI Platform?</span>
            </h2>

            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">
              Experience the future of recruitment with our comprehensive suite of AI-powered tools
              designed to transform how you find and evaluate talent.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className={`card group hover-lift`}
                  style={{ animationDelay: feature.delay }}
                >
                  <div className="p-8">
                    <div className={`w-16 h-16 bg-gradient-to-r ${feature.gradient} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                      <Icon className="h-8 w-8 text-white" />
                    </div>

                    <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors">
                      {feature.title}
                    </h3>

                    <p className="text-slate-600 leading-relaxed">
                      {feature.description}
                    </p>

                    <div className="mt-6 flex items-center text-blue-600 font-semibold group-hover:text-purple-600 transition-colors">
                      <span>Learn more</span>
                      <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-blue-600/20 to-purple-600/20"></div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Transform Your Hiring?
          </h2>

          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of HR professionals who have revolutionized their recruitment process
            with our AI-powered platform.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => setActiveTab("upload")}
              className="bg-white text-blue-600 font-bold py-4 px-8 rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
            >
              Get Started Free
            </button>
            <button className="border-2 border-white text-white font-bold py-4 px-8 rounded-2xl hover:bg-white hover:text-blue-600 transition-all duration-300">
              Schedule Demo
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
