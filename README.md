# my-go-to-blog

## Stack

- [Next.js](https://nextjs.org) (App Router) + TypeScript
- MDX posts via `next-mdx-remote`, syntax highlighting with `sugar-high`
- Tailwind CSS v4, Geist font
- RSS feed, sitemap, robots, JSON-LD, dynamic OG images

## Follow via RSS

The blog has an RSS feed, so you can get new posts in your feed reader without checking the site.

**Feed URL:** `https://<site-domain>/rss`

1. Copy the feed URL above (or click **RSS** on the home page).
2. Open your RSS reader, e.g. [Feedly](https://feedly.com), [Inoreader](https://www.inoreader.com), [NetNewsWire](https://netnewswire.com), or [Miniflux](https://miniflux.app).
3. Choose **Add feed** / **Subscribe** and paste the URL.

Each new post shows up in your reader with its title, summary, and a link to the full article.

## Writing a post

Add an `.mdx` file to `app/blog/posts/`. The filename becomes the URL slug.

```mdx
---
title: 'Post title'
publishedAt: '2026-09-25'
summary: 'One-line summary shown in lists and previews.'
---

Post content here.
```

## Configuration

Everything personal — name, tagline, about text, links, and site URL — lives in `app/site.ts`.

## Credits

Started from Vercel's [Portfolio Blog Starter](https://github.com/vercel/examples/tree/main/solutions/blog).
