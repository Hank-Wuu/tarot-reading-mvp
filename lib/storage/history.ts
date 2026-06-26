import type { ReadingRecord } from "@/lib/tarot/types";

const STORAGE_KEY = "tarot-reading-history";

export function getReadingHistory(): ReadingRecord[] {
  if (typeof window === "undefined") {
    return [];
  }

  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return [];
  }

  try {
    return JSON.parse(raw) as ReadingRecord[];
  } catch {
    return [];
  }
}

export function saveReadingRecord(record: ReadingRecord) {
  if (typeof window === "undefined") {
    return;
  }

  const current = getReadingHistory();
  const next = [record, ...current.filter((item) => item.id !== record.id)].slice(0, 20);
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
}

export function getReadingById(id: string) {
  return getReadingHistory().find((item) => item.id === id) ?? null;
}

export function updateReadingRecord(id: string, updater: (record: ReadingRecord) => ReadingRecord) {
  if (typeof window === "undefined") {
    return null;
  }

  const current = getReadingHistory();
  let updatedRecord: ReadingRecord | null = null;
  const next = current.map((record) => {
    if (record.id !== id) {
      return record;
    }

    updatedRecord = updater(record);
    return updatedRecord;
  });

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  return updatedRecord;
}

export function clearReadingHistory() {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(STORAGE_KEY);
}
