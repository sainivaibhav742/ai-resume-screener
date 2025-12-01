"use client";

import { Brain, ArrowLeft, Shield, Lock, Eye, Database } from "lucide-react";
import Link from "next/link";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fef8f5] via-[#fff5f1] to-[#ffe8df] dark:from-[#1a1212] dark:via-[#2d2424] dark:to-[#1a1212]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
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

          <div className="flex items-center gap-3 mb-4">
            <Shield className="w-10 h-10 text-rose-600" />
            <h1 className="text-4xl font-bold text-slate-900 dark:text-white">
              Privacy Policy
            </h1>
          </div>
          <p className="text-slate-600 dark:text-slate-400 mb-8">
            Last updated: December 2, 2025
          </p>

          {/* Key Highlights */}
          <div className="grid md:grid-cols-3 gap-4 mb-12">
            <div className="p-4 bg-gradient-to-br from-rose-50 to-orange-50 dark:from-rose-900/20 dark:to-orange-900/20 rounded-xl border border-rose-200 dark:border-rose-800">
              <Lock className="w-8 h-8 text-rose-600 mb-3" />
              <h3 className="font-bold text-slate-900 dark:text-white mb-2">Encrypted</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">All data encrypted at rest and in transit</p>
            </div>
            <div className="p-4 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-xl border border-amber-200 dark:border-amber-800">
              <Eye className="w-8 h-8 text-amber-600 mb-3" />
              <h3 className="font-bold text-slate-900 dark:text-white mb-2">Transparent</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">You control your data and privacy settings</p>
            </div>
            <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl border border-green-200 dark:border-green-800">
              <Database className="w-8 h-8 text-green-600 mb-3" />
              <h3 className="font-bold text-slate-900 dark:text-white mb-2">No Selling</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">We never sell your data to third parties</p>
            </div>
          </div>

          <div className="prose prose-slate dark:prose-invert max-w-none space-y-8">
            <section>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">1. Information We Collect</h2>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                We collect information that you provide directly to us, including:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-slate-700 dark:text-slate-300">
                <li><strong>Account Information:</strong> Name, email address, password, company name</li>
                <li><strong>Profile Data:</strong> Work experience, education, skills, certifications</li>
                <li><strong>Resume Files:</strong> PDF, DOC, DOCX files you upload for screening</li>
                <li><strong>Job Postings:</strong> Job descriptions, requirements, and related data</li>
                <li><strong>Usage Data:</strong> How you interact with our platform and features</li>
                <li><strong>Communication Data:</strong> Messages sent through our chat assistant</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">2. How We Use Your Information</h2>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                We use the information we collect to:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-slate-700 dark:text-slate-300">
                <li>Provide, maintain, and improve our AI-powered recruitment services</li>
                <li>Process and analyze resumes using NVIDIA AI technology</li>
                <li>Match candidates with relevant job opportunities</li>
                <li>Send you technical notices, updates, and support messages</li>
                <li>Respond to your comments, questions, and requests</li>
                <li>Monitor and analyze trends, usage, and activities</li>
                <li>Detect, prevent, and address fraud and security issues</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">3. AI and Machine Learning</h2>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                Our platform uses NVIDIA AI and machine learning models to analyze resumes and match candidates with jobs. Your data is used to:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-slate-700 dark:text-slate-300 mt-4">
                <li>Extract skills, experience, and qualifications from resumes</li>
                <li>Calculate match scores between candidates and job postings</li>
                <li>Provide AI-powered recommendations and insights</li>
                <li>Improve our models (only with aggregated, anonymized data)</li>
              </ul>
              <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <p className="text-sm text-slate-700 dark:text-slate-300">
                  <strong>Note:</strong> We do not share your individual data with AI model providers. All processing happens on our secure servers.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">4. Data Sharing and Disclosure</h2>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                We do not sell, rent, or share your personal information with third parties except in the following circumstances:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-slate-700 dark:text-slate-300">
                <li><strong>With Your Consent:</strong> When you explicitly authorize us to share information</li>
                <li><strong>Service Providers:</strong> With vendors who perform services on our behalf (under strict confidentiality agreements)</li>
                <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
                <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">5. Data Security</h2>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                We implement industry-standard security measures to protect your data:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-slate-700 dark:text-slate-300 mt-4">
                <li>AES-256 encryption for data at rest</li>
                <li>TLS 1.3 encryption for data in transit</li>
                <li>Regular security audits and penetration testing</li>
                <li>Secure authentication with JWT tokens</li>
                <li>Access controls and monitoring</li>
                <li>Regular backups and disaster recovery plans</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">6. Your Rights and Choices</h2>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                You have the following rights regarding your personal data:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-slate-700 dark:text-slate-300">
                <li><strong>Access:</strong> Request a copy of your personal data</li>
                <li><strong>Correction:</strong> Update or correct inaccurate information</li>
                <li><strong>Deletion:</strong> Request deletion of your account and data</li>
                <li><strong>Portability:</strong> Export your data in a machine-readable format</li>
                <li><strong>Opt-out:</strong> Unsubscribe from marketing communications</li>
                <li><strong>Restriction:</strong> Limit how we process your data</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">7. Cookies and Tracking</h2>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                We use cookies and similar tracking technologies to collect information about your browsing activities. You can control cookies through your browser settings. For more details, see our Cookie Policy.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">8. Data Retention</h2>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                We retain your personal data for as long as necessary to provide our services and comply with legal obligations. You can request deletion of your data at any time, and we will process it within 30 days unless legally required to retain it.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">9. International Data Transfers</h2>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                Your information may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place to protect your data in accordance with this Privacy Policy.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">10. Children's Privacy</h2>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                Our services are not directed to individuals under 18 years of age. We do not knowingly collect personal information from children. If you become aware that a child has provided us with personal data, please contact us.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">11. Changes to Privacy Policy</h2>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the "Last updated" date. Continued use of our services after changes constitutes acceptance of the updated policy.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">12. Contact Us</h2>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                If you have any questions about this Privacy Policy or our data practices, please contact us:
              </p>
              <div className="p-6 bg-gradient-to-br from-rose-50 to-orange-50 dark:from-rose-900/20 dark:to-orange-900/20 rounded-xl border border-rose-200 dark:border-rose-800">
                <p className="text-slate-700 dark:text-slate-300 space-y-2">
                  <strong className="block text-lg text-slate-900 dark:text-white mb-3">Privacy Team</strong>
                  <span className="block"><strong>Email:</strong> privacy@smarthirings.com</span>
                  <span className="block"><strong>Address:</strong> Smart Hiring OS, 123 AI Street, Tech City, TC 12345</span>
                  <span className="block"><strong>Phone:</strong> +1 (555) 123-4567</span>
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
