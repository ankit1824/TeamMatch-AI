import React from "react";
import { Star, Quote, Award, Sparkles } from "lucide-react";

const STORIES = [
  {
    id: "story-1",
    teamName: "Team FinFlux",
    hackathon: "EthIndia 2025",
    prize: "1st Place ($10,000 USD)",
    matchScore: 94,
    members: [
      { name: "Shatakshi Tiwari", role: "AI Engineer" },
      { name: "Vikram Prasad", role: "UI/UX Designer" },
      { name: "Harish Saxena", role: "Backend Developer" }
    ],
    quote: "TeamMatch AI matched us perfectly based on our skill complementarities. We built an AI-powered DeFi portfolio optimizer in 36 hours and took home first prize! The automated teammate coordination saved us hours of hunting.",
    project: "FinFlux - AI-driven gas optimization & automated portfolio management for retail investors."
  },
  {
    id: "story-2",
    teamName: "Team MedMinds",
    hackathon: "Smart India Hackathon 2025",
    prize: "Best HealthTech Innovation (₹1,00,000)",
    matchScore: 89,
    members: [
      { name: "Preeti Shenoy", role: "Frontend Developer" },
      { name: "Rahul Deshpande", role: "Algorithm Specialist" },
      { name: "Tanvi Verma", role: "AI Engineer" }
    ],
    quote: "The K-Means team builder recommended adding an Algorithm Specialist when we lacked backend scaling. That balance was the secret sauce that allowed us to build a working real-time diagnosis model under pressure.",
    project: "MedMinds - Decentralized patient records sharing system with embedded disease prediction algorithms."
  }
];

const SuccessStories = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Success Stories</h2>
        <p className="text-slate-500 text-sm mt-0.5">Real developer teams that matched on TeamMatch AI and went on to build winning projects.</p>
      </div>

      <div className="space-y-6">
        {STORIES.map((s) => (
          <div key={s.id} className="bg-white rounded-2xl border border-slate-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)] p-6 md:p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50/40 rounded-full blur-2xl -z-10" />
            
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
              <div className="space-y-4 flex-grow">
                <div>
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md mb-2">
                    <Sparkles size={12} /> {s.hackathon}
                  </span>
                  <h3 className="text-xl font-extrabold text-slate-900">{s.teamName}</h3>
                  <p className="text-slate-500 text-sm font-semibold mt-1 flex items-center gap-1.5">
                    <Award size={16} className="text-amber-500" /> Winner: {s.prize}
                  </p>
                </div>

                <div className="relative border-l-2 border-slate-100 pl-4 py-1">
                  <Quote size={20} className="text-blue-200 absolute -top-3 -left-1 opacity-50" />
                  <p className="text-slate-600 text-sm italic leading-relaxed pl-3 font-medium">
                    "{s.quote}"
                  </p>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Project Built</h4>
                  <p className="text-slate-700 text-sm leading-relaxed">{s.project}</p>
                </div>
              </div>

              <div className="w-full md:w-64 shrink-0 bg-slate-50/50 rounded-xl border border-slate-100 p-5 space-y-4">
                <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                  <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Teammate Match</span>
                  <span className="text-sm font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">{s.matchScore}%</span>
                </div>
                
                <div className="space-y-3">
                  <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Roster</h4>
                  {s.members.map((m, idx) => (
                    <div key={idx} className="flex justify-between items-center text-xs">
                      <span className="font-bold text-slate-700">{m.name}</span>
                      <span className="text-slate-500 font-medium">{m.role}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SuccessStories;
