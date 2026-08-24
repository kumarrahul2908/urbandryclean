'use client'
import { useEffect, useMemo, useState } from 'react'
import { Loader2, AlertCircle, CheckCircle2, ArrowRight } from 'lucide-react'

const CATEGORIES = [{ id:'mens', label:"Men's Wear" },{ id:'womens', label:"Women's Wear" },{ id:'household', label:'Household' }]

export default function BulkUpdatePage() {
  const [items, setItems] = useState([]); const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState(new Set())
  const [op, setOp] = useState('decrease'); const [value, setValue] = useState(10)
  const [preview, setPreview] = useState(null); const [applying, setApplying] = useState(false); const [msg, setMsg] = useState(''); const [err, setErr] = useState('')
  const [q, setQ] = useState(''); const [cat, setCat] = useState('all')

  const load = async () => {
    const r = await fetch('/api/admin/prices', { cache:'no-store' })
    if (r.status === 401) { window.location.href='/admin/login?next=/admin/bulk'; return }
    const d = await r.json(); setItems(d.items || []); setLoading(false)
  }
  useEffect(() => { load() }, [])

  const filtered = useMemo(() => {
    let list = items
    if (cat !== 'all') list = list.filter(i => i.category === cat)
    if (q) list = list.filter(i => (i.name || '').toLowerCase().includes(q.toLowerCase()))
    return list
  }, [items, q, cat])

  const toggleAll = () => {
    if (filtered.every(i => selected.has(i._id))) { const n = new Set(selected); filtered.forEach(i => n.delete(i._id)); setSelected(n) }
    else { const n = new Set(selected); filtered.forEach(i => n.add(i._id)); setSelected(n) }
  }
  const toggle = (id) => { const n = new Set(selected); n.has(id) ? n.delete(id) : n.add(id); setSelected(n) }

  const doPreview = async () => {
    setErr(''); setMsg(''); setPreview(null)
    if (selected.size === 0) { setErr('Select at least one item'); return }
    const r = await fetch('/api/admin/prices/bulk', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ ids:[...selected], op, value: Number(value), preview:true }) })
    const d = await r.json()
    if (!r.ok) { setErr(d?.error || 'Preview failed'); return }
    setPreview(d)
  }

  const commit = async () => {
    setApplying(true); setErr('')
    const r = await fetch('/api/admin/prices/bulk', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ ids:[...selected], op, value: Number(value), preview:false }) })
    const d = await r.json(); setApplying(false)
    if (!r.ok) { setErr(d?.error || 'Update failed'); return }
    setMsg(`Applied ${d.applied} changes. Public site updated instantly.`); setPreview(null); setSelected(new Set()); load()
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto">
      <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Bulk Price Update</h1>
      <p className="text-sm text-slate-500 mt-1">Select items, choose an operation, preview the changes, then confirm.</p>

      <div className="mt-5 grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 rounded-xl border border-slate-200 bg-white p-3">
          <div className="flex flex-col sm:flex-row gap-2 mb-3">
            <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search…" className="flex-1 rounded-md border border-slate-300 px-3 py-2 text-sm" />
            <select value={cat} onChange={e=>setCat(e.target.value)} className="rounded-md border border-slate-300 px-2 py-2 text-sm bg-white">
              <option value="all">All categories</option>
              {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
            </select>
            <button onClick={toggleAll} className="rounded-md border border-slate-300 px-3 py-2 text-sm font-medium">Select all visible</button>
          </div>
          {loading ? <div className="text-slate-500"><Loader2 className="h-4 w-4 animate-spin inline" /> Loading…</div> : (
            <div className="max-h-[500px] overflow-y-auto divide-y divide-slate-100">
              {filtered.map(it => (
                <label key={it._id} className="flex items-center gap-3 py-2 px-2 hover:bg-slate-50">
                  <input type="checkbox" checked={selected.has(it._id)} onChange={() => toggle(it._id)} />
                  <div className="flex-1"><div className="text-sm font-medium">{it.name}</div><div className="text-[11px] text-slate-500">{it.category} · DC ₹{it.dc_price || '—'} · {it.discount_percent}%</div></div>
                </label>
              ))}
              {filtered.length === 0 && <div className="text-center py-6 text-slate-500 text-sm">No matches.</div>}
            </div>
          )}
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 space-y-3 h-fit">
          <div className="text-sm font-semibold text-slate-900">Operation</div>
          <select value={op} onChange={e=>setOp(e.target.value)} className="w-full rounded-md border border-slate-300 px-2 py-2 text-sm bg-white">
            <option value="decrease">Decrease price by %</option>
            <option value="increase">Increase price by %</option>
            <option value="set_discount">Set discount %</option>
            <option value="enable">Enable (show)</option>
            <option value="disable">Disable (hide)</option>
          </select>
          {(op === 'decrease' || op === 'increase' || op === 'set_discount') && (
            <div><label className="text-xs text-slate-600">Value (%)</label><input type="number" value={value} onChange={e=>setValue(e.target.value)} className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm" /></div>
          )}
          <div className="text-xs text-slate-500">Selected: <b>{selected.size}</b></div>
          <button onClick={doPreview} className="w-full rounded-md bg-[#0759AD] px-4 py-2.5 text-sm font-semibold text-white">Preview changes</button>
          {err && <div className="flex items-center gap-2 text-sm text-rose-700 bg-rose-50 border border-rose-200 rounded-md px-3 py-2"><AlertCircle className="h-4 w-4" />{err}</div>}
          {msg && <div className="flex items-center gap-2 text-sm text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-md px-3 py-2"><CheckCircle2 className="h-4 w-4" />{msg}</div>}
        </div>
      </div>

      {preview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/50" onClick={()=>setPreview(null)} />
          <div className="relative w-full max-w-2xl max-h-[85vh] rounded-2xl bg-white shadow-xl flex flex-col">
            <div className="px-5 py-3 border-b"><h3 className="font-semibold text-lg">Preview: {preview.changes.filter(c=>!c.skipped).length} changes</h3><p className="text-sm text-slate-500">Review carefully, then click Confirm to apply.</p></div>
            <div className="overflow-y-auto p-5 space-y-2">
              {preview.changes.map(c => (
                <div key={c._id} className={`flex items-center justify-between gap-3 rounded-md border px-3 py-2 text-sm ${c.skipped ? 'bg-slate-50 border-slate-200 text-slate-500' : 'bg-white border-slate-200'}`}>
                  <div className="font-medium">{c.name}</div>
                  {c.skipped ? <div className="text-xs">Skipped: {c.skipped}</div> : (
                    <div className="text-slate-600 text-[13px]">
                      {Object.keys(c.new).map(k => <span key={k} className="inline-block ml-3">{k}: <span className="text-slate-500">{String(c.old[k] ?? '—')}</span> <ArrowRight className="inline h-3 w-3" /> <b className="text-slate-900">{String(c.new[k])}</b></span>)}
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="px-5 py-3 border-t flex gap-2">
              <button onClick={()=>setPreview(null)} className="flex-1 rounded-md border border-slate-300 px-4 py-2.5 text-sm font-semibold">Cancel</button>
              <button onClick={commit} disabled={applying} className="flex-1 inline-flex items-center justify-center gap-2 rounded-md bg-[#0759AD] px-4 py-2.5 text-sm font-semibold text-white">{applying ? <Loader2 className="h-4 w-4 animate-spin" /> : null} Confirm Update</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
