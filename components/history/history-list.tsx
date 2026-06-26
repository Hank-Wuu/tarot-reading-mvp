"use client";

import Link from "next/link";
import { clearReadingHistory, getReadingHistory } from "@/lib/storage/history";
import { formatDateTime, truncateText } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { getSpreadLabel } from "@/lib/constants";
import type { ReadingRecord } from "@/lib/tarot/types";

export function HistoryList() {
  const [records, setRecords] = useState<ReadingRecord[]>([]);

  useEffect(() => {
    setRecords(getReadingHistory());
  }, []);

  return (
    <section className="grid gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-semibold text-white">最近抽牌记录</h1>
          <p className="mt-2 text-sm leading-7 text-mist/75">
            未登录状态下保存在 localStorage。接入 Supabase 登录后，这里可以直接切到云端持久化。
          </p>
        </div>
        {records.length ? (
          <Button
            variant="secondary"
            onClick={() => {
              clearReadingHistory();
              setRecords([]);
            }}
          >
            清空本地记录
          </Button>
        ) : null}
      </div>

      {records.length ? (
        <div className="grid gap-4">
          {records.map((record) => (
            <Link
              key={record.id}
              href={`/result?id=${record.id}`}
              className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-soft transition hover:bg-white/[0.07]"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-white">{truncateText(record.question, 72)}</p>
                  <p className="mt-2 text-xs text-mist/60">{formatDateTime(record.createdAt)}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className="rounded-full border border-white/10 bg-night/50 px-3 py-1 text-xs text-mist/75">
                    {getSpreadLabel(record.spreadKey)}
                  </span>
                  <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-mist/75">
                    {record.paymentStatus === "locked" && "未解锁"}
                    {record.paymentStatus === "pending" && "待支付"}
                    {record.paymentStatus === "unlocked" && "已解锁"}
                    {record.paymentStatus === "failed" && "失败"}
                  </span>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {record.cards.map((card) => (
                  <span key={`${record.id}-${card.id}-${card.position.key}`} className="rounded-full bg-white/5 px-3 py-1 text-xs text-mist/80">
                    {card.position.label} · {card.name_cn} · {card.orientation === "upright" ? "正位" : "逆位"}
                  </span>
                ))}
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="rounded-3xl border border-dashed border-white/10 bg-white/5 p-10 text-center">
          <p className="text-lg font-medium text-white">你还没有抽牌记录</p>
          <p className="mt-3 text-sm leading-7 text-mist/70">先去抽一组牌，解读会自动保存在当前设备里。</p>
          <div className="mt-6">
            <Link href="/draw">
              <Button>去抽牌</Button>
            </Link>
          </div>
        </div>
      )}
    </section>
  );
}
