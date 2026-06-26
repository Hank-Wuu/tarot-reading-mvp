import OpenAI from "openai";
import { buildReadingPrompt } from "@/lib/ai/prompt-builder";
import { getMeaningByQuestionType } from "@/lib/tarot/draw";
import type { DrawnCard, ReadingInput, ReadingReport } from "@/lib/tarot/types";

function createFallbackPositionReading(card: DrawnCard, questionType: ReadingInput["questionType"]) {
  const meaning = getMeaningByQuestionType(card, questionType);
  const keywordText =
    card.orientation === "upright" ? card.upright_keywords.join("、") : card.reversed_keywords.join("、");
  const orientationLabel = card.orientation === "upright" ? "正位" : "逆位";

  return {
    position: card.position.label,
    cardName: card.name_cn,
    orientation: card.orientation,
    content: `${card.position.label}抽到${card.name_cn}${orientationLabel}，关键词偏向${keywordText}。结合这个位置来看，${meaning}`
  };
}

function buildFallbackReading(input: ReadingInput): ReadingReport {
  const positionReadings = input.cards.map((card) => createFallbackPositionReading(card, input.questionType));
  const uprightCount = input.cards.filter((card) => card.orientation === "upright").length;
  const reversedCount = input.cards.length - uprightCount;
  const dominantTone =
    uprightCount >= reversedCount ? "整体能量并不封闭，重点在于主动整理方向与节奏。" : "当前能量稍显拉扯，先稳定内在判断会比急着推进更有利。";

  const names = input.cards.map((card) => `${card.name_cn}${card.orientation === "upright" ? "正位" : "逆位"}`).join("、");

  return {
    overallEnergy: `这次牌面以${names}为核心，${dominantTone}你的问题更像是在提醒你看清当下真实需求，而不是立刻追求一个极端答案。`,
    positionReadings,
    combinationReading: `从组合上看，这组牌之间既有推动感，也有提醒你慢一点确认细节的信号。它显示事情并非完全静止，关键在于你如何回应已经出现的信息与关系张力。`,
    directAnswer: `如果你想问“这件事会不会如愿”，目前能量更接近“有机会，但节奏与方式需要调整”。先把可控部分做好，结果会更清晰。`,
    actionAdvice: `建议你先明确最在意的目标，再用更稳的方式推进。适合做的是：说清期待、减少猜测、为下一步保留弹性，同时给自己一段观察窗口。`,
    riskReminder: `风险点在于过度脑补、急着证明、或把短期波动当成最终结果。塔罗更像阶段提醒，真正影响结果的仍然是你的行动、沟通与边界感。`,
    teaser: `这组牌的核心信息是：方向不是没有，只是需要你先校准步伐。完整解读会进一步展开每个位置之间的连动关系。`,
    disclaimer: "本解读用于自我觉察与娱乐参考，不替代医疗、法律、投资或其他专业建议。",
    generatedBy: "fallback"
  };
}

function safeJsonParse(value: string): Omit<ReadingReport, "disclaimer" | "generatedBy"> | null {
  try {
    return JSON.parse(value);
  } catch {
    const match = value.match(/\{[\s\S]*\}/);
    if (!match) {
      return null;
    }

    try {
      return JSON.parse(match[0]);
    } catch {
      return null;
    }
  }
}

export async function generateReading(input: ReadingInput): Promise<ReadingReport> {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return buildFallbackReading(input);
  }

  try {
    const client = new OpenAI({ apiKey });
    const model = process.env.OPENAI_MODEL || "gpt-4.1-mini";
    const completion = await client.chat.completions.create({
      model,
      temperature: 0.8,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content:
            "你是中文塔罗解读师。你必须严格依据已给定的牌和牌义写解读，不得虚构新抽牌，不得给出绝对化判断，不得给高风险专业建议。"
        },
        {
          role: "user",
          content: buildReadingPrompt(input)
        }
      ]
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      return buildFallbackReading(input);
    }

    const parsed = safeJsonParse(content);
    if (!parsed) {
      return buildFallbackReading(input);
    }

    return {
      ...parsed,
      disclaimer: "本解读用于自我觉察与娱乐参考，不替代医疗、法律、投资或其他专业建议。",
      generatedBy: "openai"
    };
  } catch {
    return buildFallbackReading(input);
  }
}
