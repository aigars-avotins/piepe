/** Shared progressive controls: static reading documents and the React homepage. */
export { bindImageFallback } from './imageReadiness'
import { revealDeferredImages } from './imageReadiness'

export function bindXray(section: HTMLElement) {
  const abort=new AbortController(), options={signal:abort.signal}
  const range=section.querySelector<HTMLInputElement>('[data-xray-range]')!,output=section.querySelector<HTMLOutputElement>('[data-xray-output]')!
  const update=()=>{
    const value=Math.max(0,Math.min(100,Number(range.value)))
    section.style.setProperty('--xray-split',`${value}%`)
    const text=`${value}% ${range.dataset.outputLabel}`;range.setAttribute('aria-valuetext',text);output.value=text
  }
  range.addEventListener('input',update,options)
  const view=section.querySelector<HTMLElement>('.xray-view')!
  view.addEventListener('dragstart',event=>event.preventDefault(),options)
  let drag:{pointer:number;x:number;y:number;left:number;width:number;touch:boolean;moved:boolean}|undefined
  const position=(x:number)=>{if(drag){range.value=String(Math.round((x-drag.left)/drag.width*100));update()}}
  view.addEventListener('pointerdown',event=>{
    if(event.button!==0||(event.target as HTMLElement).closest('a,button'))return
    const rect=view.getBoundingClientRect()
    drag={pointer:event.pointerId,x:event.clientX,y:event.clientY,left:rect.left,width:rect.width,touch:event.pointerType==='touch',moved:false}
    view.setPointerCapture(event.pointerId);range.focus({preventScroll:true})
    if(!drag.touch)position(event.clientX)
  },options)
  view.addEventListener('pointermove',event=>{
    if(!drag||drag.pointer!==event.pointerId)return
    const dx=event.clientX-drag.x,dy=event.clientY-drag.y
    if(drag.touch&&!drag.moved&&(Math.abs(dx)<6||Math.abs(dx)<=Math.abs(dy)*1.2))return
    drag.moved=true;position(event.clientX)
  },options)
  const stop=()=>{drag=undefined}
  view.addEventListener('pointerup',stop,options);view.addEventListener('pointercancel',stop,options);view.addEventListener('lostpointercapture',stop,options)
  const points=[...section.querySelectorAll<HTMLAnchorElement>('[data-xray-point]')]
  const stories=[...section.querySelectorAll<HTMLElement>('[data-xray-story]')]
  const select=(index:number,focus=false)=>{
    points.forEach((point,i)=>{point.setAttribute('aria-selected',String(i===index));point.tabIndex=i===index?0:-1})
    stories.forEach((story,i)=>{story.hidden=i!==index;story.toggleAttribute('data-current',i===index)})
    const status=section.querySelector<HTMLElement>('[data-xray-selection]')
    if(status)status.textContent=points[index].getAttribute('aria-label')
    if(focus)points[index].focus({preventScroll:true})
  }
  section.querySelector('[data-xray-points]')!.setAttribute('role','tablist')
  points.forEach((point,index)=>{
    point.setAttribute('role','tab');stories[index].setAttribute('role','tabpanel');stories[index].setAttribute('aria-labelledby',point.id)
    point.addEventListener('click',event=>{event.preventDefault();select(index,true)},options)
    point.addEventListener('keydown',event=>{
      const next=event.key==='Home'?0:event.key==='End'?points.length-1:event.key==='ArrowRight'?(index+1)%points.length:event.key==='ArrowLeft'?(index+points.length-1)%points.length:-1
      if(next>=0){event.preventDefault();select(next,true)}
    },options)
  })
  const deepLink=()=>{const index=stories.findIndex(story=>'#'+story.id===location.hash);if(index>=0)select(index)}
  select(Math.max(0,stories.findIndex(story=>'#'+story.id===location.hash)));window.addEventListener('hashchange',deepLink,options)
  update();window.addEventListener('pageshow',update,options);section.dataset.enhanced='true';range.disabled=false
  return()=>{abort.abort();stop();delete section.dataset.enhanced;range.disabled=true;section.querySelector('[data-xray-points]')!.removeAttribute('role');stories.forEach(story=>{story.hidden=false;story.removeAttribute('role');story.removeAttribute('aria-labelledby')});points.forEach(point=>{point.removeAttribute('role');point.removeAttribute('aria-selected');point.removeAttribute('tabindex')})}
}

