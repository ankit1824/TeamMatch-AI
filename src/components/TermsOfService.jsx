import React from "react";
import { FileText, ShieldAlert } from "lucide-react";

const TermsOfService = () => {
  return (
    <div className="max-w-4xl mx-auto bg-white rounded-2xl border border-slate-100 shadow-[0_4px_20px_rgb(0,0,0,0.02)] overflow-hidden">
      <div className="p-6 md:p-8 border-b border-slate-100 bg-slate-50/50 flex items-center gap-3">
        <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
          <FileText size={24} />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-900">Terms of Service</h2>
          <p className="text-xs text-slate-500">Last updated: June 17, 2026</p>
        </div>
      </div>

      <div className="p-6 md:p-8 space-y-6 text-sm text-slate-600 leading-relaxed">
        <section className="space-y-2">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full" /> 1. Acceptance of Terms
          </h3>
          <p>
            By accessing and using TeamMatch AI, you agree to comply with and be bound by these Terms of Service. If you do not agree, please do not use the platform.
          </p>
        </section>

        <section className="space-y-2">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full" /> 2. User Accounts & Verification
          </h3>
          <p>
            You must provide accurate profile credentials, including skills, project interests, and contact information. TeamMatch AI uses these parameters to feed the KNN matchmaker models. You are responsible for maintaining the security of your account credentials.
          </p>
        </section>

        <section className="space-y-2">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full" /> 3. Community Guidelines & Messaging
          </h3>
          <p>
            Users are expected to communicate respectfully in the platform chat. Spamming, harassment, and sharing malicious content will result in immediate termination of account access.
          </p>
          <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 text-xs text-amber-700 space-y-1 mt-2">
            <p className="font-bold flex items-center gap-1.5"><ShieldAlert size={14} /> Critical Reminder:</p>
            <p>TeamMatch AI is for professional and project hackathon matchmaking. Plagiarism of other teams' code repositories or sharing of unapproved credentials violates hackathon rules.</p>
          </div>
        </section>

        <section className="space-y-2">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full" /> 4. AI & Recommendation Models Disclaimer
          </h3>
          <p>
            TeamMatch AI employs machine learning models (KNN Cosine Similarity and K-Means Clustering) to predict teammate compatibility and group health scores. These matches are suggestions and do not guarantee tournament placement or hackathon victory.
          </p>
        </section>

        <section className="space-y-2">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full" /> 5. Modifications to Service
          </h3>
          <p>
            We reserve the right to modify or discontinue TeamMatch AI (or any part thereof) with or without notice at any time.
          </p>
        </section>
      </div>
    </div>
  );
};

export default TermsOfService;
