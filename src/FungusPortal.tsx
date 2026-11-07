import {useEffect,useLayoutEffect,useRef,useState} from 'react'
import type {RefObject} from 'react'
import type {Locale} from './i18n'
import {portalCopy} from './portalCopy'
import {PortalCinema} from './portalCinema'
import type {PortalSnapshot} from './portalCinema'
import type {ForestAudio} from './useForestAudio'
import Arrow from './Arrow'
import SoundControl from './SoundControl'
import './fungusPortal.css'

export type PortalOrigin={element:HTMLElement;x:number;y:number}
type Props={opener:RefObject<PortalOrigin|null>;locale:Locale;onLocaleChange:(value:Locale)=>void;onClose:(value:Locale)=>void;audio:ForestAudio;reduced:boolean;saving:boolean}
const initial:PortalSnapshot={phase:'portal-ready',clip:-1,loading:false,paused:false,static:false,cycles:0}
export default function FungusPortal({opener:origin,locale,onLocaleChange,onClose,audio,reduced,saving}:Props){
 const [state,setState]=useState(initial),[opted,setOpted]=useState(false),[imageReady,setImageReady]=useState(false),[imageError,setImageError]=useState(false),[imageAttempt,setImageAttempt]=useState(0)
 const dialog=useRef<HTMLDialogElement>(null),view=useRef<HTMLDivElement>(null),cinema=useRef<PortalCinema|null>(null),exitButton=useRef<HTMLButtonElement>(null)
 const chosenLocale=useRef(locale)
 const latest=useRef({locale,onClose});useLayoutEffect(()=>{latest.current={locale,onClose}},[locale,onClose])
 const exitAction=useRef<()=>void>(()=>{})
 const t=portalCopy[locale],quiet=(reduced||saving)&&!opted,living=state.phase==='living-world',ready=state.phase==='portal-ready'&&!state.loading,error=state.phase==='error'
 useEffect(()=>{
  const el=dialog.current!,opener=origin.current?.element,scroll=origin.current??{x:scrollX,y:scrollY},token='fungus-'+Date.now()
  let exited=false,closing=false
  const close=()=>{if(exited)return;exited=true;latest.current.onClose(chosenLocale.current)}
  const pop=()=>close()
  history.pushState({...history.state,piepePortal:token},'',location.href);window.addEventListener('popstate',pop)
  exitAction.current=()=>{if(closing||exited)return;closing=true;if(history.state?.piepePortal===token)history.back();else close()}
  const player=new PortalCinema(el,setState,()=>exitAction.current());cinema.current=player
  const visibility=()=>{if(document.hidden)player.pause()}
  const resize=()=>{view.current?.style.setProperty('--gaze-x','0px');view.current?.style.setProperty('--gaze-y','0px')}
  document.addEventListener('visibilitychange',visibility);window.addEventListener('resize',resize)
  el.showModal()
  return()=>{
   player.destroy();cinema.current=null;window.removeEventListener('popstate',pop);document.removeEventListener('visibilitychange',visibility);window.removeEventListener('resize',resize)
   el.close();requestAnimationFrame(()=>{window.scrollTo({left:scroll.x,top:scroll.y,behavior:'instant'});if(opener?.isConnected)opener.focus({preventScroll:true})})
  }
 },[origin])
 useEffect(()=>{if(quiet&&(state.clip>=0||state.loading)&&!state.static)cinema.current?.showStill()},[quiet,state.clip,state.static,state.loading])
 const begin=(full=false)=>{void cinema.current?.resume();if(full)setOpted(true);exitButton.current?.focus({preventScroll:true});if(quiet&&!full)cinema.current?.showStill();else void cinema.current?.playClip(0)}
 const skip=()=>{exitButton.current?.focus({preventScroll:true});if(quiet)cinema.current?.showStill();else void cinema.current?.playClip(3)}
 const resetGaze=()=>{view.current?.style.setProperty('--gaze-x','0px');view.current?.style.setProperty('--gaze-y','0px')}
 const gaze=(x:number,y:number)=>{
  if(!living||reduced||state.static)return
  const el=view.current!,r=el.getBoundingClientRect();el.style.setProperty('--gaze-x',`${((x-r.left)/r.width-.5)*Math.min(12,r.width*.012)}px`);el.style.setProperty('--gaze-y',`${((y-r.top)/r.height-.5)*Math.min(8,r.height*.012)}px`)
 }
 const scene=state.clip<0?0:state.clip+1
 return <dialog ref={dialog} className="fungus-portal" data-portal-phase={state.phase} data-portal-still-ready={imageReady} data-portal-static={state.static} data-portal-paused={state.paused} aria-labelledby="portal-title" aria-describedby="portal-art" onCancel={e=>{e.preventDefault();exitAction.current()}}>
  <div ref={view} className={`portal-view ${living&&!state.static&&!reduced?'portal-gaze':''}`} data-portal-view tabIndex={living&&!state.static?0:-1} role="region" aria-label={t.gaze} aria-describedby={living?'portal-gaze-help':undefined} onPointerMove={e=>{if(e.pointerType!=='touch'||e.buttons)gaze(e.clientX,e.clientY)}} onPointerLeave={resetGaze} onPointerUp={resetGaze} onKeyDown={e=>{
   if(!living||reduced)return
   const axis=e.key==='ArrowLeft'||e.key==='ArrowRight'?'--gaze-x':'--gaze-y'
   if(e.key==='Home'){e.preventDefault();resetGaze()}
   else if(e.key.startsWith('Arrow')){e.preventDefault();view.current?.style.setProperty(axis,e.key==='ArrowLeft'||e.key==='ArrowUp'?'-2px':'2px')}
  }}>
   <img key={imageAttempt} onLoad={event=>{void event.currentTarget.decode().then(()=>{setImageReady(true);setImageError(false)}).catch(()=>setImageError(true))}} onError={()=>setImageError(true)} className="portal-original" data-portal-original src="/media/01_Start.png" width="1672" height="941" alt="" decoding="async" fetchPriority="high"/>
   {[0,1].map(slot=><div key={slot} className="portal-slot" data-portal-slot={slot} aria-hidden="true"><video muted playsInline preload="none" tabIndex={-1}/><img className="portal-frame" alt=""/></div>)}
   {state.static&&<img className="portal-static-world" src="/media/portal-living-still.webp" alt="" width="1920" height="1080"/>}
  </div>
  <header className="portal-topbar"><span className="portal-brand">pie.pe <span> / {String(scene+1).padStart(2,'0')}</span></span><nav className="portal-languages" aria-label={locale==='lv'?'Valoda':'Language'}>{(['lv','en'] as const).map(value=><button key={value} type="button" lang={value} aria-pressed={locale===value} onClick={()=>{chosenLocale.current=value;onLocaleChange(value)}}>{value.toUpperCase()}</button>)}</nav>{living&&!state.static&&<button type="button" className="portal-motion" onClick={()=>state.paused?void cinema.current?.resume():cinema.current?.pause()}>{state.paused?t.resume:t.pause}</button>}<button ref={exitButton} type="button" className="portal-exit" onClick={()=>exitAction.current()}>{t.exit}<span aria-hidden="true"> ×</span></button></header>
  <h2 id="portal-title" className={ready?'portal-title':'sr-only'}>{t.title}</h2>
  {ready&&<div className="portal-invitation"><p>{imageError?t.error:imageReady?t.intro:t.loading}</p>{imageError&&<button className="portal-secondary" onClick={()=>{setImageError(false);setImageAttempt(n=>n+1)}}>{t.retry}</button>}<button disabled={!imageReady} className="portal-primary" type="button" onClick={()=>begin()} autoFocus>{quiet?t.still:t.begin}<span aria-hidden="true"><Arrow direction="diagonal"/></span></button>{quiet&&<><p className="portal-data-note">{t.data}</p><button className="portal-secondary" disabled={!imageReady} type="button" onClick={()=>begin(true)}>{t.optIn}</button></>}</div>}
  {!ready&&state.phase!=='finished'&&<div className={`portal-controls ${living?'portal-controls-living':''}`}>
   <p className={`portal-scene ${living&&!state.loading&&!state.paused?'sr-only':''}`} role="status" aria-atomic="true">{error?t.error:state.loading?t.loading:state.paused?t.hidden:t.scenes[scene]}</p>
   {living&&<p className="portal-gaze-hint">{state.static?t.staticNote:t.gaze}<span className="sr-only" id="portal-gaze-help">{t.gazeHelp}</span></p>}
   <div className="portal-action-row">
    {error?<><button type="button" onClick={()=>cinema.current?.retry()}>{t.retry}</button><button type="button" onClick={skip}>{t.skip}</button></>:living?<><button type="button" onClick={()=>void cinema.current?.stay()}>{t.stay}</button><button type="button" className="portal-primary" onClick={()=>{resetGaze();if(state.static)exitAction.current();else void cinema.current?.playClip(4)}}>{t.return}<span aria-hidden="true"><Arrow direction="diagonal"/></span></button></>:<><button type="button" onClick={()=>state.paused?void cinema.current?.resume():cinema.current?.pause()}>{state.paused?t.resume:t.pause}</button>{state.clip<3&&<button type="button" onClick={skip}>{t.skip}<span aria-hidden="true"><Arrow direction="right"/></span></button>}</>}
    
    {state.static&&<button type="button" onClick={()=>begin(true)}>{t.optIn}</button>}
   </div>
  </div>}
  {state.phase==='finished'&&<p className="portal-finished" role="status">{t.finished}</p>}
  <div className="portal-sound"><SoundControl audio={audio.status==='waiting'&&audio.enabled?{...audio,enabled:false,toggle:audio.activate??audio.toggle}:audio} locale={locale}/></div>
  <p id="portal-art" className="portal-art">{t.art}</p>
 </dialog>
}
