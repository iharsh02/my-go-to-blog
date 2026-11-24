import Link from 'next/link'

export type NotchPost = {
  title: string
  summary: string
  href: string
  date: string
  readingTime: number
  excerpt: string[]
}

// Always-open dark card featuring the newest post
export function WritingNotch({
  post,
  total,
  label = 'Latest writing',
  showAll = true,
}: {
  post: NotchPost
  total: number
  label?: string
  showAll?: boolean
}) {
  return (
    <div className="notch relative w-full overflow-hidden rounded-[26px] p-2 text-white shadow-float">
      <div className="flex items-center gap-2 px-2.5 pt-1.5 pb-2.5 text-[12.5px]">
        <Ring />
        <span className="font-medium text-white/60">{label}</span>
        <span className="ml-auto text-white/50 tabular-nums">
          {total} post{total === 1 ? '' : 's'}
        </span>
      </div>

      <Link
        href={post.href}
        className="group flex items-start gap-3 rounded-[18px] bg-white/[0.05] p-3.5 transition-colors hover:bg-white/[0.09]"
      >
        <span className="min-w-0 flex-1">
          <span className="block text-[15px] leading-snug font-semibold tracking-tight text-balance">
            {post.title}
          </span>
          {post.summary && (
            <span className="mt-1 block text-[13.5px] leading-relaxed text-white/70 italic">
              {post.summary}
            </span>
          )}
          <span className="mt-2 flex items-center gap-2 text-[12px] text-white/45">
            <span className="size-1.5 rounded-full bg-[#39d353]" aria-hidden />
            {post.date} · {post.readingTime} min read
          </span>
          {post.excerpt.length > 0 && (
            // The opening lines, faded out so the card reads as a teaser
            <span className="mt-3.5 block max-h-44 overflow-hidden border-t border-white/[0.08] pt-3.5 text-[14px] leading-relaxed text-white/60 [mask-image:linear-gradient(to_bottom,black_40%,transparent)]">
              {post.excerpt.map((p) => (
                <span key={p} className="mb-2.5 block">
                  {p}
                </span>
              ))}
            </span>
          )}
          <span className="mt-1 block text-[12.5px] font-medium text-white/55 transition-colors group-hover:text-white">
            Continue reading →
          </span>
        </span>
        <svg
          viewBox="0 0 24 24"
          className="mt-1 size-4 shrink-0 text-white/35 transition-[color,transform] duration-500 ease-spring group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-white"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <path d="M7 7h10v10" />
          <path d="M7 17 17 7" />
        </svg>
      </Link>

      {showAll && (
      <Link
        href="/blog"
        className="mt-1.5 flex h-10 items-center justify-center rounded-[18px] bg-white text-sm font-medium text-[#141416] transition-transform duration-500 ease-spring hover:scale-[1.01] active:scale-[0.99]"
      >
        All posts
      </Link>
      )}
    </div>
  )
}

function Ring() {
  return (
    <span aria-hidden className="relative grid size-4 shrink-0 place-items-center">
      <span className="absolute inset-0 rounded-full border-[1.5px] border-white/25" />
      <span className="size-1.5 rounded-full bg-[#39d353] shadow-[0_0_8px_#39d353]" />
    </span>
  )
}
