"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

// 1. Create Capsule
export async function createCapsule(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) return;

  const title = formData.get("title") as string;
  const content = formData.get("content") as string; // We call it content in the form...
  const dateString = formData.get("scheduledAt") as string;
  const recipientEmail = formData.get("recipientEmail") as string;
  
  // Note: If you have a file upload in the form, you need to handle it here too.
  // For now, we'll set fileUrl to null or handle it if you pass it.
  const fileUrl = formData.get("fileUrl") as string | null; 

  if (!title || !content || !dateString || !recipientEmail) {
    throw new Error("Missing fields");
  }

  await prisma.capsule.create({
    data: {
      userId: session.user.id,
      title: title,
      
      // 👇 MAPPED CORRECTLY TO SCHEMA
      message: content,        // Schema calls it 'message'
      recipientEmail: recipientEmail, // Schema calls it 'recipientEmail'
      unlockDate: new Date(dateString),
      
      status: "LOCKED",        // Schema default is 'LOCKED'
      fileUrl: fileUrl,        // Added this matching your schema
      isSent: false,
    },
  });

  revalidatePath("/dashboard"); // Updated to match your new dashboard path
  redirect("/dashboard");
}

// 2. Update Capsule
export async function updateCapsule(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) return;

  const id = formData.get("id") as string;
  const title = formData.get("title") as string;
  const content = formData.get("content") as string;
  const dateString = formData.get("scheduledAt") as string;
  const recipientEmail = formData.get("recipientEmail") as string;

  // Verify ownership
  const existing = await prisma.capsule.findUnique({ where: { id } });

  if (!existing || existing.userId !== session.user.id) {
    throw new Error("Unauthorized");
  }

  // --- THE 1-HOUR RULE ---
  const unlockTime = new Date(existing.unlockDate).getTime();
  const now = Date.now();
  const oneHour = 60 * 60 * 1000; 

  if (now >= unlockTime) {
    throw new Error("Cannot edit: Capsule is already unlocked.");
  }
  
  if (unlockTime - now < oneHour) {
    throw new Error("Too late! You cannot edit less than 1 hour before delivery.");
  }
  // ------------------------

  await prisma.capsule.update({
    where: { id },
    data: {
      title,
      
      // 👇 MAPPED CORRECTLY TO SCHEMA
      message: content, 
      recipientEmail: recipientEmail,
      unlockDate: new Date(dateString),
    },
  });

  revalidatePath("/dashboard");
  redirect("/dashboard");
}