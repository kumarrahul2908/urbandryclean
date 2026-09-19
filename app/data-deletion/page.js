import Link from 'next/link'
import { MessageCircle, Phone, Mail, MapPin } from 'lucide-react'
import SiteHeader from '@/components/site/SiteHeader'
import SiteFooter from '@/components/site/SiteFooter'
import DataDeletionForm from '@/components/site/DataDeletionForm'
import { BUSINESS, SITE_URL, waLink } from '@/lib/business'

export const metadata = {
  title: 'Data Deletion Request | Urban Dry Clean',
  description:
    'Request deletion of the personal information Urban Dry Clean holds about you, including any data received via Meta / Facebook / Instagram / WhatsApp APIs. Complete the form or use WhatsApp / phone / postal channels.',
  alternates: { canonical: `${SITE_URL}/data-deletion` },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Data Deletion Request | Urban Dry Clean',
    description: 'Submit a request to delete your data from Urban Dry Clean.',
    url: `${SITE_URL}/data-deletion`,
    siteName: 'Urban Dry Clean',
    locale: 'en_IN',
    type: 'article',
  },
}

export default function DataDeletionPage() {
  return (
    <main className="bg-white">
      <SiteHeader />

      <section className="border-b border-slate-100 bg-gradient-to-b from-slate-50 to-white">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-10 md:py-14">
          <p className="text-[12px] font-semibold uppercase tracking-widest text-[#0759AD]">Data Rights</p>
          <h1 className="mt-2 text-3xl md:text-4xl font-bold tracking-tight text-[#13233A]">Data Deletion Request</h1>
          <p className="mt-3 text-slate-600 max-w-2xl">
            Use this page to request deletion of the personal information Urban Dry Clean holds about you —
            including any information we may have received through Meta, Facebook, Instagram or WhatsApp APIs.
            Please read our{' '}
            <Link href="/privacy-policy" className="text-[#0759AD] hover:underline">Privacy Policy</Link>{' '}
            for full details.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-10 md:py-12">
        <div className="grid lg:grid-cols-5 gap-8">
          {/* Form */}
          <div className="lg:col-span-3">
            <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
              <div className="px-5 py-4 border-b border-slate-100">
                <h2 className="text-lg font-bold text-[#13233A]">Submit your request</h2>
                <p className="text-xs text-slate-500 mt-0.5">We will process valid requests within 30 days.</p>
              </div>
              <DataDeletionForm />
            </div>
          </div>

          {/* Sidebar — alternative channels + what happens */}
          <aside className="lg:col-span-2 space-y-5">
            <div className="rounded-2xl border border-slate-200 bg-white p-5">
              <div className="text-sm font-semibold text-[#13233A]">Prefer a different channel?</div>
              <p className="mt-1 text-[13px] text-slate-600">You can also send a deletion request using any of the following:</p>
              <ul className="mt-3 space-y-2 text-[13.5px] text-slate-700">
                <li className="flex items-start gap-2">
                  <MessageCircle className="h-4 w-4 mt-0.5 shrink-0 text-emerald-700" />
                  <span><strong>WhatsApp:</strong>{' '}
                    <a
                      href={waLink('Hello Urban Dry Clean, I would like to submit a data deletion request. Please delete all information you hold about me.')}
                      target="_blank" rel="noopener noreferrer" className="text-[#0759AD] hover:underline">
                      {BUSINESS.phone}
                    </a>
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <Phone className="h-4 w-4 mt-0.5 shrink-0 text-slate-500" />
                  <span><strong>Phone:</strong>{' '}
                    <a href={`tel:${BUSINESS.phoneRaw}`} className="text-[#0759AD] hover:underline">{BUSINESS.phone}</a>
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <Mail className="h-4 w-4 mt-0.5 shrink-0 text-slate-500" />
                  <span><strong>Contact form:</strong>{' '}
                    <Link href="/contact" className="text-[#0759AD] hover:underline">{SITE_URL}/contact</Link>
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 mt-0.5 shrink-0 text-slate-500" />
                  <span><strong>Postal:</strong> {BUSINESS.address.full}</span>
                </li>
              </ul>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5">
              <div className="text-sm font-semibold text-[#13233A]">What happens next?</div>
              <ol className="mt-2 list-decimal list-inside text-[13.5px] text-slate-700 space-y-1.5">
                <li>We acknowledge your request via your chosen contact.</li>
                <li>We verify your identity to protect against fraudulent requests.</li>
                <li>We delete personal information from our production database.</li>
                <li>Records legally required (e.g., invoices for accounting) are retained only for the minimum period required by law.</li>
                <li>Residual data in encrypted backups is overwritten during normal backup rotation.</li>
              </ol>
              <p className="mt-3 text-[12px] text-slate-500">
                For full details, see Section 9 of our{' '}
                <Link href="/privacy-policy#data-deletion" className="text-[#0759AD] hover:underline">Privacy Policy</Link>.
              </p>
            </div>
          </aside>
        </div>
      </section>

      <SiteFooter />
    </main>
  )
}
