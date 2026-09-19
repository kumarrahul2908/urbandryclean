'use client'
import { useState } from 'react'
import { Loader2, AlertCircle, CheckCircle2, ShieldCheck, Copy } from 'lucide-react'

/**
 * Meta / WhatsApp API compliant Data Deletion form.
 * Submits to POST /api/data-deletion and returns a confirmation code.
 */
export default function DataDeletionForm() {
  const [form, setForm] = useState({ name: '', phone: '', email: '', reason: '', consent: false })
  const [errors, setErrors] = useState({})
  const [err, setErr] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(null)

  const update = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }))

  const submit = async (e) => {
    e.preventDefault()
    if (submitting) return
    const errs = {}
    const phone = form.phone.trim()
    const email = form.email.trim()
    if (!phone && !email) errs.phone = 'Please provide either mobile number or email.'
    if (phone && !/^[+0-9\s\-()]{8,}$/.test(phone)) errs.phone = 'Please enter a valid mobile number.'
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = 'Please enter a valid email address.'
    if (!form.consent) errs.consent = 'Please tick the consent box to proceed.'
    setErrors(errs)
    if (Object.keys(errs).length) return
    setSubmitting(true); setErr('')
    try {
      const res = await fetch('/api/data-deletion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: form.name.trim(), phone, email, reason: form.reason.trim(), consent: true }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) { setErr(data?.error || 'Could not submit. Please try again.'); setSubmitting(false); return }
      setDone(data); setSubmitting(false)
    } catch {
      setErr('Network error. Please try again.'); setSubmitting(false)
    }
  }

  const copyCode = () => {
    if (done?.confirmation_code) navigator.clipboard?.writeText(done.confirmation_code).catch(() => {})
  }

  if (done) {
    return (
      <div className="p-6">
        <div className="mx-auto h-14 w-14 rounded-full flex items-center justify-center" style={{ background: '#EAF5E6' }}>
          <CheckCircle2 className="h-8 w-8" style={{ color: '#287E1E' }} />
        </div>
        <h3 className="mt-4 text-lg font-bold text-[#13233A] text-center">Request received</h3>
        <p className="mt-2 text-sm text-slate-600 text-center">
          {done.message || 'We have received your data-deletion request. Our team will process it within 30 days.'}
        </p>
        <div className="mt-5 rounded-lg border border-slate-200 bg-slate-50 p-3">
          <div className="text-[11px] font-semibold uppercase tracking-widest text-slate-500">Your confirmation code</div>
          <div className="mt-1 flex items-center justify-between gap-3">
            <code className="text-base font-mono font-semibold text-[#13233A]">{done.confirmation_code}</code>
            <button onClick={copyCode} className="inline-flex items-center gap-1.5 rounded-md border border-slate-300 px-2.5 py-1 text-[12px] font-semibold text-slate-700 hover:border-[#0759AD] hover:text-[#0759AD]">
              <Copy className="h-3.5 w-3.5" /> Copy
            </button>
          </div>
          <p className="mt-2 text-[12px] text-slate-500">Save this code. Reference it in any follow-up with our team.</p>
        </div>
        <div className="mt-5 text-center">
          <button
            onClick={() => { setDone(null); setForm({ name: '', phone: '', email: '', reason: '', consent: false }) }}
            className="text-sm font-semibold text-[#0759AD] hover:underline"
          >
            Submit another request
          </button>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={submit} className="p-5 space-y-4" noValidate>
      {err && (
        <div className="flex items-start gap-2 rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
          <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" /> <span>{err}</span>
        </div>
      )}
      <div className="rounded-md border border-blue-200 bg-blue-50 px-3 py-2 text-[12.5px] text-blue-900">
        Please provide <strong>at least one</strong> of mobile number or email so we can locate and delete your data.
      </div>

      <div>
        <label htmlFor="dd-phone" className="block text-xs font-medium text-slate-700">Mobile / WhatsApp Number</label>
        <input
          id="dd-phone" type="tel" inputMode="tel" autoComplete="tel"
          value={form.phone} onChange={update('phone')} placeholder="+91 …"
          className={`mt-1 w-full rounded-md border px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0759AD] ${errors.phone ? 'border-rose-400' : 'border-slate-300'}`}
        />
        {errors.phone && <p className="mt-1 text-xs text-rose-600">{errors.phone}</p>}
        <p className="mt-1 text-[11px] text-slate-500">The number you used with us on WhatsApp / for pickups.</p>
      </div>

      <div>
        <label htmlFor="dd-email" className="block text-xs font-medium text-slate-700">Email Address</label>
        <input
          id="dd-email" type="email" autoComplete="email"
          value={form.email} onChange={update('email')} placeholder="you@example.com"
          className={`mt-1 w-full rounded-md border px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0759AD] ${errors.email ? 'border-rose-400' : 'border-slate-300'}`}
        />
        {errors.email && <p className="mt-1 text-xs text-rose-600">{errors.email}</p>}
      </div>

      <div>
        <label htmlFor="dd-name" className="block text-xs font-medium text-slate-700">Full Name <span className="text-slate-400">(optional)</span></label>
        <input
          id="dd-name" type="text" autoComplete="name" value={form.name} onChange={update('name')}
          className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0759AD]"
        />
      </div>

      <div>
        <label htmlFor="dd-reason" className="block text-xs font-medium text-slate-700">Additional notes <span className="text-slate-400">(optional)</span></label>
        <textarea
          id="dd-reason" rows={3} value={form.reason} onChange={update('reason')} maxLength={1000}
          placeholder="e.g., specific records to delete, reason for request…"
          className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0759AD]"
        />
      </div>

      <label className={`flex items-start gap-2.5 rounded-md border p-3 text-[13px] text-slate-700 cursor-pointer ${errors.consent ? 'border-rose-400 bg-rose-50/40' : 'border-slate-200'}`}>
        <input type="checkbox" checked={form.consent} onChange={update('consent')}
          className="mt-0.5 h-4 w-4 rounded border-slate-300 text-[#0759AD] focus:ring-[#0759AD]" />
        <span>
          I confirm that I want Urban Dry Clean to delete the personal information associated with the details above,
          subject to any records legally required to be retained. I understand this action cannot be undone.
        </span>
      </label>
      {errors.consent && <p className="-mt-2 text-xs text-rose-600">{errors.consent}</p>}

      <button
        type="submit" disabled={submitting}
        className="w-full inline-flex items-center justify-center gap-2 rounded-md px-4 py-3 text-sm font-semibold text-white shadow-sm disabled:opacity-70"
        style={{ background: '#0759AD' }}
      >
        {submitting ? <><Loader2 className="h-4 w-4 animate-spin" /> Submitting…</> : <><ShieldCheck className="h-4 w-4" /> Submit Deletion Request</>}
      </button>
      <p className="text-[11px] text-slate-500 text-center">We will confirm receipt and complete deletion within 30 days.</p>
    </form>
  )
}
