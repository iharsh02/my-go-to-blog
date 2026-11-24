'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, MotionConfig, motion } from 'motion/react'
import type { Contributions, Day, GitHubProfile } from 'app/lib/github'
import { BrandIcon, Icon, LinkIcon } from './icons'

const spring = { type: 'spring', stiffness: 380, damping: 32, mass: 0.9 } as const

export type Profile = {
  name: string
  role: string
  bio: string
  avatar: string
  email: string
  links: { label: string; href: string }[]
  contributions: Contributions | null
  github: GitHubProfile | null
  x: {
    name: string
    handle: string
    verified: boolean
    avatar: string
    banner: string
    location: string
    joined: string
    following: number
    followers: number
    bio?: string
  }
  posts: { title: string; date: string }[]
}

// Card width per preview; heights are measured
const widths: Record<string, number> = {
  Email: 248,
  GitHub: 300,
  LinkedIn: 268,
  X: 300,
  RSS: 268,
}

export function Social({ profile }: { profile: Profile }) {
  let rowRef = useRef<HTMLDivElement>(null)
  let [active, setActive] = useState<string | null>(null)
  let [anchor, setAnchor] = useState({ left: 0, origin: 0 })
  let [heights, setHeights] = useState<Record<string, number>>({})
  let [copied, setCopied] = useState(false)
  let closeTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  let show = useCallback((key: string, el: HTMLElement) => {
    clearTimeout(closeTimer.current)
    let row = rowRef.current!.getBoundingClientRect()
    let rect = el.getBoundingClientRect()
    let width = widths[key]
    let center = rect.left + rect.width / 2 - row.left
    // Keep the card inside the viewport with an 8px margin
    let left = Math.min(
      Math.max(center - width / 2, 8 - row.left),
      window.innerWidth - 8 - width - row.left
    )
    setAnchor({ left, origin: center - left })
    setActive(key)
  }, [])

  let hide = useCallback((delay = 120) => {
    clearTimeout(closeTimer.current)
    closeTimer.current = setTimeout(() => setActive(null), delay)
  }, [])

  useEffect(() => {
    if (!active) return
    let onKey = (e: KeyboardEvent) => e.key === 'Escape' && setActive(null)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [active])

  // Hover previews for mouse only; keyboard users get them on focus
  let triggers = (key: string) => ({
    onPointerEnter: (e: React.PointerEvent<HTMLElement>) =>
      e.pointerType === 'mouse' && show(key, e.currentTarget),
    onPointerLeave: () => hide(),
    onFocus: (e: React.FocusEvent<HTMLElement>) =>
      e.currentTarget.matches(':focus-visible') && show(key, e.currentTarget),
    onBlur: () => hide(0),
  })

  let measure = (key: string) => (node: HTMLDivElement | null) => {
    if (!node) return
    let observer = new ResizeObserver(() =>
      setHeights((h) =>
        h[key] === node.offsetHeight ? h : { ...h, [key]: node.offsetHeight }
      )
    )
    observer.observe(node)
    return () => observer.disconnect()
  }

  let copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.email)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      window.location.href = `mailto:${profile.email}`
    }
  }

  let iconLinks = profile.links.filter((l) => l.label !== 'Email')


  return (
    <MotionConfig reducedMotion="user" transition={spring}>
      <div ref={rowRef} className="relative flex flex-wrap items-center gap-1.5">
        <button
          type="button"
          onClick={copyEmail}
          {...triggers('Email')}
          className="mr-1.5 inline-flex h-9 items-center gap-2 overflow-hidden rounded-full bg-fg pr-4 pl-3.5 text-sm font-medium text-bg shadow-soft transition-transform duration-500 ease-spring active:scale-95"
        >
          <AnimatePresence initial={false} mode="popLayout">
            <motion.span
              key={copied ? 'done' : 'copy'}
              className="inline-flex items-center gap-2"
              initial={{ y: 16, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -16, opacity: 0 }}
            >
              <Icon name={copied ? 'check' : 'copy'} className="size-3.5" />
              {copied ? 'Copied' : 'Copy my email'}
            </motion.span>
          </AnimatePresence>
        </button>
        <span className="sr-only" aria-live="polite">
          {copied ? 'Email address copied to clipboard' : ''}
        </span>

        {iconLinks.map(({ label, href }) => (
          <a
            key={label}
            href={href}
            {...(/^https?:/.test(href) && {
              target: '_blank',
              rel: 'noopener noreferrer',
            })}
            aria-label={label === 'RSS' ? 'RSS feed' : label}
            {...triggers(label)}
            className="grid size-9 place-items-center rounded-full transition-[background-color,transform] duration-500 ease-spring hover:-translate-y-0.5 hover:bg-card-2 active:scale-90"
          >
            <BrandIcon label={label} />
          </a>
        ))}

        <AnimatePresence>
          {active && (
            <motion.div
              key="card"
              aria-hidden
              onPointerEnter={() => clearTimeout(closeTimer.current)}
              onPointerLeave={() => hide()}
              className="absolute bottom-full left-0 z-20 mb-3 overflow-hidden rounded-[20px] border border-line bg-card shadow-float"
              style={{ transformOrigin: `${anchor.origin}px 100%` }}
              initial={{
                opacity: 0,
                scale: 0.6,
                filter: 'blur(6px)',
                x: anchor.left,
                width: widths[active],
                height: heights[active] ?? 120,
              }}
              animate={{
                opacity: 1,
                scale: 1,
                filter: 'blur(0px)',
                x: anchor.left,
                width: widths[active],
                height: heights[active] ?? 120,
              }}
              exit={{ opacity: 0, scale: 0.8, filter: 'blur(6px)' }}
            >
              <AnimatePresence initial={false}>
                <motion.div
                  key={active}
                  ref={measure(active)}
                  className="absolute top-0 left-0"
                  style={{ width: widths[active] }}
                  initial={{ opacity: 0, filter: 'blur(4px)' }}
                  animate={{ opacity: 1, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, filter: 'blur(4px)' }}
                >
                  <Preview kind={active} profile={profile} copied={copied} />
                </motion.div>
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </MotionConfig>
  )
}

function handleOf(profile: Profile, label: string) {
  let href = profile.links.find((l) => l.label === label)?.href ?? ''
  return href.replace(/\/+$/, '').split('/').pop() ?? ''
}

function Preview({
  kind,
  profile,
  copied,
}: {
  kind: string
  profile: Profile
  copied: boolean
}) {
  let avatar = (size: string) => (
    <img
      src={profile.avatar}
      alt=""
      className={`${size} shrink-0 rounded-full border border-line bg-card-2`}
    />
  )

  if (kind === 'GitHub') {
    return <GitHubPreview profile={profile} avatar={avatar('size-9')} />
  }

  if (kind === 'LinkedIn') {
    return (
      <div className="pb-4">
        <div className="h-16 bg-linear-to-br from-linkedin to-[#5aa9f0]" />
        <div className="-mt-8 px-4">
          <div className="rounded-full border-[3px] border-card bg-card w-fit">
            {avatar('size-16')}
          </div>
          <p className="mt-2 text-[15px] font-semibold">{profile.name}</p>
          <p className="text-[13px] leading-snug text-muted">{profile.bio}</p>
          <p className="mt-3 text-xs font-semibold text-linkedin dark:text-[#70b5f9]">
            View profile on LinkedIn
          </p>
        </div>
      </div>
    )
  }

  if (kind === 'X') {
    let x = profile.x
    return (
      <div className="pb-3.5">
        <img src={x.banner} alt="" className="h-[72px] w-full bg-card-2 object-cover" />
        <div className="px-4">
          <div className="-mt-7 flex items-end justify-between">
            <img
              src={x.avatar}
              alt=""
              className="size-14 rounded-full border-[3px] border-card bg-card object-cover"
            />
            <BrandIcon label="X" className="mb-1 size-4" />
          </div>
          <p className="mt-1.5 flex items-center gap-1 text-[15px] leading-tight font-semibold">
            {x.name}
            {x.verified && <VerifiedBadge />}
          </p>
          <p className="text-[13px] text-muted">@{x.handle}</p>
          {x.bio && <p className="mt-2.5 text-[13px] leading-snug">{x.bio}</p>}
          <p className="mt-2.5 flex flex-wrap gap-x-3 gap-y-1 text-[12.5px] text-muted">
            <span className="flex items-center gap-1">
              <svg viewBox="0 0 24 24" className="size-3.5" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M20 10c0 4.99-5.54 10.19-7.4 11.8a1 1 0 0 1-1.2 0C9.54 20.19 4 14.99 4 10a8 8 0 0 1 16 0" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              {x.location}
            </span>
            <span className="flex items-center gap-1">
              <svg viewBox="0 0 24 24" className="size-3.5" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <rect x="3" y="4" width="18" height="18" rx="2" />
                <path d="M16 2v4M8 2v4M3 10h18" />
              </svg>
              Joined {x.joined}
            </span>
          </p>
          <p className="mt-1.5 flex gap-3 text-[13px] tabular-nums">
            <span>
              <strong className="font-semibold">{x.following}</strong>{' '}
              <span className="text-muted">Following</span>
            </span>
            <span>
              <strong className="font-semibold">{x.followers}</strong>{' '}
              <span className="text-muted">Followers</span>
            </span>
          </p>
        </div>
      </div>
    )
  }

  if (kind === 'RSS') {
    return (
      <div className="p-4">
        <div className="flex items-center gap-3">
          <span className="grid size-9 place-items-center rounded-xl bg-rss text-white">
            <LinkIcon label="RSS" />
          </span>
          <div>
            <p className="text-[15px] font-semibold">Subscribe via RSS</p>
            <p className="text-[13px] text-muted">New posts, straight to your reader</p>
          </div>
        </div>
        {profile.posts.length > 0 && (
          <ul className="mt-3 space-y-1.5 border-t border-line pt-3">
            {profile.posts.map((post) => (
              <li key={post.title} className="flex items-baseline gap-3 text-[13px]">
                <span className="min-w-0 flex-1 truncate">{post.title}</span>
                <span className="shrink-0 text-xs text-muted tabular-nums">{post.date}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    )
  }

  return (
    <div className="flex items-center gap-3 p-3.5">
      <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-card-2 text-fg">
        <LinkIcon label="Email" />
      </span>
      <div className="min-w-0">
        <p className="truncate font-mono text-[12.5px]">{profile.email}</p>
        <p className="text-[12.5px] text-muted">
          {copied ? 'Copied to your clipboard' : 'Click to copy'}
        </p>
      </div>
    </div>
  )
}

const WEEKS = 20

function GitHubPreview({
  profile,
  avatar,
}: {
  profile: Profile
  avatar: React.ReactNode
}) {
  let [hovered, setHovered] = useState<Day | null>(null)
  let data = profile.contributions
  let weeks = data?.weeks.slice(-WEEKS) ?? []

  let caption = hovered
    ? `${hovered.count || 'No'} contribution${hovered.count === 1 ? '' : 's'} · ${new Date(
        `${hovered.date}T00:00:00`
      ).toLocaleDateString('en-us', { month: 'short', day: 'numeric' })}`
    : data
      ? `${data.total.toLocaleString('en-us')} contributions in the last year`
      : 'Code, experiments and side projects'

  let gh = profile.github

  return (
    <div className="p-3.5">
      <div className="flex items-center gap-3">
        {gh ? (
          <img
            src={gh.avatar}
            alt=""
            className="size-10 shrink-0 rounded-full border border-line bg-card-2"
          />
        ) : (
          avatar
        )}
        <div className="min-w-0 flex-1">
          <p className="truncate text-[15px] leading-tight font-semibold">
            {gh?.name ?? handleOf(profile, 'GitHub')}
          </p>
          <p className="truncate text-[13px] text-muted">
            @{gh?.login ?? handleOf(profile, 'GitHub')}
            {gh && ` · since ${gh.joined}`}
          </p>
        </div>
        <BrandIcon label="GitHub" className="size-[18px]" />
      </div>
      {gh?.bio && <p className="mt-2.5 text-[13px] leading-snug">{gh.bio}</p>}
      {gh && (
        <p className="mt-2.5 flex flex-wrap gap-x-3 gap-y-1 text-[13px] tabular-nums">
          {(
            [
              [gh.repos, 'repos'],
              [gh.followers, 'followers'],
              [gh.following, 'following'],
            ] as const
          ).map(([n, label]) => (
            <span key={label}>
              <strong className="font-semibold">{n}</strong>{' '}
              <span className="text-muted">{label}</span>
            </span>
          ))}
        </p>
      )}
      <p className="mt-3 truncate text-[12.5px] text-muted tabular-nums">{caption}</p>
      {weeks.length > 0 && (
        <div
          className="mt-1.5 flex gap-[3px]"
          onPointerLeave={() => setHovered(null)}
        >
          {weeks.map((week, w) => (
            <div key={w} className="flex flex-col gap-[3px]">
              {week.map((day) => (
                <span
                  key={day.date}
                  onPointerEnter={() => setHovered(day)}
                  className="size-[10px] rounded-[2.5px] transition-transform duration-300 ease-spring hover:scale-150"
                  style={{ background: `var(--gh-${day.level})` }}
                />
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// Scalloped verified badge: a 16-point star with rounded joins and a white check
const BADGE = Array.from({ length: 32 }, (_, i) => {
  let r = i % 2 ? 9.2 : 10.6
  let a = (i / 32) * Math.PI * 2
  return `${(12 + Math.cos(a) * r).toFixed(2)},${(12 + Math.sin(a) * r).toFixed(2)}`
}).join(' ')

function VerifiedBadge() {
  return (
    <svg viewBox="0 0 24 24" className="size-[17px] shrink-0" role="img" aria-label="Verified">
      <polygon points={BADGE} fill="#1d9bf0" stroke="#1d9bf0" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="m7.6 12.3 3 3 5.8-6.2" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
