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
      <div className="min-h-screen font-sans bg-gray-50">
        <Dashboard />
      </div>
    );
  }

  if (showAuth) {
    return (
      <div className="min-h-screen font-sans relative">
        <div className="absolute top-4 left-4 z-50">
          <button 
            onClick={() => setShowAuth(false)} 
            className="px-4 py-2 rounded-lg bg-white/80 backdrop-blur-sm border shadow-sm text-sm font-medium text-slate-600 hover:text-blue-600 hover:bg-white transition-all"
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