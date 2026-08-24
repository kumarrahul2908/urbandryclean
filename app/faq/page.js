import Link from 'next/link'
import { MessageCircle, Phone } from 'lucide-react'
import { BUSINESS, waLink } from '@/lib/business'
import { getDb, COLLECTIONS } from '@/lib/mongodb'
import { ensureSeeded } from '@/lib/seed'
import FaqAccordion from '@/components/site/FaqAccordion'
import SiteHeader from '@/components/site/SiteHeader'
import SiteFooter from '@/components/site/SiteFooter'
import SiteMobileBar from '@/components/site/SiteMobileBar'

export const dynamic = 'force-dynamic'

const SITE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://urbandryclean.in'

export const metadata = {
  title: 'FAQ | Urban Dry Clean — Common Questions Answered',
  description: 'Frequently asked questions about Urban Dry Clean — pickup and delivery, prices, service area, blanket & quilt cleaning, saree & suit cleaning and more.',
  alternates: { canonical: `${SITE_URL}/faq` },
  openGraph: { title: 'FAQ — Urban Dry Clean', description: 'Answers to common questions about our dry cleaning and laundry services.', url: `${SITE_URL}/faq`, type: 'website' },
}

const BRAND = { blue: '#0759AD', green: '#42A62B', navy: '#13233A' }

async function loadFaqs() {
  await ensureSeeded()
  const db = await getDb()
  return db.collection(COLLECTIONS.faqs).find({ active: true }).sort({ display_order: 1 }).toArray()
}

export default async function FaqPage() {
  const faqs = await loadFaqs()
  const jsonLd = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: faqs.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) }
  return (
    <main>
      <SiteHeader />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <section className="section" style={{ background: 'linear-gradient(180deg, #F5F9FC 0%, #FFF 100%)' }}>
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-[0.14em]" style={{ color: BRAND.blue }}>FAQ</p>
          <h1 className="mt-2 text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight" style={{ color: BRAND.navy }}>Frequently asked questions</h1>
          <p className="mt-3 text-slate-600 leading-relaxed">Everything you need to know before booking your pickup. Can&rsquo;t find your answer? Message us on WhatsApp.</p>
          <div className="mt-8">
            <FaqAccordion items={faqs} />
          </div>
          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <a href={waLink()} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 rounded-md px-5 py-3 text-sm font-semibold text-white" style={{ background: BRAND.green }}><MessageCircle className="h-4 w-4" /> Ask on WhatsApp</a>
            <a href={`tel:${BUSINESS.phoneRaw}`} className="inline-flex items-center justify-center gap-2 rounded-md border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-800"><Phone className="h-4 w-4" /> {BUSINESS.phone}</a>
          </div>
        </div>
      </section>
      <SiteFooter />
      <SiteMobileBar />
    </main>
  )
}
