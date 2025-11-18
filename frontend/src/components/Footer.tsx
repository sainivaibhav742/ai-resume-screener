import { FileText, Github, Twitter, Linkedin, Mail, Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 w-32 h-32 border border-blue-300 rounded-full"></div>
        <div className="absolute top-40 right-20 w-24 h-24 border border-purple-300 rounded-full"></div>
        <div className="absolute bottom-20 left-1/4 w-20 h-20 border border-pink-300 rounded-full"></div>
      </div>

      {/* Animated background elements */}
      <div className="absolute top-20 left-20 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-3 mb-6">
              <div className="relative">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-2xl shadow-lg">
                  <FileText className="h-8 w-8 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full animate-pulse"></div>
              </div>
              <div>
                <h3 className="text-2xl font-bold gradient-text">AI Resume Screener</h3>
                <p className="text-slate-400 font-medium">Revolutionizing Recruitment</p>
              </div>
            </div>
            <p className="text-slate-300 leading-relaxed mb-6 max-w-md">
              Empowering HR professionals with cutting-edge AI technology to find the perfect candidates
              and streamline the hiring process with intelligent analysis and insights.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="bg-slate-800 hover:bg-slate-700 p-3 rounded-xl transition-all duration-300 hover:scale-110 hover:shadow-lg">
                <Github className="h-5 w-5" />
              </a>
              <a href="#" className="bg-slate-800 hover:bg-slate-700 p-3 rounded-xl transition-all duration-300 hover:scale-110 hover:shadow-lg">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="bg-slate-800 hover:bg-slate-700 p-3 rounded-xl transition-all duration-300 hover:scale-110 hover:shadow-lg">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="#" className="bg-slate-800 hover:bg-slate-700 p-3 rounded-xl transition-all duration-300 hover:scale-110 hover:shadow-lg">
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold mb-6 text-white">Quick Links</h4>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-slate-300 hover:text-blue-400 transition-colors duration-200 hover:translate-x-1 inline-block">
                  Screen Resume
                </a>
              </li>
              <li>
                <a href="#" className="text-slate-300 hover:text-blue-400 transition-colors duration-200 hover:translate-x-1 inline-block">
                  Resume Maker
                </a>
              </li>
              <li>
                <a href="#" className="text-slate-300 hover:text-blue-400 transition-colors duration-200 hover:translate-x-1 inline-block">
                  Dashboard
                </a>
              </li>
              <li>
                <a href="#" className="text-slate-300 hover:text-blue-400 transition-colors duration-200 hover:translate-x-1 inline-block">
                  Job Posting
                </a>
              </li>
              <li>
                <a href="#" className="text-slate-300 hover:text-blue-400 transition-colors duration-200 hover:translate-x-1 inline-block">
                  API Documentation
                </a>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-lg font-bold mb-6 text-white">Resources</h4>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-slate-300 hover:text-blue-400 transition-colors duration-200 hover:translate-x-1 inline-block">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="text-slate-300 hover:text-blue-400 transition-colors duration-200 hover:translate-x-1 inline-block">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="text-slate-300 hover:text-blue-400 transition-colors duration-200 hover:translate-x-1 inline-block">
                  Case Studies
                </a>
              </li>
              <li>
                <a href="#" className="text-slate-300 hover:text-blue-400 transition-colors duration-200 hover:translate-x-1 inline-block">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-slate-300 hover:text-blue-400 transition-colors duration-200 hover:translate-x-1 inline-block">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Newsletter */}
        <div className="bg-gradient-to-r from-slate-800/50 to-slate-700/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-8 mb-12">
          <div className="text-center max-w-2xl mx-auto">
            <h4 className="text-2xl font-bold text-white mb-4">Stay Updated</h4>
            <p className="text-slate-300 mb-6">
              Get the latest updates on AI recruitment technology and industry insights delivered to your inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
              <button className="btn-primary whitespace-nowrap">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-700 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 text-slate-400 mb-4 md:mb-0">
              <span>© 2024 AI Resume Screener. Made with</span>
              <Heart className="h-4 w-4 text-red-500 animate-pulse" />
              <span>for better hiring.</span>
            </div>
            <div className="flex items-center space-x-6 text-sm text-slate-400">
              <span>Powered by NVIDIA AI</span>
              <span>•</span>
              <span>v2.1.0</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}