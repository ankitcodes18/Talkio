import React from 'react'
import { MessageCircle, Users, Send } from "lucide-react";

const LandingPage = () => {
  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-purple-700 via-pink-500 to-red-500 flex flex-col items-center justify-center text-white px-6">
      
      {/* Background floating blobs */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-purple-400 rounded-full opacity-30 blur-3xl animate-blob"></div>
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-pink-400 rounded-full opacity-30 blur-3xl animate-blob animation-delay-2000"></div>
      <div className="absolute top-1/2 left-1/2 w-72 h-72 bg-red-400 rounded-full opacity-30 blur-2xl animate-blob animation-delay-4000"></div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center max-w-4xl">
        
        {/* App Name */}
        <h1 className="text-8xl font-extrabold mb-4 animate-pulse drop-shadow-lg">Talkio</h1>

        {/* Taglines */}
        <p className="text-2xl mb-2 max-w-xl">
          Connect with friends, colleagues, and communities instantly.
        </p>
        <p className="text-lg mb-12 max-w-xl text-white/90">
          Chat seamlessly, share moments, and stay in the loop wherever you go.
        </p>

        {/* Feature Cards */}
        <div className="flex flex-col md:flex-row gap-6 mb-12">
          <div className="flex flex-col items-center bg-white/10 backdrop-blur-md rounded-2xl p-6 w-64 hover:scale-105 transition-transform shadow-lg">
            <MessageCircle className="w-12 h-12 mb-3 text-white" />
            <h3 className="font-semibold text-lg mb-1">Instant Messaging</h3>
            <p className="text-sm text-white/80">Send and receive messages instantly.</p>
          </div>
          <div className="flex flex-col items-center bg-white/10 backdrop-blur-md rounded-2xl p-6 w-64 hover:scale-105 transition-transform shadow-lg">
            <Users className="w-12 h-12 mb-3 text-white" />
            <h3 className="font-semibold text-lg mb-1">Group Chats</h3>
            <p className="text-sm text-white/80">Connect with multiple friends at once.</p>
          </div>
          <div className="flex flex-col items-center bg-white/10 backdrop-blur-md rounded-2xl p-6 w-64 hover:scale-105 transition-transform shadow-lg">
            <Send className="w-12 h-12 mb-3 text-white" />
            <h3 className="font-semibold text-lg mb-1">Share Anything</h3>
            <p className="text-sm text-white/80">Send media, files, and more without limits.</p>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-6 mb-16">
          <a
            href="/login"
            className="px-10 py-4 bg-white text-purple-700 font-bold rounded-xl shadow-lg hover:bg-purple-50 transform hover:-translate-y-1 transition-all"
          >
            Login
          </a>
          <a
            href="/signup"
            className="px-10 py-4 bg-purple-700 text-white font-bold rounded-xl shadow-lg hover:bg-purple-800 transform hover:-translate-y-1 transition-all"
          >
            Sign Up
          </a>
        </div>

      </div>

      {/* Footer */}
      <footer className="absolute bottom-4 text-white/70 text-sm">
        &copy; 2025 Talkio. Chat, connect, and share moments.
      </footer>

      {/* Animation styles */}
      <style>
        {`
          @keyframes blob {
            0%, 100% { transform: translate(0px, 0px) scale(1); }
            33% { transform: translate(30px, -50px) scale(1.1); }
            66% { transform: translate(-20px, 20px) scale(0.9); }
          }
          .animate-blob {
            animation: blob 8s infinite;
          }
          .animation-delay-2000 { animation-delay: 2s; }
          .animation-delay-4000 { animation-delay: 4s; }
        `}
      </style>
    </div>
  )
}

export default LandingPage
