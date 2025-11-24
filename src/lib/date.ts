// src/lib/date.ts
export function getCostaRicaDate() {
  // Costa Rica es UTC-6, sin DST
  const now = new Date()
  const utc = now.getTime() + (now.getTimezoneOffset() * 60000)
  return new Date(utc + (-6 * 3600000)) // UTC-6
}

export function startOfMonthCR(date: Date) {
  const d = new Date(date)
  d.setUTCDate(1)
  d.setUTCHours(0, 0, 0, 0)
  return d
}

export function endOfMonthCR(date: Date) {
  const d = new Date(date)
  d.setUTCMonth(d.getUTCMonth() + 1)
  d.setUTCDate(0)
  d.setUTCHours(23, 59, 59, 999)
  return d
}

export function formatMonthCR(date: Date) {
  return date.toLocaleDateString('es-CR', {
    month: 'short',
    year: 'numeric',
    timeZone: 'Etc/GMT+6'
  }).replace(/^./, s => s.toUpperCase());
}
