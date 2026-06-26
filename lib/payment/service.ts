import { createHmac, timingSafeEqual } from "node:crypto";
import { DEFAULT_UNLOCK_PRODUCT_LABEL } from "@/lib/constants";
import { getReadingRecordFromServer, isServerReadingStorageAvailable } from "@/lib/readings/server";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import type { PaymentOrder } from "@/lib/tarot/types";

const PAYMENT_TTL_HOURS = 2;

type CreemCheckoutResponse = {
  id: string;
  checkout_url?: string;
  checkoutUrl?: string;
};

function getBaseUrl() {
  return process.env.NEXT_PUBLIC_APP_URL || process.env.APP_URL || "http://127.0.0.1:3000";
}

function getProductConfig() {
  return {
    id: process.env.CREEM_PRODUCT_ID || "",
    code: "full-reading",
    name: process.env.NEXT_PUBLIC_UNLOCK_PRODUCT_LABEL || DEFAULT_UNLOCK_PRODUCT_LABEL,
    amountCents: Number(process.env.NEXT_PUBLIC_UNLOCK_PRICE_CENTS || 299),
    currency: process.env.NEXT_PUBLIC_UNLOCK_CURRENCY || "USD"
  };
}

function getCreemApiKey() {
  const apiKey = process.env.CREEM_API_KEY;
  if (!apiKey) {
    throw new Error("creem_api_key_not_configured");
  }

  return apiKey;
}

function getCreemApiBaseUrl(apiKey: string) {
  return apiKey.startsWith("creem_test_") ? "https://test-api.creem.io/v1" : "https://api.creem.io/v1";
}

function getCreemWebhookSecret() {
  const secret = process.env.CREEM_WEBHOOK_SECRET;
  if (!secret) {
    throw new Error("creem_webhook_secret_not_configured");
  }

  return secret;
}

export function getPaymentAutomationConfig() {
  return {
    providerLabel: process.env.NEXT_PUBLIC_UNLOCK_PRODUCT_LABEL || DEFAULT_UNLOCK_PRODUCT_LABEL,
    isStorageReady: isServerReadingStorageAvailable(),
    hasApiKey: Boolean(process.env.CREEM_API_KEY),
    hasProductId: Boolean(process.env.CREEM_PRODUCT_ID)
  };
}

