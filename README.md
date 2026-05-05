# Blog

Astro 製の静的ブログ。Markdown を書いて `git push` するとビルドされる構成。

## 機能

- ✅ Markdown / MDX → HTML 変換
- ✅ コードハイライト (Shiki, ライト/ダーク両対応)
- ✅ 数式 (KaTeX, インライン `$x$` とブロック `$$...$$`)
- ✅ タグ・カテゴリと一覧ページ (`/tags/`, `/tags/[tag]/`)
- ✅ 画像最適化 (Astro `<Image />`, WebP/AVIF 自動生成)
- ✅ OGP画像の自動生成 (1記事1枚, satori + resvg)
- ✅ RSS 2.0 フィード (`/rss.xml`)
- ✅ サイトマップ (`/sitemap-index.xml`)
- ✅ ダークモード (OS設定に追従)

## セットアップ

```bash
# Node.js 20+ が必要
npm install
npm run dev       # http://localhost:4321
npm run build     # ./dist に静的ファイル出力
npm run preview   # build結果を確認
```

## ディレクトリ構造

```
.
├── astro.config.mjs       # Astro設定 (Markdown処理 / Shiki / KaTeX)
├── src/
│   ├── consts.ts          # サイト名・URL・著者など (デプロイ前に編集)
│   ├── content/
│   │   ├── config.ts      # 記事スキーマ (frontmatter検証)
│   │   └── posts/         # ★ ここに .md / .mdx を置く
│   ├── layouts/
│   │   ├── BaseLayout.astro
│   │   └── PostLayout.astro
│   ├── components/        # Header / Footer / PostCard 等
│   ├── pages/
│   │   ├── index.astro    # トップ
│   │   ├── posts/         # 記事一覧 + 個別記事
│   │   ├── tags/          # タグ一覧 + タグ別
│   │   ├── og/[slug].png.ts  # OGP画像生成
│   │   └── rss.xml.ts
│   └── styles/global.css  # デザイントークン (色・フォント)
├── public/                # そのまま配信される静的ファイル
└── scripts/new-post.mjs   # 新規記事テンプレ生成
```

## 記事を書く

### 新規記事のテンプレを生成

```bash
npm run new -- "新しい記事のタイトル"
```

`src/content/posts/YYYY-MM-DD-title.md` が作られる。

### Frontmatter

```yaml
---
title: "記事タイトル"          # 必須
description: "概要文"           # 必須 (OGPと一覧で使用)
pubDate: 2026-05-05             # 必須
updatedDate: 2026-05-10         # 任意
tags: ["security", "rust"]      # 任意
category: "Engineering"         # 任意
heroImage: ./_images/cover.jpg  # 任意 (Astro Imageで最適化)
heroImageAlt: "..."             # heroImage使用時推奨
draft: false                    # trueでビルド対象外
---
```

### 画像

記事内画像は `src/content/posts/_images/` に置き、Markdown内では:

```markdown
![説明](./_images/diagram.png)
```

→ ビルド時に WebP/AVIF にも変換、レスポンシブ `srcset` 付与。

`public/` に置いた画像は最適化されないので、最適化したいものは必ず `src/` 配下へ。

## デプロイ

### Cloudflare Pages (推奨)

1. このリポジトリを GitHub にpush
2. Cloudflare Pages → "Create a project" → リポジトリ選択
3. ビルド設定:
   - Build command: `npm run build`
   - Output: `dist`
   - Node version: 20

`src/consts.ts` の `SITE.url` を本番URLに更新するのを忘れずに。

### GitHub Pages

`.github/workflows/deploy.yml` を作成:

```yaml
name: Deploy
on:
  push: { branches: [main] }
permissions:
  contents: read
  pages: write
  id-token: write
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20, cache: npm }
      - run: npm ci
      - run: npm run build
      - uses: actions/upload-pages-artifact@v3
        with: { path: ./dist }
  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment: { name: github-pages, url: ${{ steps.deployment.outputs.page_url }} }
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

`astro.config.mjs` に `base: '/repo-name'` を追加 (リポジトリPagesの場合)。

### Vercel / Netlify

リポジトリを連携するだけで自動検出。設定不要。

## カスタマイズ

- **色とフォント**: `src/styles/global.css` の CSS 変数
- **サイト情報**: `src/consts.ts`
- **OGP デザイン**: `src/pages/og/[slug].png.ts` の HTML テンプレート
- **記事スキーマ追加**: `src/content/config.ts` (例: `series` フィールド)

## 注意

- OGP生成は初回ビルドで Google Fonts から日本語フォントを取得する。ネットワーク遮断環境では `src/pages/og/[slug].png.ts` を改修してローカルフォントを使うか、OGP生成自体を外す。
- 記事数が多くなるとOGP生成でビルドが遅くなる。1000記事を超えるあたりで考慮。
