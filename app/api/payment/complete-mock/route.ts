import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as {
      orderId?: string;
      readingId?: string;
    };

    if (!payload.orderId || !payload.readingId) {
      return NextResponse.json({ error: "orderId and readingId are required" }, { status: 400 });
    }

    return NextResponse.json({
      ok: false,
      deprecated: true,
      orderId: payload.orderId,
      readingId: payload.readingId,
      message: "当前版本已切换到 Creem 托管支付 + Webhook 自动解锁，这个 mock 支付接口仅作兼容保留。"
    });
  } catch {
    return NextResponse.json({ error: "mock_complete_failed" }, { status: 500 });
  }
}
