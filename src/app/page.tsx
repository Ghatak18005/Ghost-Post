"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HeroSphere from "@/components/HeroSphere";
import StackingCards from "@/components/StackingCards";
import UseCases from "@/components/UseCases";
import Pricing from "@/components/Pricing";
import { motion } from "framer-motion";
import { ChevronDown, PlayCircle } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import Features from "@/components/Feature";

export default function Home() {
  return (
    // FIX: Added 'bg-neutral-50' for Light Mode to make it slightly off-white (easier on eyes)
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-white font-sans transition-colors duration-300">
      <Navbar />

      {/* --- HERO SECTION --- */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden min-h-[90vh] flex items-center">
        {/* Background Grid */}
        <div className="absolute inset-0 bg-grid-pattern [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none opacity-50 dark:opacity-100" />
        
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-center relative z-10">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-left"
          >
            {/* Pill Badge */}
            <span className="inline-flex items-center gap-2 px-3 py-1 mb-6 text-xs font-medium 
              text-purple-700 bg-purple-100 border border-purple-200 
              dark:text-purple-300 dark:bg-purple-900/20 dark:border-purple-500/30 
              rounded-full transition-colors duration-300">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
              </span>
              The Future of Digital Legacy
            </span>
            
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 leading-tight text-neutral-900 dark:text-white">
              Send messages to <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 dark:from-purple-400 dark:via-pink-500 dark:to-red-500">
                the Unknown.
              </span>
            </h1>
            
            <p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-xl mb-10 leading-relaxed">
              The world's most secure digital time capsule. Encrypt messages and media today. We deliver them precisely when you decide.
            </p>
            
            <div className="flex flex-row items-center gap-4">
              <Link href="/dashboard" className="group relative px-8 py-4 bg-neutral-900 dark:bg-white text-white dark:text-black font-bold rounded-full transition-all hover:scale-105 shadow-lg hover:shadow-xl">
                Start a Capsule
              </Link>
              <button className="flex items-center gap-2 px-6 py-4 bg-transparent hover:bg-neutral-200 dark:hover:bg-white/5 text-neutral-700 dark:text-white font-medium rounded-full transition-all border border-neutral-300 dark:border-white/10">
                <PlayCircle size={20} />
                How it Works
              </button>
            </div>
          </motion.div>

          <motion.div
             initial={{ opacity: 0, scale: 0.8 }}
             animate={{ opacity: 1, scale: 1 }}
             transition={{ duration: 1, delay: 0.3 }}
             className="hidden md:block"
          >
             <HeroSphere />
          </motion.div>
        </div>
      </section>

      {/* --- SECTIONS --- */}
      <Features />
      <StackingCards />
      <UseCases />
      <Pricing />

      {/* --- FAQ SECTION --- */}
      <section className="py-32 max-w-3xl mx-auto px-6">
        <h2 className="text-3xl font-bold text-center mb-12 text-neutral-900 dark:text-white">Common Questions</h2>
        <div className="space-y-4">
           <FAQItem question="Can I edit a message after I schedule it?" answer="Yes, as long as the unlock date hasn't passed." />
           <FAQItem question="Is this secure?" answer="We use industry-standard AES-256 encryption. We literally cannot see your data." />
        </div>
      </section>
      
      <Footer />
    </div>
  );
}

function FAQItem({ question, answer }: { question: string, answer: string }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border border-neutral-200 dark:border-white/10 rounded-xl bg-white dark:bg-neutral-900/30 overflow-hidden transition-colors duration-300">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center p-6 text-left hover:bg-neutral-50 dark:hover:bg-white/5 transition-colors"
      >
        <span className="font-semibold text-neutral-900 dark:text-white">{question}</span>
        <ChevronDown className={`text-neutral-500 dark:text-neutral-400 transform transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
      </button>
      <motion.div 
        initial={false}
        animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden"
      >
        <div className="p-6 pt-0 text-neutral-600 dark:text-neutral-400 text-sm leading-relaxed">
          {answer}
        </div>
      </motion.div>
    </div>
  );
}