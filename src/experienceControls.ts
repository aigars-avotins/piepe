/** Shared progressive controls: static reading documents and the React homepage. */
export function bindImageFallback(root: HTMLElement | Document) {
  const images=[...root.querySelectorAll<HTMLImageElement>('img[data-interactive-image]')]
  const fail=(image:HTMLImageElement)=>{
    if(image.dataset.imageState==='fallback')return
    if(!image.dataset.imageState&&image.dataset.alternateSrc){image.dataset.imageState='alternate';image.src=image.dataset.alternateSrc}
    else{image.dataset.imageState='fallback';image.src=image.dataset.fallbackSrc!}
  }
  const error=(event:Event)=>{if(event.target instanceof HTMLImageElement&&event.target.hasAttribute('data-interactive-image'))fail(event.target)}
  root.addEventListener('error',error,true)
  images.forEach(image=>{if(image.complete&&!image.naturalWidth&&image.currentSrc)fail(image)})
  return()=>root.removeEventListener('error',error,true)
}
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
  section.querySelectorAll<HTMLAnchorElement>('[data-xray-point]').forEach(point=>point.addEventListener('click',()=>{
    const story=section.querySelector<HTMLDetailsElement>(point.hash)
    section.querySelector('[data-current]')?.removeAttribute('data-current')
    if(story){story.open=true;story.setAttribute('data-current','');story.querySelector('summary')?.focus({preventScroll:true})}
  },options))
  update();window.addEventListener('pageshow',update,options);section.dataset.enhanced='true';range.disabled=false
  return()=>{abort.abort();stop();delete section.dataset.enhanced;range.disabled=true}
}

export function bindAtlas(section:HTMLElement) {
  const dialog=section.querySelector<HTMLDialogElement>('[data-atlas-dialog]')!,comparison=dialog.querySelector<HTMLElement>('.atlas-comparison')!
  let opener:HTMLAnchorElement|undefined
  const cards=[...section.querySelectorAll<HTMLElement>('[data-atlas-card]')]
  cards.forEach(card=>{
    const link=card.querySelector<HTMLAnchorElement>('[data-atlas-open]')!,picture=card.querySelector<HTMLElement>('.atlas-picture')!,image=picture.querySelector<HTMLImageElement>('img[data-interactive-image]')!
    const lens=picture.querySelector<HTMLElement>('.atlas-loupe')!,magnified=lens.querySelector<HTMLImageElement>('img')!
    let touch:{id:number;x:number;y:number}|undefined,moved=false
    const sync=()=>{magnified.src=image.currentSrc||image.src;link.href=image.currentSrc||image.src}
    picture.addEventListener('dragstart',event=>event.preventDefault())
    image.addEventListener('load',sync);if(image.complete&&image.naturalWidth)sync()
    const show=(x:number,y:number)=>{
      if(!image.naturalWidth||image.dataset.imageState==='fallback')return
      const b=image.getBoundingClientRect(),px=Math.max(0,Math.min(b.width,x-b.left)),py=Math.max(0,Math.min(b.height,y-b.top)),radius=70
      lens.style.left=`${Math.max(radius,Math.min(b.width-radius,px))-radius}px`;lens.style.top=`${Math.max(radius,Math.min(b.height-radius,py))-radius}px`
      magnified.style.width=`${b.width*2.5}px`;magnified.style.height=`${b.height*2.5}px`;magnified.style.left=`${radius-px*2.5}px`;magnified.style.top=`${radius-py*2.5}px`
      picture.dataset.magnifying='true'
    }
    picture.addEventListener('pointerdown',event=>{if(event.button!==0)return;moved=false;if(event.pointerType==='touch'){touch={id:event.pointerId,x:event.clientX,y:event.clientY};picture.setPointerCapture(event.pointerId)}show(event.clientX,event.clientY)})
    picture.addEventListener('pointermove',event=>{if(touch&&touch.id===event.pointerId&&Math.hypot(event.clientX-touch.x,event.clientY-touch.y)>6)moved=true;show(event.clientX,event.clientY)})
    const hide=()=>{delete picture.dataset.magnifying;touch=undefined}
    picture.addEventListener('pointerleave',hide);picture.addEventListener('pointercancel',hide);picture.addEventListener('pointerup',()=>{if(touch)hide()})
    link.addEventListener('click',event=>{
      // Modified clicks retain the ordinary full-image/new-tab link.
      if(event.ctrlKey||event.metaKey||event.shiftKey||event.altKey)return
      event.preventDefault();if(moved){moved=false;return}
      opener=link;comparison.replaceChildren()
      // All three original-resolution images remain available together for comparison.
      const ordered=[card,...cards.filter(other=>other!==card)]
      ordered.forEach(item=>{
        const original=item.querySelector<HTMLImageElement>('img[data-interactive-image]')!,figure=document.createElement('figure'),photo=original.cloneNode() as HTMLImageElement,caption=document.createElement('figcaption')
        photo.src=original.currentSrc||original.src;photo.loading='eager';photo.className='raster-grade';caption.textContent=item.querySelector('h3')!.textContent
        figure.append(photo,caption);comparison.append(figure)
      })
      dialog.showModal()
    })
  })
  dialog.querySelector('[data-atlas-close]')!.addEventListener('click',()=>dialog.close())
  dialog.addEventListener('click',event=>{if(event.target===dialog){const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close()}})
  dialog.addEventListener('close',()=>{comparison.replaceChildren();opener?.focus({preventScroll:true})})
}

export function bindTimeCapsule(section:HTMLElement) {
  const range=section.querySelector<HTMLInputElement>('[data-time-range]')!,output=section.querySelector<HTMLOutputElement>('[data-time-output]')!
  const buttons=[...section.querySelectorAll<HTMLButtonElement>('[data-time-choice]')],stories=[...section.querySelectorAll<HTMLElement>('[data-time-story]')],figures=[...section.querySelectorAll<HTMLElement>('[data-time-figure]')]
  const update=(value:number)=>{
    const progress=Math.max(0,Math.min(100,value)),position=progress/100*3,lower=Math.floor(position),fraction=position-lower,current=Math.round(position)
    range.value=String(progress);section.dataset.stage=String(current)
    const text=`${Math.round(progress)}% · ${stories[current].dataset.title}`;range.setAttribute('aria-valuetext',text);output.value=text
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
  range.addEventListener('input',()=>update(Number(range.value)))
  buttons.forEach((button,i)=>{
    button.disabled=false;button.addEventListener('click',()=>update(i/3*100))
    button.addEventListener('keydown',event=>{
      const key=event.key,index=key==='Home'?0:key==='End'?3:key==='ArrowRight'?Math.min(3,i+1):key==='ArrowLeft'?Math.max(0,i-1):-1
      if(index>=0){event.preventDefault();update(index/3*100);buttons[index].focus()}
    })
  })
  range.disabled=false;update(Number(range.value));window.addEventListener('pageshow',()=>update(Number(range.value)))
}
