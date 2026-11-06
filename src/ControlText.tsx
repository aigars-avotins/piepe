import type { ReactNode } from 'react'

/** Keep technical labels out of snippets without changing button layout/semantics.
 * Existing .text-button>span styles are for icons (and hide them on phones). */
export default function ControlText({ children }: { children: ReactNode }) {
  return <span data-nosnippet="" style={{ display: 'contents', fontSize: 'inherit', color: 'inherit' }}>{children}</span>
}
