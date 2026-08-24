'use client'
import { useEffect, useState } from 'react'
import { Save, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react'

const FIELDS = [
  { k: 'business_name', label: 'Business Name' },
  { k: 'phone', label: 'Phone' },
  { k: 'whatsapp', label: 'WhatsApp Number' },
  { k: 'address_line1', label: 'Address Line 1' },
  { k: 'address_line2', label: 'Address Line 2' },
  { k: 'city', label: 'City' },
  { k: 'state', label: 'State' },
  { k: 'pin', label: 'PIN Code' },
  { k: 'service_area', label: 'Service Area' },
  { k: 'website', label: 'Website URL' },
  { k: 'maps_url', label: 'Google Maps URL' },
  { k: 'hours', label: 'Business Hours' },
]

export default function AdminSettingsPage() {
  const [form, setForm] = useState(null); const [saving, setSaving] = useState(false); const [msg, setMsg] = useState(''); const [err, setErr] = useState('')

  useEffect(() => {
    fetch('/api/admin/settings', { cache: 'no-store' }).then(async r => {
      if (r.status === 401) { window.location.href='/admin/login?next=/admin/settings'; return }
      const d = await r.json(); setForm(d.settings || {})
    })
  }, [])

  const save = async () => {
    setSaving(true); setErr(''); setMsg('')
    const r = await fetch('/api/admin/settings', { method: 'PUT', headers: {'Content-Type':'application/json'}, body: JSON.stringify(form) })
    const d = await r.json(); setSaving(false)
    if (!r.ok) { setErr(d?.error || 'Save failed'); return }
    setMsg('Saved. Public site will show updated info within a few seconds.')
    setTimeout(() => setMsg(''), 4000)
  }

  if (!form) return <div className="p-8 text-slate-500"><Loader2 className="h-4 w-4 animate-spin inline" /> Loading…</div>

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-3xl mx-auto">
      <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Business Settings</h1>
      <p className="text-sm text-slate-500 mt-1">These values power the footer, contact page, address blocks and Schema.org structured data.</p>
      {msg && <div className="mt-4 flex items-center gap-2 text-sm text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-md px-3 py-2"><CheckCircle2 className="h-4 w-4" />{msg}</div>}
      {err && <div className="mt-4 flex items-center gap-2 text-sm text-rose-700 bg-rose-50 border border-rose-200 rounded-md px-3 py-2"><AlertCircle className="h-4 w-4" />{err}</div>}
      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 space-y-4">
        {FIELDS.map(f => (
          <div key={f.k}>
            <label className="text-xs font-medium text-slate-600">{f.label}</label>
            <input value={form[f.k] || ''} onChange={e=>setForm({ ...form, [f.k]: e.target.value })} className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2.5 text-sm" />
          </div>
        ))}
      </div>
      <div className="mt-4 flex justify-end"><button onClick={save} disabled={saving} className="inline-flex items-center gap-2 rounded-md bg-[#0759AD] px-5 py-2.5 text-sm font-semibold text-white">{saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Save Settings</button></div>
    </div>
  )
}
