import {useEffect,useLayoutEffect,useRef,useState} from 'react'
import type {RefObject} from 'react'
import type {Locale} from './i18n'
import {portalCopy} from './portalCopy'
import {PortalCinema} from './portalCinema'
import {portalThreshold} from './portalThreshold'
import type {PortalSnapshot} from './portalCinema'
import type {ForestAudio} from './useForestAudio'
import Arrow from './Arrow'
import SoundControl from './SoundControl'
import LivingThread from './LivingThread'
import {threadCopy} from './threadCopy'
import './fungusPortal.css'

export type PortalOrigin={element:HTMLElement;x:number;y:number}
type Props={opener:RefObject<PortalOrigin|null>;locale:Locale;onLocaleChange:(value:Locale)=>void;onClose:(value:Locale)=>void;audio:ForestAudio;reduced:boolean;saving:boolean}
const initial:PortalSnapshot={phase:'portal-ready',clip:-1,loading:false,paused:false,static:false,cycles:0}
export default function FungusPortal({opener:origin,locale,onLocaleChange,onClose,audio,reduced,saving}:Props){
 const [state,setState]=useState(initial),[opted,setOpted]=useState(false),[imageReady,setImageReady]=useState(false),[imagePresented,setImagePresented]=useState(false),[imageError,setImageError]=useState(false),[imageAttempt,setImageAttempt]=useState(0),[cleanChoice,setCleanChoice]=useState(false),[threadChosen,setThreadChosen]=useState(false)
 const dialog=useRef<HTMLDialogElement>(null),view=useRef<HTMLDivElement>(null),cinema=useRef<PortalCinema|null>(null),exitButton=useRef<HTMLButtonElement>(null)
 const followButton=useRef<HTMLButtonElement>(null)
 const chosenLocale=useRef(locale)
 const latest=useRef({locale,onClose});useLayoutEffect(()=>{latest.current={locale,onClose}},[locale,onClose])
 const exitAction=useRef<()=>void>(()=>{})
 const threshold=useRef<ReturnType<typeof portalThreshold>|undefined>(undefined)
 const t=portalCopy[locale],quiet=(reduced||saving)&&!opted,living=state.phase==='living-world',ready=state.phase==='portal-ready'&&!state.loading,error=state.phase==='error'
 const clean=living&&cleanChoice&&!state.loading&&!state.paused&&!state.slow&&!error
 const threadShown=living&&threadChosen&&!clean&&!state.loading&&!state.slow
 const closeThread=()=>{setThreadChosen(false);requestAnimationFrame(()=>followButton.current?.focus({preventScroll:true}))}
 useEffect(()=>{
  const el=dialog.current!,opener=origin.current?.element,scroll=origin.current??{x:scrollX,y:scrollY},token='fungus-'+Date.now()
  let exited=false,closing=false
  const close=()=>{if(exited)return;exited=true;latest.current.onClose(chosenLocale.current)}
  const pop=()=>close()
  history.pushState({...history.state,piepePortal:token},'',location.href);window.addEventListener('popstate',pop)
  exitAction.current=()=>{if(closing||exited)return;closing=true;if(history.state?.piepePortal===token)history.back();else close()}
  const player=new PortalCinema(el,setState,()=>exitAction.current(),(image,layer)=>{
   el.dataset.portalClosing='true'
   threshold.current=portalThreshold(image,layer,opener?.querySelector('[data-portal-preview]')?.getBoundingClientRect(),matchMedia('(prefers-reduced-motion: reduce)').matches,true)
   return threshold.current.finished
  });cinema.current=player
  const visibility=()=>{if(document.hidden)player.pause()}
  // WebKit can retain the pre-resize CSS viewport while body scrolling is locked.
  // Use the actual visible height, including toolbar/visual viewport resize events.
  const resize=()=>{el.style.setProperty('--portal-height',`${window.visualViewport?.height??innerHeight}px`);view.current?.style.setProperty('--gaze-x','0px');view.current?.style.setProperty('--gaze-y','0px')}
  resize()
  document.addEventListener('visibilitychange',visibility);window.addEventListener('resize',resize);window.visualViewport?.addEventListener('resize',resize)
  el.showModal()
  return()=>{
   threshold.current?.cancel();player.destroy();cinema.current=null;window.removeEventListener('popstate',pop);document.removeEventListener('visibilitychange',visibility);window.removeEventListener('resize',resize);window.visualViewport?.removeEventListener('resize',resize)
   el.close();requestAnimationFrame(()=>{window.scrollTo({left:scroll.x,top:scroll.y,behavior:'instant'});if(opener?.isConnected)opener.focus({preventScroll:true})})
  }
 },[origin])
 useEffect(()=>{if(quiet&&(state.clip>=0||state.loading)&&!state.static)cinema.current?.showStill()},[quiet,state.clip,state.static,state.loading])
 // Present the decoded still completely before introducing its title/Begin UI.
 // This follows the actual image animation, not a timer racing image/network readiness.
 useLayoutEffect(()=>{
  if(!imageReady)return
  const image=dialog.current?.querySelector<HTMLImageElement>('[data-portal-original]');if(!image)return
  const layer=dialog.current!.querySelector<HTMLElement>('[data-portal-still-layer]')!
  const appearance=portalThreshold(image,layer,origin.current?.element.querySelector('[data-portal-preview]')?.getBoundingClientRect(),reduced)
  threshold.current=appearance
  void appearance.finished.then(()=>setImagePresented(true)).catch(()=>{})
  return()=>appearance.cancel()
 },[imageReady,reduced,origin])
 const begin=(full=false)=>{void cinema.current?.resume();if(full)setOpted(true);exitButton.current?.focus({preventScroll:true});if(quiet&&!full)cinema.current?.showStill();else void cinema.current?.playClip(0)}
 const skip=()=>{exitButton.current?.focus({preventScroll:true});if(quiet)cinema.current?.showStill();else void cinema.current?.playClip(3)}
 const resetGaze=()=>{view.current?.style.setProperty('--gaze-x','0px');view.current?.style.setProperty('--gaze-y','0px')}
 const gaze=(x:number,y:number)=>{
  if(!living||reduced||state.static||threadShown)return
  const el=view.current!,r=el.getBoundingClientRect();el.style.setProperty('--gaze-x',`${((x-r.left)/r.width-.5)*Math.min(12,r.width*.012)}px`);el.style.setProperty('--gaze-y',`${((y-r.top)/r.height-.5)*Math.min(8,r.height*.012)}px`)
 }
 const scene=state.clip<0?0:state.clip+1
 return <dialog ref={dialog} className="fungus-portal" data-portal-phase={state.phase} data-portal-invitation={ready} data-portal-clean={clean} data-portal-thread={threadShown} data-portal-still-ready={imageReady} data-portal-still-presented={imagePresented} data-portal-static={state.static} data-portal-paused={state.paused} aria-labelledby="portal-title" aria-describedby="portal-art" onPointerMove={event=>{if(clean&&!(event.target as Element).closest('[data-cinema-toggle]'))setCleanChoice(false)}} onPointerDown={event=>{if(clean&&!(event.target as Element).closest('[data-cinema-toggle]'))setCleanChoice(false)}} onFocusCapture={event=>{if(clean&&!(event.target as Element).closest('[data-cinema-toggle]'))setCleanChoice(false)}} onKeyDownCapture={event=>{if(clean&&event.key!=='Escape'&&(!(event.target as Element).closest('[data-cinema-toggle]')||!['Enter',' '].includes(event.key)))setCleanChoice(false)}} onCancel={e=>{e.preventDefault();if(threadShown)closeThread();else exitAction.current()}}>
  <div ref={view} className={`portal-view ${living&&!state.static&&!reduced?'portal-gaze':''}`} data-portal-view tabIndex={living?0:-1} role="region" aria-label={threadShown?threadCopy[locale].follow:state.static?t.staticNote:t.gaze} aria-describedby={living?'portal-gaze-help':undefined} onPointerMove={e=>{if(e.pointerType!=='touch'||e.buttons)gaze(e.clientX,e.clientY)}} onPointerLeave={resetGaze} onPointerUp={resetGaze} onKeyDown={e=>{
   if(!living||reduced||state.static||threadShown)return
   const axis=e.key==='ArrowLeft'||e.key==='ArrowRight'?'--gaze-x':'--gaze-y'
   if(e.key==='Home'){e.preventDefault();resetGaze()}
   else if(e.key.startsWith('Arrow')){e.preventDefault();view.current?.style.setProperty(axis,e.key==='ArrowLeft'||e.key==='ArrowUp'?'-2px':'2px')}
  }}>
   <div className="portal-original-layer" data-portal-still-layer><img key={imageAttempt} onLoad={event=>{void event.currentTarget.decode().then(()=>{setImageReady(true);setImageError(false)}).catch(()=>setImageError(true))}} onError={()=>setImageError(true)} className="portal-original" data-portal-original src="/media/01_Start.png" width="1672" height="941" alt="" decoding="async" fetchPriority="high"/></div>
   {[0,1].map(slot=><div key={slot} className="portal-slot" data-portal-slot={slot} aria-hidden="true"><video muted playsInline preload="none" tabIndex={-1}/><img className="portal-frame" alt=""/></div>)}
   {state.static&&<img className="portal-static-world" src="/media/portal-living-still.webp" alt="" width="1920" height="1080"/>}
  </div>
  <header className="portal-topbar"><span className="portal-brand">pie.pe <span> / {String(scene+1).padStart(2,'0')}</span></span><nav className="portal-languages" aria-label={locale==='lv'?'Valoda':'Language'}>{(['lv','en'] as const).map(value=><button key={value} type="button" lang={value} aria-pressed={locale===value} onClick={()=>{chosenLocale.current=value;onLocaleChange(value)}}>{value.toUpperCase()}</button>)}</nav>{living&&!state.static&&<button type="button" className="portal-motion" onClick={()=>state.paused?void cinema.current?.resume():cinema.current?.pause()}>{state.paused?t.resume:t.pause}</button>}<button ref={exitButton} type="button" className="portal-exit" onClick={()=>exitAction.current()}>{t.exit}<span aria-hidden="true"> ×</span></button></header>
  <h2 id="portal-title" className={ready&&imagePresented?'portal-title':'sr-only'}>{t.title}</h2>
  {ready&&(imagePresented||imageError)&&<div className="portal-invitation"><p>{imageError?t.error:imageReady?t.intro:t.loading}</p>{imageError&&<button className="portal-secondary" onClick={()=>{setImageError(false);setImageAttempt(n=>n+1)}}>{t.retry}</button>}<button disabled={!imagePresented} className="portal-primary" type="button" onClick={()=>begin()} autoFocus>{quiet?t.still:t.begin}<span aria-hidden="true"><Arrow direction="diagonal"/></span></button>{quiet&&<><p className="portal-data-note">{t.data}</p><button className="portal-secondary" disabled={!imagePresented} type="button" onClick={()=>begin(true)}>{t.optIn}</button></>}</div>}
  {ready&&!imagePresented&&!imageError&&<p className="portal-first-loading" role="status">{t.loading}</p>}
  {!ready&&state.phase!=='finished'&&<div id="portal-controls" inert={clean} aria-hidden={clean} className={`portal-controls ${living?'portal-controls-living':''}`}>
   <p className={`portal-scene ${living&&!state.loading&&!state.paused&&!state.slow?'sr-only':''}`} role="status" aria-atomic="true">{error?t.error:state.slow?t.loadingSlow:state.loading?t.loading:state.paused?t.hidden:t.scenes[scene]}</p>
   {threadShown&&<LivingThread locale={locale} view={view} moving={!state.static&&!reduced&&!state.paused} onClose={closeThread}/>}
   {living&&<><span className="sr-only" id="portal-gaze-help">{threadShown?(state.static?threadCopy[locale].quietHelp:threadCopy[locale].help):state.static?t.staticNote:t.gazeHelp}</span>{!threadShown&&<div className="portal-thread-invitation">{state.static&&<p>{t.staticNote}</p>}<button ref={followButton} type="button" data-thread-open aria-expanded={false} onClick={()=>{resetGaze();setThreadChosen(true);requestAnimationFrame(()=>view.current?.focus({preventScroll:true}))}}>{threadCopy[locale].follow}<span aria-hidden="true"> ↗</span></button></div>}</>}
   <div className="portal-action-row">
    {error?<><button type="button" onClick={()=>cinema.current?.retry()}>{t.retry}</button><button type="button" onClick={skip}>{t.skip}</button><button type="button" onClick={()=>exitAction.current()}>{t.return}</button></>:living?<button type="button" className="portal-primary" onClick={()=>{resetGaze();setThreadChosen(false);if(state.static)exitAction.current();else void cinema.current?.playClip(4)}}>{t.return}<span aria-hidden="true"><Arrow direction="diagonal"/></span></button>:<><button type="button" onClick={()=>state.paused?void cinema.current?.resume():cinema.current?.pause()}>{state.paused?t.resume:t.pause}</button>{state.clip<3&&<button type="button" onClick={skip}>{t.skip}<span aria-hidden="true"><Arrow direction="right"/></span></button>}</>}
    {state.slow&&<button type="button" onClick={()=>cinema.current?.retry()}>{t.retry}</button>}

    {state.static&&<button type="button" onClick={()=>begin(true)}>{t.optIn}</button>}
   </div>
  </div>}
  {living&&!state.loading&&!state.slow&&<button className="portal-cinema-toggle" data-cinema-toggle type="button" disabled={state.paused} aria-expanded={!clean} aria-controls="portal-controls" onClick={()=>{setThreadChosen(false);setCleanChoice(!clean)}}>{clean?t.showControls:t.hideControls}</button>}
  {state.phase==='finished'&&<p className="portal-finished" role="status">{t.finished}</p>}
  <div className="portal-sound"><SoundControl audio={audio.status==='waiting'&&audio.enabled?{...audio,enabled:false,toggle:audio.activate??audio.toggle}:audio} locale={locale}/></div>
  <p id="portal-art" className="portal-art">{t.art}</p>
 </dialog>
}
