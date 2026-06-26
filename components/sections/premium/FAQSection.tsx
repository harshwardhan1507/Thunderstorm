"use client";

import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: "Is ThunderStorm free?",
    answer:
      "Yes! ThunderStorm offers a free tier with access to 20+ algorithms and basic visualizations. Our Pro plan ($9.99/month) unlocks 48+ algorithms, code execution, and advanced features.",
  },
  {
    question: "Do I need to know how to code?",
    answer:
      "No! ThunderStorm is designed for beginners and experts alike. Our visualizations help you understand algorithms even if you're new to programming.",
  },
  {
    question: "Which programming languages are supported?",
    answer:
      "We support Python, JavaScript, Java, and C++. You can view and execute code in any of these languages for each algorithm.",
  },
  {
    question: "Can I use ThunderStorm for interview prep?",
    answer:
      "Absolutely! Many users use ThunderStorm to prepare for technical interviews at top companies. Our comparison mode and performance metrics are especially helpful.",
  },
  {
    question: "Is there a mobile app?",
    answer:
      "ThunderStorm is fully responsive and works great on mobile browsers. We're working on native iOS and Android apps.",
  },
  {
    question: "Can I export my progress?",
    answer:
      "Yes! Pro users can export their progress reports and share them with mentors or on their portfolios.",
  },
];

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="relative py-20 md:py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />

      <div className="container relative z-10 mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="mx-auto max-w-3xl text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-white/60">
            Everything you need to know about ThunderStorm.
          </p>
        </motion.div>

        {/* FAQ Items */}
        <div className="mx-auto max-w-3xl space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              viewport={{ once: true }}
              className="group"
            >
              <button
                onClick={() =>
                  setOpenIndex(openIndex === index ? null : index)
                }
                className="w-full flex items-center justify-between p-6 rounded-lg border border-white/10 bg-gradient-to-r from-white/5 to-white/0 hover:border-primary/50 transition-all duration-300"
              >
                <span className="text-left text-white font-semibold">
                  {faq.question}
                </span>
                <ChevronDown
                  size={20}
                  className={`text-primary transition-transform duration-300 flex-shrink-0 ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Answer */}
              <motion.div
                initial={false}
                animate={{
                  height: openIndex === index ? "auto" : 0,
                  opacity: openIndex === index ? 1 : 0,
                }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="px-6 py-4 text-white/70 border-x border-b border-white/10 bg-white/[0.02]">
                  {faq.answer}
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* Still have questions */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <p className="text-white/60 mb-4">
            Still have questions? We're here to help!
          </p>
          <a href="mailto:support@thunderstorm.dev">
            <button className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors font-semibold">
              Contact our support team →
            </button>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
