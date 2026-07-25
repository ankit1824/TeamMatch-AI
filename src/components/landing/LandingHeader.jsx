import React from "react";
import { Users } from "lucide-react";

const LandingHeader = ({ onSignIn, onSignUp }) => {
  return (
    <header className="fixed top-0 w-full z-50 bg-[#030712]/40 backdrop-blur-lg border-b text-white border-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.2)] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center gap-2 cursor-pointer">
            <div className="bg-gradient-to-br from-indigo-500 to-violet-600 p-2.5 rounded-xl text-white shadow-lg shadow-indigo-500/35">
              <Users size={20} strokeWidth={2.5} />
            </div>
            <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-white to-slate-200 bg-clip-text text-transparent">
              TeamMatch <span className="text-indigo-400 font-medium">AI</span>
            </span>
          </div>
          <div className="flex items-center gap-4 text-sm font-semibold">
            <button
              onClick={onSignIn}
              className="px-5 py-2.5 rounded-full text-slate-200 hover:text-white hover:bg-white/5 transition-all duration-300 border border-transparent hover:border-white/10"
            >
              Sign In
            </button>
            <button
              onClick={onSignUp}
              className="px-5 py-2.5 rounded-full bg-gradient-to-r from-indigo-600 to-violet-650 hover:opacity-90 hover:shadow-indigo-500/25 text-white shadow-lg shadow-indigo-500/10 transition-all hover:-translate-y-0.5"
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
