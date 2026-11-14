import type { Locale } from './i18n'

export const wallpaperDesigns = [
  { id:'ancient-forest', title:{lv:'Senā meža gaisma',en:'Light of the ancient forest'}, description:{lv:'Silta gaisma uz veca ozola mizas. Piepes un sūnas paliek klusas meža daļas.',en:'Warm light on an old oak. Bracket fungi and moss remain quiet parts of the forest.'}, desktopAlt:{lv:'Sena ozola stumbrs ar brūnām piepēm un sūnām labajā malā, silti saules stari meža dziļumā',en:'An old oak with brown bracket fungi and moss on the right, warm sunlight reaching into the forest'}, mobileAlt:{lv:'Vertikāls skats uz sūnainu ozola stumbru un trim piepēm zem lapotnes',en:'A vertical view of a mossed oak trunk and three bracket fungi beneath its canopy'} },
  { id:'hidden-forest', title:{lv:'Apslēptā meža pasaule',en:'The hidden forest'}, description:{lv:'Rasa sūnās un gaiši sēņotnes pavedieni koksnes plaisās. Tuvs skats meža otrajā dzīvē.',en:'Dew on moss and pale mycelial threads in cracks in the wood. An intimate view of the forest’s second life.'}, desktopAlt:{lv:'Makro kompozīcija ar rasotām sūnām un gaišiem sēņotnes pavedieniem uz kritalas',en:'A macro composition of dewy moss and pale mycelial threads on decaying wood'}, mobileAlt:{lv:'Vertikāla sūnainas saknes kompozīcija ar gaišiem pavedieniem un mierīgu zaļu fonu augšā',en:'A vertical mossed root with pale threads and a quiet green background above'} },
] as const

export function wallpaperAsset(design:typeof wallpaperDesigns[number]['id'],device:'desktop'|'mobile') {
  const width=device==='desktop'?5120:1440,height=device==='desktop'?2880:3120
  return {width,height,url:`/wallpapers/piepe-${design}-${device}-${width}x${height}.jpg`,preview:`/wallpapers/previews/${design}-${device}.webp`,original:`/wallpapers/originals/piepe-${design}-${device}-original.png`,originalWidth:device==='desktop'?1672:852,originalHeight:device==='desktop'?941:1846,previewWidth:device==='desktop'?800:369,previewHeight:device==='desktop'?450:800}
}
export const wallpaperLabels:Record<Locale,{original:string;originalSize:string;newDesigns:string}>={
  lv:{original:'Ģenerētais oriģināls · PNG',originalSize:'Oriģināls',newDesigns:'Divi jauni skatieni mežā'},
  en:{original:'Generated original · PNG',originalSize:'Original',newDesigns:'Two new views of the forest'},
}
