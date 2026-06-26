"use client";

import Link from "next/link";
import { Suspense, useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ReadingReportView } from "@/components/reading/reading-report";
import { TarotCardPreview } from "@/components/tarot/tarot-card-preview";
import { getReadingById, saveReadingRecord } from "@/lib/storage/history";
import { formatDateTime } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { getQuestionTypeLabel, getSpreadLabel } from "@/lib/constants";
import type { ReadingRecord } from "@/lib/tarot/types";

function ResultContent() {
  const searchParams = useSearchParams();
  const readingId = searchParams.get("id");
  const hasCheckoutReturn = searchParams.has("payment") || searchParams.has("order_id") || searchParams.has("checkout_id");
  const [record, setRecord] = useState<ReadingRecord | null>(null);
  const [loadingRecord, setLoadingRecord] = useState(true);

  const refreshFromServer = useCallback(async () => {
    if (!readingId) {
      return null;
    }

    const response = await fetch(`/api/reading?id=${readingId}`, {
      cache: "no-store"
    });

    if (!response.ok) {
      return null;
    }

    const payload = (await response.json()) as ReadingRecord;
    saveReadingRecord(payload);
    setRecord(payload);
    return payload;
  }, [readingId]);

  useEffect(() => {
    let cancelled = false;

    async function loadRecord() {
      if (!readingId) {
        setLoadingRecord(false);
        return;
      }

      const localRecord = getReadingById(readingId);
      if (!cancelled && localRecord) {
        setRecord(localRecord);
      }

      try {
        const serverRecord = await refreshFromServer();
        if (!cancelled && serverRecord) {
          setRecord(serverRecord);
        }
      } finally {
        if (!cancelled) {
          setLoadingRecord(false);
        }
      }
    }

    void loadRecord();

    return () => {
      cancelled = true;
    };
  }, [readingId, refreshFromServer]);

  useEffect(() => {
    if (!readingId || (!hasCheckoutReturn && record?.paymentStatus !== "pending")) {
      return;
    }

    let attempts = 0;
    const timer = window.setInterval(async () => {
      attempts += 1;
      const serverRecord = await refreshFromServer();
      if (serverRecord?.paymentStatus === "unlocked" || attempts >= 20) {
        window.clearInterval(timer);
      }
    }, 3000);

    return () => {
      window.clearInterval(timer);
    };
  }, [hasCheckoutReturn, readingId, record?.paymentStatus, refreshFromServer]);

  if (loadingRecord) {
    return (
      <main className="mx-auto max-w-4xl px-6 py-16 text-center md:px-10">
        <p className="text-sm text-mist/70">正在载入这次抽牌结果...</p>
      </main>
    );
  }

  if (!readingId || !record) {
    return (
      <main className="mx-auto max-w-4xl px-6 py-16 text-center md:px-10">
        <h1 className="text-3xl font-semibold text-white">没有找到这次解读</h1>
        <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-mist/75">
          可能是本地记录已经被清理，或者你是从其他设备打开了结果页。先重新抽一组牌，我们会把结果保存在当前浏览器里。
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Link href="/draw">
            <Button>重新抽牌</Button>
          </Link>
          <Link href="/history">
            <Button variant="secondary">查看历史</Button>
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-6xl px-6 py-10 md:px-10 md:py-14">
      <div className="mb-8 grid gap-3">
        <p className="text-sm font-medium text-gold">Reading Result</p>
        <h1 className="text-3xl font-semibold text-white md:text-4xl">这次抽牌已经完成，先看清楚牌面，再读它的回答。</h1>
        <p className="text-sm leading-7 text-mist/75">
          提问时间：{formatDateTime(record.createdAt)} | 问题类型：{getQuestionTypeLabel(record.questionType)} | 牌阵：
          {getSpreadLabel(record.spreadKey)}
        </p>
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5 text-sm leading-7 text-mist/85 shadow-soft">
          <p className="text-xs uppercase tracking-[0.2em] text-mist/50">你的问题</p>
          <p className="mt-3 text-base text-white">{record.question}</p>
        </div>
      </div>

      <section className="mb-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {record.cards.map((card) => (
          <TarotCardPreview key={`${record.id}-${card.id}-${card.position.key}`} card={card} />
        ))}
      </section>

      <ReadingReportView
        record={record}
        onRecordChange={setRecord}
        onRefreshStatus={async () => {
          await refreshFromServer();
        }}
      />
    </main>
  );
}

export default function ResultPage() {
  return (
    <Suspense
      fallback={
        <main className="mx-auto max-w-4xl px-6 py-16 text-center md:px-10">
          <p className="text-sm text-mist/70">正在载入这次抽牌结果...</p>
        </main>
      }
    >
      <ResultContent />
    </Suspense>
  );
}
