import React, { useState } from "react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import AuthForm from "./components/AuthForm";
import Dashboard from "./components/Dashboard";
import LandingPage from "./components/landing/LandingPage";

const AppContent = () => {
  const { isAuthenticated } = useAuth();
  const [showAuth, setShowAuth] = useState(false);

  if (isAuthenticated) {
    return (
      <div className="min-h-screen font-sans bg-[#030712] text-slate-100">
        <Dashboard />
      </div>
    );
  }

  if (showAuth) {
    return (
      <div className="min-h-screen font-sans relative bg-[#030712]">
        <div className="absolute top-4 left-4 z-50">
          <button 
            onClick={() => setShowAuth(false)} 
            className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 backdrop-blur-md border border-white/10 shadow-lg text-sm font-bold text-slate-300 hover:text-white transition-all cursor-pointer"
          >
            ← Back to Home
          </button>
        </div>
        <AuthForm />
      </div>
    );
  }

  return <LandingPage onSignIn={() => setShowAuth(true)} onSignUp={() => setShowAuth(true)} />;
};

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
