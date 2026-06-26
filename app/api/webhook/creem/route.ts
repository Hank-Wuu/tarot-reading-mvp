import { NextResponse } from "next/server";
import { markReadingUnlockedFromCheckout, verifyCreemWebhookSignature } from "@/lib/payment/service";

type CreemWebhookPayload = {
  id?: string;
  eventType?: string;
  object?: {
    id?: string;
    request_id?: string;
    metadata?: {
      orderId?: string;
      readingId?: string;
      source?: string;
    };
    customer?: {
      email?: string | null;
    };
    order?: {
      id?: string;
      status?: string;
    };
    status?: string;
  };
};

export async function POST(request: Request) {
  const rawBody = await request.text();
  const signature = request.headers.get("creem-signature");

  if (!signature || !verifyCreemWebhookSignature(rawBody, signature)) {
    return NextResponse.json({ error: "invalid_signature" }, { status: 401 });
  }

  try {
    const payload = JSON.parse(rawBody) as CreemWebhookPayload;

    if (payload.eventType !== "checkout.completed") {
      return NextResponse.json({ ok: true, ignored: true });
    }

    const metadata = payload.object?.metadata;
    const orderId = metadata?.orderId || payload.object?.request_id;
    const readingId = metadata?.readingId;
    const orderStatus = payload.object?.order?.status;

    if (!orderId || !readingId || orderStatus !== "paid") {
      return NextResponse.json({ error: "invalid_checkout_payload" }, { status: 400 });
    }

    await markReadingUnlockedFromCheckout({
      readingId,
      orderId,
      checkoutId: payload.object?.id,
      creemOrderId: payload.object?.order?.id,
      customerEmail: payload.object?.customer?.email,
      eventId: payload.id
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "webhook_processing_failed" }, { status: 500 });
  }
}
