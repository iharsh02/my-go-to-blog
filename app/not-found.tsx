import Link from 'next/link'

export default function NotFound() {
  return (
    <section>
      <h1 className="text-2xl font-semibold tracking-tight">Page not found</h1>
      <p className="mt-1 text-muted">
        This page doesn't exist or has moved.
      </p>
      <Link
        href="/"
        className="mt-6 inline-block underline decoration-line underline-offset-4 transition-colors hover:decoration-fg"
      >
        Go home
      </Link>
    </section>
  )
}
