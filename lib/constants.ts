import type { ProductDefinition, QuestionType, SpreadKey } from "@/lib/tarot/types";

export const QUESTION_TYPE_OPTIONS: Array<{ value: QuestionType; label: string; hint: string }> = [
  { value: "love", label: "感情", hint: "关系动态、心意流动、相处建议" },
  { value: "career", label: "事业", hint: "工作方向、机会判断、环境变化" },
  { value: "study", label: "学业", hint: "学习状态、考试准备、成长节奏" },
  { value: "finance", label: "财运", hint: "收支趋势、资源配置、风险意识" },
  { value: "general", label: "综合", hint: "整体能量、近期主题、调整重点" }
];

export const SPREAD_OPTIONS: Array<{ value: SpreadKey; label: string; summary: string }> = [
  { value: "single", label: "单张牌", summary: "快速指引，适合做一个当下判断" },
  { value: "three", label: "三张牌", summary: "过去 / 现在 / 未来，看清趋势演变" },
  { value: "relationship", label: "关系牌阵", summary: "我 / 对方 / 阻碍 / 趋势 / 建议" }
];

export function getQuestionTypeLabel(value: QuestionType) {
  return QUESTION_TYPE_OPTIONS.find((item) => item.value === value)?.label ?? value;
}

export function getSpreadLabel(value: SpreadKey) {
  return SPREAD_OPTIONS.find((item) => item.value === value)?.label ?? value;
}

export const PLACEHOLDER_PRODUCTS: ProductDefinition[] = [
  {
    id: "full-reading",
    code: "full-reading",
    name: "完整解读",
    description: "解锁完整结构化报告、每张牌位解释、组合解读和行动建议",
    priceLabel: "$2.99",
    priceCents: 299
  }
];

export const APP_NAME = "星语塔罗";
export const DEFAULT_UNLOCK_PRODUCT_LABEL = "Tarot 完整解读解锁";
export const CHECKOUT_UNLOCK_STEPS = [
  "点击按钮进入托管支付页完成付款。",
  "支付完成后会自动跳回结果页，无需手动输入兑换码。",
  "系统收到回调后会自动解锁完整报告；如果网络较慢，可手动刷新状态。"
] as const;
