'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import {
  LayoutDashboard, IndianRupee, Wrench, HelpCircle, Sparkles, Settings, History, Package, FileText, KeyRound, Inbox, LogOut, Menu, X, ExternalLink
} from 'lucide-react'
import Image from 'next/image'
import logoSrc from '@/lib/assets/logo.jpg'

const NAV = [
  { href: '/admin',                label: 'Dashboard',       icon: LayoutDashboard, ready: true },
  { href: '/admin/leads',          label: 'Pickup Leads',    icon: Inbox,           ready: true },
  { href: '/admin/prices',         label: 'Prices',          icon: IndianRupee,     ready: true },
  { href: '/admin/services',       label: 'Services',        icon: Wrench,          ready: true },
  { href: '/admin/promotions',     label: 'Promotions',      icon: Sparkles,        ready: true },
  { href: '/admin/faqs',           label: 'FAQs',            icon: HelpCircle,      ready: true },
  { href: '/admin/price-history',  label: 'Price History',   icon: History,         ready: true },
  { href: '/admin/bulk',           label: 'Bulk Update',     icon: Package,         ready: true },
  { href: '/admin/audit-log',      label: 'Audit Log',       icon: FileText,        ready: true },
  { href: '/admin/settings',       label: 'Business Settings', icon: Settings,      ready: true },
  { href: '/admin/change-password',label: 'Change Password', icon: KeyRound,        ready: true },
]

export default function AdminLayout({ children }) {
  const pathname = usePathname()
  const router = useRouter()
  const [mobileOpen, setMobileOpen] = useState(false)

  // Bypass layout wrapping for /admin/login
  if (pathname === '/admin/login') return <>{children}</>

  const logout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' })
    router.replace('/admin/login')
  }

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="px-4 py-5 border-b border-slate-800">
        <Link href="/admin" className="inline-flex items-center rounded-md bg-white px-2 py-1">
          <Image src={logoSrc} alt="Urban Dry Clean" width={160} height={160} className="h-10 w-auto object-contain" style={{ mixBlendMode: 'multiply' }} />
        </Link>
        <div className="mt-2 text-[11px] uppercase tracking-widest text-slate-500">Admin Panel</div>
      </div>
      <nav className="flex-1 px-2 py-3 space-y-1 overflow-y-auto">
        {NAV.map(n => {
          const active = pathname === n.href || (n.href !== '/admin' && pathname.startsWith(n.href))
          const Icon = n.icon
          return (
            <Link key={n.href} href={n.ready ? n.href : '#'} onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 rounded-md px-3 py-2.5 text-[13.5px] font-medium transition ${
                active ? 'bg-slate-800 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              } ${!n.ready ? 'opacity-50 cursor-not-allowed' : ''}`}>
              <Icon className="h-4 w-4" /> {n.label}
              {!n.ready && <span className="ml-auto text-[9px] uppercase tracking-wider text-slate-500">soon</span>}
            </Link>
          )
        })}
      </nav>
      <div className="p-3 border-t border-slate-800 space-y-1">
        <a href="/" target="_blank" rel="noopener noreferrer"
          className="flex items-center gap-3 rounded-md px-3 py-2.5 text-[13px] text-slate-300 hover:bg-slate-800 hover:text-white">
          <ExternalLink className="h-4 w-4" /> View public site
        </a>
        <button onClick={logout}
          className="w-full flex items-center gap-3 rounded-md px-3 py-2.5 text-[13px] font-semibold text-rose-300 hover:bg-rose-950/40 hover:text-rose-200">
          <LogOut className="h-4 w-4" /> Logout
        </button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex fixed inset-y-0 left-0 w-64 flex-col bg-slate-900">
        <SidebarContent />
      </aside>

      {/* Mobile top bar */}
      <div className="lg:hidden fixed top-0 inset-x-0 z-40 bg-slate-900 text-white h-14 flex items-center justify-between px-3">
        <button onClick={() => setMobileOpen(true)} className="p-2 rounded-md hover:bg-slate-800"><Menu className="h-5 w-5" /></button>
        <div className="text-sm font-semibold">Urban Dry Clean Admin</div>
        <button onClick={logout} className="p-2 rounded-md hover:bg-slate-800" aria-label="Logout"><LogOut className="h-5 w-5" /></button>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
          <div className="relative w-72 bg-slate-900 text-white h-full">
            <button onClick={() => setMobileOpen(false)} className="absolute top-3 right-3 p-1 rounded-md hover:bg-slate-800"><X className="h-5 w-5" /></button>
            <SidebarContent />
          </div>
        </div>
      )}

      <div className="flex-1 lg:pl-64">
        <main className="pt-14 lg:pt-0 min-h-screen">
          {children}
        </main>
      </div>
    </div>
  )
}
