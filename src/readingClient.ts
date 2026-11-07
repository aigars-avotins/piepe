// Progressive controls for static documents. No router, React, video or audio runtime.
const themeRoot=document.documentElement
function restoreStaticAtmosphere() {
  try { themeRoot.dataset.atmosphere=localStorage.getItem('piepe-atmosphere')==='nightfall'?'nightfall':'morning' } catch { /* Keep this visit's choice. */ }
  const selected=themeRoot.dataset.atmosphere==='nightfall'?'nightfall':'morning'
  document.querySelectorAll<HTMLButtonElement>('[data-atmosphere-choice]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.atmosphereChoice===selected)))
}
document.querySelectorAll<HTMLElement>('[data-atmosphere-controls]').forEach(controls=>{
  controls.querySelectorAll<HTMLButtonElement>('[data-atmosphere-choice]').forEach(button=>button.addEventListener('click',()=>{
    const value=button.dataset.atmosphereChoice==='nightfall'?'nightfall':'morning'
    themeRoot.dataset.atmosphere=value
    try { localStorage.setItem('piepe-atmosphere',value) } catch { /* Still usable with storage denied. */ }
    controls.querySelectorAll('button').forEach(item=>item.setAttribute('aria-pressed',String(item===button)))
  }))
  controls.hidden=false
})
restoreStaticAtmosphere();window.addEventListener('storage',restoreStaticAtmosphere);window.addEventListener('pageshow',restoreStaticAtmosphere)
const connection=(navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string; addEventListener?: (type: string, callback: () => void) => void } }).connection
const staticPreferences=()=>themeRoot.toggleAttribute('data-save-data',!!connection?.saveData||['2g','slow-2g'].includes(connection?.effectiveType||''))
staticPreferences();connection?.addEventListener?.('change',staticPreferences)

document.querySelectorAll<HTMLElement>('[data-xray]').forEach(section=>{
  const range=section.querySelector<HTMLInputElement>('[data-xray-range]')!,output=section.querySelector<HTMLOutputElement>('[data-xray-output]')!
  const update=()=>{
    const value=Math.max(0,Math.min(100,Number(range.value)))
    section.style.setProperty('--reveal',`${value}%`)
    const text=`${value}% ${range.dataset.outputLabel}`;range.setAttribute('aria-valuetext',text);output.value=text
  }
  range.addEventListener('input',update);range.addEventListener('change',()=>{section.dataset.touched='true'})
  const handle=section.querySelector<HTMLElement>('[data-xray-handle]')!,view=section.querySelector<HTMLElement>('.xray-view')!
  let drag: { pointer: number; x: number; y: number; value: number; width: number; moved: boolean } | undefined
  handle.addEventListener('pointerdown',event=>{
    if(event.button!==0)return
    drag={pointer:event.pointerId,x:event.clientX,y:event.clientY,value:Number(range.value),width:view.getBoundingClientRect().width,moved:false}
    handle.setPointerCapture(event.pointerId);range.focus({preventScroll:true})
  })
  handle.addEventListener('pointermove',event=>{
    if(!drag||drag.pointer!==event.pointerId)return
    const dx=event.clientX-drag.x,dy=event.clientY-drag.y
    if(!drag.moved&&(Math.abs(dx)<6||Math.abs(dx)<=Math.abs(dy)*1.2))return
    drag.moved=true;range.value=String(Math.round(drag.value+dx/drag.width*100));update()
  })
  const stopDrag=()=>{if(drag?.moved)section.dataset.touched='true';drag=undefined}
  handle.addEventListener('pointerup',stopDrag);handle.addEventListener('pointercancel',stopDrag);handle.addEventListener('lostpointercapture',stopDrag)
  section.querySelectorAll<HTMLAnchorElement>('[data-xray-point]').forEach(point=>point.addEventListener('click',()=>{
    const story=document.getElementById(`xray-${point.dataset.xrayPoint}`) as HTMLDetailsElement|null
    if(story){story.open=true;story.querySelector('summary')?.focus({preventScroll:true})}
  }))
  update();section.dataset.enhanced='true';section.querySelector<HTMLElement>('[data-xray-controls]')!.hidden=false
})

document.querySelectorAll<HTMLDetailsElement>('[data-atlas-card]').forEach(card=>{
  const close=()=>{card.open=false;card.querySelector('summary')?.focus({preventScroll:true})}
  const button=card.querySelector<HTMLButtonElement>('[data-atlas-close]')!;button.hidden=false;button.addEventListener('click',close)
  card.addEventListener('keydown',event=>{if(event.key==='Escape'&&card.open){event.preventDefault();event.stopPropagation();close()}})
})

document.querySelectorAll<HTMLElement>('[data-time-capsule]').forEach(section=>{
  const range=section.querySelector<HTMLInputElement>('[data-time-range]')!,output=section.querySelector<HTMLOutputElement>('[data-time-output]')!
  const buttons=[...section.querySelectorAll<HTMLButtonElement>('[data-time-choice]')],stories=[...section.querySelectorAll<HTMLElement>('[data-time-story]')]
  const activate=(index:number)=>{
    const stage=Math.max(0,Math.min(3,index));section.dataset.stage=String(stage);range.value=String(stage+1)
    const title=stories[stage].dataset.title!;range.setAttribute('aria-valuetext',title);output.value=title
    buttons.forEach((button,i)=>button.setAttribute('aria-pressed',String(i===stage)))
    section.querySelectorAll('[data-time-figure]').forEach((figure,i)=>figure.setAttribute('aria-hidden',String(i!==stage)))
    stories.forEach((story,i)=>story.toggleAttribute('data-current',i===stage))
  }
  range.addEventListener('input',()=>activate(Number(range.value)-1))
  buttons.forEach((button,i)=>{
    button.addEventListener('click',()=>activate(i))
    button.addEventListener('keydown',event=>{
      const key=event.key,index=key==='Home'?0:key==='End'?3:key==='ArrowRight'?Math.min(3,i+1):key==='ArrowLeft'?Math.max(0,i-1):-1
      if(index>=0){event.preventDefault();activate(index);buttons[index].focus()}
    })
  })
  activate(Number(range.value)-1);section.querySelector<HTMLElement>('[data-time-controls]')!.hidden=false
})
export {}
