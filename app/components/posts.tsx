import { formatDate, getBlogPosts } from 'app/blog/utils'
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
