import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Tarot Reading MVP",
  description: "面向中文用户的塔罗抽牌与 AI 解读网站 MVP"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
