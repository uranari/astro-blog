// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

import { SITE } from './src/consts';

export default defineConfig({
  site: SITE.url,
  integrations: [
    mdx(),
    sitemap({
      filter: (page) => !page.includes('/draft/'),
    }),
  ],
  markdown: {
    remarkPlugins: [remarkMath],
    rehypePlugins: [
      [
        rehypeKatex,
        {
          // 数式エラー時にビルドを止めず、赤字で表示
          throwOnError: false,
          strict: false,
        },
      ],
    ],
    shikiConfig: {
      // 同時にライト/ダーク両対応
      themes: {
        light: 'github-light',
        dark: 'github-dark-dimmed',
      },
      wrap: false,
    },
  },
  image: {
    // 画像最適化: ビルド時にWebP/AVIF生成 (sharp利用)
    service: { entrypoint: 'astro/assets/services/sharp' },
  },
});
