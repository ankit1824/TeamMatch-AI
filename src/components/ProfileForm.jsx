import React, { useState, useEffect } from "react";
import { API_BASE } from "../config";
import { useAuth } from "../context/AuthContext";
import { motion, AnimatePresence } from "motion/react";
import { Save, User, School, Code, Heart, Briefcase, Star, Github, Linkedin, Mail, Plus, X, Clock, ChevronRight, Lightbulb, Phone } from "lucide-react";

// ─── Skill Taxonomy ──────────────────────────────────────────────────────────

const SKILL_SUGGESTIONS = {
  React: ["Next.js", "TypeScript", "Tailwind", "Redux", "Node.js"],
  "Next.js": ["React", "TypeScript", "Tailwind", "Vercel"],
  Python: ["TensorFlow", "Django", "Flask", "Scikit-learn", "FastAPI"],
  TensorFlow: ["Python", "PyTorch", "Scikit-learn", "Keras"],
  PyTorch: ["Python", "TensorFlow", "Scikit-learn", "Hugging Face"],
  "Node.js": ["Express", "MongoDB", "TypeScript", "React"],
  Flutter: ["Dart", "Firebase", "React Native"],
  Docker: ["Kubernetes", "CI/CD", "AWS", "Terraform"],
  Solidity: ["Web3.js", "Ethers.js", "Hardhat"],
};

const ALL_SKILLS = [
  "React", "Next.js", "Vue", "Angular", "Svelte", "HTML", "CSS", "Tailwind", "TypeScript", "JavaScript",
  "Node.js", "Express", "Django", "Flask", "FastAPI", "Spring Boot", "Ruby on Rails",
  "Python", "TensorFlow", "PyTorch", "Scikit-learn", "Keras", "OpenCV", "Hugging Face", "LangChain",
  "Flutter", "React Native", "Kotlin", "Swift",
  "MongoDB", "PostgreSQL", "MySQL", "Firebase", "Redis", "Supabase", "SQLite",
  "Docker", "Kubernetes", "AWS", "GCP", "Azure", "CI/CD", "Terraform", "Linux",
  "Solidity", "Web3.js", "Ethers.js", "Hardhat",
  "Figma", "Git", "GraphQL", "REST API", "Rust", "Go", "Java", "C++", "C#",
];

const ALL_INTERESTS = ["AI", "Web3", "HealthTech", "FinTech", "EdTech", "IoT", "AR/VR", "Gaming", "SaaS", "E-commerce", "Security", "Blockchain", "Climate Tech", "Robotics"];

const ROLES = ["Frontend Developer", "Backend Developer", "Full Stack Developer", "AI Engineer", "Data Scientist", "Mobile Developer", "DevOps Engineer", "Blockchain Developer", "UI/UX Designer", "Security Engineer"];

// ─── Tag Component ────────────────────────────────────────────────────────────

