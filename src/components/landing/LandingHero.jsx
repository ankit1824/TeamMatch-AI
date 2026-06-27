import React from "react";
import { motion } from "motion/react";
import { BrainCircuit, Users, Code, Zap } from "lucide-react";

const LandingHero = ({ onGetStarted }) => {
  return (
    <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-1/4 left-10 text-blue-400/10 p-4 transform -rotate-12">
        <Users size={120} />
      </div>
      <div className="absolute top-1/3 right-10 text-blue-400/10 p-4 transform rotate-12">
        <BrainCircuit size={150} />
      </div>
      <div className="absolute bottom-10 left-1/4 text-blue-400/10 p-4">
        <Code size={100} />
      </div>
      
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 border border-blue-200 text-blue-700 text-sm font-semibold mb-8 shadow-sm">
            <Zap size={16} className="text-yellow-500 fill-yellow-500" />
            <span>The #1 Hackathon Matching Platform</span>
          </div>
 
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-slate-900 tracking-tight mb-6 leading-tight">
            Find Your Perfect Hackathon Team in <span className="text-blue-600 bg-clip-text">Seconds with AI</span>
          </h1>
          
          <p className="mt-6 max-w-2xl mx-auto text-xl text-slate-600 mb-10 leading-relaxed font-normal">
            Hackathon participants waste hours matching skills – our platform analyzes your skills, interests, and experience to suggest the best teammates intelligently.
          </p>
          
          <motion.div 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-block"
          >
            <button
              onClick={onGetStarted}
              className="px-8 py-4 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-semibold text-lg shadow-xl shadow-blue-500/40 transition-all flex items-center gap-2 group"
            >
              Get Started – Create Profile
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </button>
          </motion.div>
          
          <div className="mt-16 flex flex-wrap justify-center gap-4 sm:gap-8 opacity-80">
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/50 backdrop-blur-sm border border-slate-200 shadow-sm text-sm font-medium text-slate-700">
              <Code size={16} className="text-blue-500" />
              Powered by React
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/50 backdrop-blur-sm border border-slate-200 shadow-sm text-sm font-medium text-slate-700">
              <div className="w-4 h-4 rounded bg-emerald-500 flex items-center justify-center text-[10px] text-white font-bold">F</div>
              FastAPI (Python) Backend
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/50 backdrop-blur-sm border border-slate-200 shadow-sm text-sm font-medium text-slate-700">
              <BrainCircuit size={16} className="text-purple-500" />
              AI Matching Algorithm
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default LandingHero;
