import { bindXray } from './experienceControls'
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

document.querySelectorAll<HTMLElement>('[data-xray]').forEach(bindXray)

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
