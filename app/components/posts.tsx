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

// One row in the blog list card: label and date, title, summary, reading time
export function PostListItem({ post }: { post: Post }) {
  return (
    <Link href={`/blog/${post.slug}`} className="group block py-7 outline-offset-4">
      <span className="flex items-center gap-4 text-[13.5px]">
        {post.metadata.tag && <span className="font-medium">{post.metadata.tag}</span>}
        <time dateTime={post.metadata.publishedAt} className="text-muted">
          {formatDate(post.metadata.publishedAt)}
        </time>
      </span>
      <span className="mt-2.5 block text-xl leading-snug font-medium tracking-tight text-balance transition-colors duration-300 group-hover:text-muted sm:text-[1.375rem]">
        {post.metadata.title}
      </span>
      {post.metadata.summary && (
        <span className="mt-2.5 block text-[15px] leading-relaxed text-muted">
          {post.metadata.summary}
        </span>
      )}
      <span className="mt-3 block text-[13.5px] text-muted">
        {post.readingTime} min read
      </span>
    </Link>
  )
}
