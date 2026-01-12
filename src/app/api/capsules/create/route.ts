import { auth } from "@/auth";
import prisma from "@/lib/prisma"; // Make sure you export prisma instance globally
import { encrypt } from "@/lib/crypto"; // Use the encryption helper from previous guide

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return new cResponse("Unauthorized", { status: 401 });

  const { message, recipient, unlockDate } = await req.json();

  // 1. Encrypt the secret message
  const { encryptedData, iv } = encrypt(message);

  // 2. Save to MongoDB
  const capsule = await prisma.capsule.create({
    data: {
      content: encryptedData,
      iv: iv,
      recipient: recipient,
      unlockDate: new Date(unlockDate),
      userId: session.user.id,
      isPaid: false, // Default to false until Stripe webhook confirms
    },
  });

  return Response.json({ capsuleId: capsule.id });
}