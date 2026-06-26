import { NextResponse } from "next/server";
import { createPaymentOrder } from "@/lib/payment/service";

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as {
      readingId?: string;
    };

    if (!payload.readingId) {
      return NextResponse.json({ error: "readingId is required" }, { status: 400 });
    }

    const order = await createPaymentOrder({
      readingId: payload.readingId
    });

    return NextResponse.json(order);
  } catch (error) {
    const message = error instanceof Error ? error.message : "failed_to_create_order";
    const status =
      message === "payment_storage_unavailable" ||
      message === "creem_api_key_not_configured" ||
      message === "creem_product_id_not_configured"
        ? 501
        : message === "reading_not_found"
          ? 404
        : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
