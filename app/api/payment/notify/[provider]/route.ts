import { NextResponse } from "next/server";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ provider: string }> }
) {
  const { provider } = await params;

  try {
    const payload = (await request.json()) as {
      orderId?: string;
      tradeStatus?: string;
    };

    if (!payload.orderId) {
      return NextResponse.json({ error: "orderId is required" }, { status: 400 });
    }

    if (!["alipay", "wechat"].includes(provider)) {
      return NextResponse.json({ error: "unsupported provider" }, { status: 400 });
    }

    return NextResponse.json({
      ok: true,
      accepted: false,
      message:
        "当前版本已经切到 Creem 托管支付 + Webhook 自动解锁，这个旧直连接口只保留为未来切换渠道时参考。"
    });
  } catch {
    return NextResponse.json({ error: "notify_failed" }, { status: 500 });
  }
}
