import Link from "next/link";
import { HeroSection } from "@/components/home/hero-section";
import { ScenarioGrid } from "@/components/home/scenario-grid";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <main className="pb-20">
      <HeroSection />
      <ScenarioGrid />
      <section className="mx-auto max-w-6xl px-6 pt-4 md:px-10">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-6 text-center shadow-soft md:p-10">
          <h2 className="text-2xl font-semibold text-white">准备好开始了吗？</h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-mist/75 md:text-base">
            输入一个你真正想看清的问题，系统会先完成随机抽牌，再输出带结构的中文结果页。
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link href="/draw">
              <Button>开始抽牌</Button>
            </Link>
            <Link href="/history">
              <Button variant="secondary">查看历史</Button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
