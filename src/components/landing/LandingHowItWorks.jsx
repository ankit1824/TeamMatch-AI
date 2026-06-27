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
    <section className="py-24 bg-white/40 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">How It Works</h2>
          <p className="text-lg text-slate-600">
            Four simple steps to find your perfect hackathon team.
          </p>
        </div>

        <div className="relative">
          {/* Connection Line API (Desktop only) */}
          <div className="hidden lg:block absolute top-[100px] left-0 w-full h-0.5 bg-gradient-to-r from-blue-100 via-blue-300 to-blue-100 transform -translate-y-1/2 z-0" />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16 relative z-10">
            {steps.map((step, index) => (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                key={index}
                className="bg-white rounded-2xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(37,99,235,0.1)] transition-all border border-slate-100 flex flex-col items-center text-center group"
              >
                <div className="w-20 h-20 rounded-2xl bg-blue-50 flex items-center justify-center mb-6 group-hover:bg-blue-600 transition-colors duration-300 shadow-inner group-hover:shadow-blue-500/30">
                  <step.Icon className="w-10 h-10 text-blue-600 group-hover:text-white transition-colors duration-300" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-3">{step.title}</h3>
                <p className="text-slate-600 leading-relaxed text-sm">
                  {step.description}
                </p>
                
                {/* Mobile/Tablet Arrow */}
                {index < steps.length - 1 && (
                  <div className="mt-6 lg:hidden text-blue-300">
                    <ArrowRight size={24} />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
          
          <div className="text-center">
            <button
              onClick={onJoinNow}
              className="px-8 py-3.5 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-semibold shadow-lg shadow-slate-900/20 transition-all hover:-translate-y-0.5"
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
