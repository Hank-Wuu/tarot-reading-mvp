import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    {
      error: "redeem_code_flow_disabled",
      message: "当前版本已切换到自动支付解锁，不再使用兑换码流程。"
    },
    { status: 410 }
  );
}
