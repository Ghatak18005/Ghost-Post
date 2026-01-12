"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Lock, Clock, ShieldCheck, FileText, CheckCircle, Server } from "lucide-react";

const cards = [
  {
    id: 1,
    title: "Military-Grade Encryption",
    description: "We use AES-256 encryption. Your message is scrambled into nonsense characters on your device before it ever touches our servers.",
    icon: <Lock className="w-8 h-8 text-purple-600 dark:text-purple-400" />,
    color: "from-purple-500 to-indigo-500",
  },
  {
    id: 2,
    title: "The Cron Network",
    description: "Our serverless time-keepers check the vault every single minute of every day. Precision timing, guaranteed.",
    icon: <Clock className="w-8 h-8 text-blue-600 dark:text-blue-400" />,
    color: "from-blue-500 to-cyan-500",
  },
  {
    id: 3,
    title: "Guaranteed Delivery",
    description: "Add multiple recipients. If an email bounces, we retry. If a server fails, our backups activate.",
    icon: <ShieldCheck className="w-8 h-8 text-green-600 dark:text-green-400" />,
    color: "from-emerald-500 to-green-500",
  },
];

export default function StackingCards() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  return (
    <section ref={containerRef} className="bg-neutral-100 dark:bg-neutral-950 transition-colors duration-300" id="how-it-works">
      <div className="py-24 px-6 text-center">
        <h2 className="text-4xl md:text-5xl font-bold mb-4 text-neutral-900 dark:text-white">
          How it Works
        </h2>
        <p className="text-neutral-600 dark:text-neutral-400 max-w-lg mx-auto">
          We combined military-grade security with precise timing protocols.
        </p>
      </div>

      <div className="max-w-5xl mx-auto pb-40 px-6">
        {cards.map((card, index) => {
          const targetScale = 1 - (cards.length - index) * 0.05;
          return (
            <Card
              key={card.id}
              i={index}
              {...card}
              progress={scrollYProgress}
              range={[index * 0.25, 1]}
              targetScale={targetScale}
            />
          );
        })}
      </div>
    </section>
  );
}

const Card = ({ i, title, description, icon, color, id, progress, range, targetScale }: any) => {
  const container = useRef(null);
  const { scrollYProgress } = useScroll({ target: container, offset: ["start end", "start start"] });
  const scale = useTransform(progress, range, [1, targetScale]);

  return (
    <div ref={container} className="h-screen flex items-center justify-center sticky top-0">
      <motion.div
        style={{ scale, top: `calc(-5vh + ${i * 25}px)` }}
        className={`relative flex flex-col md:flex-row h-[550px] w-full max-w-5xl rounded-3xl p-8 md:p-12 
          bg-white dark:bg-neutral-900 
          border border-neutral-300 dark:border-white/10 
          shadow-2xl dark:shadow-none
          overflow-hidden transform-gpu origin-top transition-colors duration-300`}
      >
        {/* Text Content */}
        <div className="w-full md:w-[40%] flex flex-col justify-center relative z-10">
          <div className="w-14 h-14 rounded-xl bg-neutral-100 dark:bg-white/10 flex items-center justify-center mb-6 border border-neutral-200 dark:border-white/5">
            {icon}
          </div>
          <h2 className="text-3xl font-bold mb-6 text-neutral-900 dark:text-white leading-tight">
            {title}
          </h2>
          <p className="text-lg text-neutral-600 dark:text-neutral-400 leading-relaxed">
            {description}
          </p>
        </div>

        {/* Visual Content (The previously empty box) */}
        <div className="relative w-full md:w-[60%] h-64 md:h-full mt-8 md:mt-0 md:ml-12 rounded-2xl overflow-hidden border border-neutral-200 dark:border-white/10 bg-neutral-50 dark:bg-black/40">
           <CardVisual id={id} color={color} />
        </div>
      </motion.div>
    </div>
  );
};

