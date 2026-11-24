import Link from 'next/link'
import { Icon, type IconName } from './icons'

export function ListItem({
  title,
  meta,
  description,
  href,
}: {
  title: string
  meta: string
  description?: string
  href?: string
}) {
  let external = href && !href.startsWith('/')
  let content = (
    <>
      <span className="flex items-baseline gap-4">
        <span className="font-medium">
          {title}
          {external && (
            <span className="ml-1 text-subtle transition-colors group-hover:text-fg">
              ↗
            </span>
          )}
        </span>
        <span className="mt-[0.6em] h-px flex-1 bg-line" aria-hidden />
        <span className="shrink-0 text-sm text-muted tabular-nums">{meta}</span>
      </span>
      {description && (
        <span className="mt-1 block text-muted">{description}</span>
      )}
    </>
  )

  if (!href) {
    return <li className="py-2.5">{content}</li>
  }

  let className =
    'group -mx-3 block rounded-xl px-3 py-2.5 transition-colors hover:bg-card'

  return (
    <li>
      {external ? (
        <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
          {content}
        </a>
      ) : (
        <Link href={href} className={className}>
          {content}
        </Link>
      )}
    </li>
  )
}

export function Section({
  title,
  children,
  id,
  icon,
  action,
}: {
  title: string
  children: React.ReactNode
  id?: string
  icon?: IconName
  action?: React.ReactNode
}) {
  return (
    <section id={id} aria-labelledby={id && `${id}-title`}>
      <div className="mb-4 flex items-center justify-between gap-4">
        <h2
          id={id && `${id}-title`}
          className="flex items-center gap-2 text-sm font-medium text-muted"
        >
          {icon && <Icon name={icon} className="size-3.5" />}
          {title}
        </h2>
        {action}
      </div>
      {children}
    </section>
  )
}
