import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { ArrowLeft, LockOpen, Calendar, Mail, Clock, PenLine } from "lucide-react";

export default async function CapsuleDetail({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  const { id } = await params;

  const capsule = await prisma.capsule.findUnique({
    where: { id: id },
  });

  if (!capsule) return <div>Capsule not found</div>;

  const isSender = capsule.userId === session?.user?.id;
  const isRecipient = capsule.recipient === session?.user?.email;

  if (!isSender && !isRecipient) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-neutral-950 text-white">
        <h1 className="text-2xl font-bold text-red-500">Unauthorized</h1>
        <Link href="/dashboard" className="mt-4 underline">Go Home</Link>
      </div>
    );
  }

  const isLocked = new Date() < capsule.unlockDate;

  // 👇 FIX: Only show "Still Locked" screen if it is NOT the sender
  // If you are the sender, you skip this block and see the content.
  if (isLocked && !isSender) {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-neutral-950 text-white p-6 text-center">
            <h1 className="text-4xl font-bold mb-4">🚫 Still Locked</h1>
            <p className="text-neutral-400 max-w-md mx-auto mb-6">
               Nice try! This capsule is sealed until <br/>
               <span className="text-purple-400 font-mono">
                 {capsule.unlockDate.toLocaleString()}
               </span>
            </p>
            <Link href="/vault" className="text-purple-500 underline">Back to Vault</Link>
        </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-white p-6 md:p-12 transition-colors duration-300">
      <div className="max-w-3xl mx-auto">
        <Link href="/vault" className="inline-flex items-center gap-2 text-neutral-500 hover:text-purple-500 mb-8 transition-colors">
          <ArrowLeft size={16} /> Back to Vault
        </Link>

        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-white/10 rounded-3xl shadow-2xl overflow-hidden relative">
            <div className="bg-neutral-100 dark:bg-white/5 p-8 border-b border-neutral-200 dark:border-white/10 flex justify-between items-start">
                <div>
                    <h1 className="text-3xl font-bold mb-2">{capsule.title}</h1>
                    <div className="flex flex-col gap-1 text-sm text-neutral-500">
                        <span className="flex items-center gap-2">
                           <Clock size={14}/> 
                           Unlocked: {capsule.unlockDate.toLocaleString()}
                        </span>
                        <span className="flex items-center gap-2">
                           <Mail size={14}/> 
                           {isSender ? `To: ${capsule.recipient}` : "From: A Friend"}
                        </span>
                    </div>
                </div>
                
                <div className="flex items-center gap-3">
                   {/* Edit Button: Visible if Sender + Locked */}
                   {isSender && isLocked && (
                      <Link 
                        href={`/vault/${id}/edit`}
                        className="p-3 bg-neutral-200 dark:bg-white/10 text-neutral-600 dark:text-neutral-300 rounded-full hover:bg-neutral-300 dark:hover:bg-white/20 transition-colors"
                      >
                         <PenLine size={20} />
                      </Link>
                   )}
                   <div className="p-3 bg-green-100 dark:bg-green-900/30 text-green-600 rounded-full">
                       <LockOpen size={24} />
                   </div>
               </div>
            </div>

            <div className="p-8 md:p-12 min-h-[300px]">
                <p className="whitespace-pre-wrap text-lg leading-relaxed font-serif text-neutral-800 dark:text-neutral-300">
                    {capsule.content}
                </p>
            </div>
            
            {/* Show extra note for Sender if locked */}
            {isSender && isLocked && (
                <div className="p-4 bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200 text-center text-sm">
                    ⚠️ This capsule is locked for the recipient, but you can see it because you created it.
                </div>
            )}
        </div>
      </div>
    </div>
  );
}