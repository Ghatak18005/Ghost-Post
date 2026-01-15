import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import Pricing from "@/components/Pricing";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Plus, Lock, Unlock, Ban, Video } from "lucide-react";
import CapsuleActions from "./CapsuleActions"; 
import { decrypt } from "@/lib/crypto"; // 👈 1. IMPORT DECRYPT HELPER

// Force dynamic so we always see fresh data
export const dynamic = "force-dynamic";

export default async function Dashboard() {
  const session = await auth();

  if (!session?.user?.id) return redirect("/api/auth/signin");

  // 2. Fetch User AND their Capsules (RAW / ENCRYPTED DATA)
  const rawUser = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      capsules: {
        orderBy: { createdAt: "desc" }, // Show newest first
      },
    },
  });

  if (!rawUser) return redirect("/api/auth/signin");

  // 3. 🔓 DECRYPT EVERYTHING FOR DISPLAY
  // We map over the raw capsules and unscramble the Title, Message, and File
  const user = {
    ...rawUser,
    capsules: rawUser.capsules.map(c => ({
      ...c,
      title: decrypt(c.title),
      message: decrypt(c.message),
      fileUrl: c.fileUrl ? decrypt(c.fileUrl) : null,
      // Dates and IDs are never encrypted, so they stay as-is
    }))
  };

  // 4. Logic for Limits (Plan Limits)
  const PLAN_LIMITS = {
    FREE: 3,
    TIME_KEEPER: 10,
    TIME_LORD: 999999,
  };
  
  const userPlan = (user.plan as keyof typeof PLAN_LIMITS) || "FREE";
  const limit = PLAN_LIMITS[userPlan];
  const usage = user.capsules.length;
  const canCreate = usage < limit;

  return (
    <div className="min-h-screen bg-neutral-950 text-white p-8">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* --- HEADER --- */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">Time Vault</h1>
            <p className="text-neutral-400">
              Welcome back, {user.name || "Time Traveler"}.
            </p>
          </div>
          
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
                
                // Calculate Restrictions
                const hoursLeft = (unlockTime - now) / (1000 * 60 * 60);
                const canEdit = hoursLeft > 1;     
                const canDelete = hoursLeft > 24;  
                
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
                      <span className="text-xs font-mono text-neutral-500 mt-2">
                        {new Date(capsule.unlockDate).toLocaleDateString()}
                      </span>
                    </div>

                    {/* --- 🎥 MEDIA DISPLAY LOGIC --- */}
                    {capsule.fileUrl && (
                      <div className="w-full h-32 mb-4 rounded-xl overflow-hidden relative border border-neutral-800 bg-black">
                        
                        {/* 1. CHECK IF VIDEO */}
                        {capsule.fileUrl.startsWith("data:video") ? (
                          isUnlocked ? (
                            // 🔓 UNLOCKED VIDEO
                            <video 
                              src={capsule.fileUrl} 
                              controls 
                              className="w-full h-full object-cover" 
                            />
                          ) : (
                            // 🔒 LOCKED VIDEO (Show placeholder)
                            <div className="w-full h-full flex items-center justify-center relative">
                              <div className="absolute inset-0 bg-neutral-900 opacity-50" />
                              <div className="z-10 flex flex-col items-center gap-2">
                                <div className="bg-black/50 p-3 rounded-full border border-white/10">
                                  <Lock className="text-white/80" size={20} />
                                </div>
                                <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest">Video Sealed</span>
                              </div>
                            </div>
                          )
                        ) : (
                          // 2. IS IMAGE
                          isUnlocked ? (
                            <img src={capsule.fileUrl} alt="Memory" className="w-full h-full object-cover transition-transform hover:scale-105" />
                          ) : (
                            <div className="w-full h-full bg-neutral-800 relative">
                              <img src={capsule.fileUrl} alt="Locked" className="w-full h-full object-cover opacity-30 blur-md" />
                              <div className="absolute inset-0 flex items-center justify-center">
                                <div className="bg-black/50 p-2 rounded-full">
                                  <Lock className="text-white/80" size={20} />
                                </div>
                              </div>
                            </div>
                          )
                        )}
                        
                      </div>
                    )}

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

        

      </div>
    </div>
  );
}