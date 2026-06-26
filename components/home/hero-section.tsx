import Link from "next/link";
import { APP_NAME } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Tag } from "@/components/ui/tag";

export function HeroSection() {
  return (
    <section className="star-divider mx-auto flex max-w-6xl flex-col gap-8 px-6 pb-20 pt-8 md:px-10 md:pb-24 md:pt-12">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-gold/30 bg-gold/10 text-lg text-gold">
            ✦
          </div>
          <div>
            <p className="text-sm font-semibold text-white">{APP_NAME}</p>
            <p className="text-xs text-mist/70">中文塔罗抽牌与解读 MVP</p>
          </div>
        </div>
        <Tag>免费试抽</Tag>
      </div>

      <div className="grid gap-10 md:grid-cols-[1.15fr_0.85fr] md:items-end">
        <div className="space-y-6">
          <div className="space-y-4">
            <Tag className="text-gold">结构化牌义 + AI 个性化解读</Tag>
            <h1 className="max-w-3xl text-4xl font-semibold leading-tight text-white md:text-6xl">
              带着问题来，抽出你的牌，得到一份更清晰的中文解读。
            </h1>
            <p className="max-w-2xl text-base leading-7 text-mist/80 md:text-lg">
              适合快速查看感情、事业、学业、财运与综合运势。系统先随机抽牌，再基于 78 张塔罗牌义与 AI
              生成更贴近你问题语境的结构化报告。
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link href="/draw">
              <Button>开始抽牌</Button>
            </Link>
            <Link href="/history">
              <Button variant="secondary">查看历史记录</Button>
            </Link>
          </div>
        </div>

        <div className="grid gap-4 rounded-2xl border border-white/10 bg-white/5 p-5 shadow-soft backdrop-blur">
          <div className="rounded-xl border border-white/10 bg-night/60 p-4">
            <p className="text-xs uppercase tracking-[0.22em] text-mist/60">解读结构</p>
            <div className="mt-4 space-y-3 text-sm text-mist/85">
              <p>1. 总体能量</p>
              <p>2. 每张牌在当前位置的含义</p>
              <p>3. 牌与牌之间的组合解读</p>
              <p>4. 对问题的直接回答</p>
              <p>5. 行动建议与风险提醒</p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {["单张牌", "三张牌", "关系牌阵"].map((item) => (
              <div
                key={item}
                className="rounded-xl border border-white/10 bg-gradient-to-b from-white/8 to-white/0 p-4 text-center text-sm text-white"
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
