import React, { useState, useEffect, useMemo, useCallback } from "react";
import { API_BASE } from "../config";
import { useAuth } from "../context/AuthContext";
import { motion, AnimatePresence } from "motion/react";
import {
  User, School, Code, Briefcase, Star, Filter, X,
  Search, Github, Linkedin, Mail, Zap,
  ChevronDown, ChevronUp, Users, RefreshCw, Phone, CheckCircle2, AlertCircle
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
    Available: { dot: "bg-emerald-400", text: "text-emerald-450 bg-emerald-500/10 border border-emerald-500/20" },
    Busy: { dot: "bg-rose-400", text: "text-rose-450 bg-rose-500/10 border border-rose-500/20" },
    "Looking for team": { dot: "bg-amber-400", text: "text-amber-450 bg-amber-500/10 border border-amber-500/20" },
  };
  const s = map[status || ""] || { dot: "bg-slate-500", text: "text-slate-400 bg-slate-500/10 border border-slate-550/20" };
  return (
    <span className={`inline-flex items-center gap-1.5 text-[10px] font-bold px-2 py-0.5 rounded-lg ${s.text}`}>
      <span className={`w-1 h-1 rounded-full ${s.dot} ${status === "Available" ? "animate-pulse" : ""}`} />
      {status || "Unknown"}
    </span>
  );
};

// ─── Match Breakdown Bar ─────────────────────────────────────────────────────

