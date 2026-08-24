'use client'
import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Lock, Mail, Loader2, AlertCircle } from 'lucide-react'
import Image from 'next/image'
import logoSrc from '@/lib/assets/logo.jpg'

export default function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [err, setErr] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const params = useSearchParams()
  const nextPath = params.get('next') || '/admin'

  useEffect(() => {
    // If already logged in, redirect
    fetch('/api/admin/me', { cache: 'no-store' }).then(r => { if (r.ok) router.replace(nextPath) }).catch(() => {})
  }, [router, nextPath])

  const submit = async (e) => {
    e.preventDefault(); setErr(''); setLoading(true)
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()
      if (!res.ok) { setErr(data?.error || 'Login failed'); return }
      router.replace(nextPath)
    } catch (e) {
      setErr('Network error')
    } finally { setLoading(false) }
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4 bg-slate-50">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-6">
          <Image src={logoSrc} alt="Urban Dry Clean" width={200} height={200} className="h-16 md:h-20 w-auto object-contain" style={{ mixBlendMode: 'multiply' }} priority />
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-6 md:p-8">
          <h1 className="text-2xl font-bold text-slate-900">Admin Login</h1>
          <p className="mt-1 text-sm text-slate-500">Sign in to manage prices, services and FAQs.</p>
          {err && (
            <div className="mt-4 flex items-start gap-2 rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
              <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" /> <span>{err}</span>
            </div>
          )}
          <form onSubmit={submit} className="mt-5 space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-800">Email</label>
              <div className="mt-1 relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input type="email" autoComplete="email" value={email} onChange={e => setEmail(e.target.value)} required
                  className="w-full rounded-md border border-slate-300 pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0759AD]" placeholder="admin@urbandryclean.in" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-800">Password</label>
              <div className="mt-1 relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input type="password" autoComplete="current-password" value={password} onChange={e => setPassword(e.target.value)} required
                  className="w-full rounded-md border border-slate-300 pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0759AD]" placeholder="••••••••" />
              </div>
            </div>
            <button type="submit" disabled={loading}
              className="w-full inline-flex items-center justify-center gap-2 rounded-md bg-[#0759AD] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#073F80] disabled:opacity-60">
              {loading && <Loader2 className="h-4 w-4 animate-spin" />} Sign in
            </button>
          </form>
        </div>
        <p className="mt-4 text-center text-xs text-slate-500">This area is private. Access is monitored.</p>
      </div>
    </main>
  )
}
