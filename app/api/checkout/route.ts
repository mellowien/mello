import Stripe from "stripe";
import { NextResponse } from "next/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
});

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Preis & Produkt aus Request nehmen
    const { priceId } = body;

    if (!priceId) {
      return NextResponse.json(
        { error: "priceId fehlt" },
        { status: 400 }
      );
    }

    // Stripe Checkout Session erstellen
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "subscription",
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/mitgliedschaft?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/mitgliedschaft?canceled=true`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error("Stripe Checkout Error:", err);
    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    );
  }
}
