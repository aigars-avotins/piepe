"""Prepare the licensed birds recording as a quiet, sample-continuous loop. Requires FFmpeg.
Usage: python3 scripts/forest-audio.py /path/to/blanket/data/resources/sounds/birds.ogg
Source/license are pinned in public/audio/CREDITS.txt. No external code is executed.
"""
from array import array
from pathlib import Path
import argparse
import subprocess

parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('source', type=Path)
args = parser.parse_args()
rate, channels, seconds, fade = 32000, 2, 66, 3
pcm = subprocess.run(['ffmpeg', '-v', 'error', '-i', str(args.source), '-t', str(seconds), '-ar', str(rate), '-ac', str(channels), '-f', 'f32le', '-'], check=True, capture_output=True).stdout
samples = array('f'); samples.frombytes(pcm)
n = rate * channels
if len(samples) < seconds * n:
    raise SystemExit('Source is too short for the selected loop')
head, body, tail = samples[:fade*n], samples[fade*n:(seconds-fade)*n], samples[(seconds-fade)*n:seconds*n]
seam = array('f', (tail[i] * (1-i/(len(tail)-1)) + head[i] * i/(len(tail)-1) for i in range(len(tail))))
body.extend(seam)
output = Path(__file__).resolve().parent.parent / 'public/audio/forest-ambience.mp3'
output.parent.mkdir(exist_ok=True)
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 'f32le', '-ar', str(rate), '-ac', str(channels), '-i', '-', '-af', 'highpass=f=100,lowpass=f=10000,volume=2', '-c:a', 'libmp3lame', '-b:a', '64k', str(output)], input=body.tobytes(), check=True)
print(f'Prepared {len(body)/n:.1f}s loop, {output.stat().st_size} bytes; maximum boundary sample step {max(abs(body[-channels+c]-body[c]) for c in range(channels)):.6f}')
