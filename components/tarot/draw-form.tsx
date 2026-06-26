"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { QUESTION_TYPE_OPTIONS, SPREAD_OPTIONS } from "@/lib/constants";
import { drawCardsBySpread } from "@/lib/tarot/draw";
import { saveReadingRecord } from "@/lib/storage/history";
import type { QuestionType, ReadingRecord, SpreadKey } from "@/lib/tarot/types";
import { Button } from "@/components/ui/button";

export function DrawForm() {
  const router = useRouter();
  const [question, setQuestion] = useState("");
  const [questionType, setQuestionType] = useState<QuestionType>("love");
  const [spreadKey, setSpreadKey] = useState<SpreadKey>("single");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectedSpread = useMemo(
    () => SPREAD_OPTIONS.find((item) => item.value === spreadKey),
    [spreadKey]
  );

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!question.trim()) {
      setError("先输入一个你想问的问题，我们再开始抽牌。");
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const recordId = crypto.randomUUID();
      const cards = drawCardsBySpread(spreadKey);
      const response = await fetch("/api/reading", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          id: recordId,
          question: question.trim(),
          questionType,
          spreadKey,
          cards
        })
      });

      if (!response.ok) {
        throw new Error("生成解读失败");
      }

      const report = await response.json();
      const record: ReadingRecord = {
        id: recordId,
        question: question.trim(),
        questionType,
        spreadKey,
        cards,
        report,
        createdAt: new Date().toISOString(),
        paymentStatus: "locked"
      };

      saveReadingRecord(record);
      router.push(`/result?id=${record.id}`);
    } catch {
      setError("这次解读没有顺利生成，请稍后再试一次。");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-8 rounded-3xl border border-white/10 bg-white/5 p-6 shadow-soft md:p-8">
      <div className="grid gap-3">
        <label htmlFor="question" className="text-sm font-medium text-white">
          你的问题
        </label>
        <textarea
          id="question"
          value={question}
          onChange={(event) => setQuestion(event.target.value)}
          placeholder="例如：这段关系接下来还有没有继续发展的可能？"
          className="min-h-32 rounded-2xl border border-white/10 bg-night/60 px-4 py-3 text-sm text-white outline-none placeholder:text-mist/40 focus:border-gold/60"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <fieldset className="grid gap-3">
          <legend className="mb-1 text-sm font-medium text-white">问题类型</legend>
          <div className="grid gap-3">
            {QUESTION_TYPE_OPTIONS.map((option) => (
              <label
                key={option.value}
                className={`rounded-2xl border p-4 transition ${
                  questionType === option.value
                    ? "border-gold/60 bg-gold/10"
                    : "border-white/10 bg-night/50 hover:bg-white/5"
                }`}
              >
                <input
                  type="radio"
                  name="questionType"
                  value={option.value}
                  checked={questionType === option.value}
                  onChange={() => setQuestionType(option.value)}
                  className="sr-only"
                />
                <p className="text-sm font-medium text-white">{option.label}</p>
                <p className="mt-1 text-xs leading-6 text-mist/70">{option.hint}</p>
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset className="grid gap-3">
          <legend className="mb-1 text-sm font-medium text-white">牌阵选择</legend>
          <div className="grid gap-3">
            {SPREAD_OPTIONS.map((option) => (
              <label
                key={option.value}
                className={`rounded-2xl border p-4 transition ${
                  spreadKey === option.value
                    ? "border-rose/60 bg-rose/10"
                    : "border-white/10 bg-night/50 hover:bg-white/5"
                }`}
              >
                <input
                  type="radio"
                  name="spreadKey"
                  value={option.value}
                  checked={spreadKey === option.value}
                  onChange={() => setSpreadKey(option.value)}
                  className="sr-only"
                />
                <p className="text-sm font-medium text-white">{option.label}</p>
                <p className="mt-1 text-xs leading-6 text-mist/70">{option.summary}</p>
              </label>
            ))}
          </div>
        </fieldset>
      </div>

      <div className="rounded-2xl border border-white/10 bg-night/50 p-4 text-sm text-mist/80">
        当前牌阵：<span className="font-medium text-white">{selectedSpread?.label}</span>
        <p className="mt-2 leading-7 text-mist/65">{selectedSpread?.summary}</p>
      </div>

      {error ? <p className="text-sm text-rose-200">{error}</p> : null}

      <div className="flex flex-wrap gap-3">
        <Button type="submit" disabled={loading}>
          {loading ? "正在抽牌并生成解读..." : "开始抽牌"}
        </Button>
        <Button
          type="button"
          variant="secondary"
          onClick={() => {
            setQuestion("");
            setQuestionType("love");
            setSpreadKey("single");
            setError(null);
          }}
        >
          重置
        </Button>
      </div>
    </form>
  );
}
