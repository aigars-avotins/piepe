// Only /media/* runs this handler. Other files use Workers Static Assets directly.
interface Environment { ASSETS: { fetch(request: Request): Promise<Response> } }

/** Retains at most a source chunk; cancels upstream as soon as the range is complete. */
function sliceStream(body: ReadableStream<Uint8Array>, start: number, end: number) {
  const reader = body.getReader()
  let position = 0
  return new ReadableStream<Uint8Array>({
    async pull(controller) {
      try {
        while (true) {
          const { value, done } = await reader.read()
          if (done) { controller.error(new Error('Media ended before its advertised range')); return }
          const from = Math.max(0, start - position)
          const to = Math.min(value.byteLength, end + 1 - position)
          position += value.byteLength
          if (to > from) controller.enqueue(value.subarray(from, to))
          if (position > end) { controller.close(); await reader.cancel(); return }
          if (to > from) return
        }
      } catch (error) { controller.error(error) }
    },
    cancel(reason) { return reader.cancel(reason) },
  })
}

export default {
  async fetch(request: Request, env: Environment): Promise<Response> {
    // Prefer the platform's native range response if/when supported by the binding.
    const asset = await env.ASSETS.fetch(request)
    if (asset.status !== 200) return asset
    const headers = new Headers(asset.headers)
    headers.set('Accept-Ranges', 'bytes')
    const full = () => new Response(asset.body, { status: 200, headers })
    const range = request.headers.get('Range')
    if (!range || request.method !== 'GET' || !asset.body) return full()
    const match = /^bytes=(\d*)-(\d*)$/.exec(range)
    if (!match || (!match[1] && !match[2])) return full()
    const ifRange = request.headers.get('If-Range')
    if (ifRange && ifRange !== asset.headers.get('ETag') && ifRange !== asset.headers.get('Last-Modified')) return full()
    const lengthHeader = asset.headers.get('Content-Length')
    const length = Number(lengthHeader)
    // Unknown-size streams can legally ignore Range; never buffer the whole media to discover its length.
    if (!lengthHeader || !Number.isSafeInteger(length) || length < 0) return full()
    const start = match[1] ? Number(match[1]) : Math.max(0, length - Number(match[2]))
    const end = match[1] ? (match[2] ? Math.min(Number(match[2]), length - 1) : length - 1) : length - 1
    if (!Number.isSafeInteger(start) || !Number.isSafeInteger(end) || start >= length || start > end || (!match[1] && Number(match[2]) === 0)) {
      await asset.body.cancel()
      headers.set('Content-Range', `bytes */${length}`); headers.set('Content-Length', '0')
      return new Response(null, { status: 416, headers })
    }
    headers.set('Content-Range', `bytes ${start}-${end}/${length}`)
    headers.set('Content-Length', String(end - start + 1))
    return new Response(sliceStream(asset.body, start, end), { status: 206, headers })
  },
}
