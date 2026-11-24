function Arrowhead({ dir }: { dir: 'up' | 'down' | 'left' | 'right' }) {
  let rotate = { up: 0, right: 90, down: 180, left: 270 }[dir]
  return (
    <svg
      viewBox="0 0 10 6"
      className="h-1.5 w-2.5 shrink-0"
      style={{ rotate: `${rotate}deg` }}
      fill="none"
      stroke="currentColor"
      strokeWidth={1}
    >
      <path d="M1 5.5 5 1l4 4.5" />
    </svg>
  )
}

export function Dimension({
  label,
  vertical,
  compact,
  className = '',
}: {
  label: string
  vertical?: boolean
  compact?: boolean
  className?: string
}) {
  let line = vertical ? 'w-px flex-1 bg-current' : 'h-px flex-1 bg-current'
  let tick = vertical ? 'h-px w-3 bg-current' : 'h-3 w-px bg-current'
  return (
    <div
      aria-hidden
      className={`pointer-events-none flex items-center text-subtle select-none ${
        vertical ? 'flex-col' : 'flex-row'
      } ${className}`}
    >
      <span className={tick} />
      <Arrowhead dir={vertical ? 'up' : 'left'} />
      <span className={line} />
      <span
        className={`font-mono text-[11px] leading-none text-muted ${
          compact ? 'absolute top-1/2 left-full ml-1.5 -translate-y-1/2' : 'px-1.5 py-1'
        }`}
      >
        {label}
      </span>
      {!compact && <span className={line} />}
      <Arrowhead dir={vertical ? 'down' : 'right'} />
      <span className={tick} />
    </div>
  )
}

const arrows = {
  'down-right': { box: '0 0 44 40', d: 'M5 4c1 14 9 25 31 29', head: 'M28 27l9 6-10 4' },
  left: { box: '0 0 56 30', d: 'M52 6C38 1 22 4 8 17', head: 'M17 16l-9 2 2-9' },
  right: { box: '0 0 56 30', d: 'M4 6c14-5 30-2 44 11', head: 'M39 16l9 2-2-9' },
  'down-left': { box: '0 0 44 40', d: 'M39 4c-1 14-9 25-31 29', head: 'M16 27l-9 6 10 4' },
}

export function Note({
  children,
  arrow,
  className = '',
  tilt = -6,
}: {
  children: React.ReactNode
  arrow: keyof typeof arrows
  className?: string
  tilt?: number
}) {
  let a = arrows[arrow]
  let svg = (
    <svg
      viewBox={a.box}
      className="h-9 w-11 shrink-0"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.4}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d={a.d} />
      <path d={a.head} />
    </svg>
  )
  return (
    <div
      aria-hidden
      className={`pointer-events-none flex font-hand text-[19px] leading-none whitespace-nowrap text-ink select-none ${
        arrow === 'left' || arrow === 'right' ? 'flex-row items-start gap-1' : 'flex-col'
      } ${className}`}
    >
      {arrow === 'left' && svg}
      <span style={{ rotate: `${tilt}deg` }}>{children}</span>
      {arrow === 'right' && <span className="mt-1.5">{svg}</span>}
      {arrow === 'down-right' && <span className="ml-8">{svg}</span>}
      {arrow === 'down-left' && <span className="-ml-2">{svg}</span>}
    </div>
  )
}