const Tag = ({ label, color = "blue", onRemove, onClick, selected }) => {
  const colors = {
    blue: "bg-indigo-500/10 text-indigo-300 border-indigo-500/20",
    green: "bg-emerald-500/10 text-emerald-300 border-emerald-500/20",
    purple: "bg-purple-500/10 text-purple-300 border-purple-500/20",
    gray: "bg-white/5 text-slate-300 border-white/10 hover:border-indigo-500/40 hover:bg-white/10 hover:text-white",
  };
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${selected ? colors[color] : colors.gray} ${onClick ? "cursor-pointer" : "cursor-default"}`}
    >
      {label}
      {onRemove && (
        <span onClick={(e) => { e.stopPropagation(); onRemove(); }} className="cursor-pointer hover:text-red-400 transition-colors">
          <X size={12} />
        </span>
      )}
    </button>
  );
};

// ─── Skill Picker ────────────────────────────────────────────────────────────

const SkillPicker = ({ selected, onChange }) => {
  const [input, setInput] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  const toggle = (skill) => {
    onChange(selected.includes(skill) ? selected.filter(s => s !== skill) : [...selected, skill]);
  };

  const addCustom = () => {
    const trimmed = input.trim();
    if (trimmed && !selected.includes(trimmed)) onChange([...selected, trimmed]);
    setInput("");
  };

  const suggestions = selected.flatMap(s => SKILL_SUGGESTIONS[s] || []).filter(s => !selected.includes(s));
  const uniqueSuggestions = [...new Set(suggestions)];

  const filtered = ALL_SKILLS.filter(s => s.toLowerCase().includes(input.toLowerCase()) && !selected.includes(s));

  return (
    <div className="space-y-3">
      {selected.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selected.map(skill => (
            <Tag key={skill} label={skill} color="blue" onRemove={() => toggle(skill)} selected />
          ))}
        </div>
      )}

      {uniqueSuggestions.length > 0 && (
        <div className="p-3 bg-amber-500/10 rounded-xl border border-amber-500/20">
          <div className="flex items-center gap-1.5 mb-2 text-amber-300 text-xs font-bold">
            <Lightbulb size={12} /> Suggested based on your skills
          </div>
          <div className="flex flex-wrap gap-2">
            {uniqueSuggestions.map(s => (
              <button type="button" key={s} onClick={() => toggle(s)} className="px-3 py-1 rounded-full text-xs font-semibold bg-white/5 border border-amber-500/20 text-amber-300 hover:bg-white/10 hover:border-amber-400 transition-all cursor-pointer">
                + {s}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="relative">
        <div className="flex gap-2">
          <input
            className="flex-1 px-4 py-2.5 bg-slate-900/60 border border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none text-slate-100 placeholder-slate-500 text-sm transition-all"
            placeholder="Search or type a skill..."
            value={input}
            onChange={e => { setInput(e.target.value); setShowSuggestions(true); }}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
            onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); addCustom(); } }}
          />
          <button type="button" onClick={addCustom} className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-violet-650 text-white rounded-xl hover:opacity-95 shadow-md shadow-indigo-500/15 transition-all text-sm font-bold flex items-center gap-1 cursor-pointer">
            <Plus size={16} />
          </button>
        </div>
        {showSuggestions && filtered.length > 0 && input.length > 0 && (
          <div className="absolute z-20 w-full mt-1 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl max-h-52 overflow-y-auto">
            {filtered.slice(0, 10).map(skill => (
              <button
                type="button"
                key={skill}
                onMouseDown={() => toggle(skill)}
                className="w-full text-left px-4 py-2.5 text-sm hover:bg-slate-800 text-slate-200 transition-colors"
              >
                {skill}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-2 pt-1">
        {ALL_SKILLS.filter(s => !selected.includes(s)).slice(0, 15).map(skill => (
          <button type="button" key={skill} onClick={() => toggle(skill)}
            className="px-3 py-1 rounded-full text-xs font-semibold bg-white/5 border border-white/10 text-slate-350 hover:border-indigo-500/40 hover:bg-white/10 hover:text-white transition-all cursor-pointer">
            {skill}
          </button>
        ))}
      </div>
    </div>
  );
};

// ─── Interest Picker ──────────────────────────────────────────────────────────

const InterestPicker = ({ selected, onChange }) => {
  const toggle = (interest) =>
    onChange(selected.includes(interest) ? selected.filter(i => i !== interest) : [...selected, interest]);

  return (
    <div className="flex flex-wrap gap-2">
      {ALL_INTERESTS.map(interest => (
        <button type="button" key={interest} onClick={() => toggle(interest)}
          className={`px-4 py-2 rounded-full text-xs font-bold border transition-all cursor-pointer ${
            selected.includes(interest)
              ? "bg-purple-600 border-purple-500 text-white shadow-md shadow-purple-500/10"
              : "bg-white/5 border-white/10 text-slate-300 hover:border-purple-500/40 hover:bg-white/10 hover:text-white"
          }`}>
          {interest}
        </button>
      ))}
    </div>
  );
};

// ─── Profile Form ─────────────────────────────────────────────────────────────

const ProfileForm = ({ onSaveSuccess }) => {
  const { token } = useAuth();
  const [profile, setProfile] = useState({
    full_name: "", college: "", contact_email: "", phone: "",
    github_link: "", linkedin_link: "",
    skills: [], interests: [],
    experience_level: "Beginner", preferred_role: "Frontend Developer",
    availability: "Looking for team",
    past_hackathon: "", past_project_name: "", past_project_desc: "",
  });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/profile`, { headers: { Authorization: `Bearer ${token}` } });
        const data = await res.json();
        if (data) {
          setProfile({
            full_name: data.full_name || "",
            college: data.college || "",
            contact_email: data.contact_email || "",
            phone: data.phone || "",
            github_link: data.github_link || "",
            linkedin_link: data.linkedin_link || "",
            skills: Array.isArray(data.skills) ? data.skills : (data.skills || "").split(",").map((s) => s.trim()).filter(Boolean),
            interests: Array.isArray(data.interests) ? data.interests : (data.interests || "").split(",").map((s) => s.trim()).filter(Boolean),
            experience_level: data.experience_level || "Beginner",
            preferred_role: data.preferred_role || "Frontend Developer",
            availability: data.availability || "Looking for team",
            past_hackathon: data.past_hackathon || "",
            past_project_name: data.past_project_name || "",
            past_project_desc: data.past_project_desc || "",
          });
        }
      } catch { } finally { setLoading(false); }
    };
    fetchProfile();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true); setMessage("");

    // ─── Validation ────────────────────────────────────────────────────────────
    const errors = [];
    if (!profile.full_name.trim()) errors.push("Full Name is required");
    if (profile.skills.length < 3) errors.push("Add at least 3 skills");
    if (!profile.experience_level) errors.push("Experience level is required");
    if (errors.length > 0) {
      setMessage("⚠️ " + errors.join(" · "));
      setSaving(false); return;
    }

    try {
      const res = await fetch(`${API_BASE}/api/profile`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(profile),
      });
      if (res.ok) {
        setMessage("✅ Profile saved!");
        setTimeout(() => {
          setMessage("");
          if (onSaveSuccess) onSaveSuccess();
        }, 1200);
      }
      else { setMessage("❌ Failed to save. Try again."); }
    } catch { setMessage("❌ Server error."); } finally { setSaving(false); }
  };

  const field = (label, icon, key, type = "text", placeholder = "") => (
    <div>
      <label className="flex items-center gap-2 text-sm font-semibold text-slate-300 mb-2">{icon} {label}</label>
      <input type={type} value={profile[key]} onChange={e => setProfile({ ...profile, [key]: e.target.value })}
        className="w-full px-4 py-2.5 bg-slate-900/60 border border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none text-slate-100 placeholder-slate-500 text-sm transition-all"
        placeholder={placeholder} />
    </div>
  );

  if (loading) return <div className="text-center py-20 text-slate-400">Loading profile...</div>;

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl mx-auto space-y-6">
      <div className="mb-4">
        <h2 className="text-2xl font-extrabold text-white">Your Profile</h2>
        <p className="text-slate-400 text-sm mt-0.5">Complete your profile to get better AI teammate matches.</p>
      </div>

      <AnimatePresence>
        {message && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className={`p-4 rounded-xl text-sm font-medium border ${
              message.includes("saved")
                ? "bg-emerald-500/10 text-emerald-450 border-emerald-500/20"
                : "bg-red-500/10 text-red-400 border-red-500/20"
            }`}>
            {message}
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-6 shadow-lg space-y-5">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <User size={18} className="text-indigo-400" /> Basic Info
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {field("Full Name", <User size={15} className="text-slate-400" />, "full_name", "text", "Alex Johnson")}
            {field("University / College", <School size={15} className="text-slate-400" />, "college", "text", "Stanford University")}
            {field("Contact Email", <Mail size={15} className="text-slate-400" />, "contact_email", "email", "you@example.com")}
            {field("Phone Number", <Phone size={15} className="text-slate-400" />, "phone", "tel", "+91 98765 43210")}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {field("GitHub URL", <Github size={15} className="text-slate-400" />, "github_link", "url", "https://github.com/...")}
            {field("LinkedIn URL", <Linkedin size={15} className="text-slate-400" />, "linkedin_link", "url", "https://linkedin.com/in/...")}
          </div>
        </div>

        {/* Role & Experience */}
        <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-6 shadow-lg space-y-5">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Briefcase size={18} className="text-indigo-400" /> Role & Experience
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-300 mb-2">
                <Star size={15} className="text-slate-400" /> Experience Level
              </label>
              <select value={profile.experience_level} onChange={e => setProfile({ ...profile, experience_level: e.target.value })}
                className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none text-sm text-slate-200 cursor-pointer">
                {["Beginner", "Intermediate", "Advanced"].map(l => <option key={l} className="bg-slate-900">{l}</option>)}
              </select>
            </div>
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-300 mb-2">
                <Briefcase size={15} className="text-slate-400" /> Preferred Role
              </label>
              <select value={profile.preferred_role} onChange={e => setProfile({ ...profile, preferred_role: e.target.value })}
                className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none text-sm text-slate-200 cursor-pointer">
                {ROLES.map(r => <option key={r} className="bg-slate-900">{r}</option>)}
              </select>
            </div>
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-300 mb-2">
                <Clock size={15} className="text-slate-400" /> Availability
              </label>
              <select value={profile.availability} onChange={e => setProfile({ ...profile, availability: e.target.value })}
                className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none text-sm text-slate-200 cursor-pointer">
                {["Available", "Busy", "Looking for team"].map(a => <option key={a} className="bg-slate-900">{a}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Skills */}
        <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-6 shadow-lg space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2.5">
            <Code size={18} className="text-indigo-400" />
            Skills
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${profile.skills.length >= 3 ? "text-emerald-400 bg-emerald-500/10 border border-emerald-500/20" : "text-rose-450 bg-rose-500/10 border border-rose-500/20"}`}>
              {profile.skills.length}/3 min required
            </span>
          </h3>

          <SkillPicker selected={profile.skills} onChange={skills => setProfile({ ...profile, skills })} />
        </div>

        {/* Interests */}
        <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-6 shadow-lg space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Heart size={18} className="text-indigo-400" /> Project Interests
          </h3>
          <InterestPicker selected={profile.interests} onChange={interests => setProfile({ ...profile, interests })} />
        </div>

        {/* Past Experience */}
        <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-6 shadow-lg space-y-5">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Star size={18} className="text-indigo-400" /> Past Hackathon
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {field("Hackathon Name", <Star size={15} className="text-slate-400" />, "past_hackathon", "text", "HackMIT, ETHGlobal...")}
            {field("Project Name", <Code size={15} className="text-slate-400" />, "past_project_name", "text", "HealthAI, EduPal...")}
          </div>
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-300 mb-2">
              <ChevronRight size={15} className="text-slate-450" /> Project Description
            </label>
            <textarea value={profile.past_project_desc}
              onChange={e => setProfile({ ...profile, past_project_desc: e.target.value })}
              className="w-full px-4 py-2.5 bg-slate-900/60 border border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none text-slate-100 placeholder-slate-500 text-sm min-h-[100px] transition-all"
              placeholder="Briefly describe what you built, the tech stack, and your role." />
          </div>
        </div>

        <button type="submit" disabled={saving}
          className="w-full bg-gradient-to-r from-indigo-600 to-violet-650 text-white py-3.5 rounded-xl font-bold hover:opacity-95 shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2 text-sm disabled:opacity-60 transition-all cursor-pointer">
          <Save size={18} />
          {saving ? "Saving..." : "Save Profile"}
        </button>
      </form>
    </motion.div>
  );
};

export default ProfileForm;
