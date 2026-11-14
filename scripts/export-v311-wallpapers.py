"""Export the four new, retained generated originals. Never infer native 5K detail.
One-time offline artwork preparation; not a runtime/build dependency.
"""
from pathlib import Path
import hashlib,json
from PIL import Image,ImageOps,ImageCms
root=Path(__file__).resolve().parents[1];assets=root/'public/wallpapers';manifest=[]
profile=ImageCms.ImageCmsProfile(ImageCms.createProfile('sRGB')).tobytes()
for design in ['ancient-forest','hidden-forest']:
 for device,size,preview in [('desktop',(5120,2880),(800,450)),('mobile',(1440,3120),(369,800))]:
  source=assets/'originals'/f'piepe-{design}-{device}-original.png';image=Image.open(source).convert('RGB')
  final=assets/f'piepe-{design}-{device}-{size[0]}x{size[1]}.jpg';thumb=assets/'previews'/f'{design}-{device}.webp'
  exif=Image.Exif();exif[270]=f'PIE.PE AI artwork: {design}, dedicated {device} composition. Enlarged export from {image.width}x{image.height}; dimensions do not denote native captured detail.';exif[305]='PIE.PE wallpaper export'
  ImageOps.fit(image,size,method=Image.Resampling.LANCZOS).save(final,quality=97,subsampling=0,optimize=True,progressive=True,icc_profile=profile,exif=exif)
  ImageOps.fit(image,preview,method=Image.Resampling.LANCZOS).save(thumb,quality=92,method=6,icc_profile=profile)
  def info(p):
   im=Image.open(p);return{'url':'/'+p.relative_to(root/'public').as_posix(),'width':im.width,'height':im.height,'bytes':p.stat().st_size,'sha256':hashlib.sha256(p.read_bytes()).hexdigest()}
  manifest.append({'design':design,'device':device,'provenance':'New OpenAI image generation, separately authored desktop/mobile compositions, 2026-11-14','original':info(source),'download':info(final),'preview':info(thumb),'export':'High-quality Lanczos enlargement, JPEG97, 4:4:4, sRGB. No invented native-5K or optical-detail claim. Original PNG bytes retained.'})
(root/'docs/qa/v311/wallpapers.json').write_text(json.dumps(manifest,indent=2)+'\n')
print(json.dumps([{'design':x['design'],'device':x['device'],'original':[x['original']['width'],x['original']['height']],'download':[x['download']['width'],x['download']['height']],'bytes':x['download']['bytes']}for x in manifest],indent=2))
