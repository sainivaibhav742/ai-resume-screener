/**
 * Smart Hiring OS - Homepage Component
 * 
 * Main landing page featuring AI-powered resume screening and resume maker tools.
 * Uses a warm skin-tone color theme (rose, orange, amber) for a modern, inviting look.
 * 
 * Features:
 * - Tab-based interface for Resume Screening and Resume Maker
 * - Hero section with animated backgrounds and CTAs
 * - Feature showcase grid with 6 AI capabilities
 * - Statistics display
 * - Portal links to Candidate and Recruiter dashboards
 * - Responsive design with dark mode support
 */

"use client";

import { useState, useEffect } from "react";
import { Upload, FileText, BarChart3, Users, Zap, Shield, Sparkles, ArrowRight, CheckCircle, Star, TrendingUp, Target, Brain, Clock, Award, Briefcase } from "lucide-react";
import Link from "next/link";
import ResumeUploader from "../components/ResumeUploader";
import ResumeMakerForm from "../components/ResumeMakerForm";
import ThemeToggle from "../components/ThemeToggle";

export default function Home() {
  // State management for active tab and page load
  const [activeTab, setActiveTab] = useState<"upload" | "resume-maker">("upload");
  const [isLoaded, setIsLoaded] = useState(false);

  // Set loaded state on mount for animations
  useEffect(() => {
    setIsLoaded(true);
  }, []);

  // Tab configuration for main interface
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
    }
  ];

  // Feature cards data - showcases platform capabilities
  const features = [
    {
      icon: Brain,
      title: "AI-Powered Analysis",
      description: "Advanced NLP and machine learning for intelligent candidate evaluation",
      gradient: "from-rose-400 to-orange-400",
      delay: "0s"
    },
    {
      icon: Target,
      title: "Job Role Prediction",
      description: "Automatically classify candidates based on experience and skills",
      gradient: "from-amber-400 to-yellow-400",
      delay: "0.1s"
    },
    {
      icon: TrendingUp,
      title: "Skill Gap Analysis",
      description: "Identify missing skills and provide actionable development insights",
      gradient: "from-emerald-400 to-teal-400",
      delay: "0.2s"
    },
    {
      icon: Shield,
      title: "Bias Detection",
      description: "Ensure fair hiring practices with automated bias detection",
      gradient: "from-orange-400 to-red-400",
      delay: "0.3s"
    },
    {
      icon: Users,
      title: "ATS Optimization",
      description: "Check resume compatibility with Applicant Tracking Systems",
      gradient: "from-pink-400 to-rose-400",
      delay: "0.4s"
    },
    {
      icon: Sparkles,
      title: "AI Assistant",
      description: "NVIDIA-powered chatbot for HR guidance and resume analysis",
      gradient: "from-purple-400 to-pink-400",
      delay: "0.5s"
    }
  ];

  // Statistics to display platform achievements
  const stats = [
    { number: "99%", label: "Accuracy Rate", icon: CheckCircle, color: "text-emerald-500" },
    { number: "50K+", label: "Resumes Analyzed", icon: FileText, color: "text-rose-500" },
    { number: "24/7", label: "AI Availability", icon: Clock, color: "text-amber-500" },
    { number: "15+", label: "Languages Supported", icon: Star, color: "text-orange-500" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fef8f5] via-[#fff5f1] to-[#ffe8df] dark:from-[#1a1212] dark:via-[#2d2424] dark:to-[#1a1212] transition-colors duration-300">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background Elements - Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-rose-500/5 via-orange-500/5 to-amber-500/5 dark:from-rose-500/10 dark:via-orange-500/10 dark:to-amber-500/10"></div>
        <div className="absolute top-20 left-10 w-72 h-72 bg-rose-300/10 dark:bg-rose-300/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-amber-300/10 dark:bg-amber-300/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>

        {/* Floating Elements - Animated decorative dots */}
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-rose-400 rounded-full animate-bounce" style={{ animationDelay: '0s', animationDuration: '3s' }}></div>
        <div className="absolute top-1/3 right-1/3 w-3 h-3 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: '1s', animationDuration: '4s' }}></div>
        <div className="absolute bottom-1/3 left-1/3 w-2 h-2 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: '2s', animationDuration: '5s' }}></div>

        <div className="container mx-auto px-4 py-16 relative z-10">
          {/* Header - Brand logo and navigation */}
          <header className="flex items-center justify-between mb-16">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-rose-400 to-orange-400 rounded-2xl blur-md opacity-50"></div>
                <div className="relative bg-gradient-to-br from-rose-400 to-orange-400 p-3 rounded-2xl shadow-lg">
                  <Brain className="w-8 h-8 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-rose-600 via-orange-600 to-amber-600 bg-clip-text text-transparent">
                  Smart Hiring OS
                </h1>
                <p className="text-sm text-slate-600 dark:text-slate-400">AI-Powered Talent Intelligence</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <Link 
                href="/about" 
                className="px-4 py-2 rounded-lg font-medium text-slate-700 dark:text-slate-200 hover:bg-white/50 dark:hover:bg-slate-800/50 transition-all duration-200"
              >
                About
              </Link>
              <Link 
                href="/contact" 
                className="px-4 py-2 rounded-lg font-medium text-slate-700 dark:text-slate-200 hover:bg-white/50 dark:hover:bg-slate-800/50 transition-all duration-200"
              >
                Contact
              </Link>
              <div className="relative group">
                <button className="px-6 py-2.5 rounded-xl font-semibold text-slate-700 dark:text-slate-200 hover:bg-white/50 dark:hover:bg-slate-800/50 transition-all duration-200 border border-slate-200 dark:border-slate-700 flex items-center gap-2">
                  Login
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <Link href="/candidate-login" className="block px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors rounded-t-xl text-sm font-medium text-blue-600 dark:text-blue-400">
                    🧑 Candidate Login
                  </Link>
                  <Link href="/recruiter-login" className="block px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors rounded-b-xl text-sm font-medium text-emerald-600 dark:text-emerald-400">
                    🏢 Recruiter Login
                  </Link>
                </div>
              </div>
              <Link 
                href="/signup" 
                className="px-6 py-2.5 rounded-xl font-semibold bg-gradient-to-r from-rose-500 to-orange-500 text-white hover:from-rose-600 hover:to-orange-600 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Sign Up
              </Link>
              <ThemeToggle />
            </div>
          </header>

          {/* Hero Content */}
          <div className="max-w-5xl mx-auto text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-rose-100 to-amber-100 dark:from-rose-900/30 dark:to-amber-900/30 rounded-full mb-8 border border-rose-200 dark:border-rose-800">
              <Sparkles className="w-4 h-4 text-rose-600 dark:text-rose-400" />
              <span className="text-sm font-medium text-rose-700 dark:text-rose-300">Powered by NVIDIA AI & Advanced NLP</span>
            </div>

            <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-rose-600 via-orange-600 to-amber-600 bg-clip-text text-transparent">
                Hire Smarter,
              </span>
              <br />
              <span className="text-slate-800 dark:text-slate-100">Not Harder</span>
            </h2>

            <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-400 mb-12 max-w-3xl mx-auto leading-relaxed">
              Transform your hiring process with AI-powered resume screening, intelligent job matching, and data-driven insights. 
              <span className="font-semibold text-rose-600 dark:text-rose-400"> Find the perfect fit, every time.</span>
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-4 mb-16">
              <button 
                onClick={() => setActiveTab("upload")}
                className="group px-8 py-4 bg-gradient-to-r from-rose-500 to-orange-500 text-white rounded-xl font-semibold text-lg hover:from-rose-600 hover:to-orange-600 transition-all duration-300 shadow-lg hover:shadow-2xl hover:scale-105 flex items-center gap-2"
              >
                <Upload className="w-5 h-5" />
                Screen Resume Now
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              
              <button 
                onClick={() => setActiveTab("resume-maker")}
                className="px-8 py-4 bg-white/80 dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 rounded-xl font-semibold text-lg hover:bg-white dark:hover:bg-slate-800 transition-all duration-300 shadow-lg hover:shadow-xl border border-slate-200 dark:border-slate-700 flex items-center gap-2"
              >
                <FileText className="w-5 h-5" />
                Create Resume
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
              {stats.map((stat, index) => (
                <div 
                  key={index}
                  className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-2xl p-6 border border-slate-200 dark:border-slate-700 hover:shadow-xl transition-all duration-300 hover:scale-105"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <stat.icon className={`w-8 h-8 ${stat.color} mx-auto mb-3`} />
                  <div className="text-3xl font-bold bg-gradient-to-r from-rose-600 to-orange-600 bg-clip-text text-transparent mb-1">
                    {stat.number}
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-400 font-medium">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h3 className="text-4xl font-bold mb-4 bg-gradient-to-r from-rose-600 to-orange-600 bg-clip-text text-transparent">
            Powerful AI Features
          </h3>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Everything you need to make smarter hiring decisions, powered by cutting-edge AI technology
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-2xl p-8 border border-slate-200 dark:border-slate-700 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
              style={{ animationDelay: feature.delay }}
            >
              <div className={`inline-flex p-4 bg-gradient-to-br ${feature.gradient} rounded-2xl mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon className="w-8 h-8 text-white" />
              </div>
              <h4 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-3">
                {feature.title}
              </h4>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Main Content - Tabs */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          {/* Tab Navigation */}
          <div className="flex flex-wrap gap-4 justify-center mb-12">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`group flex items-center gap-3 px-8 py-4 rounded-2xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl ${
                    activeTab === tab.id
                      ? "bg-gradient-to-r from-rose-500 to-orange-500 text-white scale-105"
                      : "bg-white/80 dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 hover:scale-105 border border-slate-200 dark:border-slate-700"
                  }`}
                >
                  <Icon className={`w-6 h-6 ${activeTab === tab.id ? "animate-pulse" : "group-hover:scale-110 transition-transform"}`} />
                  <div className="text-left">
                    <div className="text-lg">{tab.label}</div>
                    <div className={`text-xs ${activeTab === tab.id ? "text-rose-100" : "text-slate-500 dark:text-slate-400"}`}>
                      {tab.description}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Tab Content */}
          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
            <div className={`transition-all duration-500 ${activeTab === "upload" ? "opacity-100" : "opacity-0 h-0 overflow-hidden"}`}>
              {activeTab === "upload" && (
                <div className="p-8">
                  <ResumeUploader />
                </div>
              )}
            </div>

            <div className={`transition-all duration-500 ${activeTab === "resume-maker" ? "opacity-100" : "opacity-0 h-0 overflow-hidden"}`}>
              {activeTab === "resume-maker" && (
                <div className="p-8">
                  <ResumeMakerForm />
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Portal Links Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Candidate Portal */}
            <Link href="/candidate" className="group">
              <div className="relative overflow-hidden bg-gradient-to-br from-rose-500 to-orange-500 rounded-3xl p-8 shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12"></div>
                
                <div className="relative z-10">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="p-4 bg-white/20 backdrop-blur-sm rounded-2xl">
                      <Award className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="text-3xl font-bold text-white">Candidate Portal</h3>
                  </div>
                  
                  <p className="text-rose-50 mb-6 text-lg leading-relaxed">
                    Build your perfect resume, discover matching opportunities, track applications, and get AI-powered career guidance.
                  </p>
                  
                  <div className="flex items-center gap-2 text-white font-semibold">
                    Get Started
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                  </div>
                </div>
              </div>
            </Link>

            {/* Recruiter Portal */}
            <Link href="/recruiter" className="group">
              <div className="relative overflow-hidden bg-gradient-to-br from-amber-500 to-yellow-500 rounded-3xl p-8 shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12"></div>
                
                <div className="relative z-10">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="p-4 bg-white/20 backdrop-blur-sm rounded-2xl">
                      <Briefcase className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="text-3xl font-bold text-white">Recruiter Portal</h3>
                  </div>
                  
                  <p className="text-amber-50 mb-6 text-lg leading-relaxed">
                    Post jobs, screen candidates with AI, rank talent automatically, manage your team, and make data-driven hiring decisions.
                  </p>
                  
                  <div className="flex items-center gap-2 text-white font-semibold">
                    Start Hiring
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

    
    </div>
  );
}
