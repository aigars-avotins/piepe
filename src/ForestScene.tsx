import { forwardRef } from 'react'
import type { CSSProperties, ReactNode } from 'react'
import { shelfEdges } from './content'

export function EdgeLight({ className = '' }: { className?: string }) {
  return <svg className={`edge-light ${className}`} viewBox="0 0 1920 1080" fill="none" aria-hidden="true"><path d={shelfEdges} /></svg>
}

export const ForestScene = forwardRef<HTMLDivElement, { plane: CSSProperties; children: ReactNode; inspect: boolean }>(function ForestScene({ plane, children, inspect }, ref) {
  return <div className={`environment ${inspect ? 'is-inspecting' : ''}`} ref={ref} aria-hidden="true">
    <div className="wide-environment"><img src="/media/forest-poster.jpg" alt="" width="1920" height="1080" /></div>
    <div className="base-camera">
      <div className="media-plane" style={plane}>
        <img className="forest-still" src="/media/forest-final.jpg" alt="" width="1920" height="1080" fetchPriority="high" />
        {children}
        <EdgeLight />
      </div>
    </div>
    <div className="foreground-camera"><div className="media-plane" style={plane}><img src="/media/forest-final.jpg" alt="" width="1920" height="1080" /></div></div>

    <div className="forest-shade" /><div className="cool-veil" /><div className="dark-veil" /><div className="dawn-light" />
    <div className="light-shaft shaft-one" /><div className="light-shaft shaft-two" />
    <div className="forest-mist mist-one" /><div className="forest-mist mist-two" />
    <div className="spores">{Array.from({ length: 10 }, (_, i) => <i key={i} style={{ left: `${(i * 29 + 11) % 100}%`, top: `${(i * 37 + 9) % 100}%`, animationDelay: `${-i * 1.7}s`, animationDuration: `${24 + i % 5 * 4}s` }} />)}</div>
  </div>
})
