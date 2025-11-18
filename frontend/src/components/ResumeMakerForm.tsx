"use client";

import { useState } from "react";
import { FileText, Download, Loader2, Plus, X, Sparkles, Wand2 } from "lucide-react";
import axios from "axios";

interface Experience {
  title: string;
  company: string;
  duration: string;
  description: string;
}

interface Education {
  degree: string;
  institution: string;
  year: string;
}

const templates = [
  {
    id: "modern",
    name: "Modern Professional",
    description: "Clean, contemporary design perfect for tech and creative industries",
    icon: "🚀",
    color: "from-blue-500 to-purple-600",
    features: ["Minimal design", "Bold typography", "ATS-friendly", "Mobile optimized"]
  },
  {
    id: "classic",
    name: "Classic Corporate",
    description: "Traditional format ideal for corporate and finance positions",
    icon: "🏢",
    color: "from-gray-600 to-gray-800",
    features: ["Traditional layout", "Professional fonts", "Industry standard", "Conservative style"]
  },
  {
    id: "creative",
    name: "Creative & Design",
    description: "Eye-catching layout for designers and marketing professionals",
    icon: "🎨",
    color: "from-pink-500 to-red-500",
    features: ["Visual elements", "Creative fonts", "Portfolio focus", "Unique styling"]
  },
  {
    id: "executive",
    name: "Executive Level",
    description: "Sophisticated format for senior management and executive roles",
    icon: "👔",
    color: "from-green-600 to-teal-600",
    features: ["Leadership focus", "Achievement oriented", "Executive summary", "Strategic layout"]
  },
  {
    id: "minimalist",
    name: "Minimalist Clean",
    description: "Ultra-clean design focusing on content with subtle elegance",
    icon: "✨",
    color: "from-slate-400 to-slate-600",
    features: ["Ultra-minimal", "Content-focused", "Elegant spacing", "Timeless appeal"]
  },
  {
    id: "tech",
    name: "Tech Modern",
    description: "Dark theme with neon accents perfect for tech professionals",
    icon: "💻",
    color: "from-indigo-600 to-purple-800",
    features: ["Dark theme", "Neon accents", "Tech-inspired", "Modern aesthetics"]
  },
  {
    id: "academic",
    name: "Academic & Research",
    description: "Structured format ideal for researchers and academics",
    icon: "🎓",
    color: "from-emerald-500 to-teal-600",
    features: ["Research focus", "Publication ready", "Academic structure", "Professional credibility"]
  },
  {
    id: "startup",
    name: "Startup Dynamic",
    description: "Bold and energetic design for startup culture and innovation",
    icon: "🚀",
    color: "from-orange-500 to-red-600",
    features: ["Bold design", "Energetic layout", "Innovation focus", "Startup culture"]
  }
];

