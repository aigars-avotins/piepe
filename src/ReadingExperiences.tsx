import type { Locale } from './i18n'
import Arrow from './Arrow'
import { MyceliumArt, SurfaceArt, DeadwoodArt } from './ConceptArt'
import { artAssets } from './experienceArtAssets'
import { experienceCopy, experienceSources } from './experienceCopy'

export function renderXray(locale: Locale, options: {compact?:boolean;prefix?:string;anchor?:string}={}) {
  const t=experienceCopy[locale],x=t.xray,p=options.prefix||'xray',compact=options.compact
  const Heading=compact?'h3':'h2',StoryHeading=compact?'h4':'h3'
  return <section id={options.anchor||'beneath-bark'} tabIndex={-1} className={`forest-experience xray-experience${compact?' xray-home':''}`} data-xray aria-labelledby={p+'-title'}>
    <header className="experience-heading"><p className="reading-label">01 / {x.label}</p><Heading id={p+'-title'}>{x.heading}</Heading><p>{x.lead}</p></header>
    <figure className="xray-figure" aria-describedby={p+'-description'}>
      <div className="xray-view">
        <MyceliumArt id={p+'-drawing'} />
        <img className="xray-surface" src={artAssets.surface} alt="" width="1600" height="900" loading="lazy" decoding="async" fetchPriority="low" />
        <div className="xray-surface-shade" />
        <div className="xray-plane-labels" aria-hidden="true"><span>{x.below}</span><span>{x.surface}</span></div>
        <span className="xray-boundary" aria-hidden="true" />
        <span className="xray-grip" data-xray-handle aria-hidden="true"><Arrow direction="right" /><span>{locale==='lv'?'Velc, lai atklātu':'Drag to reveal'}</span></span>
        {x.stories.map((story,i)=><a className={`xray-point xray-point-${i+1}`} key={story.id} href={`#${p}-${story.id}`} aria-label={`0${i+1} · ${story.title}`} data-xray-point={story.id}>0{i+1}</a>)}
      </div>
      <figcaption id={p+'-description'}>{locale==='lv'?'Mākslinieciska sēņotnes interpretācija · nav rentgens vai dabisks mirdzums.':'An artistic interpretation of mycelium · not an X-ray or natural glow.'}</figcaption>
    </figure>
    <div className="experience-range" hidden data-xray-controls><label htmlFor={p+'-reveal'}>{x.slider}</label><output htmlFor={p+'-reveal'} data-xray-output>55% {x.output}</output><input id={p+'-reveal'} type="range" min="0" max="100" defaultValue="55" aria-valuetext={`55% ${x.output}`} aria-describedby={p+'-description'} data-xray-range data-output-label={x.output} /></div>
    <div className="xray-stories">{x.stories.map((story,i)=><details key={story.id} id={`${p}-${story.id}`} tabIndex={-1} open={!compact}><summary><span className="reading-label" aria-hidden="true">0{i+1}</span><StoryHeading>{story.title}</StoryHeading><Arrow direction="down" /></summary><p>{story.text}</p><a className="experience-source" href={experienceSources[story.source].href}>{experienceSources[story.source].label}</a></details>)}</div>
    <details className="experience-provenance"><summary>{locale==='lv'?'Par šo attēlu':'About this image'}</summary><p>{x.art}</p></details>
  </section>
}

export function renderAtlas(locale: Locale) {
  const t=experienceCopy[locale], atlas=t.atlas
  return <section id="surface-atlas" className="forest-experience surface-atlas" data-atlas aria-labelledby="atlas-title">
    <header className="experience-heading"><p className="reading-label">{atlas.label}</p><h2 id="atlas-title">{atlas.heading}</h2><p>{atlas.lead}</p></header>
    <div className="atlas-cards">{atlas.cards.map(card=><details key={card.id} className="atlas-card" name="surface-atlas" data-atlas-card>
      <summary aria-labelledby={`atlas-${card.id}-title`} aria-describedby={`atlas-${card.id}-short`}>
        <div className="atlas-picture"><SurfaceArt kind={card.id} id={`atlas-${card.id}`} /></div>
        <h3 id={`atlas-${card.id}-title`}>{card.title}</h3><p id={`atlas-${card.id}-short`}>{card.short}</p>
        <span className="atlas-invitation"><span data-nosnippet="">{t.closer}</span><Arrow direction="down" /></span>
      </summary>
      <div className="atlas-detail">{card.id==='surfaces'&&<p className="atlas-surface-key"><span>{atlas.smooth}</span><span>{atlas.teeth}</span></p>}<p>{card.detail}</p><p className="experience-illustration-note">{t.illustration}</p><a className="experience-source" href={experienceSources[card.source].href}>{experienceSources[card.source].label}</a><button type="button" className="atlas-close" hidden data-atlas-close><span data-nosnippet="">{t.close}</span><Arrow direction="up" /></button></div>
    </details>)}</div>
    <p className="experience-caution">{atlas.caution}</p>
  </section>
}

export function renderTimeCapsule(locale: Locale) {
  const t=experienceCopy[locale], time=t.time
  return <section id="deadwood-time" className="forest-experience time-capsule" data-time-capsule data-stage="0" aria-labelledby="time-title">
    <header className="experience-heading"><p className="reading-label">{time.label}</p><h2 id="time-title">{time.heading}</h2><p>{time.lead}</p></header>
    <div id="time-visual" className="time-visual">{time.stages.map((stage,i)=><figure key={stage.title} className="time-figure" data-time-figure={i} aria-hidden={i!==0} aria-label={`${stage.title} · ${t.illustration}`}><DeadwoodArt id={`deadwood-${i}`} stage={i} /><figcaption><span aria-hidden="true">0{i+1} / </span>{stage.phrase}</figcaption></figure>)}</div>
    <p id="time-scenario" className="experience-illustration-note">{time.scenario}</p>
    <div hidden data-time-controls><div className="time-choices" role="group" aria-label={time.slider}>{time.stages.map((stage,i)=><button type="button" key={stage.title} data-time-choice={i} aria-pressed={i===0} aria-controls="time-visual"><span aria-hidden="true">0{i+1}</span>{stage.title}</button>)}</div><div className="experience-range"><label htmlFor="time-range">{time.slider}</label><output htmlFor="time-range" data-time-output>{time.stages[0].title}</output><input id="time-range" type="range" min="1" max="4" step="1" defaultValue="1" aria-valuetext={time.stages[0].title} aria-describedby="time-scenario" data-time-range /></div></div>
    <ol className="time-stories">{time.stages.map((stage,i)=><li key={stage.title} data-time-story={i} data-title={stage.title}><span className="reading-label" aria-hidden="true">0{i+1}</span><h3>{stage.title}</h3><p className="time-phrase">{stage.phrase}</p><p>{stage.text}</p><a className="experience-source" href={stage.source}>{t.source}</a></li>)}</ol>
    <p className="experience-source-context">{time.sources}</p>
  </section>
}
