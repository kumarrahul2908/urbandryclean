'use client'
import { useState } from 'react'
import { Save, Loader2, AlertCircle, CheckCircle2, ShieldCheck } from 'lucide-react'

function score(pw) {
  const checks = [pw.length >= 12, /[A-Z]/.test(pw), /[a-z]/.test(pw), /[0-9]/.test(pw), /[^A-Za-z0-9]/.test(pw)]
  return { count: checks.filter(Boolean).length, checks }
}

export default function ChangePasswordPage() {
  const [current, setCurrent] = useState(''); const [next, setNext] = useState(''); const [confirmPw, setConfirmPw] = useState('')
  const [saving, setSaving] = useState(false); const [err, setErr] = useState(''); const [ok, setOk] = useState('')

  const s = score(next)
  const match = next && next === confirmPw

  const submit = async (e) => {
    e.preventDefault(); setErr(''); setOk('')
    if (!match) { setErr('Passwords do not match'); return }
    if (s.count < 5) { setErr('Password does not meet all requirements'); return }
    setSaving(true)
    const r = await fetch('/api/admin/change-password', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ current, next }) })
    const d = await r.json(); setSaving(false)
    if (!r.ok) { setErr(d?.error || 'Change failed'); return }
    setOk('Password changed. Redirecting to login…')
    setTimeout(() => { window.location.href = '/admin/login' }, 1500)
  }

  const bullets = [
    { ok: s.checks[0], t: 'At least 12 characters' },
    { ok: s.checks[1], t: 'One uppercase letter' },
    { ok: s.checks[2], t: 'One lowercase letter' },
    { ok: s.checks[3], t: 'One number' },
    { ok: s.checks[4], t: 'One special character' },
  ]

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-lg mx-auto">
      <h1 className="text-2xl md:text-3xl font-bold text-slate-900 flex items-center gap-2"><ShieldCheck className="h-6 w-6 text-[#0759AD]" /> Change Password</h1>
      <p className="text-sm text-slate-500 mt-1">After a successful change, existing sessions are ended and you&rsquo;ll be redirected to log in again.</p>
      <form onSubmit={submit} className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 space-y-4">
        {err && <div className="flex items-center gap-2 text-sm text-rose-700 bg-rose-50 border border-rose-200 rounded-md px-3 py-2"><AlertCircle className="h-4 w-4" />{err}</div>}
        {ok && <div className="flex items-center gap-2 text-sm text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-md px-3 py-2"><CheckCircle2 className="h-4 w-4" />{ok}</div>}
        <div><label className="text-xs font-medium text-slate-600">Current Password</label><input type="password" value={current} onChange={e=>setCurrent(e.target.value)} required className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2.5 text-sm" /></div>
        <div><label className="text-xs font-medium text-slate-600">New Password</label><input type="password" value={next} onChange={e=>setNext(e.target.value)} required className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2.5 text-sm" /></div>
        <div><label className="text-xs font-medium text-slate-600">Confirm New Password</label><input type="password" value={confirmPw} onChange={e=>setConfirmPw(e.target.value)} required className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2.5 text-sm" />{confirmPw && !match && <div className="mt-1 text-xs text-rose-600">Passwords do not match</div>}</div>
        <div className="rounded-md bg-slate-50 border border-slate-200 p-3">
          <div className="text-[11px] font-semibold uppercase text-slate-600 mb-2">Requirements</div>
          <ul className="space-y-1">{bullets.map(b => <li key={b.t} className={`text-[12px] flex items-center gap-1.5 ${b.ok ? 'text-emerald-700' : 'text-slate-500'}`}><span className={`inline-block h-1.5 w-1.5 rounded-full ${b.ok ? 'bg-emerald-600' : 'bg-slate-300'}`} />{b.t}</li>)}</ul>
        </div>
        <button type="submit" disabled={saving} className="w-full inline-flex items-center justify-center gap-2 rounded-md bg-[#0759AD] px-4 py-2.5 text-sm font-semibold text-white">{saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Change Password</button>
      </form>
    </div>
  )
}
