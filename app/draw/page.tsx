import Link from "next/link";
import { DrawForm } from "@/components/tarot/draw-form";

export default function DrawPage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-10 md:px-10 md:py-14">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-gold">Tarot Draw</p>
          <h1 className="mt-2 text-3xl font-semibold text-white md:text-4xl">输入问题，选择牌阵，开始抽牌。</h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-mist/75 md:text-base">
            本站不会让 AI 自行“抽牌”。随机结果由系统先生成，解读只基于已经确定的牌面、牌位与结构化牌义库。
          </p>
        </div>
        <Link href="/history" className="text-sm text-mist/75 transition hover:text-white">
          查看最近记录
        </Link>
      </div>

      <DrawForm />
    </main>
  );
}
