# 青椒肉丝's notion

## SEO

构建生产站点时，将 `NUXT_SITE_URL` 设置为正式站点的 HTTPS 地址。构建会用这个地址生成 canonical、社交分享地址、`sitemap.xml` 和 `robots.txt`。

新增文章时，在 Markdown frontmatter 中填写 `title`、简述该篇内容的 `description` 和发布 `date`。默认语言为 `zh-CN`，英文文章可设 `lang: en`。正文有实质更新时，可以填写 `updatedAt`。有与内容相关的配图时，可以用 `image` 指定。
