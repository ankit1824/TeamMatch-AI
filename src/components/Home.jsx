import React, { useEffect, useState, useMemo, useCallback } from "react";
import { API_BASE } from "../config";
import { useAuth } from "../context/AuthContext";
import { motion, AnimatePresence } from "motion/react";
import {
  User, Search, Zap, CheckCircle2, ArrowRight, Star, Sparkles,
  AlertCircle, Github, Linkedin, Code, Heart, Briefcase, Trophy, Users, Trash2
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
  const [teams, setTeams] = useState([]);
  const [teamsLoading, setTeamsLoading] = useState(true);

  // Custom Delete Modal States
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [teamToDelete, setTeamToDelete] = useState(null);
  const [deleteStatus, setDeleteStatus] = useState(null); // { type: 'success' | 'error', message: '...' }

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

  const fetchTeams = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/teams`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (Array.isArray(data)) {
        setTeams(data);
      } else {
        setTeams([]);
      }
    } catch (e) {
      console.error("Failed to fetch teams", e);
      setTeams([]);
    } finally {
      setTeamsLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
    fetchTeams();
  }, [token]);

  const triggerDeleteTeam = (teamId) => {
    setTeamToDelete(teamId);
    setDeleteStatus(null);
    setShowDeleteModal(true);
  };

  const executeDeleteTeam = async () => {
    if (!teamToDelete) return;
    try {
      const res = await fetch(`${API_BASE}/api/teams/${teamToDelete}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setTeams(prev => prev.filter(t => t.id !== teamToDelete));
        setShowDeleteModal(false);
        setTeamToDelete(null);
      } else {
        setDeleteStatus({ type: 'error', message: "Failed to delete team." });
      }
    } catch (e) {
      console.error("Error deleting team", e);
      setDeleteStatus({ type: 'error', message: "Error contacting the server." });
    }
  };

  const strength = useMemo(() => calculateProfileStrength(profile), [profile]);
  const missingFields = useMemo(() => getMissingFields(profile), [profile]);

  const strengthTextColor = strength >= 70 ? "text-emerald-400 bg-emerald-500/10" : strength >= 40 ? "text-amber-400 bg-amber-500/10" : "text-red-400 bg-red-500/10";

  const goToFindTeammates = useCallback(() => setActiveTab("find-teammates"), [setActiveTab]);
  const goToProfile = useCallback(() => setActiveTab("profile"), [setActiveTab]);

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-950/60 to-purple-955/40 rounded-3xl p-8 md:p-12 text-white border border-white/5 shadow-2xl backdrop-blur-md">
        <div className="relative z-10 max-w-2xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 px-4 py-1.5 rounded-full text-xs font-bold mb-6 text-indigo-300 shadow-inner">
              <Zap size={12} className="fill-indigo-400 text-indigo-400" /> AI-Powered Matching Ready
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight">
              {loading ? (
                <span className="opacity-75">Welcome back 👋</span>
              ) : (
                `Welcome back, ${profile?.full_name?.split(" ")[0] || "Hacker"} 👋`
              )}
            </h1>
            <p className="text-slate-450 text-lg mb-8 leading-relaxed font-normal">
              Your next winning hackathon team is one search away.
            </p>
            <div className="flex flex-wrap gap-4">
              <button onClick={goToFindTeammates}
                className="bg-gradient-to-r from-indigo-650 to-violet-600 text-white px-6 py-3.5 rounded-xl font-bold hover:opacity-95 transition-all flex items-center gap-2 shadow-lg shadow-indigo-500/20 cursor-pointer">
                <Search size={18} /> Find Teammates
              </button>
              <button onClick={goToProfile}
                className="bg-white/5 text-slate-200 px-6 py-3.5 rounded-xl font-bold hover:bg-white/10 hover:text-white transition-all border border-white/10 flex items-center gap-2 backdrop-blur-sm cursor-pointer">
                <User size={18} /> Update Profile
              </button>
            </div>
          </motion.div>
        </div>
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 bg-indigo-500/10 rounded-full opacity-30 blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 right-0 mb-10 mr-10 opacity-5 text-indigo-500 pointer-events-none">
          <Sparkles size={200} />
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-1 space-y-6">

          {/* Profile Strength Card */}
          <div className="bg-white/5 backdrop-blur-md rounded-3xl p-6 border border-white/10 shadow-lg space-y-4">
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-bold text-white text-base">Profile Strength</h3>
              <span className={`text-xs font-bold px-2.5 py-1 rounded-lg ${strengthTextColor}`}>
                {loading ? "..." : `${strength}% · ${strength >= 70 ? "Strong" : strength >= 40 ? "Good" : "Weak"}`}
              </span>
            </div>

            {/* Progress bar */}
            <div className="w-full bg-slate-900/60 rounded-full h-3 overflow-hidden border border-white/5 p-[1px]">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-indigo-500 to-violet-600 shadow-[0_0_8px_rgba(99,102,241,0.4)]"
                initial={{ width: 0 }}
                animate={{ width: `${strength}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </div>

            {/* Field checklist */}
            {!loading && (
              <div className="space-y-2.5 py-1">
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
                      <span className={`flex items-center gap-1.5 ${filled ? "text-slate-300" : "text-slate-500"}`}>
                        <CheckCircle2 size={13} className={filled ? "text-emerald-400" : "text-slate-700"} />
                        {label}
                      </span>
                      <span className={filled ? "text-slate-400 font-semibold" : "text-slate-650"}>+{weight}%</span>
                    </div>
                  );
                })}
              </div>
            )}

            <button onClick={goToProfile}
              className={`w-full py-2.5 text-xs font-bold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 border cursor-pointer
                ${strength >= 100
                  ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/25 hover:bg-emerald-500/20"
                  : "text-indigo-400 border-indigo-500/25 bg-indigo-500/5 hover:bg-indigo-500/15"}`}>
              {strength >= 100 ? <><CheckCircle2 size={14} /> Profile Complete!</> : <><ArrowRight size={14} /> {strength === 0 ? "Create Profile" : "Finish Setup"}</>}
            </button>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: Code, label: "Skills", value: (() => { const s = profile?.skills; const a = Array.isArray(s) ? s : (s || "").split(",").filter(Boolean); return a.length; })(), color: "text-indigo-400 bg-indigo-500/10 border border-indigo-500/20" },
              { icon: Heart, label: "Interests", value: (() => { const i = profile?.interests; const a = Array.isArray(i) ? i : (i || "").split(",").filter(Boolean); return a.length; })(), color: "text-purple-400 bg-purple-500/10 border border-purple-500/20" },
              { icon: Briefcase, label: "Experience", value: profile?.experience_level || "—", color: "text-amber-400 bg-amber-500/10 border border-amber-500/20", small: true },
              { icon: Trophy, label: "Hackathon", value: profile?.past_hackathon ? "Yes" : "None", color: "text-emerald-400 bg-emerald-500/10 border border-emerald-500/20" },
            ].map(({ icon: Icon, label, value, color, small }) => (
              <div key={label} className="bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/10 text-center shadow-lg flex flex-col justify-between">
                <div className={`w-9 h-9 ${color} rounded-xl flex items-center justify-center mx-auto mb-2`}>
                  <Icon size={16} />
                </div>
                <div>
                  <p className={`font-bold text-white leading-tight ${small ? "text-xs" : "text-lg"}`}>{value}</p>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wide mt-1">{label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-2 space-y-6">

          {/* My Formed Teams Section */}
          <div className="bg-white/5 backdrop-blur-md rounded-3xl p-6 border border-white/10 shadow-lg space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2.5 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 text-indigo-400 rounded-2xl border border-indigo-500/20 shadow-md">
                  <Users size={20} />
                </div>
                <div>
                  <h3 className="font-extrabold text-white text-lg">My Formed Teams</h3>
                  <p className="text-[9px] text-slate-450 font-bold uppercase tracking-wider">Active squads in database</p>
                </div>
              </div>
              <span className="text-xs bg-indigo-550/10 text-indigo-400 font-bold px-3 py-1 rounded-full border border-indigo-500/20 shadow-inner">
                {(teams || []).length} Roster{(teams || []).length !== 1 ? 's' : ''}
              </span>
            </div>
            
            {teamsLoading ? (
              <div className="py-8 text-center text-slate-400 text-sm">Loading team rosters...</div>
            ) : !Array.isArray(teams) || teams.length === 0 ? (
              <div className="text-center py-12 border border-dashed border-slate-800 rounded-2xl bg-slate-955/25">
                <p className="text-slate-500 text-sm">No saved teams yet.</p>
                <button
                  onClick={goToFindTeammates}
                  className="text-xs text-indigo-400 font-bold hover:underline hover:text-indigo-350 mt-2.5 flex items-center gap-1 mx-auto cursor-pointer"
                >
                  Assemble your first team <ArrowRight size={12} />
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {teams.map(t => {
                  const mList = t.members || [];
                  return (
                    <div key={t.id} className="p-5 bg-gradient-to-br from-slate-900/60 to-slate-900/40 border border-slate-800/80 rounded-2xl flex flex-col justify-between hover:shadow-2xl hover:shadow-indigo-500/5 hover:border-indigo-500/45 transition-all relative group">
                      <button
                        onClick={() => triggerDeleteTeam(t.id)}
                        className="absolute top-4 right-4 p-1.5 bg-slate-950 border border-slate-805 text-slate-505 hover:text-rose-500 hover:border-rose-500/30 rounded-xl transition-all shadow-sm opacity-0 group-hover:opacity-100 cursor-pointer"
                        title="Delete Team"
                      >
                        <Trash2 size={13} />
                      </button>
                      <div className="space-y-1.5">
                        <h4 className="font-extrabold text-slate-200 pr-8 truncate text-sm tracking-tight">{t.team_name}</h4>
                        <p className="text-[11px] text-slate-400 italic leading-relaxed pr-8 line-clamp-2">{t.description}</p>
                      </div>
                      
                      {/* Gaps / Deficits Section */}
                      {t.gaps && t.gaps.length > 0 && (
                        <div className="mt-3.5 space-y-1.5 border-t border-slate-800/60 pt-3">
                          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Deficits / Gaps</p>
                          <div className="space-y-1">
                            {t.gaps.map((g, idx) => (
                              <div key={idx} className="flex items-start gap-1.5 text-[10px] text-slate-350 bg-slate-950/60 border border-slate-900 rounded-xl p-2 leading-normal">
                                <span className={`inline-block w-1.5 h-1.5 rounded-full shrink-0 mt-1.5 ${g.status === 'Critical' ? 'bg-red-500 animate-pulse shadow-[0_0_6px_rgba(239,68,68,0.7)]' : 'bg-amber-400 shadow-[0_0_6px_rgba(245,158,11,0.5)]'}`} />
                                <div>
                                  <span className="font-extrabold text-slate-300">{g.label}: </span>
                                  <span className={g.status === 'Critical' ? 'text-red-400 font-bold' : 'text-slate-400'}>{g.status} deficit</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="mt-5 flex items-center justify-between border-t border-slate-800/60 pt-3.5">
                        <div className="flex items-center gap-2">
                          {/* Overlapping Avatars */}
                          <div className="flex -space-x-1.5 overflow-hidden">
                            {mList.slice(0, 4).map((m, idx) => (
                              <div key={idx} className="inline-block h-5 w-5 rounded-full ring-2 ring-slate-950 bg-gradient-to-br from-indigo-500 to-violet-650 text-white font-bold text-[8px] flex items-center justify-center shadow-sm">
                                {idx === 0 ? "You" : `M${idx}`}
                              </div>
                            ))}
                            {mList.length > 4 && (
                              <div className="inline-block h-5 w-5 rounded-full ring-2 ring-slate-955 bg-slate-800 text-slate-300 font-bold text-[8px] flex items-center justify-center shadow-sm">
                                +{mList.length - 4}
                              </div>
                            )}
                          </div>
                          <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">
                            {mList.length} member{mList.length !== 1 ? 's' : ''}
                          </span>
                        </div>
                        
                        <span className="text-[10px] font-black text-white bg-gradient-to-r from-indigo-650 to-violet-600 px-2.5 py-1 rounded-xl shadow-md shadow-indigo-500/15 tracking-tight">
                          {t.health_score}% Health
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Profile Strength < 70% → Reminder Banner */}
          {!loading && strength < 70 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 rounded-3xl p-5 flex items-start gap-4 backdrop-blur-md"
            >
              <div className="bg-amber-550/20 p-2.5 rounded-xl shrink-0 border border-amber-500/20">
                <AlertCircle size={22} className="text-amber-400 animate-bounce" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-extrabold text-amber-300 mb-1">Complete your profile to get better AI matches</p>
                <p className="text-amber-400/80 text-sm mb-3 font-medium">
                  Missing: <span className="font-bold text-amber-300">{missingFields.slice(0, 3).join(", ")}{missingFields.length > 3 ? ` +${missingFields.length - 3} more` : ""}</span>
                </p>
                <button onClick={goToProfile}
                  className="bg-amber-600 text-white text-xs font-bold px-4 py-2 rounded-xl hover:bg-amber-700 transition-colors flex items-center gap-2 cursor-pointer shadow-md shadow-amber-900/25">
                  <ArrowRight size={14} /> Finish Setup
                </button>
              </div>
              <div className="shrink-0 text-right">
                <p className="text-2xl font-black text-amber-400">{strength}%</p>
                <p className="text-[10px] text-amber-500 uppercase tracking-widest font-black">Complete</p>
              </div>
            </motion.div>
          )}

          {/* About TeamMatch AI */}
          <div className="bg-white/5 backdrop-blur-md rounded-2xl p-7 border border-white/10 shadow-lg">
            <div className="flex items-center gap-3 mb-5">
              <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-xl animate-pulse border border-indigo-500/20">
                <Zap size={22} />
              </div>
              <h2 className="text-xl font-bold text-white">About TeamMatch AI</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-sm text-slate-300">
              {[
                { icon: CheckCircle2, title: "Semantic Matching", desc: "AI analyzes your skills, interests, and past projects to find complementary teammates." },
                { icon: CheckCircle2, title: "Real-time Activity", desc: "Connect with hackers who are currently active and looking for teams." },
                { icon: CheckCircle2, title: "Skill Gap Analysis", desc: "Identify what your team is missing and find the specialist to fill that role." },
                { icon: CheckCircle2, title: "Experience Balanced", desc: "Whether beginner or pro, find teams that match your pace and goals." },
              ].map(({ icon: Icon, title, desc }) => (
                <div key={title} className="flex gap-3">
                  <Icon size={18} className="text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-white mb-0.5 text-sm">{title}</p>
                    <p className="text-xs text-slate-400 leading-relaxed">{desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-indigo-500/5 p-5 rounded-xl border border-indigo-500/10 mt-6">
              <p className="font-bold text-indigo-300 mb-1">Ready to start?</p>
              <p className="text-xs text-indigo-400/80 mb-3 leading-relaxed">Click Find Teammates to search using AI-powered filters and smart recommendations.</p>
              <button onClick={goToFindTeammates}
                className="bg-gradient-to-r from-indigo-650 to-violet-650 text-white px-5 py-2.5 rounded-xl text-xs font-bold hover:opacity-95 transition-all shadow-md shadow-indigo-500/20 inline-flex items-center gap-2 cursor-pointer">
                <Search size={14} /> Go to Search <ArrowRight size={14} />
              </button>
            </div>
          </div>

          {/* Why TeamMatch AI */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white/5 backdrop-blur-md p-5 rounded-2xl shadow-lg border border-white/10">
              <div className="w-10 h-10 bg-amber-500/10 text-amber-400 rounded-xl flex items-center justify-center mb-3 border border-amber-500/15">
                <Star size={20} />
              </div>
              <p className="font-bold text-white mb-1 text-sm">Build Better Projects</p>
              <p className="text-xs text-slate-400 leading-relaxed">Diverse teams win more often. We help you find the right mix of designers, developers, and thinkers.</p>
            </div>
            <div className="bg-white/5 backdrop-blur-md p-5 rounded-2xl shadow-lg border border-white/10">
              <div className="w-10 h-10 bg-purple-500/10 text-purple-400 rounded-xl flex items-center justify-center mb-3 border border-purple-500/15">
                <Github size={20} />
              </div>
              <p className="font-bold text-white mb-1 text-sm">GitHub + LinkedIn Ready</p>
              <p className="text-xs text-slate-400 leading-relaxed">Connect your professional profiles and let teammates know exactly what you bring to the table.</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* ─── Delete Confirmation Modal ─────────────────────────────────────── */}
      <AnimatePresence>
        {showDeleteModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => { if (!deleteStatus) setShowDeleteModal(false); }}
              className="absolute inset-0 bg-slate-955/75 backdrop-blur-sm"
            />

            {/* Modal Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-sm w-full shadow-2xl relative z-10 space-y-6 text-white"
            >
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-red-500/10 text-red-400 rounded-xl border border-red-500/20">
                  <Trash2 size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-white text-lg">Delete Team</h3>
                  <p className="text-xs text-slate-400 font-medium">This action cannot be undone</p>
                </div>
              </div>

              {deleteStatus ? (
                <div className="space-y-4 py-2 text-center">
                  <div className="w-12 h-12 rounded-full mx-auto flex items-center justify-center bg-red-500/10 text-red-400 border border-red-500/15">
                    <AlertCircle size={24} />
                  </div>
                  <p className="text-sm font-semibold text-slate-300">{deleteStatus.message}</p>
                  <button
                    onClick={() => { setShowDeleteModal(false); setDeleteStatus(null); }}
                    className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-xl text-xs transition-colors cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-sm text-slate-350 leading-relaxed font-medium">
                    Are you sure you want to permanently delete this team roster from your dashboard?
                  </p>

                  <div className="flex items-center justify-end gap-2 pt-2">
                    <button
                      onClick={() => setShowDeleteModal(false)}
                      className="px-4 py-2.5 bg-slate-800 hover:bg-slate-750 text-slate-300 font-bold rounded-xl text-xs transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={executeDeleteTeam}
                      className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-xs transition-colors shadow-sm cursor-pointer"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Home;
