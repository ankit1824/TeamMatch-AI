import React from "react";
import { Github, Twitter, Linkedin, Mail, Heart } from "lucide-react";

const Footer = ({ setActiveTab }) => {
  return (
    <footer className="bg-white border-t border-gray-200 pt-12 pb-8 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div className="col-span-1 md:col-span-1">
            <span className="text-2xl font-bold text-indigo-600">TeamMatch AI</span>
            <p className="mt-4 text-gray-500 text-sm leading-relaxed">
              Empowering hackers to find their perfect teammates using AI-driven semantic matching. Build faster, better, together.
            </p>
          </div>
          
          <div>
            <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">Platform</h4>
            <ul className="space-y-2">
              <li><button onClick={() => setActiveTab?.("find-teammates")} className="text-gray-500 hover:text-indigo-600 text-sm transition-colors text-left">Find Teammates</button></li>
              <li><button onClick={() => setActiveTab?.("hackathons")} className="text-gray-500 hover:text-indigo-600 text-sm transition-colors text-left">Upcoming Hackathons</button></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">Support</h4>
            <ul className="space-y-2">
              <li><button onClick={() => setActiveTab?.("help")} className="text-gray-500 hover:text-indigo-600 text-sm transition-colors text-left">Help Center</button></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">Connect</h4>
            <div className="flex space-x-4">
              <a href="https://github.com/Shatakshi0216" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-indigo-600 transition-colors">
                <Github size={20} />
              </a>
              <a href="https://x.com/Shatakshi021" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-indigo-600 transition-colors">
                <Twitter size={20} />
              </a>
              <a href="https://www.linkedin.com/in/shatakshitiwari017/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-indigo-600 transition-colors">
                <Linkedin size={20} />
              </a>
              <a href="mailto:shatakshitiwari021@gmail.com" className="text-gray-400 hover:text-indigo-600 transition-colors">
                <Mail size={20} />
              </a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-100 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-xs">
            © {new Date().getFullYear()} TeamMatch AI. All rights reserved.
          </p>
          <p className="text-gray-400 text-xs flex items-center mt-4 md:mt-0">
            Made with <Heart size={12} className="mx-1 text-red-400 fill-current" /> for the hacker community
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
