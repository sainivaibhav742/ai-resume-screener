"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import ProtectedRoute from "@/components/ProtectedRoute";
import { LayoutDashboard, Users, Briefcase, FileText, BarChart3, MessageSquare, Settings, Search } from "lucide-react";

const recruiterNavItems = [
  { name: "Dashboard", href: "/recruiter/dashboard", icon: LayoutDashboard },
  { name: "Job Postings", href: "/recruiter/jobs", icon: Briefcase },
  { name: "Candidates", href: "/recruiter/candidates", icon: Users },
  { name: "Screen Resumes", href: "/recruiter/screen", icon: FileText },
  { name: "Analytics", href: "/recruiter/analytics", icon: BarChart3 },
  { name: "Messages", href: "/recruiter/messages", icon: MessageSquare },
  { name: "Settings", href: "/recruiter/settings", icon: Settings },
];

export default function RecruiterMessages() {
  const [selectedChat, setSelectedChat] = useState(1);

  const conversations = [
    { id: 1, name: "John Doe", lastMessage: "Thank you for the opportunity...", time: "10:30 AM", unread: 2, avatar: "J" },
    { id: 2, name: "Jane Smith", lastMessage: "I'm available for the interview", time: "Yesterday", unread: 0, avatar: "J" },
    { id: 3, name: "Mike Johnson", lastMessage: "Could you provide more details?", time: "2 days ago", unread: 1, avatar: "M" },
  ];

  const messages = [
    { id: 1, sender: "John Doe", content: "Thank you for considering my application.", time: "10:00 AM", isOwn: false },
    { id: 2, sender: "You", content: "We're impressed with your qualifications.", time: "10:15 AM", isOwn: true },
    { id: 3, sender: "John Doe", content: "I'd love to discuss this opportunity further.", time: "10:30 AM", isOwn: false },
  ];

  return (
    <ProtectedRoute requireRole="recruiter">
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <Sidebar navItems={recruiterNavItems} themeColor="emerald" portalName="Recruiter Portal" />
        
        <div className="ml-64">
          <div className="p-8">
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-slate-800 dark:text-slate-100 mb-2">Messages</h1>
              <p className="text-slate-600 dark:text-slate-400">Communicate with candidates</p>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden" style={{ height: "calc(100vh - 250px)" }}>
              <div className="flex h-full">
                <div className="w-1/3 border-r border-slate-200 dark:border-slate-700 flex flex-col">
                  <div className="p-4 border-b border-slate-200 dark:border-slate-700">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Search messages..."
                        className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800 dark:text-slate-100"
                      />
                    </div>
                  </div>
                  
                  <div className="flex-1 overflow-y-auto">
                    {conversations.map((conv) => (
                      <div
                        key={conv.id}
                        onClick={() => setSelectedChat(conv.id)}
                        className={`p-4 cursor-pointer transition-colors border-b border-slate-100 dark:border-slate-700 ${
                          selectedChat === conv.id ? "bg-emerald-50 dark:bg-emerald-900/20" : "hover:bg-slate-50 dark:hover:bg-slate-700"
                        }`}
                      >
                        <div className="flex gap-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                            {conv.avatar}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start mb-1">
                              <h3 className="font-semibold text-slate-800 dark:text-slate-100 truncate">{conv.name}</h3>
                              <span className="text-xs text-slate-500 dark:text-slate-400 flex-shrink-0 ml-2">{conv.time}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <p className="text-sm text-slate-600 dark:text-slate-400 truncate">{conv.lastMessage}</p>
                              {conv.unread > 0 && (
                                <span className="ml-2 px-2 py-0.5 bg-emerald-600 text-white text-xs rounded-full flex-shrink-0">{conv.unread}</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex-1 flex flex-col">
                  <div className="p-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center text-white font-bold">J</div>
                      <div>
                        <h3 className="font-semibold text-slate-800 dark:text-slate-100">John Doe</h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Active now</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.map((message) => (
                      <div key={message.id} className={`flex ${message.isOwn ? "justify-end" : "justify-start"}`}>
                        <div className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg ${
                          message.isOwn ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white" : "bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-100"
                        }`}>
                          <p className="text-sm">{message.content}</p>
                          <p className={`text-xs mt-1 ${message.isOwn ? "text-emerald-100" : "text-slate-500 dark:text-slate-400"}`}>{message.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="p-4 border-t border-slate-200 dark:border-slate-700">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Type a message..."
                        className="flex-1 px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800 dark:text-slate-100"
                      />
                      <button className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold rounded-lg shadow-lg transition-all duration-300">
                        Send
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
