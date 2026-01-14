import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import nodemailer from "nodemailer";

// Prevent build errors
export const dynamic = 'force-dynamic';

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

export async function GET() {
  try {
    const now = new Date();

    // 1. Find capsules that are:
    //    - Unlocked (Time passed)
    //    - NOT sent yet
    const capsulesToSend = await prisma.capsule.findMany({
      where: {
        unlockDate: { lte: now }, // Unlock date is in the past/now
        isSent: false,            // Hasn't been sent
      },
      include: { user: true },
    });

    if (capsulesToSend.length === 0) {
      return NextResponse.json({ message: "No capsules to send." });
    }

    // 2. Loop through and send emails
    for (const capsule of capsulesToSend) {
      await transporter.sendMail({
        from: `"GhostPost Time Keeper" <${process.env.GMAIL_USER}>`,
        to: capsule.recipientEmail, // The address entered by sender
        subject: `Start Your Legacy: A Message from ${capsule.user.name || "A Friend"}`,
        html: `
          <div style="font-family: sans-serif; padding: 20px; background: #f5f5f5;">
            <div style="background: white; padding: 30px; border-radius: 10px; max-width: 600px; margin: auto;">
              <h1 style="color: #6b21a8;">Time Capsule Unlocked 🔓</h1>
              <p>Hello,</p>
              <p><strong>${capsule.user.name}</strong> sealed a message for you on <strong>${new Date(capsule.createdAt).toDateString()}</strong>. The time has finally come to open it.</p>
              
              <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
              
              <h3 style="margin-bottom: 10px;">"${capsule.title}"</h3>
              <p style="font-size: 16px; line-height: 1.6; color: #333;">${capsule.message}</p>
              
              ${capsule.fileUrl ? `<p><a href="${capsule.fileUrl}" style="display: inline-block; padding: 10px 20px; background: #6b21a8; color: white; text-decoration: none; border-radius: 5px;">View Attached Media</a></p>` : ""}
              
              <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
              
              <p style="font-size: 12px; color: #888;">Powered by GhostPost - Digital Legacy Vault</p>
            </div>
          </div>
        `,
      });

      // 3. Mark as Sent so we don't send it twice
      await prisma.capsule.update({
        where: { id: capsule.id },
        data: { isSent: true, status: "OPEN" },
      });
    }

    return NextResponse.json({ success: true, count: capsulesToSend.length });
  } catch (error) {
    console.error("Cron Error:", error);
    return NextResponse.json({ error: "Cron Failed" }, { status: 500 });
  }
}