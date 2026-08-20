'use client'

import Link from 'next/link'
import { BUSINESS, waLink } from '@/lib/business'
import { NAV, BRAND } from '@/lib/nav'
import SiteLogo from './SiteLogo'

export default function SiteFooter() {
  return (
    <footer className="pt-14 pb-24 md:pb-14 text-slate-300" style={{ background: BRAND.navy }}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid gap-8 md:grid-cols-4">
        <div className="md:col-span-2">
          <SiteLogo dark />
          <p className="mt-4 text-sm text-slate-400 max-w-md leading-relaxed">
            Premium Dry Cleaning Service &mdash; professional garment care, quality finishing and convenient pickup &amp; delivery in {BUSINESS.serviceArea}.
          </p>
        </div>
        <div>
          <div className="text-sm font-semibold text-white">Quick Links</div>
          <ul className="mt-3 space-y-2 text-sm">
            {NAV.map(n => (
              <li key={n.href}><Link href={n.href} className="hover:text-white">{n.label}</Link></li>
            ))}
          </ul>
        </div>
        <div>
          <div className="text-sm font-semibold text-white">Contact</div>
          <ul className="mt-3 space-y-2 text-sm">
            <li><a href={`tel:${BUSINESS.phoneRaw}`} className="hover:text-white">{BUSINESS.phone}</a></li>
            <li><a href={waLink()} target="_blank" rel="noopener noreferrer" className="hover:text-white">WhatsApp us</a></li>
            <li className="text-slate-400 leading-relaxed">{BUSINESS.address.line1},<br />{BUSINESS.address.line2},<br />{BUSINESS.address.line3}</li>
          </ul>
        </div>
      </div>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-10 pt-6 border-t border-white/10 text-xs text-slate-400 flex flex-col md:flex-row items-center justify-between gap-2">
        <div>&copy; 2026 Urban Dry Clean. All rights reserved.</div>
        <div>Made with care in {BUSINESS.serviceArea}</div>
      </div>
    </footer>
  )
}
