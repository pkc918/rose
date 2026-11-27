---
title: 'SEO 是什么？技术博客的抓取、索引与搜索展示'
description: 以技术博客为例，解释 SEO 如何帮助搜索引擎发现文章、理解页面内容，以及怎样用标题、描述、canonical 和 sitemap 检查基础配置。
---

SEO（Search Engine Optimization，搜索引擎优化）让搜索引擎更容易发现和理解页面，也让读者能通过相关问题找到文章。以技术博客为例，可以从文章如何被发现、搜索引擎如何选择网址，以及搜索结果如何展示三个环节检查。

## 让搜索引擎发现文章

在博客列表中提供指向每篇文章的链接，并在主题相关的文章之间互相链接。发布后，可以在根目录的 `robots.txt` 中声明 `sitemap.xml` 的地址。站点地图中的条目应使用希望被索引的完整网址。

## 为每篇文章指定规范网址

同一篇内容可能通过分享链接和带跟踪参数的链接访问。使用 `rel="canonical"` 指向文章的规范网址，可以帮助搜索引擎把这些页面识别为同一篇内容。检查站点地图中的网址是否与页面声明的 canonical 一致。

## 用标题和摘要说明文章内容

把读者要找的技术和问题写进标题。以 [OpenCV.js 透视矫正](/blogs/opencv) 为例，标题说明要用四个角点拉正图片，摘要再补充运行环境、关键 API 和输出结果。搜索引擎也可能根据查询从正文中提取更相关的片段。

部署后，可以用 Google Search Console 的网址检查功能查看页面的抓取和索引状态，再在站点地图报告中检查提交结果。

参考 [Google SEO 入门指南](https://developers.google.com/search/docs/fundamentals/seo-starter-guide) 和 [构建和提交站点地图](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap)。
