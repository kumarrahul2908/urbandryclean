'use client'
import { useEffect, useState } from 'react'
import { Loader2, Filter } from 'lucide-react'

function fmt(d) { try { return new Date(d).toLocaleString('en-IN') } catch { return String(d) } }
const COLORS = { login:'bg-emerald-100 text-emerald-700', logout:'bg-slate-100 text-slate-600', price_created:'bg-blue-100 text-blue-700', price_updated:'bg-blue-100 text-blue-700', price_deleted:'bg-rose-100 text-rose-700', price_restored:'bg-amber-100 text-amber-700', bulk_update:'bg-indigo-100 text-indigo-700', csv_export:'bg-slate-100 text-slate-700', csv_import:'bg-indigo-100 text-indigo-700', service_created:'bg-blue-100 text-blue-700', service_updated:'bg-blue-100 text-blue-700', service_deleted:'bg-rose-100 text-rose-700', faq_created:'bg-blue-100 text-blue-700', faq_updated:'bg-blue-100 text-blue-700', faq_deleted:'bg-rose-100 text-rose-700', promotion_created:'bg-blue-100 text-blue-700', promotion_updated:'bg-blue-100 text-blue-700', promotion_deleted:'bg-rose-100 text-rose-700', settings_updated:'bg-slate-200 text-slate-700', password_changed:'bg-amber-100 text-amber-700' }

export default function AuditLogPage() {
  const [items, setItems] = useState([]); const [loading, setLoading] = useState(true); const [action, setAction] = useState('')

  const load = async () => {
    setLoading(true)
    const url = `/api/admin/audit-log${action ? `?action=${encodeURIComponent(action)}` : ''}`
    const r = await fetch(url, { cache:'no-store' })
    if (r.status === 401) { window.location.href='/admin/login?next=/admin/audit-log'; return }
    const d = await r.json(); setItems(d.items || []); setLoading(false)
  }
  useEffect(() => { load() }, [action])

  const actions = Array.from(new Set(items.map(i => i.action))).sort()

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto">
      <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Audit Log</h1>
      <p className="text-sm text-slate-500 mt-1">Last 500 admin actions. Passwords are never logged.</p>
      <div className="mt-4 flex items-center gap-2"><Filter className="h-4 w-4 text-slate-500" /><select value={action} onChange={e=>setAction(e.target.value)} className="rounded-md border border-slate-300 px-2 py-2 text-sm bg-white"><option value="">All actions</option>{actions.map(a=><option key={a} value={a}>{a}</option>)}</select></div>
      {loading ? <div className="mt-6 text-slate-500"><Loader2 className="h-4 w-4 animate-spin inline" /> Loading…</div> : (
        <div className="mt-4 overflow-hidden rounded-xl border border-slate-200 bg-white">
          <table className="w-full text-[13px]">
            <thead className="bg-slate-50 text-slate-600 uppercase text-[11px]"><tr><th className="text-left py-2.5 px-3">When</th><th className="text-left py-2.5 px-3">Action</th><th className="text-left py-2.5 px-3">By</th><th className="text-left py-2.5 px-3">Details</th></tr></thead>
            <tbody>
              {items.map(a => (
                <tr key={a._id} className="border-t border-slate-100">
                  <td className="py-2.5 px-3 text-slate-600 whitespace-nowrap">{fmt(a.at)}</td>
                  <td className="py-2.5 px-3"><span className={`inline-flex rounded-full px-2 py-0.5 text-[11px] font-semibold ${COLORS[a.action] || 'bg-slate-100 text-slate-700'}`}>{a.action}</span></td>
                  <td className="py-2.5 px-3 text-slate-700">{a.user || '—'}</td>
                  <td className="py-2.5 px-3 text-[12px] text-slate-500">{a.name || a.target || ''}{a.count ? ` (${a.count} items)` : ''}{a.op ? ` · op: ${a.op}` : ''}{a.applied ? ` · applied: ${a.applied}` : ''}{a.fields ? ` · ${a.fields.join(', ')}` : ''}</td>
                </tr>
              ))}
              {items.length === 0 && <tr><td colSpan={4} className="py-8 text-center text-slate-500">No entries.</td></tr>}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
