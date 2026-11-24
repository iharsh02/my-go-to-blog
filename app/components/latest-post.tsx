import Link from 'next/link'

export type LatestPostData = {
  title: string
  summary: string
  href: string
  date: string
  readingTime: number
  excerpt: string[]
}

export function LatestPost({ post, total }: { post: LatestPostData; total: number }) {
  return (
    <div>
      <div className="flex items-center justify-between border-b border-line px-4 py-3 font-mono text-[13px] sm:px-5">
        <span className="flex items-center gap-2 font-medium">
          <span className="size-1.5 rounded-full bg-[#39d353]" aria-hidden />
          Latest writing
        </span>
        <span className="text-muted tabular-nums">
          {total} post{total === 1 ? '' : 's'}
        </span>
      </div>

      <Link
        href={post.href}
        className="group grid transition-colors outline-offset-[-2px] hover:bg-card-2/60 sm:grid-cols-[9.5rem_1fr]"
      >
        <span className="flex flex-wrap items-center gap-x-3 gap-y-1 px-4 pt-5 font-mono text-[12px] text-muted sm:flex-col sm:items-start sm:border-r sm:border-line sm:px-5 sm:py-6">
          <span>{post.date}</span>
          <span>{post.readingTime} min read</span>
        </span>
        <span className="block min-w-0 px-4 pt-2 pb-6 sm:px-5 sm:py-6">
          <span className="block text-xl leading-snug font-medium tracking-tight text-balance transition-colors duration-300 group-hover:text-muted sm:text-2xl">
            {post.title}
          </span>
          {post.summary && (
            <span className="mt-2 block text-[15px] leading-relaxed text-muted italic">
              {post.summary}
            </span>
          )}
          {post.excerpt.length > 0 && (
            <span className="mt-4 block max-h-40 overflow-hidden text-[15px] leading-relaxed text-muted [mask-image:linear-gradient(to_bottom,black_40%,transparent)]">
              {post.excerpt.map((p) => (
                <span key={p} className="mb-3 block">
                  {p}
                </span>
              ))}
            </span>
          )}
          <span className="mt-2 inline-flex items-center gap-1 text-[13.5px] font-medium">
            Continue reading
            <span
              aria-hidden
              className="transition-transform duration-500 ease-spring group-hover:translate-x-0.5"
            >
              →
            </span>
          </span>
        </span>
      </Link>

      <Link
        href="/blog"
        className="group flex items-center justify-between border-t border-line px-4 py-3 font-mono text-[13px] text-muted transition-colors hover:bg-card-2/60 hover:text-fg sm:px-5"
      >
        All posts
        <span
          aria-hidden
          className="transition-transform duration-500 ease-spring group-hover:translate-x-0.5"
        >
          →
        </span>
      </Link>
    </div>
  )
}
