'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Phone, MessageCircle, Menu, X } from 'lucide-react'
import { BUSINESS, waLink } from '@/lib/business'
import { NAV, BRAND } from '@/lib/nav'
import SiteLogo from './SiteLogo'
import BookPickupModal from './BookPickupModal'

export default function SiteHeader() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [pickupOpen, setPickupOpen] = useState(false)
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    window.addEventListener('scroll', onScroll); onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className={`sticky top-0 z-50 w-full backdrop-blur bg-white/90 transition-shadow ${scrolled ? 'shadow-[0_1px_0_0_#e5eefc,0_8px_24px_-16px_rgba(19,35,58,.25)]' : 'border-b border-slate-100'}`}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-24 items-center justify-between">
          <Link href="/" aria-label="Urban Dry Clean home"><SiteLogo /></Link>
          <nav className="hidden xl:flex items-center gap-6">
            {NAV.map(n => (
              <Link key={n.href} href={n.href} className="nav-link text-[14px] font-medium text-slate-700 hover:text-[#0759AD]">{n.label}</Link>
            ))}
          </nav>
          <div className="hidden lg:flex items-center gap-2">
            <a href={`tel:${BUSINESS.phoneRaw}`} data-analytics="phone_click" className="inline-flex items-center gap-2 rounded-md border border-slate-200 px-3.5 py-2 text-sm font-medium text-slate-800 hover:border-[#0759AD] hover:text-[#0759AD]">
              <Phone className="h-4 w-4" /> Call Now
            </a>
            <button type="button" onClick={() => setPickupOpen(true)} data-analytics="book_pickup_click" className="inline-flex items-center gap-2 rounded-md px-3.5 py-2 text-sm font-semibold text-white shadow-sm" style={{ background: BRAND.green }}>
              <MessageCircle className="h-4 w-4" /> Book Pickup
            </button>
          </div>
          <button onClick={() => setOpen(o => !o)} className="xl:hidden inline-flex items-center justify-center rounded-md p-2 text-slate-700 hover:bg-slate-100" aria-label="Toggle menu">
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>
      {open && (
        <div className="xl:hidden border-t border-slate-100 bg-white">
          <div className="px-4 py-3 flex flex-col">
            {NAV.map(n => (
              <Link key={n.href} href={n.href} onClick={() => setOpen(false)} className="py-2.5 text-[15px] font-medium text-slate-800">{n.label}</Link>
            ))}
            <div className="grid grid-cols-2 gap-2 pt-3 pb-1">
              <a href={`tel:${BUSINESS.phoneRaw}`} data-analytics="phone_click" className="inline-flex items-center justify-center gap-2 rounded-md border border-slate-200 px-3 py-2 text-sm font-medium"><Phone className="h-4 w-4" /> Call</a>
              <button type="button" onClick={() => { setOpen(false); setPickupOpen(true) }} data-analytics="book_pickup_click" className="inline-flex items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-semibold text-white" style={{ background: BRAND.green }}><MessageCircle className="h-4 w-4" /> Book Pickup</button>
            </div>
          </div>
        </div>
      )}
      <BookPickupModal open={pickupOpen} onClose={() => setPickupOpen(false)} />
    </header>
  )
}