export default function ResumeMakerForm() {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [rawText, setRawText] = useState("");
  const [parsedData, setParsedData] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [aiLoading, setAiLoading] = useState<{[key: string]: boolean}>({});
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showQuestions, setShowQuestions] = useState(false);
  const [additionalInfo, setAdditionalInfo] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    summary: '',
    education: '',
    experience: ''
  });

  const parseResumeWithAI = async () => {
    if (!rawText.trim()) {
      alert("Please enter some information about yourself");
      return;
    }
    setIsProcessing(true);
    try {
      const response = await axios.post("http://127.0.0.1:8001/parse-resume-ai", {
        raw_text: rawText
      });
      setParsedData(response.data);
      setSuggestions(response.data.suggestions || []);

      // Check for critical missing information
      const personal = response.data.personal_info || {};
      const hasCriticalMissing = !personal.name || personal.name === "Your Name" ||
                                !personal.email || !personal.phone || !personal.location;

      if (hasCriticalMissing) {
        setShowQuestions(true);
      }
    } catch (error) {
      console.error("AI parsing failed:", error);
      alert("AI parsing failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const updateWithAdditionalInfo = () => {
    if (!parsedData) return;

    const updatedData = { ...parsedData };

    // Update personal info
    if (additionalInfo.name) updatedData.personal_info.name = additionalInfo.name;
    if (additionalInfo.email) updatedData.personal_info.email = additionalInfo.email;
    if (additionalInfo.phone) updatedData.personal_info.phone = additionalInfo.phone;
    if (additionalInfo.location) updatedData.personal_info.location = additionalInfo.location;

    // Update summary if provided
    if (additionalInfo.summary) updatedData.summary = additionalInfo.summary;

    // Add education if provided
    if (additionalInfo.education && !updatedData.educations?.length) {
      updatedData.educations = [{
        degree: additionalInfo.education,
        institution: "Educational Institution",
        year: "Recent"
      }];
    }

    // Add experience if provided
    if (additionalInfo.experience && updatedData.experiences?.length < 3) {
      updatedData.experiences.push({
        title: "Professional Experience",
        company: "Company",
        duration: "Recent",
        description: additionalInfo.experience
      });
    }

    setParsedData(updatedData);
    setShowQuestions(false);
    setSuggestions([]); // Clear suggestions since we've addressed them
  };

  const downloadResume = async () => {
    if (!parsedData) return;

    const element = document.getElementById('resume-preview');
    if (!element) return;

    // Dynamically import html2pdf to avoid SSR issues
    const html2pdf = (await import('html2pdf.js')).default;

    const opt = {
      margin: 0.2,
      filename: `${parsedData.personal_info?.name?.replace(/\s+/g, '_') || 'resume'}_resume.pdf`,
      image: { type: 'jpeg' as const, quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, width: 816, height: 1056 }, // 8.5x11 inches at 96 DPI
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' as const }
    };

    html2pdf().set(opt).from(element).save();
  };

  if (!selectedTemplate) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Choose a Resume Template</h2>
            <p className="text-gray-600">Select a template that best fits your style and industry</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {templates.map((template) => (
              <div
                key={template.id}
                onClick={() => setSelectedTemplate(template.id)}
                className="relative border-2 border-gray-200 rounded-xl p-6 hover:border-blue-500 cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${template.color} flex items-center justify-center text-white text-xl`}>
                      {template.icon}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{template.name}</h3>
                      <p className="text-sm text-gray-600">{template.description}</p>
                    </div>
                  </div>
                  <div className="w-5 h-5 border-2 border-gray-300 rounded-full bg-white"></div>
                </div>

                <div className="space-y-2">
                  {template.features.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-sm text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="mb-3">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Template Preview:</h4>
                    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                      {template.id === 'modern' && (
                        <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <h3 className="text-lg font-bold text-gray-900 mb-1">John Doe</h3>
                              <p className="text-sm text-blue-600 font-medium">Software Engineer</p>
                              <p className="text-xs text-gray-600">New York, NY • john@email.com • (555) 123-4567</p>
                            </div>
                            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                              JD
                            </div>
                          </div>
                          <div className="border-t border-gray-200 pt-3">
                            <h4 className="text-sm font-bold text-gray-900 mb-2">EXPERIENCE</h4>
                            <div className="space-y-2">
                              <div>
                                <div className="flex justify-between text-sm">
                                  <span className="font-semibold text-gray-900">Senior Developer</span>
                                  <span className="text-gray-600">2020-Present</span>
                                </div>
                                <p className="text-xs text-gray-600 mb-1">Tech Corp, New York</p>
                                <ul className="text-xs text-gray-700 space-y-1">
                                  <li>• Led development of key features</li>
                                  <li>• Improved system performance by 40%</li>
                                </ul>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {template.id === 'classic' && (
                        <div className="p-4">
                          <div className="text-center mb-4 pb-2 border-b-2 border-gray-800">
                            <h3 className="text-xl font-bold text-gray-900 mb-1">JOHN DOE</h3>
                            <p className="text-sm text-gray-700">Software Engineer</p>
                            <p className="text-xs text-gray-600 mt-1">New York, NY • (555) 123-4567 • john@email.com</p>
                          </div>
                          <div>
                            <h4 className="text-sm font-bold text-gray-900 mb-2 uppercase tracking-wide">Professional Experience</h4>
                            <div className="space-y-3">
                              <div>
                                <div className="flex justify-between text-sm mb-1">
                                  <span className="font-semibold text-gray-900">Senior Developer</span>
                                  <span className="text-gray-600">Tech Corp</span>
                                </div>
                                <div className="text-xs text-gray-600 mb-2">New York, NY | 2020 - Present</div>
                                <ul className="text-xs text-gray-700 space-y-1">
                                  <li>• Led development of key features and systems</li>
                                  <li>• Improved system performance by 40%</li>
                                  <li>• Mentored junior developers</li>
                                </ul>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {template.id === 'creative' && (
                        <div className="p-4 bg-gradient-to-br from-pink-50 via-white to-red-50">
                          <div className="flex items-center space-x-4 mb-4">
                            <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-red-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                              J
                            </div>
                            <div>
                              <h3 className="text-xl font-bold text-gray-900 mb-1">John Doe</h3>
                              <p className="text-sm text-pink-600 font-medium">Creative Software Engineer</p>
                              <p className="text-xs text-gray-600">New York, NY • john@email.com</p>
                            </div>
                          </div>
                          <div className="border-l-4 border-pink-500 pl-4">
                            <h4 className="text-sm font-bold text-gray-900 mb-2 flex items-center">
                              <span className="w-2 h-2 bg-pink-500 rounded-full mr-2"></span>
                              Experience
                            </h4>
                            <div className="space-y-2">
                              <div>
                                <div className="flex justify-between text-sm mb-1">
                                  <span className="font-semibold text-gray-900">Senior Developer</span>
                                  <span className="text-pink-600 font-medium">2020-Present</span>
                                </div>
                                <p className="text-xs text-gray-600 mb-1">Tech Corp, New York</p>
                                <ul className="text-xs text-gray-700 space-y-1">
                                  <li>✨ Led innovative feature development</li>
                                  <li>🚀 Boosted performance by 40%</li>
                                  <li>👥 Mentored creative team members</li>
                                </ul>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {template.id === 'executive' && (
                        <div className="p-4 bg-gradient-to-r from-gray-50 to-gray-100">
                          <div className="text-center mb-4">
                            <h3 className="text-2xl font-bold text-gray-900 mb-1">John Doe</h3>
                            <p className="text-sm text-gray-700 font-medium">Senior Software Engineer</p>
                            <div className="flex justify-center space-x-4 text-xs text-gray-600 mt-2">
                              <span>📧 john@email.com</span>
                              <span>📱 (555) 123-4567</span>
                              <span>📍 New York, NY</span>
                            </div>
                          </div>
                          <div className="bg-white p-3 rounded-lg shadow-sm">
                            <h4 className="text-sm font-bold text-gray-900 mb-3 uppercase tracking-wide border-b border-gray-200 pb-1">Executive Summary</h4>
                            <p className="text-xs text-gray-700 mb-4">Results-driven software engineer with 5+ years of experience leading development teams and delivering high-impact solutions.</p>

                            <h4 className="text-sm font-bold text-gray-900 mb-2 uppercase tracking-wide">Professional Experience</h4>
                            <div className="space-y-2">
                              <div>
                                <div className="flex justify-between text-sm mb-1">
                                  <span className="font-bold text-gray-900">Senior Developer</span>
                                  <span className="text-gray-600 font-medium">Tech Corp</span>
                                </div>
                                <div className="text-xs text-gray-600 mb-2">New York, NY | 2020 - Present</div>
                                <ul className="text-xs text-gray-700 space-y-1">
                                  <li>• Directed development of critical system components</li>
                                  <li>• Achieved 40% performance improvement through strategic optimization</li>
                                  <li>• Led cross-functional team of 8 developers</li>
                                </ul>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {template.id === 'minimalist' && (
                        <div className="p-4 bg-white border border-gray-100">
                          <div className="mb-4">
                            <h3 className="text-xl font-light text-gray-900 mb-1 tracking-wide">John Doe</h3>
                            <p className="text-sm text-gray-600 font-light">Software Engineer</p>
                            <div className="flex flex-wrap gap-2 text-xs text-gray-500 mt-2">
                              <span>john@email.com</span>
                              <span>•</span>
                              <span>(555) 123-4567</span>
                              <span>•</span>
                              <span>New York, NY</span>
                            </div>
                          </div>
                          <div className="space-y-3">
                            <div>
                              <h4 className="text-xs font-medium text-gray-900 uppercase tracking-wider mb-2">Experience</h4>
                              <div className="space-y-2">
                                <div>
                                  <div className="flex justify-between text-sm">
                                    <span className="font-light text-gray-900">Senior Developer</span>
                                    <span className="text-gray-500">2020-Present</span>
                                  </div>
                                  <p className="text-xs text-gray-600">Tech Corp, New York</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {template.id === 'tech' && (
                        <div className="p-4 bg-gray-900 text-white">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <h3 className="text-lg font-bold mb-1 text-cyan-400">John Doe</h3>
                              <p className="text-sm text-purple-400">Software Engineer</p>
                              <p className="text-xs text-gray-400 mt-1">New York, NY • john@email.com • (555) 123-4567</p>
                            </div>
                            <div className="w-10 h-10 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full flex items-center justify-center text-xs font-bold">
                              JD
                            </div>
                          </div>
                          <div className="border-t border-gray-700 pt-3">
                            <h4 className="text-xs font-bold text-cyan-400 mb-2 uppercase tracking-wide">// EXPERIENCE</h4>
                            <div className="space-y-2">
                              <div>
                                <div className="flex justify-between text-sm">
                                  <span className="font-semibold text-white">Senior Developer</span>
                                  <span className="text-gray-400">2020-Present</span>
                                </div>
                                <p className="text-xs text-gray-400 mb-1">Tech Corp</p>
                                <ul className="text-xs text-gray-300 space-y-1">
                                  <li>• Led development of key features</li>
                                  <li>• Improved system performance by 40%</li>
                                </ul>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {template.id === 'academic' && (
                        <div className="p-4 bg-gradient-to-br from-emerald-50 to-teal-50">
                          <div className="text-center mb-4 pb-2 border-b border-emerald-200">
                            <h3 className="text-xl font-serif text-gray-900 mb-1">John Doe, PhD</h3>
                            <p className="text-sm text-emerald-700 font-medium">Research Scientist</p>
                            <p className="text-xs text-gray-600 mt-1">Department of Computer Science • University Name</p>
                            <div className="flex justify-center space-x-3 text-xs text-gray-600 mt-2">
                              <span>📧 john@email.com</span>
                              <span>📱 (555) 123-4567</span>
                              <span>📍 New York, NY</span>
                            </div>
                          </div>
                          <div>
                            <h4 className="text-sm font-serif text-gray-900 mb-2 uppercase tracking-wide">Research & Publications</h4>
                            <div className="space-y-2">
                              <div>
                                <div className="flex justify-between text-sm mb-1">
                                  <span className="font-medium text-gray-900">Senior Research Fellow</span>
                                  <span className="text-emerald-600">2020-Present</span>
                                </div>
                                <p className="text-xs text-gray-600 mb-1">University Research Lab</p>
                                <ul className="text-xs text-gray-700 space-y-1">
                                  <li>• Published 15+ papers in top-tier journals</li>
                                  <li>• Secured $2M in research funding</li>
                                  <li>• Supervised 5 PhD students</li>
                                </ul>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {template.id === 'startup' && (
                        <div className="p-4 bg-gradient-to-br from-orange-50 via-red-50 to-pink-50">
                          <div className="flex items-center space-x-4 mb-4">
                            <div className="w-14 h-14 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-lg">
                              J
                            </div>
                            <div>
                              <h3 className="text-xl font-bold text-gray-900 mb-1">John Doe</h3>
                              <p className="text-sm text-orange-600 font-medium">Startup Founder & CTO</p>
                              <p className="text-xs text-gray-600">New York, NY • john@email.com</p>
                            </div>
                          </div>
                          <div className="border-l-4 border-orange-500 pl-4">
                            <h4 className="text-sm font-bold text-gray-900 mb-2 flex items-center">
                              <span className="w-2 h-2 bg-orange-500 rounded-full mr-2"></span>
                              Journey
                            </h4>
                            <div className="space-y-2">
                              <div>
                                <div className="flex justify-between text-sm mb-1">
                                  <span className="font-semibold text-gray-900">Co-Founder & CTO</span>
                                  <span className="text-orange-600 font-medium">2020-Present</span>
                                </div>
                                <p className="text-xs text-gray-600 mb-1">Tech Startup Inc.</p>
                                <ul className="text-xs text-gray-700 space-y-1">
                                  <li>🚀 Built MVP from 0 to 10K users in 6 months</li>
                                  <li>💰 Raised $5M in Series A funding</li>
                                  <li>👥 Scaled engineering team from 3 to 25</li>
                                </ul>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-900">Select Template</span>
                    <div className="text-blue-600 text-sm font-medium">Click to choose →</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }


  return (
    <div className="max-w-7xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Resume Maker</h2>
            <p className="text-gray-600">Tell us about yourself and we'll create a professional resume</p>
          </div>
          <button
            onClick={() => setSelectedTemplate(null)}
            className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-200 transition-colors"
          >
            Change Template
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Tell us about yourself</h3>
              <textarea
                value={rawText}
                onChange={(e) => setRawText(e.target.value)}
                placeholder="Paste your resume information, LinkedIn profile, or just tell us about your experience, education, skills, and career goals. For example:

John Doe
Software Engineer with 5 years experience
Email: john@email.com
Phone: (555) 123-4567

Experience:
- Senior Developer at Tech Corp (2020-Present)
  Led development of key features, improved performance by 40%

Education:
- Bachelor's in Computer Science, University of Tech (2016-2020)

Skills: JavaScript, React, Node.js, Python, AWS"
                className="w-full h-96 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm"
              />
            </div>

            <button
              onClick={parseResumeWithAI}
              disabled={isProcessing || !rawText.trim()}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center space-x-2"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Creating Your Resume...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-5 w-5" />
                  <span>Generate Resume with AI</span>
                </>
              )}
            </button>
          </div>

          {/* Preview Section */}
          <div className="lg:sticky lg:top-8">
            <div className="bg-gray-50 rounded-lg p-6 border-2 border-dashed border-gray-300">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-900">Resume Preview</h3>
                {parsedData && (
                  <button
                    onClick={downloadResume}
                    className="bg-green-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center space-x-2"
                  >
                    <Download className="h-4 w-4" />
                    <span>Download PDF</span>
                  </button>
                )}
              </div>

              <div className="bg-white rounded-lg shadow-lg border border-gray-200 max-h-[11in] overflow-y-auto" id="resume-preview" style={{aspectRatio: '8.5/11'}}>
                {parsedData ? (
                  <>
                    {suggestions.length > 0 && (
                      <div className="mb-6 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded-r-lg">
                        <div className="flex items-start">
                          <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <div className="ml-3">
                            <h3 className="text-sm font-medium text-yellow-800">Suggestions to improve your resume:</h3>
                            <div className="mt-2 text-sm text-yellow-700">
                              <ul className="list-disc pl-5 space-y-1">
                                {suggestions.map((suggestion, index) => (
                                  <li key={index}>{suggestion}</li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {showQuestions && (
                      <div className="mb-6 p-6 bg-blue-50 border-l-4 border-blue-400 rounded-r-lg">
                        <div className="flex items-start">
                          <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <div className="ml-3 flex-1">
                            <h3 className="text-sm font-medium text-blue-800 mb-3">Please provide additional information to complete your resume:</h3>
                            <div className="space-y-4">
                              {(!parsedData?.personal_info?.name || parsedData.personal_info.name === "Your Name") && (
                                <div>
                                  <label className="block text-sm font-medium text-blue-700 mb-1">Full Name</label>
                                  <input
                                    type="text"
                                    value={additionalInfo.name}
                                    onChange={(e) => setAdditionalInfo({...additionalInfo, name: e.target.value})}
                                    className="w-full px-3 py-2 border border-blue-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Enter your full name"
                                  />
                                </div>
                              )}
                              {!parsedData?.personal_info?.email && (
                                <div>
                                  <label className="block text-sm font-medium text-blue-700 mb-1">Email Address</label>
                                  <input
                                    type="email"
                                    value={additionalInfo.email}
                                    onChange={(e) => setAdditionalInfo({...additionalInfo, email: e.target.value})}
                                    className="w-full px-3 py-2 border border-blue-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="your.email@example.com"
                                  />
                                </div>
                              )}
                              {!parsedData?.personal_info?.phone && (
                                <div>
                                  <label className="block text-sm font-medium text-blue-700 mb-1">Phone Number</label>
                                  <input
                                    type="tel"
                                    value={additionalInfo.phone}
                                    onChange={(e) => setAdditionalInfo({...additionalInfo, phone: e.target.value})}
                                    className="w-full px-3 py-2 border border-blue-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="(555) 123-4567"
                                  />
                                </div>
                              )}
                              {!parsedData?.personal_info?.location && (
                                <div>
                                  <label className="block text-sm font-medium text-blue-700 mb-1">Location</label>
                                  <input
                                    type="text"
                                    value={additionalInfo.location}
                                    onChange={(e) => setAdditionalInfo({...additionalInfo, location: e.target.value})}
                                    className="w-full px-3 py-2 border border-blue-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="City, State/Country"
                                  />
                                </div>
                              )}
                              {(!parsedData?.summary || parsedData.summary.length < 50) && (
                                <div>
                                  <label className="block text-sm font-medium text-blue-700 mb-1">Professional Summary</label>
                                  <textarea
                                    value={additionalInfo.summary}
                                    onChange={(e) => setAdditionalInfo({...additionalInfo, summary: e.target.value})}
                                    className="w-full px-3 py-2 border border-blue-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                    rows={3}
                                    placeholder="Brief professional summary highlighting your key skills and experience"
                                  />
                                </div>
                              )}
                              {(!parsedData?.educations || parsedData.educations.length === 0) && (
                                <div>
                                  <label className="block text-sm font-medium text-blue-700 mb-1">Education</label>
                                  <input
                                    type="text"
                                    value={additionalInfo.education}
                                    onChange={(e) => setAdditionalInfo({...additionalInfo, education: e.target.value})}
                                    className="w-full px-3 py-2 border border-blue-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Degree and field of study"
                                  />
                                </div>
                              )}
                              {(!parsedData?.experiences || parsedData.experiences.length < 2) && (
                                <div>
                                  <label className="block text-sm font-medium text-blue-700 mb-1">Additional Experience</label>
                                  <textarea
                                    value={additionalInfo.experience}
                                    onChange={(e) => setAdditionalInfo({...additionalInfo, experience: e.target.value})}
                                    className="w-full px-3 py-2 border border-blue-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                    rows={3}
                                    placeholder="Describe additional work experience, projects, or achievements"
                                  />
                                </div>
                              )}
                            </div>
                            <div className="mt-4 flex justify-end space-x-3">
                              <button
                                onClick={() => setShowQuestions(false)}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                              >
                                Skip for Now
                              </button>
                              <button
                                onClick={updateWithAdditionalInfo}
                                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
                              >
                                Update Resume
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    {selectedTemplate === 'modern' && (
                      <div className="p-8 bg-gradient-to-br from-slate-50 to-blue-50 max-h-[11in] max-w-[8.5in] mx-auto font-sans leading-tight overflow-hidden">
                        {/* Header Section */}
                        <div className="flex justify-between items-start mb-4 pb-3 border-b-2 border-blue-200">
                          <div className="flex-1 pr-4">
                            <h1 className="text-2xl font-semibold text-gray-900 mb-1 font-geist leading-tight">{parsedData.personal_info?.name || "Your Name"}</h1>
                            <p className="text-base text-blue-600 mb-2 font-geist leading-tight">
                              {parsedData.experiences?.[0]?.title || "Professional Title"}
                            </p>
                            <div className="flex flex-wrap gap-3 text-sm text-gray-600">
                              {parsedData.personal_info?.email && (
                                <div className="flex items-center gap-1">
                                  <svg className="w-3 h-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
                                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
                                  </svg>
                                  <span className="font-geist">{parsedData.personal_info.email}</span>
                                </div>
                              )}
                              {parsedData.personal_info?.phone && (
                                <div className="flex items-center gap-1">
                                  <svg className="w-3 h-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"/>
                                  </svg>
                                  <span className="font-geist">{parsedData.personal_info.phone}</span>
                                </div>
                              )}
                              {parsedData.personal_info?.location && (
                                <div className="flex items-center gap-1">
                                  <svg className="w-3 h-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/>
                                  </svg>
                                  <span className="font-geist">{parsedData.personal_info.location}</span>
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-medium text-lg shadow-lg font-geist flex-shrink-0">
                            {(parsedData.personal_info?.name || "Y")[0].toUpperCase()}
                          </div>
                        </div>

                        {/* Summary Section */}
                        {parsedData.summary && (
                          <div className="mb-4">
                            <h3 className="text-base font-medium text-gray-900 mb-2 uppercase tracking-wide border-b border-gray-300 pb-1 font-geist">Professional Summary</h3>
                            <p className="text-gray-700 leading-relaxed text-justify font-geist text-sm">{parsedData.summary}</p>
                          </div>
                        )}

                        {/* Experience Section */}
                        {parsedData.experiences?.length > 0 && (
                          <div className="mb-4">
                            <h3 className="text-base font-medium text-gray-900 mb-2 uppercase tracking-wide border-b border-gray-300 pb-1 font-geist">Professional Experience</h3>
                            <div className="space-y-3">
                              {parsedData.experiences.map((exp: any, index: number) => (
                                <div key={index} className="relative">
                                  <div className="flex justify-between items-start mb-1">
                                    <div className="flex-1 pr-2">
                                      <h4 className="font-medium text-gray-900 text-sm font-geist leading-tight">{exp.title}</h4>
                                      <p className="text-blue-600 text-sm font-geist leading-tight">{exp.company}</p>
                                    </div>
                                    <span className="text-gray-600 bg-gray-100 px-2 py-1 rounded-full text-xs font-geist whitespace-nowrap flex-shrink-0">{exp.duration}</span>
                                  </div>
                                  {exp.description && (
                                    <div className="text-gray-700 leading-relaxed ml-3 border-l border-blue-200 pl-3 font-geist text-sm">{exp.description}</div>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Education Section */}
                        {parsedData.educations?.length > 0 && (
                          <div className="mb-4">
                            <h3 className="text-base font-medium text-gray-900 mb-2 uppercase tracking-wide border-b border-gray-300 pb-1 font-geist">Education</h3>
                            <div className="space-y-2">
                              {parsedData.educations.map((edu: any, index: number) => (
                                <div key={index} className="flex justify-between items-start">
                                  <div className="flex-1 pr-2">
                                    <h4 className="font-medium text-gray-900 text-sm font-geist leading-tight">{edu.degree}</h4>
                                    <p className="text-gray-600 font-geist text-sm leading-tight">{edu.institution}</p>
                                  </div>
                                  <span className="text-gray-600 bg-gray-100 px-2 py-1 rounded-full text-xs font-geist whitespace-nowrap flex-shrink-0">{edu.year}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Skills Section */}
                        {parsedData.skills?.length > 0 && (
                          <div className="mb-2">
                            <h3 className="text-base font-medium text-gray-900 mb-2 uppercase tracking-wide border-b border-gray-300 pb-1 font-geist">Technical Skills</h3>
                            <div className="flex flex-wrap gap-2">
                              {parsedData.skills.map((skill: string, index: number) => (
                                <span key={index} className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-2 py-1 rounded-full text-xs font-medium shadow-sm font-geist">
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {selectedTemplate === 'classic' && (
                      <div className="p-8 bg-white max-h-[11in] max-w-[8.5in] mx-auto font-slab leading-tight overflow-hidden">
                        {/* Header Section */}
                        <div className="text-center mb-4 pb-3 border-b-4 border-gray-800">
                          <h1 className="text-3xl font-semibold text-gray-900 mb-2 tracking-wide font-playfair leading-tight">{parsedData.personal_info?.name || "Your Name"}</h1>
                          <p className="text-lg text-gray-700 mb-2 font-playfair leading-tight">
                            {parsedData.experiences?.[0]?.title || "Professional Title"}
                          </p>
                          <div className="flex justify-center space-x-4 text-sm text-gray-600 font-geist">
                            {parsedData.personal_info?.email && <span>{parsedData.personal_info.email}</span>}
                            {parsedData.personal_info?.phone && <span>• {parsedData.personal_info.phone}</span>}
                            {parsedData.personal_info?.location && <span>• {parsedData.personal_info.location}</span>}
                          </div>
                        </div>

                        {/* Summary Section */}
                        {parsedData.summary && (
                          <div className="mb-4">
                            <h3 className="text-base font-medium text-gray-900 mb-2 uppercase tracking-wider border-b-2 border-gray-300 pb-1 font-playfair">Professional Summary</h3>
                            <p className="text-gray-700 leading-relaxed text-justify indent-4 font-geist text-sm">{parsedData.summary}</p>
                          </div>
                        )}

                        {/* Experience Section */}
                        {parsedData.experiences?.length > 0 && (
                          <div className="mb-4">
                            <h3 className="text-base font-medium text-gray-900 mb-2 uppercase tracking-wider border-b-2 border-gray-300 pb-1 font-playfair">Professional Experience</h3>
                            <div className="space-y-3">
                              {parsedData.experiences.map((exp: any, index: number) => (
                                <div key={index}>
                                  <div className="flex justify-between items-start mb-1">
                                    <div className="flex-1 pr-2">
                                      <h4 className="font-medium text-gray-900 text-sm font-playfair leading-tight">{exp.title}</h4>
                                      <p className="text-gray-700 text-sm italic font-geist leading-tight">{exp.company}</p>
                                    </div>
                                    <span className="text-gray-600 text-xs bg-gray-100 px-2 py-1 rounded font-geist whitespace-nowrap flex-shrink-0">{exp.duration}</span>
                                  </div>
                                  {exp.description && (
                                    <div className="text-gray-700 leading-relaxed ml-4 font-geist text-sm">{exp.description}</div>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Education Section */}
                        {parsedData.educations?.length > 0 && (
                          <div className="mb-4">
                            <h3 className="text-base font-medium text-gray-900 mb-2 uppercase tracking-wider border-b-2 border-gray-300 pb-1 font-playfair">Education</h3>
                            <div className="space-y-2">
                              {parsedData.educations.map((edu: any, index: number) => (
                                <div key={index} className="flex justify-between items-start">
                                  <div className="flex-1 pr-2">
                                    <h4 className="font-medium text-gray-900 text-sm font-playfair leading-tight">{edu.degree}</h4>
                                    <p className="text-gray-600 font-geist text-sm leading-tight">{edu.institution}</p>
                                  </div>
                                  <span className="text-gray-600 text-xs bg-gray-100 px-2 py-1 rounded font-geist whitespace-nowrap flex-shrink-0">{edu.year}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Skills Section */}
                        {parsedData.skills?.length > 0 && (
                          <div className="mb-2">
                            <h3 className="text-base font-medium text-gray-900 mb-2 uppercase tracking-wider border-b-2 border-gray-300 pb-1 font-playfair">Technical Skills</h3>
                            <div className="text-gray-700 leading-relaxed font-geist text-sm">
                              {parsedData.skills.join(' • ')}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {selectedTemplate === 'creative' && (
                      <div className="p-6 bg-gradient-to-br from-pink-50 via-white to-red-50 max-h-[11in] max-w-[8.5in] mx-auto overflow-hidden">
                        <div className="flex items-center space-x-4 mb-4">
                          <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-red-500 rounded-full flex items-center justify-center text-white font-medium text-xl">
                            {(parsedData.personal_info?.name || "Y")[0].toUpperCase()}
                          </div>
                          <div>
                            <h1 className="text-2xl font-semibold text-gray-900 mb-1">{parsedData.personal_info?.name || "Your Name"}</h1>
                            <p className="text-base text-pink-600">
                              {parsedData.experiences?.[0]?.title || "Creative Professional"}
                            </p>
                            <div className="text-sm text-gray-600 mt-1">
                              {parsedData.personal_info?.email && <div>{parsedData.personal_info.email}</div>}
                              {parsedData.personal_info?.phone && <div>{parsedData.personal_info.phone}</div>}
                              {parsedData.personal_info?.location && <div>{parsedData.personal_info.location}</div>}
                            </div>
                          </div>
                        </div>

                        {parsedData.summary && (
                          <div className="mb-4">
                            <h3 className="text-lg font-medium text-gray-900 mb-2 flex items-center">
                              <span className="w-3 h-3 bg-pink-500 rounded-full mr-2"></span>
                              About Me
                            </h3>
                            <p className="text-gray-700 leading-relaxed text-sm">{parsedData.summary}</p>
                          </div>
                        )}

                        {parsedData.experiences?.length > 0 && (
                          <div className="mb-4">
                            <h3 className="text-lg font-medium text-gray-900 mb-3 flex items-center">
                              <span className="w-3 h-3 bg-pink-500 rounded-full mr-2"></span>
                              Experience
                            </h3>
                            <div className="space-y-3">
                              {parsedData.experiences.map((exp: any, index: number) => (
                                <div key={index} className="border-l-4 border-pink-500 pl-4">
                                  <div className="flex justify-between items-start mb-1">
                                    <h4 className="font-medium text-gray-900 text-base">{exp.title}</h4>
                                    <span className="text-pink-600">{exp.duration}</span>
                                  </div>
                                  <p className="text-gray-600 mb-1 text-sm">{exp.company}</p>
                                  {exp.description && (
                                    <div className="text-gray-700 whitespace-pre-line text-sm">{exp.description}</div>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {parsedData.educations?.length > 0 && (
                          <div className="mb-4">
                            <h3 className="text-lg font-medium text-gray-900 mb-3 flex items-center">
                              <span className="w-3 h-3 bg-pink-500 rounded-full mr-2"></span>
                              Education
                            </h3>
                            <div className="space-y-2">
                              {parsedData.educations.map((edu: any, index: number) => (
                                <div key={index}>
                                  <h4 className="font-medium text-gray-900 text-base">{edu.degree}</h4>
                                  <p className="text-gray-600 text-sm">{edu.institution} {edu.year && `• ${edu.year}`}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {parsedData.skills?.length > 0 && (
                          <div className="mb-2">
                            <h3 className="text-lg font-medium text-gray-900 mb-2 flex items-center">
                              <span className="w-3 h-3 bg-pink-500 rounded-full mr-2"></span>
                              Skills
                            </h3>
                            <div className="flex flex-wrap gap-2">
                              {parsedData.skills.map((skill: string, index: number) => (
                                <span key={index} className="bg-pink-100 text-pink-800 px-2 py-1 rounded-full text-sm">
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {selectedTemplate === 'executive' && (
                      <div className="p-6 bg-gradient-to-r from-gray-50 to-gray-100 max-h-[11in] max-w-[8.5in] mx-auto overflow-hidden">
                        <div className="text-center mb-4">
                          <h1 className="text-3xl font-semibold text-gray-900 mb-2">{parsedData.personal_info?.name || "Your Name"}</h1>
                          <p className="text-lg text-gray-700">
                            {parsedData.experiences?.[0]?.title || "Senior Professional"}
                          </p>
                          <div className="flex justify-center space-x-6 text-sm text-gray-600 mt-2">
                            {parsedData.personal_info?.email && <span>📧 {parsedData.personal_info.email}</span>}
                            {parsedData.personal_info?.phone && <span>📱 {parsedData.personal_info.phone}</span>}
                            {parsedData.personal_info?.location && <span>📍 {parsedData.personal_info.location}</span>}
                          </div>
                        </div>

                        {parsedData.summary && (
                          <div className="bg-white p-3 rounded-lg shadow-sm mb-4">
                            <h3 className="text-base font-medium text-gray-900 mb-2 uppercase tracking-wide">Executive Summary</h3>
                            <p className="text-gray-700 leading-relaxed text-sm">{parsedData.summary}</p>
                          </div>
                        )}

                        {parsedData.experiences?.length > 0 && (
                          <div className="bg-white p-3 rounded-lg shadow-sm mb-4">
                            <h3 className="text-base font-medium text-gray-900 mb-3 uppercase tracking-wide">Professional Experience</h3>
                            <div className="space-y-3">
                              {parsedData.experiences.map((exp: any, index: number) => (
                                <div key={index}>
                                  <div className="flex justify-between items-start mb-1">
                                    <h4 className="font-medium text-gray-900 text-base">{exp.title}</h4>
                                    <span className="text-gray-600">{exp.company}</span>
                                  </div>
                                  <div className="text-gray-600 mb-1 text-sm">{exp.duration}</div>
                                  {exp.description && (
                                    <div className="text-gray-700 whitespace-pre-line text-sm">{exp.description}</div>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {parsedData.educations?.length > 0 && (
                          <div className="bg-white p-3 rounded-lg shadow-sm mb-4">
                            <h3 className="text-base font-medium text-gray-900 mb-3 uppercase tracking-wide">Education</h3>
                            <div className="space-y-2">
                              {parsedData.educations.map((edu: any, index: number) => (
                                <div key={index}>
                                  <h4 className="font-medium text-gray-900 text-base">{edu.degree}</h4>
                                  <p className="text-gray-600 text-sm">{edu.institution} {edu.year && `• ${edu.year}`}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {parsedData.skills?.length > 0 && (
                          <div className="bg-white p-3 rounded-lg shadow-sm mb-2">
                            <h3 className="text-base font-medium text-gray-900 mb-2 uppercase tracking-wide">Core Competencies</h3>
                            <div className="grid grid-cols-2 gap-2">
                              {parsedData.skills.map((skill: string, index: number) => (
                                <div key={index} className="text-gray-700 text-sm">• {skill}</div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {selectedTemplate === 'minimalist' && (
                      <div className="p-8 bg-white max-h-[11in] max-w-[8.5in] mx-auto font-sans leading-relaxed overflow-hidden">
                        {/* Header Section */}
                        <div className="mb-6">
                          <h1 className="text-3xl font-light text-gray-900 mb-2 tracking-wide">{parsedData.personal_info?.name || "Your Name"}</h1>
                          <p className="text-xl text-gray-600 mb-4 font-light">
                            {parsedData.experiences?.[0]?.title || "Professional Title"}
                          </p>
                          <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                            {parsedData.personal_info?.email && (
                              <span>{parsedData.personal_info.email}</span>
                            )}
                            {parsedData.personal_info?.phone && (
                              <span>{parsedData.personal_info.phone}</span>
                            )}
                            {parsedData.personal_info?.location && (
                              <span>{parsedData.personal_info.location}</span>
                            )}
                          </div>
                        </div>

                        {/* Summary Section */}
                        {parsedData.summary && (
                          <div className="mb-6">
                            <p className="text-gray-700 leading-relaxed text-justify text-sm">{parsedData.summary}</p>
                          </div>
                        )}

                        {/* Experience Section */}
                        {parsedData.experiences?.length > 0 && (
                          <div className="mb-6">
                            <h3 className="text-lg font-light text-gray-900 mb-4 uppercase tracking-wider">Experience</h3>
                            <div className="space-y-4">
                              {parsedData.experiences.map((exp: any, index: number) => (
                                <div key={index}>
                                  <div className="flex justify-between items-start mb-1">
                                    <div className="flex-1 pr-2">
                                      <h4 className="font-light text-gray-900 text-base">{exp.title}</h4>
                                      <p className="text-gray-600 text-sm font-light">{exp.company}</p>
                                    </div>
                                    <span className="text-gray-500 text-sm">{exp.duration}</span>
                                  </div>
                                  {exp.description && (
                                    <div className="text-gray-700 leading-relaxed mt-2 text-sm">{exp.description}</div>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Education Section */}
                        {parsedData.educations?.length > 0 && (
                          <div className="mb-6">
                            <h3 className="text-lg font-light text-gray-900 mb-4 uppercase tracking-wider">Education</h3>
                            <div className="space-y-3">
                              {parsedData.educations.map((edu: any, index: number) => (
                                <div key={index} className="flex justify-between items-start">
                                  <div className="flex-1 pr-2">
                                    <h4 className="font-light text-gray-900 text-base">{edu.degree}</h4>
                                    <p className="text-gray-600 text-sm font-light">{edu.institution}</p>
                                  </div>
                                  <span className="text-gray-500 text-sm">{edu.year}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Skills Section */}
                        {parsedData.skills?.length > 0 && (
                          <div className="mb-4">
                            <h3 className="text-lg font-light text-gray-900 mb-4 uppercase tracking-wider">Skills</h3>
                            <div className="flex flex-wrap gap-2">
                              {parsedData.skills.map((skill: string, index: number) => (
                                <span key={index} className="text-gray-700 text-sm">{skill}</span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {selectedTemplate === 'tech' && (
                      <div className="p-8 bg-gray-900 text-white max-h-[11in] max-w-[8.5in] mx-auto font-mono leading-relaxed overflow-hidden">
                        {/* Header Section */}
                        <div className="flex justify-between items-start mb-6 pb-4 border-b border-gray-700">
                          <div className="flex-1 pr-4">
                            <h1 className="text-2xl font-bold text-cyan-400 mb-2">// {parsedData.personal_info?.name || "Your Name"}</h1>
                            <p className="text-lg text-purple-400 mb-3 font-medium">
                              {parsedData.experiences?.[0]?.title || "Professional Title"}
                            </p>
                            <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                              {parsedData.personal_info?.email && (
                                <div className="flex items-center gap-2">
                                  <span className="text-cyan-400">📧</span>
                                  <span>{parsedData.personal_info.email}</span>
                                </div>
                              )}
                              {parsedData.personal_info?.phone && (
                                <div className="flex items-center gap-2">
                                  <span className="text-cyan-400">📱</span>
                                  <span>{parsedData.personal_info.phone}</span>
                                </div>
                              )}
                              {parsedData.personal_info?.location && (
                                <div className="flex items-center gap-2">
                                  <span className="text-cyan-400">📍</span>
                                  <span>{parsedData.personal_info.location}</span>
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="w-16 h-16 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full flex items-center justify-center text-black font-bold text-xl shadow-lg">
                            {(parsedData.personal_info?.name || "Y")[0].toUpperCase()}
                          </div>
                        </div>

                        {/* Summary Section */}
                        {parsedData.summary && (
                          <div className="mb-6">
                            <h3 className="text-cyan-400 font-bold mb-3">// SUMMARY</h3>
                            <p className="text-gray-300 leading-relaxed text-sm pl-4 border-l-2 border-cyan-400">{parsedData.summary}</p>
                          </div>
                        )}

                        {/* Experience Section */}
                        {parsedData.experiences?.length > 0 && (
                          <div className="mb-6">
                            <h3 className="text-cyan-400 font-bold mb-4">// EXPERIENCE</h3>
                            <div className="space-y-4">
                              {parsedData.experiences.map((exp: any, index: number) => (
                                <div key={index} className="pl-4 border-l-2 border-purple-500">
                                  <div className="flex justify-between items-start mb-2">
                                    <div className="flex-1 pr-2">
                                      <h4 className="font-bold text-white text-base">{exp.title}</h4>
                                      <p className="text-purple-400 text-sm">{exp.company}</p>
                                    </div>
                                    <span className="text-cyan-400 bg-gray-800 px-2 py-1 rounded text-xs">{exp.duration}</span>
                                  </div>
                                  {exp.description && (
                                    <div className="text-gray-300 leading-relaxed text-sm">{exp.description}</div>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Education Section */}
                        {parsedData.educations?.length > 0 && (
                          <div className="mb-6">
                            <h3 className="text-cyan-400 font-bold mb-4">// EDUCATION</h3>
                            <div className="space-y-3 pl-4 border-l-2 border-purple-500">
                              {parsedData.educations.map((edu: any, index: number) => (
                                <div key={index} className="flex justify-between items-start">
                                  <div className="flex-1 pr-2">
                                    <h4 className="font-bold text-white text-base">{edu.degree}</h4>
                                    <p className="text-gray-400 text-sm">{edu.institution}</p>
                                  </div>
                                  <span className="text-cyan-400 bg-gray-800 px-2 py-1 rounded text-xs">{edu.year}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Skills Section */}
                        {parsedData.skills?.length > 0 && (
                          <div className="mb-4">
                            <h3 className="text-cyan-400 font-bold mb-4">// SKILLS</h3>
                            <div className="flex flex-wrap gap-3 pl-4 border-l-2 border-purple-500">
                              {parsedData.skills.map((skill: string, index: number) => (
                                <span key={index} className="bg-gradient-to-r from-cyan-500 to-purple-500 text-black px-3 py-1 rounded-full text-sm font-medium">
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {selectedTemplate === 'academic' && (
                      <div className="p-8 bg-gradient-to-br from-emerald-50 to-teal-50 max-h-[11in] max-w-[8.5in] mx-auto font-serif leading-relaxed overflow-hidden">
                        {/* Header Section */}
                        <div className="text-center mb-6 pb-4 border-b-2 border-emerald-300">
                          <h1 className="text-3xl font-serif text-gray-900 mb-2">{parsedData.personal_info?.name || "Your Name"}</h1>
                          <p className="text-xl text-emerald-700 mb-3 font-medium">
                            {parsedData.experiences?.[0]?.title || "Research Professional"}
                          </p>
                          <div className="text-sm text-gray-600 mb-2">
                            {parsedData.educations?.[0]?.institution || "Academic Institution"}
                          </div>
                          <div className="flex justify-center space-x-6 text-sm text-gray-600">
                            {parsedData.personal_info?.email && <span>📧 {parsedData.personal_info.email}</span>}
                            {parsedData.personal_info?.phone && <span>📱 {parsedData.personal_info.phone}</span>}
                            {parsedData.personal_info?.location && <span>📍 {parsedData.personal_info.location}</span>}
                          </div>
                        </div>

                        {/* Summary Section */}
                        {parsedData.summary && (
                          <div className="mb-6">
                            <h3 className="text-lg font-serif text-gray-900 mb-3 uppercase tracking-wide border-b border-emerald-300 pb-1">Professional Summary</h3>
                            <p className="text-gray-700 leading-relaxed text-justify indent-8 text-sm">{parsedData.summary}</p>
                          </div>
                        )}

                        {/* Experience/Research Section */}
                        {parsedData.experiences?.length > 0 && (
                          <div className="mb-6">
                            <h3 className="text-lg font-serif text-gray-900 mb-4 uppercase tracking-wide border-b border-emerald-300 pb-1">Research & Professional Experience</h3>
                            <div className="space-y-4">
                              {parsedData.experiences.map((exp: any, index: number) => (
                                <div key={index}>
                                  <div className="flex justify-between items-start mb-2">
                                    <div className="flex-1 pr-2">
                                      <h4 className="font-medium text-gray-900 text-base">{exp.title}</h4>
                                      <p className="text-emerald-700 text-sm italic">{exp.company}</p>
                                    </div>
                                    <span className="text-gray-600 bg-emerald-100 px-2 py-1 rounded text-xs">{exp.duration}</span>
                                  </div>
                                  {exp.description && (
                                    <div className="text-gray-700 leading-relaxed text-sm indent-4">{exp.description}</div>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Education Section */}
                        {parsedData.educations?.length > 0 && (
                          <div className="mb-6">
                            <h3 className="text-lg font-serif text-gray-900 mb-4 uppercase tracking-wide border-b border-emerald-300 pb-1">Education</h3>
                            <div className="space-y-3">
                              {parsedData.educations.map((edu: any, index: number) => (
                                <div key={index} className="flex justify-between items-start">
                                  <div className="flex-1 pr-2">
                                    <h4 className="font-medium text-gray-900 text-base">{edu.degree}</h4>
                                    <p className="text-gray-600 text-sm">{edu.institution}</p>
                                  </div>
                                  <span className="text-gray-600 bg-emerald-100 px-2 py-1 rounded text-xs">{edu.year}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Skills/Competencies Section */}
                        {parsedData.skills?.length > 0 && (
                          <div className="mb-4">
                            <h3 className="text-lg font-serif text-gray-900 mb-4 uppercase tracking-wide border-b border-emerald-300 pb-1">Research Competencies & Skills</h3>
                            <div className="text-gray-700 leading-relaxed text-sm">
                              {parsedData.skills.join(' • ')}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {selectedTemplate === 'startup' && (
                      <div className="p-6 bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 max-h-[11in] max-w-[8.5in] mx-auto overflow-hidden">
                        <div className="flex items-center space-x-4 mb-6">
                          <div className="w-20 h-20 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center text-white font-bold text-2xl shadow-xl">
                            {(parsedData.personal_info?.name || "Y")[0].toUpperCase()}
                          </div>
                          <div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-1">{parsedData.personal_info?.name || "Your Name"}</h1>
                            <p className="text-xl text-orange-600 font-medium">
                              {parsedData.experiences?.[0]?.title || "Startup Professional"}
                            </p>
                            <div className="text-sm text-gray-600 mt-2">
                              {parsedData.personal_info?.email && <div>{parsedData.personal_info.email}</div>}
                              {parsedData.personal_info?.phone && <div>{parsedData.personal_info.phone}</div>}
                              {parsedData.personal_info?.location && <div>{parsedData.personal_info.location}</div>}
                            </div>
                          </div>
                        </div>

                        {parsedData.summary && (
                          <div className="mb-6">
                            <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center">
                              <span className="w-3 h-3 bg-orange-500 rounded-full mr-3"></span>
                              Mission
                            </h3>
                            <p className="text-gray-700 leading-relaxed text-base">{parsedData.summary}</p>
                          </div>
                        )}

                        {parsedData.experiences?.length > 0 && (
                          <div className="mb-6">
                            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                              <span className="w-3 h-3 bg-orange-500 rounded-full mr-3"></span>
                              Journey
                            </h3>
                            <div className="space-y-4">
                              {parsedData.experiences.map((exp: any, index: number) => (
                                <div key={index} className="border-l-4 border-orange-500 pl-6">
                                  <div className="flex justify-between items-start mb-2">
                                    <h4 className="font-bold text-gray-900 text-lg">{exp.title}</h4>
                                    <span className="text-orange-600 bg-orange-100 px-3 py-1 rounded-full text-sm font-medium">{exp.duration}</span>
                                  </div>
                                  <p className="text-gray-600 mb-2 text-base">{exp.company}</p>
                                  {exp.description && (
                                    <div className="text-gray-700 whitespace-pre-line text-sm leading-relaxed">{exp.description}</div>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {parsedData.educations?.length > 0 && (
                          <div className="mb-6">
                            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                              <span className="w-3 h-3 bg-orange-500 rounded-full mr-3"></span>
                              Foundation
                            </h3>
                            <div className="space-y-3">
                              {parsedData.educations.map((edu: any, index: number) => (
                                <div key={index}>
                                  <h4 className="font-bold text-gray-900 text-lg">{edu.degree}</h4>
                                  <p className="text-gray-600 text-base">{edu.institution} {edu.year && `• ${edu.year}`}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {parsedData.skills?.length > 0 && (
                          <div className="mb-4">
                            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                              <span className="w-3 h-3 bg-orange-500 rounded-full mr-3"></span>
                              Superpowers
                            </h3>
                            <div className="flex flex-wrap gap-3">
                              {parsedData.skills.map((skill: string, index: number) => (
                                <span key={index} className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 rounded-full text-sm font-medium shadow-md">
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </>
                ) : (
                  <div className="p-6 text-center text-gray-500">
                    <p>Enter your information and click "Generate Resume with AI" to see your resume preview</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}