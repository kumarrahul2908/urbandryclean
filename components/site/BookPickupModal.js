'use client'
import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'
import PickupForm from './PickupForm'

export default function BookPickupModal({ open, onClose }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  useEffect(() => {
    if (!open) return
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = '' }
  }, [open, onClose])

  if (!open || !mounted) return null

  // Rendered via a portal at <body> so ancestor `backdrop-filter`
  // (in the site header) doesn't break `position: fixed` (CSS containing block issue).
  // Header is h-24 (96px). Modal sits ~pt-24 below with an outer scroll for short screens.
  const node = (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center px-4 pt-24 sm:pt-28 pb-6 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-label="Book Pickup"
    >
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className="relative w-full max-w-md rounded-2xl bg-white shadow-xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100">
          <h2 className="text-lg font-bold text-[#13233A]">Book a Pickup</h2>
          <button onClick={onClose} aria-label="Close" className="p-1.5 rounded-md hover:bg-slate-100"><X className="h-5 w-5" /></button>
        </div>
        <PickupForm source="header_form" />
      </div>
    </div>
  )

  return createPortal(node, document.body)
}
