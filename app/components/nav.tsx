'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, MotionConfig, motion, useReducedMotion } from 'motion/react'
import { BrandIcon, Icon, type IconName } from './icons'

type Theme = 'light' | 'dark' | 'system'

const spring = { type: 'spring', stiffness: 420, damping: 34, mass: 0.8 } as const

function applyTheme(theme: Theme) {
  let root = document.documentElement
  let dark =
    theme === 'dark' ||
    (theme === 'system' && matchMedia('(prefers-color-scheme: dark)').matches)
  root.classList.add('theme-switching')
  root.dataset.theme = dark ? 'dark' : 'light'
  void getComputedStyle(root).color
  requestAnimationFrame(() => root.classList.remove('theme-switching'))
}

function useTheme() {
  let [theme, setThemeState] = useState<Theme>('system')

  useEffect(() => {
    try {
      setThemeState((localStorage.getItem('theme') as Theme) || 'system')
    } catch {}
  }, [])

  useEffect(() => {
    if (theme !== 'system') return
    let query = matchMedia('(prefers-color-scheme: dark)')
    let onChange = () => applyTheme('system')
    query.addEventListener('change', onChange)
    return () => query.removeEventListener('change', onChange)
  }, [theme])

  let setTheme = useCallback((next: Theme) => {
    setThemeState(next)
    applyTheme(next)
    try {
      localStorage.setItem('theme', next)
    } catch {}
  }, [])

  return [theme, setTheme] as const
}

type Item = { label: string; href: string; icon: IconName | 'brand'; page?: boolean }

