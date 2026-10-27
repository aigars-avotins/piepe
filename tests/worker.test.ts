import { test } from 'node:test'
import assert from 'node:assert/strict'
import worker from '../src/worker.ts'
import { mediaSizes } from '../src/media-sizes.ts'
import { readFile, stat } from 'node:fs/promises'
const content = new TextEncoder().encode('0123456789')
const env = { ASSETS: { async fetch(request: Request) {
  return new Response(request.method === 'HEAD' ? null : content, { headers: { 'Content-Type': 'video/mp4', 'Content-Length': '10', ETag: '"forest"' } })
} } }
async function get(range?: string, extra = {}) {
  return worker.fetch(new Request('https://pie.pe/media/forest-reveal.mp4', { headers: { ...(range ? { Range: range } : {}), ...extra } }), env)
}
test('full media and HEAD preserve headers and advertise ranges', async () => {
  const full = await get(); assert.equal(full.status, 200); assert.equal(await full.text(), '0123456789'); assert.equal(full.headers.get('Accept-Ranges'), 'bytes')
  const head = await worker.fetch(new Request('https://pie.pe/media/forest-reveal.mp4', { method: 'HEAD' }), env); assert.equal(await head.text(), '')
})
test('initial, open-ended, suffix and clamped byte ranges return exact content', async () => {
  for (const [range, expected, contentRange] of [['bytes=0-1', '01', 'bytes 0-1/10'], ['bytes=7-', '789', 'bytes 7-9/10'], ['bytes=-3', '789', 'bytes 7-9/10'], ['bytes=8-99', '89', 'bytes 8-9/10']]) {
    const response = await get(range); assert.equal(response.status, 206); assert.equal(response.headers.get('Content-Range'), contentRange); assert.equal(response.headers.get('Content-Length'), String(expected.length)); assert.equal(await response.text(), expected)
  }
})
test('invalid bounds cannot produce a misleading successful response', async () => {
  for (const range of ['bytes=10-', 'bytes=6-2', 'bytes=-0', 'bytes=999999999999999999-']) { const response = await get(range); assert.equal(response.status, 416); assert.equal(response.headers.get('Content-Range'), 'bytes */10'); assert.equal(await response.text(), '') }
})
test('If-Range mismatch and unsupported multipart requests receive full media', async () => {
  for (const response of [await get('bytes=0-1', { 'If-Range': '"old-film"' }), await get('bytes=0-1,4-5')]) { assert.equal(response.status, 200); assert.equal(await response.text(), '0123456789') }
})
test('a matching If-Range receives partial content and missing assets remain 404', async () => {
  assert.equal((await get('bytes=0-1', { 'If-Range': '"forest"' })).status, 206)
  const missing = await worker.fetch(new Request('https://pie.pe/media/missing.mp4'), { ASSETS: { async fetch() { return new Response(null, { status: 404 }) } } }); assert.equal(missing.status, 404)
})


test('tiny ranges consume bounded chunks and cancel the upstream body', async () => {
  let reads = 0, cancelled = false
  const total = 1024 * 1024 * 10
  const response = await worker.fetch(new Request('https://pie.pe/media/forest-reveal.mp4', { headers: { Range: 'bytes=0-1023' } }), { ASSETS: { async fetch() {
    return new Response(new ReadableStream({ pull(controller) { reads++; controller.enqueue(new Uint8Array(65536).fill(7)) }, cancel() { cancelled = true } }), { headers: { 'Content-Length': String(total) } })
  } } })
  const bytes = new Uint8Array(await response.arrayBuffer())
  assert.equal(bytes.byteLength, 1024); assert.equal(bytes[1023], 7); assert.ok(reads <= 2); assert.equal(cancelled, true)
})
test('asset subrequests are range-free and non-200 responses pass through', async () => {
  const response = await worker.fetch(new Request('https://pie.pe/media/forest-reveal.mp4', { headers: { Range: 'bytes=0-1' } }), { ASSETS: { async fetch(request) {
    assert.equal(request.headers.get('Range'), null)
    assert.equal(request.headers.get('If-Range'), null)
    return new Response('01', { status: 206, headers: { 'Content-Range': 'bytes 0-1/10', 'Content-Length': '2' } })
  } } }); assert.equal(response.status, 206); assert.equal(await response.text(), '01')
})
test('unknown-size streams fall back to a legal full response', async () => {
  const response = await worker.fetch(new Request('https://pie.pe/media/unknown.mp4', { headers: { Range: 'bytes=-2' } }), { ASSETS: { async fetch() { return new Response('0123456789') } } })
  assert.equal(response.status, 200); assert.equal(await response.text(), '0123456789')
})

test('Cloudflare-style missing Content-Length still supports suffix and invalid ranges for known media', async () => {
  const bytes = await readFile('public/media/forest-reveal.mp4')
  const noLength = { ASSETS: { async fetch() { return new Response(bytes) } } }
  const suffix = await worker.fetch(new Request('https://pie.pe/media/forest-reveal.mp4', {headers:{Range:'bytes=-512'}}), noLength)
  assert.equal(suffix.status,206); assert.equal(suffix.headers.get('Content-Range'),`bytes ${bytes.length-512}-${bytes.length-1}/${bytes.length}`)
  assert.deepEqual(Buffer.from(await suffix.arrayBuffer()),bytes.subarray(-512))
  const invalid = await worker.fetch(new Request('https://pie.pe/media/forest-reveal.mp4',{headers:{Range:`bytes=${bytes.length}-`}}),noLength)
  assert.equal(invalid.status,416)
})
test('build-time size metadata exactly matches the public media files', async () => {
  for (const [path,size] of Object.entries(mediaSizes)) assert.equal((await stat('public'+path)).size,size)
})
