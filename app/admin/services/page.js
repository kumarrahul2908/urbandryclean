'use client'
import { useEffect, useState } from 'react'
import { Plus, Save, X, Trash2, Loader2, Power, PowerOff, AlertCircle } from 'lucide-react'

const ICONS = ['Shirt','WashingMachine','Wind','Bed','Layers','Crown','Briefcase','Wand2','Scissors','HomeIcon']
const empty = { name:'', slug:'', desc:'', long_desc:'', icon:'Shirt', active:true, display_order:999 }

export default function AdminServicesPage() {
  const [items, setItems] = useState([]); const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(null); const [saving, setSaving] = useState(false); const [err, setErr] = useState('')
  const [confirm, setConfirm] = useState(null)

  const load = async () => {
    setLoading(true)
    const r = await fetch('/api/admin/services', { cache: 'no-store' })
    if (r.status === 401) { window.location.href = '/admin/login?next=/admin/services'; return }
    const d = await r.json(); setItems(d.items || []); setLoading(false)
  }
  useEffect(() => { load() }, [])

  const save = async () => {
    setSaving(true); setErr('')
    const isEdit = !!editing._id
    const url = isEdit ? `/api/admin/services/${editing._id}` : '/api/admin/services'
    const r = await fetch(url, { method: isEdit ? 'PUT' : 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify(editing) })
    const d = await r.json()
    setSaving(false)
    if (!r.ok) { setErr(d?.error || 'Save failed'); return }
    setEditing(null); load()
  }

  const toggle = async (it) => { await fetch(`/api/admin/services/${it._id}`, { method:'PUT', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ active: !it.active }) }); load() }
  const doDelete = async () => { await fetch(`/api/admin/services/${confirm._id}`, { method:'DELETE' }); setConfirm(null); load() }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl md:text-3xl font-bold text-slate-900">Services</h1><p className="text-sm text-slate-500 mt-1">Manage what appears on the public Services page.</p></div>
        <button onClick={() => setEditing({ ...empty })} className="inline-flex items-center gap-1.5 rounded-md bg-[#0759AD] px-4 py-2 text-sm font-semibold text-white"><Plus className="h-4 w-4" /> Add Service</button>
      </div>

      {loading ? <div className="mt-6 text-slate-500"><Loader2 className="h-4 w-4 animate-spin inline" /> Loading…</div> : (
        <div className="mt-5 grid grid-cols-1 lg:grid-cols-2 gap-3">
          {items.map(it => (
            <div key={it._id} className="rounded-xl border border-slate-200 bg-white p-4">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="font-semibold text-slate-900">{it.name}</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">/{it.slug} · order: {it.display_order} · icon: {it.icon}</div>
                  <p className="mt-2 text-[13px] text-slate-600 line-clamp-2">{it.desc}</p>
                </div>
                {it.active ? <span className="inline-flex rounded-full bg-emerald-100 text-emerald-700 px-2 py-0.5 text-[11px] font-semibold">Active</span> : <span className="inline-flex rounded-full bg-slate-100 text-slate-500 px-2 py-0.5 text-[11px] font-semibold">Hidden</span>}
              </div>
              <div className="mt-3 flex items-center gap-2">
                <button onClick={() => setEditing({ ...it })} className="rounded-md bg-[#0759AD] px-3 py-1.5 text-[12px] font-semibold text-white">Edit</button>
                <button onClick={() => toggle(it)} className="rounded-md border border-slate-300 p-1.5">{it.active ? <PowerOff className="h-4 w-4" /> : <Power className="h-4 w-4" />}</button>
                <button onClick={() => setConfirm(it)} className="rounded-md border border-rose-300 text-rose-600 p-1.5"><Trash2 className="h-4 w-4" /></button>
              </div>
            </div>
          ))}
          {items.length === 0 && <div className="text-slate-500 col-span-2 text-center py-8">No services yet.</div>}
        </div>
      )}

      {editing && (
        <div className="fixed inset-0 z-50 flex"><div className="absolute inset-0 bg-black/40" onClick={() => setEditing(null)} />
          <div className="relative ml-auto w-full sm:max-w-lg bg-white h-full overflow-y-auto shadow-xl">
            <div className="sticky top-0 bg-white border-b border-slate-200 px-5 py-3 flex items-center justify-between">
              <h2 className="font-semibold">{editing._id ? 'Edit service' : 'Add service'}</h2>
              <button onClick={() => setEditing(null)} className="p-1.5 rounded-md hover:bg-slate-100"><X className="h-5 w-5" /></button>
            </div>
            <div className="p-5 space-y-3">
              {err && <div className="flex items-center gap-2 text-sm text-rose-700 bg-rose-50 border border-rose-200 rounded-md px-3 py-2"><AlertCircle className="h-4 w-4" />{err}</div>}
              <div><label className="text-xs font-medium text-slate-600">Name *</label><input value={editing.name} onChange={e=>setEditing({...editing, name:e.target.value})} className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm" /></div>
              <div><label className="text-xs font-medium text-slate-600">Slug (URL)</label><input value={editing.slug} onChange={e=>setEditing({...editing, slug:e.target.value})} className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm" placeholder="auto from name" /></div>
              <div><label className="text-xs font-medium text-slate-600">Short description</label><textarea rows={2} value={editing.desc} onChange={e=>setEditing({...editing, desc:e.target.value})} className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm" /></div>
              <div><label className="text-xs font-medium text-slate-600">Long description</label><textarea rows={3} value={editing.long_desc} onChange={e=>setEditing({...editing, long_desc:e.target.value})} className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm" /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="text-xs font-medium text-slate-600">Icon</label><select value={editing.icon} onChange={e=>setEditing({...editing, icon:e.target.value})} className="mt-1 w-full rounded-md border border-slate-300 px-2 py-2 text-sm bg-white">{ICONS.map(i=><option key={i}>{i}</option>)}</select></div>
                <div><label className="text-xs font-medium text-slate-600">Display Order</label><input type="number" value={editing.display_order} onChange={e=>setEditing({...editing, display_order: Number(e.target.value)})} className="mt-1 w-full rounded-md border border-slate-300 px-2 py-2 text-sm" /></div>
              </div>
              <label className="inline-flex items-center gap-2 text-sm"><input type="checkbox" checked={!!editing.active} onChange={e=>setEditing({...editing, active:e.target.checked})} /> Active on public site</label>
            </div>
            <div className="sticky bottom-0 bg-white border-t border-slate-200 px-5 py-3 flex gap-2"><button onClick={()=>setEditing(null)} className="flex-1 rounded-md border border-slate-300 px-4 py-2.5 text-sm font-semibold">Cancel</button><button onClick={save} disabled={saving} className="flex-1 inline-flex items-center justify-center gap-2 rounded-md bg-[#0759AD] px-4 py-2.5 text-sm font-semibold text-white">{saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Save</button></div>
          </div>
        </div>
      )}

      {confirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4"><div className="absolute inset-0 bg-black/50" onClick={()=>setConfirm(null)} />
          <div className="relative w-full max-w-sm rounded-2xl bg-white p-5 shadow-xl">
            <h3 className="text-lg font-bold">Delete this service?</h3>
            <p className="mt-1 text-sm text-slate-600">“{confirm.name}” will be removed from the public Services page. Consider Hide for a reversible change.</p>
            <div className="mt-4 flex gap-2"><button onClick={()=>setConfirm(null)} className="flex-1 rounded-md border border-slate-300 px-4 py-2.5 text-sm font-semibold">Cancel</button><button onClick={doDelete} className="flex-1 rounded-md bg-rose-600 px-4 py-2.5 text-sm font-semibold text-white">Delete</button></div>
          </div>
        </div>
      )}
    </div>
  )
}
