# Tarot Reading MVP

一个面向中文用户的塔罗抽牌解读网站 MVP，基于 Next.js App Router、TypeScript、Tailwind CSS、Supabase 和 OpenAI API。

当前这份仓库已经整理成适合公开放到 GitHub 的状态，可以直接用于作品集展示、二次开发，或者继续接入正式部署与支付。

## 功能范围

- 首页：产品定位、CTA、常见使用场景
- 抽牌页：输入问题、选择问题类型、选择牌阵、随机抽牌、支持正位/逆位
- 结果页：展示牌面、结构化中文解读、免费版锁定区块
- 历史记录：未登录用户使用 localStorage 保存最近记录
- Tarot 数据：内置 78 张牌的结构化牌义库
- AI 解读：严格基于已抽到的牌和牌义库生成中文内容
- 后台预留：`users`、`products`、`readings`、`orders`、`payment_status`

## 技术栈

- Next.js App Router
- TypeScript
- Tailwind CSS
- Supabase / PostgreSQL
- OpenAI API

## 当前状态

- 核心抽牌和结果页可本地直接运行
- 不配置 OpenAI 时，仍可使用本地 fallback 解读逻辑
- 不配置 Supabase 时，仍可体验前端流程和 localStorage 历史记录
- 支付层目前保留了 Creem 托管支付适配代码，但默认不要求启用
- 兑换码流程已经停用，当前代码以“托管支付 + webhook 自动解锁”为预留结构

## 目录结构

```text
app/                    Next.js 页面与 API 路由
components/             页面组件与 UI 组件
lib/ai/                 Prompt builder 与解读服务
lib/db/                 Supabase SQL schema
lib/payment/            支付适配层与解锁逻辑预留
lib/readings/           抽牌记录服务端存取
lib/storage/            本地历史记录
lib/supabase/           Supabase client/server 封装
lib/tarot/              牌阵、抽牌逻辑、牌义数据
types/                  通用类型
```

## 本地运行

1. 安装依赖

```bash
pnpm install
```

也可以使用：

```bash
npm install
```

2. 创建环境变量文件

```bash
cp .env.example .env.local
```

3. 按需填写配置

最小可运行配置：

- `NEXT_PUBLIC_APP_URL`
- `APP_URL`

可选配置：

- `OPENAI_API_KEY`：启用 OpenAI 个性化解读；不填则走本地 fallback
- `OPENAI_MODEL`：默认是 `gpt-4.1-mini`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `CREEM_API_KEY`
- `CREEM_PRODUCT_ID`
- `CREEM_WEBHOOK_SECRET`
- `NEXT_PUBLIC_UNLOCK_PRODUCT_LABEL`
- `NEXT_PUBLIC_UNLOCK_PRICE_CENTS`
- `NEXT_PUBLIC_UNLOCK_CURRENCY`

如果你只是把项目放到 GitHub 展示，完全可以先不配置 Supabase 和支付。

4. 启动开发环境

```bash
pnpm dev
```

如果你使用 npm：

```bash
npm run dev
```

5. 打开浏览器

访问 [http://localhost:3000](http://localhost:3000)

## Supabase 初始化

如果你需要服务端存档、订单状态或后续 webhook 自动解锁，请在 Supabase SQL Editor 中执行：

```sql
-- copy from lib/db/schema.sql
```

实际 SQL 文件在 [lib/db/schema.sql](./lib/db/schema.sql)。

## 数据与解读说明

- 牌义数据文件：[lib/tarot/tarot-cards.json](./lib/tarot/tarot-cards.json)
- 数据库结构：[lib/db/schema.sql](./lib/db/schema.sql)
- 解读生成入口：[lib/ai/reading-service.ts](./lib/ai/reading-service.ts)
- Prompt 构造：[lib/ai/prompt-builder.ts](./lib/ai/prompt-builder.ts)
- 支付适配入口：[lib/payment/service.ts](./lib/payment/service.ts)

## 支付说明

仓库当前保留的是一个“可继续开发”的支付结构，不是默认强依赖：

- 前端有“解锁完整解读”入口
- 服务端保留了订单、支付状态、webhook、自动解锁所需结构
- 当前支付适配层基于 Creem
- `app/api/redeem-code/route.ts` 已明确停用兑换码流程

如果你的目标只是公开仓库、展示产品能力，这部分可以保持现状，不影响项目运行。

## GitHub 发布前说明

这个仓库已经按公开项目的方向整理：

- `.env.local`、`.env.vercel` 不应提交
- `.vercel`、`.next`、`node_modules` 不应提交
- 本地测试文件已加入忽略
- 已补充 `LICENSE`

建议推送前再确认一次：

```bash
git status
```

确保没有任何密钥文件进入暂存区。

## 推到 GitHub

如果本地还没有初始化 git，可以执行：

```bash
git init
git add .
git commit -m "Initial commit"
```

然后在 GitHub 创建新仓库，再执行：

```bash
git remote add origin <your-github-repo-url>
git branch -M main
git push -u origin main
```

## 后续方向

这份代码现在更适合作为一个完整的产品雏形仓库：

- 可以继续完善 UI/UX
- 可以接正式登录和云端历史记录
- 可以保留支付适配层，但暂时不启用真实收费
- 可以直接作为作品集项目展示
- 可以继续补 CI、截图、演示视频和 issue 模板
