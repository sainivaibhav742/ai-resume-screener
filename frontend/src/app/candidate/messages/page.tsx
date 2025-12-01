"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import ProtectedRoute from "@/components/ProtectedRoute";
import { FileText, LayoutDashboard, User, Settings, MessageSquare, Briefcase, Send as SendIcon, Search } from "lucide-react";

const candidateNavItems = [
  { name: "Dashboard", href: "/candidate/dashboard", icon: LayoutDashboard },
  { name: "My Resumes", href: "/candidate/resumes", icon: FileText },
  { name: "Browse Jobs", href: "/candidate/jobs", icon: Briefcase },
  { name: "Applications", href: "/candidate/applications", icon: SendIcon },
  { name: "Profile", href: "/candidate/profile", icon: User },
  { name: "Messages", href: "/candidate/messages", icon: MessageSquare },
  { name: "Settings", href: "/candidate/settings", icon: Settings },
];

export default function Messages() {
  const [selectedChat, setSelectedChat] = useState(1);
  const [conversations] = useState([
    {
      id: 1,
      name: "Tech Solutions Inc.",
      lastMessage: "We'd like to schedule an interview...",
      time: "10:30 AM",
      unread: 2,
      avatar: "T",
    },
    {
      id: 2,
      name: "CloudTech Corp",
      lastMessage: "Thank you for your application",
      time: "Yesterday",
      unread: 0,
      avatar: "C",
    },
    {
      id: 3,
      name: "Design Studio",
      lastMessage: "Could you provide more details...",
      time: "2 days ago",
      unread: 1,
      avatar: "D",
    },
  ]);

  const [messages] = useState([
    {
      id: 1,
      sender: "Tech Solutions Inc.",
      content: "Hi John, thank you for applying to our Senior Full Stack Developer position.",
      time: "10:00 AM",
      isOwn: false,
    },
    {
      id: 2,
      sender: "You",
      content: "Thank you for considering my application. I'm very interested in this opportunity.",
      time: "10:15 AM",
      isOwn: true,
    },
    {
      id: 3,
      sender: "Tech Solutions Inc.",
      content: "We'd like to schedule an interview with you. Are you available next Tuesday at 2 PM?",
      time: "10:30 AM",
      isOwn: false,
    },
  ]);

  return (
    <ProtectedRoute requireRole="candidate">
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <Sidebar navItems={candidateNavItems} themeColor="blue" portalName="Candidate Portal" />
        
        <div className="ml-64">
          <div className="p-8">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-slate-800 dark:text-slate-100 mb-2">
                Messages
              </h1>
              <p className="text-slate-600 dark:text-slate-400">
                Communicate with recruiters
              </p>
            </div>

            {/* Messages Container */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden" style={{ height: "calc(100vh - 250px)" }}>
              <div className="flex h-full">
                {/* Conversations List */}
                <div className="w-1/3 border-r border-slate-200 dark:border-slate-700 flex flex-col">
                  <div className="p-4 border-b border-slate-200 dark:border-slate-700">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Search messages..."
                        className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 dark:text-slate-100"
                      />
                    </div>
                  </div>
                  
                  <div className="flex-1 overflow-y-auto">
                    {conversations.map((conv) => (
                      <div
                        key={conv.id}
                        onClick={() => setSelectedChat(conv.id)}
                        className={`p-4 cursor-pointer transition-colors border-b border-slate-100 dark:border-slate-700 ${
                          selectedChat === conv.id
                            ? "bg-blue-50 dark:bg-blue-900/20"
                            : "hover:bg-slate-50 dark:hover:bg-slate-700"
                        }`}
                      >
                        <div className="flex gap-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                            {conv.avatar}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start mb-1">
                              <h3 className="font-semibold text-slate-800 dark:text-slate-100 truncate">
                                {conv.name}
                              </h3>
                              <span className="text-xs text-slate-500 dark:text-slate-400 flex-shrink-0 ml-2">
                                {conv.time}
                              </span>
                            </div>
                            <div className="flex justify-between items-center">
                              <p className="text-sm text-slate-600 dark:text-slate-400 truncate">
                                {conv.lastMessage}
                              </p>
                              {conv.unread > 0 && (
                                <span className="ml-2 px-2 py-0.5 bg-blue-600 text-white text-xs rounded-full flex-shrink-0">
                                  {conv.unread}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Chat Area */}
                <div className="flex-1 flex flex-col">
                  {/* Chat Header */}
                  <div className="p-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold">
                        T
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-800 dark:text-slate-100">
                          Tech Solutions Inc.
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          Active now
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.isOwn ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg ${
                            message.isOwn
                              ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white"
                              : "bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-100"
                          }`}
                        >
                          <p className="text-sm">{message.content}</p>
                          <p
                            className={`text-xs mt-1 ${
                              message.isOwn ? "text-blue-100" : "text-slate-500 dark:text-slate-400"
                            }`}
                          >
                            {message.time}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Message Input */}
                  <div className="p-4 border-t border-slate-200 dark:border-slate-700">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Type a message..."
                        className="flex-1 px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 dark:text-slate-100"
                      />
                      <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-lg shadow-lg transition-all duration-300">
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
