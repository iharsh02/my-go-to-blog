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

  let others = posts.filter((p) => p.slug !== post.slug).slice(0, 2)

  return (
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

      <article>
        <header className="rule-top relative px-4 pt-6 pb-8 sm:px-5">
          <Note arrow="left" className="absolute top-24 left-full ml-3 hidden lg:flex">
            grab a coffee
          </Note>
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
        </header>

        <div className="grid grid-cols-[1fr_auto] border-t border-line">
          <div className="flex min-w-0 items-center gap-3 px-4 py-3 sm:px-5">
            <img
              src={avatarUri()}
              alt=""
              width={40}
              height={40}
              className="size-10 shrink-0 rounded-full border border-line bg-card"
            />
            <div className="min-w-0 text-[14px] leading-snug">
              <p className="truncate font-medium">{site.name}</p>
              <p className="truncate text-muted">{site.role}</p>
            </div>
          </div>
          <div className="flex items-center border-l border-line px-4 sm:px-5">
            <CopyPage markdown={`# ${post.metadata.title}\n\n${post.content}`} />
          </div>
        </div>

        <Hatch />

        <div className="prose article px-4 py-8 sm:px-5">
          <CustomMDX source={post.content} />
        </div>
      </article>

      <Hatch />

      {others.length > 0 && (
        <>
          <section aria-labelledby="keep-reading">
            <h2
              id="keep-reading"
              className="border-b border-line px-4 py-3 font-mono text-[13px] font-medium sm:px-5"
            >
              Keep reading
            </h2>
            <ul className="divide-y divide-line">
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
