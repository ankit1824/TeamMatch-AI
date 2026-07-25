import React from "react";
import { Mail, ExternalLink, HelpCircle } from "lucide-react";
import { motion } from "motion/react";

const HelpCenter = () => {
  const faqs = [
    {
      question: "How does the AI matching work?",
      answer: "Our AI analyzes your profile data (skills, interests, experience) and compares it with other hackers to find the most compatible teammates based on complementary skills."
    },
    {
      question: "Is TeamMatch AI free to use?",
      answer: "Yes! TeamMatch AI is free for all hackers participating in hackathons. Our goal is to foster collaboration and help you build amazing projects."
    },
    {
      question: "How do I start a conversation?",
      answer: "Once you find a potential teammate in the 'Find Teammates' tab, click the 'Message' button to start a real-time chat with them."
    }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-12">
      <div className="text-center space-y-4">
        <div className="inline-flex p-3 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-2xl mb-2 shadow-md">
          <HelpCircle size={32} />
        </div>
        <h1 className="text-4xl font-extrabold text-white">Help Center</h1>
        <p className="text-slate-400 max-w-2xl mx-auto text-sm font-medium">
          Everything you need to know about using TeamMatch AI. Can't find what you're looking for? Reach out to our support team.
        </p>
      </div>

      <div className="flex justify-center">
        <div className="bg-white/5 border border-white/10 p-6 rounded-2xl shadow-lg max-w-md w-full backdrop-blur-md">
          <div className="w-10 h-10 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-xl flex items-center justify-center mb-4">
            <Mail size={18} />
          </div>
          <h3 className="font-bold text-white mb-2">Email Support</h3>
          <p className="text-sm text-slate-400 mb-4 font-medium">Get help via email for more complex issues.</p>
          <a 
            href="mailto:shatakshitiwari021@gmail.com" 
            className="text-indigo-400 font-extrabold text-sm flex items-center hover:text-indigo-300 transition-colors"
          >
            shatakshitiwari021@gmail.com
            <ExternalLink size={13} className="ml-1" />
          </a>
        </div>
      </div>

      <div className="bg-white/5 rounded-3xl p-8 border border-white/10 shadow-lg backdrop-blur-md">
        <h2 className="text-2xl font-bold text-white mb-8">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl"
            >
              <h4 className="font-bold text-slate-200 mb-2 text-sm">{faq.question}</h4>
              <p className="text-slate-400 text-xs leading-relaxed font-medium">{faq.answer}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HelpCenter;
