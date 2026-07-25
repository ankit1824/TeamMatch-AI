import React from "react";
import { motion } from "motion/react";
import { UserPlus, Settings, Cpu, Trophy, ArrowRight } from "lucide-react";

const steps = [
  {
    Icon: UserPlus,
    title: "Sign Up & Create Profile",
    description: "Quick registration with email or Google OAuth.",
  },
  {
    Icon: Settings,
    title: "Input Skills / Interests",
    description: "Add your tech stack, project interests, and availability.",
  },
  {
    Icon: Cpu,
    title: "AI Analyzes & Matches",
    description: "Our algorithm finds the best compatible teammates.",
  },
  {
    Icon: Trophy,
    title: "View Best Teams",
    description: "Browse ranked matches and connect instantly.",
  },
];

const LandingHowItWorks = ({ onJoinNow }) => {
  return (
    <section className="py-24 bg-[#030712]/30 backdrop-blur-sm border-y border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">How It Works</h2>
          <p className="text-slate-450 text-base md:text-lg">
            Four simple steps to find your perfect hackathon team.
          </p>
        </div>

        <div className="relative">
          {/* Connection Line (Desktop only) */}
          <div className="hidden lg:block absolute top-[100px] left-0 w-full h-[1px] bg-gradient-to-r from-indigo-500/5 via-indigo-500/30 to-indigo-500/5 transform -translate-y-1/2 z-0" />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16 relative z-10">
            {steps.map((step, index) => (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                key={index}
                className="bg-white/5 border border-white/10 hover:bg-white/10 hover:border-indigo-500/40 rounded-2xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.2)] hover:shadow-[0_8px_30px_rgb(99,102,241,0.08)] transition-all flex flex-col items-center text-center group"
              >
                <div className="w-20 h-20 rounded-2xl bg-indigo-500/10 flex items-center justify-center mb-6 group-hover:bg-gradient-to-br group-hover:from-indigo-500 group-hover:to-violet-600 transition-all duration-300 shadow-inner group-hover:shadow-indigo-500/30">
                  <step.Icon className="w-10 h-10 text-indigo-400 group-hover:text-white transition-colors duration-300" />
                </div>
                <h3 className="text-lg font-bold text-white mb-3">{step.title}</h3>
                <p className="text-slate-400 leading-relaxed text-sm">
                  {step.description}
                </p>
                
                {/* Mobile/Tablet Arrow */}
                {index < steps.length - 1 && (
                  <div className="mt-6 lg:hidden text-indigo-500/30">
                    <ArrowRight size={24} />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
          
          <div className="text-center">
            <button
              onClick={onJoinNow}
              className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-650 hover:opacity-95 text-white font-bold shadow-lg shadow-indigo-500/20 transition-all hover:-translate-y-0.5 cursor-pointer"
            >
              Join Now
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LandingHowItWorks;
