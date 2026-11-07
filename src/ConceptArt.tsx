import { artAssets } from './experienceArtAssets'
type Props = { kind: 'mycelium' | 'pores' | 'gills' | 'surfaces' | 'deadwood'; id: string; stage?: number }
const f=(v:number)=>v.toFixed(1)
const noise=(i:number)=>{const v=Math.sin(i*127.1+311.7)*43758.5453;return v-Math.floor(v)}
function branches() {
  const paths:string[][]=Array.from({length:7},()=>[])
  function grow(x:number,y:number,angle:number,length:number,depth:number,seed:number) {
    const ex=x+Math.cos(angle)*length,ey=y+Math.sin(angle)*length,bend=(noise(seed)-.5)*length*.6
    paths[depth].push(`M${f(x)} ${f(y)}Q${f((x+ex)/2+bend)} ${f((y+ey)/2-bend)} ${f(ex)} ${f(ey)}`)
    if(depth>0){grow(ex,ey,angle+(noise(seed+1)-.55)*.9,length*.73,depth-1,seed*2+3);grow(ex,ey,angle+(noise(seed+2)-.45)*1.9,length*.64,depth-1,seed*2+7)}
  }
  grow(160,660,-1.1,190,6,7);grow(700,660,-2,175,6,41);grow(1040,130,2.7,170,6,29);grow(-30,260,.2,155,6,19)
  return paths.map(p=>p.join(''))
}
const hyphae=branches()
/** Material studies, never specimen photography, measured anatomy or natural luminescence. */
export function MyceliumArt({id}:{id:string}) {
  return <svg viewBox="0 0 1000 620" preserveAspectRatio="xMidYMid slice" aria-hidden="true" className="mycelium-drawing">
    <defs><linearGradient id={id+'-shade'} x2=".8" y2="1"><stop stopColor="#0d1b12" stopOpacity=".28"/><stop offset=".5" stopColor="#251d13" stopOpacity=".12"/><stop offset="1" stopColor="#0a140e" stopOpacity=".8"/></linearGradient></defs>
    <image href={artAssets.bark} width="1000" height="620" preserveAspectRatio="xMidYMid slice"/>
    <path d="M0 0H1000V620H0Z" fill={`url(#${id}-shade)`}/>
    <g fill="none" stroke="#0e170e" strokeWidth="1.4" opacity=".17">{Array.from({length:16},(_,i)=><path key={i} d={`M${i*73-30} -30q-40 160 5 290t-14 400`}/>)}</g>
    <g fill="none" strokeLinecap="round" className="hyphae-flow">{hyphae.map((d,i)=><g key={i}><path d={d} stroke="#080f08" strokeWidth={1.6+i*.5} transform="translate(1.2 2)" opacity=".7"/><path d={d} stroke={i>3?'#e8d5ac':'#c7b88c'} strokeWidth={.55+i*.28} opacity={.53+i*.07}/></g>)}</g>
  </svg>
}
export function SurfaceArt({kind,id}:{kind:'pores'|'gills'|'surfaces';id:string}) {
  return <svg viewBox="0 0 1100 720" preserveAspectRatio="xMidYMid slice" aria-hidden="true" className={`surface-drawing surface-${kind}`}>
    <defs>
      <radialGradient id={id+'-base'} cx=".25" cy=".1" r="1"><stop stopColor="#c3aa72"/><stop offset=".45" stopColor="#8a7750"/><stop offset="1" stopColor="#283022"/></radialGradient>
      <linearGradient id={id+'-lip'} x2=".8" y2="1"><stop stopColor="#edddb1"/><stop offset=".35" stopColor="#c3a972"/><stop offset=".65" stopColor="#786542"/><stop offset="1" stopColor="#242d1e"/></linearGradient>
      <radialGradient id={id+'-hole'} cx=".5" cy=".65"><stop stopColor="#161d13"/><stop offset=".65" stopColor="#292c1b"/><stop offset="1" stopColor="#695737"/></radialGradient>
      <linearGradient id={id+'-gill'}><stop stopColor="#24291a"/><stop offset=".32" stopColor="#84704b"/><stop offset=".6" stopColor="#e8d4a3"/><stop offset=".72" stopColor="#bca06b"/><stop offset="1" stopColor="#42452c"/></linearGradient>
      <pattern id={id+'-grain'} width="17" height="19" patternUnits="userSpaceOnUse"><path d="m2 4 1-1m8 8 1-1m-7 6 1-1" stroke="#eee0b5" strokeOpacity=".14"/><circle cx="14" cy="3" r=".7" fill="#282d1c" fillOpacity=".22"/></pattern>
      <radialGradient id={id+'-light'} cx=".3" cy="0" r="1"><stop stopColor="#e4d3a4" stopOpacity=".08"/><stop offset="1" stopColor="#07170f" stopOpacity=".6"/></radialGradient>
    </defs>
    <path d="M0 0H1100V720H0Z" fill={`url(#${id}-base)`}/>
    {kind==='pores'&&Array.from({length:88},(_,i)=>{
      const row=Math.floor(i/11),x=(i%11)*112+(row%2)*48-15+(noise(i)-.5)*21,y=row*103-10+(noise(i+88)-.5)*17,rx=32+noise(i+20)*15,ry=37+noise(i+30)*14
      const shape=`M${f(x-rx)} ${f(y-ry*.3)}Q${f(x-rx*.8)} ${f(y-ry*1.2)} ${f(x+rx*.2)} ${f(y-ry)}Q${f(x+rx*1.1)} ${f(y-ry*.7)} ${f(x+rx)} ${f(y+ry*.2)}Q${f(x+rx*.8)} ${f(y+ry)} ${f(x-rx*.15)} ${f(y+ry)}Q${f(x-rx*1.1)} ${f(y+ry*.7)} ${f(x-rx)} ${f(y-ry*.3)}Z`
      return <g key={i}><path d={shape} fill="#293020" stroke="#393622" strokeWidth="15" transform="translate(4 8)"/><path d={shape} fill={`url(#${id}-hole)`} stroke={`url(#${id}-lip)`} strokeWidth="9"/><path d={shape} fill="none" stroke="#e6d2a2" strokeWidth="1.4" opacity=".45" transform="translate(-1 -2)"/></g>
    })}
    {kind==='gills'&&Array.from({length:36},(_,i)=>{
      const x=-200+i*44,b=(x-500)*.22,w=8+noise(i)*13
      return <path key={i} d={`M460 -140Q${f(x+b)} 230 ${x} 810L${f(x+w)} 810Q${f(x+b+w)} 240 ${f(465+w*.2)} -140Z`} fill={`url(#${id}-gill)`} stroke="#292d1e" strokeWidth="3"/>
    })}
    {kind==='surfaces'&&<>
      <path d="M550 0V720" stroke="#18271a" strokeWidth="22"/>
      <g fill="none" stroke="#e0cca0" opacity=".23">{Array.from({length:40},(_,i)=><path key={i} d={`M-50 ${i*21}q140-40 270-7t330-23`} strokeWidth={i%4===0?2:.7}/>)}</g>
      {Array.from({length:42},(_,i)=>{
        const x=590+(i%6)*94+(noise(i)-.5)*25,y=Math.floor(i/6)*119-40,l=75+noise(i+13)*48,w=15+noise(i+8)*11
        return <g key={i}><path d={`M${x-w} ${y}q${w} -18 ${w*2} 1q-2 ${l*.6} ${-w*.6} ${l}q-7 13-12-4Z`} fill="#1b2418" opacity=".55" transform="translate(12 13)"/><path d={`M${x-w} ${y}q${w} -18 ${w*2} 1q-2 ${l*.6} ${-w*.6} ${l}q-7 13-12-4Z`} fill={`url(#${id}-lip)`}/></g>
      })}
    </>}
    <path d="M0 0H1100V720H0Z" fill={`url(#${id}-grain)`}/><path d="M0 0H1100V720H0Z" fill={`url(#${id}-light)`}/>
  </svg>
}
const logShapes=[
  'M205 319C419 273 735 282 1014 327Q1045 377 1048 461C804 502 491 508 222 474C136 461 129 349 205 319Z',
  'M205 321Q260 306 287 313T354 310Q384 297 421 304T499 310Q545 297 577 307T662 318Q720 307 749 315T831 326Q904 315 948 324T1017 337Q1040 390 1040 449Q1020 481 981 478T894 482Q841 499 811 490T697 484Q632 502 593 493T491 490Q424 500 380 491T287 481Q242 490 212 477Q156 445 165 366Z',
  'M181 367Q224 338 248 343T307 356Q365 323 388 342T451 368Q499 345 534 360T611 370Q672 334 694 354T760 372Q811 346 842 363T920 377Q980 358 1003 373Q1041 398 1017 431T976 468Q914 489 887 479T815 478Q747 499 720 489T627 486Q564 508 534 497T433 491Q382 507 357 494T271 484Q217 493 197 477Q144 448 162 409Z',
  'M157 449Q202 422 217 428T287 447Q332 417 348 431T400 460Q454 427 469 444T550 463Q609 425 629 443T694 467Q754 433 777 450T844 468Q899 440 916 450T1007 471L978 497Q921 519 877 508T792 500Q722 527 698 516T602 507Q543 525 516 519T419 507Q361 527 331 515T242 506Q203 518 178 501Z',
]
export function DeadwoodArt({id,stage=0}:{id:string;stage?:number}) {
  return <svg viewBox="0 0 1200 675" preserveAspectRatio="xMidYMid slice" aria-hidden="true" className="deadwood-drawing">
    <defs>
      <linearGradient id={id+'-air'} x2="0" y2="1"><stop stopColor="#10251b" stopOpacity=".3"/><stop offset="1" stopColor="#0b1c12" stopOpacity=".7"/></linearGradient>
      <linearGradient id={id+'-round'} x2="0" y2="1"><stop stopColor="#cead76" stopOpacity=".35"/><stop offset=".25" stopColor="#d8bf82" stopOpacity=".1"/><stop offset=".75" stopColor="#102013" stopOpacity=".5"/><stop offset="1" stopColor="#06160d" stopOpacity=".9"/></linearGradient>
      <linearGradient id={id+'-cut'} x2=".8" y2="1"><stop stopColor="#c8ad76"/><stop offset=".5" stopColor="#a08556"/><stop offset="1" stopColor="#49442b"/></linearGradient>
      <linearGradient id={id+'-caption'} x2="0" y2="1"><stop stopColor="#0a1b12" stopOpacity="0"/><stop offset="1" stopColor="#0a1b12" stopOpacity=".95"/></linearGradient>
      <linearGradient id={id+'-ground'} x2="0" y2="1"><stop stopColor="white" stopOpacity="0"/><stop offset=".36" stopColor="white"/></linearGradient><mask id={id+'-ground-mask'}><path d="M0 360H1200V700H0Z" fill={`url(#${id}-ground)`}/></mask><radialGradient id={id+'-shadow'}><stop stopColor="#06130a" stopOpacity=".85"/><stop offset="1" stopColor="#06130a" stopOpacity="0"/></radialGradient>
      <clipPath id={id+'-moss-edge'}><path d={stage===1?'M160 311Q220 293 290 315T430 308T580 319T730 310T880 320T1060 328L1060 342Q980 332 920 348T770 339T620 349T480 336T340 348T160 337Z':'M150 355Q208 330 271 354T395 341T520 358T660 347T794 368T920 354T1060 371L1060 394Q990 406 929 392T805 405T680 391T550 410T410 391T280 414T150 395Z'}/></clipPath>
      <clipPath id={id+'-log'}><path d={logShapes[stage]}/></clipPath>
    </defs>
    <image href={artAssets.habitat} width="1200" height="675" preserveAspectRatio="xMidYMid slice"/>
    <path d="M0 0H1200V675H0Z" fill={`url(#${id}-air)`}/>
    <image href={artAssets.moss} y="360" width="1200" height="340" preserveAspectRatio="xMidYMid slice" mask={`url(#${id}-ground-mask)`}/>
    <ellipse cx="600" cy="487" rx="510" ry="80" fill={`url(#${id}-shadow)`}/>
    <g clipPath={`url(#${id}-log)`}><image href={artAssets.bark} x="145" y="280" width="920" height="245" preserveAspectRatio="none"/><path d="M100 260H1100V530H100Z" fill={`url(#${id}-round)`}/>
      <g fill="none" stroke="#151e12" opacity=".6">{Array.from({length:stage===0?8:24},(_,i)=>{
        const x=200+noise(i)*800,y=323+noise(i+6)*125
        return <path key={i} d={`M${x} ${y}q${20+noise(i+3)*30} -8 14 9t19 11m-15-7q-7 12 1 23`} strokeWidth={.7+noise(i+4)*2.5}/>
      })}</g>
      {stage===2&&<g fill="#0b1b10" stroke="#796d46" strokeWidth="2"><path d="M291 377q25-29 47-4t-4 49q-19 16-39-3t-4-42ZM625 378q29-30 52-7t13 46q-8 24-37 16t-28-55ZM855 399q18-26 36-13t8 35q-11 16-30 4t-14-26Z"/></g>}
      {stage>0&&<g opacity=".85"><image href={artAssets.moss} x="160" y={stage===1?298:326} width="880" height={stage===1?55:100} preserveAspectRatio="xMidYMid slice" clipPath={`url(#${id}-moss-edge)`}/></g>}

    </g>
    {stage<3&&<g transform="rotate(-8 218 400)"><ellipse cx="218" cy="400" rx="58" ry={stage===2?62:78} fill={`url(#${id}-cut)`}/><g fill="none" stroke="#57462b" opacity=".7">{[10,20,29,38,47,54].map((r,i)=><path key={r} d={Array.from({length:49},(_,j)=>{const a=j/48*Math.PI*2,v=r*(1+.035*Math.sin(a*5+i)+.022*Math.cos(a*7));return `${j?'L':'M'}${f(218+Math.cos(a)*v)} ${f(400+Math.sin(a)*v*(stage===2?1.04:1.34))}`}).join(' ')+'Z'} strokeWidth={i%2?.9:1.4}/>)}<path d="m218 401-33-57m33 57 30 25m-31-25 10 66" strokeWidth="3"/></g>{stage===2&&<path d="M183 374q19-19 30-7t23 17q14 5-1 19t-9 31q-14 4-20-9t-21-12q-14-17-2-39Z" fill="#152419"/>}</g>}
    {stage>0&&stage<3&&<g fill={`url(#${id}-cut)`} stroke="#dac18d" strokeWidth="1.2">{[0,1,2,3,4].map(i=><path key={i} d={`M${490+i*85} ${369+i%2*48}q9-18 24-17t28 14q-23 19-52 3Z`}/>)}</g>}
    {stage>1&&<g fill="none" stroke="#8b9b5b" strokeLinecap="round">{Array.from({length:110},(_,i)=>{const x=210+noise(i)*775,y=stage===3?447+noise(i+8)*36:348+noise(i+8)*46;return <path key={i} d={`M${x} ${y}q-6-12 1-23m-2 11-8-5m9-1 8-5m-7-2-6-4`} strokeWidth={.7+i%2*.7}/>})}</g>}
    {stage===3&&<><g fill="#7f6c47" stroke="#b3a073" strokeWidth="2"><path d="m238 514 46-25 37 23-62 23ZM445 522l60-32 37 20-71 35ZM739 508l46-29 45 29-62 22Z"/></g><path d="M664 463q-13-55 6-100m-5 27q-55-3-56-41q46-12 58 32m1 22q51-3 63-39q-40-15-64 28" fill="#738b50" stroke="#b0bd7c" strokeWidth="3"/></>}
    <path d="M0 520H1200V675H0Z" fill={`url(#${id}-caption)`}/>
  </svg>
}
export default function ConceptArt({kind,id,stage=0}:Props) {
  return kind==='mycelium'?<MyceliumArt id={id}/>:kind==='deadwood'?<DeadwoodArt id={id} stage={stage}/>:<SurfaceArt kind={kind} id={id}/>
}
