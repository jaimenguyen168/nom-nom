import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { nomnomDb } from "@/db";
import { cookbookPurchases, userSavedCookbooks } from "@/db/schemas/cookbooks";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "No signature" }, { status: 400 });
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!,
    );
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const { cookbookId, userId, pricePaid, currency } = session.metadata ?? {};

    if (!cookbookId || !userId) {
      return NextResponse.json({ error: "Missing metadata" }, { status: 400 });
    }

    await Promise.all([
      nomnomDb
        .insert(cookbookPurchases)
        .values({
          cookbookId,
          userId,
          pricePaid: pricePaid ?? "0",
          currency: currency ?? "USD",
          stripePaymentIntentId: session.payment_intent as string,
        })
        .onConflictDoNothing(),

      // Also save to library so it shows up in saved cookbooks
      nomnomDb
        .insert(userSavedCookbooks)
        .values({ cookbookId, userId })
        .onConflictDoNothing(),
    ]);
  }

  return NextResponse.json({ received: true });
}
