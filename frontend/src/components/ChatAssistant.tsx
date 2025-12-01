"use client";

import { useState, useRef, useEffect } from "react";
import { MessageCircle, Send, Bot, User, Loader2, X, Sparkles, Brain } from "lucide-react";
import axios from "axios";

interface Message {
  id: string;
  text: string;
  sender: "user" | "assistant";
  timestamp: string;
}

/**
 * AI Chat Assistant Component
 * Beautiful, modern chat interface with NVIDIA AI integration
 */
export default function ChatAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "👋 Hello! I'm your AI HR Assistant powered by NVIDIA Llama 3.1. I can help you with:\n\n• Resume screening guidance\n• Job matching strategies\n• HR best practices\n• Interview tips\n• Recruitment automation\n\nHow can I assist you today?",
      sender: "assistant",
      timestamp: new Date().toISOString()
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: message,
      sender: "user",
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setMessage("");
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("message", message);

      const response = await axios.post("http://127.0.0.1:8000/chat-assistant", formData);

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response.data.response,
        sender: "assistant",
        timestamp: response.data.timestamp
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Chat error:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "Sorry, I'm having trouble connecting right now. Please try again later.",
        sender: "assistant",
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Floating Chat Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-8 right-8 group z-50"
        >
          {/* Glow effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-rose-400 via-orange-400 to-amber-400 rounded-full blur-xl opacity-60 group-hover:opacity-80 animate-pulse transition-opacity"></div>
          
          {/* Button */}
          <div className="relative p-5 bg-gradient-to-br from-rose-500 via-orange-500 to-amber-500 rounded-full shadow-2xl hover:shadow-3xl transform hover:scale-110 transition-all duration-300">
            <MessageCircle className="w-7 h-7 text-white" />
            
            {/* Notification Badge */}
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white animate-bounce">
              <Sparkles className="w-3 h-3 text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
            </div>
          </div>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-8 right-8 w-[420px] h-[650px] z-50 flex flex-col">
          {/* Backdrop glow */}
          <div className="absolute inset-0 bg-gradient-to-br from-rose-400/20 via-orange-400/20 to-amber-400/20 rounded-3xl blur-2xl"></div>
          
          <div className="relative bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-rose-100 dark:border-slate-700 overflow-hidden flex flex-col backdrop-blur-xl">
            {/* Header */}
            <div className="relative bg-gradient-to-br from-rose-500 via-orange-500 to-amber-500 p-6 border-b border-rose-200/20">
              {/* Animated background pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 left-0 w-40 h-40 bg-white rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-0 right-0 w-40 h-40 bg-white rounded-full blur-3xl animate-pulse delay-1000"></div>
              </div>
              
              <div className="relative flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {/* AI Avatar with glow */}
                  <div className="relative">
                    <div className="absolute inset-0 bg-white rounded-2xl blur-md opacity-50"></div>
                    <div className="relative p-3 bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg">
                      <Brain className="w-8 h-8 text-gradient-to-br from-rose-600 to-amber-600" />
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white animate-pulse"></div>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                      AI HR Assistant
                      <Sparkles className="w-4 h-4 animate-pulse" />
                    </h3>
                    <p className="text-sm text-white/90 font-medium">NVIDIA Llama 3.1 • Always Online</p>
                  </div>
                </div>
                
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-white/20 rounded-xl transition-all group"
                >
                  <X className="w-6 h-6 text-white group-hover:rotate-90 transition-transform duration-300" />
                </button>
              </div>

              {/* Quick suggestions */}
              <div className="mt-4 flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                <button className="px-3 py-1.5 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full text-xs text-white whitespace-nowrap transition-all border border-white/30">
                  💼 Resume Tips
                </button>
                <button className="px-3 py-1.5 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full text-xs text-white whitespace-nowrap transition-all border border-white/30">
                  🎯 Job Matching
                </button>
                <button className="px-3 py-1.5 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full text-xs text-white whitespace-nowrap transition-all border border-white/30">
                  📊 HR Analytics
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gradient-to-br from-slate-50 via-rose-50/30 to-amber-50/30 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
              {messages.map((msg, index) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"} animate-fadeIn`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {msg.sender === "assistant" && (
                    <div className="flex-shrink-0 mr-3">
                      <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-br from-rose-400 to-amber-400 rounded-full blur-md opacity-50"></div>
                        <div className="relative w-10 h-10 bg-gradient-to-br from-rose-500 to-amber-500 rounded-full flex items-center justify-center shadow-lg">
                          <Bot className="w-5 h-5 text-white" />
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div
                    className={`max-w-[75%] ${
                      msg.sender === "user"
                        ? "bg-gradient-to-br from-rose-500 via-orange-500 to-amber-500 text-white shadow-lg"
                        : "bg-white dark:bg-slate-800 text-slate-800 dark:text-white border border-slate-200 dark:border-slate-700 shadow-md"
                    } rounded-2xl overflow-hidden`}
                  >
                    <div className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        {msg.sender === "user" ? (
                          <User className="w-3.5 h-3.5 opacity-80" />
                        ) : (
                          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                        )}
                        <span className="text-xs opacity-70 font-medium">
                          {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-sm leading-relaxed whitespace-pre-line">{msg.text}</p>
                    </div>
                  </div>

                  {msg.sender === "user" && (
                    <div className="flex-shrink-0 ml-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center shadow-lg">
                        <User className="w-5 h-5 text-white" />
                      </div>
                    </div>
                  )}
                </div>
              ))}
              
              {isLoading && (
                <div className="flex justify-start animate-fadeIn">
                  <div className="flex-shrink-0 mr-3">
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-br from-rose-400 to-amber-400 rounded-full blur-md opacity-50 animate-pulse"></div>
                      <div className="relative w-10 h-10 bg-gradient-to-br from-rose-500 to-amber-500 rounded-full flex items-center justify-center shadow-lg">
                        <Bot className="w-5 h-5 text-white" />
                      </div>
                    </div>
                  </div>
                  <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 shadow-md">
                    <div className="flex items-center gap-3">
                      <div className="flex gap-1.5">
                        <div className="w-2 h-2 bg-gradient-to-r from-rose-500 to-amber-500 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gradient-to-r from-rose-500 to-amber-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gradient-to-r from-rose-500 to-amber-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                      <span className="text-sm text-slate-600 dark:text-slate-400 font-medium">AI is thinking...</span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white dark:bg-slate-900 border-t border-rose-100 dark:border-slate-700">
              <div className="flex gap-3">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me anything about HR, resumes, or recruitment..."
                  className="flex-1 px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-transparent text-sm text-slate-900 dark:text-white placeholder:text-slate-400 transition-all"
                  disabled={isLoading}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!message.trim() || isLoading}
                  className="relative p-3 bg-gradient-to-br from-rose-500 via-orange-500 to-amber-500 text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 group"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-rose-400 to-amber-400 rounded-xl blur opacity-0 group-hover:opacity-50 transition-opacity"></div>
                  <Send className="w-5 h-5 relative" />
                </button>
              </div>
              
              {/* Footer Badge */}
              <div className="mt-3 flex items-center justify-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                <div className="flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/20 rounded-full border border-green-200 dark:border-green-800">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-green-700 dark:text-green-400 font-medium">NVIDIA AI Active</span>
                </div>
                <span>•</span>
                <span className="font-medium">Secure & Private</span>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
        
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </>
  );
}