export type PortalPhase='portal-ready'|'entering'|'deepening'|'arriving'|'living-world'|'returning'|'finished'|'error'
export type PortalSnapshot={phase:PortalPhase;clip:number;loading:boolean;paused:boolean;static:boolean;cycles:number;slow?:boolean}
export const portalClips=['02','03','04','05','06','07'] as const
// Authored per-boundary holds: no global fade, speed change or artificial camera path.
export const portalSeams=[420,180,220,90,200,90] as const
const phaseFor=(index:number):PortalPhase=>index===0?'entering':index===1?'deepening':index===2?'arriving':index===3?'living-world':'returning'
type Slot={group:HTMLElement;video:HTMLVideoElement;poster:HTMLImageElement;clip:number;abort?:AbortController;ready?:Promise<void>;frame:number;networkProgress:number;presented:boolean;probeStarted:boolean;probe?:AbortController}

/** Two bounded source-quality buffers. One plays; the other prepares only on intent/near a boundary. */
export class PortalCinema {
 private slots:Slot[]
 private active=-1
 private epoch=0
 private disposed=false
 private busy=false
 private next?:number
 private finishAnimation?:Animation
 private watchdog:ReturnType<typeof setInterval>
 private progressTime=0
 private progressAt=performance.now()
 private state:PortalSnapshot={phase:'portal-ready',clip:-1,loading:false,paused:false,static:false,cycles:0}
 constructor(private root:HTMLElement,private emit:(value:PortalSnapshot)=>void,private finish:()=>void,private returnToWindow?:(image:HTMLImageElement,layer:HTMLElement)=>Promise<void>){
  this.slots=[...root.querySelectorAll<HTMLElement>('[data-portal-slot]')].map(group=>({group,video:group.querySelector('video')!,poster:group.querySelector('img')!,clip:-1,frame:0,networkProgress:performance.now(),presented:false,probeStarted:false}))
  for(const slot of this.slots){
   slot.video.muted=true;slot.video.playsInline=true;slot.video.preload='auto'
   slot.video.addEventListener('progress',()=>{slot.networkProgress=performance.now()})
   slot.video.addEventListener('ended',()=>{if(this.slots[this.active]===slot&&!this.busy){if(slot.clip===5)void this.end();else void this.playClip(slot.clip+1)}})
   slot.video.addEventListener('timeupdate',()=>{
    if(this.slots[this.active]!==slot||this.busy||slot.clip===3||slot.clip===5)return
    if(slot.video.duration-slot.video.currentTime<2.5)void this.prepare(slot.clip+1).catch(()=>{/* Active film keeps its final frame; boundary exposes Retry. */})
   })
   slot.video.addEventListener('error',()=>{if(this.slots[this.active]===slot&&!this.busy)this.fail()})
  }
  this.watchdog=setInterval(()=>{
   const slot=this.slots[this.active],video=slot?.video
   if(!video||this.state.paused||this.busy||this.disposed||document.hidden)return
   const now=performance.now(),stalled=now-this.progressAt
   // AVFoundation can announce loadeddata/HAVE_ENOUGH_DATA/playing before a
   // compressed first sample is complete. Native progress can also stay silent
   // during that download. Observe real transport only on this slow first frame;
   // only a presented frame starts the playback-stall clock.
   if(!slot.presented){
    if(stalled>=120000||now-slot.networkProgress>=20000)this.fail()
    else if(stalled>8000){if(now-slot.networkProgress>8000)this.observeTransport(slot);if(!this.state.slow)this.update({slow:true})}
    return
   }
   if(video.currentTime!==this.progressTime){this.progressTime=video.currentTime;this.progressAt=now;if(this.state.slow)this.update({slow:false})}
   else if(!video.paused&&stalled>8000){
    if(stalled>120000||now-this.slots[this.active].networkProgress>20000)this.fail()
    else if(!this.state.slow)this.update({slow:true})
   }
  },500)
 }
 snapshot(){return this.state}
 private update(values:Partial<PortalSnapshot>){if(this.disposed)return;this.state={...this.state,...values};this.root.dataset.portalPhase=this.state.phase;this.root.dataset.portalCycles=String(this.state.cycles);this.emit({...this.state})}
 private release(slot:Slot){slot.abort?.abort();slot.probe?.abort();slot.probe=undefined;slot.probeStarted=false;slot.video.cancelVideoFrameCallback?.(slot.frame);slot.video.pause();slot.video.removeAttribute('src');slot.video.load();slot.poster.removeAttribute('src');slot.clip=-1;slot.ready=undefined;slot.presented=false;slot.group.style.opacity='0'}
 private observeTransport(slot:Slot){
  if(slot.probeStarted||slot.presented||slot.abort?.signal.aborted||this.disposed)return
  slot.probeStarted=true;const probe=new AbortController();slot.probe=probe
  slot.abort?.signal.addEventListener('abort',()=>probe.abort(),{once:true,signal:probe.signal})
  // A single, capped same-source range distinguishes incoming bytes from a real
  // stall when Safari's media progress describes only complete buffered samples.
  // Skip the small MP4 header so metadata alone cannot keep a stalled film alive.
  // Never fetch the whole film again, substitute a source or lower its quality.
  void (async()=>{
   try{
    const response=await fetch(slot.video.src,{headers:{Range:'bytes=16384-540671'},cache:'no-store',signal:probe.signal})
    const range=/^bytes (\d+)-(\d+)\/(\d+)$/.exec(response.headers.get('Content-Range')??'')
    if(response.status!==206||!range||Number(range[1])!==16384||Number(range[2])>540671){await response.body?.cancel();return}
    const reader=response.body?.getReader();if(!reader)return
    let received=0
    while(!probe.signal.aborted){
     const {done,value}=await reader.read();if(done)break
     received+=value.byteLength;if(received>524288){await reader.cancel();break}
     if(value.byteLength)slot.networkProgress=performance.now()
    }
   }catch{/* A failed observer is not progress; the unchanged stall bound applies. */}
   finally{probe.abort();if(slot.probe===probe)slot.probe=undefined}
  })()
 }
 private prepare(index:number):Promise<void>{
  const target=this.active===0?this.slots[1]:this.slots[0]
  if(target.clip===index&&target.ready)return target.ready
  this.release(target);target.clip=index;target.networkProgress=performance.now();const abort=new AbortController();target.abort=abort
  const {video,poster}=target;video.loop=index===3;video.playbackRate=1;target.group.dataset.portalClip=String(index);poster.style.opacity='1'
  target.ready=new Promise<void>((resolve,reject)=>{
   let decoded=false,image=false,presentedFrame=false,settled=false,lastTick=performance.now(),visibleWait=0
   const done=()=>{if(!settled&&decoded&&(image||presentedFrame)){settled=true;clearInterval(timeout);resolve()}}
   const bad=()=>{if(!settled){settled=true;clearInterval(timeout);target.probe?.abort();reject(Error('Portal media unavailable'))}}
   // A progressing source-quality download may take longer than twenty seconds.
   // Stop on a real twenty-second stall, or a two-minute visible preparation bound.
   const timeout=setInterval(()=>{
    const now=performance.now();if(!document.hidden)visibleWait+=now-lastTick;else target.networkProgress=now;lastTick=now
    if(document.hidden)return
    if(visibleWait>=120000||now-target.networkProgress>=20000)bad()
    else if(visibleWait>=8000&&this.state.loading&&this.next===index){if(now-target.networkProgress>8000)this.observeTransport(target);if(!this.state.slow)this.update({slow:true})}
   },500)
   video.addEventListener('loadedmetadata',()=>{target.networkProgress=performance.now()},{signal:abort.signal})
   abort.signal.addEventListener('abort',()=>{if(!settled){settled=true;clearInterval(timeout);reject(new DOMException('Cancelled','AbortError'))}},{once:true})
   video.addEventListener('loadeddata',()=>{if(video.readyState>=2&&video.videoWidth){decoded=true;done()}},{signal:abort.signal})
   video.addEventListener('error',bad,{signal:abort.signal});poster.addEventListener('error',bad,{signal:abort.signal})
   poster.src=`/media/portal-${portalClips[index]}-first.webp`;poster.decode().then(()=>{image=true;done()},bad)
   const presented:VideoFrameRequestCallback=()=>{
    if(abort.signal.aborted)return
    if(video.readyState>=2){
     const first=!target.presented;target.presented=true;target.probe?.abort();poster.style.opacity='0';decoded=true;presentedFrame=true;done()
     if(first&&this.slots[this.active]===target){this.progressTime=video.currentTime;this.progressAt=performance.now();this.update({loading:false,slow:false})}
    }
    else target.frame=video.requestVideoFrameCallback(presented)
   }
   // A source assignment can discard frame subscriptions. Register on both sides.
   if(video.requestVideoFrameCallback)target.frame=video.requestVideoFrameCallback(presented)
   video.src=`/media/portal-${portalClips[index]}-faststart.mp4`;video.load()
   if(video.requestVideoFrameCallback)target.frame=video.requestVideoFrameCallback(presented)
   else video.addEventListener('playing',()=>requestAnimationFrame(()=>requestAnimationFrame(()=>{target.presented=true;target.probe?.abort();poster.style.opacity='0';if(this.slots[this.active]===target){this.progressAt=performance.now();this.update({loading:false,slow:false})}})),{signal:abort.signal})
  })
  // A prefetched rejection is retained for the explicit boundary, without an unhandled promise.
  void target.ready.catch(()=>{})
  return target.ready
 }
 private fail(){for(const slot of this.slots)slot.probe?.abort();this.slots[this.active]?.video.pause();this.busy=false;this.update({phase:'error',paused:true,loading:false,slow:false})}
 async playClip(index:number){
  if(this.disposed||index<0||index>5)return
  const epoch=++this.epoch;this.busy=true;this.next=index;this.update({loading:true,slow:false})
  if(index!==4)delete this.root.dataset.portalReturning
  const current=this.slots[this.active]?.group
  const gaze=index===4&&current?current.animate([{transform:getComputedStyle(current).transform},{transform:'none'}],{duration:280,fill:'forwards',easing:'ease-out'}):undefined
  if(index===4)this.root.dataset.portalReturning='true'
  try{
   await Promise.all([this.prepare(index),gaze?.finished.catch(()=>{})]);gaze?.cancel();if(this.disposed||epoch!==this.epoch)return
   const incoming=this.active===0?1:0,outgoing=this.active,slot=this.slots[incoming]
   this.slots[outgoing]?.video.pause();slot.group.style.zIndex='2';slot.group.style.opacity='1'
   const duration=matchMedia('(prefers-reduced-motion: reduce)').matches?0:portalSeams[index]
   const blend=slot.group.animate([{opacity:0},{opacity:1}],{duration,easing:'ease-in-out'});this.finishAnimation=blend
   await blend.finished.catch(()=>{});if(this.disposed||epoch!==this.epoch)return
   this.active=incoming;if(outgoing>=0)this.release(this.slots[outgoing]);slot.group.style.zIndex='1';this.root.dataset.portalActive=String(incoming)
   this.busy=false;this.next=undefined;this.progressAt=performance.now();this.progressTime=0
   this.update({phase:phaseFor(index),clip:index,loading:!slot.presented,static:false,slow:false})
   this.observeLoop(slot);if(!this.state.paused&&!document.hidden)await slot.video.play()
  }catch(error){if(!this.disposed&&epoch===this.epoch&&!(error instanceof DOMException&&error.name==='AbortError')){this.update({clip:index});if(error instanceof DOMException&&error.name==='NotAllowedError')this.update({paused:true,loading:false});else this.fail()}}
 }
 private observeLoop(slot:Slot){
  if(slot.clip!==3||!slot.video.requestVideoFrameCallback)return
  let previous=0
  const frame:VideoFrameRequestCallback=(_,metadata)=>{
   if(this.disposed||slot.clip!==3||this.slots[this.active]!==slot)return
   if(previous>5&&metadata.mediaTime<1)this.update({cycles:this.state.cycles+1})
   previous=metadata.mediaTime;slot.frame=slot.video.requestVideoFrameCallback(frame)
  }
  slot.frame=slot.video.requestVideoFrameCallback(frame)
 }
 pause(){for(const slot of this.slots)slot.video.pause();this.update({paused:true})}
 async resume(){
  this.progressAt=performance.now();this.update({paused:false,slow:false})
  const slot=this.slots[this.active];if(!slot||this.state.static)return
  try{await slot.video.play()}catch{this.update({paused:true})}
 }
 retry(){const index=this.next??Math.max(0,this.state.clip);this.release(this.slots[this.active===0?1:0]);this.update({paused:false});void this.playClip(index)}
 showStill(){
  ++this.epoch;this.finishAnimation?.cancel();this.slots.forEach(slot=>this.release(slot));this.active=-1;this.busy=false;this.update({phase:'living-world',clip:3,static:true,loading:false,paused:false,slow:false})
 }
 private async end(){
  this.busy=true;this.update({phase:'finished',loading:false});const image=this.root.querySelector<HTMLImageElement>('[data-portal-original]')!,still=this.root.querySelector<HTMLElement>('[data-portal-still-layer]')??image
  image.style.opacity='1'
  still.style.zIndex='3';still.style.opacity='1';const duration=matchMedia('(prefers-reduced-motion: reduce)').matches?0:520
  this.finishAnimation=still.animate([{opacity:0},{opacity:1}],{duration,easing:'ease-in-out'})
  await this.finishAnimation.finished.catch(()=>{});if(this.disposed)return
  this.root.dataset.portalReturnStill='true'
  if(this.returnToWindow){this.slots.forEach(slot=>this.release(slot));await this.returnToWindow(image,still).catch(()=>{});if(!this.disposed)this.finish();return}
  // Give the exact original still a quiet beat before leaving the doorway.
  const closing=this.root.animate([{opacity:1},{opacity:0}],{duration:360,delay:450,easing:'ease-in'});this.finishAnimation=closing
  await closing.finished.catch(()=>{});if(!this.disposed)this.finish()
 }
 destroy(){this.disposed=true;++this.epoch;clearInterval(this.watchdog);this.finishAnimation?.cancel();this.slots.forEach(slot=>this.release(slot))}
}
