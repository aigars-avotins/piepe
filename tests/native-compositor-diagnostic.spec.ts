// Temporary causal diagnostic: measurements only, not release-validation passes.
import {test,expect}from'@playwright/test'
import{activateNativePage}from'./nativeDiagnostics'
for(const [name,dpr,style]of[
 ['stock-1x',1,''],['stock-2x',2,''],['promote-2x',2,'.motion-clip>video{transform:translateZ(0)}'],['isolate-2x',2,'.motion-clip{isolation:isolate}.motion-clip>video{transform:translateZ(0)}'],
]as const)test(`native compositor causal observation ${name}`,async({browser},info)=>{
 test.skip(process.platform!=='darwin','Causal native AVFoundation diagnostic only; never a substitute for the strict release tests.')
 test.setTimeout(30000)
 const context=await browser.newContext({viewport:{width:1512,height:982},screen:{width:1512,height:982},deviceScaleFactor:dpr,isMobile:false})
 try{
 const page=await context.newPage();await activateNativePage(page,info)
 await page.addInitScript(()=>sessionStorage.setItem('piepe-entered','1'))
 await page.goto('/en/#understory');if(style)await page.addStyleTag({content:style})
 const layer=page.locator('[data-clip="understory"]');await expect(layer).toHaveAttribute('data-clip-ready','true');await expect(layer).toHaveCSS('opacity','1')
 const sample=async()=>layer.locator('video').evaluate(async(v:HTMLVideoElement)=>{
  const frames:{at:number;media:number;presented:number}[]=[],rafs:number[]=[],start=performance.now();let request=0,raf=0,old=start
  const onFrame:VideoFrameRequestCallback=(now,m)=>{frames.push({at:now-start,media:m.mediaTime,presented:m.presentedFrames});request=v.requestVideoFrameCallback(onFrame)}
  const paint=(now:number)=>{rafs.push(now-old);old=now;raf=requestAnimationFrame(paint)}
  request=v.requestVideoFrameCallback(onFrame);raf=requestAnimationFrame(paint)
  await new Promise(resolve=>setTimeout(resolve,2500));v.cancelVideoFrameCallback(request);cancelAnimationFrame(raf)
  return{frames,rafs,now:performance.now()-start,time:v.currentTime,decoded:v.getVideoPlaybackQuality().totalVideoFrames,dimensions:[v.videoWidth,v.videoHeight],paused:v.paused,ready:v.readyState,focus:document.hasFocus(),visibility:document.visibilityState,cycles:v.parentElement?.dataset.clipCycles}
 })
 const initial=await sample(),after=await sample();await info.attach('native-compositor-observation',{body:JSON.stringify({name,dpr,style,initial,after}),contentType:'application/json'})
 expect(initial.dimensions).toEqual([1920,1080]);expect(initial.ready).toBeGreaterThanOrEqual(2)
 // Intentional readback, then observe its effect without changing playback.
 await page.screenshot({clip:{x:968,y:422,width:128,height:72},scale:'css'})
 const afterCapture=await sample();await info.attach('native-after-capture',{body:JSON.stringify(afterCapture),contentType:'application/json'})
 }finally{await context.close()}
})