export function bindAtlas(section: HTMLElement) {
  const abort = new AbortController(), options = { signal: abort.signal }
  const dialog = section.querySelector<HTMLDialogElement>('[data-atlas-dialog]')!, comparison = dialog.querySelector<HTMLElement>('.atlas-comparison')!
  let opener: HTMLButtonElement | undefined
  const cards = [...section.querySelectorAll<HTMLElement>('[data-atlas-card]')]
  cards.forEach(card => {
    const button = card.querySelector<HTMLButtonElement>('[data-atlas-open]')!, picture = card.querySelector<HTMLElement>('[data-atlas-surface]')!
    const image = picture.querySelector<HTMLImageElement>('img[data-interactive-image]')!, lens = picture.querySelector<HTMLElement>('.atlas-loupe')!, magnified = lens.querySelector<HTMLImageElement>('img')!
    let x = .5, y = .5
    const hide = () => { delete picture.dataset.magnifying }
    const show = (px: number, py: number) => {
      if (!image.naturalWidth || image.dataset.imageState !== 'ready') return
      const b = image.getBoundingClientRect(), radius = Math.min(70, b.width / 3)
      x = Math.max(0, Math.min(1, px)); y = Math.max(0, Math.min(1, py))
      const original = new URL(image.dataset.originalSrc!, location.href).href
      if (magnified.src !== original) magnified.src = original
      lens.style.width = lens.style.height = `${radius * 2}px`
      lens.style.left = `${Math.max(radius, Math.min(b.width - radius, x * b.width)) - radius}px`
      lens.style.top = `${Math.max(radius, Math.min(b.height - radius, y * b.height)) - radius}px`
      magnified.style.width = `${b.width * 2.5}px`; magnified.style.height = `${b.height * 2.5}px`
      magnified.style.left = `${radius - x * b.width * 2.5}px`; magnified.style.top = `${radius - y * b.height * 2.5}px`
      picture.dataset.magnifying = 'true'
    }
    const atPointer = (event: PointerEvent) => { const b = image.getBoundingClientRect(); show((event.clientX - b.left) / b.width, (event.clientY - b.top) / b.height) }
    picture.addEventListener('dragstart', event => event.preventDefault(), options)
    picture.addEventListener('pointerdown', event => {
      if (event.button !== 0 || (event.target as Element).closest('a,button')) return
      if (event.pointerType === 'touch' && !event.isPrimary) { hide(); return }
      if (event.pointerType === 'touch') picture.setPointerCapture(event.pointerId)
      picture.focus({ preventScroll: true }); atPointer(event)
    }, options)
    picture.addEventListener('pointermove', atPointer, options)
    picture.addEventListener('pointerup', event => { if (event.pointerType === 'touch') hide() }, options)
    picture.addEventListener('pointerleave', hide, options); picture.addEventListener('pointercancel', hide, options)
    picture.addEventListener('focus', () => show(.5, .5), options); picture.addEventListener('blur', hide, options)
    picture.addEventListener('keydown', event => {
      const dx = event.key === 'ArrowRight' ? .05 : event.key === 'ArrowLeft' ? -.05 : 0
      const dy = event.key === 'ArrowDown' ? .05 : event.key === 'ArrowUp' ? -.05 : 0
      if (event.key === 'Home') { event.preventDefault(); show(.5, .5) }
      else if (dx || dy) { event.preventDefault(); show(x + dx, y + dy) }
    }, options)
    button.addEventListener('click', () => {
      hide(); opener = button; comparison.replaceChildren()
      for (const item of [card, ...cards.filter(other => other !== card)]) {
        const original = item.querySelector<HTMLImageElement>('img[data-interactive-image]')!, figure = document.createElement('figure'), photo = document.createElement('img'), caption = document.createElement('figcaption')
        // A dialog/loupe is deliberate intent: always use the retained full-resolution JPEG.
        photo.src = original.dataset.originalSrc!; photo.alt = original.alt; photo.width = Number(original.getAttribute('width')); photo.height = Number(original.getAttribute('height'))
        photo.loading = 'eager'; photo.decoding = 'async'; photo.className = 'raster-grade'
        photo.dataset.interactiveImage = ''; photo.dataset.originalSrc = original.dataset.originalSrc; photo.dataset.alternateSrc = original.dataset.alternateSrc; photo.dataset.fallbackSrc = original.dataset.fallbackSrc
        caption.textContent = item.querySelector('h3')!.textContent
        const status = item.querySelector<HTMLElement>('[data-image-status]')!.cloneNode(true) as HTMLElement
        status.hidden = true; figure.append(photo, caption, status); comparison.append(figure)
      }
      dialog.showModal()
    }, options)
    picture.tabIndex = 0; button.hidden = false; button.disabled = false
  })
  dialog.querySelector('[data-atlas-close]')!.addEventListener('click', () => dialog.close(), options)
  dialog.addEventListener('click', event => { if (event.target === dialog) { const r = dialog.getBoundingClientRect(); if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) dialog.close() } }, options)
  dialog.addEventListener('close', () => { comparison.replaceChildren(); opener?.focus({ preventScroll: true }) }, options)
  return () => { abort.abort(); if (dialog.open) dialog.close(); comparison.replaceChildren() }
}

