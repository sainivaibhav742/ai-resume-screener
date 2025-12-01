import { Brain, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="relative mt-16 bg-gradient-to-br from-slate-50 via-rose-50/30 to-orange-50/30 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 border-t border-rose-100 dark:border-slate-700">
      {/* Decorative background elements */}
      <div className="absolute inset-0 bg-gradient-to-r from-rose-500/5 via-orange-500/5 to-amber-500/5 dark:from-rose-500/10 dark:via-orange-500/10 dark:to-amber-500/10"></div>
      
      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Main Footer Content */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
            {/* Brand Section - Takes more space */}
            <div className="lg:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-rose-400 to-orange-400 rounded-xl blur-md opacity-50"></div>
                  <div className="relative p-2.5 bg-gradient-to-br from-rose-400 to-orange-400 rounded-xl shadow-lg">
                    <Brain className="w-7 h-7 text-white" />
                  </div>
                </div>
                <div>
                  <span className="text-2xl font-bold bg-gradient-to-r from-rose-600 via-orange-600 to-amber-600 bg-clip-text text-transparent">
                    Smart Hiring OS
                  </span>
                  <p className="text-xs text-slate-500 dark:text-slate-400">AI-Powered Talent Intelligence</p>
                </div>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                Transform your hiring process with AI-powered resume screening, intelligent job matching, and data-driven insights.
              </p>
              {/* Social Links */}
              <div className="flex items-center gap-3">
                <a href="#" className="w-9 h-9 rounded-lg bg-white/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 flex items-center justify-center hover:bg-gradient-to-r hover:from-rose-500 hover:to-orange-500 hover:text-white hover:border-transparent transition-all duration-300 group">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>
                </a>
                <a href="#" className="w-9 h-9 rounded-lg bg-white/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 flex items-center justify-center hover:bg-gradient-to-r hover:from-rose-500 hover:to-orange-500 hover:text-white hover:border-transparent transition-all duration-300 group">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                </a>
                <a href="#" className="w-9 h-9 rounded-lg bg-white/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 flex items-center justify-center hover:bg-gradient-to-r hover:from-rose-500 hover:to-orange-500 hover:text-white hover:border-transparent transition-all duration-300 group">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                </a>
              </div>
            </div>
            
            {/* Product Links */}
            <div>
              <h4 className="font-bold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
                <div className="w-1 h-5 bg-gradient-to-b from-rose-500 to-orange-500 rounded-full"></div>
                Product
              </h4>
              <ul className="space-y-3">
                <li><Link href="/candidate" className="text-sm text-slate-600 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors flex items-center gap-2 group"><ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />For Candidates</Link></li>
                <li><Link href="/recruiter" className="text-sm text-slate-600 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors flex items-center gap-2 group"><ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />For Recruiters</Link></li>
                <li><Link href="#features" className="text-sm text-slate-600 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors flex items-center gap-2 group"><ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />Features</Link></li>
                <li><Link href="#pricing" className="text-sm text-slate-600 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors flex items-center gap-2 group"><ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />Pricing</Link></li>
              </ul>
            </div>
            
            {/* Resources Links */}
            <div>
              <h4 className="font-bold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
                <div className="w-1 h-5 bg-gradient-to-b from-orange-500 to-amber-500 rounded-full"></div>
                Resources
              </h4>
              <ul className="space-y-3">
                <li><Link href="#" className="text-sm text-slate-600 dark:text-slate-400 hover:text-orange-600 dark:hover:text-orange-400 transition-colors flex items-center gap-2 group"><ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />Documentation</Link></li>
                <li><Link href="#" className="text-sm text-slate-600 dark:text-slate-400 hover:text-orange-600 dark:hover:text-orange-400 transition-colors flex items-center gap-2 group"><ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />API Reference</Link></li>
                <li><Link href="#" className="text-sm text-slate-600 dark:text-slate-400 hover:text-orange-600 dark:hover:text-orange-400 transition-colors flex items-center gap-2 group"><ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />Blog</Link></li>
                <li><Link href="#" className="text-sm text-slate-600 dark:text-slate-400 hover:text-orange-600 dark:hover:text-orange-400 transition-colors flex items-center gap-2 group"><ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />Support</Link></li>
              </ul>
            </div>
            
            {/* Company Links */}
            <div>
              <h4 className="font-bold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
                <div className="w-1 h-5 bg-gradient-to-b from-amber-500 to-yellow-500 rounded-full"></div>
                Company
              </h4>
              <ul className="space-y-3">
                <li><Link href="#" className="text-sm text-slate-600 dark:text-slate-400 hover:text-amber-600 dark:hover:text-amber-400 transition-colors flex items-center gap-2 group"><ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />About Us</Link></li>
                <li><Link href="#" className="text-sm text-slate-600 dark:text-slate-400 hover:text-amber-600 dark:hover:text-amber-400 transition-colors flex items-center gap-2 group"><ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />Careers</Link></li>
                <li><Link href="#" className="text-sm text-slate-600 dark:text-slate-400 hover:text-amber-600 dark:hover:text-amber-400 transition-colors flex items-center gap-2 group"><ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />Privacy</Link></li>
                <li><Link href="#" className="text-sm text-slate-600 dark:text-slate-400 hover:text-amber-600 dark:hover:text-amber-400 transition-colors flex items-center gap-2 group"><ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />Terms</Link></li>
              </ul>
            </div>
          </div>
          
          {/* Bottom Bar with Gradient Divider */}
          <div className="relative">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-rose-300 to-transparent dark:via-rose-800"></div>
            <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
              <p className="text-sm text-slate-600 dark:text-slate-400">
                © 2025 Smart Hiring OS. All rights reserved.
              </p>
              <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                <span className="px-3 py-1 rounded-full bg-white/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                  Powered by NVIDIA AI
                </span>
                <span className="px-3 py-1 rounded-full bg-white/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                  Advanced NLP
                </span>
                <span className="px-3 py-1 rounded-full bg-gradient-to-r from-rose-500 to-orange-500 text-white font-medium">
                  v2.0
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
