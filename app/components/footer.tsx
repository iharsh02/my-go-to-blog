import { site, visibleLinks } from 'app/site'
import { BrandIcon } from './icons'

export default function Footer() {
  let tagline = site.tagline.charAt(0).toUpperCase() + site.tagline.slice(1)

  return (
    <footer className="column">
      <div className="rule-top flex flex-wrap items-center justify-between gap-x-6 gap-y-3 px-4 py-5 sm:px-5">
        <p className="text-sm text-muted">
          {`© ${new Date().getFullYear()} ${site.name}. ${tagline}`}
        </p>
        <ul className="-mr-2 flex items-center">
          {visibleLinks.map(({ label, href }) => (
            <li key={label}>
              <a
                href={href}
                aria-label={label === 'RSS' ? 'RSS feed' : label}
                {...(/^https?:/.test(href) && {
                  target: '_blank',
                  rel: 'noopener noreferrer',
                })}
                className="grid size-8 place-items-center rounded-full hover:bg-card-2"
              >
                <BrandIcon label={label} className="size-4" />
              </a>
            </li>
          ))}
        </ul>
      </div>

      {/* Oversized name, sized to the content column and faded out at the bottom */}
      <div className="px-4 pt-4 [container-type:inline-size] sm:px-5 sm:pt-6">
        <p aria-hidden className="wordmark">
          {site.name}
        </p>
      </div>
    </footer>
  )
}
