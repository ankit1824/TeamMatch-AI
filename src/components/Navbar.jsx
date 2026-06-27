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
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <span className="text-xl font-bold text-indigo-600">TeamMatch AI</span>
          </div>
          
          <div className="hidden md:flex space-x-8">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === item.id
                    ? "text-indigo-600 bg-indigo-50"
                    : "text-gray-500 hover:text-indigo-600 hover:bg-gray-50"
                }`}
              >
                <item.icon size={18} />
                <span>{item.label}</span>
              </button>
            ))}
          </div>

          <div className="flex items-center">
            <button
              onClick={logout}
              className="flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut size={18} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
