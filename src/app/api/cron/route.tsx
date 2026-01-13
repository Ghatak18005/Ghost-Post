import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import nodemailer from "nodemailer";
import { render } from "@react-email/render";
import { EmailTemplate } from "@/components/email-template";

export async function GET() {
  try {
    const now = new Date();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
    });

    const dueCapsules = await prisma.capsule.findMany({
      where: {
        unlockDate: { lte: now },
        isDelivered: false,
        status: "PENDING",
      },
      include: { user: true },
    });

    if (dueCapsules.length === 0) {
      return NextResponse.json({ message: "No capsules due." });
    }

    let sentCount = 0;

    for (const capsule of dueCapsules) {
      try {
        // 👇 FIX: Use JSX Syntax (<EmailTemplate />) inside render()
        const emailHtml = await render(
          <EmailTemplate
            senderName={capsule.user.name || "A Friend"}
            title={capsule.title}
            capsuleUrl={`${process.env.NEXTAUTH_URL || "http://localhost:3000"}/vault/${capsule.id}`}
          />
        );

        await transporter.sendMail({
          from: `"GhostPost Time Vault" <${process.env.GMAIL_USER}>`,
          to: capsule.recipient,
          subject: `Start Reading: "${capsule.title}" is now unlocked!`,
          html: emailHtml,
        });

        await prisma.capsule.update({
          where: { id: capsule.id },
          data: { isDelivered: true },
        });

        sentCount++;
      } catch (err) {
        console.error(`Failed to email ${capsule.recipient}:`, err);
      }
    }

    return NextResponse.json({
      success: true,
      processed: dueCapsules.length,
      actuallySent: sentCount,
    });
  } catch (error) {
    console.error("Cron Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
