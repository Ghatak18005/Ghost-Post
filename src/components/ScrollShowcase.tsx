"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Lock, Clock, ShieldCheck } from "lucide-react";

const features = [
  {
    id: 1,
    icon: <Lock className="w-10 h-10 text-white" />,
    title: "1. Encrypt",
    desc: "Your message is sealed with AES-256 encryption immediately.",
    color: "from-purple-600 to-indigo-600"
  },
  {
    id: 2,
    icon: <Clock className="w-10 h-10 text-white" />,
    title: "2. Schedule",
    desc: "Our cron architecture waits silently for the exact moment.",
    color: "from-blue-600 to-cyan-600"
  },
  {
    id: 3,
    icon: <ShieldCheck className="w-10 h-10 text-white" />,
    title: "3. Deliver",
    desc: "Only the intended recipient holds the key to decrypt it.",
    color: "from-emerald-600 to-green-600"
  },
];

export default function ScrollShowcase() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  return (
    <section ref={containerRef} className="relative h-[300vh] bg-neutral-950">
      {/* FIX: 'sticky' needs 'top-0'. 
         If this doesn't stick, remove 'overflow-hidden' from parent components (like in page.tsx).
      */}
      <div className="sticky top-0 h-screen flex items-center justify-center overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-20 w-full items-center">
          
          {/* LEFT SIDE: Dynamic Graphic */}
          <div className="hidden md:flex justify-center items-center h-full">
             <div className="relative w-[400px] h-[400px] rounded-3xl bg-neutral-900/50 border border-white/10 backdrop-blur-xl flex items-center justify-center">
                {features.map((feature, index) => {
                    // Simple logic: Show this card when scroll is within its range
                    const start = index * 0.33;
                    const end = start + 0.33;
                    
                    const opacity = useTransform(scrollYProgress, [start, start + 0.1, end - 0.1, end], [0, 1, 1, 0]);

                    return (
                        <motion.div 
                           key={feature.id}
                           style={{ opacity }}
                           className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center"
                        >
                           <div className={`w-24 h-24 mb-6 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center shadow-2xl`}>
                               {feature.icon}
                           </div>
                           <h3 className="text-3xl font-bold mb-2">{feature.title}</h3>
                        </motion.div>
                    );
                })}
             </div>
          </div>

          {/* RIGHT SIDE: Scrolling Text */}
          <div className="relative z-10">
            {features.map((feature) => (
              <div key={feature.id} className="h-screen flex items-center">
                <motion.div 
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ margin: "-20%" }}
                  transition={{ duration: 0.8 }}
                  className="p-8 rounded-2xl border border-white/10 bg-neutral-900/80 backdrop-blur-md shadow-2xl"
                >
                  <div className="md:hidden mb-4 p-3 bg-neutral-800 w-fit rounded-lg">{feature.icon}</div>
                  <h3 className="text-3xl font-bold mb-4 text-white">{feature.title}</h3>
                  <p className="text-xl text-neutral-400 leading-relaxed">{feature.desc}</p>
                </motion.div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}