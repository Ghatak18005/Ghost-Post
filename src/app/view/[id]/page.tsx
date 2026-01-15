import prisma from "@/lib/prisma";
import { Lock, Clock } from "lucide-react";
import { notFound } from "next/navigation";

// Force dynamic to ensure we check the time on every load
export const dynamic = "force-dynamic";

export default async function ViewCapsulePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  // 1. Fetch Capsule
  const capsule = await prisma.capsule.findUnique({
    where: { id },
    include: { user: true },
  });

  if (!capsule) return notFound();

  // 2. Security Check: Is it unlocked?
  const unlockTime = new Date(capsule.unlockDate).getTime();
  const now = Date.now();

  if (now < unlockTime) {
    // If someone tries to guess the link early, show a countdown/locked screen
    return (
      <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center text-white p-4 text-center">
        <div className="bg-neutral-900 p-8 rounded-2xl border border-neutral-800 max-w-md w-full">
          <Lock className="w-16 h-16 text-purple-500 mx-auto mb-6" />
          <h1 className="text-2xl font-bold mb-2">This Memory is Sealed</h1>
          <p className="text-neutral-400">
            {capsule.user.name} has sealed this message until:
          </p>
          <div className="mt-6 text-xl font-mono text-purple-400 bg-purple-500/10 py-2 rounded-lg">
            {new Date(capsule.unlockDate).toLocaleDateString()}
          </div>
        </div>
      </div>
    );
  }

  // 3. Render the Unlocked Memory
  const isVideo = capsule.fileUrl?.startsWith("data:video");

  return (
    <div className="min-h-screen bg-neutral-950 text-white flex flex-col items-center py-20 px-4">
      <div className="max-w-3xl w-full space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 text-green-500 text-sm font-medium">
            <Clock size={16} /> Unlocked on {new Date(capsule.unlockDate).toLocaleDateString()}
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
            {capsule.title}
          </h1>
          <p className="text-xl text-neutral-400">
            A message from <strong>{capsule.user.name}</strong>
          </p>
        </div>

        {/* Message Card */}
        <div className="bg-neutral-900 p-8 rounded-3xl border border-neutral-800 shadow-2xl">
          <p className="text-lg leading-relaxed whitespace-pre-wrap text-neutral-200">
            {capsule.message}
          </p>
        </div>

        {/* Media Player */}
        {capsule.fileUrl && (
          <div className="rounded-3xl overflow-hidden border border-neutral-800 bg-black shadow-2xl">
            {isVideo ? (
              <video 
                src={capsule.fileUrl} 
                controls 
                autoPlay 
                className="w-full max-h-[80vh] object-contain"
              />
            ) : (
              <img 
                src={capsule.fileUrl} 
                alt="Attached Memory" 
                className="w-full object-contain"
              />
            )}
          </div>
        )}

        {/* Footer */}
        <div className="text-center pt-10 border-t border-neutral-800 text-neutral-500">
          <p>Protected by GhostPost Digital Vault</p>
        </div>

      </div>
    </div>
  );
}