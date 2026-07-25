import React, { useState, useEffect } from "react";
import { Calendar, MapPin, Award, Users, ArrowRight, Loader2 } from "lucide-react";
import { API_BASE } from "../config";
import { useAuth } from "../context/AuthContext";

const UpcomingHackathons = ({ setActiveTab, setSearchInterests }) => {
  const { token } = useAuth();
  const [hackathons, setHackathons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [form, setForm] = useState({
    name: "",
    organizer: "",
    date: "",
    location: "",
    prize: "",
    description: "",
    tags: "",
    interestFilter: "AI",
  });
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const fetchHackathons = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/hackathons`);
      const data = await res.json();
      setHackathons(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error("Failed to load hackathons", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHackathons();

    const checkAdminStatus = async () => {
      if (!token) return;
      try {
        const res = await fetch(`${API_BASE}/api/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setIsAdmin(!!data.is_admin);
        }
      } catch (err) {
        console.error("Failed to check admin status", err);
      }
    };
    checkAdminStatus();
  }, [token]);

  const handleAddHackathon = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    setSubmitting(true);
    setMessage("");
    try {
      const res = await fetch(`${API_BASE}/api/hackathons`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setMessage("✅ Hackathon added successfully!");
        setForm({
          name: "",
          organizer: "",
          date: "",
          location: "",
          prize: "",
          description: "",
          tags: "",
          interestFilter: "AI",
        });
        setTimeout(() => {
          setShowAddForm(false);
          setMessage("");
        }, 1500);
        await fetchHackathons();
      } else {
        setMessage("❌ Failed to add hackathon.");
      }
    } catch (err) {
      console.error(err);
      setMessage("❌ Error connecting to server.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleFindTeammates = (interest) => {
    setSearchInterests(interest);
    setActiveTab("find-teammates");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-white">Upcoming Hackathons</h2>
          <p className="text-slate-400 text-sm mt-0.5">Explore premier developer hackathons and find your dream team to win.</p>
        </div>
        {isAdmin && (
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="px-4 py-2.5 bg-white/5 border border-white/10 text-slate-300 font-bold text-sm rounded-xl hover:bg-white/10 hover:text-white transition-all shrink-0 cursor-pointer"
          >
            {showAddForm ? "Close Form" : "Add Hackathon"}
          </button>
        )}
      </div>

      {isAdmin && showAddForm && (
        <form onSubmit={handleAddHackathon} className="bg-white/5 border border-white/10 rounded-2xl p-6 shadow-lg space-y-4 backdrop-blur-md">
          <h3 className="text-base font-bold text-white">Add New Hackathon Event</h3>
          {message && (
            <div className={`p-3.5 rounded-xl text-xs font-semibold border ${message.includes("successfully") ? "bg-emerald-500/10 text-emerald-450 border-emerald-500/20" : "bg-red-500/10 text-red-400 border-red-500/20"}`}>
              {message}
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-[10px] font-bold text-slate-450 uppercase tracking-widest mb-2 block">Event Name *</label>
              <input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none text-sm text-slate-100 placeholder-slate-500 transition-all"
                placeholder="Smart India Hackathon 2026" />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-455 uppercase tracking-widest mb-2 block">Organizer</label>
              <input value={form.organizer} onChange={e => setForm({ ...form, organizer: e.target.value })}
                className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none text-sm text-slate-100 placeholder-slate-500 transition-all"
                placeholder="Devfolio, MIT, etc." />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-460 uppercase tracking-widest mb-2 block">Prize Pool</label>
              <input value={form.prize} onChange={e => setForm({ ...form, prize: e.target.value })}
                className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none text-sm text-slate-100 placeholder-slate-500 transition-all"
                placeholder="$50,000 USD / ₹1,00,000" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-[10px] font-bold text-slate-450 uppercase tracking-widest mb-2 block">Dates</label>
              <input value={form.date} onChange={e => setForm({ ...form, date: e.target.value })}
                className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none text-sm text-slate-100 placeholder-slate-500 transition-all"
                placeholder="Dec 4 - 6, 2026" />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-455 uppercase tracking-widest mb-2 block">Location</label>
              <input value={form.location} onChange={e => setForm({ ...form, location: e.target.value })}
                className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none text-sm text-slate-100 placeholder-slate-500 transition-all"
                placeholder="Bengaluru, India / Online" />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-460 uppercase tracking-widest mb-2 block">Primary Focus Filter</label>
              <select value={form.interestFilter} onChange={e => setForm({ ...form, interestFilter: e.target.value })}
                className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none text-sm text-slate-300 cursor-pointer">
                {["AI", "Web3", "HealthTech", "FinTech", "EdTech", "IoT", "SaaS", "Security"].map(f => (
                  <option key={f} value={f} className="bg-slate-900 text-slate-350">{f}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-bold text-slate-450 uppercase tracking-widest mb-2 block">Tags (comma-separated)</label>
              <input value={form.tags} onChange={e => setForm({ ...form, tags: e.target.value })}
                className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none text-sm text-slate-100 placeholder-slate-500 transition-all"
                placeholder="Web3, Solidity, AI, Flutter" />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-455 uppercase tracking-widest mb-2 block">Brief Description</label>
              <input value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
                className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none text-sm text-slate-100 placeholder-slate-500 transition-all"
                placeholder="Brief description of the event..." />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button type="submit" disabled={submitting}
              className="px-6 py-2.5 bg-gradient-to-r from-indigo-650 to-violet-600 hover:opacity-95 text-white font-bold rounded-xl text-sm transition-all shadow-md shadow-indigo-500/10 disabled:opacity-60 cursor-pointer"
            >
              {submitting ? "Adding..." : "Add Event"}
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="text-center py-20">
          <Loader2 className="animate-spin text-indigo-500 mx-auto mb-2" size={32} />
          <p className="text-slate-400 text-sm">Loading upcoming hackathons...</p>
        </div>
      ) : hackathons.length === 0 ? (
        <div className="text-center py-16 bg-white/5 rounded-2xl border border-dashed border-white/10">
          <p className="text-slate-400 font-medium">No hackathons listed at the moment. Check back soon!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {hackathons.map((h) => (
          <div key={h.id} className="bg-slate-900/60 border border-slate-800/80 hover:border-indigo-500/40 hover:bg-slate-900/80 transition-all duration-300 p-6 flex flex-col justify-between rounded-2xl shadow-lg hover:shadow-indigo-500/5">
            <div>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <span className="text-xs font-bold text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2.5 py-1 rounded-lg">{h.organizer}</span>
                  <h3 className="text-lg font-bold text-white mt-3.5 tracking-tight">{h.name}</h3>
                </div>
                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-lg">
                  <Award size={14} /> {h.prize}
                </div>
              </div>

              <p className="text-slate-400 text-sm leading-relaxed mb-4">{h.description}</p>

              <div className="space-y-2 mb-6 text-xs text-slate-450 font-semibold">
                <div className="flex items-center gap-2">
                  <Calendar size={14} className="text-indigo-400 shrink-0" />
                  <span>{h.date}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin size={14} className="text-rose-400 shrink-0" />
                  <span>{h.location}</span>
                </div>
              </div>
            </div>

            <div>
              <div className="flex flex-wrap gap-1.5 mb-6">
                {(Array.isArray(h.tags) ? h.tags : String(h.tags || "").split(",").map(t => t.trim()).filter(Boolean)).map(tag => (
                  <span key={tag} className="px-2.5 py-0.5 rounded-lg bg-white/5 text-slate-300 border border-white/10 text-xs font-semibold">
                    {tag}
                  </span>
                ))}
              </div>

              <button
                onClick={() => handleFindTeammates(h.interestFilter)}
                className="w-full py-2.5 bg-gradient-to-r from-indigo-650 to-violet-600 hover:opacity-95 text-white rounded-xl font-bold transition-all text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/20 cursor-pointer"
              >
                <Users size={16} /> Find Teammates <ArrowRight size={14} />
              </button>
            </div>
          </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UpcomingHackathons;
