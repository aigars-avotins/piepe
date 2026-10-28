from pathlib import Path
import hashlib,json,subprocess,time
import argparse
parser=argparse.ArgumentParser(description='Offline review candidates; never overwrites source or public assets.')
parser.add_argument('--out',default='review-results/v23-encodes')
args=parser.parse_args()
repo=Path(__file__).resolve().parents[1];q=(repo/args.out).resolve();out=q/'candidates';out.mkdir(parents=True,exist_ok=True)
expected={'reveal':'b6532f81fe9fe067dbf3f5f035fdbbd94928dd62','awakening':'88fd1cef74de6abd57bd15c8d456e2ee857325d7','understory':'156f5401893f2690a02aa4b35b36edff3cc89507','breathing':'d08ed1d04652b5abe4cd8e34a3c5cb3879357385'}
manifest=[]
for shot,blob in expected.items():
 source=repo/f'source/forest-{shot}-original.mp4';actual=subprocess.check_output(['git','hash-object',str(source)],cwd=repo,text=True).strip();assert actual==blob
 probe=json.loads(subprocess.check_output(['ffprobe','-v','error','-select_streams','v:0','-show_streams','-show_format','-of','json',str(source)],text=True));entry={'shot':shot,'source':str(source.relative_to(repo)),'blob':actual,'sha256':hashlib.sha256(source.read_bytes()).hexdigest(),'probe':probe,'candidates':[]}
 for crf,tune in [(16,'grain'),(18,'grain'),(20,'film')]:
  output=out/f'forest-{shot}-crf{crf}.mp4';filters='zscale=dither=error_diffusion,format=yuv420p,setsar=1' if shot=='reveal' else 'crop=1900:988:48:24,format=yuv420p,setsar=1' if shot=='understory' else 'format=yuv420p,setsar=1'
  command=['ffmpeg','-v','warning','-y','-threads','2','-i',str(source),'-map','0:v:0','-an','-vf',filters,'-c:v','libx264','-preset','slow','-tune',tune,'-crf',str(crf),'-profile:v','high','-level:v','4.1','-g','48','-keyint_min','24','-pix_fmt','yuv420p','-colorspace','bt709','-color_primaries','bt709','-color_trc','bt709','-color_range','tv','-movflags','+faststart','-threads','2',str(output)]
  start=time.monotonic();subprocess.run(command,check=True,stdout=subprocess.DEVNULL,stderr=(out/f'{shot}-crf{crf}.log').open('w'));row={'crf':crf,'tune':tune,'file':str(output),'bytes':output.stat().st_size,'secondsToEncode':round(time.monotonic()-start,2),'command':command};entry['candidates'].append(row);print(shot,'CRF',crf,tune,round(row['bytes']/1e6,2),'MB',flush=True)
 manifest.append(entry);(q/'encode-manifest.json').write_text(json.dumps(manifest,indent=2))
print('All four original blob hashes verified; 12 independent high-fidelity candidates encoded',flush=True)
