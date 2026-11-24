import Link from 'next/link'
import { notFound } from 'next/navigation'
import { CustomMDX } from 'app/components/mdx'
import { formatDate, getBlogPosts } from 'app/blog/utils'
import { baseUrl } from 'app/sitemap'
import { site } from 'app/site'
import { Icon } from 'app/components/icons'
import { avatarUri } from 'app/lib/avatar'
import { CopyPage } from 'app/components/copy-page'
import { PostListItem } from 'app/components/posts'
import { Hatch } from 'app/components/grid'
import { Note } from 'app/components/annotations'

type Props = { params: Promise<{ slug: string }> }

// Posts are read from disk at build time; Workers have no filesystem at runtime
export const dynamicParams = false

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

  // Up to two other posts, newest first
  let others = posts.filter((p) => p.slug !== post.slug).slice(0, 2)

  return (
    // Bleed out of main's padding so rows run rail to rail
    <div className="-mx-4 sm:-mx-5">
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

      <section className="rule-top relative px-4 py-6 sm:px-5">
        <Note arrow="left" className="absolute top-24 left-full ml-3 hidden lg:flex">
          grab a coffee
        </Note>
        <article className="rounded-[22px] border border-line bg-card px-5 py-8 shadow-soft sm:px-10 sm:py-12">
          <Link
            href="/blog"
            className="group inline-flex items-center gap-1.5 text-[13.5px] text-muted transition-colors hover:text-fg"
          >
            <Icon
              name="left"
              className="size-3.5 transition-transform duration-500 ease-spring group-hover:-translate-x-0.5"
            />
            All posts
          </Link>

          <p className="mt-8 flex flex-wrap items-center gap-x-4 gap-y-1 text-[14px]">
            {post.metadata.tag && <span className="font-medium">{post.metadata.tag}</span>}
            <time dateTime={post.metadata.publishedAt} className="text-muted">
              {formatDate(post.metadata.publishedAt)}
            </time>
            <span className="text-muted">{post.readingTime} min read</span>
          </p>

          <h1 className="title mt-4 text-[2rem] leading-[1.15] font-medium tracking-tight sm:text-[2.5rem]">
            {post.metadata.title}
          </h1>

          <div className="mt-7 flex items-center justify-between gap-4">
            <div className="flex min-w-0 items-center gap-3">
              <img
                src={avatarUri()}
                alt=""
                width={40}
                height={40}
                className="size-10 shrink-0 rounded-full border border-line bg-card-2"
              />
              <div className="min-w-0 text-[14px] leading-snug">
                <p className="font-medium">{site.name}</p>
                <p className="text-muted">{site.role}</p>
              </div>
            </div>
            <CopyPage markdown={`# ${post.metadata.title}\n\n${post.content}`} />
          </div>

          <div className="prose article mt-10">
            <CustomMDX source={post.content} />
          </div>
        </article>
      </section>

      <Hatch />

      {others.length > 0 && (
        <>
          <section aria-labelledby="keep-reading" className="px-4 py-6 sm:px-5">
            <h2 id="keep-reading" className="mb-3 px-1 text-[14px] font-medium">
              Keep reading
            </h2>
            <ul className="divide-y divide-line rounded-[22px] border border-line bg-card px-5 py-1 shadow-soft sm:px-8">
              {others.map((p) => (
                <li key={p.slug}>
                  <PostListItem post={p} />
                </li>
              ))}
            </ul>
          </section>
          <Hatch />
        </>
      )}
    </div>
  )
}
