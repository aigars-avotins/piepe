import SiteLink from './SiteLink'
import {portalCopy} from './portalCopy'
import { discoveryCopy } from './discoveryCopy'
import { memo, useEffect, useRef } from 'react'
import type {MouseEvent} from 'react'
import type { Locale } from './i18n'
import { readingPath } from './i18n'
import { notePath } from './forestPaths'
import { renderXray } from './ReadingExperiences'
import { bindImageFallback, bindXray } from './experienceControls'
import RasterImage from './RasterImage'
import Arrow from './Arrow'

export function DiscoveryEntry({locale,onPortal,inactive}:{locale:Locale;onPortal?:(event:MouseEvent<HTMLElement>)=>void;inactive?:boolean}) {
  const t=portalCopy[locale]
  return <SiteLink className="discovery-entry" href="#encounter" data-portal-hero-entry onClick={event=>{if(onPortal){event.preventDefault();if(!inactive)onPortal(event)}}} aria-haspopup={onPortal&&!inactive?"dialog":undefined} aria-label={`${t.entry}. ${t.teaserHint}`}><span className="discovery-preview" aria-hidden="true"><img data-portal-preview src="/images/portal/threshold-160.webp" srcSet="/images/portal/threshold-160.webp 160w, /images/portal/threshold-480.webp 480w" sizes="(max-width:699px) 48px, 70px" alt="" width="1672" height="941" loading="lazy" decoding="async"/></span><span><strong>{t.entry}</strong><small>{t.teaserHint}</small></span><span className="discovery-entry-arrow" aria-hidden="true"><Arrow direction="diagonal"/></span></SiteLink>
}
const HomeExperiences=memo(function HomeExperiences({locale}:{locale:Locale}) {
  const root=useRef<HTMLDivElement>(null),t=discoveryCopy[locale]
  useEffect(()=>{const section=root.current?.querySelector<HTMLElement>('[data-xray]');if(!section||!root.current)return;const unbind=bindXray(section),images=bindImageFallback(root.current);return()=>{unbind();images()}},[locale])
  return <div ref={root} className="home-experiences" key={locale}>
    <div className="exploration-toolbar"><p className="reading-label">{t.label}</p></div>
    {renderXray(locale,{compact:true,prefix:'home-xray',anchor:'forest-xray'})}
    <SiteLink className="line-link exploration-guide" href={readingPath(locale)+'#beneath-bark'}>{t.guide}<span aria-hidden="true"><Arrow direction="diagonal"/></span></SiteLink>
    <div className="exploration-gateways"><SiteLink href={readingPath(locale)+'#surface-atlas'}><span className="gateway-photo"><RasterImage name="atlas-pores" alt="" width={2400} height={1792} sizes="(max-width:699px) calc(100vw - 48px), (max-width:1100px) calc(49vw - 36px), (min-width:1800px) 870px, calc(49vw - 46px)"/></span><span className="gateway-text"><small>02 / {t.atlas}</small><strong>{t.atlasAction}</strong><span aria-hidden="true"><Arrow direction="diagonal"/></span></span></SiteLink><SiteLink href={notePath(locale,'005')+'#deadwood-time'}><span className="gateway-photo"><RasterImage name="deadwood-stage-03" alt="" sizes="(max-width:699px) calc(100vw - 48px), (max-width:1100px) calc(33vw - 24px), (min-width:1800px) 580px, calc(33vw - 30px)"/></span><span className="gateway-text"><small>03 / {t.time}</small><strong>{t.timeAction}</strong><span aria-hidden="true"><Arrow direction="diagonal"/></span></span></SiteLink></div>
  </div>
})
export default HomeExperiences
