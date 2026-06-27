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
        <div className="inline-flex p-3 bg-indigo-100 text-indigo-600 rounded-2xl mb-2">
          <HelpCircle size={32} />
        </div>
        <h1 className="text-4xl font-bold text-gray-900">Help Center</h1>
        <p className="text-gray-500 max-w-2xl mx-auto">
          Everything you need to know about using TeamMatch AI. Can't find what you're looking for? Reach out to our support team.
        </p>
      </div>

      <div className="flex justify-center">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow max-w-md w-full">
          <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-4">
            <Mail size={20} />
          </div>
          <h3 className="font-bold text-gray-900 mb-2">Email Support</h3>
          <p className="text-sm text-gray-500 mb-4">Get help via email for more complex issues.</p>
          <a 
            href="mailto:shatakshitiwari021@gmail.com" 
            className="text-indigo-600 font-bold text-sm flex items-center hover:underline"
          >
            shatakshitiwari021@gmail.com
            <ExternalLink size={14} className="ml-1" />
          </a>
        </div>
      </div>

      <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">Frequently Asked Questions</h2>
        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-6 bg-gray-50 rounded-2xl"
            >
              <h4 className="font-bold text-gray-900 mb-2">{faq.question}</h4>
              <p className="text-gray-600 text-sm leading-relaxed">{faq.answer}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HelpCenter;
