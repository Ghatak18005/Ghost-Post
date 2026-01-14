import { NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";

// 1. GET SINGLE CAPSULE (For Edit Page)
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    const { id } = await params;

    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const capsule = await prisma.capsule.findUnique({ where: { id } });
    if (!capsule) return NextResponse.json({ error: "Not found" }, { status: 404 });

    if (capsule.userId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json(capsule);
  } catch (error) {
    return NextResponse.json({ error: "Fetch failed" }, { status: 500 });
  }
}

// 2. DELETE CAPSULE
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

    if (capsule.userId !== session.user.id) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    // 🛑 TIME CHECK: 24 HOURS
    const unlockTime = new Date(capsule.unlockDate).getTime();
    const now = Date.now();
    const hoursLeft = (unlockTime - now) / (1000 * 60 * 60);

    if (hoursLeft < 24 && hoursLeft > 0) {
      return NextResponse.json(
        { error: "Cannot delete! Capsules are permanently locked 24 hours before sending." },
        { status: 403 }
      );
    }

    await prisma.capsule.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}

// 3. EDIT CAPSULE
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    const { id } = await params;

    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { title, message } = await req.json();

    const capsule = await prisma.capsule.findUnique({ where: { id } });
    if (!capsule) return NextResponse.json({ error: "Not found" }, { status: 404 });

    if (capsule.userId !== session.user.id) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    // 🛑 TIME CHECK: 1 HOUR
    const unlockTime = new Date(capsule.unlockDate).getTime();
    const now = Date.now();
    const hoursLeft = (unlockTime - now) / (1000 * 60 * 60);

    if (hoursLeft < 1 && hoursLeft > 0) {
      return NextResponse.json(
        { error: "Capsule is sealed! Editing is disabled 1 hour before release." },
        { status: 403 }
      );
    }

    const updated = await prisma.capsule.update({
      where: { id },
      data: { title, message },
    });

    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}