// 👇 THIS IS THE NEW PART: ACTUAL GRAPHICS INSIDE THE BOX
function CardVisual({ id, color }: { id: number, color: string }) {
  // 1. Encryption Visual
  if (id === 1) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center relative overflow-hidden">
        {/* Fake Code Background */}
        <div className="absolute inset-0 p-6 opacity-10 font-mono text-xs text-black dark:text-white break-all">
          01010101010010011100101010101001010100111101010101...
        </div>
        
        {/* Animated Lock Card */}
        <motion.div 
           initial={{ y: 20, opacity: 0 }}
           whileInView={{ y: 0, opacity: 1 }}
           transition={{ duration: 0.5 }}
           className="relative z-10 w-64 p-4 bg-white dark:bg-neutral-800 rounded-xl shadow-xl border border-neutral-200 dark:border-neutral-700"
        >
          <div className="flex items-center gap-3 mb-4 border-b border-neutral-100 dark:border-neutral-700 pb-3">
            <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${color} flex items-center justify-center`}>
              <Lock size={14} className="text-white" />
            </div>
            <div className="text-sm font-bold text-neutral-800 dark:text-white">Message.txt</div>
          </div>
          <div className="space-y-2">
            <div className="h-2 w-3/4 bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse" />
            <div className="h-2 w-1/2 bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse" />
            <div className="h-2 w-full bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse" />
          </div>
          <div className="mt-4 flex justify-end">
            <span className="text-xs font-mono text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded">
              Encrypted
            </span>
          </div>
        </motion.div>
      </div>
    );
  }

  // 2. Cron Visual
  if (id === 2) {
    return (
      <div className="w-full h-full flex items-center justify-center relative bg-neutral-50 dark:bg-neutral-900/50">
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        
        <div className="relative w-64 bg-white dark:bg-neutral-800 rounded-xl shadow-xl border border-neutral-200 dark:border-neutral-700 p-6">
          <div className="flex justify-between items-center mb-6">
            <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Next Run</span>
            <div className="flex items-center gap-1 text-green-500">
               <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
               </span>
               <span className="text-xs font-bold">Active</span>
            </div>
          </div>
          
          <div className="text-center py-4">
             <div className="text-4xl font-mono font-bold text-neutral-900 dark:text-white tracking-widest">
               2030
             </div>
             <div className="text-sm text-neutral-400 mt-1">Target Year</div>
          </div>

          <div className="mt-4 w-full bg-neutral-100 dark:bg-neutral-700 rounded-full h-1.5 overflow-hidden">
             <motion.div 
               initial={{ width: "0%" }}
               whileInView={{ width: "30%" }}
               transition={{ duration: 1.5, delay: 0.2 }}
               className={`h-full bg-gradient-to-r ${color}`} 
             />
          </div>
        </div>
      </div>
    );
  }

  // 3. Delivery Visual
  return (
    <div className="w-full h-full flex items-center justify-center relative">
       <motion.div 
         initial={{ scale: 0.9, opacity: 0 }}
         whileInView={{ scale: 1, opacity: 1 }}
         className="w-72 bg-white dark:bg-neutral-800 rounded-2xl shadow-2xl border border-neutral-200 dark:border-neutral-700 overflow-hidden"
       >
          <div className={`h-24 bg-gradient-to-br ${color} flex items-center justify-center`}>
             <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
               <CheckCircle className="text-white w-6 h-6" />
             </div>
          </div>
          <div className="p-6 text-center">
             <h4 className="text-lg font-bold text-neutral-900 dark:text-white mb-1">Capsule Unlocked</h4>
             <p className="text-sm text-neutral-500 mb-6">Delivered to aumghodasara@gmail.com</p>
             <button className="w-full py-2 bg-neutral-100 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-300 rounded-lg text-sm font-medium">
               View Message
             </button>
          </div>
       </motion.div>
    </div>
  );
}