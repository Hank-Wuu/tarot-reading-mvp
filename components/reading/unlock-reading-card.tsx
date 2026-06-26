"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { CHECKOUT_UNLOCK_STEPS } from "@/lib/constants";
import { getPaymentOrderById, savePaymentOrder } from "@/lib/storage/orders";
import { updateReadingRecord } from "@/lib/storage/history";
import type { PaymentOrder, ReadingRecord } from "@/lib/tarot/types";

function getCheckoutErrorMessage(error: string) {
  switch (error) {
    case "payment_storage_unavailable":
      return "要启用自动解锁，先把 Supabase 环境变量补齐，让服务端能保存订单和解读记录。";
    case "creem_api_key_not_configured":
      return "还没有配置 Creem API Key，先在环境变量里补上。";
    case "creem_product_id_not_configured":
      return "还没有配置 Creem 商品 ID，先在环境变量里补上。";
    case "reading_not_found":
      return "服务端没有找到这次解读记录，请重新抽一次牌后再支付。";
    case "creem_checkout_failed":
      return "创建支付链接失败，请稍后重试。";
    default:
      return "打开支付页失败，请稍后重试。";
  }
}

export function UnlockReadingCard({
  record,
  onRecordChange,
  onRefreshStatus
}: {
  record: ReadingRecord;
  onRecordChange: (record: ReadingRecord) => void;
  onRefreshStatus: () => Promise<void>;
}) {
  const [opening, setOpening] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const existingOrder = useMemo(() => {
    if (!record.lastOrderId) {
      return null;
    }

    return getPaymentOrderById(record.lastOrderId);
  }, [record.lastOrderId]);

  async function handleOpenCheckout() {
    setOpening(true);
    setError(null);
    setSuccess(null);

    try {
      let order = existingOrder;

      if (!order || order.status !== "pending") {
        const response = await fetch("/api/payment/create-order", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            readingId: record.id
          })
        });

        const payload = (await response.json()) as PaymentOrder | { error: string };
        if (!response.ok || "error" in payload) {
          throw new Error("error" in payload ? payload.error : "create_order_failed");
        }

        order = payload;
        savePaymentOrder(order);
      }

      const nextRecord =
        updateReadingRecord(record.id, (current) => ({
          ...current,
          paymentStatus: "pending",
          lastOrderId: order.id
        })) ?? {
          ...record,
          paymentStatus: "pending" as const,
          lastOrderId: order.id
        };

      onRecordChange(nextRecord);
      window.location.assign(order.paymentUrl);
    } catch (err) {
      setError(err instanceof Error ? getCheckoutErrorMessage(err.message) : "打开支付页失败，请稍后重试。");
    } finally {
      setOpening(false);
    }
  }

  async function handleRefreshStatus() {
    setRefreshing(true);
    setError(null);
    setSuccess(null);

    try {
      await onRefreshStatus();
      setSuccess("已刷新支付状态。如果付款已经到账，页面会自动显示完整报告。");
    } catch {
      setError("刷新支付状态失败，请稍后再试。");
    } finally {
      setRefreshing(false);
    }
  }

  return (
    <div className="w-full max-w-xl space-y-4 text-left">
      <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
        <p className="text-sm font-medium text-white">解锁流程</p>
        <ol className="mt-3 grid gap-2 text-sm leading-7 text-mist/75">
          {CHECKOUT_UNLOCK_STEPS.map((item, index) => (
            <li key={item}>
              {index + 1}. {item}
            </li>
          ))}
        </ol>
      </div>

      {record.paymentStatus === "pending" ? (
        <p className="text-sm text-amber-100">你已经发起过支付。完成付款后，这个结果页会自动同步解锁状态。</p>
      ) : null}

      {error ? <p className="text-sm text-rose-200">{error}</p> : null}
      {success ? <p className="text-sm text-emerald-200">{success}</p> : null}

      <div className="flex flex-wrap gap-3">
        <Button onClick={handleOpenCheckout} disabled={opening}>
          {opening ? "正在创建支付页..." : "前往支付页解锁"}
        </Button>
        <Button onClick={handleRefreshStatus} disabled={refreshing} variant="secondary">
          {refreshing ? "正在刷新状态..." : "刷新解锁状态"}
        </Button>
      </div>
    </div>
  );
}
