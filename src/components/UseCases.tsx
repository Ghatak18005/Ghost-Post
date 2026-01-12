"use client";

import { motion } from "framer-motion";
import { Baby, FileKey, Sparkles, User } from "lucide-react";

const cases = [
  {
    icon: <User className="text-purple-600 dark:text-purple-400" />,
    title: "Dear Future Me",
    desc: "Write a letter to yourself 5 years from now.",
  },
  {
    icon: <Baby className="text-pink-600 dark:text-pink-400" />,
    title: "For Your Children",
    desc: "Record video messages for your child's 18th birthday.",
  },
  {
    icon: <FileKey className="text-blue-600 dark:text-blue-400" />,
    title: "Digital Will",
    desc: "Securely store passwords for your loved ones.",
  },
  {
    icon: <Sparkles className="text-yellow-600 dark:text-yellow-400" />,
    title: "Predictions",
    desc: "Call the shot. Prove you were right in 2030.",
  },
];

export default function UseCases() {
  return (
    <section className="py-32 bg-white dark:bg-neutral-950 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-20">
          <h2 className="text-4xl font-bold mb-6 text-neutral-900 dark:text-white">
            Not just for fun. <br/> <span className="text-neutral-500">For your legacy.</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {cases.map((item, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -5 }}
              // FIX: 'bg-neutral-50' + 'shadow-sm' for Light Mode visibility
              className="p-8 rounded-2xl 
                bg-neutral-50 dark:bg-neutral-900/40 
                border border-neutral-200 dark:border-white/5 
                hover:shadow-lg dark:hover:border-purple-500/50 
                transition-all group"
            >
              <div className="w-12 h-12 rounded-full bg-white dark:bg-white/5 shadow-sm border border-neutral-100 dark:border-none flex items-center justify-center mb-6">
                {item.icon}
              </div>
              <h3 className="text-xl font-bold mb-3 text-neutral-900 dark:text-white">{item.title}</h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                {item.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}