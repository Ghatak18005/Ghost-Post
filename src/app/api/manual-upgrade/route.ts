import { NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const session = await auth();
    
    // DEBUG LOG 1
    console.log("1. Session found:", session?.user?.email);

    if (!session?.user?.id) {
      console.log("❌ Error: No User ID found in session");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { planKey, utr } = await req.json();

    // DEBUG LOG 2
    console.log(`2. Received Request - Plan: ${planKey}, UTR: ${utr}`);

    if (!utr || utr.length < 4) {
      console.log("❌ Error: UTR too short");
      return NextResponse.json({ error: "Invalid UTR" }, { status: 400 });
    }

    // DEBUG LOG 3: Attempting DB Update
    console.log("3. Attempting DB Update...");

    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: { plan: planKey },
    });

    console.log("✅ Success! User updated:", updatedUser);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    // 🛑 THIS WILL SHOW THE REAL ERROR IN YOUR TERMINAL
    console.error("🔥 CRITICAL API ERROR:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}