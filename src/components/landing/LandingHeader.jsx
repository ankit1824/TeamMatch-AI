import React from "react";
import { Users } from "lucide-react";

const LandingHeader = ({ onSignIn, onSignUp }) => {
  return (
    <header className="fixed top-0 w-full z-50 bg-white/70 backdrop-blur-md border-b text-gray-900 border-white/20 shadow-[0_4px_30px_rgba(0,0,0,0.05)] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center gap-2 cursor-pointer">
            <div className="bg-blue-600 p-2 rounded-xl text-white shadow-lg shadow-blue-500/30">
              <Users size={24} strokeWidth={2.5} />
            </div>
            <span className="font-bold text-xl tracking-tight text-slate-800">
              AI Teammate Finder
            </span>
          </div>
          <div className="flex items-center gap-4 text-sm font-medium">
            <button
              onClick={onSignIn}
              className="px-5 py-2.5 rounded-full text-blue-600 hover:bg-blue-50 transition-colors border border-transparent hover:border-blue-100"
            >
              Sign In
            </button>
            <button
              onClick={onSignUp}
              className="px-5 py-2.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/30 transition-all hover:-translate-y-0.5"
            >
              Sign Up
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default LandingHeader;
