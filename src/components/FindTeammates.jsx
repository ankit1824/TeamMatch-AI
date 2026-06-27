import React, { useState, useEffect, useMemo, useCallback } from "react";
import { API_BASE } from "../config";
import { useAuth } from "../context/AuthContext";
import { motion, AnimatePresence } from "motion/react";
import {
  User, School, Code, Briefcase, Star, Filter, X,
  Search, Github, Linkedin, Mail, Zap,
  ChevronDown, ChevronUp, Users, RefreshCw, Phone, CheckCircle2
} from "lucide-react";

// ─── Typedefs ────────────────────────────────────────────────────────────────

const getSkillsArr = (skills) => {
  if (!skills) return [];
  if (Array.isArray(skills)) return skills;
  return skills.split(",").map(s => s.trim()).filter(Boolean);
};

// ─── Availability Badge ───────────────────────────────────────────────────────

const AvailBadge = ({ status }) => {
  const map = {
    Available: { dot: "bg-emerald-400", text: "text-emerald-600" },
    Busy: { dot: "bg-red-400", text: "text-red-500" },
    "Looking for team": { dot: "bg-amber-400", text: "text-amber-600" },
  };
  const s = map[status || ""] || { dot: "bg-slate-300", text: "text-slate-400" };
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-semibold ${s.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot} ${status === "Available" ? "animate-pulse" : ""}`} />
      {status || "Unknown"}
    </span>
  );
};

// ─── Match Breakdown Bar ─────────────────────────────────────────────────────

const BreakdownBar = ({ label, value, max, color }) => (
  <div className="space-y-1">
    <div className="flex justify-between text-xs text-slate-500">
      <span>{label}</span>
      <span className="font-semibold text-slate-700">{value}/{max}</span>
    </div>
    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${Math.min(100, (value / max) * 100)}%` }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className={`h-full rounded-full ${color}`}
      />
    </div>
  </div>
);

// ─── Teammate Card ───────────────────────────────────────────────────────────

