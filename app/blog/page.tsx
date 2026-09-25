import { getBlogPosts } from 'app/blog/utils'
import { PostRow } from 'app/components/posts'
import { Section } from 'app/components/list'

export const metadata = {
  title: 'Writing',
  description: 'Stories, milestones, and things I learn along the way.',
}

export default function Page() {
  let byYear = new Map<string, ReturnType<typeof getBlogPosts>>()
  for (let post of getBlogPosts()) {
    let year = post.metadata.publishedAt.slice(0, 4)
    byYear.set(year, [...(byYear.get(year) ?? []), post])
  }

  return (
    <div className="space-y-16">
      <section>
        <h1 className="text-2xl font-semibold tracking-tight">Writing</h1>
        <p className="mt-1 text-muted">{metadata.description}</p>
      </section>

      {byYear.size === 0 && (
        <p className="text-muted">No posts yet. Check back soon.</p>
      )}

      {Array.from(byYear).map(([year, posts]) => (
        <Section key={year} title={year}>
          <ul>
            {posts.map((post) => (
              <PostRow key={post.slug} post={post} />
            ))}
          </ul>
        </Section>
      ))}
    </div>
  )
}
