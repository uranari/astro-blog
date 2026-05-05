#!/usr/bin/env node
// 使い方: npm run new -- "記事タイトル"
import { writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

const title = process.argv[2];
if (!title) {
  console.error('Usage: npm run new -- "記事タイトル"');
  process.exit(1);
}

// slug化: 英数とハイフンのみ。日本語タイトルなら日付ベース
const ascii = title
  .toLowerCase()
  .replace(/[^a-z0-9\s-]/g, '')
  .trim()
  .replace(/\s+/g, '-');
const today = new Date().toISOString().slice(0, 10);
const slug = ascii.length > 0 ? `${today}-${ascii}` : today;

const dir = join(ROOT, 'src/content/posts');
if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
const path = join(dir, `${slug}.md`);

if (existsSync(path)) {
  console.error(`Already exists: ${path}`);
  process.exit(1);
}

const tmpl = `---
title: "${title.replace(/"/g, '\\"')}"
description: ""
pubDate: ${today}
tags: []
draft: true
---

ここから本文を書く。
`;

writeFileSync(path, tmpl);
console.log(`Created: ${path}`);
