// Route only /media/* through this handler. Everything else uses Static Assets directly.
interface Environment { ASSETS: { fetch(request: Request): Promise<Response> } }
export default {
  async fetch(request: Request, env: Environment): Promise<Response> {
    const range = request.headers.get('Range')
    const headers = new Headers(request.headers)
    headers.delete('Range')
    const asset = await env.ASSETS.fetch(new Request(request, { headers }))
    if (asset.status !== 200) return asset
    const responseHeaders = new Headers(asset.headers)
    responseHeaders.set('Accept-Ranges', 'bytes')
    if (!range || request.method !== 'GET') return new Response(asset.body, { status: asset.status, headers: responseHeaders })
    // Ignore unsupported multipart/malformed ranges, as HTTP permits.
    const match = /^bytes=(\d*)-(\d*)$/.exec(range)
    if (!match || (!match[1] && !match[2])) return new Response(asset.body, { headers: responseHeaders })
    const ifRange = request.headers.get('If-Range')
    if (ifRange && ifRange !== asset.headers.get('ETag') && ifRange !== asset.headers.get('Last-Modified')) return new Response(asset.body, { headers: responseHeaders })
    const bytes = await asset.arrayBuffer()
    const length = bytes.byteLength
    const start = match[1] ? Number(match[1]) : Math.max(0, length - Number(match[2]))
    const end = match[1] ? (match[2] ? Math.min(Number(match[2]), length - 1) : length - 1) : length - 1
    if (!Number.isSafeInteger(start) || !Number.isSafeInteger(end) || start >= length || start > end || (!match[1] && Number(match[2]) === 0)) {
      responseHeaders.set('Content-Range', `bytes */${length}`)
      responseHeaders.set('Content-Length', '0')
      return new Response(null, { status: 416, headers: responseHeaders })
    }
    responseHeaders.set('Content-Range', `bytes ${start}-${end}/${length}`)
    responseHeaders.set('Content-Length', String(end - start + 1))
    return new Response(bytes.slice(start, end + 1), { status: 206, headers: responseHeaders })
  },
}
