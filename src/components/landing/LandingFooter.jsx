import React from "react";
import { Users, Twitter, Linkedin, Github, Mail } from "lucide-react";

const LandingFooter = () => {
  return (
    <footer className="bg-[#020617] text-slate-400 pt-16 pb-8 text-sm border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12 border-b border-slate-800/60 pb-12">
          {/* Left section */}
          <div className="space-y-4 pr-4">
            <div className="flex items-center gap-2">
              <div className="bg-white/5 border border-white/10 p-2.5 rounded-xl text-white shadow-md">
                <Users size={18} strokeWidth={2.5} />
              </div>
              <span className="font-extrabold text-lg tracking-tight text-white">
                TeamMatch <span className="text-indigo-400 font-medium">AI</span>
              </span>
            </div>
            <p className="text-slate-400 leading-relaxed max-w-sm">
              Finding the perfect hackathon team has never been easier. Powered by AI matching technology to ensure optimal synergy and skillset alignment.
            </p>
          </div>

          {/* Middle section */}
          <div className="md:pl-10">
            <h4 className="font-bold text-slate-200 mb-4 tracking-wide uppercase text-xs">Quick Links</h4>
            <ul className="space-y-3 text-slate-400 font-medium">
              <li><a href="#" className="hover:text-white transition-colors">About</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">GitHub Repo</a></li>
            </ul>
          </div>

          {/* Right section */}
          <div className="md:pl-10">
            <h4 className="font-bold text-slate-200 mb-4 tracking-wide uppercase text-xs">Connect With Us</h4>
            <div className="flex gap-3">
              <a href="https://x.com/Shatakshi021" target="_blank" rel="noopener noreferrer" className="p-2.5 bg-white/5 border border-white/10 rounded-xl text-slate-400 hover:text-white hover:bg-indigo-650/20 hover:border-indigo-500/30 transition-all">
                <Twitter size={16} />
              </a>
              <a href="https://www.linkedin.com/in/shatakshitiwari017/" target="_blank" rel="noopener noreferrer" className="p-2.5 bg-white/5 border border-white/10 rounded-xl text-slate-400 hover:text-white hover:bg-indigo-650/20 hover:border-indigo-500/30 transition-all">
                <Linkedin size={16} />
              </a>
              <a href="https://github.com/Shatakshi0216" target="_blank" rel="noopener noreferrer" className="p-2.5 bg-white/5 border border-white/10 rounded-xl text-slate-400 hover:text-white hover:bg-indigo-650/20 hover:border-indigo-500/30 transition-all">
                <Github size={16} />
              </a>
              <a href="mailto:shatakshitiwari021@gmail.com" className="p-2.5 bg-white/5 border border-white/10 rounded-xl text-slate-400 hover:text-white hover:bg-indigo-650/20 hover:border-indigo-500/30 transition-all">
                <Mail size={16} />
              </a>
            </div>
          </div>
        </div>

        <div className="text-center text-slate-500 text-xs mt-4 flex flex-col md:flex-row justify-between items-center">
          <p>© {new Date().getFullYear()} TeamMatch AI – Built for Hackathons</p>
        </div>
      </div>
    </footer>
  );
};

export default LandingFooter;
