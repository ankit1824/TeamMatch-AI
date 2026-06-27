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
    blue: "bg-blue-50 text-blue-700 border-blue-200",
    green: "bg-emerald-50 text-emerald-700 border-emerald-200",
    purple: "bg-purple-50 text-purple-700 border-purple-200",
    gray: "bg-slate-50 text-slate-600 border-slate-200 hover:border-blue-300 hover:bg-blue-50",
  };
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${selected ? colors[color] : colors.gray} ${onClick ? "cursor-pointer" : "cursor-default"}`}
    >
      {label}
      {onRemove && (
        <span onClick={(e) => { e.stopPropagation(); onRemove(); }} className="cursor-pointer hover:text-red-500 transition-colors">
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
        <div className="p-3 bg-amber-50 rounded-xl border border-amber-200">
          <div className="flex items-center gap-1.5 mb-2 text-amber-700 text-xs font-bold">
            <Lightbulb size={12} /> Suggested based on your skills
          </div>
          <div className="flex flex-wrap gap-2">
            {uniqueSuggestions.map(s => (
              <button type="button" key={s} onClick={() => toggle(s)} className="px-3 py-1 rounded-full text-xs font-medium bg-white border border-amber-300 text-amber-700 hover:bg-amber-100 transition-colors">
                + {s}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="relative">
        <div className="flex gap-2">
          <input
            className="flex-1 px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm"
            placeholder="Search or type a skill..."
            value={input}
            onChange={e => { setInput(e.target.value); setShowSuggestions(true); }}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
            onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); addCustom(); } }}
          />
          <button type="button" onClick={addCustom} className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors text-sm font-medium flex items-center gap-1">
            <Plus size={16} />
          </button>
        </div>
        {showSuggestions && filtered.length > 0 && input.length > 0 && (
          <div className="absolute z-20 w-full mt-1 bg-white border border-slate-200 rounded-xl shadow-xl max-h-52 overflow-y-auto">
            {filtered.slice(0, 10).map(skill => (
              <button
                type="button"
                key={skill}
                onMouseDown={() => toggle(skill)}
                className="w-full text-left px-4 py-2.5 text-sm hover:bg-blue-50 transition-colors"
              >
                {skill}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {ALL_SKILLS.filter(s => !selected.includes(s)).slice(0, 20).map(skill => (
          <button type="button" key={skill} onClick={() => toggle(skill)}
            className="px-3 py-1 rounded-full text-xs font-medium bg-slate-50 border border-slate-200 text-slate-600 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700 transition-all">
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
          className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${selected.includes(interest)
            ? "bg-purple-600 text-white border-purple-600 shadow-md shadow-purple-200"
            : "bg-white border-slate-200 text-slate-600 hover:border-purple-300 hover:bg-purple-50"}`}>
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
      <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">{icon} {label}</label>
      <input type={type} value={profile[key]} onChange={e => setProfile({ ...profile, [key]: e.target.value })}
        className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm bg-white"
        placeholder={placeholder} />
    </div>
  );

  if (loading) return <div className="text-center py-20 text-slate-400">Loading profile...</div>;

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-900">Your Profile</h2>
        <p className="text-slate-500 mt-1">Complete your profile to get better AI teammate matches.</p>
      </div>

      <AnimatePresence>
        {message && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className={`mb-6 p-4 rounded-xl text-sm font-medium ${message.includes("saved") ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-red-50 text-red-700 border border-red-200"}`}>
            {message}
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Info */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm space-y-5">
          <h3 className="text-base font-bold text-slate-800 flex items-center gap-2"><User size={18} className="text-blue-500" /> Basic Info</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {field("Full Name", <User size={15} />, "full_name", "text", "Alex Johnson")}
            {field("University / College", <School size={15} />, "college", "text", "Stanford University")}
            {field("Contact Email", <Mail size={15} />, "contact_email", "email", "you@example.com")}
            {field("Phone Number", <Phone size={15} />, "phone", "tel", "+91 98765 43210")}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {field("GitHub URL", <Github size={15} />, "github_link", "url", "https://github.com/...")}
            {field("LinkedIn URL", <Linkedin size={15} />, "linkedin_link", "url", "https://linkedin.com/in/...")}
          </div>
        </div>

        {/* Role & Experience */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm space-y-5">
          <h3 className="text-base font-bold text-slate-800 flex items-center gap-2"><Briefcase size={18} className="text-blue-500" /> Role & Experience</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2"><Star size={15} /> Experience Level</label>
              <select value={profile.experience_level} onChange={e => setProfile({ ...profile, experience_level: e.target.value })}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm bg-white">
                {["Beginner", "Intermediate", "Advanced"].map(l => <option key={l}>{l}</option>)}
              </select>
            </div>
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2"><Briefcase size={15} /> Preferred Role</label>
              <select value={profile.preferred_role} onChange={e => setProfile({ ...profile, preferred_role: e.target.value })}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm bg-white">
                {ROLES.map(r => <option key={r}>{r}</option>)}
              </select>
            </div>
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2"><Clock size={15} /> Availability</label>
              <select value={profile.availability} onChange={e => setProfile({ ...profile, availability: e.target.value })}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm bg-white">
                {["Available", "Busy", "Looking for team"].map(a => <option key={a}>{a}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Skills */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
            <Code size={18} className="text-blue-500" />
            Skills
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${profile.skills.length >= 3 ? "text-emerald-700 bg-emerald-50" : "text-red-600 bg-red-50"}`}>
              {profile.skills.length}/3 min required
            </span>
          </h3>

          <SkillPicker selected={profile.skills} onChange={skills => setProfile({ ...profile, skills })} />
        </div>

        {/* Interests */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-slate-800 flex items-center gap-2"><Heart size={18} className="text-blue-500" /> Project Interests</h3>
          <InterestPicker selected={profile.interests} onChange={interests => setProfile({ ...profile, interests })} />
        </div>

        {/* Past Experience */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm space-y-5">
          <h3 className="text-base font-bold text-slate-800 flex items-center gap-2"><Star size={18} className="text-blue-500" /> Past Hackathon</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {field("Hackathon Name", <Star size={15} />, "past_hackathon", "text", "HackMIT, ETHGlobal...")}
            {field("Project Name", <Code size={15} />, "past_project_name", "text", "HealthAI, EduPal...")}
          </div>
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2"><ChevronRight size={15} /> Project Description</label>
            <textarea value={profile.past_project_desc}
              onChange={e => setProfile({ ...profile, past_project_desc: e.target.value })}
              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm min-h-[100px] bg-white"
              placeholder="Briefly describe what you built, the tech stack, and your role." />
          </div>
        </div>

        <button type="submit" disabled={saving}
          className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3.5 rounded-xl font-bold hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2 text-sm disabled:opacity-60">
          <Save size={18} />
          {saving ? "Saving..." : "Save Profile"}
        </button>
      </form>
    </motion.div>
  );
};

export default ProfileForm;
