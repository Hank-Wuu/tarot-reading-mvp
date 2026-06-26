const scenarios = [
  {
    title: "感情",
    description: "想知道关系的真实状态、对方态度，或下一步是否适合主动推进。"
  },
  {
    title: "事业",
    description: "适合查看当前工作机会、转岗变化、合作走向与近期能量趋势。"
  },
  {
    title: "学业",
    description: "帮助梳理学习节奏、考试压力、注意力分配与执行状态。"
  },
  {
    title: "综合运势",
    description: "当你问题很多、方向不明时，用一组牌先抓住当前最重要的主题。"
  }
];

export function ScenarioGrid() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-16 md:px-10">
      <div className="mb-8 flex flex-col gap-3">
        <p className="text-sm font-medium text-gold">常见抽牌场景</p>
        <h2 className="text-3xl font-semibold text-white">你可以从一个具体问题开始。</h2>
        <p className="max-w-2xl text-sm leading-7 text-mist/75 md:text-base">
          问题越具体，解读越容易聚焦。第一版先支持最常用的几个主题，后续可以扩展每日抽牌、会员完整解锁和登录保存。
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {scenarios.map((scenario) => (
          <article
            key={scenario.title}
            className="rounded-2xl border border-white/10 bg-white/5 p-5 text-sm shadow-soft"
          >
            <p className="mb-3 text-lg font-semibold text-white">{scenario.title}</p>
            <p className="leading-7 text-mist/75">{scenario.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