export function Navbar({
  name,
  avatar,
  lines,
  links,
  posts,
}: {
  name: string
  avatar: string
  lines: string[]
  links: { label: string; href: string }[]
  posts: { title: string; href: string }[]
}) {
  let pathname = usePathname()
  let reduceMotion = useReducedMotion()
  let [open, setOpen] = useState(false)
  let [line, setLine] = useState(0)
  let [scrolled, setScrolled] = useState(false)
  let [mac, setMac] = useState(true)
  let [theme, setTheme] = useTheme()
  let rootRef = useRef<HTMLDivElement>(null)
  let triggerRef = useRef<HTMLButtonElement>(null)
  let panelRef = useRef<HTMLDivElement>(null)

  let close = useCallback((refocus = false) => {
    setOpen(false)
    if (refocus) triggerRef.current?.focus()
  }, [])

  useEffect(() => {
    setMac(/Mac|iPhone|iPad/.test(navigator.userAgent))
    let onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (reduceMotion || open || lines.length < 2) return
    let id = setInterval(() => setLine((i) => (i + 1) % lines.length), 3500)
    return () => clearInterval(id)
  }, [reduceMotion, open, lines.length])

  useEffect(() => close(), [pathname, close])

  useEffect(() => {
    let onKey = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((o) => !o)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  useEffect(() => {
    if (!open) return
    let onPointer = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) close()
    }
    document.addEventListener('pointerdown', onPointer)
    return () => document.removeEventListener('pointerdown', onPointer)
  }, [open, close])

  let onPanelKey = (e: React.KeyboardEvent) => {
    let items = Array.from(
      panelRef.current?.querySelectorAll<HTMLElement>('[data-item]') ?? []
    )
    let i = items.indexOf(document.activeElement as HTMLElement)
    let next =
      e.key === 'ArrowDown' || (e.key === 'ArrowRight' && i >= items.length - 3)
        ? i + 1
        : e.key === 'ArrowUp' || (e.key === 'ArrowLeft' && i >= items.length - 3)
          ? i - 1
          : e.key === 'Home'
            ? 0
            : e.key === 'End'
              ? items.length - 1
              : null
    if (e.key === 'Escape') {
      e.preventDefault()
      close(true)
    } else if (next !== null) {
      e.preventDefault()
      items[(next + items.length) % items.length]?.focus()
    } else if (e.key === 'Tab') {
      close()
    }
  }

  let sections: Item[] = [
    { label: 'Home', href: '/', icon: 'home', page: true },
    { label: 'Writing', href: '/blog', icon: 'pen', page: true },
  ]
  let connect: Item[] = links.map((l) => ({ ...l, icon: 'brand' }))
  let recent: Item[] = posts.map((p) => ({
    label: p.title,
    href: p.href,
    icon: 'file',
    page: true,
  }))

  return (
    <MotionConfig reducedMotion="user" transition={spring}>
      <header className="pointer-events-none fixed inset-x-0 top-3 z-50 flex justify-center px-4 sm:top-4">
        <motion.div
          ref={rootRef}
          initial={false}
          animate={{ width: open ? 340 : 264 }}
          className={`pointer-events-auto max-w-full overflow-hidden rounded-[22px] border border-line backdrop-blur-xl transition-[box-shadow,background-color] duration-300 ${
            open ? "bg-card/97" : "bg-card/85"
          } ${
            scrolled || open ? 'shadow-float' : 'shadow-soft'
          }`}
        >
          <button
            ref={triggerRef}
            type="button"
            aria-expanded={open}
            aria-controls="site-menu"
            aria-label={`${name}, open navigation menu`}
            onClick={() => setOpen((o) => !o)}
            onKeyDown={(e) => {
              if (e.key === 'ArrowDown' && !open) {
                e.preventDefault()
                setOpen(true)
              }
            }}
            className="flex w-full items-center gap-2.5 rounded-[21px] py-1.5 pr-2.5 pl-1.5 text-left outline-offset-[-2px]"
          >
            <img
              src={avatar}
              alt=""
              width={32}
              height={32}
              className="size-8 shrink-0 rounded-full border border-line bg-card-2"
            />
            <span className="min-w-0 flex-1" aria-hidden>
              <span className="block truncate text-[13px] leading-tight font-semibold">
                {name}
              </span>
              <span className="relative block h-4 overflow-hidden text-[11.5px] leading-4 text-muted">
                <AnimatePresence initial={false} mode="popLayout">
                  <motion.span
                    key={line}
                    className="absolute inset-0 truncate"
                    initial={{ y: 14, opacity: 0, filter: 'blur(2px)' }}
                    animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
                    exit={{ y: -14, opacity: 0, filter: 'blur(2px)' }}
                  >
                    {lines[line]}
                  </motion.span>
                </AnimatePresence>
              </span>
            </span>
            <kbd className="hidden shrink-0 rounded-md border border-line bg-card-2 px-1.5 py-0.5 font-sans text-[11px] text-muted sm:block">
              {mac ? '⌘K' : 'Ctrl K'}
            </kbd>
          </button>

          <AnimatePresence initial={false}>
            {open && (
              <motion.div
                key="panel"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                onAnimationComplete={() => {
                  if (open && !panelRef.current?.contains(document.activeElement)) {
                    panelRef.current?.querySelector<HTMLElement>('[data-item]')?.focus()
                  }
                }}
              >
                <div
                  ref={panelRef}
                  id="site-menu"
                  onKeyDown={onPanelKey}
                  className="max-h-[calc(100dvh-6rem)] overflow-y-auto border-t border-line px-1.5 pt-1 pb-1.5"
                >
                  <Group title="Sections" items={sections} pathname={pathname} onSelect={() => close()} />
                  {recent.length > 0 && (
                    <Group title="Recent writing" items={recent} pathname={pathname} onSelect={() => close()} />
                  )}
                  <Group title="Connect" items={connect} pathname={pathname} onSelect={() => close()} />

                  <p className="px-2.5 pt-3 pb-1 text-[11px] font-medium text-muted" id="theme-label">
                    Theme
                  </p>
                  <div
                    role="radiogroup"
                    aria-labelledby="theme-label"
                    className="relative grid grid-cols-3 gap-1"
                  >
                    {(
                      [
                        ['light', 'Light', 'sun'],
                        ['dark', 'Dark', 'moon'],
                        ['system', 'System', 'monitor'],
                      ] as const
                    ).map(([value, label, icon]) => (
                      <button
                        key={value}
                        type="button"
                        role="radio"
                        aria-checked={theme === value}
                        data-item
                        onClick={() => setTheme(value)}
                        className={`relative flex items-center justify-center gap-1.5 rounded-xl py-2 text-[13px] transition-colors outline-offset-[-2px] ${
                          theme === value ? 'text-fg' : 'text-muted hover:text-fg'
                        }`}
                      >
                        {theme === value && (
                          <motion.span
                            layoutId="theme-pill"
                            className="absolute inset-0 rounded-xl bg-card-2"
                          />
                        )}
                        <span className="relative flex items-center gap-1.5">
                          <Icon name={icon} className="size-3.5" />
                          {label}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </header>
    </MotionConfig>
  )
}

function Group({
  title,
  items,
  pathname,
  onSelect,
}: {
  title: string
  items: Item[]
  pathname: string
  onSelect: () => void
}) {
  let row =
    'group flex items-center gap-2.5 rounded-xl px-2.5 py-2 text-[13.5px] text-fg/90 transition-colors outline-offset-[-2px] hover:bg-card-2 focus-visible:bg-card-2'

  return (
    <>
      <p className="px-2.5 pt-3 pb-1 text-[11px] font-medium text-muted">{title}</p>
      <ul>
        {items.map((item) => {
          let content = (
            <>
              <span className="text-muted transition-colors group-hover:text-fg">
                {item.icon === 'brand' ? (
                  <BrandIcon label={item.label} className="size-4" />
                ) : (
                  <Icon name={item.icon} />
                )}
              </span>
              <span className="min-w-0 flex-1 truncate">{item.label}</span>
              {/^https?:/.test(item.href) && (
                <Icon name="arrow" className="size-3.5 text-subtle" />
              )}
            </>
          )
          return (
            <li key={item.href}>
              {item.page ? (
                <Link
                  href={item.href}
                  data-item
                  onClick={onSelect}
                  aria-current={pathname === item.href ? 'page' : undefined}
                  className={row}
                >
                  {content}
                </Link>
              ) : (
                <a
                  href={item.href}
                  data-item
                  onClick={onSelect}
                  {...(/^https?:/.test(item.href) && {
                    target: '_blank',
                    rel: 'noopener noreferrer',
                  })}
                  className={row}
                >
                  {content}
                </a>
              )}
            </li>
          )
        })}
      </ul>
    </>
  )
}
