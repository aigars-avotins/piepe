import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { createHash } from 'node:crypto'
import { wallpaperAsset, wallpaperDesigns } from '../src/wallpapers.ts'

function jpegDimensions(bytes:Buffer) {
  assert.equal(bytes.readUInt16BE(0),0xffd8)
  for(let offset=2;offset<bytes.length;){
    assert.equal(bytes[offset++],0xff)
    while(bytes[offset]===0xff)offset++
    const marker=bytes[offset++],length=bytes.readUInt16BE(offset)
    if([0xc0,0xc1,0xc2].includes(marker))return {width:bytes.readUInt16BE(offset+5),height:bytes.readUInt16BE(offset+3)}
    offset+=length
  }
  throw Error('Missing real JPEG frame dimensions')
}

test('four separately authored wallpaper originals and high-quality exports retain accurate dimensions and hashes',async()=>{
  const manifest=JSON.parse(await readFile('docs/qa/v311/wallpapers.json','utf8'))
  assert.equal(manifest.length,4);const originals=new Set<string>()
  for(const design of wallpaperDesigns)for(const device of ['desktop','mobile'] as const){
    const asset=wallpaperAsset(design.id,device),row=manifest.find((r:{design:string;device:string})=>r.design===design.id&&r.device===device)
    const png=await readFile('public'+asset.original),jpg=await readFile('public'+asset.url),webp=await readFile('public'+asset.preview)
    assert.equal(png.subarray(1,4).toString(),'PNG')
    assert.deepEqual({width:png.readUInt32BE(16),height:png.readUInt32BE(20)},{width:asset.originalWidth,height:asset.originalHeight})
    assert.deepEqual(jpegDimensions(jpg),device==='desktop'?{width:5120,height:2880}:{width:1440,height:3120})
    assert.equal(webp.toString('ascii',0,4),'RIFF');assert.equal(webp.toString('ascii',8,12),'WEBP')
    for(const [key,bytes]of [['original',png],['download',jpg],['preview',webp]] as const){assert.equal(bytes.length,row[key].bytes);assert.equal(createHash('sha256').update(bytes).digest('hex'),row[key].sha256)}
    originals.add(row.original.sha256)
  }
  assert.equal(originals.size,4)
})
