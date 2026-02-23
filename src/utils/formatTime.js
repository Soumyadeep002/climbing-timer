/**
 * Format seconds as MM:SS.s (e.g. 125.4 → "02:05.4")
 * Use for both count-up and countdown display.
 */
export function formatTime(seconds) {
  const total = Math.max(0, Math.floor(seconds * 10) / 10)
  const mins = Math.floor(total / 60)
  const secInt = Math.floor(total % 60)
  const tenth = Math.floor((total % 1) * 10)
  return `${String(mins).padStart(2, '0')}:${String(secInt).padStart(2, '0')}.${tenth}`
}
