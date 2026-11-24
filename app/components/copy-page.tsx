'use client'

import { useState } from 'react'
import { Icon } from './icons'

// Copies the post as Markdown, handy for pasting into notes or an AI chat
export function CopyPage({ markdown }: { markdown: string }) {
  let [copied, setCopied] = useState(false)

  let copy = async () => {
    try {
      await navigator.clipboard.writeText(markdown)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {}
  }

  return (
    <>
      <button
        type="button"
        onClick={copy}
        className="inline-flex h-8 shrink-0 items-center gap-1.5 rounded-lg border border-line bg-card px-3 text-[13px] font-medium shadow-soft transition-[background-color,transform] duration-500 ease-spring hover:bg-card-2 active:scale-95"
      >
        <Icon name={copied ? 'check' : 'copy'} className="size-3.5" />
        {copied ? 'Copied' : 'Copy page'}
      </button>
      <span className="sr-only" aria-live="polite">
        {copied ? 'Post copied to clipboard as Markdown' : ''}
      </span>
    </>
  )
}
