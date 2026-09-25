'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { site } from 'app/site'

// Home links to Writing from its content, so the trail only shows elsewhere.
export function Navbar() {
  let pathname = usePathname()

  if (pathname === '/') {
    return <div className="h-12 sm:h-16" />
  }

  let onIndex = pathname === '/blog'

  return (
    <nav aria-label="Breadcrumb" className="py-8 text-sm">
      <ol className="flex items-center gap-2 text-muted">
        <li>
          <Link href="/" className="transition-colors hover:text-fg">
            {site.name}
          </Link>
        </li>
        <li aria-hidden className="text-subtle">
          /
        </li>
        <li>
          <Link
            href="/blog"
            aria-current={onIndex ? 'page' : undefined}
            className={`transition-colors ${onIndex ? 'text-fg' : 'hover:text-fg'}`}
          >
            Writing
          </Link>
        </li>
      </ol>
    </nav>
  )
}
