'use client'
import { useEffect, useState } from 'react'
import { Loader2, Search, Filter, Phone, MessageCircle, Trash2 } from 'lucide-react'

const STATUSES = ['new', 'contacted', 'completed', 'cancelled']
const STATUS_COLORS = {
  new: 'bg-amber-100 text-amber-800',
  contacted: 'bg-blue-100 text-blue-700',
  completed: 'bg-emerald-100 text-emerald-700',
  cancelled: 'bg-slate-100 text-slate-500',
}

const SOURCE_LABELS = {
  header_form: 'Header Popup',
  book_pickup_page: 'Book Pickup Page',
}
const sourceLabel = (s) => SOURCE_LABELS[s] || (s ? String(s).replace(/_/g, ' ') : '—')

function fmt(d) { try { return new Date(d).toLocaleString('en-IN') } catch { return String(d) } }

export default function AdminLeadsPage() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [q, setQ] = useState('')
  const [status, setStatus] = useState('all')
  const [confirm, setConfirm] = useState(null)

  const load = async () => {
    setLoading(true)
    const url = `/api/admin/leads${status !== 'all' ? `?status=${status}` : ''}`
    const r = await fetch(url, { cache: 'no-store' })
    if (r.status === 401) { window.location.href = '/admin/login?next=/admin/leads'; return }
    const d = await r.json()
    setItems(d.items || [])
    setLoading(false)
  }
  useEffect(() => { load() }, [status])

  const filtered = items.filter(it => {
    if (!q) return true
    const s = q.toLowerCase()
    return (it.name || '').toLowerCase().includes(s)
      || (it.phone || '').toLowerCase().includes(s)
      || (it.address || '').toLowerCase().includes(s)
  })

  const updateStatus = async (id, next) => {
    await fetch(`/api/admin/leads/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status: next }) })
    load()
  }
  const doDelete = async () => {
    if (!confirm) return
    await fetch(`/api/admin/leads/${confirm._id}`, { method: 'DELETE' })
    setConfirm(null); load()
  }

  const waLink = (it) => {
    const phone = (it.phone || '').replace(/[^0-9]/g, '')
    if (!phone) return null
    const msg = encodeURIComponent(`Hello${it.name ? ' ' + it.name : ''}, this is Urban Dry Clean. We received your pickup request. When would be a good time to collect your garments?`)
    return `https://wa.me/${phone.startsWith('91') || phone.length > 10 ? phone : '91' + phone}?text=${msg}`
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Pickup Leads</h1>
        <p className="text-sm text-slate-500 mt-1">Requests submitted from the website Book Pickup form.</p>
      </div>

      <div className="mt-4 flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search by name, phone or address…"
            className="w-full rounded-md border border-slate-300 pl-9 pr-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#0759AD]" />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-slate-500" />
          <select value={status} onChange={e => setStatus(e.target.value)} className="rounded-md border border-slate-300 px-2 py-2.5 text-sm bg-white">
            <option value="all">All statuses</option>
            {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="mt-6 text-slate-500 text-sm"><Loader2 className="h-4 w-4 animate-spin inline" /> Loading…</div>
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden md:block mt-5 overflow-hidden rounded-xl border border-slate-200 bg-white">
            <table className="w-full text-[13.5px]">
              <thead className="bg-slate-50 text-slate-600 uppercase text-[11px] tracking-wider">
                <tr>
                  <th className="text-left py-3 px-4">Submitted</th>
                  <th className="text-left py-3 px-4">Name</th>
                  <th className="text-left py-3 px-4">Mobile</th>
                  <th className="text-left py-3 px-4">Address</th>
                  <th className="text-left py-3 px-4">Preferred</th>
                  <th className="text-left py-3 px-4">Source</th>
                  <th className="text-left py-3 px-4">Status</th>
                  <th className="text-right py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(it => (
                  <tr key={it._id} className="border-t border-slate-100 hover:bg-slate-50/60">
                    <td className="py-3 px-4 text-slate-600 whitespace-nowrap">{fmt(it.created_at)}</td>
                    <td className="py-3 px-4 font-medium text-slate-900">{it.name || <span className="text-slate-400">—</span>}</td>
                    <td className="py-3 px-4 text-slate-800">{it.phone}</td>
                    <td className="py-3 px-4 text-slate-600 max-w-xs truncate" title={it.address}>{it.address || <span className="text-slate-400">—</span>}</td>
                    <td className="py-3 px-4 text-slate-600 whitespace-nowrap">
                      {it.date || '—'}{it.time ? ` · ${it.time}` : ''}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className="inline-flex items-center rounded-full bg-slate-100 text-slate-700 px-2 py-0.5 text-[11px] font-medium">{sourceLabel(it.source)}</span>
                    </td>
                    <td className="py-3 px-4">
                      <select value={it.status || 'new'} onChange={e => updateStatus(it._id, e.target.value)}
                        className={`rounded-full px-2 py-0.5 text-[11px] font-semibold border-0 focus:ring-2 focus:ring-[#0759AD] ${STATUS_COLORS[it.status || 'new']}`}>
                        {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </td>
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <div className="inline-flex items-center gap-1">
                        <a href={`tel:${it.phone}`} title="Call" className="p-1.5 rounded-md hover:bg-slate-100 text-slate-600"><Phone className="h-4 w-4" /></a>
                        {waLink(it) && (
                          <a href={waLink(it)} target="_blank" rel="noopener noreferrer" title="WhatsApp" className="p-1.5 rounded-md hover:bg-emerald-50 text-emerald-700"><MessageCircle className="h-4 w-4" /></a>
                        )}
                        <button onClick={() => setConfirm(it)} title="Delete" className="p-1.5 rounded-md hover:bg-rose-50 text-rose-600"><Trash2 className="h-4 w-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr><td colSpan={8} className="py-10 text-center text-slate-500">No pickup requests yet.</td></tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="md:hidden mt-4 space-y-3">
            {filtered.map(it => (
              <div key={it._id} className="rounded-xl border border-slate-200 bg-white p-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="font-semibold text-slate-900">{it.name || 'Anonymous'}</div>
                    <div className="text-[12px] text-slate-500 mt-0.5">{fmt(it.created_at)}</div>
                  </div>
                  <select value={it.status || 'new'} onChange={e => updateStatus(it._id, e.target.value)}
                    className={`rounded-full px-2 py-0.5 text-[10px] font-semibold border-0 ${STATUS_COLORS[it.status || 'new']}`}>
                    {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div className="mt-2 text-[13px] text-slate-700"><b>Mobile:</b> {it.phone}</div>
                {it.address && <div className="text-[13px] text-slate-700"><b>Address:</b> {it.address}</div>}
                {(it.date || it.time) && <div className="text-[13px] text-slate-700"><b>Preferred:</b> {it.date || '—'}{it.time ? ` · ${it.time}` : ''}</div>}
                <div className="mt-1"><span className="inline-flex items-center rounded-full bg-slate-100 text-slate-700 px-2 py-0.5 text-[11px] font-medium">{sourceLabel(it.source)}</span></div>
                <div className="mt-3 flex items-center gap-2">
                  <a href={`tel:${it.phone}`} className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-md border border-slate-300 px-3 py-2 text-[12px] font-semibold"><Phone className="h-4 w-4" /> Call</a>
                  {waLink(it) && (
                    <a href={waLink(it)} target="_blank" rel="noopener noreferrer" className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-md px-3 py-2 text-[12px] font-semibold text-white" style={{ background: '#42A62B' }}><MessageCircle className="h-4 w-4" /> WhatsApp</a>
                  )}
                  <button onClick={() => setConfirm(it)} className="rounded-md border border-rose-300 text-rose-600 p-2"><Trash2 className="h-4 w-4" /></button>
                </div>
              </div>
            ))}
            {filtered.length === 0 && <div className="text-center text-sm text-slate-500 py-8">No pickup requests yet.</div>}
          </div>
        </>
      )}

      {confirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setConfirm(null)} />
          <div className="relative w-full max-w-sm rounded-2xl bg-white p-5 shadow-xl">
            <h3 className="text-lg font-bold text-slate-900">Delete this lead?</h3>
            <p className="mt-1 text-sm text-slate-600">This action cannot be undone.</p>
            <div className="mt-4 flex gap-2">
              <button onClick={() => setConfirm(null)} className="flex-1 rounded-md border border-slate-300 px-4 py-2.5 text-sm font-semibold">Cancel</button>
              <button onClick={doDelete} className="flex-1 rounded-md bg-rose-600 px-4 py-2.5 text-sm font-semibold text-white">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
