import Link from 'next/link'
import { MessageCircle, Phone, ArrowLeft } from 'lucide-react'
import { BUSINESS, waLink } from '@/lib/business'

export const metadata = {
  title: 'Page not found | Urban Dry Clean',
  description: 'The page you are looking for could not be found. Return to Urban Dry Clean home or contact us on WhatsApp.',
}

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center px-4" style={{ background: '#F5F9FC' }}>
      <div className="max-w-lg w-full rounded-2xl bg-white border border-slate-200 shadow-sm p-8 text-center">
        <div className="text-6xl font-bold" style={{ color: '#0759AD' }}>404</div>
        <h1 className="mt-3 text-2xl font-bold text-slate-900">Page not found</h1>
        <p className="mt-2 text-slate-600">The page you’re looking for doesn’t exist. It may have been moved or the URL might be incorrect.</p>
        <div className="mt-6 flex flex-col sm:flex-row gap-2 justify-center">
          <Link href="/" className="inline-flex items-center justify-center gap-2 rounded-md border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-800">
            <ArrowLeft className="h-4 w-4" /> Back to Home
          </Link>
          <a href={waLink()} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-md px-5 py-2.5 text-sm font-semibold text-white" style={{ background: '#42A62B' }}>
            <MessageCircle className="h-4 w-4" /> WhatsApp
          </a>
          <a href={`tel:${BUSINESS.phoneRaw}`}
            className="inline-flex items-center justify-center gap-2 rounded-md border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-800">
            <Phone className="h-4 w-4" /> Call
          </a>
        </div>
      </div>
    </main>
  )
}