const BreakdownBar = ({ label, value, max, color }) => (
  <div className="space-y-1">
    <div className="flex justify-between text-[11px] text-slate-400">
      <span>{label}</span>
      <span className="font-semibold text-slate-200">{value}/{max}</span>
    </div>
    <div className="h-1.5 bg-slate-900/80 rounded-full overflow-hidden border border-white/5 p-[1px]">
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

const TeammateCard = ({ teammate, currentUserId, onMessage, isTeamSuggestion, isSelected, onToggleSelect }) => {
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
  const matchColor = matchPct >= 80
    ? "text-emerald-450 bg-emerald-500/10 border-emerald-500/20 shadow-[0_0_8px_rgba(16,185,129,0.1)]"
    : matchPct >= 60
      ? "text-cyan-450 bg-cyan-500/10 border-cyan-500/20 shadow-[0_0_8px_rgba(6,182,212,0.1)]"
      : "text-amber-455 bg-amber-500/10 border-amber-500/20 shadow-[0_0_8px_rgba(245,158,11,0.1)]";

  const ringColor = matchPct >= 80 ? "#10b981" : matchPct >= 60 ? "#06b6d4" : "#f59e0b";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -3 }}
      className={`rounded-2xl border transition-all flex flex-col overflow-hidden ${
        isTeamSuggestion
          ? "bg-slate-950/60 border-slate-850/80 shadow-[0_8px_30px_rgb(0,0,0,0.3)] text-white hover:shadow-[0_8px_30px_rgb(139,92,246,0.15)] hover:border-purple-500/40"
          : "bg-slate-900/60 border-slate-800/80 shadow-[0_8px_30px_rgb(0,0,0,0.2)] text-white hover:shadow-[0_8px_30px_rgb(99,102,241,0.15)] hover:border-indigo-500/40"
      }`}
    >
      {isTeamSuggestion && teammate.suggestedFor && (
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-4 py-1.5 text-[10px] font-bold text-white flex items-center gap-1.5 uppercase tracking-wide">
          <Users size={12} /> Suggested as {teammate.suggestedFor}
        </div>
      )}

      <div className="p-6 flex flex-col flex-1">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-650 flex items-center justify-center text-white font-bold text-lg shadow-md border border-white/5">
                {(teammate.full_name || "?")[0].toUpperCase()}
              </div>
              {matchPct > 0 && (
                <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-slate-950 border border-slate-800 flex items-center justify-center shadow-sm">
                  <span style={{ color: ringColor }} className="text-[9px] font-black">{matchPct}%</span>
                </div>
              )}
            </div>
            <div>
              <h3 className="font-bold text-base leading-tight text-white">{teammate.full_name || "Anonymous"}</h3>
              <div className="flex items-center gap-1 text-[11px] mt-0.5 text-slate-400">
                <School size={11} />
                <span className="truncate max-w-[150px]">{teammate.college || "No college"}</span>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2 shrink-0">
            {matchPct > 0 && (
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${matchColor}`}>
                {matchPct}% match
              </span>
            )}
          </div>
        </div>

        {/* Meta */}
        <div className="flex flex-wrap gap-2 mb-4 text-xs">
          <span className="flex items-center gap-1 px-2.5 py-1 rounded-lg border border-slate-800 text-[10px] font-bold bg-slate-950/40 text-slate-300">
            <Briefcase size={11} className="text-slate-400" /> {teammate.preferred_role}
          </span>
          <AvailBadge status={teammate.availability} />
        </div>

        {/* Common Skills Highlight */}
        {!isTeamSuggestion && commonSkills.length > 0 && (
          <div className="bg-indigo-500/5 border border-indigo-500/10 rounded-xl p-3 mb-4">
            <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
              <Zap size={11} className="fill-indigo-500 text-indigo-500" /> Common Skills
            </p>
            <div className="flex flex-wrap gap-1">
              {commonSkills.map(s => (
                <span key={s} className="px-2 py-0.5 bg-indigo-500/10 text-indigo-300 rounded text-[9px] font-bold">
                  {s}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* AI Insight */}
        {teammate.explanation && (
          <p className="text-xs leading-relaxed italic mb-4 border-l-2 pl-2.5 text-slate-350 border-slate-700">
            "{teammate.explanation}"
          </p>
        )}

        {/* Skills & Interests Tags */}
        <div className="space-y-3 mb-6 flex-grow">
          <div>
            <p className="text-[9px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Skills</p>
            <div className="flex flex-wrap gap-1">
              {skills.slice(0, 5).map(s => (
                <span key={s} className="px-2.5 py-1 rounded-lg border bg-slate-800/40 border-slate-700/30 text-slate-300 text-xs font-semibold">
                  {s}
                </span>
              ))}
              {skills.length > 5 && (
                <span className="px-2 py-1 rounded-lg bg-slate-800 text-slate-400 text-[10px] font-semibold">
                  +{skills.length - 5} more
                </span>
              )}
            </div>
          </div>

          {interests.length > 0 && (
            <div>
              <p className="text-[9px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Project Focus</p>
              <div className="flex flex-wrap gap-1">
                {interests.slice(0, 4).map(i => (
                  <span key={i} className="px-2.5 py-0.5 rounded-full border border-purple-500/20 bg-purple-500/5 text-purple-300 text-[10px] font-bold">
                    {i}
                  </span>
                ))}
                {interests.length > 4 && (
                  <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 text-[10px] font-semibold">
                    +{interests.length - 4} more
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Dynamic Breakdown toggle */}
        {teammate.scores && (
          <div className="mb-5 border-t border-slate-800/60 pt-3">
            <button
              onClick={() => setShowBreakdown(!showBreakdown)}
              className="w-full flex items-center justify-between text-xs text-slate-450 hover:text-slate-300 transition-colors cursor-pointer"
            >
              <span>Match Scoring Breakdown</span>
              {showBreakdown ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>
            <AnimatePresence>
              {showBreakdown && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden space-y-2 mt-3"
                >
                  <BreakdownBar label="Skill Compatibility" value={teammate.scores.skills} max={10} color="bg-indigo-500" />
                  <BreakdownBar label="Project Interests" value={teammate.scores.interests} max={10} color="bg-purple-500" />
                  <BreakdownBar label="Experience Level" value={teammate.scores.experience} max={10} color="bg-amber-500" />
                  <BreakdownBar label="Availability Match" value={teammate.scores.availability} max={10} color="bg-emerald-500" />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* Actions */}
        <div className="grid grid-cols-2 gap-2 mt-auto">
          {onToggleSelect && (
            <button
              onClick={() => onToggleSelect(teammate)}
              className={`py-2 px-3 border rounded-xl font-bold transition-all text-xs flex items-center justify-center gap-1.5 cursor-pointer ${
                isSelected
                  ? "bg-emerald-500/20 text-emerald-450 border-emerald-500/35 hover:bg-emerald-500/30"
                  : "bg-white/5 border-white/10 text-slate-300 hover:bg-white/10"
              }`}
            >
              {isSelected ? "Selected" : "Select Custom"}
            </button>
          )}

          <button
            onClick={handleMessage}
            className={`py-2 px-3 bg-gradient-to-r from-indigo-600 to-violet-650 hover:opacity-95 text-white rounded-xl font-bold text-xs shadow-md shadow-indigo-500/10 flex items-center justify-center gap-1.5 cursor-pointer ${
              onToggleSelect ? "" : "col-span-2"
            }`}
          >
            <Mail size={13} /> Chat / Invite
          </button>

          {teammate.github_url ? (
            <a
              href={teammate.github_url}
              target="_blank"
              rel="noopener noreferrer"
              className="py-2 px-3 border rounded-xl font-bold transition-all text-xs bg-white/5 border-white/10 text-slate-200 hover:bg-white/10 flex items-center justify-center gap-1.5"
            >
              <Github size={13} /> GitHub
            </a>
          ) : (
            <button disabled className="py-2 px-3 border rounded-xl font-bold text-xs cursor-not-allowed flex items-center justify-center gap-1.5 bg-slate-950/40 text-slate-600 border-slate-900">
              <Github size={13} /> GitHub
            </button>
          )}

          {teammate.linkedin_url ? (
            <a
              href={teammate.linkedin_url}
              target="_blank"
              rel="noopener noreferrer"
              className="py-2 px-3 border rounded-xl font-bold transition-all text-xs bg-white/5 border-white/10 text-slate-200 hover:bg-white/10 flex items-center justify-center gap-1.5"
            >
              <Linkedin size={13} /> LinkedIn
            </a>
          ) : (
            <button disabled className="py-2 px-3 border rounded-xl font-bold text-xs cursor-not-allowed flex items-center justify-center gap-1.5 bg-slate-950/40 text-slate-600 border-slate-900">
              <Linkedin size={13} /> LinkedIn
            </button>
          )}

          {teammate.phone ? (
            <a
              href={`tel:${teammate.phone.replace(/\s+/g, "")}`}
              className="col-span-2 py-2 px-3 rounded-xl font-bold transition-all text-xs flex items-center justify-center gap-1.5 bg-white/5 border border-white/10 hover:bg-white/10 text-slate-200"
            >
              <Phone size={13} /> Call / SMS ({teammate.phone})
            </a>
          ) : (
            <button disabled className="col-span-2 py-2 px-3 border rounded-xl font-bold text-xs cursor-not-allowed flex items-center justify-center gap-1.5 bg-slate-950/40 text-slate-600 border-slate-900">
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
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [tempTeamName, setTempTeamName] = useState("");
  const [modalType, setModalType] = useState("auto"); // "auto" or "custom"
  const [saveStatus, setSaveStatus] = useState(null); // { type: 'success' | 'error', message: '...' }
  const [isSaving, setIsSaving] = useState(false);

  const handleToggleSelect = useCallback((member) => {
    setSelectedMembers(prev => {
      const exists = prev.some(m => m.user_id === member.user_id);
      if (exists) {
        return prev.filter(m => m.user_id !== member.user_id);
      } else {
        return [...prev, member];
      }
    });
  }, []);

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

  const handleSaveTeam = () => {
    setModalType("auto");
    setSaveStatus(null);
    setTempTeamName("");
    setShowSaveModal(true);
  };

  const handleSaveCustomTeam = () => {
    setModalType("custom");
    setSaveStatus(null);
    setTempTeamName("");
    setShowSaveModal(true);
  };

  const executeSaveTeam = async () => {
    if (!tempTeamName.trim() || isSaving) return;
    setIsSaving(true);
    setSaveStatus(null);

    try {
      let res;
      if (modalType === "auto") {
        const avgHealth = teamSuggestion.length > 0
          ? teamSuggestion.reduce((acc, curr) => acc + (curr.matchPercentage || 0), 0) / teamSuggestion.length
          : 80;

        const memberIds = [parseInt(userId), ...teamSuggestion.map(t => t.user_id)];

        res = await fetch(`${API_BASE}/api/teams`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            team_name: tempTeamName.trim(),
            description: `AI Auto-built team for user #${userId}`,
            health_score: parseFloat(avgHealth.toFixed(1)),
            members: memberIds
          })
        });
      } else {
        const memberIds = [parseInt(userId), ...selectedMembers.map(m => m.user_id)];

        const resHealth = await fetch(`${API_BASE}/api/team-health`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ members: memberIds })
        });
        if (!resHealth.ok) {
          throw new Error("Failed to calculate team health score.");
        }
        const healthData = await resHealth.json();
        const finalHealth = healthData?.health?.health_score || 75;

        res = await fetch(`${API_BASE}/api/teams`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            team_name: tempTeamName.trim(),
            description: `Custom team built with: ${selectedMembers.map(m => m.preferred_role).join(", ")}`,
            health_score: parseFloat(finalHealth),
            members: memberIds
          })
        });
      }

      if (res.ok) {
        setSaveStatus({
          type: "success",
          message: `Team "${tempTeamName.trim()}" successfully saved to your dashboard!`
        });
      } else {
        const err = await res.json();
        setSaveStatus({
          type: "error",
          message: `Failed to save team: ${err.detail || "Server error"}`
        });
      }
    } catch (e) {
      console.error(e);
      setSaveStatus({
        type: "error",
        message: e.message || "Error connecting to the database server."
      });
    } finally {
      setIsSaving(false);
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
          <h2 className="text-2xl font-extrabold text-white">
            {suggestedOnly ? "Top AI Matches" : "Find Teammates"}
          </h2>
          <p className="text-slate-400 text-sm mt-0.5">
            {suggestedOnly ? "Based on your skills, interests, and experience." : "Search by skill or let AI find your best match."}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => { setHackathonMode(true); fetchMatches({ hackathon: true }); }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 font-bold text-sm hover:bg-amber-500/20 transition-all cursor-pointer"
          >
            <Zap size={15} className="fill-amber-400 text-amber-400" /> Hackathon Mode
          </button>
          <button onClick={fetchTeamBuilder}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-650 to-violet-600 text-white font-bold text-sm shadow-md shadow-indigo-500/20 hover:opacity-95 transition-all cursor-pointer">
            <Users size={15} /> Build My Team
          </button>
        </div>
      </div>

      {/* ─── AI Team Builder ─────────────────────────────────────────────────── */}
      <AnimatePresence>
        {showTeam && (
          <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}
            className="bg-slate-950/60 border border-slate-850/80 text-white rounded-3xl p-6 shadow-2xl relative overflow-hidden backdrop-blur-md">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2.5">
                <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 text-indigo-400 p-2.5 rounded-2xl shadow-md">
                  <Users size={18} />
                </div>
                <div>
                  <h3 className="font-extrabold text-white">AI Team Builder</h3>
                  <p className="text-xs text-slate-450 font-medium">Complementary teammates selected to balance your skills</p>
                </div>
              </div>
              <div className="flex gap-2 items-center">
                {teamSuggestion.length > 0 && !teamLoading && (
                  <button
                    onClick={handleSaveTeam}
                    className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-indigo-650 to-violet-600 hover:opacity-95 text-white rounded-xl font-bold text-xs shadow-md shadow-indigo-500/20 transition-all cursor-pointer"
                  >
                    <CheckCircle2 size={13} /> Save Team
                  </button>
                )}
                <button onClick={fetchTeamBuilder} className="p-2 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-400 hover:text-white rounded-xl transition-all cursor-pointer">
                  <RefreshCw size={14} className={teamLoading ? "animate-spin" : ""} />
                </button>
                <button onClick={() => setShowTeam(false)} className="p-2 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-400 hover:text-white rounded-xl transition-all cursor-pointer">
                  <X size={14} />
                </button>
              </div>
            </div>
            {teamLoading ? (
              <div className="text-center py-10 text-slate-400 text-sm">Building your perfect team...</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {teamSuggestion.map(t => (
                  <TeammateCard
                    key={t.user_id}
                    teammate={t}
                    currentUserId={userId?.toString() || null}
                    onMessage={onMessage}
                    isTeamSuggestion
                    isSelected={selectedMembers.some(m => m.user_id === t.user_id)}
                    onToggleSelect={handleToggleSelect}
                  />
                ))}
                {teamSuggestion.length === 0 && <p className="col-span-4 text-center text-slate-450 text-sm py-6">Not enough diverse profiles yet. Search to find more!</p>}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Search Panel ────────────────────────────────────────────────────── */}
      {!suggestedOnly && (
        <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 shadow-lg p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-[10px] font-bold text-slate-450 uppercase tracking-widest mb-2 block">Skills Needed</label>
              <input value={searchSkills} onChange={e => setSearchSkills(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-900/60 border border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none text-slate-100 placeholder-slate-500 text-sm transition-all"
                placeholder="React, Python, Node.js..." />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-450 uppercase tracking-widest mb-2 block">Interests</label>
              <input value={searchInterests} onChange={e => setSearchInterests(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-900/60 border border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none text-slate-100 placeholder-slate-500 text-sm transition-all"
                placeholder="AI, FinTech, HealthTech..." />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-450 uppercase tracking-widest mb-2 block">College Name</label>
              <input value={searchCollege} onChange={e => setSearchCollege(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-900/60 border border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none text-slate-100 placeholder-slate-500 text-sm transition-all"
                placeholder="IIT, NIT, Stanford..." />
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center mr-1">Quick Skills:</span>
            {SKILL_OPTIONS.map(s => (
              <button key={s} type="button"
                onClick={() => setSearchSkills(prev => prev ? (prev.includes(s) ? prev : `${prev}, ${s}`) : s)}
                className="px-3 py-1 rounded-full text-xs font-semibold bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 hover:border-indigo-500/40 hover:text-white transition-all cursor-pointer">
                {s}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap gap-2">
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center mr-1">Interests:</span>
            {INTEREST_OPTIONS.map(i => (
              <button key={i} type="button"
                onClick={() => setSearchInterests(prev => prev ? (prev.includes(i) ? prev : `${prev}, ${i}`) : i)}
                className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/5 border border-purple-500/20 text-purple-300 hover:bg-purple-500/15 hover:border-purple-500/40 transition-all cursor-pointer">
                {i}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3 pt-4 border-t border-slate-800/60">
            <button type="button" onClick={() => fetchMatches()}
              className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-indigo-650 to-violet-600 text-white rounded-xl font-bold hover:opacity-95 transition-all shadow-md shadow-indigo-500/20 text-sm cursor-pointer">
              <Search size={16} /> Find Matches
            </button>
            <button type="button" onClick={() => setShowWeights(!showWeights)}
              className="flex items-center gap-2 px-4 py-2.5 bg-white/5 border border-white/10 text-slate-300 rounded-xl font-bold hover:bg-white/10 transition-all text-sm cursor-pointer">
              <Filter size={16} /> Adjust Weights {totalWeight !== 100 && <span className="text-red-400 text-xs font-bold">({totalWeight}%)</span>}
            </button>
            {hackathonMode && (
              <button onClick={() => { setHackathonMode(false); }} className="flex items-center gap-1 text-xs text-amber-400 bg-amber-500/10 px-3 py-2 rounded-xl border border-amber-500/20 hover:bg-amber-500/20 transition-all cursor-pointer">
                <X size={12} /> Hackathon Mode
              </button>
            )}
          </div>

          {/* Weight Sliders */}
          <AnimatePresence>
            {showWeights && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden pt-4 border-t border-slate-800/60 grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { key: "skillWeight", label: "Skill Compatibility", color: "accent-indigo-500" },
                  { key: "interestWeight", label: "Interest Similarity", color: "accent-purple-500" },
                  { key: "experienceWeight", label: "Experience Level", color: "accent-amber-500" },
                  { key: "availabilityWeight", label: "Availability", color: "accent-emerald-500" },
                ].map(({ key, label, color }) => (
                  <div key={key} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-semibold text-slate-300">{label}</span>
                      <span className="font-bold text-white">{weights[key]}%</span>
                    </div>
                    <input type="range" min="0" max="100" value={weights[key]}
                      onChange={e => setWeights({ ...weights, [key]: parseInt(e.target.value) })}
                      className={`w-full h-2 bg-slate-850 rounded-full appearance-none cursor-pointer ${color}`} />
                  </div>
                ))}
                <div className="col-span-full flex justify-end">
                  <button onClick={() => setWeights({ skillWeight: 40, interestWeight: 30, experienceWeight: 20, availabilityWeight: 10 })}
                    className="text-xs text-slate-500 hover:text-slate-350 font-bold cursor-pointer">Reset to defaults</button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* ─── Custom Team Builder Floating Bar ───────────────────────────────── */}
      <AnimatePresence>
        {selectedMembers.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 15 }}
            className="bg-slate-900 text-white rounded-2xl p-5 flex flex-col md:flex-row items-center justify-between gap-4 shadow-lg border border-slate-800"
          >
            <div className="flex items-center gap-3">
              <div className="bg-indigo-650/20 text-indigo-400 p-2.5 rounded-xl border border-indigo-500/20">
                <Users size={20} />
              </div>
              <div>
                <h4 className="font-bold text-sm text-slate-100">Custom Team Builder</h4>
                <p className="text-xs text-slate-405 mt-0.5 font-medium">
                  Selected: <span className="text-indigo-400 font-extrabold">{selectedMembers.map(m => m.full_name).join(", ")}</span>
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleSaveCustomTeam}
                className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-violet-650 hover:opacity-95 text-white rounded-xl font-bold text-xs shadow-md transition-all cursor-pointer"
              >
                Save Team
              </button>
              <button
                onClick={() => setSelectedMembers([])}
                className="px-4 py-2.5 bg-slate-800 hover:bg-slate-750 text-slate-400 hover:text-slate-200 rounded-xl font-bold text-xs transition-colors cursor-pointer"
              >
                Clear Selection
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Results Header & Filters ─────────────────────────────────────────── */}
      {(hasSearched || suggestedOnly) && (
        <div className="flex flex-wrap items-center gap-3 bg-white/5 border border-white/10 rounded-2xl p-4 shadow-md">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-450 uppercase tracking-widest">
            <Code size={14} /> Filter by:
          </div>
          {SKILL_OPTIONS.slice(0, 8).map(s => (
            <button key={s}
              onClick={() => setSelectedSkillFilters(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s])}
              className={`px-3 py-1 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
                selectedSkillFilters.includes(s)
                  ? "bg-indigo-650 text-white border-indigo-600"
                  : "bg-white/5 text-slate-300 border-white/10 hover:border-indigo-500/40 hover:text-white"
              }`}>
              {s}
            </button>
          ))}
          <select value={expFilter} onChange={e => setExpFilter(e.target.value)}
            className="text-xs font-bold border border-slate-800 rounded-xl px-3 py-1.5 bg-slate-900 text-slate-300 outline-none cursor-pointer focus:ring-2 focus:ring-indigo-500/20">
            <option>Any</option>
            <option>Beginner</option>
            <option>Intermediate</option>
            <option>Advanced</option>
          </select>
          <select value={sortBy} onChange={e => setSortBy(e.target.value)}
            className="text-xs font-bold border border-slate-800 rounded-xl px-3 py-1.5 bg-slate-900 text-slate-300 outline-none ml-auto cursor-pointer focus:ring-2 focus:ring-indigo-500/20">
            <option value="match">Best Match</option>
            <option value="experience">Experience</option>
          </select>
          {selectedSkillFilters.length > 0 && (
            <button onClick={() => setSelectedSkillFilters([])} className="text-xs text-red-400 font-bold flex items-center gap-1 cursor-pointer">
              <X size={12} /> Clear
            </button>
          )}
        </div>
      )}

      {/* ─── Loading ──────────────────────────────────────────────────────────── */}
      {loading && (
        <div className="text-center py-20 space-y-4">
          <div className="w-12 h-12 border-4 border-slate-800 border-t-indigo-500 rounded-full animate-spin mx-auto" />
          <p className="text-slate-450 font-bold text-sm">AI is analyzing vectors and finding best compatible teammates...</p>
        </div>
      )}

      {/* ─── Empty State ─────────────────────────────────────────────────────── */}
      {!suggestedOnly && !hasSearched && !loading && (
        <div className="text-center py-24 bg-white/5 backdrop-blur-md rounded-2xl border border-dashed border-white/10 shadow-lg">
          <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mx-auto mb-5 border border-indigo-500/25 shadow-md">
            <Search className="text-indigo-400" size={28} />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Find Your Perfect Team</h3>
          <p className="text-slate-400 max-w-sm mx-auto text-sm font-medium leading-relaxed">Search by skills and interests above, or click <strong className="text-indigo-300">"Build My Team"</strong> for instant AI-powered suggestion rosters.</p>
        </div>
      )}

      {/* ─── Results ─────────────────────────────────────────────────────────── */}
      {!loading && (hasSearched || suggestedOnly) && (
        <>
          {filteredTeammates.length === 0 ? (
            <div className="text-center py-16 bg-white/5 backdrop-blur-md rounded-2xl border border-dashed border-white/10">
              <p className="text-slate-400 font-medium">No matches found. Try broadening your search skills or filters!</p>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between">
                <p className="text-sm text-slate-450 font-medium">Found <span className="font-bold text-white">{filteredTeammates.length}</span> matching hacker profiles</p>
                {hackathonMode && <span className="text-xs bg-amber-500/10 text-amber-405 border border-amber-500/20 px-3 py-1 rounded-full font-bold flex items-center gap-1"><Zap size={12} className="fill-amber-450 text-amber-450" /> Available & Looking for team only</span>}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                <AnimatePresence mode="popLayout">
                  {filteredTeammates.map(t => (
                    <TeammateCard
                      key={t.user_id}
                      teammate={t}
                      currentUserId={userId?.toString() || null}
                      onMessage={onMessage}
                      isSelected={selectedMembers.some(m => m.user_id === t.user_id)}
                      onToggleSelect={handleToggleSelect}
                    />
                  ))}
                </AnimatePresence>
              </div>
            </>
          )}
        </>
      )}

      {/* ─── Save Team Modal ─────────────────────────────────────────────────── */}
      <AnimatePresence>
        {showSaveModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => { if (!saveStatus) setShowSaveModal(false); }}
              className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm"
            />

            {/* Modal Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl relative z-10 space-y-6 text-white"
            >
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-xl">
                  <Users size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-white text-lg">Save Team Roster</h3>
                  <p className="text-xs text-slate-400 font-medium">Form your hackathon squad</p>
                </div>
              </div>

              {saveStatus ? (
                <div className="space-y-4 py-4 text-center">
                  <div className={`w-12 h-12 rounded-full mx-auto flex items-center justify-center ${
                    saveStatus.type === 'success' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/15' : 'bg-red-500/10 text-red-400 border border-red-500/15'
                  }`}>
                    {saveStatus.type === 'success' ? <CheckCircle2 size={24} /> : <AlertCircle size={24} />}
                  </div>
                  <p className="text-sm font-semibold text-slate-300">{saveStatus.message}</p>
                  <button
                    onClick={() => {
                      setShowSaveModal(false);
                      setSaveStatus(null);
                      setTempTeamName("");
                      if (modalType === 'custom') setSelectedMembers([]);
                    }}
                    className="px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-xl text-xs transition-colors cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Team Name</label>
                    <input
                      type="text"
                      value={tempTeamName}
                      onChange={e => setTempTeamName(e.target.value)}
                      placeholder="e.g. Code Crusaders, Alpha Pack"
                      className="w-full px-4 py-2.5 bg-slate-950/60 border border-slate-850 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none text-slate-100 text-sm transition-all"
                      autoFocus
                    />
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2">
                    <button
                      onClick={() => setShowSaveModal(false)}
                      disabled={isSaving}
                      className="px-4 py-2 bg-slate-800 hover:bg-slate-750 text-slate-350 font-bold rounded-xl text-xs transition-colors disabled:opacity-50 cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={executeSaveTeam}
                      disabled={!tempTeamName.trim() || isSaving}
                      className="px-5 py-2.5 bg-indigo-650 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl text-xs transition-colors shadow-sm cursor-pointer"
                    >
                      {isSaving ? "Saving..." : "Confirm Save"}
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

export default FindTeammates;
