/** One progressively enhanced controller for the static guide and React homepage. */
export function bindXray(section: HTMLElement) {
  const abort=new AbortController(), options={signal:abort.signal}
  const range=section.querySelector<HTMLInputElement>('[data-xray-range]')!,output=section.querySelector<HTMLOutputElement>('[data-xray-output]')!
  const update=()=>{
    const value=Math.max(0,Math.min(100,Number(range.value)))
    section.style.setProperty('--reveal',`${value}%`)
    const text=`${value}% ${range.dataset.outputLabel}`;range.setAttribute('aria-valuetext',text);output.value=text
  }
  range.addEventListener('input',update,options)
  const handle=section.querySelector<HTMLElement>('[data-xray-handle]')!,view=section.querySelector<HTMLElement>('.xray-view')!
  let drag: {pointer:number;x:number;y:number;value:number;width:number;moved:boolean}|undefined
  handle.addEventListener('pointerdown',event=>{
    if(event.button!==0)return
    drag={pointer:event.pointerId,x:event.clientX,y:event.clientY,value:Number(range.value),width:view.getBoundingClientRect().width,moved:false}
    handle.setPointerCapture(event.pointerId);range.focus({preventScroll:true})
  },options)
  handle.addEventListener('pointermove',event=>{
    if(!drag||drag.pointer!==event.pointerId)return
    const dx=event.clientX-drag.x,dy=event.clientY-drag.y
    if(!drag.moved&&(Math.abs(dx)<6||Math.abs(dx)<=Math.abs(dy)*1.2))return
    drag.moved=true;range.value=String(Math.round(drag.value+dx/drag.width*100));update()
  },options)
  const stop=()=>{drag=undefined}
  handle.addEventListener('pointerup',stop,options);handle.addEventListener('pointercancel',stop,options);handle.addEventListener('lostpointercapture',stop,options)
  section.querySelectorAll<HTMLAnchorElement>('[data-xray-point]').forEach(point=>point.addEventListener('click',()=>{
    const story=section.querySelector<HTMLDetailsElement>(point.hash)
    if(story){story.open=true;story.querySelector('summary')?.focus({preventScroll:true})}
  },options))
  update();window.addEventListener('pageshow',update,options);section.dataset.enhanced='true';section.querySelector<HTMLElement>('[data-xray-controls]')!.hidden=false
  return ()=>{abort.abort();stop();delete section.dataset.enhanced;section.querySelector<HTMLElement>('[data-xray-controls]')!.hidden=true}
}
