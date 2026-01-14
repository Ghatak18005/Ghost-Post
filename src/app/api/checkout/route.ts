import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { Stripe } from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-01-27.acacia" as any, // Cast to any to avoid TS issues with latest versions
});

// Define Plan Details
const PLANS = {
  TIME_KEEPER: {
    name: "Time Keeper Plan",
    amount: 19900, // ₹199.00 in paise
  },
  TIME_LORD: {
    name: "Time Lord Plan",
    amount: 49900, // ₹499.00 in paise
  },
};

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.email || !session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get the selected plan from request body
    const { planKey } = await req.json();
    const selectedPlan = PLANS[planKey as keyof typeof PLANS];

    if (!selectedPlan) {
      return NextResponse.json({ error: "Invalid plan selected" }, { status: 400 });
    }

    // Create Stripe Checkout Session
    // Create Stripe Checkout Session
    const checkoutSession = await stripe.checkout.sessions.create({
      // 1. DELETE 'payment_method_types' completely.
      // Stripe will now auto-detect that you want UPI because currency is 'inr'
      
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: {
              name: `GhostPost - ${selectedPlan.name}`,
              description: "Lifetime access upgrade.",
            },
            unit_amount: selectedPlan.amount,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_URL}/dashboard?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_URL}/dashboard?canceled=true`,
      customer_email: session.user.email,
      metadata: {
        userId: session.user.id,
        purchasedPlan: planKey, 
      },
    });

    return NextResponse.json({ url: checkoutSession.url });
  } catch (error) {
    console.error("Stripe Error:", error);
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}