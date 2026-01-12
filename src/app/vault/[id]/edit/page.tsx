import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { ArrowLeft, PenLine } from "lucide-react";
import EditForm from "@/components/EditForm"; // Import the new component

export default async function EditPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  const { id } = await params;

  const capsule = await prisma.capsule.findUnique({
    where: { id },
  });

  if (!capsule) return <div>Not Found</div>;
  if (capsule.userId !== session?.user?.id) return <div>Unauthorized</div>;
  
  // Note: We don't block the view here with 'too late', 
  // we let the server action handle the strict check.

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-white p-6 md:p-12 transition-colors duration-300">
      <div className="max-w-2xl mx-auto">
        <Link href={`/vault/${id}`} className="inline-flex items-center gap-2 text-sm text-neutral-500 hover:text-purple-500 mb-8 transition-colors">
          <ArrowLeft size={16} /> Cancel & Go Back
        </Link>

        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-white/10 p-8 rounded-3xl shadow-xl">
          <div className="flex items-center gap-3 mb-8">
             <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl text-blue-600 dark:text-blue-400">
                <PenLine size={24} />
             </div>
             <h1 className="text-2xl font-bold">Edit Capsule</h1>
          </div>

          {/* 👇 Use the Client Component */}
          <EditForm capsule={capsule} />

        </div>
      </div>
    </div>
  );
}