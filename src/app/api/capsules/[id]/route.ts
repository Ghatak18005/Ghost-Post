import { NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { encrypt, decrypt } from "@/lib/crypto"; 

// ----------------------------------------------------------------
// 1. GET SINGLE CAPSULE (Unscramble for Edit Page/View)
// ----------------------------------------------------------------
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    const { id } = await params;

    // 1. Check Auth
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Fetch Capsule
    const capsule = await prisma.capsule.findUnique({ 
      where: { id } 
    });

    if (!capsule) {
      return NextResponse.json({ error: "Capsule not found" }, { status: 404 });
    }

    // 3. Verify Ownership
    if (capsule.userId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // 4. 🔓 DECRYPT SENSITIVE DATA
    // We must unscramble the text before sending it to the frontend editor
    const decryptedCapsule = {
      ...capsule,
      title: decrypt(capsule.title),
      message: decrypt(capsule.message),
      recipientEmail: decrypt(capsule.recipientEmail || ""),
      fileUrl: capsule.fileUrl ? decrypt(capsule.fileUrl) : null,
    };

    return NextResponse.json(decryptedCapsule);

  } catch (error) {
    console.error("Fetch Error:", error);
    return NextResponse.json({ error: "Fetch failed" }, { status: 500 });
  }
}

// ----------------------------------------------------------------
// 2. DELETE CAPSULE (Allowed only if > 24 Hours until unlock)
// ----------------------------------------------------------------
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    const { id } = await params;

    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const capsule = await prisma.capsule.findUnique({ where: { id } });
    if (!capsule) return NextResponse.json({ error: "Capsule not found" }, { status: 404 });

    if (capsule.userId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // 🛑 TIME CHECK: 24 HOURS
    const unlockTime = new Date(capsule.unlockDate).getTime();
    const now = Date.now();
    const hoursLeft = (unlockTime - now) / (1000 * 60 * 60);

    // If less than 24 hours left, BLOCK DELETE
    if (hoursLeft < 24 && hoursLeft > 0) {
      return NextResponse.json(
        { error: "Cannot delete! Capsules are permanently locked 24 hours before sending." },
        { status: 403 }
      );
    }

    await prisma.capsule.delete({ where: { id } });

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("Delete Error:", error);
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}

// ----------------------------------------------------------------
// 3. EDIT CAPSULE (Encrypt updates, check 1 Hour Rule)
// ----------------------------------------------------------------
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    const { id } = await params;

    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // 1. Get ALL fields from request
    const { title, message, recipientEmail, fileUrl } = await req.json();

    const capsule = await prisma.capsule.findUnique({ where: { id } });
    if (!capsule) return NextResponse.json({ error: "Not found" }, { status: 404 });

    if (capsule.userId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // 🛑 TIME CHECK: 1 HOUR RULE
    const unlockTime = new Date(capsule.unlockDate).getTime();
    const now = Date.now();
    const hoursLeft = (unlockTime - now) / (1000 * 60 * 60);

    // If less than 1 hour left, BLOCK EDIT
    if (hoursLeft < 1 && hoursLeft > 0) {
      return NextResponse.json(
        { error: "Capsule is sealed! Editing is disabled 1 hour before release." },
        { status: 403 }
      );
    }

    // 2. 🔒 ENCRYPT & UPDATE
    const updated = await prisma.capsule.update({
      where: { id },
      data: { 
        title: encrypt(title),             // Scramble
        message: encrypt(message),         // Scramble
        recipientEmail: encrypt(recipientEmail), // Scramble
        fileUrl: fileUrl ? encrypt(fileUrl) : null // Scramble (even large base64 strings)
      },
    });

    return NextResponse.json(updated);

  } catch (error) {
    console.error("Update Error:", error);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}