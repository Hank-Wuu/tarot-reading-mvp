import tarotCards from "@/lib/tarot/tarot-cards.json";
import { spreads } from "@/lib/tarot/spreads";
import type { CardOrientation, DrawnCard, SpreadKey, TarotCard } from "@/lib/tarot/types";

const cardPool = tarotCards as TarotCard[];

function randomIndex(max: number) {
  return Math.floor(Math.random() * max);
}

function drawOrientation(): CardOrientation {
  return Math.random() > 0.5 ? "upright" : "reversed";
}

export function getAllTarotCards() {
  return cardPool;
}

export function getCardById(cardId: string) {
  return cardPool.find((card) => card.id === cardId) ?? null;
}

export function drawCardsBySpread(spreadKey: SpreadKey): DrawnCard[] {
  const positions = spreads[spreadKey];
  const deck = [...cardPool];
  const cards: DrawnCard[] = [];

  for (const position of positions) {
    const index = randomIndex(deck.length);
    const [card] = deck.splice(index, 1);

    cards.push({
      ...card,
      orientation: drawOrientation(),
      position
    });
  }

  return cards;
}

export function getMeaningByQuestionType(card: TarotCard, questionType: string) {
  switch (questionType) {
    case "love":
      return card.love_meaning;
    case "career":
      return card.career_meaning;
    case "study":
      return card.study_meaning;
    case "finance":
      return card.finance_meaning;
    default:
      return card.general_meaning;
  }
}
