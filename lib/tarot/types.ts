export type QuestionType = "love" | "career" | "study" | "finance" | "general";
export type SpreadKey = "single" | "three" | "relationship";
export type CardOrientation = "upright" | "reversed";
export type Arcana = "major" | "minor";
export type Suit = "wands" | "cups" | "swords" | "pentacles" | null;
export type PaymentProvider = "alipay" | "wechat" | "external" | "creem";
export type PaymentStatus = "locked" | "unlocked" | "pending" | "failed";
export type PaymentMode = "mock" | "live" | "external_code" | "creem_checkout";

export interface TarotCard {
  id: string;
  name_cn: string;
  name_en: string;
  arcana: Arcana;
  suit: Suit;
  upright_keywords: string[];
  reversed_keywords: string[];
  love_meaning: string;
  career_meaning: string;
  study_meaning: string;
  finance_meaning: string;
  general_meaning: string;
}

export interface SpreadPosition {
  key: string;
  label: string;
  promptHint: string;
}

export interface DrawnCard extends TarotCard {
  orientation: CardOrientation;
  position: SpreadPosition;
}

export interface ReadingInput {
  question: string;
  questionType: QuestionType;
  spreadKey: SpreadKey;
  cards: DrawnCard[];
}

export interface PositionReading {
  position: string;
  cardName: string;
  orientation: CardOrientation;
  content: string;
}

export interface ReadingReport {
  overallEnergy: string;
  positionReadings: PositionReading[];
  combinationReading: string;
  directAnswer: string;
  actionAdvice: string;
  riskReminder: string;
  teaser: string;
  disclaimer: string;
  generatedBy: "openai" | "fallback";
}

export interface ReadingRecord {
  id: string;
  question: string;
  questionType: QuestionType;
  spreadKey: SpreadKey;
  cards: DrawnCard[];
  report: ReadingReport;
  createdAt: string;
  paymentStatus: PaymentStatus;
  unlockedAt?: string;
  lastOrderId?: string;
}

export interface ProductDefinition {
  id: string;
  code?: string;
  name: string;
  description: string;
  priceLabel: string;
  priceCents?: number;
}

export interface PaymentOrder {
  id: string;
  readingId: string;
  provider: PaymentProvider;
  productId: string;
  productName: string;
  amountCents: number;
  currency: string;
  status: Extract<PaymentStatus, "pending" | "unlocked" | "failed">;
  mode: PaymentMode;
  paymentUrl: string;
  qrCodeUrl?: string;
  providerOrderId?: string;
  redeemCode?: string;
  redeemedAt?: string;
  sourcePlatform?: string;
  createdAt: string;
  expiresAt: string;
}
