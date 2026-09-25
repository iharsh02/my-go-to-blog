import Link from 'next/link'
import { LinkIcon } from 'app/components/icons'
import { site } from 'app/site'

let initials = site.name
  .split(' ')
  .map((word) => word[0])
  .join('')
  .slice(0, 2)

export default function Page() {
  return (
    <section>
      <div className="flex items-center gap-5 sm:gap-6">
        <div
          aria-hidden
          className="grid size-20 shrink-0 place-items-center rounded-full border border-line bg-card text-2xl font-medium tracking-tight text-muted select-none sm:size-24 sm:text-3xl"
        >
          {initials}
        </div>
        <div className="min-w-0">
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            {site.name}
          </h1>
          <p className="mt-1 text-muted italic">{site.tagline}</p>
          <ul className="mt-3 flex flex-wrap gap-2">
            {site.links.map(({ label, href }) => (
              <li key={label}>
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  title={label}
                  className="grid size-9 place-items-center rounded-full border border-line text-muted transition-colors hover:border-fg hover:text-fg"
                >
                  <LinkIcon label={label} />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-12 space-y-4 text-lg leading-relaxed">
        {site.about.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>

      <Link
        href="/blog"
        className="group mt-10 inline-flex items-center gap-2 rounded-full border border-line px-4 py-2 text-sm transition-colors hover:border-fg"
      >
        Read my writing
        <span
          aria-hidden
          className="text-muted transition-transform group-hover:translate-x-0.5 group-hover:text-fg"
        >
          →
        </span>
      </Link>
    </section>
  )
}
