"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Plus, Archive, Settings, Clock, Users, FileText, LogOut } from "lucide-react";

export default function Dashboard() {
  const { data: session, status } = useSession();

  if (status === "loading") return <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950" />;
  if (status === "unauthenticated") redirect("/");

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-white font-sans transition-colors duration-300 p-6 md:p-12">
      
      {/* Header */}
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-1">
            Dashboard
          </h1>
          <p className="text-neutral-500 dark:text-neutral-400">
            Welcome back, {session?.user?.name}
          </p>
        </div>
        
        <Link 
          href="/api/auth/signout"
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium border border-neutral-200 dark:border-neutral-800 rounded-full hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors"
        >
          <LogOut size={16} />
          Sign Out
        </Link>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN: Main Actions */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Stats Row */}
          <div className="grid grid-cols-3 gap-4">
            <StatCard label="Active" value="0" icon={<Clock size={18} className="text-blue-500" />} />
            <StatCard label="Delivered" value="0" icon={<Archive size={18} className="text-green-500" />} />
            <StatCard label="Storage" value="0%" icon={<FileText size={18} className="text-purple-500" />} />
          </div>

          {/* Action Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link href="/create" className="group">
              <motion.div 
                whileHover={{ y: -4 }}
                className="p-8 h-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-white/10 rounded-3xl shadow-sm hover:shadow-xl hover:border-purple-500/50 dark:hover:border-purple-500/50 transition-all cursor-pointer relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-6 opacity-5 dark:opacity-10 group-hover:scale-110 transition-transform">
                   <Plus size={100} />
                </div>
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-2xl flex items-center justify-center mb-6 text-purple-600 dark:text-purple-400">
                  <Plus size={24} />
                </div>
                <h3 className="text-2xl font-bold mb-2">Create Capsule</h3>
                <p className="text-neutral-500 dark:text-neutral-400 text-sm">
                  Write a message, attach files, and lock it in the time vault.
                </p>
              </motion.div>
            </Link>

            <Link href="/vault" className="group">
              <motion.div 
                whileHover={{ y: -4 }}
                className="p-8 h-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-white/10 rounded-3xl shadow-sm hover:shadow-xl hover:border-blue-500/50 dark:hover:border-blue-500/50 transition-all cursor-pointer relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-6 opacity-5 dark:opacity-10 group-hover:scale-110 transition-transform">
                   <Archive size={100} />
                </div>
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center mb-6 text-blue-600 dark:text-blue-400">
                  <Archive size={24} />
                </div>
                <h3 className="text-2xl font-bold mb-2">Open Vault</h3>
                <p className="text-neutral-500 dark:text-neutral-400 text-sm">
                  View your pending capsules and reading history.
                </p>
              </motion.div>
            </Link>
          </div>

          {/* Recent Activity Section */}
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-white/10 rounded-3xl p-8">
            <h3 className="text-lg font-bold mb-6">Recent Activity</h3>
            <div className="flex flex-col items-center justify-center py-10 text-neutral-400 dark:text-neutral-600">
              <Clock size={48} className="mb-4 opacity-50" />
              <p>No capsules created yet.</p>
              <Link href="/create" className="text-purple-500 hover:underline mt-2 text-sm">Start your first one</Link>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: Sidebar Features */}
        <div className="space-y-6">
           
           {/* Legacy Contact Card */}
           <div className="p-6 bg-gradient-to-br from-neutral-900 to-neutral-800 dark:from-neutral-800 dark:to-neutral-900 text-white rounded-3xl">
              <Users className="mb-4 text-purple-400" />
              <h3 className="text-lg font-bold mb-2">Trusted Contacts</h3>
              <p className="text-neutral-400 text-sm mb-6">Assign someone to receive your data if you become inactive.</p>
              <button className="w-full py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-medium transition-colors">
                Manage Contacts
              </button>
           </div>

           {/* Settings Preview */}
           <div className="p-6 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-white/10 rounded-3xl">
              <div className="flex items-center gap-3 mb-4">
                 <Settings size={20} className="text-neutral-400" />
                 <h3 className="font-bold">Settings</h3>
              </div>
              <ul className="space-y-3 text-sm text-neutral-500 dark:text-neutral-400">
                 <li className="flex justify-between">
                    <span>Account Status</span>
                    <span className="text-green-500">Active</span>
                 </li>
                 <li className="flex justify-between">
                    <span>Plan</span>
                    <span className="text-purple-500">Traveler (Free)</span>
                 </li>
              </ul>
           </div>

        </div>

      </div>
    </div>
  );
}

function StatCard({ label, value, icon }: any) {
  return (
    <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-white/10 p-4 lg:p-6 rounded-2xl flex flex-col justify-between">
      <div className="flex justify-between items-start mb-2">
         <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">{label}</span>
         {icon}
      </div>
      <span className="text-2xl font-bold">{value}</span>
    </div>
  );
}