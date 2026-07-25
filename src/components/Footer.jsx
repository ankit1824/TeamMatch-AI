import React from "react";
import { Github, Twitter, Linkedin, Mail, Heart } from "lucide-react";

const Footer = ({ setActiveTab }) => {
  return (
    <footer className="bg-[#020617] border-t border-white/5 pt-12 pb-8 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div className="col-span-1 md:col-span-1 space-y-4">
            <span className="text-xl font-extrabold bg-gradient-to-r from-white to-slate-200 bg-clip-text text-transparent">
              TeamMatch <span className="text-indigo-400 font-medium">AI</span>
            </span>
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
              Empowering hackers to find their perfect teammates using AI-driven semantic matching. Build faster, better, together.
            </p>
          </div>
          
          <div>
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-widest mb-4">Platform</h4>
            <ul className="space-y-2">
              <li><button onClick={() => setActiveTab?.("find-teammates")} className="text-slate-400 hover:text-indigo-400 text-sm transition-colors text-left cursor-pointer">Find Teammates</button></li>
              <li><button onClick={() => setActiveTab?.("hackathons")} className="text-slate-400 hover:text-indigo-400 text-sm transition-colors text-left cursor-pointer">Upcoming Hackathons</button></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-widest mb-4">Support</h4>
            <ul className="space-y-2">
              <li><button onClick={() => setActiveTab?.("help")} className="text-slate-400 hover:text-indigo-400 text-sm transition-colors text-left cursor-pointer">Help Center</button></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-widest mb-4">Connect</h4>
            <div className="flex space-x-4">
              <a href="https://github.com/Shatakshi0216" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-indigo-400 transition-colors">
                <Github size={18} />
              </a>
              <a href="https://x.com/Shatakshi021" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-indigo-400 transition-colors">
                <Twitter size={18} />
              </a>
              <a href="https://www.linkedin.com/in/shatakshitiwari017/" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-indigo-400 transition-colors">
                <Linkedin size={18} />
              </a>
              <a href="mailto:shatakshitiwari021@gmail.com" className="text-slate-400 hover:text-indigo-400 transition-colors">
                <Mail size={18} />
              </a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-slate-800/60 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-slate-500 text-xs">
            © {new Date().getFullYear()} TeamMatch AI. All rights reserved.
          </p>
          <p className="text-slate-500 text-xs flex items-center mt-4 md:mt-0">
            Made with <Heart size={12} className="mx-1 text-rose-500 fill-current" /> for the hacker community
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
