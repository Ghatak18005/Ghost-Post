import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import nodemailer from "nodemailer";
import { decrypt } from "@/lib/crypto"; // 👈 1. IMPORT DECRYPT

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

    // Fetch locked capsules that are due (unlockDate <= now)
    const capsulesToSend = await prisma.capsule.findMany({
      where: {
        unlockDate: { lte: now },
        isSent: false,
      },
      include: { user: true },
    });

    if (capsulesToSend.length === 0) {
      return NextResponse.json({ message: "No capsules to send." });
    }

    // Loop through and process each capsule
    for (const capsule of capsulesToSend) {
      
      // 👇 2. DECRYPT THE RECIPIENT EMAIL
      // (The database has scrambled text like "a83f1...", we need the real email "user@gmail.com")
      const plainEmail = decrypt(capsule.recipientEmail || "");
      
      // (Optional) We decrypt these just in case you want to use them in the subject later
      // const plainTitle = decrypt(capsule.title); 

      // If decryption failed or email is missing, skip to avoid crashing
      if (!plainEmail || plainEmail.includes("Encrypted Data")) {
        console.error(`Skipping capsule ${capsule.id}: Invalid decrypted email.`);
        continue;
      }

      // 👇 GENERATE THE SECURE VIEW LINK
      const viewLink = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/view/${capsule.id}`;

      await transporter.sendMail({
        from: `"GhostPost Time Keeper" <${process.env.GMAIL_USER}>`,
        to: plainEmail, // 👈 3. USE THE DECRYPTED EMAIL HERE
        subject: `Start Your Legacy: A Message from ${capsule.user.name || "A Friend"}`,
        
        // Professional HTML Template (No attachments, just the Secure Link)
        html: `
          <div style="font-family: sans-serif; padding: 40px 20px; background: #f5f5f5;">
            <div style="background: white; padding: 40px; border-radius: 16px; max-width: 600px; margin: auto; box-shadow: 0 10px 25px rgba(0,0,0,0.05);">
              
              <div style="text-align: center; margin-bottom: 30px;">
                 <h1 style="color: #6b21a8; font-size: 28px; margin: 0;">Time Capsule Unlocked 🔓</h1>
              </div>
              
              <p style="font-size: 16px; color: #555; line-height: 1.6; text-align: center;">
                <strong>${capsule.user.name}</strong> sealed a special memory for you on <strong>${new Date(capsule.createdAt).toDateString()}</strong>.
              </p>
              
              <div style="margin: 40px 0; text-align: center;">
                <a href="${viewLink}" style="background: #6b21a8; color: white; padding: 16px 32px; border-radius: 50px; text-decoration: none; font-weight: bold; font-size: 18px; display: inline-block; box-shadow: 0 4px 15px rgba(107, 33, 168, 0.3);">
                  View Full Memory
                </a>
              </div>

              <p style="font-size: 14px; color: #888; text-align: center; margin-bottom: 0;">
                Click the button above to read the message and view any attached photos or videos.
              </p>
              
              <hr style="border: 0; border-top: 1px solid #eee; margin: 30px 0;" />
              
              <p style="font-size: 12px; color: #aaa; text-align: center;">
                Secured by GhostPost Legacy Vault
              </p>
            </div>
          </div>
        `,
      });

      // 4. Mark as Sent
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