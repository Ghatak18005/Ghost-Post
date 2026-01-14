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
        // unlockDate: { lte: now }, // Unlock date is in the past/now
        isSent: false,            // Hasn't been sent
      },
      include: { user: true },
    });

    if (capsulesToSend.length === 0) {
      return NextResponse.json({ message: "No capsules to send." });
    }

    // 2. Loop through and send emails
    // 2. Loop through and send emails
    for (const capsule of capsulesToSend) {
      
      // 1. Prepare Attachment (If image exists)
      const attachments = [];
      if (capsule.fileUrl) {
        attachments.push({
          filename: 'memory.jpg',
          path: capsule.fileUrl, // Nodemailer handles Data URIs automatically!
          cid: 'memory-image'    // Unique ID to reference in the HTML below
        });
      }

      await transporter.sendMail({
        from: `"GhostPost Time Keeper" <${process.env.GMAIL_USER}>`,
        to: capsule.recipientEmail,
        subject: `Start Your Legacy: A Message from ${capsule.user.name || "A Friend"}`,
        
        // 2. Attach the image file separately
        attachments: attachments,

        html: `
          <div style="font-family: sans-serif; padding: 20px; background: #f5f5f5;">
            <div style="background: white; padding: 30px; border-radius: 10px; max-width: 600px; margin: auto; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
              
              <h1 style="color: #6b21a8; text-align: center; margin-bottom: 30px;">Time Capsule Unlocked 🔓</h1>
              
              <p style="font-size: 16px; color: #555;">Hello,</p>
              <p style="font-size: 16px; color: #555; line-height: 1.6;">
                <strong>${capsule.user.name}</strong> sealed a message for you on <strong>${new Date(capsule.createdAt).toDateString()}</strong>. The time has finally come to open it.
              </p>
              
              <hr style="border: 0; border-top: 1px solid #eee; margin: 30px 0;" />
              
              <h2 style="color: #333; margin-bottom: 15px;">"${capsule.title}"</h2>
              
              <div style="background: #fafafa; padding: 20px; border-radius: 8px; border-left: 4px solid #6b21a8;">
                <p style="font-size: 16px; line-height: 1.8; color: #333; margin: 0; white-space: pre-wrap;">${capsule.message}</p>
              </div>

              ${capsule.fileUrl ? `
                <div style="margin-top: 30px; text-align: center;">
                  <p style="font-weight: bold; color: #555; margin-bottom: 10px;">Attached Memory:</p>
                  
                  <img src="cid:memory-image" alt="Attached Memory" style="max-width: 100%; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);" />
                  
                </div>
              ` : ""}
              
              <hr style="border: 0; border-top: 1px solid #eee; margin: 30px 0;" />
              
              <p style="font-size: 12px; color: #888; text-align: center;">
                Powered by GhostPost - Digital Legacy Vault
              </p>
            </div>
          </div>
        `,
      });

      // 3. Mark as Sent
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