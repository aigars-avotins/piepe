import type { Locale } from './i18n'
import RasterImage from './RasterImage'
import { experienceCopy, experienceSources } from './experienceCopy'

const newTab={target:'_blank',rel:'noopener noreferrer'} as const
const unavailable=(locale:Locale)=>locale==='lv'?'Priekšskatījums — izpētes attēls nav pieejams.':'Preview — the study image is unavailable.'
export function renderXray(locale: Locale, options: {compact?:boolean;prefix?:string;anchor?:string}={}) {
  const x=experienceCopy[locale].xray,p=options.prefix||'xray',compact=options.compact
  const Heading=compact?'h3':'h2',StoryHeading=compact?'h4':'h3'
  return <section id={options.anchor||'beneath-bark'} tabIndex={-1} className={`forest-experience xray-experience${compact?' xray-home':''}`} data-xray aria-labelledby={p+'-title'}>
    <header className="experience-heading"><p className="reading-label">01 / {x.label}</p><Heading id={p+'-title'}>{x.heading}</Heading><p>{x.lead}</p></header>
    <figure className="xray-figure" aria-describedby={p+'-description'}>
      <div className="xray-view">
        <div className="xray-images raster-grade"><RasterImage className="xray-surface" name="xray-bark-surface"/><div className="xray-cutaway"><RasterImage name="xray-wood-mycelium"/></div></div>
        <div className="xray-plane-labels" aria-hidden="true"><span>{x.below}</span><span>{x.surface}</span></div>
        <span className="xray-boundary" aria-hidden="true"/>
        <span className="xray-grip" aria-hidden="true">◄ {locale==='lv'?'PAVELC SLĀNI':'DRAG LAYER'} ►</span>
        {x.stories.map((story,i)=><a className={`xray-point xray-point-${i+1}`} key={story.id} href={`#${p}-${story.id}`} aria-label={`0${i+1} · ${story.title}`} data-xray-point={story.id}>0{i+1}</a>)}
        <p className="raster-fallback">{unavailable(locale)}</p>
      </div>
      <figcaption id={p+'-description'}>{locale==='lv'?'Mākslinieciska vizualizācija, nevis rentgens vai mikroskopijas novērojums.':'An artistic visualisation, not an X-ray or microscopic observation.'}</figcaption>
    </figure>
    <div className="experience-range" data-xray-controls><label htmlFor={p+'-reveal'}>{x.slider}</label><output htmlFor={p+'-reveal'} data-xray-output>50% {x.output}</output><input id={p+'-reveal'} type="range" min="0" max="100" defaultValue="50" disabled aria-valuetext={`50% ${x.output}`} aria-describedby={p+'-description'} data-xray-range data-output-label={x.output}/></div>
    <div className="xray-stories">{x.stories.map((story,i)=><details key={story.id} id={`${p}-${story.id}`} tabIndex={-1} open={!compact}><summary><span className="reading-label" aria-hidden="true">0{i+1}</span><StoryHeading>{story.title}</StoryHeading><span className="detail-chevron" aria-hidden="true">⌄</span></summary><p>{story.text}</p><a className="experience-source" href={experienceSources[story.source].href} {...newTab}>{experienceSources[story.source].label}</a></details>)}</div>
    <details className="experience-provenance"><summary>{locale==='lv'?'Par šo attēlu':'About this image'}</summary><p>{x.art}</p></details>
  </section>
}

