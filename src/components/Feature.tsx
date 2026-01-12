"use client";

import { motion } from "framer-motion";
import { FileVideo, Globe, Edit3, Users, Zap, ShieldAlert } from "lucide-react";

const features = [
  {
    title: "Rich Media Support",
    desc: "Don't just write. Upload photos, 4K videos, and voice notes to preserve the moment exactly as it was.",
    icon: <FileVideo className="w-6 h-6 text-purple-500" />,
    colSpan: "md:col-span-2", // Makes this box wide
    bg: "bg-purple-500/10 dark:bg-purple-900/10",
  },
  {
    title: "Global CDN",
    desc: "Your data is replicated across 3 continents. Even if a server fails in Tokyo, your message survives in New York.",
    icon: <Globe className="w-6 h-6 text-blue-500" />,
    colSpan: "md:col-span-1",
    bg: "bg-blue-500/10 dark:bg-blue-900/10",
  },
  {
    title: "Edit Until Delivery",
    desc: "Change your mind? You can edit, reschedule, or delete your capsule anytime before the unlock date.",
    icon: <Edit3 className="w-6 h-6 text-green-500" />,
    colSpan: "md:col-span-1",
    bg: "bg-green-500/10 dark:bg-green-900/10",
  },
  {
    title: "Legacy Contacts",
    desc: "Assign a 'Trusted Contact' who can request early access in case of emergency or inactivity.",
    icon: <Users className="w-6 h-6 text-pink-500" />,
    colSpan: "md:col-span-2", // Wide box
    bg: "bg-pink-500/10 dark:bg-pink-900/10",
  },
];

export default function Features() {
  return (
    <section id="features" className="py-24 bg-white dark:bg-neutral-950 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 text-neutral-900 dark:text-white">
            Powerful Features
          </h2>
          <p className="text-neutral-600 dark:text-neutral-400">
            Everything you need to secure your digital legacy.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[200px]">
          {features.map((item, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -5 }}
              className={`p-8 rounded-3xl border border-neutral-200 dark:border-white/10 ${item.colSpan} ${item.bg} flex flex-col justify-between transition-all hover:shadow-lg`}
            >
              <div className="w-12 h-12 rounded-2xl bg-white dark:bg-white/10 flex items-center justify-center shadow-sm">
                {item.icon}
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2 text-neutral-900 dark:text-white">
                  {item.title}
                </h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}