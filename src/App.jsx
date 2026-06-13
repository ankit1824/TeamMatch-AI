import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  UserPlus, 
  Sparkles, 
  ShieldCheck, 
  Trash2, 
  Clock, 
  X, 
  AlertCircle, 
  CheckCircle2,
  Lock,
  Mail,
  User,
  Eye,
  EyeOff
} from 'lucide-react';

import { 
  SKILLS, 
  SKILL_LABELS, 
  calculateCompatibility as localCompatibility, 
  calculateTeamHealth as localTeamHealth, 
  analyzeSkillGaps as localSkillGaps, 
  recommendTeammatesForStudent as localStudentRecs, 
  recommendTeammatesForTeam as localTeamRecs 
} from './mlEngine';

const INITIAL_STUDENTS = [
  { student_id: 1, name: "Priya", dsa: 7, backend: 6, frontend: 9, ml: 3, uiux: 8, communication: 8, projects_count: 5, hackathons_count: 3, availability_hours: 20, skills: "WebDev, UI/UX", experience_level: "Intermediate" },
  { student_id: 2, name: "Riya", dsa: 5, backend: 4, frontend: 8, ml: 2, uiux: 9, communication: 7, projects_count: 4, hackathons_count: 2, availability_hours: 15, skills: "WebDev", experience_level: "Beginner" },
  { student_id: 3, name: "Aman", dsa: 9, backend: 8, frontend: 2, ml: 8, uiux: 2, communication: 7, projects_count: 6, hackathons_count: 4, availability_hours: 25, skills: "AI / ML, Backend", experience_level: "Advanced" },
  { student_id: 4, name: "Rohit", dsa: 8, backend: 7, frontend: 4, ml: 9, uiux: 3, communication: 6, projects_count: 7, hackathons_count: 5, availability_hours: 18, skills: "AI / ML, Python", experience_level: "Advanced" },
  { student_id: 5, name: "Anjali", dsa: 4, backend: 3, frontend: 9, ml: 2, uiux: 8, communication: 9, projects_count: 3, hackathons_count: 1, availability_hours: 12, skills: "Design, Prototyping", experience_level: "Beginner" },
  { student_id: 6, name: "Tarun Gupta", dsa: 8, backend: 5, frontend: 2, ml: 9, uiux: 2, communication: 7, projects_count: 5, hackathons_count: 3, availability_hours: 22, skills: "AI / ML, Data Science", experience_level: "Intermediate" },
  { student_id: 7, name: "Sneha Patel", dsa: 7, backend: 8, frontend: 7, ml: 3, uiux: 6, communication: 8, projects_count: 6, hackathons_count: 2, availability_hours: 20, skills: "Fullstack, Django", experience_level: "Intermediate" },
  { student_id: 8, name: "Kabir Sharma", dsa: 9, backend: 9, frontend: 3, ml: 4, uiux: 2, communication: 6, projects_count: 4, hackathons_count: 4, availability_hours: 24, skills: "Backend, System Design", experience_level: "Advanced" },
  { student_id: 9, name: "Neha Verma", dsa: 3, backend: 2, frontend: 5, ml: 2, uiux: 9, communication: 9, projects_count: 3, hackathons_count: 1, availability_hours: 15, skills: "Design, Figma", experience_level: "Beginner" },
  { student_id: 10, name: "Aarav Mehta", dsa: 5, backend: 4, frontend: 9, ml: 2, uiux: 7, communication: 8, projects_count: 4, hackathons_count: 2, availability_hours: 18, skills: "Frontend, React", experience_level: "Intermediate" }
];

const API_BASE = "https://teammatch-ai-3luy.onrender.com/api";

const getAvatar = (name, size = 40) => {
  const initial = name ? name.trim().charAt(0).toUpperCase() : '?';
  const colors = [
    { bg: '#eff6ff', text: '#3b82f6' },
    { bg: '#ecfdf5', text: '#10b981' },
    { bg: '#faf5ff', text: '#a855f7' },
    { bg: '#fffbeb', text: '#f59e0b' },
    { bg: '#fdf2f8', text: '#ec4899' },
  ];
  const charCodeSum = name ? name.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0) : 0;
  const color = colors[charCodeSum % colors.length];
  
  return (
    <div style={{
      width: `${size}px`,
      height: `${size}px`,
      borderRadius: '50%',
      backgroundColor: color.bg,
      color: color.text,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontWeight: '700',
      fontSize: `${size * 0.4}px`,
      flexShrink: 0,
      userSelect: 'none'
    }}>
      {initial}
    </div>
  );
};

