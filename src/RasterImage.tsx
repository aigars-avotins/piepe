// Owner-supplied JPEGs retain their original bytes. WebP is supported on missing-file fallback.
export default function RasterImage({name,alt='',className='',width=2752,height=1536}:{name:string;alt?:string;className?:string;width?:number;height?:number}) {
  return <img draggable={false} className={className} src={`/images/interactive/${name}.jpg`} data-interactive-image data-alternate-src={`/images/interactive/${name}.webp`} data-fallback-src="/wallpapers/previews/desktop.webp" alt={alt} width={width} height={height} loading="lazy" decoding="async" />
}
