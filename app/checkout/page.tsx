import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function CheckoutPage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-16 text-center md:px-10">
      <h1 className="text-3xl font-semibold text-white">当前版本不使用站内支付页</h1>
      <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-mist/75">
        这一版已经改成“托管支付页付款 + Webhook 自动解锁”。如果你是从旧链接进入这里，直接回到抽牌结果页，点击“前往支付页解锁”即可。
      </p>
      <div className="mt-6 flex justify-center gap-3">
        <Link href="/history">
          <Button>查看历史记录</Button>
        </Link>
        <Link href="/draw">
          <Button variant="secondary">重新抽牌</Button>
        </Link>
      </div>
    </main>
  );
}
