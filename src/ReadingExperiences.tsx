import SiteLink from './SiteLink'
import type { Locale } from './i18n'
import RasterImage, { RasterStatus } from './RasterImage'
import { atlasSizes } from './imageSizes'
import { experienceCopy, experienceSources } from './experienceCopy'

export function renderXray(locale: Locale, options: { compact?: boolean; prefix?: string; anchor?: string } = {}) {
  const t = experienceCopy[locale], x = t.xray, p = options.prefix || 'xray', compact = options.compact
  const Heading = compact ? 'h3' : 'h2', StoryHeading = compact ? 'h4' : 'h3'
  return <section id={options.anchor || 'beneath-bark'} tabIndex={-1} className={`forest-experience xray-experience${compact ? ' xray-home' : ''}`} data-xray aria-labelledby={p + '-title'}>
    <header className="experience-heading"><p className="reading-label">01 / {x.label}</p><Heading id={p + '-title'}>{x.heading}</Heading><p>{x.lead}</p></header>
    <figure className="xray-figure">
      <div className="xray-view" aria-describedby={p + '-description'}>
        <div className="xray-images raster-grade" role="img" aria-label={x.description}><RasterImage className="xray-surface" name="xray-bark-surface" /><div className="xray-cutaway"><RasterImage name="xray-wood-mycelium" /></div></div>
        <div className="xray-plane-labels" aria-hidden="true"><span>{x.below}</span><span>{x.surface}</span></div>
        <span className="xray-boundary" aria-hidden="true" /><span className="xray-grip" aria-hidden="true">◄ {locale === 'lv' ? 'PAVELC SLĀNI' : 'DRAG LAYER'} ►</span>
        <div className="xray-points" data-xray-points aria-label={locale === 'lv' ? 'Izvēlies skaidrojumu' : 'Choose an explanation'}>{x.stories.map((story, i) => <SiteLink className={`xray-point xray-point-${i + 1}`} key={story.id} id={`${p}-point-${story.id}`} href={`#${p}-${story.id}`} aria-label={`0${i + 1} · ${story.title}`} aria-controls={`${p}-${story.id}`} data-xray-point={story.id}>0{i + 1}</SiteLink>)}</div>
        <RasterStatus locale={locale} />
      </div>
      <figcaption id={p + '-description'}>{locale === 'lv' ? 'Māksliniecisks šķēlums — skaidrojumu izvēlies attēla punktos.' : 'An artistic cross-section — choose a point to explore its story.'}</figcaption>
    </figure>
    <div className="experience-range" data-xray-controls><label htmlFor={p + '-reveal'}>{x.slider}</label><output htmlFor={p + '-reveal'} data-xray-output>50% {x.output}</output><input id={p + '-reveal'} type="range" min="0" max="100" defaultValue="50" disabled aria-valuetext={`50% ${x.output}`} aria-describedby={p + '-description'} data-xray-range data-output-label={x.output} /></div>
    <p className="sr-only" role="status" data-xray-selection />
    <div className="xray-stories">{x.stories.map((story, i) => <section key={story.id} id={`${p}-${story.id}`} data-xray-story tabIndex={-1}>
      <StoryHeading><span className="reading-label" aria-hidden="true">0{i + 1} / </span>{story.title}</StoryHeading><p>{story.text}</p><SiteLink className="experience-source" href={experienceSources[story.source].href}>{experienceSources[story.source].label}</SiteLink>
    </section>)}</div>
    <details className="experience-provenance"><summary>{t.methods}</summary><p>{x.art}</p><p className="experience-originals"><SiteLink href="/images/interactive/xray-bark-surface.jpg">{x.surface} · {t.original}</SiteLink><SiteLink href="/images/interactive/xray-wood-mycelium.jpg">{x.below} · {t.original}</SiteLink></p></details>
  </section>
}

