import { getSupabaseServerClient } from "@/lib/supabase/server";
import type { ReadingRecord } from "@/lib/tarot/types";

type ReadingRow = {
  id: string;
  question: string;
  question_type: ReadingRecord["questionType"];
  spread_key: ReadingRecord["spreadKey"];
  cards: ReadingRecord["cards"];
  report_full: ReadingRecord["report"] | null;
  payment_status: ReadingRecord["paymentStatus"];
  unlocked_at: string | null;
  created_at: string;
};

type OrderSnapshotRow = {
  id: string;
  payment_status: ReadingRecord["paymentStatus"];
  paid_at: string | null;
  created_at: string;
};

function mapReadingRowToRecord(row: ReadingRow, order: OrderSnapshotRow | null): ReadingRecord | null {
  if (!row.report_full) {
    return null;
  }

  return {
    id: row.id,
    question: row.question,
    questionType: row.question_type,
    spreadKey: row.spread_key,
    cards: row.cards,
    report: row.report_full,
    createdAt: row.created_at,
    paymentStatus: row.payment_status,
    unlockedAt: row.unlocked_at ?? undefined,
    lastOrderId: order?.id
  };
}

export function isServerReadingStorageAvailable() {
  return Boolean(getSupabaseServerClient());
}

export async function persistReadingRecord(record: ReadingRecord) {
  const supabase = getSupabaseServerClient();
  if (!supabase) {
    return false;
  }

  const { error } = await supabase.from("readings").upsert(
    {
      id: record.id,
      question: record.question,
      question_type: record.questionType,
      spread_key: record.spreadKey,
      cards: record.cards,
      report_preview: {
        overallEnergy: record.report.overallEnergy,
        directAnswer: record.report.directAnswer,
        teaser: record.report.teaser,
        disclaimer: record.report.disclaimer
      },
      report_full: record.report,
      payment_status: record.paymentStatus,
      unlocked_at: record.unlockedAt ?? null,
      created_at: record.createdAt,
      updated_at: new Date().toISOString()
    },
    {
      onConflict: "id"
    }
  );

  if (error) {
    throw new Error("failed_to_persist_reading");
  }

  return true;
}

export async function getReadingRecordFromServer(id: string) {
  const supabase = getSupabaseServerClient();
  if (!supabase) {
    return null;
  }

  const { data, error } = await supabase
    .from("readings")
    .select("id, question, question_type, spread_key, cards, report_full, payment_status, unlocked_at, created_at")
    .eq("id", id)
    .maybeSingle<ReadingRow>();

  if (error) {
    throw error;
  }

  if (!data) {
    return null;
  }

  const { data: order } = await supabase
    .from("orders")
    .select("id, payment_status, paid_at, created_at")
    .eq("reading_id", id)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle<OrderSnapshotRow>();

  return mapReadingRowToRecord(data, order ?? null);
}
