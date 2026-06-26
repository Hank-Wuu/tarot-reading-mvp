import { getMeaningByQuestionType } from "@/lib/tarot/draw";
import type { ReadingInput } from "@/lib/tarot/types";

export function buildReadingPrompt(input: ReadingInput) {
  const cardContext = input.cards.map((card) => {
    const keywords =
      card.orientation === "upright" ? card.upright_keywords.join("、") : card.reversed_keywords.join("、");

    return {
      name_cn: card.name_cn,
      name_en: card.name_en,
      position: card.position.label,
      position_hint: card.position.promptHint,
      orientation: card.orientation === "upright" ? "正位" : "逆位",
      keywords,
      contextual_meaning: getMeaningByQuestionType(card, input.questionType)
    };
  });

  return `
你是一位中文塔罗解读师，请严格基于系统已抽出的牌与牌义进行解读。

用户问题：${input.question}
问题类型：${input.questionType}
牌阵：${input.spreadKey}

以下是已经抽出的牌，请不要自行替换、补牌、改牌或虚构牌义：
${JSON.stringify(cardContext, null, 2)}

输出要求：
1. 只围绕上述牌面、位置、正逆位和牌义进行解读。
2. 语气温和、具体、有洞察，但避免绝对化断言。
3. 所有预测类表达使用“倾向”“可能”“目前能量显示”等表述。
4. 不提供医疗、法律、投资等高风险结论，不鼓励依赖塔罗替代专业意见。
5. 输出为 JSON 对象，不要输出 markdown。

JSON 结构：
{
  "overallEnergy": "string",
  "positionReadings": [
    {
      "position": "string",
      "cardName": "string",
      "orientation": "upright | reversed",
      "content": "string"
    }
  ],
  "combinationReading": "string",
  "directAnswer": "string",
  "actionAdvice": "string",
  "riskReminder": "string",
  "teaser": "string"
}
`;
}
