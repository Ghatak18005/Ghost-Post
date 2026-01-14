import { NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";

// 1. Define Limits for each Plan
const PLAN_LIMITS = {
  FREE: { // "TRAVELER"
    maxCapsules: 3,
    maxYears: 1,
    allowMedia: false,
  },
  TIME_KEEPER: {
    maxCapsules: 10,
    maxYears: 10,
    allowMedia: true,
  },
  TIME_LORD: {
    maxCapsules: 999999, // Unlimited
    maxYears: 50,
    allowMedia: true,
  },
};

export async function POST(req: Request) {
  try {
    const session = await auth();
    
    // 1. Check Auth
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Parse Data from Frontend
    const { title, message, unlockDate, fileUrl, recipientEmail } = await req.json();

    // 3. Get User's Current Plan & Capsule Count
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { 
        _count: { 
          select: { capsules: true } // Efficiently count existing capsules
        } 
      },
    });

    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    // 4. Determine Limits based on Plan
    const userPlan = user.plan as keyof typeof PLAN_LIMITS || "FREE";
    const limits = PLAN_LIMITS[userPlan] || PLAN_LIMITS.FREE;

    // ---------------------------------------------------------
    // 🛑 RULE 1: Check Capsule Count Limit
    // ---------------------------------------------------------
    if (user._count.capsules >= limits.maxCapsules) {
      return NextResponse.json(
        { error: `Plan limit reached! Upgrade to create more than ${limits.maxCapsules} capsules.` }, 
        { status: 403 }
      );
    }

    // ---------------------------------------------------------
    // 🛑 RULE 2: Check Date Limit (Max Years)
    // ---------------------------------------------------------
    const selectedDate = new Date(unlockDate);
    const today = new Date();
    const maxDateAllowed = new Date();
    maxDateAllowed.setFullYear(today.getFullYear() + limits.maxYears);

    // Simple validation for invalid dates
    if (isNaN(selectedDate.getTime())) {
      return NextResponse.json({ error: "Invalid date provided." }, { status: 400 });
    }

    if (selectedDate > maxDateAllowed) {
      return NextResponse.json(
        { error: `Date too far! Your plan only supports up to ${limits.maxYears} years into the future.` }, 
        { status: 400 }
      );
    }

    // ---------------------------------------------------------
    // 🛑 RULE 3: Check Media Permission
    // ---------------------------------------------------------
    if (fileUrl && !limits.allowMedia) {
      return NextResponse.json(
        { error: "Media attachments are not available on the Free plan." }, 
        { status: 403 }
      );
    }

    // ---------------------------------------------------------
    // ✅ Validation Passed: Create the Capsule
    // ---------------------------------------------------------
    const newCapsule = await prisma.capsule.create({
      data: {
        title,
        message,
        unlockDate: selectedDate,
        fileUrl: fileUrl || null,
        recipientEmail: recipientEmail, // Saving the new email field
        isSent: false,
        userId: user.id,
        status: "LOCKED",
      },
    });

    return NextResponse.json(newCapsule);

  } catch (error) {
    console.error("Capsule Create Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}