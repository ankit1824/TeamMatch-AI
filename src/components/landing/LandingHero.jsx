import React from "react";
import { motion } from "motion/react";
import { BrainCircuit, Users, Code, Zap } from "lucide-react";

const LandingHero = ({ onGetStarted }) => {
  return (
    <section className="relative pt-36 pb-24 lg:pt-52 lg:pb-36 overflow-hidden">
      {/* Background radial glows */}
      <div className="absolute top-1/4 left-1/10 w-96 h-96 bg-indigo-600/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-1/3 right-1/10 w-96 h-96 bg-violet-600/10 rounded-full blur-[100px] pointer-events-none" />
      
      {/* Background floating icons */}
      <div className="absolute top-1/4 left-10 text-indigo-500/5 p-4 transform -rotate-12 pointer-events-none">
        <Users size={120} />
      </div>
      <div className="absolute top-1/3 right-10 text-violet-500/5 p-4 transform rotate-12 pointer-events-none">
        <BrainCircuit size={150} />
      </div>
      <div className="absolute bottom-10 left-1/4 text-cyan-500/5 p-4 pointer-events-none">
        <Code size={100} />
      </div>
      
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-bold mb-8 shadow-inner">
            <Zap size={14} className="text-amber-400 fill-amber-400" />
            <span>The #1 AI-Driven Teammate Recommender</span>
          </div>
 
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-white tracking-tight mb-6 leading-tight">
            Find Your Perfect Hackathon Team in <span className="bg-gradient-to-r from-cyan-400 via-indigo-400 to-violet-500 bg-clip-text text-transparent">Seconds with AI</span>
          </h1>
          
          <p className="mt-6 max-w-2xl mx-auto text-lg md:text-xl text-slate-400 mb-10 leading-relaxed font-normal">
            No more manual spreadsheet searching. Our machine learning engine analyzes your skill vectors, interests, and availability to suggest perfectly balanced, complementary squad members.
          </p>
          
          <motion.div 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-block"
          >
            <button
              onClick={onGetStarted}
              className="px-8 py-4 rounded-2xl bg-gradient-to-r from-indigo-650 to-violet-600 hover:opacity-95 text-white font-bold text-lg shadow-xl shadow-indigo-500/25 transition-all flex items-center gap-2 group cursor-pointer"
            >
              Get Started – Create Profile
              <span className="group-hover:translate-x-1.5 transition-transform">→</span>
            </button>
          </motion.div>
          
          <div className="mt-20 flex flex-wrap justify-center gap-4 sm:gap-6">
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 backdrop-blur-md border border-white/10 text-xs font-semibold text-slate-300 shadow-sm">
              <Code size={14} className="text-cyan-400" />
              Powered by React
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 backdrop-blur-md border border-white/10 text-xs font-semibold text-slate-300 shadow-sm">
              <div className="w-3.5 h-3.5 rounded bg-emerald-500 flex items-center justify-center text-[9px] text-white font-black">F</div>
              FastAPI (Python) Backend
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 backdrop-blur-md border border-white/10 text-xs font-semibold text-slate-300 shadow-sm">
              <BrainCircuit size={14} className="text-violet-400" />
              KNN & K-Means Engine
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default LandingHero;