async function createCreemCheckout({
  orderId,
  readingId
}: {
  orderId: string;
  readingId: string;
}) {
  const apiKey = getCreemApiKey();
  const product = getProductConfig();
  if (!product.id) {
    throw new Error("creem_product_id_not_configured");
  }

  const response = await fetch(`${getCreemApiBaseUrl(apiKey)}/checkouts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey
    },
    body: JSON.stringify({
      product_id: product.id,
      request_id: orderId,
      success_url: `${getUnlockReturnUrl(readingId)}&payment=success`,
      metadata: {
        readingId,
        orderId,
        source: "tarot-reading"
      }
    })
  });

  if (!response.ok) {
    throw new Error("creem_checkout_failed");
  }

  const payload = (await response.json()) as CreemCheckoutResponse;
  const paymentUrl = payload.checkout_url || payload.checkoutUrl;
  if (!payload.id || !paymentUrl) {
    throw new Error("creem_checkout_failed");
  }

  return {
    checkoutId: payload.id,
    paymentUrl
  };
}

async function persistOrder(order: PaymentOrder, checkoutId: string) {
  const supabase = getSupabaseServerClient();
  if (!supabase) {
    throw new Error("payment_storage_unavailable");
  }

  const { error } = await supabase.from("orders").insert({
    id: order.id,
    reading_id: order.readingId,
    product_code: order.productId,
    payment_provider: order.provider,
    payment_channel: order.mode,
    provider_order_id: checkoutId,
    payment_status: order.status,
    amount_cents: order.amountCents,
    currency: order.currency,
    provider_payload: {
      checkout_id: checkoutId,
      payment_url: order.paymentUrl,
      source_platform: order.sourcePlatform
    },
    created_at: order.createdAt,
    updated_at: order.createdAt
  });

  if (error) {
    throw error;
  }
}

async function markReadingPending(readingId: string) {
  const supabase = getSupabaseServerClient();
  if (!supabase) {
    throw new Error("payment_storage_unavailable");
  }

  const now = new Date().toISOString();
  const { error } = await supabase
    .from("readings")
    .update({
      payment_status: "pending",
      updated_at: now
    })
    .eq("id", readingId);

  if (error) {
    throw error;
  }
}

export async function createPaymentOrder({
  readingId
}: {
  readingId: string;
}): Promise<PaymentOrder> {
  if (!isServerReadingStorageAvailable()) {
    throw new Error("payment_storage_unavailable");
  }

  const reading = await getReadingRecordFromServer(readingId);
  if (!reading) {
    throw new Error("reading_not_found");
  }

  const product = getProductConfig();
  const createdAt = new Date();
  const expiresAt = new Date(createdAt.getTime() + PAYMENT_TTL_HOURS * 60 * 60 * 1000);
  const id = crypto.randomUUID();
  const checkout = await createCreemCheckout({
    orderId: id,
    readingId
  });

  const order: PaymentOrder = {
    id,
    readingId,
    provider: "creem",
    productId: product.code,
    productName: product.name,
    amountCents: product.amountCents,
    currency: product.currency,
    status: "pending",
    mode: "creem_checkout",
    paymentUrl: checkout.paymentUrl,
    providerOrderId: checkout.checkoutId,
    sourcePlatform: DEFAULT_UNLOCK_PRODUCT_LABEL,
    createdAt: createdAt.toISOString(),
    expiresAt: expiresAt.toISOString()
  };

  await persistOrder(order, checkout.checkoutId);
  await markReadingPending(readingId);
  return order;
}

export async function syncPaymentStatus(readingId: string) {
  const record = await getReadingRecordFromServer(readingId);
  if (!record) {
    throw new Error("reading_not_found");
  }

  return {
    paymentStatus: record.paymentStatus,
    unlockedAt: record.unlockedAt,
    lastOrderId: record.lastOrderId
  };
}

export async function markReadingUnlockedFromCheckout({
  readingId,
  orderId,
  checkoutId,
  creemOrderId,
  customerEmail,
  eventId
}: {
  readingId: string;
  orderId: string;
  checkoutId?: string;
  creemOrderId?: string;
  customerEmail?: string | null;
  eventId?: string;
}) {
  const supabase = getSupabaseServerClient();
  if (!supabase) {
    throw new Error("payment_storage_unavailable");
  }

  const unlockedAt = new Date().toISOString();

  const { error: readingError } = await supabase
    .from("readings")
    .update({
      payment_status: "unlocked",
      unlocked_at: unlockedAt,
      updated_at: unlockedAt
    })
    .eq("id", readingId);

  if (readingError) {
    throw readingError;
  }

  const { error: orderError } = await supabase
    .from("orders")
    .update({
      provider_order_id: creemOrderId || checkoutId || orderId,
      payment_status: "unlocked",
      paid_at: unlockedAt,
      updated_at: unlockedAt,
      provider_payload: {
        checkout_id: checkoutId,
        creem_order_id: creemOrderId,
        customer_email: customerEmail,
        event_id: eventId
      }
    })
    .eq("id", orderId);

  if (orderError) {
    throw orderError;
  }

  return {
    unlockedAt
  };
}

export function verifyCreemWebhookSignature(payload: string, signature: string) {
  const secret = getCreemWebhookSecret();
  const computed = createHmac("sha256", secret).update(payload).digest("hex");
  const received = signature.trim();

  if (computed.length !== received.length) {
    return false;
  }

  return timingSafeEqual(Buffer.from(computed), Buffer.from(received));
}

export function getUnlockReturnUrl(readingId: string) {
  return `${getBaseUrl()}/result?id=${readingId}`;
}
