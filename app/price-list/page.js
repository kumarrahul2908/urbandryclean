import Link from 'next/link'
import { ArrowLeft, MessageCircle, Phone, MapPin, Info, Star } from 'lucide-react'
import { CATEGORIES } from '@/lib/pricelist'
import { BUSINESS, waLink } from '@/lib/business'
import Logo from '@/components/site/Logo'
import OfferBadge from '@/components/site/OfferBadge'

export const metadata = {
  title: 'Price List | Urban Dry Clean — Flat 25% OFF on Dry Cleaning',
  description: 'Complete Urban Dry Clean price list — Flat 25% OFF on dry cleaning across all garments. See rates for shirts, sarees, suits, blankets, quilts and more.',
  alternates: { canonical: 'https://urbandryclean.in/price-list' },
}

const BRAND = { blue: '#0759AD', blueDark: '#073F80', green: '#42A62B', greenDark: '#287E1E', navy: '#13233A' }

function Cell({ children, muted, strike, className = '' }) {
  return (
    <span className={`${muted ? 'text-slate-400' : 'text-slate-800'} ${strike ? 'line-through decoration-slate-400/70' : ''} ${className}`}>
      {children}
    </span>
  )
}

function CategoryTable({ cat }) {
  return (
    <div id={cat.id} className="scroll-mt-24">
      <div className="flex items-center gap-3 mb-4">
        <h2 className="text-xl md:text-2xl font-bold" style={{ color: BRAND.navy }}>{cat.title}</h2>
        <span className="h-px flex-1" style={{ background: 'linear-gradient(90deg, #0759AD22, transparent)' }} />
      </div>

      {/* Desktop / tablet table */}
      <div className="hidden md:block overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full text-[14px]">
          <thead>
            <tr className="text-left" style={{ background: '#F5F9FC' }}>
              <th className="py-3.5 px-4 font-semibold text-slate-700 w-1/2">Article</th>
              <th className="py-3.5 px-4 font-semibold" style={{ color: BRAND.greenDark }}>
                Dry Clean (25% OFF) ₹
              </th>
              <th className="py-3.5 px-4 font-semibold text-slate-700">Steam Iron Onwards ₹</th>
              {cat.hasMRP && <th className="py-3.5 px-4 font-semibold text-slate-500">Dry Clean MRP ₹</th>}
            </tr>
          </thead>
          <tbody>
            {cat.items.map((it, i) => (
              <tr key={it.name} className={`border-t border-slate-100 ${it.special ? 'bg-amber-50/50' : ''}`}>
                <td className="py-3.5 px-4">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-slate-800">{it.name}</span>
                    {it.special && (
                      <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider" style={{ background: '#FEF3C7', color: '#92400E' }}>
                        <Star className="h-3 w-3 fill-current" /> Special Reduced Price
                      </span>
                    )}
                  </div>
                </td>
                <td className="py-3.5 px-4">
                  <span className="font-bold text-[15px]" style={{ color: BRAND.greenDark }}>₹ {it.dc}</span>
                </td>
                <td className="py-3.5 px-4">
                  <Cell>₹ {it.si}</Cell>
                </td>
                {cat.hasMRP && (
                  <td className="py-3.5 px-4">
                    {it.mrp === '—' ? <Cell muted>—</Cell> : <Cell strike muted>₹ {it.mrp}</Cell>}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden space-y-3">
        {cat.items.map(it => (
          <div key={it.name} className={`rounded-xl border p-4 bg-white ${it.special ? 'border-amber-200 bg-amber-50/40' : 'border-slate-200'}`}>
            <div className="flex items-start justify-between gap-3">
              <div className="font-semibold text-[15px] text-slate-900 leading-snug">{it.name}</div>
              {it.special && (
                <span className="shrink-0 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider" style={{ background: '#FEF3C7', color: '#92400E' }}>
                  <Star className="h-3 w-3 fill-current" /> Special
                </span>
              )}
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2 text-[13px]">
              <div className="rounded-md px-3 py-2" style={{ background: '#EAF5E6' }}>
                <div className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: BRAND.greenDark }}>Dry Clean (25% OFF)</div>
                <div className="mt-0.5 font-bold text-[15px]" style={{ color: BRAND.greenDark }}>₹ {it.dc}</div>
              </div>
              <div className="rounded-md px-3 py-2" style={{ background: '#EEF4FB' }}>
                <div className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: BRAND.blueDark }}>Steam Iron Onwards</div>
                <div className="mt-0.5 font-bold text-[15px]" style={{ color: BRAND.blueDark }}>₹ {it.si}</div>
              </div>
              {cat.hasMRP && (
                <div className="col-span-2 rounded-md px-3 py-1.5 border border-dashed border-slate-200">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">Dry Clean MRP</span>
                    {it.mrp === '—'
                      ? <span className="text-[13px] text-slate-400">—</span>
                      : <span className="text-[13px] font-medium text-slate-500 line-through decoration-slate-400/70">₹ {it.mrp}</span>
                    }
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function PriceListPage() {
  return (
    <main className="pb-24 md:pb-14">
      {/* Simple sub-header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2"><Logo /></Link>
          <Link href="/" className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-700 hover:text-[#0759AD]">
            <ArrowLeft className="h-4 w-4" /> Back to Home
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden" style={{ background: 'linear-gradient(180deg, #F5F9FC 0%, #FFFFFF 100%)' }}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 md:py-14">
          <div className="flex flex-col items-start gap-4">
            <OfferBadge size="lg" />
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight" style={{ color: BRAND.navy }}>
              Urban Dry Clean — Price List
            </h1>
            <p className="text-slate-600 max-w-2xl leading-relaxed">
              Transparent rates for every garment. Enjoy a <span className="font-semibold" style={{ color: BRAND.greenDark }}>flat 25% off on dry cleaning</span>. Steam iron prices shown are “onwards”.
            </p>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <a href={waLink('Hello Urban Dry Clean, please share the current price list and confirm my item price.')} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-md px-5 py-3 text-sm font-semibold text-white shadow-sm" style={{ background: BRAND.green }}>
                <MessageCircle className="h-4 w-4" /> Get Current Price on WhatsApp
              </a>
              <a href={`tel:${BUSINESS.phoneRaw}`}
                className="inline-flex items-center justify-center gap-2 rounded-md border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-800 hover:border-[#0759AD] hover:text-[#0759AD]">
                <Phone className="h-4 w-4" /> Call {BUSINESS.phone}
              </a>
            </div>

            {/* Category quick nav */}
            <div className="mt-4 flex flex-wrap gap-2">
              {CATEGORIES.map(c => (
                <a key={c.id} href={`#${c.id}`} className="rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-medium text-slate-700 hover:border-[#0759AD] hover:text-[#0759AD]">
                  {c.title}
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Tables */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="space-y-12">
          {CATEGORIES.map(cat => <CategoryTable key={cat.id} cat={cat} />)}
        </div>

        {/* Notes */}
        <div className="mt-10 rounded-xl border border-slate-200 bg-white p-5">
          <div className="flex items-start gap-3">
            <div className="h-9 w-9 shrink-0 rounded-md flex items-center justify-center" style={{ background: '#EEF4FB' }}>
              <Info className="h-5 w-5" style={{ color: BRAND.blue }} />
            </div>
            <div className="text-[13.5px] text-slate-700 leading-relaxed space-y-1.5">
              <p><span className="font-semibold">Dry Clean (25% OFF)</span> is the final price after our flat 25% discount on the Dry Clean MRP.</p>
              <p><span className="font-semibold">Steam Iron Onwards</span> — starting prices for steam ironing; final rate depends on fabric and finish.</p>
              <p>For prices separated by <span className="font-mono">/</span>, the first value is for the first variant, the second value for the second variant, and so on.</p>
              <p><span className="font-semibold">Blanket</span> and <span className="font-semibold">Quilt</span> are highlighted as special reduced prices.</p>
              <p>Final rates are confirmed on WhatsApp before pickup; prices may vary based on fabric, size and finish.</p>
            </div>
          </div>
        </div>

        {/* Address strip */}
        <div className="mt-8 rounded-xl border border-slate-200 bg-white p-5 flex flex-col md:flex-row md:items-center gap-4 md:gap-6">
          <div className="flex items-start gap-3">
            <div className="h-9 w-9 shrink-0 rounded-md flex items-center justify-center" style={{ background: '#EAF5E6' }}>
              <MapPin className="h-5 w-5" style={{ color: BRAND.greenDark }} />
            </div>
            <div className="text-[13.5px] text-slate-700 leading-relaxed">
              <div className="font-semibold text-slate-900">Visit Urban Dry Clean</div>
              <div>{BUSINESS.address.line1}, {BUSINESS.address.line2}, {BUSINESS.address.line3}</div>
            </div>
          </div>
          <div className="md:ml-auto flex gap-2">
            <a href={waLink()} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-md px-4 py-2.5 text-sm font-semibold text-white" style={{ background: BRAND.green }}>
              <MessageCircle className="h-4 w-4" /> Book Pickup
            </a>
            <a href={`tel:${BUSINESS.phoneRaw}`}
              className="inline-flex items-center gap-2 rounded-md border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-800">
              <Phone className="h-4 w-4" /> Call
            </a>
          </div>
        </div>
      </section>

      {/* Mobile bottom bar */}
      <div className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white border-t border-slate-200 shadow-[0_-8px_24px_-16px_rgba(19,35,58,.25)]" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
        <div className="grid grid-cols-3">
          <a href={`tel:${BUSINESS.phoneRaw}`} className="flex flex-col items-center justify-center gap-1 py-2.5 text-[11px] font-medium text-slate-700">
            <Phone className="h-5 w-5" /> Call
          </a>
          <a href={waLink()} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center justify-center gap-1 py-2.5 text-[12px] font-bold text-white" style={{ background: BRAND.green }}>
            <MessageCircle className="h-5 w-5" /> WhatsApp
          </a>
          <Link href="/" className="flex flex-col items-center justify-center gap-1 py-2.5 text-[11px] font-medium text-slate-700">
            <ArrowLeft className="h-5 w-5" /> Home
          </Link>
        </div>
      </div>
    </main>
  )
}
