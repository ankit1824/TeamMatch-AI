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

          {/* My Formed Teams Section */}
          <div className="bg-white rounded-3xl p-6 shadow-[0_4px_30px_rgb(0,0,0,0.02)] border border-slate-100 space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2.5 bg-gradient-to-br from-indigo-50 to-purple-50 text-indigo-600 rounded-2xl border border-indigo-100/30">
                  <Users size={20} />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-lg">My Formed Teams</h3>
                  <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Active squads in database</p>
                </div>
              </div>
              <span className="text-xs bg-indigo-50 text-indigo-600 font-bold px-2.5 py-1 rounded-full border border-indigo-100/30">
                {(teams || []).length} Roster{(teams || []).length !== 1 ? 's' : ''}
              </span>
            </div>
            
            {teamsLoading ? (
              <div className="py-8 text-center text-slate-400 text-sm">Loading team rosters...</div>
            ) : !Array.isArray(teams) || teams.length === 0 ? (
              <div className="text-center py-10 border-2 border-dashed border-slate-150 rounded-2xl bg-slate-50/30">
                <p className="text-slate-400 text-sm">No saved teams yet.</p>
                <button
                  onClick={goToFindTeammates}
                  className="text-xs text-indigo-600 font-bold hover:underline mt-2 flex items-center gap-1 mx-auto"
                >
                  Assemble your first team <ArrowRight size={12} />
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {teams.map(t => {
                  const mList = t.members || [];
                  return (
                    <div key={t.id} className="p-5 bg-gradient-to-br from-slate-50/70 to-white border border-slate-100 rounded-2xl flex flex-col justify-between hover:shadow-lg hover:border-indigo-100 transition-all relative group">
                      <button
                        onClick={() => triggerDeleteTeam(t.id)}
                        className="absolute top-4 right-4 p-1.5 bg-white border border-slate-105 text-slate-400 hover:text-red-500 hover:border-red-100 rounded-xl transition-all shadow-sm opacity-0 group-hover:opacity-100"
                        title="Delete Team"
                      >
                        <Trash2 size={13} />
                      </button>
                      <div className="space-y-1.5">
                        <h4 className="font-extrabold text-slate-800 pr-8 truncate text-sm tracking-tight">{t.team_name}</h4>
                        <p className="text-[11px] text-slate-400 italic leading-relaxed pr-8 line-clamp-2">{t.description}</p>
                      </div>
                      
                      <div className="mt-5 flex items-center justify-between border-t border-slate-100/70 pt-3.5">
                        <div className="flex items-center gap-2">
                          {/* Overlapping Avatars */}
                          <div className="flex -space-x-1.5 overflow-hidden">
                            {mList.slice(0, 4).map((m, idx) => (
                              <div key={idx} className="inline-block h-5 w-5 rounded-full ring-2 ring-white bg-gradient-to-br from-indigo-500 to-purple-650 text-white font-bold text-[8px] flex items-center justify-center shadow-sm">
                                {idx === 0 ? "You" : `M${idx}`}
                              </div>
                            ))}
                            {mList.length > 4 && (
                              <div className="inline-block h-5 w-5 rounded-full ring-2 ring-white bg-slate-200 text-slate-600 font-bold text-[8px] flex items-center justify-center shadow-sm">
                                +{mList.length - 4}
                              </div>
                            )}
                          </div>
                          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                            {mList.length} member{mList.length !== 1 ? 's' : ''}
                          </span>
                        </div>
                        
                        <span className="text-[10px] font-black text-white bg-gradient-to-r from-indigo-600 to-purple-600 px-2.5 py-1 rounded-xl shadow-sm shadow-indigo-500/10 tracking-tight">
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
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />

            {/* Modal Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-3xl p-6 max-w-sm w-full border border-slate-100 shadow-2xl relative z-10 space-y-6"
            >
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-red-50 text-red-600 rounded-xl">
                  <Trash2 size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-lg">Delete Team</h3>
                  <p className="text-xs text-slate-500">This action cannot be undone</p>
                </div>
              </div>

              {deleteStatus ? (
                <div className="space-y-4 py-2 text-center">
                  <div className="w-12 h-12 rounded-full mx-auto flex items-center justify-center bg-red-50 text-red-600">
                    <AlertCircle size={24} />
                  </div>
                  <p className="text-sm font-semibold text-slate-800">{deleteStatus.message}</p>
                  <button
                    onClick={() => { setShowDeleteModal(false); setDeleteStatus(null); }}
                    className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs transition-colors"
                  >
                    Close
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Are you sure you want to permanently delete this team roster from your dashboard?
                  </p>

                  <div className="flex items-center justify-end gap-2 pt-2">
                    <button
                      onClick={() => setShowDeleteModal(false)}
                      className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold rounded-xl text-xs transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={executeDeleteTeam}
                      className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-xs transition-colors shadow-sm"
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
