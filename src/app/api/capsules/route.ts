import { NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { encrypt } from "@/lib/crypto";
// 1. Define Limits for each Plan
// 1. Define Limits for each Plan
const PLAN_LIMITS = {
  FREE: { 
    maxCapsules: 3,
    maxYears: 1,
    allowMedia: false,
    videoAllowed: false, // New Rule
    sizeLimit: 0,
  },
  TIME_KEEPER: {
    maxCapsules: 10,
    maxYears: 10,
    allowMedia: true,
    videoAllowed: false, // Photos only
    sizeLimit: 5 * 1024 * 1024, // 5MB
  },
  TIME_LORD: {
    maxCapsules: 999999, // Unlimited
    maxYears: 50,        // 50 Years
    allowMedia: true,
    videoAllowed: true,  // ✅ Video Enabled
    sizeLimit: 12 * 1024 * 1024, // 12MB (Safe limit for MongoDB's 16MB cap)
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
   if (fileUrl) {
      if (!limits.allowMedia) {
        return NextResponse.json({ error: "Media attachments require a paid plan." }, { status: 403 });
      }
      
      // Check if it's a video and if the plan allows it
      const isVideo = fileUrl.startsWith("data:video");
      if (isVideo && !limits.videoAllowed) {
        return NextResponse.json({ error: "Video attachments require the Time Lord plan." }, { status: 403 });
      }
      
      // (Optional) Size check is usually done on frontend, but good to have here too
    }

    // ---------------------------------------------------------
    // ✅ Validation Passed: Create the Capsule
    // ---------------------------------------------------------
   const newCapsule = await prisma.capsule.create({
      data: {
        title: encrypt(title),               // 🔒 Scramble Title
        message: encrypt(message),           // 🔒 Scramble Message
        recipientEmail: encrypt(recipientEmail), // 🔒 Scramble Email
        fileUrl: fileUrl ? encrypt(fileUrl) : null, // 🔒 Scramble Image/Video (Yes, even the file!)
        
        unlockDate: selectedDate, // Date stays plain (needed for Cron)
        isSent: false,
        userId: user.id,
        status: "LOCKED",
      },
    });

    // We return the PLAIN text to the frontend immediately so the UI doesn't break
    return NextResponse.json({
      ...newCapsule,
      title: title, 
      message: message,
      recipientEmail: recipientEmail,
      fileUrl: fileUrl
    });


  } catch (error) {
    console.error("Capsule Create Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}