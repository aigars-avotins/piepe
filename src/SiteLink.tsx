import type { AnchorHTMLAttributes } from 'react'
import { linkPolicy, plainLinkActivation } from './linkPolicy'

type Props = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'target' | 'rel'> & { href: string }

// A real anchor: hashes, downloads, modified clicks and Back remain browser-owned.
export default function SiteLink({ href, onClick, ...props }: Props) {
  return <a {...props} href={href} {...linkPolicy(href)} onClick={onClick ? event => { if (plainLinkActivation(event)) onClick(event) } : undefined} />
}
