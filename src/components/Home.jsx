import React, { useEffect, useState, useMemo, useCallback } from "react";
import { API_BASE } from "../config";
import { useAuth } from "../context/AuthContext";
import { motion } from "motion/react";
import {
  User, Search, Zap, CheckCircle2, ArrowRight, Star, Sparkles,
  AlertCircle, Github, Linkedin, Code, Heart, Briefcase, Trophy
} from "lucide-react";

// ─── Weighted Profile Strength ────────────────────────────────────────────────
// Only count fields the user explicitly fills in (not defaults)
const PROFILE_WEIGHTS = [
  { key: "full_name",         label: "Name",                weight: 10 },
  { key: "college",           label: "University",          weight: 10 },
  { key: "skills",            label: "Skills (3+)",         weight: 30 },
  { key: "interests",         label: "Project Interests",   weight: 15 },
  { key: "experience_level",  label: "Experience Level",    weight: 10 },
  { key: "github_link",       label: "GitHub Link",         weight: 10 },
  { key: "linkedin_link",     label: "LinkedIn Link",       weight: 10 },
  { key: "past_project_desc", label: "Past Project",        weight:  5 },
];

function calculateProfileStrength(profile) {
  if (!profile) return 0;
  let score = 0;
  for (const { key, weight } of PROFILE_WEIGHTS) {
    const val = profile[key];
    if (!val) continue;
    if (key === "skills") {
      // Only count if at least 3 skills
      const arr = Array.isArray(val) ? val : String(val).split(",").map((s) => s.trim()).filter(Boolean);
      if (arr.length >= 3) score += weight;
      else if (arr.length >= 1) score += Math.round(weight * 0.5); // partial credit
    } else if (key === "experience_level") {
      // Default "Beginner" — only count if user likely changed it
      // We count it if skills are also set (shows profile is being filled)
      const skills = profile.skills;
      const skillArr = Array.isArray(skills) ? skills : String(skills || "").split(",").filter(Boolean);
      if (skillArr.length > 0 && val) score += weight;
    } else {
      // String fields: only count if non-empty and not just whitespace
      if (String(val).trim().length > 0) score += weight;
    }
  }
  return Math.min(100, score);
}

function getMissingFields(profile) {
  const missing = [];
  for (const { key, label } of PROFILE_WEIGHTS) {
    const val = profile?.[key];
    if (!val || (key === "skills" && (Array.isArray(val) ? val : String(val).split(",").filter(Boolean)).length < 3)) {
      missing.push(label);
    }
  }
  return missing;
}

