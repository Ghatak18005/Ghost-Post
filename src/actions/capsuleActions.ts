"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { randomBytes } from "crypto";
import { revalidatePath } from "next/cache";

// 1. Create Capsule
export async function createCapsule(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) return;

  const title = formData.get("title") as string;
  const content = formData.get("content") as string;
  const dateString = formData.get("scheduledAt") as string;
  const recipientEmail = formData.get("recipientEmail") as string;
  
  if (!title || !content || !dateString || !recipientEmail) {
    throw new Error("Missing fields");
  }

  await prisma.capsule.create({
    data: {
      userId: session.user.id,
      title: title,
      content: content,
      unlockDate: new Date(dateString), // Parses the UTC ISO string correctly
      status: "PENDING",
      recipient: recipientEmail,
      iv: randomBytes(16).toString("hex"), 
    },
  });

  revalidatePath("/vault");
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
  const oneHour = 60 * 60 * 1000; // 1 Hour in milliseconds

  // 1. If it's already unlocked -> No Edit
  if (now >= unlockTime) {
    throw new Error("Cannot edit: Capsule is already unlocked.");
  }
  
  // 2. If it's unlocking in less than 1 hour -> No Edit
  if (unlockTime - now < oneHour) {
    // You can also redirect to a custom error page here if you want
    throw new Error("Too late! You cannot edit less than 1 hour before delivery.");
  }
  // ------------------------

  await prisma.capsule.update({
    where: { id },
    data: {
      title,
      content,
      recipient: recipientEmail,
      unlockDate: new Date(dateString),
    },
  });

  revalidatePath(`/vault/${id}`);
  revalidatePath("/vault");
  redirect(`/vault/${id}`);
}