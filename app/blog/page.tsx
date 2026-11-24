import Link from 'next/link'
import { getBlogPosts } from 'app/blog/utils'
import { PostListItem } from 'app/components/posts'
import { Hatch } from 'app/components/grid'
import { Dimension, Note } from 'app/components/annotations'

export const metadata = {
  title: 'Writing',
  description: 'Stories, milestones, and things I learn along the way.',
}

export default function Page() {
  let posts = getBlogPosts()

  return (
    <div className="-mx-4 sm:-mx-5">
      <section className="rule-top relative px-4 pt-7 pb-6 sm:px-5">
        <Dimension
          label="672"
          className="absolute inset-x-0 bottom-full mb-5 hidden md:flex"
        />
        <h1 className="flex items-start gap-1.5 text-3xl font-semibold tracking-tight">
          Writing
          <span className="mt-1 font-mono text-sm font-normal text-muted tabular-nums">
            ({posts.length})
          </span>
        </h1>
        <p className="mt-2 font-mono text-[13px] text-muted">{metadata.description}</p>
        <Note arrow="down-left" tilt={5} className="absolute top-5 left-full ml-3 hidden lg:flex">
          the whole archive
        </Note>
      </section>

      <Hatch measure="32" />

      {posts.length === 0 ? (
        <p className="px-4 py-10 text-muted sm:px-5">No posts yet. Check back soon.</p>
      ) : (
        <section aria-label="All posts" className="relative">
          <Note arrow="left" className="absolute top-12 left-full ml-3 hidden lg:flex">
            start here
          </Note>
          <ul className="divide-y divide-line">
            {posts.map((post) => (
              <li key={post.slug}>
                <PostListItem post={post} />
              </li>
            ))}
          </ul>
        </section>
      )}

      <Hatch />

      <div className="px-4 pt-6 sm:px-5">
        <Link
          href="/"
          className="group inline-flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-fg"
        >
          <span
            aria-hidden
            className="transition-transform duration-500 ease-spring group-hover:-translate-x-0.5"
          >
            ←
          </span>
          Home
        </Link>
      </div>
    </div>
  )
}
