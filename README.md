# Tarot Reading MVP

一个面向中文用户的塔罗抽牌解读网站 MVP，基于 Next.js App Router、TypeScript、Tailwind CSS、Supabase 和 OpenAI API。

当前这份仓库适合直接放到 GitHub 做项目展示、继续迭代，或者后续再接正式部署与支付。

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
public/                 静态资源
types/                  通用类型
```

## 本地运行

1. 安装依赖

```bash
npm install
```

2. 创建环境变量文件

```bash
cp .env.example .env.local
```

3. 按需填写配置

- `OPENAI_API_KEY`：可选；不填时会使用本地 fallback 解读逻辑
- `NEXT_PUBLIC_SUPABASE_URL`：可选；启用服务端存档时需要
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`：可选；启用服务端存档时需要
- `SUPABASE_SERVICE_ROLE_KEY`：可选；启用服务端存档时需要
- `NEXT_PUBLIC_APP_URL`
- `APP_URL`
- `CREEM_API_KEY`：可选；只有保留自动解锁链路时才需要
- `CREEM_PRODUCT_ID`
- `CREEM_WEBHOOK_SECRET`
- `NEXT_PUBLIC_UNLOCK_PRODUCT_LABEL`
- `NEXT_PUBLIC_UNLOCK_PRICE_CENTS`
- `NEXT_PUBLIC_UNLOCK_CURRENCY`

如果你只是把项目放到 GitHub 展示，完全可以先不配置支付。

4. 启动开发环境

```bash
npm run dev
```

5. 打开浏览器

访问 [http://localhost:3000](http://localhost:3000)

## 数据与解读说明

- 牌义数据文件：`lib/tarot/tarot-cards.json`
- 数据库结构：`lib/db/schema.sql`
- 解读生成入口：`lib/ai/reading-service.ts`
- Prompt 构造：`lib/ai/prompt-builder.ts`

## GitHub 发布前说明

这个仓库已经按公开项目的方向整理：

- `.env.local`、`.env.vercel` 不应提交
- `.vercel`、`.next`、`node_modules` 不应提交
- 本地测试文件已加入忽略

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
