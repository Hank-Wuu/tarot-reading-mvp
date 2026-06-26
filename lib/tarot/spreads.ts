import type { SpreadKey, SpreadPosition } from "@/lib/tarot/types";

export const spreads: Record<SpreadKey, SpreadPosition[]> = {
  single: [{ key: "guidance", label: "快速指引", promptHint: "这张牌想提醒你的核心重点" }],
  three: [
    { key: "past", label: "过去", promptHint: "问题形成的背景与已经发生的影响" },
    { key: "present", label: "现在", promptHint: "你目前最需要看见的能量与状态" },
    { key: "future", label: "未来", promptHint: "近期最可能展开的趋势与方向" }
  ],
  relationship: [
    { key: "self", label: "我", promptHint: "你此刻的真实状态、需求与立场" },
    { key: "other", label: "对方", promptHint: "对方当前能量、态度与关注点" },
    { key: "block", label: "关系阻碍", promptHint: "当前影响关系推进的卡点" },
    { key: "trend", label: "未来趋势", promptHint: "关系后续可能的发展方向" },
    { key: "advice", label: "建议", promptHint: "你接下来更合适的行动方式" }
  ]
};
