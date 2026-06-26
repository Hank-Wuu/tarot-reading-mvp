import { cn } from "@/lib/utils";
import type { DrawnCard } from "@/lib/tarot/types";

export function TarotCardPreview({
  card,
  compact = false
}: {
  card: DrawnCard;
  compact?: boolean;
}) {
  return (
    <article
      className={cn(
        "rounded-2xl border border-white/10 bg-gradient-to-b from-white/8 to-white/0 shadow-soft",
        compact ? "p-4" : "p-5"
      )}
    >
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <p className="text-xs tracking-[0.2em] text-mist/55">{card.position.label}</p>
          <h3 className="mt-2 text-lg font-semibold text-white">{card.name_cn}</h3>
          <p className="text-sm text-mist/70">{card.name_en}</p>
        </div>
        <span
          className={cn(
            "rounded-full px-3 py-1 text-xs font-medium",
            card.orientation === "upright"
              ? "bg-emerald-400/12 text-emerald-200"
              : "bg-amber-300/12 text-amber-100"
          )}
        >
          {card.orientation === "upright" ? "正位" : "逆位"}
        </span>
      </div>

      <div className="rounded-xl border border-white/10 bg-night/50 p-4 text-sm leading-7 text-mist/80">
        <p className="mb-2 text-xs uppercase tracking-[0.2em] text-mist/50">关键词</p>
        <p>{(card.orientation === "upright" ? card.upright_keywords : card.reversed_keywords).join("、")}</p>
      </div>
    </article>
  );
}
