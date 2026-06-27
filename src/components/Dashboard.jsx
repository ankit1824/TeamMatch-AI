import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import ProfileForm from "./ProfileForm";
import FindTeammates from "./FindTeammates";
import Home from "./Home";
import Footer from "./Footer";
import HelpCenter from "./HelpCenter";
import UpcomingHackathons from "./UpcomingHackathons";
import SuccessStories from "./SuccessStories";
import TermsOfService from "./TermsOfService";
import PrivacyPolicy from "./PlatformPolicy";
import { motion, AnimatePresence } from "motion/react";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [searchInterests, setSearchInterests] = useState("");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [activeTab]);

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <Home setActiveTab={setActiveTab} />;
      case "profile":
        return <ProfileForm onSaveSuccess={() => setActiveTab("dashboard")} />;
      case "find-teammates":
        return <FindTeammates suggestedOnly={false} initialInterests={searchInterests} />;
      case "help":
        return <HelpCenter />;
      case "hackathons":
        return <UpcomingHackathons setActiveTab={setActiveTab} setSearchInterests={setSearchInterests} />;
      case "success-stories":
        return <SuccessStories />;
      case "terms":
        return <TermsOfService />;
      case "privacy":
        return <PrivacyPolicy />;
      default:
        return <Home setActiveTab={setActiveTab} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </main>

      <Footer setActiveTab={setActiveTab} />
    </div>
  );
};

export default Dashboard;
