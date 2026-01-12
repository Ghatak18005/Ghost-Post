"use client";

import Link from "next/link";
import { useSession, signIn } from "next-auth/react";
import { Ghost } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle"; // <--- 1. Import this

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/80 dark:bg-neutral-950/50 backdrop-blur-md border-b border-neutral-200 dark:border-white/10 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        
        {/* Logo Section */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="p-2 bg-purple-600/10 dark:bg-purple-600/20 rounded-lg group-hover:bg-purple-600/20 dark:group-hover:bg-purple-600/30 transition-colors">
            <Ghost className="text-purple-600 dark:text-purple-400 w-5 h-5" />
          </div>
          <span className="font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-neutral-900 to-neutral-600 dark:from-white dark:to-neutral-400">
            GhostPost
          </span>
        </Link>

        {/* Desktop Links & Buttons */}
        <div className="hidden md:flex items-center gap-6 text-sm font-medium text-neutral-600 dark:text-neutral-400">
          <Link href="#features" className="hover:text-purple-600 dark:hover:text-white transition-colors">Features</Link>
          <Link href="#how-it-works" className="hover:text-purple-600 dark:hover:text-white transition-colors">How it Works</Link>
          
          {/* 2. ADD THE THEME TOGGLE HERE */}
          <div className="border-l border-neutral-300 dark:border-neutral-700 pl-6 flex items-center gap-4">
            <ThemeToggle />

            {session ? (
              <Link 
                href="/dashboard"
                className="px-5 py-2.5 bg-neutral-900 dark:bg-white text-white dark:text-black rounded-full hover:opacity-90 transition-opacity font-semibold shadow-lg shadow-purple-500/20"
              >
                Go to Dashboard
              </Link>
            ) : (
              <button
                onClick={() => signIn("google")}
                className="px-5 py-2.5 bg-neutral-900 dark:bg-white text-white dark:text-black rounded-full hover:opacity-90 transition-opacity font-semibold shadow-lg shadow-purple-500/20"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}