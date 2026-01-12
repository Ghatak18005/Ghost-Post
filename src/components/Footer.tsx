import Link from "next/link";
import { Ghost, Twitter, Github, Linkedin } from "lucide-react";

export default function Footer() {
  return (
    // FIX: Footer Background
    <footer className="bg-neutral-100 dark:bg-neutral-950 border-t border-neutral-200 dark:border-white/10 pt-20 pb-10 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <Ghost className="text-purple-600 dark:text-purple-400" />
              <span className="text-xl font-bold text-neutral-900 dark:text-white">GhostPost</span>
            </div>
            <p className="text-neutral-600 dark:text-neutral-400 max-w-sm">
              The secure digital time capsule for your memories, secrets, and legacy. 
            </p>
          </div>
          
          <div>
            <h4 className="text-neutral-900 dark:text-white font-semibold mb-4">Product</h4>
            <ul className="space-y-2 text-neutral-600 dark:text-neutral-400 text-sm">
              <li><Link href="/#features" className="hover:text-purple-500">Features</Link></li>
              <li><Link href="/#how-it-works" className="hover:text-purple-500">Security</Link></li>
              <li><Link href="/#pricing" className="hover:text-purple-500">Pricing</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-neutral-900 dark:text-white font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-neutral-600 dark:text-neutral-400 text-sm">
              <li><Link href="/privacy" className="hover:text-purple-500">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-purple-500">Terms of Service</Link></li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-neutral-200 dark:border-white/10">
          <p className="text-neutral-500 text-sm">© 2026 GhostPost Inc. All rights reserved.</p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <Github className="w-5 h-5 text-neutral-500 hover:text-black dark:hover:text-white cursor-pointer" />
            <Twitter className="w-5 h-5 text-neutral-500 hover:text-black dark:hover:text-white cursor-pointer" />
            <Linkedin className="w-5 h-5 text-neutral-500 hover:text-black dark:hover:text-white cursor-pointer" />
          </div>
        </div>
      </div>
    </footer>
  );
}