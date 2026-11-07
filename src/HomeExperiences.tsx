import {portalCopy} from './portalCopy'
import { discoveryCopy } from './discoveryCopy'
import { memo, useEffect, useRef } from 'react'
import type { Locale } from './i18n'
import { readingPath } from './i18n'
import { notePath } from './forestPaths'
import { renderXray } from './ReadingExperiences'
import { bindImageFallback, bindXray } from './experienceControls'
import RasterImage from './RasterImage'
import Arrow from './Arrow'

export function DiscoveryEntry({locale}:{locale:Locale}) {
  const t=portalCopy[locale]
  return <a className="discovery-entry" href="#encounter"><span className="discovery-preview" aria-hidden="true"><img src="/media/forest-final.jpg?v=2.3" alt="" width="1920" height="1080" loading="lazy" decoding="async"/></span><span><strong>{t.teaser}</strong><small>{t.teaserHint}</small></span><span className="discovery-entry-arrow" aria-hidden="true"><Arrow direction="down"/></span></a>
}
const HomeExperiences=memo(function HomeExperiences({locale}:{locale:Locale}) {
  const root=useRef<HTMLDivElement>(null),t=discoveryCopy[locale]
  useEffect(()=>{const section=root.current?.querySelector<HTMLElement>('[data-xray]');if(!section||!root.current)return;const unbind=bindXray(section),images=bindImageFallback(root.current);return()=>{unbind();images()}},[locale])
  return <div ref={root} className="home-experiences" key={locale}>
    <div className="exploration-toolbar"><p className="reading-label">{t.label}</p></div>
    {renderXray(locale,{compact:true,prefix:'home-xray',anchor:'forest-xray'})}
    <a className="line-link exploration-guide" href={readingPath(locale)+'#beneath-bark'} target="_blank" rel="noopener noreferrer">{t.guide}<span aria-hidden="true"><Arrow direction="diagonal"/></span></a>
    <div className="exploration-gateways"><a href={readingPath(locale)+'#surface-atlas'} target="_blank" rel="noopener noreferrer"><RasterImage name="atlas-pores" alt="" width={2400} height={1792}/><span className="gateway-text"><small>02 / {t.atlas}</small><strong>{t.atlasAction}</strong><span aria-hidden="true"><Arrow direction="diagonal"/></span></span></a><a href={notePath(locale,'005')+'#deadwood-time'} target="_blank" rel="noopener noreferrer"><RasterImage name="deadwood-stage-03" alt=""/><span className="gateway-text"><small>03 / {t.time}</small><strong>{t.timeAction}</strong><span aria-hidden="true"><Arrow direction="diagonal"/></span></span></a></div>
  </div>
})
export default HomeExperiences
