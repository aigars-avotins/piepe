import Arrow from './Arrow'
import { useState } from 'react'
import type { CSSProperties, MouseEvent, RefObject } from 'react'
import { messages } from './i18n'
import type { Locale } from './i18n'
type Props = {
  locale: Locale; plane?: CSSProperties; hotspot?: RefObject<HTMLButtonElement | null>;
  intro?: boolean; imageFailed?: boolean; collected?: boolean; paused?: boolean;
  onDiscovery?: (event: MouseEvent<HTMLButtonElement>) => void; onReturn?: () => void; onPause?: () => void;
  inspectEvents?: { onMouseEnter: () => void; onMouseLeave: () => void; onFocus: () => void; onBlur: () => void };
}
export default function Story({ locale, plane, hotspot, intro = false, imageFailed = false, collected = false, paused = false, onDiscovery, onReturn, onPause, inspectEvents }: Props) {
  const t = messages[locale]
  const [downloadHint, setDownloadHint] = useState(false)
  return <>    <main>
      <section id="forest" tabIndex={-1} className="hero" data-scene="forest" aria-labelledby="hero-title">
        <div className="hero-copy"><p className="label title-enter">{t.heroLabel}</p><h1 id="hero-title" className="wordmark" aria-label="pie.pe"><span>pie</span><span className="wordmark-period">.</span><span>pe</span></h1><p className="hero-deck title-enter">{t.heroThought}</p></div>
        <div className="hero-hotspot-plane" style={plane}>
          <button className="fungus-hit" disabled={intro} onClick={onDiscovery} aria-label={t.discover} aria-haspopup="dialog" {...inspectEvents} />
          <button ref={hotspot} className="fungus-annotation" disabled={intro} onClick={onDiscovery} aria-label={t.closer} aria-haspopup="dialog" {...inspectEvents}><span className="annotation-cross" aria-hidden="true">+</span><span>{t.lookCloser} <span aria-hidden="true"><Arrow direction="diagonal" /></span></span></button>
        </div>
        <div className="hero-foot title-enter"><p><span lang="lv">piepe</span><span className="foot-rule" />{t.wordMeaning}</p><a className="scroll-cue" href="#understory">{t.follow} <span aria-hidden="true"><Arrow direction="down" /></span></a><span className="edition">{t.edition}</span></div>
        {imageFailed && <p className="media-note">{t.imageError} <button onClick={onDiscovery}>{t.openEncounter}</button>.</p>}
      </section>
      <section id="understory" className="chapter bark-chapter" data-scene="understory" aria-labelledby="bark-title">
        <div className="chapter-label"><span className="label">{t.beneathLabel}</span><span className="chapter-line" /></div>
        <div className="bark-copy"><h2 id="bark-title">{t.beneathTitle}<br /><em>{t.beneathEm}</em></h2><p className="chapter-body">{t.beneathBody}</p><a className="line-link" href="#encounter">{t.stay} <span aria-hidden="true"><Arrow direction="down" /></span></a></div>
        <span className="depth-coordinate" aria-hidden="true">{t.depth}</span>
      </section>
      <section id="encounter" className="chapter encounter-chapter" data-scene="encounter" aria-labelledby="encounter-title">
        <div className="chapter-label"><span className="label">{t.encounterLabel}</span><span className="chapter-line" /></div>
        <div className="encounter-copy"><p className="label warm-label">{t.small}</p><h2 id="encounter-title">{t.encounterTitle}<br /><em>{t.encounterEm}</em></h2><p className="chapter-body">{t.encounterBody}</p><button className="line-link" onClick={onDiscovery} {...inspectEvents}>{t.openNote} <span aria-hidden="true"><Arrow direction="diagonal" /></span></button><p className="encounter-status">{collected ? t.collectedShort : t.waiting}</p></div>
        <button className="specimen-invitation" onClick={onDiscovery} {...inspectEvents} aria-label={t.enterEncounter}><span className="annotation-cross" aria-hidden="true">+</span><span>{t.visibleBeginning}</span></button>
      </section>
      <section id="fungus-facts" className="fungus-facts" aria-labelledby="facts-title">
        <div className="facts-intro"><p className="label">pie.pe</p><h2 id="facts-title">{t.factsTitle}</h2><p>{t.factsIntro}</p></div>
        <div className="fact-observations">{t.facts.map((fact, index) => <article key={index}><span className="label">0{index + 1}</span><h3>{fact.title}</h3><p>{fact.text}</p></article>)}</div>
        <p className="art-note">{t.artNote}</p>
        <div className="fact-sources"><span>{t.sources}</span><a href="https://www.woodlandtrust.org.uk/blog/bracket-fungi-identification/" rel="noreferrer">Woodland Trust <Arrow /></a><a href="https://archive.bio.ed.ac.uk/jdeacon/FungalBiology/bracket.htm" rel="noreferrer">University of Edinburgh <Arrow /></a></div>
      </section>
      <section id="return" className="chapter return-chapter" data-scene="return" aria-labelledby="return-title">
        <div className="return-copy"><p className="label">{t.returnLabel}</p><h2 id="return-title">{t.returnTitle}<br /><em>{t.returnEm}</em></h2><p className="return-thought">{t.returnThought}</p><button className="line-link" onClick={onReturn}>{t.returnForest} <span aria-hidden="true"><Arrow direction="up" /></span></button></div>

      </section>
      <section className="wallpapers" id="wallpapers" aria-labelledby="wallpapers-title">
        <p className="label">{t.wallpapersSub}</p><h2 id="wallpapers-title">{t.wallpapersTitle}</h2>
        <div className="wallpaper-choices">
          <article><img src="/wallpapers/previews/desktop.webp" alt={t.wallpaperAltDesktop} width="800" height="450" loading="lazy" /><h3>{t.desktop}</h3><a className="line-link" href="/wallpapers/piepe-forest-desktop-5120x2880.jpg" download target="_blank" rel="noopener" onClick={() => setDownloadHint(true)}>{t.download5k}<span aria-hidden="true"><Arrow direction="down" /></span></a><a className="resolution-link" href="/wallpapers/piepe-forest-desktop-3840x2160.jpg" download target="_blank" rel="noopener" onClick={() => setDownloadHint(true)}>{t.download4k} · 3840 × 2160</a></article>
          <article><img src="/wallpapers/previews/mobile.webp" alt={t.wallpaperAltPhone} width="369" height="800" loading="lazy" /><h3>{t.phone}</h3><a className="line-link" href="/wallpapers/piepe-forest-mobile-1440x3120.jpg" download target="_blank" rel="noopener" onClick={() => setDownloadHint(true)}>{t.downloadPhone}<span aria-hidden="true"><Arrow direction="down" /></span></a><span className="resolution-link">1440 × 3120</span></article>
        </div>
        <p className="wallpaper-quality">{t.wallpaperQuality}</p>{downloadHint && <p className="download-hint" role="status">{t.saveHint}</p>}
      </section>
    </main>
            <footer><a className="brand" href="#forest" onClick={onReturn}><img src="/brand-mark.svg" alt="" width="40" height="40" />pie.pe</a><span className="footer-edition">{t.forest} — 2026</span><button className="text-button motion-toggle" aria-pressed={paused} onClick={onPause}>{paused ? t.resume : t.pause} <span aria-hidden="true">{paused ? '▷' : 'Ⅱ'}</span></button></footer>
</>
}
