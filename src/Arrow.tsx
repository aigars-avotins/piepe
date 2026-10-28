export default function Arrow({ direction = 'diagonal' }: { direction?: 'diagonal' | 'up' | 'down' | 'right' }) {
  const paths = { diagonal: 'M5 19 19 5M5 5h14v14', up: 'M12 20V4m-6 6 6-6 6 6', down: 'M12 4v16m-6-6 6 6 6-6', right: 'M4 12h16m-6-6 6 6-6 6' }
  return <svg className="direction-arrow" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false"><path d={paths[direction]} /></svg>
}
