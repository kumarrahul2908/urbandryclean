'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { IndianRupee, Wrench, Sparkles, HelpCircle, ArrowRight, Package, CheckCircle2, ExternalLink } from 'lucide-react'

export default function AdminDashboard() {
  const [stats, setStats] = useState(null)
  const [me, setMe] = useState(null)
  useEffect(() => {
    fetch('/api/admin/stats', { cache: 'no-store' }).then(r => r.json()).then(setStats).catch(() => {})
    fetch('/api/admin/me', { cache: 'no-store' }).then(r => r.json()).then(d => setMe(d?.admin)).catch(() => {})
  }, [])

  const cards = [
    { label: 'Total Price Items', value: stats?.priceTotal ?? '–', icon: IndianRupee, tone: 'blue' },
    { label: 'Active Price Items', value: stats?.priceActive ?? '–', icon: CheckCircle2, tone: 'green' },
    { label: 'Total Services',     value: stats?.svcTotal ?? '–',   icon: Wrench, tone: 'blue' },
    { label: 'Active Promotions',  value: stats?.activePromos ?? '–', icon: Sparkles, tone: 'amber' },
  ]

  const toneMap = {
    blue: { bg: '#EEF4FB', fg: '#0759AD' },
    green: { bg: '#EAF5E6', fg: '#287E1E' },
    amber: { bg: '#FEF3C7', fg: '#92400E' },
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-sm text-slate-500 mt-1">Welcome back{me?.email ? `, ${me.email}` : ''}. Here&rsquo;s your site at a glance.</p>
        </div>
        <Link href="/admin/prices" className="inline-flex items-center gap-2 rounded-md bg-[#0759AD] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#073F80]">
          <IndianRupee className="h-4 w-4" /> Manage Prices
        </Link>
      </div>

      <div className="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-3">
        {cards.map(c => {
          const Icon = c.icon; const t = toneMap[c.tone]
          return (
            <div key={c.label} className="rounded-xl border border-slate-200 bg-white p-4">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-wider text-slate-500">{c.label}</span>
                <div className="h-8 w-8 rounded-md flex items-center justify-center" style={{ background: t.bg }}>
                  <Icon className="h-4 w-4" style={{ color: t.fg }} />
                </div>
              </div>
              <div className="mt-2 text-2xl font-bold text-slate-900">{c.value}</div>
            </div>
          )
        })}
      </div>

      <div className="mt-8">
        <h2 className="text-lg font-semibold text-slate-900">Quick actions</h2>
        <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Link href="/admin/prices" className="rounded-xl border border-slate-200 bg-white p-4 flex items-center justify-between hover:border-[#0759AD]">
            <div>
              <div className="font-semibold text-slate-900">Edit prices</div>
              <div className="text-xs text-slate-500 mt-0.5">Change any garment rate — site updates instantly.</div>
            </div>
            <ArrowRight className="h-4 w-4 text-slate-400" />
          </Link>
          <a href="/price-list" target="_blank" rel="noopener noreferrer" className="rounded-xl border border-slate-200 bg-white p-4 flex items-center justify-between hover:border-[#0759AD]">
            <div>
              <div className="font-semibold text-slate-900 flex items-center gap-1">View public price list <ExternalLink className="h-3.5 w-3.5" /></div>
              <div className="text-xs text-slate-500 mt-0.5">See what customers currently see on the site.</div>
            </div>
            <ArrowRight className="h-4 w-4 text-slate-400" />
          </a>
        </div>
      </div>

      <div className="mt-8 rounded-xl border border-amber-200 bg-amber-50 p-4 flex items-start gap-3">
        <Sparkles className="h-5 w-5 mt-0.5 text-amber-700 shrink-0" />
        <div className="text-sm text-amber-900">
          <strong>Active promotion:</strong> FLAT 25% OFF on all dry-cleaning items. This applies automatically to items with an MRP.
        </div>
      </div>
    </div>
  )
}
