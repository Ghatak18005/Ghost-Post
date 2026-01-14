import { NextResponse } from "next/server";
import { Stripe } from "stripe";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: Request) {
  const body = await req.text();
  const signature = (await headers()).get("Stripe-Signature") as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, endpointSecret);
  } catch (err: any) {
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const userId = session?.metadata?.userId;
    // Get the specific plan they bought
    const purchasedPlan = session?.metadata?.purchasedPlan; 

    if (userId && purchasedPlan) {
      // UPGRADE THE USER to the specific plan
      await prisma.user.update({
        where: { id: userId },
        data: { plan: purchasedPlan }, // Will set to "TIME_KEEPER" or "TIME_LORD"
      });
      console.log(`User ${userId} upgraded to ${purchasedPlan}!`);
    }
  }

  return NextResponse.json({ received: true });
}