const Home = ({ setActiveTab }) => {
  const { token } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setProfile(data);
      } catch (err) {
        console.error("Failed to fetch profile", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [token]);

  const strength = useMemo(() => calculateProfileStrength(profile), [profile]);
  const missingFields = useMemo(() => getMissingFields(profile), [profile]);

  const strengthColor = strength >= 70 ? "bg-emerald-500" : strength >= 40 ? "bg-amber-500" : "bg-red-400";
  const strengthLabel = strength >= 70 ? "Strong" : strength >= 40 ? "Good" : "Weak";
  const strengthTextColor = strength >= 70 ? "text-emerald-600 bg-emerald-50" : strength >= 40 ? "text-amber-600 bg-amber-50" : "text-red-600 bg-red-50";

  const goToFindTeammates = useCallback(() => setActiveTab("find-teammates"), [setActiveTab]);
  const goToProfile = useCallback(() => setActiveTab("profile"), [setActiveTab]);

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-8 md:p-12 text-white shadow-xl">
        <div className="relative z-10 max-w-2xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-1.5 rounded-full text-sm font-semibold mb-6">
              <Zap size={14} className="fill-yellow-400 text-yellow-400" /> AI-Powered Matching Ready
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
              {loading ? (
                <span className="opacity-75">Welcome back 👋</span>
              ) : (
                `Welcome back, ${profile?.full_name?.split(" ")[0] || "Hacker"} 👋`
              )}
            </h1>
            <p className="text-blue-100 text-lg mb-8 leading-relaxed">
              Your next winning hackathon team is one search away.
            </p>
            <div className="flex flex-wrap gap-4">
              <button onClick={goToFindTeammates}
                className="bg-white text-blue-600 px-6 py-3 rounded-xl font-bold hover:bg-blue-50 transition-all flex items-center gap-2 shadow-lg">
                <Search size={20} /> Find Teammates
              </button>
              <button onClick={goToProfile}
                className="bg-white/10 text-white px-6 py-3 rounded-xl font-bold hover:bg-white/20 transition-all border border-white/20 flex items-center gap-2 backdrop-blur-sm">
                <User size={20} /> Update Profile
              </button>
            </div>
          </motion.div>
        </div>
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 bg-indigo-500 rounded-full opacity-20 blur-3xl" />
        <div className="absolute bottom-0 right-0 mb-10 mr-10 opacity-10">
          <Sparkles size={200} />
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-1 space-y-6">

          {/* Profile Strength Card */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-slate-900">Profile Strength</h3>
              <span className={`text-sm font-bold px-2.5 py-1 rounded-lg ${strengthTextColor}`}>
                {loading ? "..." : `${strength}% · ${strengthLabel}`}
              </span>
            </div>

            {/* Progress bar */}
            <div className="w-full bg-gray-100 rounded-full h-3 mb-4 overflow-hidden">
              <motion.div
                className={`h-3 rounded-full ${strengthColor}`}
                initial={{ width: 0 }}
                animate={{ width: `${strength}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </div>

            {/* Field checklist */}
            {!loading && (
              <div className="space-y-2 mb-4">
                {PROFILE_WEIGHTS.map(({ key, label, weight }) => {
                  const val = profile?.[key];
                  let filled = false;
                  if (key === "skills") {
                    const arr = Array.isArray(val) ? val : String(val || "").split(",").filter(Boolean);
                    filled = arr.length >= 3;
                  } else if (key === "experience_level") {
                    const skills = profile?.skills;
                    const skillArr = Array.isArray(skills) ? skills : String(skills || "").split(",").filter(Boolean);
                    filled = skillArr.length > 0 && !!val;
                  } else {
                    filled = !!val && String(val).trim().length > 0;
                  }
                  return (
                    <div key={key} className="flex items-center justify-between text-xs">
                      <span className={`flex items-center gap-1.5 ${filled ? "text-slate-600" : "text-slate-400"}`}>
                        <CheckCircle2 size={12} className={filled ? "text-emerald-500" : "text-slate-300"} />
                        {label}
                      </span>
                      <span className="text-slate-400">+{weight}%</span>
                    </div>
                  );
                })}
              </div>
            )}

            <button onClick={goToProfile}
              className={`w-full py-2.5 text-sm font-bold rounded-xl transition-colors flex items-center justify-center gap-2
                ${strength >= 100
                  ? "text-emerald-600 bg-emerald-50 border border-emerald-100"
                  : "text-blue-600 border-2 border-blue-100 hover:bg-blue-50"}`}>
              {strength >= 100 ? <><CheckCircle2 size={16} /> Profile Complete!</> : <><ArrowRight size={16} /> {strength === 0 ? "Create Profile" : "Finish Setup"}</>}
            </button>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: Code, label: "Skills", value: (() => { const s = profile?.skills; const a = Array.isArray(s) ? s : (s || "").split(",").filter(Boolean); return a.length; })(), color: "text-blue-600 bg-blue-50" },
              { icon: Heart, label: "Interests", value: (() => { const i = profile?.interests; const a = Array.isArray(i) ? i : (i || "").split(",").filter(Boolean); return a.length; })(), color: "text-purple-600 bg-purple-50" },
              { icon: Briefcase, label: "Experience", value: profile?.experience_level || "—", color: "text-amber-600 bg-amber-50", small: true },
              { icon: Trophy, label: "Hackathon", value: profile?.past_hackathon ? "✓" : "None", color: "text-emerald-600 bg-emerald-50" },
            ].map(({ icon: Icon, label, value, color, small }) => (
              <div key={label} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center">
                <div className={`w-9 h-9 ${color} rounded-xl flex items-center justify-center mx-auto mb-2`}>
                  <Icon size={18} />
                </div>
                <p className={`font-bold text-slate-900 ${small ? "text-xs" : "text-lg"}`}>{value}</p>
                <p className="text-xs text-slate-500">{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-2 space-y-6">

          {/* Profile Strength < 70% → Reminder Banner */}
          {!loading && strength < 70 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-5 flex items-start gap-4"
            >
              <div className="bg-amber-100 p-2.5 rounded-xl shrink-0">
                <AlertCircle size={22} className="text-amber-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-amber-900 mb-1">Complete your profile to get better AI matches</p>
                <p className="text-amber-700 text-sm mb-3">
                  Missing: <span className="font-semibold">{missingFields.slice(0, 3).join(", ")}{missingFields.length > 3 ? ` +${missingFields.length - 3} more` : ""}</span>
                </p>
                <button onClick={goToProfile}
                  className="bg-amber-600 text-white text-sm font-bold px-4 py-2 rounded-xl hover:bg-amber-700 transition-colors flex items-center gap-2">
                  <ArrowRight size={15} /> Finish Setup
                </button>
              </div>
              <div className="shrink-0 text-right">
                <p className="text-2xl font-black text-amber-600">{strength}%</p>
                <p className="text-xs text-amber-500">Complete</p>
              </div>
            </motion.div>
          )}

          {/* About TeamMatch AI */}
          <div className="bg-white rounded-2xl p-7 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-5">
              <div className="p-3 bg-blue-100 text-blue-600 rounded-xl animate-pulse">
                <Zap size={22} />
              </div>
              <h2 className="text-xl font-bold text-slate-900">About TeamMatch AI</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-sm text-slate-600">
              {[
                { icon: CheckCircle2, title: "Semantic Matching", desc: "AI analyzes your skills, interests, and past projects to find complementary teammates." },
                { icon: CheckCircle2, title: "Real-time Activity", desc: "Connect with hackers who are currently active and looking for teams." },
                { icon: CheckCircle2, title: "Skill Gap Analysis", desc: "Identify what your team is missing and find the specialist to fill that role." },
                { icon: CheckCircle2, title: "Experience Balanced", desc: "Whether beginner or pro, find teams that match your pace and goals." },
              ].map(({ icon: Icon, title, desc }) => (
                <div key={title} className="flex gap-3">
                  <Icon size={18} className="text-emerald-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-slate-900 mb-0.5">{title}</p>
                    <p>{desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-blue-50 p-5 rounded-xl border border-blue-100 mt-6">
              <p className="font-bold text-blue-900 mb-1">Ready to start?</p>
              <p className="text-sm text-blue-700 mb-3">Click Find Teammates to search using AI-powered filters and smart recommendations.</p>
              <button onClick={goToFindTeammates}
                className="bg-blue-600 text-white px-5 py-2 rounded-xl text-sm font-bold hover:bg-blue-700 transition-colors inline-flex items-center gap-2">
                <Search size={15} /> Go to Search <ArrowRight size={15} />
              </button>
            </div>
          </div>

          {/* Why TeamMatch AI */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
              <div className="w-10 h-10 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center mb-3">
                <Star size={20} />
              </div>
              <p className="font-bold text-slate-900 mb-1 text-sm">Build Better Projects</p>
              <p className="text-xs text-slate-500">Diverse teams win more often. We help you find the right mix of designers, developers, and thinkers.</p>
            </div>
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
              <div className="w-10 h-10 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center mb-3">
                <Github size={20} />
              </div>
              <p className="font-bold text-slate-900 mb-1 text-sm">GitHub + LinkedIn Ready</p>
              <p className="text-xs text-slate-500">Connect your professional profiles and let teammates know exactly what you bring to the table.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
