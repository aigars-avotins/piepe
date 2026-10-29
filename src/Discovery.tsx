import Arrow from './Arrow'
import { useRef, useState } from 'react'
import type { RefObject } from 'react'
import { messages } from './i18n'
import type { Locale } from './i18n'
import LanguageSwitch from './LanguageSwitch'
import { usePhotoHandoff } from './usePhotoHandoff'
import type { CinemaOrigin } from './cinemaGeometry'
import { EdgeLight } from './ForestScene'
import SoundControl from './SoundControl'
import type { ForestAudio } from './useForestAudio'
import { mediaUrl } from './mediaUrl'

export default function Discovery({ audio, locale, onLocaleChange, origin, photoSrc, onDocked, open, dialog, onClose, onCollect, collected }: {
  audio: ForestAudio;
  locale: Locale; onLocaleChange: (locale: Locale) => void; origin?: CinemaOrigin; photoSrc: string; onDocked: () => void; open: boolean;
  dialog: RefObject<HTMLDialogElement | null>; onClose: () => void; onCollect: () => void; collected: boolean
}) {
  const t = messages[locale], observations = t.observations
  const [page, setPage] = useState(0)
  const { moving, requestClose, settle } = usePhotoHandoff(dialog, open, origin, onClose, onDocked)
  const tabs = useRef<(HTMLButtonElement | null)[]>([])
  const note = observations[page]
  const choose = (index: number, focus = false) => {
    setPage(index)
    if (focus) tabs.current[index]?.focus()
  }
  return <dialog ref={dialog} className={`discovery-dialog observation-${note.id} ${moving ? 'photo-moving' : ''}`} onCancel={event => { event.preventDefault(); requestClose() }} aria-labelledby="discovery-title" aria-describedby="discovery-description">
    <SoundControl audio={audio} locale={locale} />
    {moving && <button className="text-button skip-dock" onClick={settle}>{t.skipAwakening}</button>}
    <div className="discovery-stage">
      <LanguageSwitch locale={locale} onChange={onLocaleChange} />
      <div className="specimen-photo" aria-hidden="true"><img src={mediaUrl(photoSrc)} loading={open ? 'eager' : 'lazy'} onError={event => { if (!new URL(event.currentTarget.src).pathname.endsWith('/media/forest-final.jpg')) event.currentTarget.src = mediaUrl('/media/forest-final.jpg') }} alt="" width="1920" height="1080" /><span className="specimen-photo-shade" /><span className="photo-world-shade" /></div>
      <div className="discovery-edge" aria-hidden="true"><EdgeLight /></div>
      <header className="discovery-header"><span className="label">{t.noteLabel} <span className="tiny-dot" /> pie.pe</span><button autoFocus className="close-discovery" onClick={requestClose} aria-label={t.closeDiscovery}><span>{t.closeDiscovery}</span><span aria-hidden="true">×</span></button></header>
      <div className="specimen-caption"><span className="specimen-rule" /><span lang="lv">piepe</span><span>{t.wordMeaning}</span></div>
      <div className="discovery-copy">
        <p className="label discovery-kicker">{t.atlas}</p>
        <div role="tablist" aria-label={t.observationsLabel} className="observation-tabs" onKeyDown={event => {
          if (['ArrowRight', 'ArrowLeft', 'Home', 'End'].includes(event.key)) {
            event.preventDefault()
            const next = event.key === 'Home' ? 0 : event.key === 'End' ? 2 : (page + (event.key === 'ArrowRight' ? 1 : 2)) % 3
            choose(next, true)
          }
        }}>{observations.map((entry, index) => <button key={entry.id} ref={element => { tabs.current[index] = element }} id={`tab-${entry.id}`} role="tab" aria-selected={page === index} aria-controls="observation-panel" tabIndex={page === index ? 0 : -1} onClick={() => choose(index)}><span className="observation-number">0{index + 1}</span>{entry.label}</button>)}</div>
        <article id="observation-panel" role="tabpanel" aria-labelledby={`tab-${note.id}`} tabIndex={0} className="observation-panel" key={note.id}>
          <h2 id="discovery-title">{note.title.split('\n').map((line, index) => <span key={line} className={index ? 'italic-line' : ''}>{line}</span>)}</h2>
          <p id="discovery-description">{note.text}</p>
          <div className="attention-map" aria-hidden="true"><svg viewBox="0 0 340 76" fill="none"><path className="map-ground" d="M0 56H340"/><g className="map-branches"><path d="M170 53c-12-10-23-10-43-14l-38-5-28-19M170 53c8-10 25-18 40-22l36-11 29-12M170 53c-3-23-3-29-10-45M129 39l-9-24M209 31l2-21M90 34l-39 7M248 20l34 16M170 53l-41 12M170 53l31 17"/></g><circle cx="170" cy="53" r="3"/><circle className="map-seed" cx="275" cy="8" r="2"/><circle className="map-seed" cx="61" cy="15" r="2"/></svg></div>
          <p className="observation-footnote">{note.footnote}</p>
        </article>
        <div className="observation-actions">{page < 2 ? <button className="line-link" onClick={() => choose(page + 1)}>{page === 0 ? t.nextBeneath : t.nextBeyond} <span aria-hidden="true"><Arrow direction="right" /></span></button> : <a className="line-link" href={`/field-note-${locale}.txt`} download={`piepe-field-note-001-${locale}.txt`} onClick={onCollect}>{collected ? t.anotherCopy : t.keepNote} <span aria-hidden="true"><Arrow direction="down" /></span></a>}<span className="observation-count">0{page + 1} / 03</span></div>
        {collected && <p className="collected-message" role="status">{t.collected}</p>}
      </div>
    </div>
  </dialog>
}
