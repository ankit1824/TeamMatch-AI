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
          <h2 className="text-2xl font-bold text-slate-900">Upcoming Hackathons</h2>
          <p className="text-slate-500 text-sm mt-0.5">Explore premier developer hackathons and find your dream team to win.</p>
        </div>
        {isAdmin && (
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="px-4 py-2.5 bg-indigo-50 border border-indigo-200 text-indigo-700 font-semibold text-sm rounded-xl hover:bg-indigo-100 transition-colors shrink-0"
          >
            {showAddForm ? "Close Form" : "Add Hackathon"}
          </button>
        )}
      </div>

      {isAdmin && showAddForm && (
        <form onSubmit={handleAddHackathon} className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-slate-800">Add New Hackathon Event</h3>
          {message && (
            <div className={`p-3.5 rounded-xl text-xs font-semibold ${message.includes("successfully") ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-red-50 text-red-700 border border-red-200"}`}>
              {message}
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Event Name *</label>
              <input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm bg-white"
                placeholder="Smart India Hackathon 2026" />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Organizer</label>
              <input value={form.organizer} onChange={e => setForm({ ...form, organizer: e.target.value })}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm bg-white"
                placeholder="Devfolio, MIT, etc." />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Prize Pool</label>
              <input value={form.prize} onChange={e => setForm({ ...form, prize: e.target.value })}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm bg-white"
                placeholder="$50,000 USD / ₹1,00,000" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Dates</label>
              <input value={form.date} onChange={e => setForm({ ...form, date: e.target.value })}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm bg-white"
                placeholder="Dec 4 - 6, 2026" />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Location</label>
              <input value={form.location} onChange={e => setForm({ ...form, location: e.target.value })}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm bg-white"
                placeholder="Bengaluru, India / Online" />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Primary Focus Filter</label>
              <select value={form.interestFilter} onChange={e => setForm({ ...form, interestFilter: e.target.value })}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm bg-white">
                {["AI", "Web3", "HealthTech", "FinTech", "EdTech", "IoT", "SaaS", "Security"].map(f => (
                  <option key={f} value={f}>{f}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Tags (comma-separated)</label>
              <input value={form.tags} onChange={e => setForm({ ...form, tags: e.target.value })}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm bg-white"
                placeholder="Web3, Solidity, AI, Flutter" />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Brief Description</label>
              <input value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm bg-white"
                placeholder="Brief description of the event..." />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button type="submit" disabled={submitting}
              className="px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold rounded-xl text-sm transition-all shadow-md shadow-blue-500/10 disabled:opacity-60"
            >
              {submitting ? "Adding..." : "Add Event"}
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="text-center py-20">
          <Loader2 className="animate-spin text-indigo-600 mx-auto mb-2" size={32} />
          <p className="text-slate-500 text-sm">Loading upcoming hackathons...</p>
        </div>
      ) : hackathons.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-slate-200">
          <p className="text-slate-500">No hackathons listed at the moment. Check back soon!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {hackathons.map((h) => (
          <div key={h.id} className="bg-white rounded-2xl border border-slate-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgb(37,99,235,0.08)] transition-all p-6 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md">{h.organizer}</span>
                  <h3 className="text-lg font-bold text-slate-900 mt-2">{h.name}</h3>
                </div>
                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md">
                  <Award size={14} /> {h.prize}
                </div>
              </div>

              <p className="text-slate-500 text-sm leading-relaxed mb-4">{h.description}</p>

              <div className="space-y-2 mb-6 text-xs text-slate-500">
                <div className="flex items-center gap-2">
                  <Calendar size={14} className="text-indigo-500 shrink-0" />
                  <span>{h.date}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin size={14} className="text-red-500 shrink-0" />
                  <span>{h.location}</span>
                </div>
              </div>
            </div>

            <div>
              <div className="flex flex-wrap gap-1.5 mb-6">
                {h.tags.map(tag => (
                  <span key={tag} className="px-2 py-0.5 rounded-full bg-slate-50 text-slate-600 border border-slate-100 text-xs font-medium">
                    {tag}
                  </span>
                ))}
              </div>

              <button
                onClick={() => handleFindTeammates(h.interestFilter)}
                className="w-full py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl font-bold transition-all text-sm flex items-center justify-center gap-2 shadow-md shadow-blue-500/10"
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
