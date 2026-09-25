import { baseUrl } from 'app/sitemap'
import { getBlogPosts } from 'app/blog/utils'
import { site } from 'app/site'

// Titles like "Tips & Tricks" would otherwise produce invalid XML
function escape(text: string) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

export async function GET() {
  const itemsXml = getBlogPosts()
    .map(
      (post) =>
        `<item>
          <title>${escape(post.metadata.title)}</title>
          <link>${baseUrl}/blog/${post.slug}</link>
          <description>${escape(post.metadata.summary || '')}</description>
          <pubDate>${new Date(
            post.metadata.publishedAt
          ).toUTCString()}</pubDate>
        </item>`
    )
    .join('\n')

  const rssFeed = `<?xml version="1.0" encoding="UTF-8" ?>
  <?xml-stylesheet type="text/css" href="/rss.css" ?>
  <rss version="2.0">
    <channel>
        <title>${escape(site.name)}</title>
        <link>${baseUrl}</link>
        <description>${escape(site.description)}</description>
        ${itemsXml}
    </channel>
  </rss>`

  return new Response(rssFeed, {
    headers: {
      'Content-Type': 'text/xml',
    },
  })
}
