import { PLACEHOLDER_PRODUCTS } from "@/lib/constants";
import type { ReadingRecord } from "@/lib/tarot/types";
import { UnlockReadingCard } from "@/components/reading/unlock-reading-card";

export function ReadingReportView({
  record,
  onRecordChange,
  onRefreshStatus
}: {
  record: ReadingRecord;
  onRecordChange: (record: ReadingRecord) => void;
  onRefreshStatus: () => Promise<void>;
}) {
  const { report } = record;
  const isUnlocked = record.paymentStatus === "unlocked";
  const isPending = record.paymentStatus === "pending";

  return (
    <section className="grid gap-6">
      <article className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-soft md:p-8">
        <p className="text-sm font-medium text-gold">总体能量</p>
        <h2 className="mt-3 text-2xl font-semibold text-white">这次牌面先告诉你的，是一个方向感。</h2>
        <p className="mt-4 text-sm leading-8 text-mist/80 md:text-base">{report.overallEnergy}</p>
      </article>

      <article className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-soft md:p-8">
        <div className="mb-5 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-gold">免费版内容</p>
            <h3 className="mt-2 text-xl font-semibold text-white">已展示概要与核心回答</h3>
          </div>
          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-mist/75">
            当前状态：
            {record.paymentStatus === "locked" && "未解锁"}
            {record.paymentStatus === "pending" && "待支付"}
            {record.paymentStatus === "unlocked" && "已解锁"}
            {record.paymentStatus === "failed" && "支付失败"}
          </span>
        </div>

        <div className="grid gap-5">
          <div className="rounded-2xl border border-white/10 bg-night/50 p-5">
            <p className="text-sm font-medium text-white">针对问题的直接回答</p>
            <p className="mt-3 text-sm leading-7 text-mist/80">{report.directAnswer}</p>
          </div>
          <div className="rounded-2xl border border-dashed border-gold/30 bg-gold/8 p-5">
            <p className="text-sm font-medium text-white">完整解读预告</p>
            <p className="mt-3 text-sm leading-7 text-mist/80">{report.teaser}</p>
          </div>
        </div>
      </article>

      <article className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 shadow-soft md:p-8">
        <div className={`space-y-6 ${isUnlocked ? "" : "opacity-45 blur-[1px]"}`}>
          <div>
            <p className="text-sm font-medium text-gold">每张牌在当前位置的含义</p>
            <div className="mt-4 grid gap-4">
              {report.positionReadings.map((item) => (
                <div key={`${item.position}-${item.cardName}`} className="rounded-2xl border border-white/10 bg-night/40 p-4">
                  <p className="text-sm font-medium text-white">
                    {item.position} · {item.cardName} · {item.orientation === "upright" ? "正位" : "逆位"}
                  </p>
                  <p className="mt-2 text-sm leading-7 text-mist/75">{item.content}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-night/40 p-4">
            <p className="text-sm font-medium text-white">牌与牌之间的组合解读</p>
            <p className="mt-3 text-sm leading-7 text-mist/75">{report.combinationReading}</p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-night/40 p-4">
              <p className="text-sm font-medium text-white">行动建议</p>
              <p className="mt-3 text-sm leading-7 text-mist/75">{report.actionAdvice}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-night/40 p-4">
              <p className="text-sm font-medium text-white">风险提醒</p>
              <p className="mt-3 text-sm leading-7 text-mist/75">{report.riskReminder}</p>
            </div>
          </div>
        </div>

        {!isUnlocked ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-gradient-to-b from-night/30 via-night/70 to-night/90 px-6 text-center">
            <div className="rounded-full border border-gold/30 bg-gold/10 px-3 py-1 text-xs text-gold">
              {isPending ? "Pending" : "Locked"}
            </div>
            <div className="max-w-lg space-y-2">
              <h3 className="text-2xl font-semibold text-white">
                {isPending ? "支付已发起，等待自动解锁" : "完整解读需要解锁"}
              </h3>
              <p className="text-sm leading-7 text-mist/75">
                {isPending
                  ? "支付完成后，系统会通过回调自动解锁完整报告。若第三方回跳稍慢，可以手动刷新状态。"
                  : "当前版本使用托管支付页完成收款，付款成功后会自动解锁完整报告，不需要人工发码。"}
              </p>
            </div>
            <UnlockReadingCard
              record={record}
              onRecordChange={onRecordChange}
              onRefreshStatus={onRefreshStatus}
            />
          </div>
        ) : null}
      </article>

      {isUnlocked ? (
        <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-4 text-sm leading-7 text-emerald-100">
          已解锁完整解读。当前版本已经是自动化支付解锁结构，后续只需要替换支付渠道或补更细的订单运营能力。
        </div>
      ) : (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm leading-7 text-mist/75">
          当前商品：{PLACEHOLDER_PRODUCTS[0].name} · {PLACEHOLDER_PRODUCTS[0].priceLabel}
        </div>
      )}

      <p className="text-xs leading-6 text-mist/55">{report.disclaimer}</p>
    </section>
  );
}
