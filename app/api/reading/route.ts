import { NextResponse } from "next/server";
import { generateReading } from "@/lib/ai/reading-service";
import { getReadingRecordFromServer, persistReadingRecord } from "@/lib/readings/server";
import type { ReadingInput, ReadingRecord } from "@/lib/tarot/types";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "id is required" }, { status: 400 });
  }

  try {
    const record = await getReadingRecordFromServer(id);
    if (!record) {
      return NextResponse.json({ error: "reading_not_found" }, { status: 404 });
    }

    return NextResponse.json(record);
  } catch {
    return NextResponse.json({ error: "failed_to_fetch_reading" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as ReadingInput & { id?: string };

    if (!payload.question?.trim()) {
      return NextResponse.json({ error: "question is required" }, { status: 400 });
    }

    if (!payload.cards?.length) {
      return NextResponse.json({ error: "cards are required" }, { status: 400 });
    }

    const report = await generateReading(payload);

    if (payload.id) {
      const record: ReadingRecord = {
        id: payload.id,
        question: payload.question.trim(),
        questionType: payload.questionType,
        spreadKey: payload.spreadKey,
        cards: payload.cards,
        report,
        createdAt: new Date().toISOString(),
        paymentStatus: "locked"
      };

      await persistReadingRecord(record);
    }

    return NextResponse.json(report);
  } catch (error) {
    const message = error instanceof Error ? error.message : "failed_to_generate_reading";
    const status = message === "failed_to_persist_reading" ? 503 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