const TeammateCard = ({ teammate, currentUserId, onMessage, isTeamSuggestion }) => {
  const [showBreakdown, setShowBreakdown] = useState(false);
  const skills = getSkillsArr(teammate.skills);
  const interests = getSkillsArr(teammate.interests);
  const commonSkills = teammate.commonSkills || [];

  const handleMessage = () => {
    if (!currentUserId || !onMessage) return;
    const ids = [currentUserId.toString(), teammate.user_id.toString()].sort();
    onMessage(ids.join("_"), teammate.full_name);
  };

  const matchPct = teammate.matchPercentage || 0;
  const matchColor = matchPct >= 80 ? "text-emerald-600 bg-emerald-50 border-emerald-200" : matchPct >= 60 ? "text-blue-600 bg-blue-50 border-blue-200" : "text-amber-600 bg-amber-50 border-amber-200";
  const ringColor = matchPct >= 80 ? "#10b981" : matchPct >= 60 ? "#2563eb" : "#f59e0b";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -3 }}
      className="bg-white rounded-2xl border border-slate-100 shadow-[0_4px_20px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(37,99,235,0.1)] transition-all flex flex-col overflow-hidden"
    >
      {isTeamSuggestion && teammate.suggestedFor && (
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 px-4 py-1.5 text-xs font-bold text-white flex items-center gap-1.5">
          <Users size={12} /> Suggested as {teammate.suggestedFor}
        </div>
      )}

      <div className="p-6 flex flex-col flex-1">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-md">
                {(teammate.full_name || "?")[0].toUpperCase()}
              </div>
              {matchPct > 0 && (
                <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-white flex items-center justify-center shadow-sm">
                  <span style={{ color: ringColor }} className="text-[9px] font-black">{matchPct}%</span>
                </div>
              )}
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base leading-tight">{teammate.full_name || "Anonymous"}</h3>
              <div className="flex items-center gap-1 text-slate-500 text-xs mt-0.5">
                <School size={11} />
                <span className="truncate max-w-[150px]">{teammate.college || "No college"}</span>
              </div>
            </div>
          </div>
          {matchPct > 0 && (
            <span className={`px-3 py-1 rounded-full text-xs font-bold border ${matchColor}`}>
              {matchPct}% match
            </span>
          )}
        </div>

        {/* Meta */}
        <div className="flex flex-wrap gap-2 mb-4 text-xs">
          <span className="flex items-center gap-1 text-slate-500 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-100">
            <Briefcase size={11} /> {teammate.preferred_role}
          </span>
          <span className="flex items-center gap-1 text-slate-500 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-100">
            <AvailBadge status={teammate.availability} />
          </span>
        </div>

        {/* Common Skills Highlight */}
        {!isTeamSuggestion && commonSkills.length > 0 && (
          <div className="bg-blue-50/50 border border-blue-100/50 rounded-xl p-3 mb-4">
            <p className="text-[11px] font-bold text-blue-600 uppercase tracking-wider mb-1.5 flex items-center gap-1">
              <Zap size={11} className="fill-blue-500 text-blue-500" /> Common Skills
            </p>
            <div className="flex flex-wrap gap-1">
              {commonSkills.map(s => (
                <span key={s} className="px-2 py-0.5 bg-blue-100/70 text-blue-700 rounded text-[10px] font-semibold">
                  {s}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* AI Insight */}
        {teammate.explanation && (
          <p className="text-slate-500 text-xs leading-relaxed italic mb-4 border-l-2 border-slate-200 pl-2.5">
            "{teammate.explanation}"
          </p>
        )}

        {/* Skills & Interests Tags */}
        <div className="space-y-3 mb-6 flex-grow">
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Skills</p>
            <div className="flex flex-wrap gap-1">
              {skills.slice(0, 5).map(s => (
                <span key={s} className="px-2.5 py-1 bg-slate-50 text-slate-600 rounded-lg border border-slate-100 text-xs font-semibold">
                  {s}
                </span>
              ))}
              {skills.length > 5 && (
                <span className="px-2 py-1 bg-slate-100 text-slate-500 rounded-lg text-[10px] font-semibold">
                  +{skills.length - 5} more
                </span>
              )}
            </div>
          </div>

          {interests.length > 0 && (
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Project Focus</p>
              <div className="flex flex-wrap gap-1">
                {interests.map(i => (
                  <span key={i} className="px-2.5 py-1 bg-purple-50 text-purple-600 rounded-lg border border-purple-100/70 text-xs font-semibold">
                    {i}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Past Project Experience Details */}
        {teammate.past_hackathon && (
          <div className="border-t border-slate-50 pt-4 mb-6 text-xs text-slate-500 space-y-1 bg-slate-50/30 p-3 rounded-xl">
            <p className="font-bold text-slate-700 flex items-center gap-1">
              <Star size={12} className="text-amber-500 fill-amber-500" /> {teammate.past_hackathon}
            </p>
            {teammate.past_project_name && (
              <p className="text-slate-600 font-semibold">Project: {teammate.past_project_name}</p>
            )}
          </div>
        )}

        {/* Interactive Breakdown */}
        {teammate.breakdown && (
          <div className="border-t border-slate-50 pt-4 mb-4">
            <button
              onClick={() => setShowBreakdown(!showBreakdown)}
              className="w-full flex items-center justify-between text-xs text-slate-500 font-semibold hover:text-slate-700"
            >
              <span>Match Diagnostics</span>
              {showBreakdown ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>
            <AnimatePresence>
              {showBreakdown && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="space-y-2 mt-3 overflow-hidden"
                >
                  <BreakdownBar label="Skills (40%)" value={teammate.breakdown.skillScore} max={40} color="bg-blue-600" />
                  <BreakdownBar label="Interests (30%)" value={teammate.breakdown.interestScore} max={30} color="bg-purple-600" />
                  <BreakdownBar label="Experience (20%)" value={teammate.breakdown.expScore} max={20} color="bg-amber-500" />
                  <BreakdownBar label="Availability (10%)" value={teammate.breakdown.availScore} max={10} color="bg-emerald-500" />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* Contact Links Grid (Replaces Legacy Chat Message Button) */}
        <div className="grid grid-cols-2 gap-2 mt-auto">
          {teammate.contact_email ? (
            <a
              href={`mailto:${teammate.contact_email}?subject=TeamMatch%20AI%20-%20Let's%20Form%20a%20Hackathon%20Team!`}
              className="py-2 px-3 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-100 rounded-xl font-bold transition-all text-xs flex items-center justify-center gap-1.5"
            >
              <Mail size={13} /> Email
            </a>
          ) : (
            <button disabled className="py-2 px-3 bg-slate-50 text-slate-300 border border-slate-100 rounded-xl font-bold text-xs cursor-not-allowed flex items-center justify-center gap-1.5">
              <Mail size={13} /> Email
            </button>
          )}

          {teammate.linkedin_link ? (
            <a
              href={teammate.linkedin_link}
              target="_blank"
              rel="noopener noreferrer"
              className="py-2 px-3 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-100 rounded-xl font-bold transition-all text-xs flex items-center justify-center gap-1.5"
            >
              <Linkedin size={13} /> LinkedIn
            </a>
          ) : (
            <button disabled className="py-2 px-3 bg-slate-50 text-slate-300 border border-slate-100 rounded-xl font-bold text-xs cursor-not-allowed flex items-center justify-center gap-1.5">
              <Linkedin size={13} /> LinkedIn
            </button>
          )}

          {teammate.phone ? (
            <a
              href={`tel:${teammate.phone.replace(/\s+/g, "")}`}
              className="col-span-2 py-2 px-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold transition-all text-xs flex items-center justify-center gap-1.5"
            >
              <Phone size={13} /> Call / SMS ({teammate.phone})
            </a>
          ) : (
            <button disabled className="col-span-2 py-2 px-3 bg-slate-50 text-slate-300 border border-slate-100 rounded-xl font-bold text-xs cursor-not-allowed flex items-center justify-center gap-1.5">
              <Phone size={13} /> Call / SMS (Not Provided)
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

// ─── Global State Taxonomy ───────────────────────────────────────────────────

const SKILL_OPTIONS = ["React", "Python", "Node.js", "FastAPI", "TensorFlow", "Figma", "Docker", "Solidity"];
const INTEREST_OPTIONS = ["AI", "Web3", "HealthTech", "FinTech", "EdTech", "IoT", "SaaS", "Security"];

// ─── Main Finder View ────────────────────────────────────────────────────────

const FindTeammates = ({ suggestedOnly, onMessage, initialInterests }) => {
  const { token, userId } = useAuth();
  const [teammates, setTeammates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [teamLoading, setTeamLoading] = useState(false);
  const [teamSuggestion, setTeamSuggestion] = useState([]);
  const [showTeam, setShowTeam] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // Search filter options
  const [searchSkills, setSearchSkills] = useState("");
  const [searchInterests, setSearchInterests] = useState("");
  const [searchCollege, setSearchCollege] = useState("");
  const [hackathonMode, setHackathonMode] = useState(false);

  // Results sidebar filters
  const [selectedSkillFilters, setSelectedSkillFilters] = useState([]);
  const [expFilter, setExpFilter] = useState("Any");
  const [sortBy, setSortBy] = useState("match");

  // Dynamic ML matching weights state
  const [showWeights, setShowWeights] = useState(false);
  const [weights, setWeights] = useState({ skillWeight: 40, interestWeight: 30, experienceWeight: 20, availabilityWeight: 10 });

  const fetchMatches = async (opts) => {
    setLoading(true);
    setHasSearched(true);
    try {
      const hackMode = opts?.hackathon ?? hackathonMode;
      const finalSkills = opts?.skills ?? searchSkills;
      const finalInterests = opts?.interests ?? searchInterests;
      const finalCollege = opts?.college ?? searchCollege;
      const res = await fetch(`${API_BASE}/api/match/${userId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          ...weights,
          searchSkills: finalSkills || undefined,
          searchInterests: finalInterests || undefined,
          searchCollege: finalCollege || undefined,
          hackathonMode: hackMode,
          limit: 9,
        }),
      });
      const data = await res.json();
      setTeammates(data);
    } catch (e) {
      console.error(e);
    } finally { setLoading(false); }
  };

  useEffect(() => {
    if (initialInterests) {
      setSearchInterests(initialInterests);
      fetchMatches({ interests: initialInterests });
    }
  }, [initialInterests]);

  const fetchTeamBuilder = async () => {
    setTeamLoading(true); setShowTeam(true);
    try {
      const res = await fetch(`${API_BASE}/api/build-team/${userId}`, { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      setTeamSuggestion(data);
    } catch (e) { console.error(e); }
    finally { setTeamLoading(false); }
  };

  const handleSaveTeam = async () => {
    const teamName = prompt("Enter a name for your new team:");
    if (!teamName || !teamName.trim()) return;

    try {
      const avgHealth = teamSuggestion.length > 0
        ? teamSuggestion.reduce((acc, curr) => acc + (curr.matchPercentage || 0), 0) / teamSuggestion.length
        : 80;

      const memberIds = [parseInt(userId), ...teamSuggestion.map(t => t.user_id)];

      const res = await fetch(`${API_BASE}/api/teams`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          team_name: teamName.trim(),
          description: `AI Auto-built team for user #${userId}`,
          health_score: parseFloat(avgHealth.toFixed(1)),
          members: memberIds
        })
      });

      if (res.ok) {
        alert(`Team "${teamName.trim()}" successfully saved to your dashboard!`);
      } else {
        const err = await res.json();
        alert(`Failed to save team: ${err.detail || "Server error"}`);
      }
    } catch (e) {
      console.error(e);
      alert("Error contacting the server.");
    }
  };

  useEffect(() => {
    if (suggestedOnly && userId) fetchMatches();
  }, [suggestedOnly, userId]);

  const filteredTeammates = useMemo(() => {
    let result = [...teammates];
    if (selectedSkillFilters.length > 0) {
      result = result.filter(t =>
        getSkillsArr(t.skills).some(s => selectedSkillFilters.includes(s))
      );
    }
    if (expFilter !== "Any") result = result.filter(t => t.experience_level === expFilter);
    return result.sort((a, b) => {
      if (sortBy === "match") return (b.matchPercentage || 0) - (a.matchPercentage || 0);
      if (sortBy === "experience") {
        const m = { Advanced: 3, Intermediate: 2, Beginner: 1 };
        return (m[b.experience_level] || 0) - (m[a.experience_level] || 0);
      }
      return 0;
    });
  }, [teammates, selectedSkillFilters, expFilter, sortBy]);

  const totalWeight = Object.values(weights).reduce((a, b) => a + b, 0);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* ─── Header ─────────────────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">
            {suggestedOnly ? "Top AI Matches" : "Find Teammates"}
          </h2>
          <p className="text-slate-500 text-sm mt-0.5">
            {suggestedOnly ? "Based on your skills, interests, and experience." : "Search by skill or let AI find your best match."}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => { setHackathonMode(true); fetchMatches({ hackathon: true }); }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 font-semibold text-sm hover:bg-amber-100 transition-colors"
          >
            <Zap size={16} className="fill-amber-400 text-amber-400" /> Hackathon Mode
          </button>
          <button onClick={fetchTeamBuilder}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold text-sm shadow-md shadow-purple-500/20 hover:opacity-90 transition-opacity">
            <Users size={16} /> Build My Team
          </button>
        </div>
      </div>

      {/* ─── AI Team Builder ─────────────────────────────────────────────────── */}
      <AnimatePresence>
        {showTeam && (
          <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}
            className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl border border-purple-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-2 rounded-xl text-white">
                  <Users size={18} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">AI Team Builder</h3>
                  <p className="text-xs text-slate-500">Complementary teammates selected to balance your skills</p>
                </div>
              </div>
              <div className="flex gap-2 items-center">
                {teamSuggestion.length > 0 && !teamLoading && (
                  <button
                    onClick={handleSaveTeam}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs shadow-sm transition-all"
                  >
                    <CheckCircle2 size={13} /> Save Team
                  </button>
                )}
                <button onClick={fetchTeamBuilder} className="p-2 bg-white rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-500 transition-colors">
                  <RefreshCw size={15} className={teamLoading ? "animate-spin" : ""} />
                </button>
                <button onClick={() => setShowTeam(false)} className="p-2 bg-white rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-500 transition-colors">
                  <X size={15} />
                </button>
              </div>
            </div>
            {teamLoading ? (
              <div className="text-center py-8 text-slate-400 text-sm">Building your perfect team...</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {teamSuggestion.map(t => (
                  <TeammateCard key={t.user_id} teammate={t} currentUserId={userId?.toString() || null} onMessage={onMessage} isTeamSuggestion />
                ))}
                {teamSuggestion.length === 0 && <p className="col-span-4 text-center text-slate-400 text-sm py-4">Not enough diverse profiles yet. Search to find more!</p>}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Search Panel ────────────────────────────────────────────────────── */}
      {!suggestedOnly && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Skills Needed</label>
              <input value={searchSkills} onChange={e => setSearchSkills(e.target.value)}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                placeholder="React, Python, Node.js..." />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Interests</label>
              <input value={searchInterests} onChange={e => setSearchInterests(e.target.value)}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                placeholder="AI, FinTech, HealthTech..." />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">College Name</label>
              <input value={searchCollege} onChange={e => setSearchCollege(e.target.value)}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                placeholder="IIT, NIT, Stanford..." />
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <span className="text-xs font-bold text-slate-400 flex items-center mr-1">Quick Skills:</span>
            {SKILL_OPTIONS.map(s => (
              <button key={s} type="button"
                onClick={() => setSearchSkills(prev => prev ? (prev.includes(s) ? prev : `${prev}, ${s}`) : s)}
                className="px-3 py-1 rounded-full text-xs font-medium bg-slate-50 border border-slate-200 text-slate-600 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 transition-all">
                {s}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap gap-2">
            <span className="text-xs font-bold text-slate-400 flex items-center mr-1">Interests:</span>
            {INTEREST_OPTIONS.map(i => (
              <button key={i} type="button"
                onClick={() => setSearchInterests(prev => prev ? (prev.includes(i) ? prev : `${prev}, ${i}`) : i)}
                className="px-3 py-1 rounded-full text-xs font-medium bg-purple-50 border border-purple-200 text-purple-600 hover:bg-purple-100 transition-all">
                {i}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3 pt-2 border-t border-slate-50">
            <button type="button" onClick={() => fetchMatches()}
              className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-bold hover:from-blue-700 hover:to-blue-800 transition-all shadow-md shadow-blue-500/20 text-sm">
              <Search size={16} /> Find Matches
            </button>
            <button type="button" onClick={() => setShowWeights(!showWeights)}
              className="flex items-center gap-2 px-4 py-2.5 bg-slate-50 border border-slate-200 text-slate-600 rounded-xl font-semibold hover:bg-slate-100 transition-colors text-sm">
              <Filter size={16} /> Adjust Weights {totalWeight !== 100 && <span className="text-red-500 text-xs">({totalWeight}%)</span>}
            </button>
            {hackathonMode && (
              <button onClick={() => { setHackathonMode(false); }} className="flex items-center gap-1 text-xs text-amber-600 bg-amber-50 px-3 py-2 rounded-lg border border-amber-200 hover:bg-amber-100 transition-colors">
                <X size={12} /> Hackathon Mode
              </button>
            )}
          </div>

          {/* Weight Sliders */}
          <AnimatePresence>
            {showWeights && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden pt-4 border-t border-slate-50 grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { key: "skillWeight", label: "Skill Compatibility", color: "accent-blue-600" },
                  { key: "interestWeight", label: "Interest Similarity", color: "accent-purple-600" },
                  { key: "experienceWeight", label: "Experience Level", color: "accent-amber-500" },
                  { key: "availabilityWeight", label: "Availability", color: "accent-emerald-500" },
                ].map(({ key, label, color }) => (
                  <div key={key} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium text-slate-700">{label}</span>
                      <span className="font-bold text-slate-900">{weights[key]}%</span>
                    </div>
                    <input type="range" min="0" max="100" value={weights[key]}
                      onChange={e => setWeights({ ...weights, [key]: parseInt(e.target.value) })}
                      className={`w-full h-2 bg-slate-100 rounded-full appearance-none cursor-pointer ${color}`} />
                  </div>
                ))}
                <div className="col-span-full flex justify-end">
                  <button onClick={() => setWeights({ skillWeight: 40, interestWeight: 30, experienceWeight: 20, availabilityWeight: 10 })}
                    className="text-xs text-slate-400 hover:text-slate-600 font-medium">Reset to defaults</button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* ─── Results Header & Filters ─────────────────────────────────────────── */}
      {(hasSearched || suggestedOnly) && (
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
            <Code size={14} /> Filter by:
          </div>
          {SKILL_OPTIONS.slice(0, 8).map(s => (
            <button key={s}
              onClick={() => setSelectedSkillFilters(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s])}
              className={`px-3 py-1 rounded-full text-xs font-medium border transition-all ${selectedSkillFilters.includes(s) ? "bg-blue-600 text-white border-blue-600" : "bg-white text-slate-600 border-slate-200 hover:border-blue-300"}`}>
              {s}
            </button>
          ))}
          <select value={expFilter} onChange={e => setExpFilter(e.target.value)}
            className="text-xs font-medium border border-slate-200 rounded-lg px-3 py-1.5 bg-white text-slate-600 outline-none">
            <option>Any</option>
            <option>Beginner</option>
            <option>Intermediate</option>
            <option>Advanced</option>
          </select>
          <select value={sortBy} onChange={e => setSortBy(e.target.value)}
            className="text-xs font-medium border border-slate-200 rounded-lg px-3 py-1.5 bg-white text-slate-600 outline-none ml-auto">
            <option value="match">Best Match</option>
            <option value="experience">Experience</option>
          </select>
          {selectedSkillFilters.length > 0 && (
            <button onClick={() => setSelectedSkillFilters([])} className="text-xs text-red-500 flex items-center gap-1">
              <X size={12} /> Clear
            </button>
          )}
        </div>
      )}

      {/* ─── Loading ──────────────────────────────────────────────────────────── */}
      {loading && (
        <div className="text-center py-20 space-y-3">
          <div className="w-12 h-12 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin mx-auto" />
          <p className="text-slate-500 font-medium text-sm">AI is analyzing profiles and finding best matches...</p>
        </div>
      )}

      {/* ─── Empty State ─────────────────────────────────────────────────────── */}
      {!suggestedOnly && !hasSearched && !loading && (
        <div className="text-center py-24 bg-white rounded-2xl border border-dashed border-slate-200">
          <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center mx-auto mb-4">
            <Search className="text-blue-600" size={28} />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">Find Your Perfect Team</h3>
          <p className="text-slate-500 max-w-sm mx-auto text-sm">Search by skills and interests above, or click <strong>"Build My Team"</strong> for instant AI-powered suggestions.</p>
        </div>
      )}

      {/* ─── Results ─────────────────────────────────────────────────────────── */}
      {!loading && (hasSearched || suggestedOnly) && (
        <>
          {filteredTeammates.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-slate-200">
              <p className="text-slate-500">No matches found. Try broadening your search!</p>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between">
                <p className="text-sm text-slate-500"><span className="font-bold text-slate-900">{filteredTeammates.length}</span> matches found</p>
                {hackathonMode && <span className="text-xs bg-amber-50 text-amber-700 border border-amber-200 px-3 py-1 rounded-full font-semibold flex items-center gap-1"><Zap size={12} /> Available & Looking for team only</span>}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                <AnimatePresence mode="popLayout">
                  {filteredTeammates.map(t => (
                    <TeammateCard key={t.user_id} teammate={t} currentUserId={userId?.toString() || null} onMessage={onMessage} />
                  ))}
                </AnimatePresence>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default FindTeammates;
