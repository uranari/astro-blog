---
title: "AzureでFunctionsをデプロイした時に出るreceiverConnectionStringというエラーについて"
description: "Azure Functions の receiverConnectionString エラーについて Azure で Azure Functions をデプロイした際に下記の画像のようなエラーが出ることがあります。 上記のエラーで結構..."
pubDate: "2020-04-16T22:08:41+09:00"
tags: ["azure", "azure-functions"]
category: "azure"
legacyUrl: "/tech/azure/azure-functions-error/"
---

### Azure Functions の receiverConnectionString エラーについて

Azure で Azure Functions をデプロイした際に下記の画像のようなエラーが出ることがあります。  

<figure class="center">
  <img src="/images/azure-functions-error/azure_deploy.JPG" alt="" width="640" height="1280" loading="lazy" />
</figure>

上記のエラーで結構はまってしまったので解決方法を記載しておきます。

解決方法なんですが、自分の場合は EventHub をトリガーにしているので `local.settins.json` に記載されている EventHub の接続文字列を

<figure class="center">
  <img src="/images/azure-functions-error/local_serrings.JPG" alt="" width="640" height="1280" loading="lazy" />
</figure>

下記のアプリケーション設定に設定します。

<figure class="center">
  <img src="/images/azure-functions-error/app_config.JPG" alt="" width="640" height="1280" loading="lazy" />
</figure>

以上！！
