import { mediaUrl } from './mediaUrl'
// The ten published films, in the order of "The films in words" (siteCopy.about.films.items).
// Durations are read from each file's own header; dates are when the file first entered the repository.
export const films = [
  { file: '/media/forest-reveal.mp4', still: '/media/forest-poster.jpg', seconds: 6.04, uploaded: '2026-10-27' },
  { file: '/media/forest-awakening.mp4', still: '/media/forest-awakening-poster.jpg', seconds: 6.04, uploaded: '2026-10-27' },
  { file: '/media/forest-understory.mp4', still: '/media/forest-understory.jpg', seconds: 6.04, uploaded: '2026-10-27' },
  { file: '/media/portal-02-faststart.mp4', still: '/media/portal-02-first.webp', seconds: 9.96, uploaded: '2026-11-07' },
  { file: '/media/portal-03-faststart.mp4', still: '/media/portal-03-first.webp', seconds: 9.96, uploaded: '2026-11-07' },
  { file: '/media/portal-04-faststart.mp4', still: '/media/portal-04-first.webp', seconds: 9.96, uploaded: '2026-11-07' },
  { file: '/media/portal-05-faststart.mp4', still: '/media/portal-05-first.webp', seconds: 7.85, uploaded: '2026-11-07' },
  { file: '/media/portal-06-faststart.mp4', still: '/media/portal-06-first.webp', seconds: 9.96, uploaded: '2026-11-07' },
  { file: '/media/portal-07-faststart.mp4', still: '/media/portal-07-first.webp', seconds: 9.96, uploaded: '2026-11-07' },
  { file: '/media/forest-breathing.mp4', still: '/media/forest-breathing-poster.jpg', seconds: 6.04, uploaded: '2026-10-27' },
].map(film => ({ ...film, file: mediaUrl(film.file), still: mediaUrl(film.still) }))
