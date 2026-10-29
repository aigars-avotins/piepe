import { forwardRef } from 'react'
import type { CSSProperties, ReactNode } from 'react'
import { shelfEdges } from './content'
import { mediaUrl } from './mediaUrl'

export function EdgeLight({ className = '', transformed = false }: { className?: string; transformed?: boolean }) {
  return <svg className={`edge-light ${className}`} viewBox="0 0 1920 1080" fill="none" aria-hidden="true"><g transform={transformed ? 'matrix(1.474886 -.005 .005 1.474886 -534.575 -216.185)' : undefined}><path d={shelfEdges} /></g></svg>
}

export const ForestScene = forwardRef<HTMLDivElement, { plane: CSSProperties; children: ReactNode; inspect: boolean; still: string; macro: ReactNode; breathing: ReactNode }>(function ForestScene({ plane, children, inspect, still, macro, breathing }, ref) {
  return <div className={`environment ${inspect ? 'is-inspecting' : ''}`} ref={ref} aria-hidden="true">
    <div className="wide-environment"><img src={mediaUrl('/media/forest-breathing-poster.jpg')} alt="" width="1920" height="1080" /><div className="dawn-light" />{breathing}</div>
    <div className="base-camera">
      <div className="media-plane" style={plane}>
        <img className="forest-still" src={mediaUrl(still)} alt="" width="1920" height="1080" fetchPriority="high" />
        {children}
        {!still.startsWith('data:') && <EdgeLight transformed={still.endsWith('forest-awakening-final.jpg')} />}
      </div>
    </div>
    <div className="foreground-carrier"><div className="foreground-camera"><div className="media-plane" style={plane}><img src={mediaUrl('/media/forest-final.jpg')} alt="" width="1920" height="1080" /></div></div></div>

    <div className="understory-cinema">{macro}</div>
    <div className="forest-shade" /><div className="cool-veil" /><div className="dark-veil" />
    <div className="light-shaft shaft-one" /><div className="light-shaft shaft-two" />
    <div className="forest-mist mist-one" /><div className="forest-mist mist-two" />
    <div className="spores">{Array.from({ length: 10 }, (_, i) => <i key={i} style={{ left: `${(i * 29 + 11) % 100}%`, top: `${(i * 37 + 9) % 100}%`, animationDelay: `${-i * 1.7}s`, animationDuration: `${24 + i % 5 * 4}s` }} />)}</div>
  </div>
})
