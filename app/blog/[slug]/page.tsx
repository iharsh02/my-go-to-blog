import Link from 'next/link'
import { notFound } from 'next/navigation'
import { CustomMDX } from 'app/components/mdx'
import { formatDate, getBlogPosts } from 'app/blog/utils'
import { baseUrl } from 'app/sitemap'
import { site } from 'app/site'

type Props = { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  return getBlogPosts().map((post) => ({ slug: post.slug }))
}

export async function generateMetadata({ params }: Props) {
  let { slug } = await params
  let post = getBlogPosts().find((post) => post.slug === slug)
  if (!post) {
    return
  }

  let {
    title,
    publishedAt: publishedTime,
    summary: description,
    image,
  } = post.metadata
  let ogImage = image
    ? image
    : `${baseUrl}/og?title=${encodeURIComponent(title)}`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'article',
      publishedTime,
      url: `${baseUrl}/blog/${post.slug}`,
      images: [{ url: ogImage }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
  }
}

export default async function Blog({ params }: Props) {
  let { slug } = await params
  let posts = getBlogPosts()
  let index = posts.findIndex((post) => post.slug === slug)
  let post = posts[index]

  if (!post) {
    notFound()
  }

  let newer = posts[index - 1]
  let older = posts[index + 1]

  return (
    <article>
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BlogPosting',
            headline: post.metadata.title,
            datePublished: post.metadata.publishedAt,
            dateModified: post.metadata.publishedAt,
            description: post.metadata.summary,
            image: post.metadata.image
              ? `${baseUrl}${post.metadata.image}`
              : `/og?title=${encodeURIComponent(post.metadata.title)}`,
            url: `${baseUrl}/blog/${post.slug}`,
            author: {
              '@type': 'Person',
              name: site.name,
            },
          }),
        }}
      />

      <header className="mb-10">
        <h1 className="title text-2xl font-semibold tracking-tight">
          {post.metadata.title}
        </h1>
        <p className="mt-2 text-sm text-muted">
          <time dateTime={post.metadata.publishedAt}>
            {formatDate(post.metadata.publishedAt)}
          </time>
          {' · '}
          {post.readingTime} min read
        </p>
      </header>

      <div className="prose">
        <CustomMDX source={post.content} />
      </div>

      <nav className="mt-16 flex justify-between gap-6 border-t border-line pt-6 text-sm">
        {[
          { post: older, label: 'Previous' },
          { post: newer, label: 'Next' },
        ].map(({ post, label }, i) =>
          post ? (
            <Link
              key={label}
              href={`/blog/${post.slug}`}
              className={`group max-w-[48%] ${i === 1 ? 'ml-auto text-right' : ''}`}
            >
              <span className="block text-muted">{label}</span>
              <span className="mt-0.5 block font-medium underline decoration-transparent underline-offset-4 transition-colors group-hover:decoration-line">
                {post.metadata.title}
              </span>
            </Link>
          ) : null
        )}
      </nav>
    </article>
  )
}
