'use client'

import Link from 'next/link'
import { Phone, MessageCircle, ListChecks } from 'lucide-react'
import { BUSINESS, waLink } from '@/lib/business'
import { BRAND } from '@/lib/nav'

export default function SiteMobileBar() {
  return (
    <div className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white border-t border-slate-200 shadow-[0_-8px_24px_-16px_rgba(19,35,58,.25)]" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
      <div className="grid grid-cols-3">
        <a href={`tel:${BUSINESS.phoneRaw}`} data-analytics="phone_click" className="flex flex-col items-center justify-center gap-1 py-2.5 text-[11px] font-medium text-slate-700">
          <Phone className="h-5 w-5" /> Call
        </a>
        <a href={waLink()} target="_blank" rel="noopener noreferrer" data-analytics="whatsapp_click" className="flex flex-col items-center justify-center gap-1 py-2.5 text-[12px] font-bold text-white" style={{ background: BRAND.green }}>
          <MessageCircle className="h-5 w-5" /> WhatsApp
        </a>
        <Link href="/price-list" data-analytics="price_list_click" className="flex flex-col items-center justify-center gap-1 py-2.5 text-[11px] font-medium text-slate-700">
          <ListChecks className="h-5 w-5" /> Price List
        </Link>
      </div>
    </div>
  )
}
