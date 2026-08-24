'use client'
import { useEffect, useMemo, useState } from 'react'
import { Plus, Search, Loader2, Save, X, Trash2, Power, PowerOff, AlertCircle, Sparkles, Filter, ExternalLink, Download, Upload } from 'lucide-react'

const CATEGORIES = [
  { id: 'mens', label: "Men's Wear" },
  { id: 'womens', label: "Women's Wear" },
  { id: 'household', label: 'Household' },
]

const SERVICE_TYPES = ['Dry Cleaning','Laundry','Steam Iron','Blanket Cleaning','Quilt Cleaning','Carpet Cleaning','Curtain Cleaning']

function computeFinal(mrpStr, pct) {
  if (!mrpStr || String(mrpStr).includes('/')) return null
  const n = Number(mrpStr)
  if (!Number.isFinite(n) || !Number.isFinite(pct)) return null
  return String(Math.round((n - (n * pct) / 100) * 100) / 100)
}

const emptyItem = { category: 'mens', name: '', service_type: 'Dry Cleaning', dc_price: '', si_price: '', mrp: '', discount_percent: 25, unit: 'Per Piece', active: true, special: false, note: '', display_order: 999 }

export default function AdminPricesPage() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState('')
  const [q, setQ] = useState('')
  const [cat, setCat] = useState('all')
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState(null) // item or emptyItem
  const [saving, setSaving] = useState(false)
  const [confirm, setConfirm] = useState(null) // {id,name} to delete
  const [importPreview, setImportPreview] = useState(null)
  const [importing, setImporting] = useState(false)

  const doExport = () => { window.location.href = '/api/admin/prices/export' }
  const onImportPick = async (e) => {
    const file = e.target.files?.[0]; e.target.value = ''
    if (!file) return
    const fd = new FormData(); fd.append('file', file)
    const r = await fetch('/api/admin/prices/import-preview', { method: 'POST', body: fd })
    const d = await r.json()
    if (!r.ok) { alert(d?.error || 'Import preview failed'); return }
    setImportPreview(d)
  }
  const commitImport = async () => {
    if (!importPreview) return
    setImporting(true)
    const r = await fetch('/api/admin/prices/import-commit', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ newRows: importPreview.newRows, updates: importPreview.updates }) })
    const d = await r.json(); setImporting(false)
    if (!r.ok) { alert(d?.error || 'Import failed'); return }
    setImportPreview(null); load()
  }

  const load = async () => {
    setLoading(true); setErr('')
    try {
      const r = await fetch('/api/admin/prices', { cache: 'no-store' })
      if (r.status === 401) { window.location.href = '/admin/login?next=/admin/prices'; return }
      const d = await r.json()
      setItems(d.items || [])
    } catch (e) { setErr('Failed to load prices') } finally { setLoading(false) }
  }
  useEffect(() => { load() }, [])

  const filtered = useMemo(() => {
    let list = items
    if (cat !== 'all') list = list.filter(i => i.category === cat)
    if (q.trim()) {
      const s = q.trim().toLowerCase()
      list = list.filter(i => (i.name || '').toLowerCase().includes(s) || (i.category || '').toLowerCase().includes(s))
    }
    return list
  }, [items, q, cat])

  const openAdd = () => { setEditing({ ...emptyItem }); setShowForm(true) }
  const openEdit = (it) => { setEditing({ ...it }); setShowForm(true) }
  const close = () => { setShowForm(false); setEditing(null) }

  const save = async () => {
    if (!editing?.name?.trim()) { alert('Item name is required'); return }
    setSaving(true); setErr('')
    const payload = { ...editing }
    payload.discount_percent = Number(payload.discount_percent)
    if (isNaN(payload.discount_percent) || payload.discount_percent < 0 || payload.discount_percent > 100) {
      setErr('Discount must be 0–100'); setSaving(false); return
    }
    payload.display_order = Number(payload.display_order) || 999
    const isEdit = !!editing._id
    const url = isEdit ? `/api/admin/prices/${editing._id}` : '/api/admin/prices'
    const method = isEdit ? 'PUT' : 'POST'
    try {
      const r = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      const d = await r.json()
      if (!r.ok) { setErr(d?.error || 'Save failed'); return }
      await load(); close()
    } catch { setErr('Network error') } finally { setSaving(false) }
  }

  const toggleActive = async (it) => {
    await fetch(`/api/admin/prices/${it._id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ active: !it.active }) })
    load()
  }

  const doDelete = async () => {
    if (!confirm?.id) return
    await fetch(`/api/admin/prices/${confirm.id}`, { method: 'DELETE' })
    setConfirm(null); load()
  }

  // Auto-compute dc_price preview when mrp or discount changes on the form
  const computedDc = editing ? computeFinal(editing.mrp, Number(editing.discount_percent)) : null

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Prices</h1>
          <p className="text-sm text-slate-500 mt-1">Add, edit and toggle price items. Public site updates instantly.</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button onClick={doExport} className="inline-flex items-center gap-1.5 rounded-md border border-slate-300 px-3 py-2 text-sm font-medium text-slate-800 hover:border-[#0759AD]">
            <Download className="h-4 w-4" /> Export CSV
          </button>
          <label className="inline-flex items-center gap-1.5 rounded-md border border-slate-300 px-3 py-2 text-sm font-medium text-slate-800 hover:border-[#0759AD] cursor-pointer">
            <Upload className="h-4 w-4" /> Import CSV
            <input type="file" accept=".csv" onChange={onImportPick} className="hidden" />
          </label>
          <a href="/price-list" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-md border border-slate-300 px-3 py-2 text-sm font-medium text-slate-800 hover:border-[#0759AD]">
            <ExternalLink className="h-4 w-4" /> View public
          </a>
          <button onClick={openAdd} className="inline-flex items-center gap-1.5 rounded-md bg-[#0759AD] px-4 py-2 text-sm font-semibold text-white hover:bg-[#073F80]">
            <Plus className="h-4 w-4" /> Add Price Item
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="mt-4 flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search items or categories…"
            className="w-full rounded-md border border-slate-300 pl-9 pr-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#0759AD]" />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-slate-500" />
          <select value={cat} onChange={e => setCat(e.target.value)} className="rounded-md border border-slate-300 px-2 py-2.5 text-sm bg-white">
            <option value="all">All categories</option>
            {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
          </select>
        </div>
      </div>

      {err && <div className="mt-4 flex items-start gap-2 rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700"><AlertCircle className="h-4 w-4 mt-0.5" /> {err}</div>}

      {/* Table (desktop) / cards (mobile) */}
      {loading ? (
        <div className="mt-8 flex items-center gap-2 text-slate-500"><Loader2 className="h-4 w-4 animate-spin" /> Loading…</div>
      ) : (
        <>
          <div className="hidden md:block mt-5 overflow-hidden rounded-xl border border-slate-200 bg-white">
            <table className="w-full text-[13.5px]">
              <thead className="bg-slate-50 text-slate-600 uppercase text-[11px] tracking-wider">
                <tr>
                  <th className="text-left py-3 px-4">Item</th>
                  <th className="text-left py-3 px-4">Category</th>
                  <th className="text-left py-3 px-4">Dry Clean (25% OFF)</th>
                  <th className="text-left py-3 px-4">Steam Iron</th>
                  <th className="text-left py-3 px-4">MRP</th>
                  <th className="text-center py-3 px-4">Status</th>
                  <th className="text-right py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(it => (
                  <tr key={it._id} className="border-t border-slate-100 hover:bg-slate-50/60">
                    <td className="py-3 px-4">
                      <div className="font-medium text-slate-900 flex items-center gap-2">
                        {it.name}
                        {it.special && <span className="inline-flex items-center gap-0.5 rounded px-1.5 py-0.5 bg-amber-100 text-amber-800 text-[9px] font-bold uppercase"><Sparkles className="h-3 w-3" />Special</span>}
                      </div>
                      {it.note && <div className="text-xs text-slate-500 mt-0.5">{it.note}</div>}
                    </td>
                    <td className="py-3 px-4 text-slate-600">{CATEGORIES.find(c => c.id === it.category)?.label || it.category}</td>
                    <td className="py-3 px-4 font-semibold text-[#287E1E]">₹ {it.dc_price || '—'}</td>
                    <td className="py-3 px-4 text-slate-700">₹ {it.si_price || '—'}</td>
                    <td className="py-3 px-4 text-slate-400">{it.mrp ? `₹ ${it.mrp}` : '—'}</td>
                    <td className="py-3 px-4 text-center">
                      {it.active ? <span className="inline-flex rounded-full bg-emerald-100 text-emerald-700 px-2 py-0.5 text-[11px] font-semibold">Active</span>
                                 : <span className="inline-flex rounded-full bg-slate-100 text-slate-500 px-2 py-0.5 text-[11px] font-semibold">Hidden</span>}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="inline-flex items-center gap-1">
                        <button onClick={() => toggleActive(it)} title={it.active ? 'Hide from public' : 'Show on public'}
                          className="p-1.5 rounded-md hover:bg-slate-100 text-slate-600">
                          {it.active ? <PowerOff className="h-4 w-4" /> : <Power className="h-4 w-4" />}
                        </button>
                        <button onClick={() => openEdit(it)} className="px-2.5 py-1 rounded-md text-[12px] font-semibold text-[#0759AD] hover:bg-blue-50">Edit</button>
                        <button onClick={() => setConfirm({ id: it._id, name: it.name })} className="p-1.5 rounded-md hover:bg-rose-50 text-rose-600"><Trash2 className="h-4 w-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr><td colSpan={7} className="py-10 text-center text-slate-500">No items match your filters.</td></tr>
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
                    <div className="font-semibold text-slate-900">{it.name}</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">{CATEGORIES.find(c => c.id === it.category)?.label}</div>
                  </div>
                  {it.active ? <span className="inline-flex rounded-full bg-emerald-100 text-emerald-700 px-2 py-0.5 text-[10px] font-semibold">Active</span>
                             : <span className="inline-flex rounded-full bg-slate-100 text-slate-500 px-2 py-0.5 text-[10px] font-semibold">Hidden</span>}
                </div>
                <div className="mt-3 grid grid-cols-3 gap-2 text-[12px]">
                  <div><div className="text-[9px] uppercase tracking-wider text-slate-500">25% OFF</div><div className="font-bold text-[#287E1E]">₹ {it.dc_price || '—'}</div></div>
                  <div><div className="text-[9px] uppercase tracking-wider text-slate-500">Steam Iron</div><div className="font-semibold">₹ {it.si_price || '—'}</div></div>
                  <div><div className="text-[9px] uppercase tracking-wider text-slate-400">MRP</div><div className="text-slate-500 line-through">{it.mrp ? `₹ ${it.mrp}` : '—'}</div></div>
                </div>
                <div className="mt-3 flex items-center gap-2">
                  <button onClick={() => openEdit(it)} className="flex-1 rounded-md bg-[#0759AD] px-3 py-2 text-[12px] font-semibold text-white">Edit</button>
                  <button onClick={() => toggleActive(it)} className="rounded-md border border-slate-300 px-3 py-2 text-[12px] font-medium">{it.active ? 'Hide' : 'Show'}</button>
                  <button onClick={() => setConfirm({ id: it._id, name: it.name })} className="rounded-md border border-rose-300 text-rose-600 p-2"><Trash2 className="h-4 w-4" /></button>
                </div>
              </div>
            ))}
            {filtered.length === 0 && <div className="text-center text-sm text-slate-500 py-8">No items match.</div>}
          </div>
        </>
      )}

      {/* Edit/Add drawer */}
      {showForm && editing && (
        <div className="fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/40" onClick={close} />
          <div className="relative ml-auto w-full sm:max-w-lg bg-white h-full overflow-y-auto shadow-xl">
            <div className="sticky top-0 bg-white border-b border-slate-200 px-5 py-3 flex items-center justify-between">
              <h2 className="font-semibold text-slate-900">{editing._id ? 'Edit item' : 'Add price item'}</h2>
              <button onClick={close} className="p-1.5 rounded-md hover:bg-slate-100"><X className="h-5 w-5" /></button>
            </div>
            <div className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-slate-600">Category</label>
                  <select value={editing.category} onChange={e => setEditing({ ...editing, category: e.target.value })} className="mt-1 w-full rounded-md border border-slate-300 px-2 py-2 text-sm bg-white">
                    {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-600">Service Type</label>
                  <select value={editing.service_type} onChange={e => setEditing({ ...editing, service_type: e.target.value })} className="mt-1 w-full rounded-md border border-slate-300 px-2 py-2 text-sm bg-white">
                    {SERVICE_TYPES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-slate-600">Item Name <span className="text-rose-600">*</span></label>
                <input value={editing.name} onChange={e => setEditing({ ...editing, name: e.target.value })} className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm" placeholder="e.g. Shirt / T-Shirt" />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-medium text-slate-600">MRP ₹</label>
                  <input value={editing.mrp ?? ''} onChange={e => setEditing({ ...editing, mrp: e.target.value })} className="mt-1 w-full rounded-md border border-slate-300 px-2 py-2 text-sm" placeholder="140  or  160/399" />
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-600">Discount %</label>
                  <input type="number" min="0" max="100" value={editing.discount_percent} onChange={e => setEditing({ ...editing, discount_percent: e.target.value })} className="mt-1 w-full rounded-md border border-slate-300 px-2 py-2 text-sm" />
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-600">Unit</label>
                  <input value={editing.unit} onChange={e => setEditing({ ...editing, unit: e.target.value })} className="mt-1 w-full rounded-md border border-slate-300 px-2 py-2 text-sm" placeholder="Per Piece" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-slate-600">Dry Clean (25% OFF) ₹</label>
                  <input value={editing.dc_price} onChange={e => setEditing({ ...editing, dc_price: e.target.value })} className="mt-1 w-full rounded-md border border-slate-300 px-2 py-2 text-sm" placeholder={computedDc ? `Suggested: ${computedDc}` : ''} />
                  {computedDc && !String(editing.mrp).includes('/') && (
                    <div className="mt-1 text-[11px] text-slate-500">
                      Auto-calculated: <button type="button" onClick={() => setEditing({ ...editing, dc_price: computedDc })} className="font-semibold text-[#287E1E] hover:underline">Use ₹ {computedDc}</button>
                    </div>
                  )}
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-600">Steam Iron ₹</label>
                  <input value={editing.si_price} onChange={e => setEditing({ ...editing, si_price: e.target.value })} className="mt-1 w-full rounded-md border border-slate-300 px-2 py-2 text-sm" placeholder="49" />
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-slate-600">Short Note</label>
                <input value={editing.note} onChange={e => setEditing({ ...editing, note: e.target.value })} className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm" placeholder="Optional note visible to admin" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-slate-600">Display Order</label>
                  <input type="number" value={editing.display_order} onChange={e => setEditing({ ...editing, display_order: e.target.value })} className="mt-1 w-full rounded-md border border-slate-300 px-2 py-2 text-sm" />
                </div>
                <div className="flex items-end gap-4">
                  <label className="inline-flex items-center gap-2 text-sm">
                    <input type="checkbox" checked={!!editing.active} onChange={e => setEditing({ ...editing, active: e.target.checked })} /> Active
                  </label>
                  <label className="inline-flex items-center gap-2 text-sm">
                    <input type="checkbox" checked={!!editing.special} onChange={e => setEditing({ ...editing, special: e.target.checked })} /> Special
                  </label>
                </div>
              </div>
              <p className="text-[11px] text-slate-500">For variants (e.g. Plain / Embroidered) separate the two prices with a <span className="font-mono">/</span>. Example MRP: <span className="font-mono">160 / 399</span>.</p>
            </div>
            <div className="sticky bottom-0 bg-white border-t border-slate-200 px-5 py-3 flex gap-2">
              <button onClick={close} className="flex-1 rounded-md border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-800">Cancel</button>
              <button onClick={save} disabled={saving} className="flex-1 inline-flex items-center justify-center gap-2 rounded-md bg-[#0759AD] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#073F80] disabled:opacity-60">
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirm */}
      {confirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setConfirm(null)} />
          <div className="relative w-full max-w-sm rounded-2xl bg-white p-5 shadow-xl">
            <h3 className="text-lg font-bold text-slate-900">Delete this item?</h3>
            <p className="mt-1 text-sm text-slate-600">“{confirm.name}” will be permanently removed from the price list. Consider using Hide instead for a reversible change.</p>
            <div className="mt-4 flex gap-2">
              <button onClick={() => setConfirm(null)} className="flex-1 rounded-md border border-slate-300 px-4 py-2.5 text-sm font-semibold">Cancel</button>
              <button onClick={doDelete} className="flex-1 rounded-md bg-rose-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-rose-700">Delete</button>
            </div>
          </div>
        </div>
      )}
      {/* CSV Import preview modal */}
      {importPreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setImportPreview(null)} />
          <div className="relative w-full max-w-2xl max-h-[85vh] rounded-2xl bg-white shadow-xl flex flex-col">
            <div className="px-5 py-3 border-b">
              <h3 className="font-semibold text-lg">CSV Import Preview</h3>
              <p className="text-sm text-slate-500">Total rows: {importPreview.total} · New: {importPreview.newRows.length} · Updates: {importPreview.updates.length} · Unchanged: {importPreview.unchanged.length} · Errors: {importPreview.errors.length}</p>
            </div>
            <div className="overflow-y-auto p-5 space-y-3">
              {importPreview.errors.length > 0 && (
                <div className="rounded-md border border-rose-200 bg-rose-50 p-3">
                  <div className="text-sm font-semibold text-rose-800">Errors (import will be blocked):</div>
                  <ul className="mt-1.5 text-[12px] text-rose-700 space-y-0.5">{importPreview.errors.map((e, i) => <li key={i}>Row {e.row}: {e.error}</li>)}</ul>
                </div>
              )}
              {importPreview.newRows.length > 0 && (
                <div><div className="text-sm font-semibold mb-1.5">New items ({importPreview.newRows.length})</div><ul className="text-[12px] text-slate-700 space-y-0.5">{importPreview.newRows.map((n, i) => <li key={i} className="truncate">Row {n.row}: <b>{n.next.name}</b> — {n.next.category}, ₹{n.next.dc_price || '—'}</li>)}</ul></div>
              )}
              {importPreview.updates.length > 0 && (
                <div><div className="text-sm font-semibold mb-1.5">Updates ({importPreview.updates.length})</div><ul className="text-[12px] text-slate-700 space-y-0.5">{importPreview.updates.map((u, i) => <li key={i} className="truncate">Row {u.row}: <b>{u.current.name}</b> — DC ₹{u.current.dc_price || '—'} → ₹{u.next.dc_price || '—'}</li>)}</ul></div>
              )}
            </div>
            <div className="px-5 py-3 border-t flex gap-2">
              <button onClick={() => setImportPreview(null)} className="flex-1 rounded-md border border-slate-300 px-4 py-2.5 text-sm font-semibold">Cancel</button>
              <button onClick={commitImport} disabled={importing || importPreview.errors.length > 0} className="flex-1 inline-flex items-center justify-center gap-2 rounded-md bg-[#0759AD] px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-50">
                {importing ? <Loader2 className="h-4 w-4 animate-spin" /> : null} Confirm Import
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
