import { test } from 'node:test'
import assert from 'node:assert/strict'
import worker from '../src/worker.ts'
const content = new TextEncoder().encode('0123456789')
const env = { ASSETS: { async fetch(request: Request) {
  assert.equal(request.headers.has('Range'), false)
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
