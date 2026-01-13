import { Stripe } from "stripe";
import { auth } from "@/auth";

// Initialize Stripe with your TEST key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
export const dynamic = 'force-dynamic';
export async function POST(req: Request) {
  const session = await auth();
  if (!session) return new Response("Unauthorized", { status: 401 });

  const { capsuleId } = await req.json();

  const stripeSession = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "usd", // You can change to "inr" for Rupees
          product_data: { name: "Time Capsule Premium" },
          unit_amount: 500, // 500 cents = $5.00 (or 500 paise = ₹5.00)
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: `http://localhost:3000/dashboard?success=true`,
    cancel_url: `http://localhost:3000/dashboard?canceled=true`,
    metadata: { capsuleId }, // Pass the ID so we know which capsule to unlock
  });

  return Response.json({ url: stripeSession.url });
}