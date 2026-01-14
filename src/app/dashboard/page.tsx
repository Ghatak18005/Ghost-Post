import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import Pricing from "@/components/Pricing";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Plus, Lock, Unlock, Ban } from "lucide-react";
import CapsuleActions from "./CapsuleActions"; // Ensure this file exists in same folder

// Force dynamic so we always see fresh data (new capsules, plan changes)
export const dynamic = "force-dynamic";

export default async function Dashboard() {
  const session = await auth();

  if (!session?.user?.id) return redirect("/api/auth/signin");

  // 1. Fetch User AND their Capsules in one go
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      capsules: {
        orderBy: { createdAt: "desc" }, // Show newest first
      },
    },
  });

  if (!user) return redirect("/api/auth/signin");

  // 2. Logic to allow/block creating new capsules based on limits
  const PLAN_LIMITS = {
    FREE: 3,
    TIME_KEEPER: 10,
    TIME_LORD: 999999, // Unlimited
  };
  
  // Default to FREE if plan is missing
  const userPlan = (user.plan as keyof typeof PLAN_LIMITS) || "FREE";
  const limit = PLAN_LIMITS[userPlan];
  const usage = user.capsules.length;
  const canCreate = usage < limit;

  return (
    <div className="min-h-screen bg-neutral-950 text-white p-8">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* --- HEADER SECTION --- */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">Time Vault</h1>
            <p className="text-neutral-400">
              Welcome back, {user.name || "Time Traveler"}.
            </p>
          </div>
          
          {/* Create Button (Disabled if limit reached) */}
          <Link
            href={canCreate ? "/dashboard/create" : "#pricing-section"}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${
              canCreate
                ? "bg-purple-600 hover:bg-purple-700 text-white"
                : "bg-neutral-800 text-neutral-500 cursor-not-allowed"
            }`}
          >
            {canCreate ? <Plus size={20} /> : <Lock size={16} />}
            {canCreate ? "Create Capsule" : "Limit Reached"}
          </Link>
        </div>

        {/* --- CAPSULES GRID --- */}
        <section>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">My Capsules</h2>
            <span className="text-sm text-neutral-500">
              {usage} / {limit === 999999 ? "∞" : limit} Used
            </span>
          </div>

          {user.capsules.length === 0 ? (
            // EMPTY STATE
            <div className="text-center py-20 border border-dashed border-neutral-800 rounded-3xl bg-neutral-900/50">
              <h3 className="text-lg font-medium text-neutral-300 mb-2">No memories sealed yet.</h3>
              <p className="text-neutral-500 mb-6">Create your first time capsule today.</p>
              <Link
                href="/dashboard/create"
                className="px-6 py-2 bg-white text-black font-bold rounded-lg hover:bg-neutral-200"
              >
                Create Now
              </Link>
            </div>
          ) : (
            // LIST OF CAPSULES
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {user.capsules.map((capsule) => {
                const isUnlocked = new Date() >= new Date(capsule.unlockDate);
                const now = new Date().getTime();
                const unlockTime = new Date(capsule.unlockDate).getTime();
                
                // Calculate Time Remaining in Hours
                const hoursLeft = (unlockTime - now) / (1000 * 60 * 60);

                // LOGIC RULES:
                const canEdit = hoursLeft > 1;     // Editable until 1 hour before
                const canDelete = hoursLeft > 24;  // Deletable until 24 hours before
                
                return (
                  <div 
                    key={capsule.id} 
                    className="p-6 bg-neutral-900 border border-neutral-800 rounded-2xl hover:border-neutral-700 transition relative group"
                  >
                     {/* --- EDIT / DELETE ACTIONS --- */}
                    <div className="absolute top-4 right-4 z-10">
                      <CapsuleActions 
                        id={capsule.id} 
                        canEdit={canEdit} 
                        canDelete={canDelete} 
                      />
                    </div>

                    <div className="flex justify-between items-start mb-4">
                      <div className={`p-3 rounded-full ${isUnlocked ? 'bg-green-500/10 text-green-500' : 'bg-purple-500/10 text-purple-500'}`}>
                        {isUnlocked ? <Unlock size={20} /> : <Lock size={20} />}
                      </div>
                      <span className="text-xs font-mono text-neutral-500">
                        {new Date(capsule.unlockDate).toLocaleDateString()}
                      </span>
                    </div>
                    
                    <h3 className="text-lg font-bold mb-2 group-hover:text-purple-400 transition">
                      {capsule.title}
                    </h3>
                    
                    <p className="text-sm text-neutral-500 line-clamp-2">
                      {isUnlocked ? capsule.message : "This memory is sealed until the unlock date..."}
                    </p>

                    {/* Visual Cues for Restrictions */}
                    <div className="flex gap-3 text-[10px] font-mono mt-4 uppercase tracking-wider">
                      {!canEdit && !isUnlocked && (
                        <span className="text-yellow-600 flex items-center gap-1">
                          <Lock size={10} /> Edit Locked
                        </span>
                      )}
                      {!canDelete && !isUnlocked && (
                        <span className="text-red-600 flex items-center gap-1">
                          <Ban size={10} /> Delete Locked
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* --- PRICING SECTION (For Upgrades) --- */}
       

      </div>
    </div>
  );
}