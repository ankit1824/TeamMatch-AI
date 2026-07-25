import React from "react";
import LandingHeader from "./LandingHeader";
import LandingHero from "./LandingHero";
import LandingHowItWorks from "./LandingHowItWorks";
import LandingFeatures from "./LandingFeatures";
import LandingFooter from "./LandingFooter";

export default function LandingPage({ onSignIn, onSignUp }) {
  return (
    <div className="min-h-screen font-sans bg-gradient-to-b from-[#030712] via-[#090d1a] to-[#020617] text-slate-100 overflow-hidden">
      <LandingHeader onSignIn={onSignIn} onSignUp={onSignUp} />
      <main>
        <LandingHero onGetStarted={onSignUp} />
        <LandingHowItWorks onJoinNow={onSignUp} />
        <LandingFeatures />
      </main>
      <LandingFooter />
    </div>
  );
}