export function renderAtlas(locale: Locale) {
  const t=experienceCopy[locale],atlas=t.atlas
  return <section id="surface-atlas" className="forest-experience surface-atlas" data-atlas aria-labelledby="atlas-title" data-close-label={t.close}>
    <header className="experience-heading"><p className="reading-label">{atlas.label}</p><h2 id="atlas-title">{atlas.heading}</h2><p>{atlas.lead}</p></header>
    <div className="atlas-cards">{atlas.cards.map(card=><article key={card.id} className="atlas-card" data-atlas-card>
      <a className="atlas-open" href={`/images/interactive/atlas-${card.id==='surfaces'?'smooth':card.id}.jpg`} {...newTab} aria-labelledby={`atlas-${card.id}-title atlas-${card.id}-action`} data-atlas-open>
        <div className="atlas-picture"><div className="atlas-image-grade raster-grade"><RasterImage name={`atlas-${card.id==='surfaces'?'smooth':card.id}`} alt={card.short} width={2400} height={1792}/><span className="atlas-loupe" aria-hidden="true"><img alt=""/><span>2.5×</span></span></div><span className="raster-fallback">{unavailable(locale)}</span></div>
        <h3 id={`atlas-${card.id}-title`}>{card.title}</h3><span className="atlas-invitation" id={`atlas-${card.id}-action`}>{t.closer} <span aria-hidden="true">↗</span></span>
      </a>
      <div className="atlas-detail"><p>{card.detail}</p><a className="experience-source" href={experienceSources[card.source].href} {...newTab}>{experienceSources[card.source].label}</a></div>
    </article>)}</div>
    <p className="experience-illustration-note">{t.illustration} · {locale==='lv'?'2,5× ir digitāls palielinājums, nevis izmērīts optiskais mērogs.':'2.5× is digital enlargement, not a measured optical scale.'}</p><p className="experience-caution">{atlas.caution}</p>
    <dialog className="atlas-lightbox" aria-labelledby="atlas-lightbox-title" data-atlas-dialog><div className="atlas-lightbox-head"><h2 id="atlas-lightbox-title">{atlas.heading}</h2><button type="button" data-atlas-close autoFocus>{t.close} ×</button></div><div className="atlas-comparison"/ ><p className="experience-illustration-note">{t.illustration}</p></dialog>
  </section>
}

export function renderTimeCapsule(locale: Locale) {
  const t=experienceCopy[locale],time=t.time
  return <section id="deadwood-time" className="forest-experience time-capsule" data-time-capsule data-stage="0" aria-labelledby="time-title">
    <header className="experience-heading"><p className="reading-label">{time.label}</p><h2 id="time-title">{time.heading}</h2><p>{time.lead}</p></header>
    <div id="time-visual" className="time-visual">{time.stages.map((stage,i)=><figure key={stage.title} className="time-figure" data-time-figure={i} aria-hidden={i!==0} style={{opacity:i===0?1:0}}><div className="time-image raster-grade"><RasterImage name={`deadwood-stage-0${i+1}`} alt=""/></div></figure>)}{time.stages.map((stage,i)=><p key={stage.title} className="time-caption" data-time-caption={i} aria-hidden={i!==0}><span aria-hidden="true">0{i+1} / </span>{stage.phrase}</p>)}<p className="raster-fallback">{unavailable(locale)}</p></div>
    <p id="time-scenario" className="experience-illustration-note">{time.scenario}</p>
    <div data-time-controls><div className="time-choices" role="group" aria-label={time.slider}>{time.stages.map((stage,i)=><button type="button" key={stage.title} data-time-choice={i} aria-pressed={i===0} aria-controls="time-visual" disabled><span aria-hidden="true">0{i+1}</span>{stage.title}</button>)}</div><div className="experience-range"><label htmlFor="time-range">{time.slider}</label><output htmlFor="time-range" data-time-output>0% · {time.stages[0].title}</output><input id="time-range" type="range" min="0" max="100" step="0.1" defaultValue="0" disabled aria-valuetext={`0% · ${time.stages[0].title}`} aria-describedby="time-scenario" data-time-range/></div></div>
    <noscript><p className="experience-illustration-note">{locale==='lv'?'Visi četri posmi lasāmi tālāk. Attēlu salīdzināšanai ieslēdz JavaScript.':'All four stages are described below. Enable JavaScript to compare the images.'}</p></noscript>
    <ol className="time-stories">{time.stages.map((stage,i)=><li key={stage.title} data-time-story={i} data-title={stage.title}><span className="reading-label" aria-hidden="true">0{i+1}</span><h3>{stage.title}</h3><p className="time-phrase">{stage.phrase}</p><p>{stage.text}</p><a className="experience-source" href={stage.source}>{t.source}</a></li>)}</ol>
    <p className="experience-source-context">{time.sources}</p>
  </section>
}
