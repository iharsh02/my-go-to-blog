import { formatDate, getBlogPosts } from 'app/blog/utils'
import Link from 'next/link'
import { ListItem } from './list'

type Post = ReturnType<typeof getBlogPosts>[number]

export function PostRow({ post }: { post: Post }) {
  return (
    <ListItem
      href={`/blog/${post.slug}`}
      title={post.metadata.title}
      meta={formatDate(post.metadata.publishedAt, 'short')}
    />
  )
}

export function PostListItem({ post }: { post: Post }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group grid transition-colors outline-offset-[-2px] hover:bg-card-2/60 sm:grid-cols-[9.5rem_1fr]"
    >
      <span className="flex flex-wrap items-center gap-x-3 gap-y-1 px-4 pt-5 font-mono text-[12px] text-muted sm:flex-col sm:items-start sm:border-r sm:border-line sm:px-5 sm:py-6">
        {post.metadata.tag && <span className="font-medium text-fg">{post.metadata.tag}</span>}
        <time dateTime={post.metadata.publishedAt}>
          {formatDate(post.metadata.publishedAt, 'short')}
        </time>
        <span>{post.readingTime} min read</span>
      </span>
      <span className="block min-w-0 px-4 pt-2 pb-5 sm:px-5 sm:py-6">
        <span className="block text-lg leading-snug font-medium tracking-tight text-balance transition-colors duration-300 group-hover:text-muted sm:text-xl">
          {post.metadata.title}
        </span>
        {post.metadata.summary && (
          <span className="mt-2 block text-[15px] leading-relaxed text-muted">
            {post.metadata.summary}
          </span>
        )}
      </span>
    </Link>
  )
}
