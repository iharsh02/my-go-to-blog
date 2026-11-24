import { site, visibleLinks } from 'app/site'
import { avatarUri } from 'app/lib/avatar'
import { getContributions, getProfile } from 'app/lib/github'
import { formatDate, getBlogPosts, getExcerpt } from 'app/blog/utils'
import { Social } from 'app/components/social'
import { LatestPost } from 'app/components/latest-post'
import { Dimension, Note } from 'app/components/annotations'
import { Hatch } from 'app/components/grid'

function Rich({ text }: { text: string }) {
  return text.split(/(\*\*[^*]+\*\*)/).map((part, i) =>
    part.startsWith('**') ? (
      <strong key={i} className="font-semibold text-fg">
        {part.slice(2, -2)}
      </strong>
    ) : (
      part
    )
  )
}

export default async function Page() {
  let [contributions, github] = await Promise.all([
    getContributions(site.github),
    getProfile(site.github),
  ])
  let posts = getBlogPosts()
  let avatar = avatarUri()

  return (
    <div className="-mx-4 sm:-mx-5">
      <section className="rule-top relative grid grid-cols-[auto_1fr]">
        <Dimension
          label="672"
          className="absolute inset-x-0 bottom-full mb-5 hidden md:flex"
        />
        <Dimension
          vertical
          label="Ø96"
          className="absolute top-4 right-full bottom-4 mr-4 hidden lg:flex"
        />
        <Note arrow="left" className="absolute top-14 left-full ml-5 hidden lg:flex">
          that&apos;s me
        </Note>
        <div className="border-r border-line p-3 sm:p-4">
          <img
            src={avatar}
            alt={`Illustrated avatar of ${site.name}`}
            width={96}
            height={96}
            className="size-20 rounded-full border border-line bg-card sm:size-24"
          />
        </div>
        <div className="flex min-w-0 flex-col justify-end">
          <h1 className="border-b border-line px-4 pb-2 text-2xl font-semibold tracking-tight sm:px-5 sm:text-[1.75rem]">
            {site.name}
          </h1>
          <p className="px-4 py-2 font-mono text-[13px] text-muted sm:px-5">{site.tagline}</p>
        </div>
      </section>

      <Hatch measure="32" />

      <section className="space-y-4 px-4 py-6 text-[1.0625rem] leading-relaxed text-muted sm:px-5">
        {site.about.map((paragraph) => (
          <p key={paragraph}>
            <Rich text={paragraph} />
          </p>
        ))}
      </section>

      <Hatch />

      <section aria-label="Contact" className="relative px-4 py-4 sm:px-5">
        <Note
          arrow="right"
          tilt={-4}
          className="absolute top-1/2 right-full mr-2 hidden -translate-y-1/2 lg:flex"
        >
          follow me
        </Note>
        <Social
          profile={{
            name: site.name,
            role: site.role,
            bio: site.description,
            avatar,
            email: site.email,
            links: visibleLinks,
            contributions,
            github,
            x: site.x,
            posts: posts.slice(0, 2).map((p) => ({
              title: p.metadata.title,
              date: formatDate(p.metadata.publishedAt, 'short'),
            })),
          }}
        />
      </section>

      <Hatch />

      {posts.length > 0 && (
        <>
          <section id="writing" aria-label="Writing" className="relative">
            <Note
              arrow="down-left"
              tilt={5}
              className="absolute top-3 left-full ml-3 hidden lg:flex"
            >
              fresh off the keyboard
            </Note>
            <LatestPost
              total={posts.length}
              post={{
                title: posts[0].metadata.title,
                summary: posts[0].metadata.summary,
                href: `/blog/${posts[0].slug}`,
                date: formatDate(posts[0].metadata.publishedAt, 'short'),
                readingTime: posts[0].readingTime,
                excerpt: getExcerpt(posts[0].content),
              }}
            />
          </section>
          <Hatch />
        </>
      )}
    </div>
  )
}
