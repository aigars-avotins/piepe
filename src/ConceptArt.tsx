type Props = { kind: 'mycelium' | 'pores' | 'gills' | 'surfaces' | 'deadwood'; id: string; stage?: number }
const woodRing=(radius:number,seed:number)=>Array.from({length:45},(_,i)=>{
  const angle=i/44*Math.PI*2,ruffle=1+Math.sin(angle*5+seed)*.035+Math.cos(angle*9+seed)*.025
  return `${i?'L':'M'}${(167+Math.cos(angle)*radius*ruffle).toFixed(2)} ${(336+Math.sin(angle)*radius*1.42*ruffle).toFixed(2)}`
}).join(' ')+'Z'

/** Original explanatory drawings. No specimen, taxon, age or optical scale is asserted. */
export default function ConceptArt({ kind, id, stage = 0 }: Props) {
  if (kind === 'mycelium') return <svg viewBox="0 0 1000 620" aria-hidden="true" className="mycelium-drawing">
    <defs><linearGradient id={id+'-wood'} x2="1" y2=".6"><stop stopColor="#403225" /><stop offset=".5" stopColor="#282d20" /><stop offset="1" stopColor="#141f17" /></linearGradient></defs>
    <path fill={`url(#${id}-wood)`} d="M0 0H1000V620H0z" />
    <g fill="none" stroke="#9a7953" strokeWidth="1.3" opacity=".24">{Array.from({ length: 34 }, (_, i) => {
      const x = i * 33 - 30, bend = Math.sin(i * 2.3) * 28
      return <path key={i} d={`M${x} -20C${x+55} 140 ${x-45+bend} 255 ${x+15} 370S${x+35+bend} 550 ${x+10} 650`} />
    })}</g>
    <g fill="none" stroke="#171e14" strokeWidth="5" opacity=".6"><path d="M190 0q-48 102 9 203t-19 219t11 198M653 0q-27 138 14 264t-29 356M838 0q-45 110-8 240t-35 380" /></g>
    <g className="hyphae-flow" fill="none" stroke="#e6c78f" strokeLinecap="round" opacity=".76">
      <path strokeWidth="2" d="M58 602C145 531 253 550 342 439S448 241 523 192S665 136 717 67M342 439C252 385 221 339 180 239S102 98 40 77M423 328C513 319 549 389 619 386S735 318 787 275M216 523C194 457 130 434 87 394M523 192C495 108 467 108 444 37" />
      {Array.from({ length: 64 }, (_, i) => {
        const x = 70 + (i * 113) % 750, y = 75 + (i * 79) % 480
        const direction = i % 2 ? -1 : 1, length = 28 + i % 7 * 8
        return <path key={i} strokeWidth={i%4===0?1.3:.75} opacity={.38+(i%5)*.1} d={`M${x} ${y}q${length*.4} ${-length*.3} ${length} ${direction*length}m${-length*.35} ${-direction*length*.35}q${-length*.15} ${-length*.4} ${length*.1} ${-length*.7}`} />
      })}
    </g>
  </svg>

  if (kind === 'deadwood') {
    const decayed = stage > 1
    return <svg viewBox="0 0 1000 600" preserveAspectRatio="xMidYMid slice" aria-hidden="true" className="deadwood-drawing">
      <defs>
        <radialGradient id={id+'-air'} cy=".1" r="1"><stop stopColor="#354132" /><stop offset="1" stopColor="#102018" /></radialGradient>
        <linearGradient id={id+'-bark'} x2="0" y2="1"><stop stopColor="#8c805b" /><stop offset=".26" stopColor="#70593c" /><stop offset=".58" stopColor="#51412d" /><stop offset=".86" stopColor="#2c2c1e" /><stop offset="1" stopColor="#182319" /></linearGradient>
        <linearGradient id={id+'-cut'} x2="1" y2="1"><stop stopColor="#ae8e60" /><stop offset=".6" stopColor="#6e573a" /><stop offset="1" stopColor="#3f3926" /></linearGradient>
        <linearGradient id={id+'-moss'} x2="0" y2="1"><stop stopColor="#9ca671" /><stop offset="1" stopColor="#405839" /></linearGradient>
        <clipPath id={id+'-silhouette'}><path d={stage===3?'M118 378l49-35 67 5 35 23 78-19 82 21 76-35 85 25 79-30 75 23 65-17 73 42-28 48-104 8-75-24-90 28-75-11-100 21-91-27-82 13-98-29z':decayed?'M123 275l63-37 117 9 40-20 74 28 65-9 77 26 51-18 66 28 76-10 69 24 67-7 9 65-32 58-76 24-84-19-57 14-83-12-69 24-105-22-87 15-81-20-92-7-21-62z':'M158 268C340 242 609 250 834 286L854 399C651 439 385 432 171 402C107 385 105 292 158 268Z'} /></clipPath>
      </defs>
      <path fill={`url(#${id}-air)`} d="M0 0H1000V600H0z" />
      <g stroke="#627455" fill="none" opacity=".13" strokeWidth="2"><path d="M78 0q14 170-13 321M229 0q-8 188 12 309M779 0q-10 200 11 327M925 0q-14 200 5 367" /><path d="m252 0 23 246m373-246-22 295" strokeWidth="20" /></g>
      <path fill="#182b1d" d="M0 387q145-56 260 4t235-12t270 22t235-33V600H0z" />
      <ellipse cx="496" cy="438" rx="409" ry="37" fill="#09180f" opacity=".24" /><ellipse cx="496" cy="430" rx="350" ry="27" fill="#09180f" opacity=".24" />
      <g clipPath={`url(#${id}-silhouette)`}>
        <path fill={`url(#${id}-bark)`} d="M90 210H920V500H90z" />
        {Array.from({ length: 68 }, (_, i) => {
          const x=97+(i*53)%480,y=247+(i*29)%166,run=125+(i*31)%260,bend=Math.sin(i*1.7)*13
          return <path key={i} d={`M${x} ${y}q${run*.2} ${-12+bend} ${run*.47} ${bend}t${run*.53} ${9-bend}`} fill="none" stroke={i%3===0?'#c2aa75':'#211f16'} strokeWidth={i%3===0?.8:1.5} opacity={i%3===0?.4:.6} />
        })}
        {Array.from({ length: 18 }, (_, i) => { const x=174+i*37,y=266+(i*29)%87;return <path key={i} d={`M${x} ${y}q-18 9-11 21t-8 31m11-20 19-11`} fill="none" stroke="#1f2418" strokeWidth="2" opacity=".5" /> })}
        <g fill="none" stroke="#9e8958" opacity=".6"><path d="M287 298q28-21 48 2t-24 19q-25-1-24-21m9 1q13-13 25 2t-14 7q-14-1-11-9M694 331q23-18 39 2t-19 14q-23-2-20-16" strokeWidth="1.6" /></g>
        {stage===2&&<><path d="m271 248 76 28-8 118-39 21-31-36 18-70zM602 278l60-16-14 80-29 25-38-21z" fill="#0e1d13" /><path d="m359 332 17 66-13 22-12-57m365-43-29 89" fill="none" stroke="#b39863" strokeWidth="3" /></>}
        <path d={stage===0?'M209 263q61-15 113-1l-18 19-86 6z':stage===1?'M187 266q118-25 232 10t201-6l-38 35-131-5-102 13-147-11z':'M145 348q78-34 143 13t163-1t190-8t190 8l-15 27-160-7-134 28-159-20-86 15-104-29z'} fill={`url(#${id}-moss)`} opacity={stage===0?.4:.85} />
      </g>
      {stage<3&&<>
        <ellipse cx="167" cy="336" rx="48" ry="68" fill={`url(#${id}-cut)`} transform="rotate(-7 167 336)" />
        <g stroke="#493b27" fill="none" opacity=".65">{[9,17,25,33,41].map((rx,i)=><path key={rx} d={woodRing(rx,i)} transform="rotate(-7 167 336)" strokeWidth={i%2?.8:1.3} />)}<path d="m167 334-28-48m29 50 29 22m-31-19 5 57" /></g>
        {stage===2&&<path d="m139 293 30 27 21-9-15 24 22 31-29-8-13 32-4-35-23-10 23-13z" fill="#25291a" />}
      </>}
      {stage>0&&stage<3&&<g fill="#aa9870" stroke="#d2be90" strokeWidth="1.3"><path d="M493 319q29-29 52-3q-21 18-52 3m71 28q30-26 53-4q-17 20-53 4m111-29q24-21 44-5q-12 19-44 5" /></g>}
      {stage===3&&<g fill="#746343" stroke="#a49465" strokeWidth="1"><path d="m270 441 42-18 16 22-48 10zM548 441l48-20 27 29-67 13zM710 425l36-6 31 17-50 15z" /><path d="M427 416q-7-45 13-77m-4 14q-45-5-43-35q36-8 45 27m-3 16q42 0 47-32q-37-9-47 23" fill="#70875c" stroke="#a9b47e" strokeWidth="2" /></g>}
      <g fill="none" stroke="#667c4c" strokeLinecap="round" opacity=".8">
        {Array.from({ length: stage===0?8:17 }, (_, i) => { const x=85+(i*61)%860,y=450+(i%4)*12;return <path key={i} d={`M${x} ${y}q-7-27 ${i%2?14:-15}-49m${i%2?-8:9} 20-20-9m13 22 18-14`} strokeWidth={1+i%2} /> })}
      </g>
      <g fill="#6d8253" opacity=".6">{Array.from({length:stage===0?7:13},(_,i)=>{
        const x=86+i*67,y=447+(i*17)%34
        return <path key={i} d={`M${x} ${y}q-12-21-29-18q1 20 27 21m-12-11q-2-21-16-26q-7 16 13 29m14 10q9-19 28-18q-2 19-27 21`} />
      })}</g>
      <path fill="#203622" d="M0 504q91-59 207-5t203-1t262-7t328-20v129H0z" opacity=".7" />
      <g fill="#85925c" opacity=".65">{Array.from({ length: 35 }, (_, i)=><ellipse key={i} cx={37+i*28} cy={458+(i*17)%69} rx={3+i%4} ry={1.5+i%2} transform={`rotate(${i%2?28:-25} ${37+i*28} ${458+(i*17)%69})`} />)}</g>
    </svg>
  }

  return <svg viewBox="0 0 480 280" preserveAspectRatio="xMidYMid slice" aria-hidden="true" className={`surface-drawing surface-${kind}`}>
    <defs><radialGradient id={id+'-surface'} cx=".4" cy=".3" r=".9"><stop stopColor="#6d6346" /><stop offset="1" stopColor="#263628" /></radialGradient></defs>
    <path d="M0 0H480V280H0z" fill={`url(#${id}-surface)`} />
    {kind==='pores'&&<g fill="#142317" stroke="#c4b483" strokeWidth="2" opacity=".85">{Array.from({ length: 64 }, (_, i) => {
      const x=26+(i%8)*62+(Math.floor(i/8)%2)*24+Math.sin(i*3)*4,y=5+Math.floor(i/8)*42+Math.cos(i*2)*3,r=12+i%4*1.5
      return <path key={i} d={`M${x-r} ${y-r}q${r} ${-r*.6} ${r*2} 2q${r} ${r} 1 ${r*1.9}q${-r*1.3} ${r*.7} ${-r*2} -2q${-r*.8} ${-r} 0 ${-r*1.9}z`} />
    })}</g>}
    {kind==='gills'&&<g fill="none" strokeLinecap="round">{Array.from({ length: 35 }, (_, i) => {
      const x=-110+i*23,bend=(x-240)*.18
      return <path key={i} d={`M240 -28Q${x+bend} 93 ${x} 313`} stroke={i%3===0?'#ece0bb':'#ad9e76'} strokeWidth={i%3===0?4:1.7} opacity={i%3===0?.65:.5} />
    })}</g>}
    {kind==='surfaces'&&<>
      <path d="M238 24v232" stroke="#d9d6b3" strokeOpacity=".3" />
      <g fill="none" stroke="#d2c59d" opacity=".42">{Array.from({ length: 13 }, (_, i)=><path key={i} d={`M-10 ${20+i*21}q50-15 103 0t140-5`} strokeWidth={i%3===0?2:.8} />)}</g>
      <g fill="#b4a57b" stroke="#d1c49b" opacity=".8">{Array.from({ length: 30 }, (_, i)=>{const x=260+(i%5)*48,y=25+Math.floor(i/5)*47;return <path key={i} d={`M${x-7} ${y}q8-8 15 1l-6 32q-5 10-6-1z`} />})}</g>
    </>}
  </svg>
}