export function bindTimeCapsule(section:HTMLElement) {
  const abort=new AbortController(),options={signal:abort.signal}
  const range=section.querySelector<HTMLInputElement>('[data-time-range]')!,output=section.querySelector<HTMLOutputElement>('[data-time-output]')!
  const buttons=[...section.querySelectorAll<HTMLButtonElement>('[data-time-choice]')],stories=[...section.querySelectorAll<HTMLElement>('[data-time-story]')],figures=[...section.querySelectorAll<HTMLElement>('[data-time-figure]')]
  const view=section.querySelector<HTMLElement>('.time-visual')!,loading=section.querySelector<HTMLElement>('[data-time-loading]')!
  let pending:number|undefined
  const apply=(value:number)=>{
    const progress=Math.max(0,Math.min(100,value)),position=progress/100*3,lower=Math.floor(position),fraction=position-lower,current=Math.round(position)
    range.value=String(progress);section.dataset.stage=String(current)
    const text=`${Math.round(progress)}% · ${stories[current].dataset.title}`;range.setAttribute('aria-valuetext',text);output.value=stories[current].dataset.title!
    section.querySelector('[data-time-composite]')!.setAttribute('aria-labelledby',`time-stage-${current}-title time-caption-${current}`)
    loading.hidden=true;range.removeAttribute('aria-busy')
    view.removeAttribute('data-image-error');view.querySelector<HTMLElement>('[data-image-status]')!.hidden=true
    buttons.forEach((button,i)=>button.setAttribute('aria-pressed',String(i===current)))
    figures.forEach((figure,i)=>{
      // One fully opaque base, one dissolving overlay: never a dark hole at midpoints.
      const opacity=i<=lower?1:i===lower+1?fraction:0
      figure.style.opacity=String(opacity);figure.style.transform=`scale(${1+(Math.max(0,Math.min(1,position-i))*.015)})`
      figure.setAttribute('aria-hidden',String(i!==current))
    })
    section.querySelectorAll('[data-time-caption]').forEach((caption,i)=>caption.setAttribute('aria-hidden',String(i!==current)))
    stories.forEach((story,i)=>story.toggleAttribute('data-current',i===current))
  }
  const settle=()=>{
    if(pending===undefined)return
    const position=pending/100*3,needed=[Math.floor(position),Math.ceil(position)].map(index=>figures[index].querySelector<HTMLImageElement>('img[data-interactive-image]')!)
    if(needed.every(image=>image.dataset.imageState==='ready'&&image.dataset.imageReady==='true')){const value=pending;pending=undefined;apply(value)}
    else{
      const failed=needed.some(image=>['fallback','failed'].includes(image.dataset.imageState||''))
      view.toggleAttribute('data-image-error',failed);view.querySelector<HTMLElement>('[data-image-status]')!.hidden=!failed
      loading.hidden=failed;range.setAttribute('aria-busy',String(!failed))
    }
  }
  const update=(value:number)=>{revealDeferredImages(view);pending=Math.max(0,Math.min(100,value));range.value=String(pending);range.setAttribute('aria-valuetext',`${Math.round(pending)}% · ${loading.textContent}`);loading.hidden=false;settle()}
  const near=new IntersectionObserver(entries=>{if(entries.some(entry=>entry.isIntersecting)){revealDeferredImages(view);near.disconnect()}},{rootMargin:'240px'})
  near.observe(view)
  section.addEventListener('raster:ready',settle,options);section.addEventListener('raster:state',settle,options)
  range.addEventListener('input',()=>update(Number(range.value)),options)
  buttons.forEach((button,i)=>{
    button.disabled=false;button.addEventListener('click',()=>update(i/3*100),options)
    button.addEventListener('keydown',event=>{
      const key=event.key,index=key==='Home'?0:key==='End'?3:key==='ArrowRight'?Math.min(3,i+1):key==='ArrowLeft'?Math.max(0,i-1):-1
      if(index>=0){event.preventDefault();update(index/3*100);buttons[index].focus()}
    },options)
  })
  range.disabled=false;apply(Number(range.value));window.addEventListener('pageshow',event=>{if(event.persisted&&Number(range.value)>0)update(Number(range.value))},options)
  return()=>{abort.abort();near.disconnect()}
}