const ConnectionIllustration = () => (
  <svg width="100" height="50" viewBox="0 0 100 50" style={{ flexShrink: 0 }}>
    <line x1="20" y1="25" x2="50" y2="12" stroke="#e2e8f0" strokeWidth="1.5" />
    <line x1="20" y1="25" x2="50" y2="38" stroke="#e2e8f0" strokeWidth="1.5" />
    <line x1="50" y1="12" x2="80" y2="25" stroke="#e2e8f0" strokeWidth="1.5" />
    <line x1="50" y1="38" x2="80" y2="25" stroke="#e2e8f0" strokeWidth="1.5" />
    <line x1="50" y1="12" x2="50" y2="38" stroke="#e2e8f0" strokeWidth="1.5" strokeDasharray="3,3" />
    <circle cx="20" cy="25" r="5" fill="#4f46e5" />
    <circle cx="50" cy="12" r="5" fill="#0d9488" />
    <circle cx="50" cy="38" r="5" fill="#f59e0b" />
    <circle cx="80" cy="25" r="5" fill="#ec4899" />
  </svg>
);

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [students, setStudents] = useState(INITIAL_STUDENTS);
  const [teams, setTeams] = useState([]);
  const [backendActive, setBackendActive] = useState(false);
  const [currentUser, setCurrentUser] = useState(null); // Active Session user

  // Check LocalStorage for cache user session
  useEffect(() => {
    const savedUser = localStorage.getItem('teammatch_user');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
  }, []);

  // Sync Students & Teams from API
  const refreshData = () => {
    fetch(`${API_BASE}/students`)
      .then(res => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then(data => {
        setStudents(data);
        setBackendActive(true);
        // Sync the current user values from localStorage dynamically to prevent race conditions
        const activeUserStr = localStorage.getItem('teammatch_user');
        if (activeUserStr) {
          const activeUser = JSON.parse(activeUserStr);
          const updatedSelf = data.find(s => s.student_id === activeUser.student_id);
          if (updatedSelf) {
            setCurrentUser(updatedSelf);
            localStorage.setItem('teammatch_user', JSON.stringify(updatedSelf));
          }
        }
      })
      .catch(() => {
        const saved = localStorage.getItem('teammatch_students');
        if (saved) setStudents(JSON.parse(saved));
        setBackendActive(false);
      });

    fetch(`${API_BASE}/teams`)
      .then(res => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then(data => {
        const parsedTeams = data.map(team => ({
          ...team,
          members: typeof team.members === 'string' ? team.members.split(',').map(Number) : team.members
        }));
        setTeams(parsedTeams);
      })
      .catch(() => {
        const saved = localStorage.getItem('teammatch_teams');
        if (saved) setTeams(JSON.parse(saved));
      });
  };

  useEffect(() => {
    refreshData();
  }, [activeTab, currentUser]);

  const handleUpdateProfile = (updatedStudent) => {
    fetch(`${API_BASE}/students/update`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedStudent)
    })
    .then(res => {
      if (!res.ok) throw new Error();
      refreshData();
    })
    .catch(() => {
      const updated = students.map(s => s.student_id === updatedStudent.student_id ? updatedStudent : s);
      setStudents(updated);
      localStorage.setItem('teammatch_students', JSON.stringify(updated));
    });
  };

  const handleSaveTeam = (teamName, memberIds, description, healthScore) => {
    fetch(`${API_BASE}/teams`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        team_name: teamName,
        members: memberIds,
        description,
        health_score: healthScore
      })
    })
    .then(res => {
      if (!res.ok) throw new Error();
      return fetch(`${API_BASE}/teams`);
    })
    .then(res => res.json())
    .then(data => {
      const parsedTeams = data.map(team => ({
        ...team,
        members: typeof team.members === 'string' ? team.members.split(',').map(Number) : team.members
      }));
      setTeams(parsedTeams);
    })
    .catch(() => {
      const nextId = teams.length > 0 ? Math.max(...teams.map(t => t.team_id)) + 1 : 1;
      const newTeam = {
        team_id: nextId,
        team_name: teamName,
        members: memberIds,
        description,
        health_score: healthScore,
        created_at: new Date().toLocaleDateString()
      };
      const updated = [...teams, newTeam];
      setTeams(updated);
      localStorage.setItem('teammatch_teams', JSON.stringify(updated));
    });
  };

  const handleDeleteTeam = (teamId) => {
    fetch(`${API_BASE}/teams/${teamId}`, { method: 'DELETE' })
      .then(res => {
        if (!res.ok) throw new Error();
        return fetch(`${API_BASE}/teams`);
      })
      .then(res => res.json())
      .then(data => {
        const parsedTeams = data.map(team => ({
          ...team,
          members: typeof team.members === 'string' ? team.members.split(',').map(Number) : team.members
        }));
        setTeams(parsedTeams);
      })
      .catch(() => {
        const updated = teams.filter(t => t.team_id !== teamId);
        setTeams(updated);
        localStorage.setItem('teammatch_teams', JSON.stringify(updated));
      });
  };

  // Switch to login if user not authenticated
  if (!currentUser) {
    return (
      <AuthScreen 
        onAuthSuccess={(user) => {
          setCurrentUser(user);
          localStorage.setItem('teammatch_user', JSON.stringify(user));
        }} 
      />
    );
  }

  return (
    <div className="app-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="logo-section">
          <span style={{ fontSize: '1.25rem' }}>🤝</span>
          <h2>TeamMatch AI</h2>
        </div>
        <nav style={{ marginTop: '1rem' }}>
          <ul className="nav-links">
            <li>
              <button 
                className={`nav-button ${activeTab === 'dashboard' ? 'active' : ''}`}
                onClick={() => setActiveTab('dashboard')}
              >
                <LayoutDashboard size={16} />
                Dashboard
              </button>
            </li>
            <li>
              <button 
                className={`nav-button ${activeTab === 'directory' ? 'active' : ''}`}
                onClick={() => setActiveTab('directory')}
              >
                <Users size={16} />
                Directory
              </button>
            </li>
            <li>
              <button 
                className={`nav-button ${activeTab === 'profile' ? 'active' : ''}`}
                onClick={() => setActiveTab('profile')}
              >
                <UserPlus size={16} />
                My Profile
              </button>
            </li>
            <li>
              <button 
                className={`nav-button ${activeTab === 'matcher' ? 'active' : ''}`}
                onClick={() => setActiveTab('matcher')}
              >
                <Sparkles size={16} />
                Matcher
              </button>
            </li>
            <li>
              <button 
                className={`nav-button ${activeTab === 'analyzer' ? 'active' : ''}`}
                onClick={() => setActiveTab('analyzer')}
              >
                <ShieldCheck size={16} />
                Team Builder
              </button>
            </li>
            
            <li style={{ marginTop: '2rem' }}>
              <button 
                className="nav-button"
                onClick={() => {
                  setCurrentUser(null);
                  localStorage.removeItem('teammatch_user');
                  setActiveTab('dashboard');
                }}
                style={{ color: 'var(--error)' }}
              >
                <X size={16} />
                Logout
              </button>
            </li>
          </ul>
        </nav>
        
        {/* Logged in User Indicator */}
        <div style={{ marginTop: 'auto', borderTop: '1px solid var(--border-light)', paddingTop: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
            {getAvatar(currentUser.name, 32)}
            <div style={{ overflow: 'hidden' }}>
              <div style={{ fontWeight: 'bold', fontSize: '0.8rem', color: 'var(--text-main)', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>{currentUser.name}</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{currentUser.email}</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: backendActive ? 'var(--secondary)' : 'var(--error)' }}></span>
            {backendActive ? "Python ML Active" : "Local Mode"}
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="main-content">
        {activeTab === 'dashboard' && (
          <DashboardTab students={students} teams={teams} onDeleteTeam={handleDeleteTeam} />
        )}
        {activeTab === 'directory' && (
          <DirectoryTab students={students} />
        )}
        {activeTab === 'profile' && (
          <ProfileTab currentUser={currentUser} onUpdateProfile={handleUpdateProfile} />
        )}
        {activeTab === 'matcher' && (
          <MatcherTab students={students} currentUser={currentUser} />
        )}
        {activeTab === 'analyzer' && (
          <AnalyzerTab students={students} onSaveTeam={handleSaveTeam} />
        )}
      </main>
    </div>
  );
}

// -------------------------------------------------------------
// COMPONENT: AUTHENTICATION SCREEN (LOGIN & REGISTER)
// -------------------------------------------------------------
function AuthScreen({ onAuthSuccess }) {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  // Registration Profile Details
  const [experience, setExperience] = useState('Intermediate');
  const [avail, setAvail] = useState(15);
  const [dsa, setDsa] = useState(5);
  const [backend, setBackend] = useState(5);
  const [frontend, setFrontend] = useState(5);
  const [ml, setMl] = useState(5);
  const [uiux, setUiux] = useState(5);
  const [comm, setComm] = useState(6);
  const [skillsText, setSkillsText] = useState('');

  const handleAuth = (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password.trim()) {
      setError('Please fill in credentials.');
      return;
    }

    if (isRegister && !name.trim()) {
      setError('Name is required for registration.');
      return;
    }

    const endpoint = isRegister ? 'register' : 'login';
    const payload = isRegister ? {
      name: name.trim(),
      email: email.trim(),
      password,
      experience_level: experience,
      availability_hours: parseInt(avail),
      dsa: parseInt(dsa),
      backend: parseInt(backend),
      frontend: parseInt(frontend),
      ml: parseInt(ml),
      uiux: parseInt(uiux),
      communication: parseInt(comm),
      skills: skillsText.trim() || 'Generalist',
      projects_count: 0,
      hackathons_count: 0
    } : {
      email: email.trim(),
      password
    };

    fetch(`${API_BASE}/${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
    .then(async res => {
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.detail || 'Authentication failed.');
      }
      return data;
    })
    .then(data => {
      onAuthSuccess(data.student);
    })
    .catch(err => {
      setError(err.message);
    });
  };

  return (
    <div className="auth-container">
      <div className="auth-card" style={{ maxWidth: isRegister ? '650px' : '400px' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <span style={{ fontSize: '2.5rem' }}>🤝</span>
          <h2 style={{ marginTop: '0.5rem' }}>TeamMatch AI</h2>
          <p style={{ fontSize: '0.85rem' }}>{isRegister ? 'Create profile & set up ML parameters' : 'Sign in to access matcher and builder'}</p>
        </div>

        {error && (
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', backgroundColor: 'rgba(239, 68, 68, 0.05)', color: 'var(--error)', border: '1px solid var(--error)', padding: '10px 14px', borderRadius: '8px', marginBottom: '1.5rem', fontSize: '0.85rem' }}>
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        <form onSubmit={handleAuth}>
          {isRegister && (
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <div style={{ position: 'relative' }}>
                <User size={16} style={{ position: 'absolute', left: '12px', top: '15px', color: 'var(--text-muted)' }} />
                <input type="text" className="form-input" style={{ paddingLeft: '38px' }} placeholder="e.g. Aman Gupta" value={name} onChange={e => setName(e.target.value)} required />
              </div>
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div style={{ position: 'relative' }}>
              <Mail size={16} style={{ position: 'absolute', left: '12px', top: '15px', color: 'var(--text-muted)' }} />
              <input type="email" className="form-input" style={{ paddingLeft: '38px' }} placeholder="e.g. aman@college.edu" value={email} onChange={e => setEmail(e.target.value)} required />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: isRegister ? '1.5rem' : '2rem' }}>
            <label className="form-label">Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={16} style={{ position: 'absolute', left: '12px', top: '15px', color: 'var(--text-muted)' }} />
              <input 
                type={showPassword ? "text" : "password"} 
                className="form-input" 
                style={{ paddingLeft: '38px', paddingRight: '40px' }} 
                placeholder="Minimum 6 characters" 
                value={password} 
                onChange={e => setPassword(e.target.value)} 
                required 
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '15px',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'var(--text-muted)',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {isRegister && (
            <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '1.5rem', marginBottom: '1.5rem' }}>
              <h4 style={{ marginBottom: '1rem', fontSize: '0.95rem' }}>Teammate Matching Questionnaire</h4>
              
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Experience Level</label>
                  <select className="custom-select" value={experience} onChange={e => setExperience(e.target.value)}>
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Weekly Commitment</label>
                  <div className="slider-container" style={{ marginTop: '0.6rem' }}>
                    <input type="range" min="5" max="40" step="5" value={avail} onChange={e => setAvail(e.target.value)} />
                    <span className="slider-val">{avail}h</span>
                  </div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', margin: '1rem 0' }}>
                {Object.keys(SKILL_LABELS).map(key => {
                  const val = key === 'dsa' ? dsa : key === 'backend' ? backend : key === 'frontend' ? frontend : key === 'ml' ? ml : uiux;
                  const setter = key === 'dsa' ? setDsa : key === 'backend' ? setBackend : key === 'frontend' ? setFrontend : key === 'ml' ? setMl : setUiux;
                  return (
                    <div key={key}>
                      <label className="form-label" style={{ fontSize: '0.7rem' }}>{SKILL_LABELS[key]}</label>
                      <div className="slider-container" style={{ height: '30px' }}>
                        <input type="range" min="1" max="10" value={val} onChange={e => setter(e.target.value)} />
                        <span className="slider-val">{val}</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="form-group">
                <label className="form-label">Communication Skill (1 - 10)</label>
                <div className="slider-container">
                  <input type="range" min="1" max="10" value={comm} onChange={e => setComm(e.target.value)} />
                  <span className="slider-val">{comm}</span>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Tech Stack Keywords (comma-separated)</label>
                <input type="text" className="form-input" placeholder="e.g. PyTorch, React, SQL, Node" value={skillsText} onChange={e => setSkillsText(e.target.value)} />
              </div>
            </div>
          )}

          <button type="submit" className="btn-primary" style={{ width: '100%' }}>
            {isRegister ? 'Register and Enter' : 'Sign In'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.85rem' }}>
          <span style={{ color: 'var(--text-muted)' }}>
            {isRegister ? 'Already registered?' : "Don't have a profile yet?"}{' '}
          </span>
          <button 
            onClick={() => {
              setIsRegister(!isRegister);
              setError('');
            }}
            style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: 'bold', cursor: 'pointer', padding: 0 }}
          >
            {isRegister ? 'Login here' : 'Register now'}
          </button>
        </div>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// TAB 1: DASHBOARD
// -------------------------------------------------------------
function DashboardTab({ students, teams, onDeleteTeam }) {
  const totalDevs = students.length;
  const totalTeams = teams.length;
  const avgHours = totalDevs > 0 
    ? Math.round((students.reduce((sum, s) => sum + s.availability_hours, 0) / totalDevs) * 10) / 10 
    : 0;

  const avgSkills = SKILLS.map(s => {
    const avg = totalDevs > 0 ? students.reduce((sum, st) => sum + st[s], 0) / totalDevs : 0;
    return Math.round(avg * 10) / 10;
  });

  const expCounts = students.reduce((acc, s) => {
    acc[s.experience_level] = (acc[s.experience_level] || 0) + 1;
    return acc;
  }, { Advanced: 0, Intermediate: 0, Beginner: 0 });

  return (
    <div>
      <header className="tab-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1>Workspace Overview</h1>
          <p>Form stable project groups by matching technical focus, experience levels, and schedule availability.</p>
        </div>
        <ConnectionIllustration />
      </header>

      <div className="metric-row">
        <div className="metric-card">
          <span className="metric-lbl">Total Developers</span>
          <span className="metric-num">{totalDevs}</span>
        </div>
        <div className="metric-card">
          <span className="metric-lbl">Formed Teams</span>
          <span className="metric-num">{totalTeams}</span>
        </div>
        <div className="metric-card">
          <span className="metric-lbl">Avg commitment</span>
          <span className="metric-num">{avgHours}h/wk</span>
        </div>
      </div>

      <div className="grid-2">
        <div className="organic-card">
          <h3 style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.75rem' }}>
            Average Skill Distribution
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {SKILLS.map((skill, idx) => {
              const val = avgSkills[idx];
              const color = val >= 7.5 ? 'var(--secondary)' : val >= 5.0 ? 'var(--primary)' : 'var(--error)';
              return (
                <div key={skill}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '4px' }}>
                    <span style={{ fontWeight: 500, color: 'var(--text-muted)' }}>{SKILL_LABELS[skill]}</span>
                    <span style={{ fontWeight: 700 }}>{val} / 10</span>
                  </div>
                  <div className="progress-bar-container">
                    <div className="progress-bar-fill" style={{ width: `${val * 10}%`, backgroundColor: color }}></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="organic-card">
          <h3 style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.75rem' }}>
            Experience Level Breakdown
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {['Advanced', 'Intermediate', 'Beginner'].map(level => {
              const count = expCounts[level];
              const pct = totalDevs > 0 ? Math.round((count / totalDevs) * 100) : 0;
              const color = level === 'Advanced' ? 'var(--secondary)' : level === 'Intermediate' ? 'var(--primary)' : 'var(--accent)';
              return (
                <div key={level} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 1.25rem', backgroundColor: 'var(--bg-input)', borderRadius: '8px', border: '1px solid var(--border-light)' }}>
                  <div>
                    <span style={{ fontWeight: 700, color, fontSize: '0.9rem' }}>{level}</span>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--text-main)' }}>{count}</span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}> ({pct}%)</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="organic-card" style={{ marginTop: '1.5rem' }}>
        <h3 style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.75rem' }}>
          Formed Rosters
        </h3>
        {teams.length === 0 ? (
          <p style={{ fontStyle: 'italic', color: 'var(--text-muted)', fontSize: '0.9rem' }}>No saved team rosters. Build one under the Team Builder tab.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {teams.map(team => (
              <div key={team.team_id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.25rem', backgroundColor: 'var(--bg-input)', borderRadius: '8px', border: '1px solid var(--border-light)' }}>
                <div>
                  <h4 style={{ color: 'var(--text-main)', fontSize: '1.1rem', fontWeight: 600 }}>{team.team_name}</h4>
                  <p style={{ fontSize: '0.85rem', margin: '4px 0', color: 'var(--text-muted)' }}>{team.description || "No project description."}</p>
                  <div style={{ display: 'flex', gap: '10px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    <span>Created: <b>{team.created_at}</b></span>
                    <span>Members: <b>{team.members.length}</b></span>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Health Index</div>
                    <div style={{ fontSize: '1.4rem', fontWeight: 700, color: team.health_score >= 80 ? 'var(--secondary)' : team.health_score >= 60 ? 'var(--accent)' : 'var(--error)' }}>
                      {team.health_score}%
                    </div>
                  </div>
                  <button onClick={() => onDeleteTeam(team.team_id)} className="remove-btn" title="Delete Team">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// TAB 2: DIRECTORY / EXPLORE
// -------------------------------------------------------------
function DirectoryTab({ students }) {
  const [search, setSearch] = useState('');
  const [expFilter, setExpFilter] = useState('All');
  const [minHours, setMinHours] = useState(5);

  const filtered = students.filter(s => {
    const query = search.toLowerCase().trim();
    if (!query) {
      const matchesExp = expFilter === 'All' || s.experience_level === expFilter;
      const matchesHours = s.availability_hours >= minHours;
      return matchesExp && matchesHours;
    }

    let matchesSearch = s.name.toLowerCase().includes(query) || 
                         (s.skills && s.skills.toLowerCase().includes(query));

    if (query === 'dsa' || query === 'data structures' || query === 'algorithms' || query === 'problem solving') {
      matchesSearch = matchesSearch || (s.dsa >= 7);
    } else if (query === 'ml' || query === 'ai' || query === 'machine learning' || query === 'artificial intelligence') {
      matchesSearch = matchesSearch || (s.ml >= 7);
    } else if (query === 'frontend' || query === 'front end') {
      matchesSearch = matchesSearch || (s.frontend >= 7);
    } else if (query === 'backend' || query === 'back end') {
      matchesSearch = matchesSearch || (s.backend >= 7);
    } else if (query === 'ui' || query === 'ux' || query === 'uiux' || query === 'ui/ux' || query === 'design') {
      matchesSearch = matchesSearch || (s.uiux >= 7);
    }

    const matchesExp = expFilter === 'All' || s.experience_level === expFilter;
    const matchesHours = s.availability_hours >= minHours;
    return matchesSearch && matchesExp && matchesHours;
  });

  return (
    <div>
      <header className="tab-header">
        <h1>Developer Directory</h1>
        <p>Browse registered developers, review individual skill sets, and verify availability.</p>
      </header>

      <div className="filter-bar">
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '2rem' }}>
          <div>
            <label className="form-label">Search Developers</label>
            <input 
              type="text" 
              className="form-input" 
              placeholder="Search name or skills (e.g. React, Docker)..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <div>
            <label className="form-label">Experience</label>
            <select 
              className="custom-select"
              value={expFilter}
              onChange={e => setExpFilter(e.target.value)}
            >
              <option value="All">All Experience Levels</option>
              <option value="Advanced">Advanced</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Beginner">Beginner</option>
            </select>
          </div>
          <div>
            <label className="form-label">Availability ({minHours}h+)</label>
            <div className="slider-container" style={{ marginTop: '0.8rem' }}>
              <input 
                type="range" 
                min="5" 
                max="40" 
                step="5" 
                value={minHours}
                onChange={e => setMinHours(parseInt(e.target.value))}
              />
              <span className="slider-val">{minHours}h</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid-3">
        {filtered.map(student => {
          const expClass = student.experience_level === 'Advanced' 
            ? 'badge-advanced' 
            : student.experience_level === 'Intermediate' 
              ? 'badge-intermediate' 
              : 'badge-beginner';
          return (
            <div key={student.student_id} className="organic-card">
              <div>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '15px' }}>
                  {getAvatar(student.name, 42)}
                  <div style={{ flexGrow: 1 }}>
                    <h4 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>{student.name}</h4>
                    <span className={`badge ${expClass}`} style={{ marginTop: '4px' }}>{student.experience_level}</span>
                  </div>
                </div>

                <div style={{ color: 'var(--primary)', fontSize: '0.8rem', fontWeight: 700, marginBottom: '1.25rem' }}>
                  {student.skills}
                </div>
                
                <div style={{ display: 'flex', gap: '15px', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
                  <span>Projects: <b>{student.projects_count}</b></span>
                  <span>Hackathons: <b>{student.hackathons_count}</b></span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {SKILLS.map(skill => {
                    const val = student[skill];
                    const color = val >= 7 ? 'var(--secondary)' : val >= 5 ? 'var(--primary)' : 'var(--text-muted)';
                    return (
                      <div key={skill} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ width: '40px', fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 600 }}>{skill.toUpperCase()}</span>
                        <div className="progress-bar-container" style={{ flexGrow: 1, margin: 0, height: '3px' }}>
                          <div className="progress-bar-fill" style={{ width: `${val * 10}%`, backgroundColor: color }}></div>
                        </div>
                        <span style={{ fontSize: '0.7rem', width: '12px', textAlign: 'right', fontWeight: 'bold' }}>{val}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '10px', marginTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem' }}>
                <span style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}><Clock size={12} /> Commitment:</span>
                <span style={{ color: 'var(--primary)', fontWeight: 'bold' }}>{student.availability_hours} hrs/wk</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// TAB 3: MY PROFILE / UPGRADE AND EDIT
// -------------------------------------------------------------
function ProfileTab({ currentUser, onUpdateProfile }) {
  const [name, setName] = useState(currentUser.name || '');
  const [experience, setExperience] = useState(currentUser.experience_level || 'Intermediate');
  const [avail, setAvail] = useState(currentUser.availability_hours || 15);
  const [dsa, setDsa] = useState(currentUser.dsa || 5);
  const [backend, setBackend] = useState(currentUser.backend || 5);
  const [frontend, setFrontend] = useState(currentUser.frontend || 5);
  const [ml, setMl] = useState(currentUser.ml || 5);
  const [uiux, setUiux] = useState(currentUser.uiux || 5);
  const [comm, setComm] = useState(currentUser.communication || 6);
  const [projects, setProjects] = useState(currentUser.projects_count || 0);
  const [hacks, setHacks] = useState(currentUser.hackathons_count || 0);
  const [skillsText, setSkillsText] = useState(currentUser.skills || '');
  const [msg, setMsg] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setMsg({ type: 'error', text: 'Please enter a name.' });
      return;
    }

    const updatedUser = {
      student_id: currentUser.student_id,
      name: name.trim(),
      experience_level: experience,
      availability_hours: parseInt(avail),
      dsa: parseInt(dsa),
      backend: parseInt(backend),
      frontend: parseInt(frontend),
      ml: parseInt(ml),
      uiux: parseInt(uiux),
      communication: parseInt(comm),
      projects_count: parseInt(projects),
      hackathons_count: parseInt(hacks),
      skills: skillsText.trim() || 'Generalist'
    };

    onUpdateProfile(updatedUser);
    setMsg({ type: 'success', text: `Profile details upgraded successfully!` });
    setTimeout(() => setMsg(null), 3000);
  };

  return (
    <div>
      <header className="tab-header">
        <h1>My Profile Upgrades</h1>
        <p>Edit your self-evaluated skill parameters, commitment settings, and technical tags.</p>
      </header>

      {msg && (
        <div style={{ 
          maxWidth: '800px', 
          margin: '0 auto 1.5rem auto', 
          padding: '1rem', 
          borderRadius: '8px',
          border: '1px solid',
          backgroundColor: msg.type === 'success' ? 'rgba(13,148,136,0.05)' : 'rgba(239,68,68,0.05)',
          borderColor: msg.type === 'success' ? 'var(--secondary)' : 'var(--error)',
          color: msg.type === 'success' ? 'var(--secondary)' : 'var(--error)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '0.9rem'
        }}>
          {msg.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
          {msg.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="profile-form">
        <h3 style={{ marginBottom: '2rem', fontWeight: 700, fontSize: '1.35rem' }}>
          Upgrade Profile Metrics
        </h3>

        <div className="form-group">
          <label className="form-label">Full Name</label>
          <input 
            type="text" 
            className="form-input" 
            value={name}
            onChange={e => setName(e.target.value)}
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Experience Level</label>
            <select 
              className="custom-select"
              value={experience}
              onChange={e => setExperience(e.target.value)}
            >
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Weekly availability</label>
            <div className="slider-container" style={{ marginTop: '0.8rem' }}>
              <input 
                type="range" 
                min="5" 
                max="40" 
                step="5"
                value={avail}
                onChange={e => setAvail(e.target.value)}
              />
              <span className="slider-val">{avail}h</span>
            </div>
          </div>
        </div>

        <div className="form-group" style={{ margin: '2rem 0', borderTop: '1px solid var(--border-light)', paddingTop: '2rem' }}>
          <h4 style={{ marginBottom: '1.25rem', fontWeight: 700, fontSize: '1rem', color: 'var(--text-main)' }}>Competency Levels (1 - 10)</h4>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {Object.keys(SKILL_LABELS).map(key => {
              const val = key === 'dsa' ? dsa : key === 'backend' ? backend : key === 'frontend' ? frontend : key === 'ml' ? ml : uiux;
              const setter = key === 'dsa' ? setDsa : key === 'backend' ? setBackend : key === 'frontend' ? setFrontend : key === 'ml' ? setMl : setUiux;
              return (
                <div key={key}>
                  <label className="form-label" style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{SKILL_LABELS[key]}</label>
                  <div className="slider-container">
                    <input 
                      type="range" 
                      min="1" 
                      max="10" 
                      value={val}
                      onChange={e => setter(e.target.value)}
                    />
                    <span className="slider-val">{val}</span>
                  </div>
                </div>
              );
            })}

            <div>
              <label className="form-label" style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Communication Skill</label>
              <div className="slider-container">
                <input 
                  type="range" 
                  min="1" 
                  max="10" 
                  value={comm}
                  onChange={e => setComm(e.target.value)}
                />
                <span className="slider-val">{comm}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="form-row" style={{ borderTop: '1px solid var(--border-light)', paddingTop: '2rem' }}>
          <div className="form-group">
            <label className="form-label">Projects Completed</label>
            <input 
              type="number" 
              className="form-input" 
              min="0"
              value={projects}
              onChange={e => setProjects(parseInt(e.target.value) || 0)}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Hackathons Completed</label>
            <input 
              type="number" 
              className="form-input" 
              min="0"
              value={hacks}
              onChange={e => setHacks(parseInt(e.target.value) || 0)}
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Skill Focus / Specific Domains (e.g. Next.js, PyTorch, Figma)</label>
          <input 
            type="text" 
            className="form-input" 
            placeholder="e.g. Next.js, PyTorch, Figma"
            value={skillsText}
            onChange={e => setSkillsText(e.target.value)}
          />
        </div>

        <button type="submit" className="btn-primary" style={{ marginTop: '1rem' }}>Upgrade Profile</button>
      </form>
    </div>
  );
}

// -------------------------------------------------------------
// TAB 4: MATCHER
// -------------------------------------------------------------
function MatcherTab({ students, currentUser }) {
  const [selectedUser, setSelectedUser] = useState(currentUser?.student_id?.toString() || students[0]?.student_id?.toString() || '');
  const [selectedPartner, setSelectedPartner] = useState('');
  const [recs, setRecs] = useState([]);

  const targetStudent = students.find(s => s.student_id === parseInt(selectedUser));

  useEffect(() => {
    if (selectedUser) {
      fetch(`${API_BASE}/recommend`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ student_id: parseInt(selectedUser), top_n: 5 })
      })
      .then(res => res.json())
      .then(data => {
        setRecs(data);
        if (data.length > 0) setSelectedPartner(data[0].student.student_id.toString());
      })
      .catch(() => {
        const fallback = localStudentRecs(parseInt(selectedUser), students, 5);
        setRecs(fallback.map(f => ({ student: f.student, compatibility_score: f.compatibilityScore })));
        if (fallback.length > 0) setSelectedPartner(fallback[0].student.student_id.toString());
      });
    }
  }, [selectedUser, students]);

  const partnerStudent = students.find(s => s.student_id === parseInt(selectedPartner));
  const activeMatch = recs.find(r => r.student.student_id === parseInt(selectedPartner));

  const renderRadarChart = (user, partner) => {
    if (!user) return null;
    const width = 300;
    const height = 300;
    const cx = width / 2;
    const cy = height / 2;
    const r = 90;

    const angles = SKILLS.map((_, i) => (i * 2 * Math.PI) / 5 - Math.PI / 2);

    const rings = [2, 4, 6, 8, 10].map(v => {
      const pts = angles.map(a => {
        const x = cx + Math.cos(a) * (v / 10) * r;
        const y = cy + Math.sin(a) * (v / 10) * r;
        return `${x},${y}`;
      }).join(' ');
      return pts;
    });

    const labelDistance = 1.25;
    const labels = angles.map((a, i) => {
      const x = cx + Math.cos(a) * r * labelDistance;
      const y = cy + Math.sin(a) * r * labelDistance;
      return { x, y, text: SKILLS[i].toUpperCase() };
    });

    const userPts = angles.map((a, i) => {
      const val = user[SKILLS[i]] || 1;
      const x = cx + Math.cos(a) * (val / 10) * r;
      const y = cy + Math.sin(a) * (val / 10) * r;
      return `${x},${y}`;
    }).join(' ');

    const partnerPts = partner ? angles.map((a, i) => {
      const val = partner[SKILLS[i]] || 1;
      const x = cx + Math.cos(a) * (val / 10) * r;
      const y = cy + Math.sin(a) * (val / 10) * r;
      return `${x},${y}`;
    }).join(' ') : null;

    return (
      <svg width={width} height={height} style={{ overflow: 'visible' }}>
        {rings.map((pts, i) => (
          <polygon 
            key={i} 
            points={pts} 
            fill="none" 
            stroke="var(--border-light)" 
            strokeWidth="1" 
            strokeDasharray={i < 4 ? "3,3" : "0"} 
          />
        ))}

        {angles.map((a, i) => {
          const x = cx + Math.cos(a) * r;
          const y = cy + Math.sin(a) * r;
          return (
            <line 
              key={i} 
              x1={cx} 
              y1={cy} 
              x2={x} 
              y2={y} 
              stroke="var(--border-light)" 
              strokeWidth="1" 
            />
          );
        })}

        {labels.map((l, i) => (
          <text 
            key={i} 
            x={l.x} 
            y={l.y} 
            fill="var(--text-muted)" 
            fontSize="9" 
            fontWeight="bold"
            textAnchor="middle" 
            alignmentBaseline="middle"
          >
            {l.text}
          </text>
        ))}

        <polygon points={userPts} className="radar-polygon-a" />
        {angles.map((a, i) => {
          const val = user[SKILLS[i]] || 1;
          const x = cx + Math.cos(a) * (val / 10) * r;
          const y = cy + Math.sin(a) * (val / 10) * r;
          return <circle key={i} cx={x} cy={y} r="2.5" fill="var(--primary)" />;
        })}

        {partnerPts && (
          <>
            <polygon points={partnerPts} className="radar-polygon-b" />
            {angles.map((a, i) => {
              const val = partner[SKILLS[i]] || 1;
              const x = cx + Math.cos(a) * (val / 10) * r;
              const y = cy + Math.sin(a) * (val / 10) * r;
              return <circle key={i} cx={x} cy={y} r="2.5" fill="var(--secondary)" />;
            })}
          </>
        )}
      </svg>
    );
  };

  return (
    <div>
      <header className="tab-header">
        <h1>Teammate Matcher</h1>
        <p>Analyze compatibility percentages and map skill overlaps between developers.</p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2.5rem' }}>
        <div>
          <label className="form-label">Compare Profile</label>
          <select 
            className="custom-select"
            value={selectedUser}
            onChange={e => {
              setSelectedUser(e.target.value);
              setSelectedPartner('');
            }}
          >
            {students.map(s => <option key={s.student_id} value={s.student_id}>{s.name} {s.student_id === currentUser.student_id ? "(You)" : ""}</option>)}
          </select>
        </div>
      </div>

      {targetStudent && (
        <div className="grid-2">
          <div className="organic-card" style={{ height: 'fit-content' }}>
            <h3 style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.75rem' }}>
              Top Recommendations
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {recs.map(rec => {
                const partner = rec.student;
                const isSelected = selectedPartner === partner.student_id.toString();
                const borderColor = isSelected ? 'var(--border-hover)' : 'var(--border-light)';
                const bg = isSelected ? 'rgba(79,70,229,0.02)' : 'var(--bg-input)';
                
                return (
                  <div 
                    key={partner.student_id}
                    style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center', 
                      padding: '1rem 1.25rem', 
                      backgroundColor: bg, 
                      borderRadius: '8px', 
                      border: `1px solid ${borderColor}`,
                      cursor: 'pointer'
                    }}
                    onClick={() => setSelectedPartner(partner.student_id.toString())}
                  >
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                      {getAvatar(partner.name, 32)}
                      <div>
                        <h4 style={{ color: 'var(--text-main)', fontSize: '0.95rem', fontWeight: 600 }}>{partner.name}</h4>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          {partner.experience_level} | {partner.skills}
                        </p>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--primary)' }}>
                        {rec.compatibility_score}%
                      </span>
                      <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Match</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {partnerStudent && (
            <div className="organic-card">
              <h3 style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>Radar Capability Grid</span>
                <span style={{ color: 'var(--primary)', fontWeight: 'bold' }}>{activeMatch?.compatibility_score}% Match</span>
              </h3>
              
              <div className="radar-svg-container" style={{ margin: '0.5rem 0' }}>
                {renderRadarChart(targetStudent, partnerStudent)}
              </div>

              <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', fontSize: '0.8rem', marginBottom: '1.5rem' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {getAvatar(targetStudent.name, 22)}
                  {targetStudent.name}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {getAvatar(partnerStudent.name, 22)}
                  {partnerStudent.name}
                </span>
              </div>

              <div>
                <h4 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text-main)' }}>
                  Synergy Details
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  {(() => {
                    const uMax = SKILLS.reduce((max, s) => targetStudent[s] > targetStudent[max] ? s : max, SKILLS[0]);
                    const pMax = SKILLS.reduce((max, s) => partnerStudent[s] > partnerStudent[max] ? s : max, SKILLS[0]);
                    if (uMax !== pMax) {
                      return <p>• <b>Complementary roles</b>: {targetStudent.name} focuses primarily on <b>{SKILL_LABELS[uMax]}</b>, while {partnerStudent.name} brings strength in <b>{SKILL_LABELS[pMax]}</b>.</p>;
                    } else {
                      return <p>• <b>Overlapping specializations</b>: Both developers share a primary strength in <b>{SKILL_LABELS[uMax]}</b>. Tasks must be split clearly.</p>;
                    }
                  })()}
                  
                  {/* Shared tech stack overlaps check */}
                  {(() => {
                    const tSkills = targetStudent.skills ? targetStudent.skills.split(',').map(s => s.trim().toLowerCase()) : [];
                    const pSkills = partnerStudent.skills ? partnerStudent.skills.split(',').map(s => s.trim().toLowerCase()) : [];
                    const overlap = tSkills.filter(s => pSkills.includes(s) && s !== 'generalist' && s !== '');
                    if (overlap.length > 0) {
                      const displayOverlap = overlap.map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(', ');
                      return <p>• <b>Shared Tools & Tech Stack</b>: Both developers have experience in: <b>{displayOverlap}</b>.</p>;
                    } else {
                      return <p>• <b>Tool Stack Diversity</b>: No overlapping specific libraries/frameworks listed (comparing <i>"{targetStudent.skills}"</i> and <i>"{partnerStudent.skills}"</i>), which expands your team's technical versatility.</p>;
                    }
                  })()}

                  {Math.abs(targetStudent.availability_hours - partnerStudent.availability_hours) <= 5 ? (
                    <p>• <b>Time commitment alignment</b>: Schedule compatibility is high, with similar target weekly hours.</p>
                  ) : (
                    <p>• <b>Time commitment variance</b>: Commitment level differs. Milestones should be planned around active overlap hours.</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// -------------------------------------------------------------
// TAB 5: TEAM BUILDER
// -------------------------------------------------------------
function AnalyzerTab({ students, onSaveTeam }) {
  const [selectedIds, setSelectedIds] = useState([]);
  const [teamName, setTeamName] = useState('');
  const [desc, setDesc] = useState('');
  const [showRecs, setShowRecs] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null);

  const [health, setHealth] = useState({ health_score: 0, technical_coverage: 0, role_diversity: 0, availability_coordination: 0, communication_strength: 0 });
  const [gaps, setGaps] = useState([]);
  const [candidateRecs, setCandidateRecs] = useState([]);

  const teamMembers = students.filter(s => selectedIds.includes(s.student_id));

  useEffect(() => {
    if (selectedIds.length > 0) {
      fetch(`${API_BASE}/team-health`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ members: teamMembers })
      })
      .then(res => res.json())
      .then(data => {
        setHealth(data.health);
        setGaps(data.gaps);
      })
      .catch(() => {
        const localH = localTeamHealth(teamMembers);
        const localG = localSkillGaps(teamMembers);
        setHealth({
          health_score: localH.healthScore,
          technical_coverage: localH.technicalCoverage,
          role_diversity: localH.roleDiversity,
          availability_coordination: localH.availabilityCoordination,
          communication_strength: localH.communicationStrength
        });
        setGaps(localG.gaps.map(g => ({ skill: g.skill, label: g.label, maxValue: g.maxValue, status: g.status, recommendation: g.recommendation })));
      });
    } else {
      setHealth({ health_score: 0, technical_coverage: 0, role_diversity: 0, availability_coordination: 0, communication_strength: 0 });
      setGaps([]);
    }
    setCandidateRecs([]);
    setShowRecs(false);
  }, [selectedIds, students]);

  const fetchMissingPiece = () => {
    if (selectedIds.length === 0) return;
    
    fetch(`${API_BASE}/team-recommend`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ team_member_ids: selectedIds, top_n: 4 })
    })
    .then(res => res.json())
    .then(data => {
      setCandidateRecs(data);
      setShowRecs(true);
    })
    .catch(() => {
      const localR = localTeamRecs(selectedIds, students, 4);
      setCandidateRecs(localR.map(l => ({
        student: l.student,
        new_health_score: l.newHealthScore,
        health_gain: l.healthGain
      })));
      setShowRecs(true);
    });
  };

  const handleAddMember = (id) => {
    if (selectedIds.length >= 4) {
      alert("Teams are capped at 4 members.");
      return;
    }
    if (!selectedIds.includes(id)) {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleRemoveMember = (id) => {
    setSelectedIds(selectedIds.filter(mid => mid !== id));
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!teamName.trim()) {
      alert("Please enter a team name.");
      return;
    }
    onSaveTeam(teamName, selectedIds, desc, health.health_score);
    setSaveStatus(`Team "${teamName}" saved successfully.`);
    setTeamName('');
    setDesc('');
    setSelectedIds([]);
    setTimeout(() => setSaveStatus(null), 3000);
  };

  const renderHealthGauge = (score) => {
    const r = 65;
    const circ = 2 * Math.PI * r;
    const offset = circ - (score / 100) * circ;
    const color = score >= 80 ? 'var(--secondary)' : score >= 60 ? 'var(--primary)' : 'var(--error)';

    return (
      <div className="circular-gauge-container">
        <svg width="150" height="150" style={{ transform: 'rotate(-90deg)' }}>
          <circle cx="75" cy="75" r={r} fill="none" stroke="var(--bg-input)" strokeWidth="8" />
          <circle cx="75" cy="75" r={r} fill="none" stroke={color} strokeWidth="8" strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round" style={{ transition: 'stroke-dashoffset 0.35s ease' }} />
        </svg>
        <span className="gauge-value">{score}%</span>
      </div>
    );
  };

  return (
    <div>
      <header className="tab-header">
        <h1>Team Builder</h1>
        <p>Draft your roster, review combined skill coverage, and identify deficit areas.</p>
      </header>

      {saveStatus && (
        <div style={{ padding: '1rem', backgroundColor: '#ecfdf5', border: '1px solid var(--secondary)', color: 'var(--secondary)', borderRadius: '8px', marginBottom: '1.5rem', fontSize: '0.9rem', fontWeight: 600 }}>
          {saveStatus}
        </div>
      )}

      <div className="grid-2" style={{ alignItems: 'start' }}>
        <div className="organic-card">
          <h3 style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.75rem' }}>
            Draft Roster
          </h3>

          <div style={{ marginBottom: '1.5rem' }}>
            <label className="form-label">Add Candidate</label>
            <select 
              className="custom-select"
              value=""
              onChange={e => {
                if (e.target.value) handleAddMember(parseInt(e.target.value));
              }}
            >
              <option value="">-- Choose Candidate --</option>
              {students
                .filter(s => !selectedIds.includes(s.student_id))
                .map(s => <option key={s.student_id} value={s.student_id}>{s.name} ({s.experience_level})</option>)
              }
            </select>
          </div>

          <div className="team-builder-slots">
            {teamMembers.length === 0 ? (
              <p style={{ fontStyle: 'italic', color: 'var(--text-muted)', fontSize: '0.85rem' }}>Draft is currently empty.</p>
            ) : (
              teamMembers.map(m => (
                <div key={m.student_id} className="team-slot" style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  {getAvatar(m.name, 30)}
                  <div style={{ flexGrow: 1 }}>
                    <span style={{ fontWeight: 600, color: 'var(--text-main)', fontSize: '0.9rem' }}>{m.name}</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginLeft: '10px' }}>({m.experience_level})</span>
                  </div>
                  <button onClick={() => handleRemoveMember(m.student_id)} className="remove-btn">
                    <X size={14} />
                  </button>
                </div>
              ))
            )}
          </div>

          {teamMembers.length > 0 && (
            <form onSubmit={handleSave} style={{ borderTop: '1px solid var(--border-light)', paddingTop: '1.5rem' }}>
              <div className="form-group">
                <input type="text" className="form-input" placeholder="Team Name" value={teamName} onChange={e => setTeamName(e.target.value)} required />
              </div>
              <div className="form-group">
                <textarea className="form-input" placeholder="Project Pitch" rows="2" value={desc} onChange={e => setDesc(e.target.value)} />
              </div>
              <button type="submit" className="btn-primary">Save Roster</button>
            </form>
          )}
        </div>

        {teamMembers.length > 0 && (
          <div className="organic-card" style={{ textAlign: 'center' }}>
            <h3 style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.75rem', textAlign: 'left' }}>
              Readiness Score
            </h3>
            
            {renderHealthGauge(health.health_score)}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', textAlign: 'left', marginTop: '1.5rem' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '3px' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Technical Coverage</span>
                  <span style={{ fontWeight: 600 }}>{health.technical_coverage}%</span>
                </div>
                <div className="progress-bar-container"><div className="progress-bar-fill" style={{ width: `${health.technical_coverage}%`, backgroundColor: 'var(--secondary)' }}></div></div>
              </div>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '3px' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Role Diversity</span>
                  <span style={{ fontWeight: 600 }}>{health.role_diversity}%</span>
                </div>
                <div className="progress-bar-container"><div className="progress-bar-fill" style={{ width: `${health.role_diversity}%`, backgroundColor: 'var(--primary)' }}></div></div>
              </div>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '3px' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Availability Sync</span>
                  <span style={{ fontWeight: 600 }}>{health.availability_coordination}%</span>
                </div>
                <div className="progress-bar-container"><div className="progress-bar-fill" style={{ width: `${health.availability_coordination}%`, backgroundColor: 'var(--accent)' }}></div></div>
              </div>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '3px' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Communication</span>
                  <span style={{ fontWeight: 600 }}>{health.communication_strength}%</span>
                </div>
                <div className="progress-bar-container"><div className="progress-bar-fill" style={{ width: `${health.communication_strength}%`, backgroundColor: 'var(--primary)' }}></div></div>
              </div>
            </div>
          </div>
        )}
      </div>

      {teamMembers.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2.5rem', marginTop: '1.5rem' }}>
          <div className="organic-card">
            <h3 style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.75rem' }}>
              Deficit Alarms
            </h3>
            {gaps.length === 0 ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--secondary)', fontSize: '0.9rem' }}>
                <CheckCircle2 size={16} />
                <span style={{ fontWeight: 600 }}>Perfect Coverage! No major skill deficits flagged.</span>
              </div>
            ) : (
              <div>
                {gaps.map(gap => (
                  <div key={gap.skill} className={gap.status === 'Critical' ? 'gap-alert' : 'gap-warning'}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600, fontSize: '0.9rem', marginBottom: '4px' }}>
                      <span>{gap.label} deficit</span>
                      <span style={{ fontSize: '0.7rem' }}>{gap.status.toUpperCase()}</span>
                    </div>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{gap.recommendation}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="organic-card">
            <h3 style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>Recruit Suggestions</span>
              <button 
                className="btn-primary" 
                style={{ padding: '0.4rem 1rem', fontSize: '0.75rem' }}
                onClick={showRecs ? () => setShowRecs(false) : fetchMissingPiece}
              >
                {showRecs ? "Hide Options" : "Find Recruits"}
              </button>
            </h3>

            {showRecs && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {candidateRecs.map(rec => (
                  <div key={rec.student.student_id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', backgroundColor: 'var(--bg-input)', borderRadius: '8px', border: '1px solid var(--border-light)' }}>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                      {getAvatar(rec.student.name, 32)}
                      <div>
                        <h4 style={{ fontSize: '0.95rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600 }}>
                          {rec.student.name}
                          <span style={{ fontSize: '0.65rem', padding: '1px 5px', borderRadius: '3px', backgroundColor: '#ecfdf5', color: '#047857', border: '1px solid #d1fae5' }}>
                            +{rec.health_gain}%
                          </span>
                        </h4>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{rec.student.skills}</p>
                      </div>
                    </div>
                    <button onClick={() => handleAddMember(rec.student.student_id)} className="btn-primary" style={{ padding: '0.3rem 0.65rem', fontSize: '0.7rem' }}>
                      Draft
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
