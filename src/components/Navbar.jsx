import React from "react";
import { useAuth } from "../context/AuthContext";
import { LogOut, User, Search, LayoutDashboard, HelpCircle, Calendar } from "lucide-react";

const Navbar = ({ activeTab, setActiveTab }) => {
  const logout = useAuth().logout;

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "profile", label: "Profile", icon: User },
    { id: "find-teammates", label: "Find Teammates", icon: Search },
    { id: "hackathons", label: "Upcoming Hackathons", icon: Calendar },
    { id: "help", label: "Help", icon: HelpCircle },
  ];

  return (
    <nav className="bg-[#030712]/40 backdrop-blur-lg border-b border-white/5 sticky top-0 z-50 shadow-lg shadow-black/15">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <span className="text-xl font-extrabold bg-gradient-to-r from-white to-slate-200 bg-clip-text text-transparent">
              TeamMatch <span className="text-indigo-400 font-medium">AI</span>
            </span>
          </div>
          
          <div className="hidden md:flex space-x-4">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-bold transition-all duration-300 cursor-pointer ${
                  activeTab === item.id
                    ? "text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 shadow-inner"
                    : "text-slate-450 hover:text-white hover:bg-white/5 border border-transparent"
                }`}
              >
                <item.icon size={16} />
                <span>{item.label}</span>
              </button>
            ))}
          </div>

          <div className="flex items-center">
            <button
              onClick={logout}
              className="flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-bold text-red-400 hover:text-red-300 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-all cursor-pointer"
            >
              <LogOut size={16} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
