'use client'
import { useEffect, useMemo, useState } from 'react'
import { Loader2, RotateCcw, Search, AlertCircle } from 'lucide-react'

function fmt(d) { try { return new Date(d).toLocaleString('en-IN') } catch { return String(d) } }

export default function PriceHistoryPage() {
  const [items, setItems] = useState([]); const [loading, setLoading] = useState(true)
  const [q, setQ] = useState(''); const [restoring, setRestoring] = useState(null); const [err, setErr] = useState('')

  const load = async () => {
    setLoading(true)
    const url = `/api/admin/price-history${q ? `?q=${encodeURIComponent(q)}` : ''}`
    const r = await fetch(url, { cache:'no-store' })
    if (r.status === 401) { window.location.href='/admin/login?next=/admin/price-history'; return }
    const d = await r.json(); setItems(d.items || []); setLoading(false)
  }
  useEffect(() => { load() }, [])
  useEffect(() => { const t = setTimeout(load, 250); return () => clearTimeout(t) }, [q])

  const restore = async (h) => {
    if (!confirm(`Restore "${h.item_name}" to the previous price? This will create a new history entry.`)) return
    setRestoring(h._id); setErr('')
    const r = await fetch(`/api/admin/price-history/${h._id}/restore`, { method:'POST' })
    setRestoring(null)
    if (!r.ok) { const d = await r.json(); setErr(d?.error || 'Restore failed'); return }
    load()
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto">
      <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Price History</h1>
      <p className="text-sm text-slate-500 mt-1">Every price change is logged here. You can restore a previous value.</p>
      <div className="mt-4 relative max-w-sm"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" /><input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search by item name…" className="w-full rounded-md border border-slate-300 pl-9 pr-3 py-2 text-sm" /></div>
      {err && <div className="mt-4 text-sm text-rose-700 bg-rose-50 border border-rose-200 rounded-md px-3 py-2 inline-flex items-center gap-2"><AlertCircle className="h-4 w-4" />{err}</div>}

      {loading ? <div className="mt-6 text-slate-500"><Loader2 className="h-4 w-4 animate-spin inline" /> Loading…</div> : (
        <div className="mt-4 overflow-hidden rounded-xl border border-slate-200 bg-white">
          <table className="w-full text-[13px]">
            <thead className="bg-slate-50 text-slate-600 uppercase text-[11px]">
              <tr><th className="text-left py-2.5 px-3">When</th><th className="text-left py-2.5 px-3">Item</th><th className="text-left py-2.5 px-3">Old → New</th><th className="text-left py-2.5 px-3">By</th><th className="text-left py-2.5 px-3">Source</th><th className="text-right py-2.5 px-3">Action</th></tr>
            </thead>
            <tbody>
              {items.map(h => {
                const oldStr = [h.old?.dc_price != null ? `DC ₹${h.old.dc_price}` : null, h.old?.discount_percent != null ? `${h.old.discount_percent}%` : null, h.old?.active != null ? (h.old.active ? 'Active' : 'Hidden') : null].filter(Boolean).join(', ')
                const newStr = [h.new?.dc_price != null ? `DC ₹${h.new.dc_price}` : null, h.new?.discount_percent != null ? `${h.new.discount_percent}%` : null, h.new?.active != null ? (h.new.active ? 'Active' : 'Hidden') : null].filter(Boolean).join(', ')
                return (
                  <tr key={h._id} className="border-t border-slate-100">
                    <td className="py-2.5 px-3 text-slate-600 whitespace-nowrap">{fmt(h.at)}</td>
                    <td className="py-2.5 px-3 font-medium text-slate-800">{h.item_name}</td>
                    <td className="py-2.5 px-3 text-slate-700"><span className="text-slate-500">{oldStr || '—'}</span> <span className="text-slate-400 mx-1">→</span> <span className="text-slate-900 font-medium">{newStr || '—'}</span></td>
                    <td className="py-2.5 px-3 text-slate-600">{h.user}</td>
                    <td className="py-2.5 px-3 text-[11px] text-slate-500">{h.source || 'edit'}</td>
                    <td className="py-2.5 px-3 text-right"><button onClick={()=>restore(h)} disabled={restoring===h._id} className="inline-flex items-center gap-1 text-[12px] font-semibold text-[#0759AD] hover:underline disabled:opacity-50">{restoring===h._id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <RotateCcw className="h-3.5 w-3.5" />} Restore old value</button></td>
                  </tr>
                )
              })}
              {items.length === 0 && <tr><td colSpan={6} className="py-8 text-center text-slate-500">No history entries yet.</td></tr>}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
