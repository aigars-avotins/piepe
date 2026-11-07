import { discoveryCopy } from './discoveryCopy'
import { memo, useEffect, useRef } from 'react'
import type { Locale } from './i18n'
import { readingPath } from './i18n'
import { notePath } from './forestPaths'
import { renderXray } from './ReadingExperiences'
import { bindXray } from './experienceControls'
import AtmosphereSelector from './AtmosphereSelector'
import Arrow from './Arrow'

export function DiscoveryEntry({locale}:{locale:Locale}) {
  const t=discoveryCopy[locale]
  return <a className="discovery-entry" href="#forest-xray"><span className="discovery-preview" aria-hidden="true"><img src="/media/forest-final.jpg?v=2.3" alt="" width="1920" height="1080" loading="lazy" decoding="async"/><span/></span><span><strong>{t.title}</strong><small>{t.hint}</small></span><span className="discovery-entry-arrow" aria-hidden="true"><Arrow direction="down"/></span></a>
}
const HomeExperiences=memo(function HomeExperiences({locale}:{locale:Locale}) {
  const root=useRef<HTMLDivElement>(null),t=discoveryCopy[locale]
  useEffect(()=>{const section=root.current?.querySelector<HTMLElement>('[data-xray]');return section?bindXray(section):undefined},[locale])
  return <div ref={root} className="home-experiences" key={locale}>
    <div className="exploration-toolbar"><p className="reading-label">{t.label}</p><div className="atmosphere-slot"><AtmosphereSelector locale={locale}/></div></div>
    {renderXray(locale,{compact:true,prefix:'home-xray',anchor:'forest-xray'})}
    <a className="line-link exploration-guide" href={readingPath(locale)+'#beneath-bark'}>{t.guide}<span aria-hidden="true"><Arrow direction="diagonal"/></span></a>
    <div className="exploration-gateways"><a href={readingPath(locale)+'#surface-atlas'}><img src="/experience/atlas-preview-8eb7ab501796.webp" alt="" width="560" height="320" loading="lazy" decoding="async"/><span className="gateway-text"><small>02 / {t.atlas}</small><strong>{t.atlasAction}</strong><span aria-hidden="true"><Arrow direction="diagonal"/></span></span></a><a href={notePath(locale,'005')+'#deadwood-time'}><img src="/experience/time-preview-536b180370d8.webp" alt="" width="560" height="320" loading="lazy" decoding="async"/><span className="gateway-text"><small>03 / {t.time}</small><strong>{t.timeAction}</strong><span aria-hidden="true"><Arrow direction="diagonal"/></span></span></a></div>
  </div>
})
export default HomeExperiences
