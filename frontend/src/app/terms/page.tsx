"use client";

import { Brain, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function TermsPage() {
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

          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Terms of Service
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mb-8">
            Last updated: December 2, 2025
          </p>

          <div className="prose prose-slate dark:prose-invert max-w-none space-y-8">
            <section>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">1. Acceptance of Terms</h2>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                By accessing and using Smart Hiring OS, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to these Terms of Service, please do not use our service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">2. Use License</h2>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                Permission is granted to temporarily use Smart Hiring OS for personal or commercial recruitment purposes. This is the grant of a license, not a transfer of title, and under this license you may not:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-slate-700 dark:text-slate-300">
                <li>Modify or copy the materials</li>
                <li>Use the materials for any commercial purpose without authorization</li>
                <li>Attempt to decompile or reverse engineer any software</li>
                <li>Remove any copyright or proprietary notations</li>
                <li>Transfer the materials to another person or "mirror" the materials on any other server</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">3. User Accounts</h2>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                When you create an account with us, you must provide accurate, complete, and current information. Failure to do so constitutes a breach of the Terms. You are responsible for safeguarding your password and for all activities that occur under your account.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">4. AI-Powered Services</h2>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                Our platform uses NVIDIA AI and machine learning algorithms to analyze resumes and match candidates with job postings. While we strive for accuracy, AI-generated insights should be used as guidance and not as the sole basis for hiring decisions. Human oversight is recommended for all recruitment decisions.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">5. Data Privacy</h2>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                We take the privacy and security of your data seriously. All resume data and personal information are encrypted and stored securely. We will never sell your data to third parties. For more details, please review our Privacy Policy.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">6. Intellectual Property</h2>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                The service and its original content, features, and functionality are owned by Smart Hiring OS and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">7. Termination</h2>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                We may terminate or suspend your account immediately, without prior notice or liability, for any reason, including if you breach the Terms. Upon termination, your right to use the service will immediately cease.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">8. Limitation of Liability</h2>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                In no event shall Smart Hiring OS be liable for any indirect, incidental, special, consequential or punitive damages resulting from your use of or inability to use the service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">9. Changes to Terms</h2>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                We reserve the right to modify or replace these Terms at any time. We will provide notice of any changes by posting the new Terms on this page and updating the "Last updated" date.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">10. Contact Us</h2>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                If you have any questions about these Terms, please contact us at:
              </p>
              <div className="mt-4 p-4 bg-rose-50 dark:bg-rose-900/20 rounded-lg border border-rose-200 dark:border-rose-800">
                <p className="text-slate-700 dark:text-slate-300">
                  <strong>Email:</strong> legal@smarthirings.com<br />
                  <strong>Address:</strong> Smart Hiring OS, 123 AI Street, Tech City, TC 12345
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