export function renderAtlas(locale: Locale) {
  const t = experienceCopy[locale], atlas = t.atlas
  return <section id="surface-atlas" className="forest-experience surface-atlas" data-atlas aria-labelledby="atlas-title" data-close-label={t.close}>
    <header className="experience-heading"><p className="reading-label">{atlas.label}</p><h2 id="atlas-title">{atlas.heading}</h2><p>{atlas.lead}</p></header>
    <p className="sr-only" id="atlas-loupe-help">{t.loupeHelp}</p>
    <div className="atlas-cards">{atlas.cards.map(card => {
      const name = `atlas-${card.id === 'surfaces' ? 'smooth' : card.id}`
      return <article key={card.id} className="atlas-card" data-atlas-card>
        <div className="atlas-picture" data-atlas-surface tabIndex={-1} role="group" aria-label={card.title} aria-describedby="atlas-loupe-help">
          <div className="atlas-image-grade raster-grade"><RasterImage name={name} alt={card.short} width={2400} height={1792} sizes={atlasSizes} /><span className="atlas-loupe" aria-hidden="true"><img alt="" /><span>2.5×</span></span></div><RasterStatus locale={locale} />
        </div>
        <h3 id={`atlas-${card.id}-title`}>{card.title}</h3>
        <div className="atlas-invitation"><button className="atlas-open" type="button" data-atlas-open aria-label={`${t.closer} — ${card.title}`} aria-haspopup="dialog" aria-controls="atlas-lightbox" hidden disabled>{t.closer} <span aria-hidden="true">+</span></button><SiteLink className="atlas-original" href={`/images/interactive/${name}.jpg`}>{t.original}</SiteLink></div>
        <div className="atlas-detail"><p>{card.detail}</p><SiteLink className="experience-source" href={experienceSources[card.source].href}>{experienceSources[card.source].label}</SiteLink></div>
      </article>
    })}</div>
    <p className="experience-illustration-note">{t.illustration} · {locale === 'lv' ? '2,5× digitāls palielinājums.' : '2.5× digital enlargement.'}</p>
    <details className="experience-provenance" id="atlas-method"><summary>{t.methods}</summary><p>{atlas.caution} {locale === 'lv' ? 'Digitālā lupa palielina esošo attēlu; tā nerada jaunas optiskas detaļas vai izmērītu mērogu.' : 'The digital loupe enlarges the existing image; it does not add optical detail or a measured scale.'}</p></details>
    <dialog id="atlas-lightbox" className="atlas-lightbox" aria-labelledby="atlas-lightbox-title" data-atlas-dialog><div className="atlas-lightbox-head"><h2 id="atlas-lightbox-title">{atlas.heading}</h2><button type="button" data-atlas-close autoFocus>{t.close} ×</button></div><div className="atlas-comparison" /><p className="experience-illustration-note">{t.illustration}</p></dialog>
  </section>
}

export function renderTimeCapsule(locale: Locale) {
  const t = experienceCopy[locale], time = t.time
  return <section id="deadwood-time" className="forest-experience time-capsule" data-time-capsule data-stage="0" aria-labelledby="time-title">
    <header className="experience-heading"><p className="reading-label">{time.label}</p><h2 id="time-title">{time.heading}</h2><p>{time.lead}</p></header>
    <div id="time-visual" className="time-visual"><div className="time-composite" data-time-composite role="img" aria-labelledby="time-stage-0-title time-caption-0" aria-describedby="time-scenario">
      {time.stages.map((stage, i) => <figure key={stage.title} className="time-figure" data-time-figure={i} aria-hidden={i !== 0} style={{ opacity: i === 0 ? 1 : 0 }}><div className="time-image raster-grade"><RasterImage name={`deadwood-stage-0${i + 1}`} deferred={i !== 0} /></div></figure>)}
      {time.stages.map((stage, i) => <p key={stage.title} id={`time-caption-${i}`} className="time-caption" data-time-caption={i} aria-hidden={i !== 0}><span aria-hidden="true">0{i + 1} / </span>{stage.phrase}</p>)}</div><RasterStatus locale={locale} />
    </div>
    <p id="time-scenario" className="experience-illustration-note">{time.scenario}</p>
    <div data-time-controls><div className="time-choices" role="group" aria-label={time.slider}>{time.stages.map((stage, i) => <button type="button" key={stage.title} data-time-choice={i} aria-pressed={i === 0} aria-controls="time-visual" disabled><span aria-hidden="true">0{i + 1}</span>{stage.title}</button>)}</div><div className="experience-range"><label htmlFor="time-range">{time.slider}</label><output htmlFor="time-range" data-time-output>{time.stages[0].title}</output><input id="time-range" type="range" min="0" max="100" step="0.1" defaultValue="0" disabled aria-valuetext={`0% · ${time.stages[0].title}`} aria-describedby="time-scenario" data-time-range /></div><p className="time-loading" role="status" data-time-loading hidden>{locale === 'lv' ? 'Sagatavojam nākamo attēlu…' : 'Preparing the next image…'}</p></div>
    <noscript><p className="experience-illustration-note">{locale === 'lv' ? 'Visi četri posmi lasāmi tālāk. Attēlu salīdzināšanai ieslēdz JavaScript.' : 'All four stages are described below. Enable JavaScript to compare the images.'}</p></noscript>
    <ol className="time-stories">{time.stages.map((stage, i) => <li key={stage.title} data-time-story={i} data-title={stage.title}><span className="reading-label" aria-hidden="true">0{i + 1}</span><h3 id={`time-stage-${i}-title`}>{stage.title}</h3><p className="time-phrase">{stage.phrase}</p><p>{stage.text}</p><SiteLink className="experience-source" href={stage.source}>{t.source}</SiteLink><SiteLink className="experience-original" href={`/images/interactive/deadwood-stage-0${i + 1}.jpg`}>{t.original}</SiteLink></li>)}</ol>
    <details className="experience-provenance"><summary>{t.methods}</summary><p>{time.method}</p></details><p className="experience-source-context">{time.sources}</p>
  </section>
}
