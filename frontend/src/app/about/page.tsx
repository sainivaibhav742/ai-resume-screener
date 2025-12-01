"use client";

import { Brain, ArrowLeft, Target, Users, Zap, Shield, Award, Sparkles } from "lucide-react";
import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fef8f5] via-[#fff5f1] to-[#ffe8df] dark:from-[#1a1212] dark:via-[#2d2424] dark:to-[#1a1212]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link href="/" className="inline-flex items-center gap-3 mb-8 group">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-rose-400 to-orange-400 rounded-xl blur-md opacity-50"></div>
            <div className="relative p-2 bg-gradient-to-br from-rose-400 to-orange-400 rounded-xl shadow-lg">
              <Brain className="w-6 h-6 text-white" />
            </div>
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-rose-600 via-orange-600 to-amber-600 bg-clip-text text-transparent">
            Smart Hiring OS
          </span>
        </Link>

        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg rounded-2xl shadow-2xl p-8 md:p-12 border border-rose-100 dark:border-slate-700">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>

          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-rose-400 to-orange-400 rounded-2xl mb-6 shadow-lg">
              <Sparkles className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
              About Smart Hiring OS
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
              Revolutionizing recruitment with AI-powered intelligence and human insight
            </p>
          </div>

          {/* Mission Statement */}
          <div className="mb-16 p-8 bg-gradient-to-br from-rose-50 to-orange-50 dark:from-rose-900/20 dark:to-orange-900/20 rounded-2xl border border-rose-200 dark:border-rose-800">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-3">
              <Target className="w-8 h-8 text-rose-600" />
              Our Mission
            </h2>
            <p className="text-lg text-slate-700 dark:text-slate-300 leading-relaxed">
              We're on a mission to transform the hiring process by combining cutting-edge AI technology with human expertise. 
              Smart Hiring OS empowers recruiters and candidates to make better, faster, and more informed decisions, 
              reducing bias and improving matches that benefit both employers and job seekers.
            </p>
          </div>

          {/* Key Features */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-8 text-center">
              Why Choose Smart Hiring OS?
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 hover:shadow-xl transition-shadow">
                <div className="w-12 h-12 bg-gradient-to-br from-rose-400 to-orange-400 rounded-lg flex items-center justify-center mb-4">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                  NVIDIA AI Powered
                </h3>
                <p className="text-slate-600 dark:text-slate-400">
                  Leverage Llama 3.1 for intelligent resume screening, candidate matching, and conversational AI assistance.
                </p>
              </div>

              <div className="p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 hover:shadow-xl transition-shadow">
                <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-400 rounded-lg flex items-center justify-center mb-4">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                  Lightning Fast
                </h3>
                <p className="text-slate-600 dark:text-slate-400">
                  Screen hundreds of resumes in seconds, not hours. Get instant match scores and insights for every candidate.
                </p>
              </div>

              <div className="p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 hover:shadow-xl transition-shadow">
                <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-400 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                  Secure & Private
                </h3>
                <p className="text-slate-600 dark:text-slate-400">
                  Enterprise-grade security with encrypted data storage. Your candidates' information is always protected.
                </p>
              </div>

              <div className="p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 hover:shadow-xl transition-shadow">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-indigo-400 rounded-lg flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                  Dual Portal System
                </h3>
                <p className="text-slate-600 dark:text-slate-400">
                  Separate optimized experiences for recruiters and candidates, each tailored to their specific needs.
                </p>
              </div>

              <div className="p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 hover:shadow-xl transition-shadow">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-400 rounded-lg flex items-center justify-center mb-4">
                  <Award className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                  Smart Matching
                </h3>
                <p className="text-slate-600 dark:text-slate-400">
                  AI-driven candidate-job matching with detailed scoring based on skills, experience, and requirements.
                </p>
              </div>

              <div className="p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 hover:shadow-xl transition-shadow">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-red-400 rounded-lg flex items-center justify-center mb-4">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                  Modern UI/UX
                </h3>
                <p className="text-slate-600 dark:text-slate-400">
                  Beautiful, intuitive interface with warm theme, dark mode support, and smooth animations.
                </p>
              </div>
            </div>
          </div>

          {/* Technology Stack */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-8 text-center">
              Built with Cutting-Edge Technology
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="p-6 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 rounded-xl border border-slate-200 dark:border-slate-700">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Frontend</h3>
                <ul className="space-y-2 text-slate-700 dark:text-slate-300">
                  <li>• Next.js 16 with Turbopack</li>
                  <li>• React 19 with TypeScript</li>
                  <li>• Tailwind CSS for styling</li>
                  <li>• Lucide Icons</li>
                  <li>• Dark mode support</li>
                </ul>
              </div>

              <div className="p-6 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 rounded-xl border border-slate-200 dark:border-slate-700">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Backend</h3>
                <ul className="space-y-2 text-slate-700 dark:text-slate-300">
                  <li>• FastAPI (Python 3.13)</li>
                  <li>• SQLAlchemy 2.0 ORM</li>
                  <li>• JWT Authentication</li>
                  <li>• NVIDIA AI Integration</li>
                  <li>• PostgreSQL/SQLite</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-8 text-center">
              By The Numbers
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center p-6 bg-gradient-to-br from-rose-50 to-orange-50 dark:from-rose-900/20 dark:to-orange-900/20 rounded-xl border border-rose-200 dark:border-rose-800">
                <div className="text-4xl font-bold bg-gradient-to-r from-rose-600 to-orange-600 bg-clip-text text-transparent mb-2">
                  99%
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-400">Accuracy Rate</div>
              </div>
              <div className="text-center p-6 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-xl border border-amber-200 dark:border-amber-800">
                <div className="text-4xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent mb-2">
                  75%
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-400">Time Saved</div>
              </div>
              <div className="text-center p-6 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl border border-green-200 dark:border-green-800">
                <div className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-2">
                  10K+
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-400">Resumes Screened</div>
              </div>
              <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
                <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
                  500+
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-400">Active Recruiters</div>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center p-8 bg-gradient-to-br from-rose-400 via-orange-400 to-amber-400 rounded-2xl shadow-xl">
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to Transform Your Hiring?
            </h2>
            <p className="text-white/90 mb-6 max-w-2xl mx-auto">
              Join hundreds of companies already using Smart Hiring OS to find their perfect candidates faster and more efficiently.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/signup"
                className="px-8 py-3 bg-white text-rose-600 font-bold rounded-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all"
              >
                Get Started Free
              </Link>
              <Link
                href="/"
                className="px-8 py-3 bg-white/20 backdrop-blur text-white font-bold rounded-lg border-2 border-white hover:bg-white/30 transition-all"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
