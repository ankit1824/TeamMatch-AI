import React from "react";
import { Shield } from "lucide-react";

const PrivacyPolicy = () => {
  return (
    <div className="max-w-4xl mx-auto bg-white rounded-2xl border border-slate-100 shadow-[0_4px_20px_rgb(0,0,0,0.02)] overflow-hidden">
      <div className="p-6 md:p-8 border-b border-slate-100 bg-slate-50/50 flex items-center gap-3">
        <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
          <Shield size={24} />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-900">Privacy Policy</h2>
          <p className="text-xs text-slate-500">Last updated: June 17, 2026</p>
        </div>
      </div>

      <div className="p-6 md:p-8 space-y-6 text-sm text-slate-600 leading-relaxed">
        <section className="space-y-2">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full" /> 1. Information We Collect
          </h3>
          <p>
            We collect information you provide directly during registration and profile creation:
          </p>
          <ul className="list-disc list-inside pl-4 space-y-1 text-xs text-slate-500">
            <li>Account data (Name, Email, Password Hash).</li>
            <li>Profile particulars (DSA, backend, frontend, ML, UI/UX skill grades).</li>
            <li>Social portfolio links (GitHub, LinkedIn).</li>
            <li>Chat logs and messaging history sent between match candidates.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full" /> 2. How We Use Your Data
          </h3>
          <p>
            Your information is processed to compute teammate suggestions:
          </p>
          <ul className="list-disc list-inside pl-4 space-y-1 text-xs text-slate-500">
            <li>To compile matching score vectors using KNN (K-Nearest Neighbors).</li>
            <li>To group developers into diversity clusters using K-Means.</li>
            <li>To display candidate profiles on the teammate matcher feed.</li>
            <li>To deliver local chat messages securely.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full" /> 3. Data Protection
          </h3>
          <p>
            We implement basic local security practices, including password hashing (SHA-256) in the SQLite database layer. Because TeamMatch AI runs locally, you maintain control of the database file.
          </p>
        </section>

        <section className="space-y-2">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full" /> 4. Sharing of Information
          </h3>
          <p>
            We do not sell, rent, or trade your personal data. Your name, college name, skills, and portfolio links are visible to logged-in users on the Platform matching feed.
          </p>
        </section>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
