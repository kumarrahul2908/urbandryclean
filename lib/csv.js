// Minimal CSV helpers (no external dep).

const HEADERS = ['id','category','name','service_type','mrp','discount_percent','dc_price','si_price','unit','active','special','display_order']

export function itemsToCsv(items) {
  const escape = (v) => {
    if (v === null || v === undefined) return ''
    const s = String(v)
    if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`
    return s
  }
  const rows = [HEADERS.join(',')]
  for (const it of items) {
    rows.push([
      it._id,
      it.category || '',
      it.name || '',
      it.service_type || '',
      it.mrp ?? '',
      it.discount_percent ?? '',
      it.dc_price ?? '',
      it.si_price ?? '',
      it.unit || '',
      it.active === false ? 'false' : 'true',
      it.special ? 'true' : 'false',
      it.display_order ?? '',
    ].map(escape).join(','))
  }
  return rows.join('\n') + '\n'
}

// Robust CSV line parser supporting quoted commas & escaped quotes.
export function parseCsv(text) {
  const rows = []
  let i = 0, cur = '', row = [], inQuotes = false
  while (i < text.length) {
    const c = text[i]
    if (inQuotes) {
      if (c === '"' && text[i + 1] === '"') { cur += '"'; i += 2; continue }
      if (c === '"') { inQuotes = false; i++; continue }
      cur += c; i++; continue
    }
    if (c === '"') { inQuotes = true; i++; continue }
    if (c === ',') { row.push(cur); cur = ''; i++; continue }
    if (c === '\n' || c === '\r') {
      if (c === '\r' && text[i + 1] === '\n') i++
      row.push(cur); cur = ''
      if (row.length > 1 || row[0] !== '') rows.push(row)
      row = []; i++; continue
    }
    cur += c; i++
  }
  if (cur !== '' || row.length) { row.push(cur); rows.push(row) }
  if (!rows.length) return { headers: [], data: [] }
  const headers = rows[0].map(h => h.trim())
  const data = rows.slice(1).map(r => {
    const o = {}
    headers.forEach((h, idx) => { o[h] = (r[idx] ?? '').trim() })
    return o
  }).filter(r => Object.values(r).some(v => v !== ''))
  return { headers, data }
}

export const REQUIRED_IMPORT_COLUMNS = ['category','name','mrp','discount_percent','dc_price','si_price','active']
