"use client";

import { createCapsule } from "@/actions/capsuleActions";
import { motion } from "framer-motion";
import { Calendar, PenLine, Send, ArrowLeft, Mail } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function CreatePage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dateValue, setDateValue] = useState(""); // Stores the ISO (UTC) string

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-white p-6 md:p-12 transition-colors duration-300">
      <div className="max-w-2xl mx-auto">
        
        <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm text-neutral-500 hover:text-purple-500 mb-8 transition-colors">
          <ArrowLeft size={16} /> Back to Dashboard
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-white/10 p-8 rounded-3xl shadow-xl"
        >
          <div className="flex items-center gap-3 mb-8">
             <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-xl text-purple-600 dark:text-purple-400">
                <PenLine size={24} />
             </div>
             <h1 className="text-2xl font-bold">Compose Capsule</h1>
          </div>

          <form 
            action={async (formData) => {
              setIsSubmitting(true);
              await createCapsule(formData);
            }} 
            className="space-y-6"
          >
            {/* 1. Title Input */}
            <div>
              <label className="block text-sm font-medium text-neutral-500 dark:text-neutral-400 mb-2">Title</label>
              <input 
                type="text" 
                name="title"
                required
                placeholder="e.g., A note for my 30th birthday"
                className="w-full bg-neutral-50 dark:bg-black/50 border border-neutral-200 dark:border-white/10 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
              />
            </div>

            {/* 2. Recipient Email */}
            <div>
              <label className="block text-sm font-medium text-neutral-500 dark:text-neutral-400 mb-2">Recipient Email</label>
              <div className="relative">
                <input 
                  type="email" 
                  name="recipientEmail"
                  required
                  placeholder="Who is this for?"
                  className="w-full bg-neutral-50 dark:bg-black/50 border border-neutral-200 dark:border-white/10 rounded-xl p-4 pl-12 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                />
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
              </div>
            </div>

            {/* 3. Unlock Date & Time (Timezone Fixed) */}
            <div>
              <label className="block text-sm font-medium text-neutral-500 dark:text-neutral-400 mb-2">Unlock Date & Time</label>
              <div className="relative">
                {/* Visible Input: User sees Local Time */}
                <input 
                  type="datetime-local" 
                  required
                  className="w-full bg-neutral-50 dark:bg-black/50 border border-neutral-200 dark:border-white/10 rounded-xl p-4 pl-12 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all dark:invert-0 invert-0"
                  style={{ colorScheme: "dark" }}
                  onChange={(e) => {
                    // Convert Local Time -> UTC ISO String immediately
                    if (e.target.value) {
                       const localDate = new Date(e.target.value);
                       setDateValue(localDate.toISOString());
                    }
                  }}
                />
                
                {/* Hidden Input: Sends the correct UTC time to server */}
                <input type="hidden" name="scheduledAt" value={dateValue} />

                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
              </div>
            </div>

            {/* 4. Message Area */}
            <div>
              <label className="block text-sm font-medium text-neutral-500 dark:text-neutral-400 mb-2">Your Message</label>
              <textarea 
                name="content"
                required
                rows={6}
                placeholder="Write something to the future..."
                className="w-full bg-neutral-50 dark:bg-black/50 border border-neutral-200 dark:border-white/10 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all resize-none"
              />
            </div>

            {/* Submit Button */}
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full bg-neutral-900 dark:bg-white text-white dark:text-black font-bold py-4 rounded-xl hover:opacity-90 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Encrypting..." : (
                <>
                  <Send size={18} /> Encrypt & Schedule
                </>
              )}
            </button>
          </form>

        </motion.div>
      </div>
    </div>
  );
}