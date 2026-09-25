import { site } from 'app/site'

export default function Footer() {
  return (
    <footer className="mt-24 flex flex-col-reverse gap-3 border-t border-line py-8 text-sm text-muted sm:flex-row sm:justify-between">
      <p>© {new Date().getFullYear()}</p>
      <ul className="-mx-1.5 flex flex-wrap">
        {site.links.map(({ label, href }) => (
          <li key={label}>
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-md px-1.5 py-1 transition-colors hover:text-fg"
            >
              {label}
            </a>
          </li>
        ))}
      </ul>
    </footer>
  )
}
