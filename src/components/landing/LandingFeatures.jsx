import React from "react";
import { motion } from "motion/react";
import { Sparkles, BarChart3, LayoutDashboard } from "lucide-react";

const features = [
  {
    icon: <Sparkles className="w-6 h-6 text-indigo-400" />,
    title: "Smart Profile Creation",
    description: "Build your profile with skills (React, Python tags), interests (AI/ML checkboxes), and experience level slider. Data stored securely in PostgreSQL.",
    accent: "bg-indigo-500/10",
  },
  {
    icon: <BarChart3 className="w-6 h-6 text-emerald-400" />,
    title: "AI Matching Magic",
    description: "Algorithm scoring algorithm leverages multiple dimensions:\n\n• 40% skill compatibility\n• 30% project interests\n• 20% experience\n• 10% availability",
    accent: "bg-emerald-500/10",
  },
  {
    icon: <LayoutDashboard className="w-6 h-6 text-amber-400" />,
    title: "Teammate Dashboard",
    description: "View ranked matches with compatibility percentage, skill overlap badges, and connect buttons. Instantly build the ultimate hackathon crew.",
    accent: "bg-amber-500/10",
  },
];

const LandingFeatures = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">Core Features</h2>
          <p className="text-slate-450 text-base md:text-lg">
            Everything you need to find the perfect hackathon teammates quickly and efficiently.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              key={index}
              className="bg-white/5 border border-white/10 hover:bg-white/10 hover:border-indigo-500/40 rounded-2xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.2)] hover:shadow-[0_20px_40px_rgb(99,102,241,0.06)] group transition-all duration-300"
            >
              <div className={`w-14 h-14 rounded-xl ${feature.accent} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-md`}>
                {feature.icon}
              </div>
              <h3 className="text-lg font-bold text-white mb-4">{feature.title}</h3>
              <div className="text-slate-400 leading-relaxed text-sm whitespace-pre-line">
                {feature.description}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LandingFeatures;
