import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HelpCircle, CheckCircle2, ChevronDown } from "lucide-react";

const FAQSection = () => {
  const [openFAQ, setOpenFAQ] = useState(null);

  const faqs = [
    {
      q: "Is the exam environment secure?",
      a: "Yes. Our anti-cheat engine blocks tab switching, prevents copy-pasting, and issues automatic warnings to ensure complete academic integrity.",
    },
    {
      q: "Can I take exams on mobile?",
      a: "Yes, the entire platform is fully responsive. You can take assessments on any device, anywhere.",
    },
    {
      q: "How do certificates work?",
      a: "Once you achieve a passing score, a beautiful, high-resolution PDF certificate is instantly generated and available for download.",
    },
    {
      q: "What if my internet disconnects?",
      a: "We use local session storage to anchor your timer. If you disconnect or accidentally refresh, your progress picks right back up where you left off.",
    },
  ];

  return (
    <section className="py-24 bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 justify-center mb-12">
          <HelpCircle className="text-indigo-600" size={36} />
          <h3 className="text-3xl md:text-4xl font-black text-slate-900">
            Frequently Asked Questions
          </h3>
        </div>
        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="bg-slate-50 rounded-2xl border border-slate-100 overflow-hidden"
            >
              <button
                onClick={() => setOpenFAQ(openFAQ === idx ? null : idx)}
                className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
              >
                <h4 className="font-bold text-slate-900 text-lg flex items-center gap-3">
                  <CheckCircle2
                    className={`shrink-0 transition-colors ${openFAQ === idx ? "text-emerald-500" : "text-slate-300"}`}
                    size={22}
                  />
                  {faq.q}
                </h4>
                <ChevronDown
                  className={`text-slate-400 transition-transform duration-300 ${openFAQ === idx ? "rotate-180" : ""}`}
                  size={20}
                />
              </button>
              <AnimatePresence>
                {openFAQ === idx && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="px-6 pb-6 pt-0"
                  >
                    <p className="text-slate-500 font-medium pl-8">{faq.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;