import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Lock, LockOpen, Clock, ArrowLeft, Trash2, Inbox, Send, PenLine } from "lucide-react"; // 1. Added PenLine import
import { revalidatePath } from "next/cache";

async function deleteCapsule(formData: FormData) {
  "use server";
  const id = formData.get("id") as string;
  await prisma.capsule.delete({ where: { id } });
  revalidatePath("/vault");
}

export default async function VaultPage() {
  const session = await auth();
  if (!session?.user?.email) redirect("/");

  const now = new Date();

  // 1. Fetch Sent Capsules
  const sentCapsules = await prisma.capsule.findMany({
    where: { userId: session.user.id },
    orderBy: { unlockDate: "asc" },
  });

  // 2. Fetch Received Capsules
  const receivedCapsules = await prisma.capsule.findMany({
    where: { recipient: session.user.email },
    orderBy: { unlockDate: "asc" },
  });

  // Filters (using 'any' to avoid type errors)
  const sentLocked = sentCapsules.filter((c: any) => c.unlockDate > now);
  const sentUnlocked = sentCapsules.filter((c: any) => c.unlockDate <= now);

  const receivedUnlocked = receivedCapsules.filter((c: any) => c.unlockDate <= now);
  const receivedLocked = receivedCapsules.filter((c: any) => c.unlockDate > now);

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-white p-6 md:p-12 transition-colors duration-300">
      <div className="max-w-6xl mx-auto">
        
        <div className="flex items-center gap-4 mb-12">
          <Link href="/dashboard" className="p-2 rounded-full hover:bg-neutral-200 dark:hover:bg-white/10 transition-colors">
            <ArrowLeft size={24} />
          </Link>
          <div>
            <h1 className="text-3xl font-bold">Time Vault</h1>
            <p className="text-neutral-500 dark:text-neutral-400">Manage your timeline.</p>
          </div>
        </div>

        {/* --- INBOX (Received) --- */}
        <div className="mb-20">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-purple-600 dark:text-purple-400 border-b border-neutral-200 dark:border-neutral-800 pb-4">
                <Inbox size={24} /> Inbox (Received)
            </h2>

            {receivedUnlocked.length === 0 && receivedLocked.length === 0 ? (
                <div className="p-8 bg-neutral-100 dark:bg-neutral-900 rounded-2xl text-center text-neutral-500">
                    No messages received yet.
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Unlocked Received */}
                    {receivedUnlocked.map((capsule: any) => (
                        <Link href={`/vault/${capsule.id}`} key={capsule.id} className="group">
                            <div className="p-6 bg-white dark:bg-neutral-900 border border-purple-500/30 rounded-2xl shadow-sm hover:shadow-lg transition-all relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-4 opacity-10"><Inbox size={60} /></div>
                                <div className="mb-4 p-3 bg-purple-100 dark:bg-purple-900/30 w-fit rounded-xl text-purple-600 dark:text-purple-400">
                                    <Inbox size={20} />
                                </div>
                                <h3 className="text-lg font-bold mb-1 truncate">{capsule.title}</h3>
                                <p className="text-xs text-neutral-400 mb-4">From: ???</p>
                                <span className="text-sm font-bold text-purple-500 underline decoration-purple-500/30">Read Message &rarr;</span>
                            </div>
                        </Link>
                    ))}

                    {/* Locked Received */}
                    {receivedLocked.map((capsule: any) => (
                        <div key={capsule.id} className="p-6 bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-white/5 rounded-2xl opacity-75">
                             <div className="flex justify-between items-start mb-4">
                                <div className="p-3 bg-neutral-200 dark:bg-white/5 rounded-xl text-neutral-500"><Lock size={20} /></div>
                             </div>
                             <h3 className="text-lg font-bold mb-2">Mystery Capsule</h3>
                             <div className="flex items-center gap-2 text-sm text-neutral-500">
                                <Clock size={14} />
                                Arrives {new Date(capsule.unlockDate).toLocaleString()}
                             </div>
                        </div>
                    ))}
                </div>
            )}
        </div>

        {/* --- OUTBOX (Sent) --- */}
        <div>
           <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-neutral-900 dark:text-white border-b border-neutral-200 dark:border-neutral-800 pb-4">
             <Send size={24} /> Sent Capsules
           </h2>

           <h3 className="text-sm font-bold text-green-500 uppercase tracking-wider mb-4 mt-8">Delivered</h3>
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
               {sentUnlocked.map((capsule: any) => (
                 <Link href={`/vault/${capsule.id}`} key={capsule.id} className="group">
                   <div className="p-6 bg-white dark:bg-neutral-900 border border-green-500/30 rounded-2xl shadow-sm hover:shadow-lg transition-all relative overflow-hidden">
                     <div className="mb-4 p-3 bg-green-100 dark:bg-green-900/30 w-fit rounded-xl text-green-600 dark:text-green-400"><LockOpen size={20} /></div>
                     <h3 className="text-lg font-bold mb-2 truncate">{capsule.title}</h3>
                     <p className="text-sm text-neutral-500">To: {capsule.recipient}</p>
                   </div>
                 </Link>
               ))}
           </div>

           <h3 className="text-sm font-bold text-neutral-500 uppercase tracking-wider mb-4">Pending Delivery</h3>
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
               {sentLocked.map((capsule: any) => (
                 <div key={capsule.id} className="p-6 bg-neutral-100 dark:bg-neutral-900/50 border border-neutral-200 dark:border-white/5 rounded-2xl relative group">
                     
                     {/* 👇 HEADER WITH ICONS */}
                     <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-neutral-200 dark:bg-white/5 rounded-xl text-neutral-500">
                            <Lock size={20} />
                        </div>
                        
                        {/* 👇 EDIT AND DELETE BUTTONS SIDE-BY-SIDE */}
                        <div className="flex items-center gap-1">
                            {/* Edit Button (Links to Edit Page) */}
                            <Link 
                                href={`/vault/${capsule.id}/edit`}
                                className="p-2 text-neutral-400 hover:text-blue-500 transition-colors"
                                title="Edit Capsule"
                            >
                                <PenLine size={18} />
                            </Link>

                            {/* Delete Button */}
                            <form action={deleteCapsule}>
                                <input type="hidden" name="id" value={capsule.id} />
                                <button className="p-2 text-neutral-400 hover:text-red-500 transition-colors" title="Delete">
                                    <Trash2 size={18} />
                                </button>
                            </form>
                        </div>
                     </div>

                     <h3 className="text-lg font-bold mb-1 opacity-75">{capsule.title}</h3>
                     <p className="text-xs text-neutral-400 mb-4">To: {capsule.recipient}</p>
                     <div className="flex items-center gap-2 text-sm text-purple-500 bg-purple-100 dark:bg-purple-900/20 py-2 px-3 rounded-lg w-fit">
                        <Clock size={14} /> {new Date(capsule.unlockDate).toLocaleString()}
                     </div>
                 </div>
               ))}
           </div>
        </div>

      </div>
    </div>
  );
}