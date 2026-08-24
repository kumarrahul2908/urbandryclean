'use client'
import { useEffect, useState } from 'react'
import { Save, X, Loader2, AlertCircle, Sparkles, Plus, Trash2 } from 'lucide-react'

const empty = { title:'FLAT 25% OFF', description:'On All Dry-Cleaning Items', discount_percent:25, applies_to:'Dry Cleaning', active:true, start_date:'', end_date:'' }

export default function AdminPromotionsPage() {
  const [items, setItems] = useState([]); const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(null); const [saving, setSaving] = useState(false); const [err, setErr] = useState('')
  const [confirm, setConfirm] = useState(null)

  const load = async () => {
    const r = await fetch('/api/admin/promotions', { cache:'no-store' })
    if (r.status === 401) { window.location.href='/admin/login?next=/admin/promotions'; return }
    const d = await r.json(); setItems(d.items || []); setLoading(false)
  }
  useEffect(() => { load() }, [])

  const save = async () => {
    setSaving(true); setErr('')
    const payload = { ...editing, discount_percent: Number(editing.discount_percent) }
    const isEdit = !!editing._id
    const r = await fetch(isEdit ? `/api/admin/promotions/${editing._id}` : '/api/admin/promotions',
      { method: isEdit ? 'PUT' : 'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(payload) })
    const d = await r.json(); setSaving(false)
    if (!r.ok) { setErr(d?.error || 'Save failed'); return }
    setEditing(null); load()
  }
  const toggle = async (it) => { await fetch(`/api/admin/promotions/${it._id}`, { method:'PUT', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ active: !it.active }) }); load() }
  const doDelete = async () => { await fetch(`/api/admin/promotions/${confirm._id}`, { method:'DELETE' }); setConfirm(null); load() }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
      <div className="flex items-center justify-between"><div><h1 className="text-2xl md:text-3xl font-bold text-slate-900">Promotions</h1><p className="text-sm text-slate-500 mt-1">Only one promotion can be active at a time. It powers the banner on the public site.</p></div><button onClick={() => setEditing({ ...empty })} className="inline-flex items-center gap-1.5 rounded-md bg-[#0759AD] px-4 py-2 text-sm font-semibold text-white"><Plus className="h-4 w-4" /> Add</button></div>

      {loading ? <div className="mt-6 text-slate-500"><Loader2 className="h-4 w-4 animate-spin inline" /> Loading…</div> : (
        <div className="mt-5 space-y-3">{items.map(it => (
          <div key={it._id} className={`rounded-xl border p-4 ${it.active ? 'border-emerald-300 bg-emerald-50/40' : 'border-slate-200 bg-white'}`}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 font-semibold text-slate-900"><Sparkles className="h-4 w-4 text-emerald-600" /> {it.title}</div>
                <div className="text-sm text-slate-600 mt-1">{it.description}</div>
                <div className="text-[12px] text-slate-500 mt-2">Discount: <b>{it.discount_percent}%</b> · Applies to: <b>{it.applies_to}</b>{it.start_date ? ` · From: ${it.start_date}` : ''}{it.end_date ? ` · Until: ${it.end_date}` : ''}</div>
              </div>
              {it.active ? <span className="inline-flex rounded-full bg-emerald-600 text-white px-2 py-0.5 text-[11px] font-bold uppercase">Live</span> : <span className="inline-flex rounded-full bg-slate-100 text-slate-500 px-2 py-0.5 text-[11px] font-semibold">Inactive</span>}
            </div>
            <div className="mt-3 flex items-center gap-2">
              <button onClick={() => setEditing({ ...it })} className="rounded-md bg-[#0759AD] px-3 py-1.5 text-[12px] font-semibold text-white">Edit</button>
              <button onClick={() => toggle(it)} className="rounded-md border border-slate-300 px-3 py-1.5 text-[12px]">{it.active ? 'Deactivate' : 'Activate'}</button>
              <button onClick={() => setConfirm(it)} className="rounded-md border border-rose-300 text-rose-600 p-1.5"><Trash2 className="h-4 w-4" /></button>
            </div>
          </div>
        ))}</div>
      )}

      {editing && (
        <div className="fixed inset-0 z-50 flex"><div className="absolute inset-0 bg-black/40" onClick={()=>setEditing(null)} />
          <div className="relative ml-auto w-full sm:max-w-lg bg-white h-full overflow-y-auto shadow-xl">
            <div className="sticky top-0 bg-white border-b border-slate-200 px-5 py-3 flex items-center justify-between"><h2 className="font-semibold">{editing._id ? 'Edit promotion' : 'Add promotion'}</h2><button onClick={()=>setEditing(null)} className="p-1.5 rounded-md hover:bg-slate-100"><X className="h-5 w-5" /></button></div>
            <div className="p-5 space-y-3">
              {err && <div className="flex items-center gap-2 text-sm text-rose-700 bg-rose-50 border border-rose-200 rounded-md px-3 py-2"><AlertCircle className="h-4 w-4" />{err}</div>}
              <div><label className="text-xs font-medium text-slate-600">Title *</label><input value={editing.title} onChange={e=>setEditing({...editing, title:e.target.value})} className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm" /></div>
              <div><label className="text-xs font-medium text-slate-600">Description</label><input value={editing.description} onChange={e=>setEditing({...editing, description:e.target.value})} className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm" /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="text-xs font-medium text-slate-600">Discount %</label><input type="number" value={editing.discount_percent} onChange={e=>setEditing({...editing, discount_percent:e.target.value})} className="mt-1 w-full rounded-md border border-slate-300 px-2 py-2 text-sm" /></div>
                <div><label className="text-xs font-medium text-slate-600">Applies to</label><input value={editing.applies_to} onChange={e=>setEditing({...editing, applies_to:e.target.value})} className="mt-1 w-full rounded-md border border-slate-300 px-2 py-2 text-sm" /></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="text-xs font-medium text-slate-600">Start Date</label><input type="date" value={editing.start_date || ''} onChange={e=>setEditing({...editing, start_date:e.target.value})} className="mt-1 w-full rounded-md border border-slate-300 px-2 py-2 text-sm" /></div>
                <div><label className="text-xs font-medium text-slate-600">End Date (optional)</label><input type="date" value={editing.end_date || ''} onChange={e=>setEditing({...editing, end_date:e.target.value})} className="mt-1 w-full rounded-md border border-slate-300 px-2 py-2 text-sm" /></div>
              </div>
              <label className="inline-flex items-center gap-2 text-sm"><input type="checkbox" checked={!!editing.active} onChange={e=>setEditing({...editing, active:e.target.checked})} /> Active (only one active at a time)</label>
            </div>
            <div className="sticky bottom-0 bg-white border-t border-slate-200 px-5 py-3 flex gap-2"><button onClick={()=>setEditing(null)} className="flex-1 rounded-md border border-slate-300 px-4 py-2.5 text-sm font-semibold">Cancel</button><button onClick={save} disabled={saving} className="flex-1 inline-flex items-center justify-center gap-2 rounded-md bg-[#0759AD] px-4 py-2.5 text-sm font-semibold text-white">{saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Save</button></div>
          </div>
        </div>
      )}

      {confirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4"><div className="absolute inset-0 bg-black/50" onClick={()=>setConfirm(null)} />
          <div className="relative w-full max-w-sm rounded-2xl bg-white p-5 shadow-xl"><h3 className="text-lg font-bold">Delete this promotion?</h3><p className="mt-1 text-sm text-slate-600">If it&rsquo;s the active one, the banner will disappear from the public site.</p><div className="mt-4 flex gap-2"><button onClick={()=>setConfirm(null)} className="flex-1 rounded-md border border-slate-300 px-4 py-2.5 text-sm font-semibold">Cancel</button><button onClick={doDelete} className="flex-1 rounded-md bg-rose-600 px-4 py-2.5 text-sm font-semibold text-white">Delete</button></div></div>
        </div>
      )}
    </div>
  )
}
