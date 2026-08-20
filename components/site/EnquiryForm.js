'use client'

import { useState } from 'react'
import { MessageCircle, Send } from 'lucide-react'
import { BUSINESS, waLink } from '@/lib/business'
import { SERVICES } from '@/lib/services'

export default function EnquiryForm() {
  const [form, setForm] = useState({ name: '', phone: '', service: '', message: '' })
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)

  const update = (k) => (e) => setForm({ ...form, [k]: e.target.value })

  const submit = (e) => {
    e.preventDefault()
    const errs = {}
    if (!form.name.trim()) errs.name = 'Please enter your name'
    if (!form.phone.trim() || form.phone.trim().length < 6) errs.phone = 'Please enter a valid phone number'
    if (!form.service) errs.service = 'Please select a service'
    setErrors(errs)
    if (Object.keys(errs).length) return

    setSubmitting(true)
    const msg = `Hello Urban Dry Clean, I would like to enquire.\n\nName: ${form.name}\nPhone: ${form.phone}\nService: ${form.service}${form.message ? `\nMessage: ${form.message}` : ''}`
    // Fire a delegated analytics click event via a hidden anchor click
    try {
      const el = document.createElement('a')
      el.setAttribute('data-analytics', 'contact_form_submit')
      el.href = waLink(msg)
      el.target = '_blank'
      el.rel = 'noopener noreferrer'
      document.body.appendChild(el)
      el.click()
      document.body.removeChild(el)
    } catch (_) {
      window.open(waLink(msg), '_blank')
    }
    setSubmitting(false)
  }

  return (
    <form onSubmit={submit} className="rounded-2xl border border-slate-200 bg-white p-6 md:p-7 shadow-sm space-y-4">
      <div>
        <label className="block text-sm font-medium text-slate-800">Name <span className="text-rose-600">*</span></label>
        <input type="text" value={form.name} onChange={update('name')} placeholder="Your full name"
          className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2.5 text-[14.5px] focus:outline-none focus:ring-2 focus:ring-[#0759AD]" />
        {errors.name && <p className="mt-1 text-xs text-rose-600">{errors.name}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-800">Phone Number <span className="text-rose-600">*</span></label>
        <input type="tel" value={form.phone} onChange={update('phone')} placeholder="+91 …"
          className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2.5 text-[14.5px] focus:outline-none focus:ring-2 focus:ring-[#0759AD]" />
        {errors.phone && <p className="mt-1 text-xs text-rose-600">{errors.phone}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-800">Service <span className="text-rose-600">*</span></label>
        <select value={form.service} onChange={update('service')}
          className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2.5 text-[14.5px] focus:outline-none focus:ring-2 focus:ring-[#0759AD] bg-white">
          <option value="">Select a service…</option>
          {SERVICES.map(s => <option key={s.slug} value={s.name}>{s.name}</option>)}
          <option value="General Enquiry">General Enquiry</option>
        </select>
        {errors.service && <p className="mt-1 text-xs text-rose-600">{errors.service}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-800">Message</label>
        <textarea rows={4} value={form.message} onChange={update('message')} placeholder="Any details about your items or preferred pickup time…"
          className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2.5 text-[14.5px] focus:outline-none focus:ring-2 focus:ring-[#0759AD]" />
      </div>
      <button type="submit" disabled={submitting}
        className="inline-flex w-full items-center justify-center gap-2 rounded-md px-5 py-3 text-sm font-semibold text-white shadow-sm disabled:opacity-70"
        style={{ background: '#42A62B' }}>
        <MessageCircle className="h-4 w-4" /> Send Enquiry on WhatsApp
      </button>
      <p className="text-[11px] text-slate-500 text-center">By submitting, you will be redirected to WhatsApp with your enquiry pre-filled.</p>
    </form>
  )
}
