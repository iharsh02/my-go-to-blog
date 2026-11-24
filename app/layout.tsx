import './global.css'
import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { Caveat } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { Navbar } from './components/nav'
import Footer from './components/footer'
import { site, visibleLinks } from './site'
import { avatarUri } from './lib/avatar'
import { getBlogPosts } from './blog/utils'

// Handwriting for the margin notes
const hand = Caveat({ subsets: ['latin'], weight: ['500'], variable: '--font-caveat' })

// Runs before paint so the saved theme never flashes
const themeScript = `try{var t=localStorage.getItem('theme')||'system';var d=t==='dark'||(t==='system'&&matchMedia('(prefers-color-scheme: dark)').matches);document.documentElement.dataset.theme=d?'dark':'light'}catch(e){}`

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: site.name,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  openGraph: {
    title: site.name,
    description: site.description,
    url: site.url,
    siteName: site.name,
    locale: 'en_US',
    type: 'website',
  },
  alternates: {
    types: { 'application/rss+xml': `${site.url}/rss` },
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={`${GeistSans.variable} ${GeistMono.variable} ${hand.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="bg-bg font-sans text-fg antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:rounded-md focus:z-[60] focus:bg-fg focus:px-3 focus:py-2 focus:text-sm focus:text-bg"
        >
          Skip to content
        </a>
        <Navbar
          name={site.name}
          avatar={avatarUri()}
          lines={[site.role, site.tagline, 'Linux · C++ · systems']}
          links={visibleLinks}
          posts={getBlogPosts()
            .slice(0, 3)
            .map((p) => ({ title: p.metadata.title, href: `/blog/${p.slug}` }))}
        />
        {/* overflow-x-clip trims the full-bleed rules that reach past the scrollbar */}
        <div className="flex min-h-dvh flex-col overflow-x-clip">
          <main
            id="main"
            className="column flex-1 px-4 pt-24 pb-16 sm:px-5 sm:pt-28"
          >
            {children}
          </main>
          <Footer />
        </div>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
