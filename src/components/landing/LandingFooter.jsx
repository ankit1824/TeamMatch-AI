import React from "react";
import { Users, Twitter, Linkedin, Github, Mail } from "lucide-react";

const LandingFooter = () => {
  return (
    <footer className="bg-[#1E3A8A] text-white pt-16 pb-8 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12 border-b border-blue-800 pb-12">
          {/* Left section */}
          <div className="space-y-4 pr-4">
            <div className="flex items-center gap-2">
              <div className="bg-white/10 p-2 rounded-lg text-white">
                <Users size={20} strokeWidth={2.5} />
              </div>
              <span className="font-bold text-lg tracking-tight">
                TeamMatch AI
              </span>
            </div>
            <p className="text-blue-200/80 leading-relaxed max-w-sm">
              Finding the perfect hackathon team has never been easier. Powered by AI matching technology to ensure optimal synergy and skillset alignment.
            </p>
          </div>

          {/* Middle section */}
          <div className="md:pl-10">
            <h4 className="font-semibold text-white mb-4 tracking-wide uppercase text-xs">Quick Links</h4>
            <ul className="space-y-3 text-blue-200/80">
              <li><a href="#" className="hover:text-white transition-colors">About</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">GitHub Repo</a></li>
            </ul>
          </div>

          {/* Right section */}
          <div className="md:pl-10">
            <h4 className="font-semibold text-white mb-4 tracking-wide uppercase text-xs">Connect With Us</h4>
            <div className="flex gap-4">
              <a href="https://x.com/Shatakshi021" target="_blank" rel="noopener noreferrer" className="p-2.5 bg-blue-900 rounded-lg text-blue-300 hover:text-white hover:bg-blue-800 transition-all">
                <Twitter size={18} />
              </a>
              <a href="https://www.linkedin.com/in/shatakshitiwari017/" target="_blank" rel="noopener noreferrer" className="p-2.5 bg-blue-900 rounded-lg text-blue-300 hover:text-white hover:bg-blue-800 transition-all">
                <Linkedin size={18} />
              </a>
              <a href="https://github.com/Shatakshi0216" target="_blank" rel="noopener noreferrer" className="p-2.5 bg-blue-900 rounded-lg text-blue-300 hover:text-white hover:bg-blue-800 transition-all">
                <Github size={18} />
              </a>
              <a href="mailto:shatakshitiwari021@gmail.com" className="p-2.5 bg-blue-900 rounded-lg text-blue-300 hover:text-white hover:bg-blue-800 transition-all">
                <Mail size={18} />
              </a>
            </div>
          </div>
        </div>

        <div className="text-center text-blue-300/60 text-xs mt-4 flex flex-col md:flex-row justify-between items-center">
          <p>© {new Date().getFullYear()} TeamMatch AI – Built for Hackathons</p>
        </div>
      </div>
    </footer>
  );
};

export default LandingFooter;
