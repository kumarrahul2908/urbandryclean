'use client'
import { useState, useEffect } from 'react'
import { X, Loader2, CheckCircle2, AlertCircle, MessageCircle } from 'lucide-react'

export default function BookPickupModal({ open, onClose }) {
  const [form, setForm] = useState({ name: '', phone: '', address: '', date: '', time: '' })
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)
  const [err, setErr] = useState('')

  useEffect(() => {
    if (open) {
      setForm({ name: '', phone: '', address: '', date: '', time: '' })
      setErrors({}); setDone(false); setErr(''); setSubmitting(false)
    }
  }, [open])

  useEffect(() => {
    if (!open) return
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = '' }
  }, [open, onClose])

  if (!open) return null

  const update = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }))

  const submit = async (e) => {
    e.preventDefault()
    if (submitting) return
    const phone = form.phone.trim()
    const errs = {}
    if (!phone) errs.phone = 'Mobile number is required'
    else if (!/^[+0-9\s\-()]{8,}$/.test(phone)) errs.phone = 'Please enter a valid mobile number'
    setErrors(errs)
    if (Object.keys(errs).length) return
    setSubmitting(true); setErr('')
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name.trim(),
          phone,
          address: form.address.trim(),
          date: form.date,
          time: form.time,
          source: 'header_form',
        }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) { setErr(data?.error || 'Could not submit. Please try again.'); setSubmitting(false); return }
      setDone(true); setSubmitting(false)
    } catch (e2) {
      setErr('Network error. Please try again.'); setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center px-4" role="dialog" aria-modal="true" aria-label="Book Pickup">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative w-full max-w-md rounded-2xl bg-white shadow-xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100">
          <h2 className="text-lg font-bold text-[#13233A]">Book a Pickup</h2>
          <button onClick={onClose} aria-label="Close" className="p-1.5 rounded-md hover:bg-slate-100"><X className="h-5 w-5" /></button>
        </div>

        {done ? (
          <div className="p-6 text-center">
            <div className="mx-auto h-14 w-14 rounded-full flex items-center justify-center" style={{ background: '#EAF5E6' }}>
              <CheckCircle2 className="h-8 w-8" style={{ color: '#287E1E' }} />
            </div>
            <h3 className="mt-4 text-lg font-bold text-[#13233A]">Thank you!</h3>
            <p className="mt-2 text-sm text-slate-600">Your pickup request has been received. Our team will contact you shortly.</p>
            <div className="mt-5 flex flex-col sm:flex-row gap-2">
              <button onClick={onClose} className="flex-1 rounded-md border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-800">Close</button>
              <a href="https://wa.me/919710108181?text=Hello%20Urban%20Dry%20Clean%2C%20I%20would%20like%20to%20book%20a%20pickup.%20Please%20share%20the%20pickup%20details." target="_blank" rel="noopener noreferrer"
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-md px-4 py-2.5 text-sm font-semibold text-white" style={{ background: '#42A62B' }}>
                <MessageCircle className="h-4 w-4" /> Also message on WhatsApp
              </a>
            </div>
          </div>
        ) : (
          <form onSubmit={submit} className="p-5 space-y-3.5" noValidate>
            {err && (
              <div className="flex items-start gap-2 rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
                <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" /> <span>{err}</span>
              </div>
            )}
            <div>
              <label htmlFor="bp-phone" className="block text-xs font-medium text-slate-700">Mobile Number <span className="text-rose-600">*</span></label>
              <input id="bp-phone" type="tel" inputMode="tel" autoComplete="tel" required value={form.phone} onChange={update('phone')}
                placeholder="+91 …"
                className={`mt-1 w-full rounded-md border px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0759AD] ${errors.phone ? 'border-rose-400' : 'border-slate-300'}`} />
              {errors.phone && <p className="mt-1 text-xs text-rose-600">{errors.phone}</p>}
            </div>
            <div>
              <label htmlFor="bp-name" className="block text-xs font-medium text-slate-700">Name <span className="text-slate-400">(optional)</span></label>
              <input id="bp-name" type="text" autoComplete="name" value={form.name} onChange={update('name')}
                className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0759AD]" />
            </div>
            <div>
              <label htmlFor="bp-addr" className="block text-xs font-medium text-slate-700">Pickup Address <span className="text-slate-400">(optional)</span></label>
              <textarea id="bp-addr" rows={2} value={form.address} onChange={update('address')}
                className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0759AD]" />
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label htmlFor="bp-date" className="block text-xs font-medium text-slate-700">Pickup Date</label>
                <input id="bp-date" type="date" value={form.date} onChange={update('date')}
                  className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0759AD]" />
              </div>
              <div>
                <label htmlFor="bp-time" className="block text-xs font-medium text-slate-700">Pickup Time</label>
                <input id="bp-time" type="time" value={form.time} onChange={update('time')}
                  className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0759AD]" />
              </div>
            </div>
            <button type="submit" disabled={submitting}
              className="w-full inline-flex items-center justify-center gap-2 rounded-md px-4 py-3 text-sm font-semibold text-white shadow-sm disabled:opacity-70"
              style={{ background: '#42A62B' }}>
              {submitting ? <><Loader2 className="h-4 w-4 animate-spin" /> Submitting…</> : 'Submit Pickup Request'}
            </button>
            <p className="text-[11px] text-slate-500 text-center">We&rsquo;ll call/WhatsApp you back to confirm the pickup.</p>
          </form>
        )}
      </div>
    </div>
  )
}
