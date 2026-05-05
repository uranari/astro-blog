---
title: "Windowsのおすすめ監査設定"
description: "Windows でおすすめの監査設定 Windows の Event Log をセキュリティ監視でリアルタイム監視していると標準の監査設定では意外と必要なログを取ってくれていなかったりします。 今回は Windows でセキュリティ監..."
pubDate: "2019-12-22T22:08:41+09:00"
tags: ["windows", "security"]
category: "windows"
legacyUrl: "/tech/windows/audit-config/"
draft: true
---

### Windows でおすすめの監査設定

Windows の Event Log をセキュリティ監視でリアルタイム監視していると標準の監査設定では意外と必要なログを取ってくれていなかったりします。

今回は Windows でセキュリティ監視をする上で有効にしておきたい監査項目を紹介します。

#### グループポリシーエディタ

監査設定はグループポリシーエディタを使って設定します。  
グループポリシーエディタは Windows の検索窓に `gpedit` と入力すれば立ち上がります。  

<figure class="center">
  <img src="/images/windows-audit-config/gpedit.PNG" alt="グループポリシーエディタ" width="1280" height="2560" loading="lazy" />
  <figcaption>グループポリシーエディタ</figcaption>
</figure>
