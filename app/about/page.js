import Link from 'next/link'
import { MessageCircle, Phone, CheckCircle2, MapPin } from 'lucide-react'
import { BUSINESS, waLink } from '@/lib/business'
import SiteHeader from '@/components/site/SiteHeader'
import SiteFooter from '@/components/site/SiteFooter'
import SiteMobileBar from '@/components/site/SiteMobileBar'

const SITE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://urbandryclean.in'

export const metadata = {
  title: 'About Us | Urban Dry Clean — Premium Dry Cleaning in Greater Noida West',
  description: 'Urban Dry Clean is a professional dry cleaning and garment care service in Greater Noida West with careful handling, quality finishing and convenient WhatsApp booking.',
  alternates: { canonical: `${SITE_URL}/about` },
  openGraph: { title: 'About Urban Dry Clean', description: 'Professional dry cleaning and garment care in Greater Noida West.', url: `${SITE_URL}/about`, type: 'website' },
}

const BRAND = { blue: '#0759AD', greenDark: '#287E1E', green: '#42A62B', navy: '#13233A', bg: '#F5F9FC' }

export default function AboutPage() {
  const points = [
    'Professional garment care',
    'Careful handling',
    'Quality finishing',
    'Convenient booking',
    'Transparent communication',
    'Local pickup and delivery',
  ]
  return (
    <main>
      <SiteHeader />
      <section className="section" style={{ background: 'linear-gradient(180deg, #F5F9FC 0%, #FFF 100%)' }}>
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-[0.14em]" style={{ color: BRAND.blue }}>About Us</p>
          <h1 className="mt-2 text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight" style={{ color: BRAND.navy }}>More than cleaning. It is garment care.</h1>
          <p className="mt-5 text-slate-700 leading-relaxed text-lg">
            Urban Dry Clean is a professional dry cleaning and garment care service serving customers in {BUSINESS.serviceArea}. We focus on careful garment handling, quality cleaning and neat finishing, with convenient customer communication through phone and WhatsApp.
          </p>

          <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6">
            <h2 className="text-lg font-semibold" style={{ color: BRAND.navy }}>What we stand for</h2>
            <ul className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-y-2.5 gap-x-6">
              {points.map(p => (
                <li key={p} className="flex items-start gap-2.5">
                  <CheckCircle2 className="h-5 w-5 shrink-0 mt-0.5" style={{ color: BRAND.green }} />
                  <span className="text-[14.5px] text-slate-700">{p}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6">
            <div className="flex items-start gap-3">
              <div className="h-9 w-9 shrink-0 rounded-md flex items-center justify-center" style={{ background: '#EEF4FB' }}>
                <MapPin className="h-5 w-5" style={{ color: BRAND.blue }} />
              </div>
              <div>
                <div className="text-sm font-semibold" style={{ color: BRAND.navy }}>Visit Us</div>
                <div className="mt-1 text-[14.5px] text-slate-700 leading-relaxed">
                  {BUSINESS.address.line1}<br />{BUSINESS.address.line2}<br />{BUSINESS.address.line3}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <a href={waLink()} target="_blank" rel="noopener noreferrer" data-analytics="whatsapp_click"
              className="inline-flex items-center justify-center gap-2 rounded-md px-5 py-3 text-sm font-semibold text-white" style={{ background: BRAND.green }}>
              <MessageCircle className="h-4 w-4" /> Book Pickup on WhatsApp
            </a>
            <a href={`tel:${BUSINESS.phoneRaw}`} data-analytics="phone_click" className="inline-flex items-center justify-center gap-2 rounded-md border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-800">
              <Phone className="h-4 w-4" /> {BUSINESS.phone}
            </a>
            <Link href="/services" data-analytics="services_click" className="inline-flex items-center justify-center gap-2 rounded-md border-2 px-5 py-3 text-sm font-semibold" style={{ borderColor: BRAND.blue, color: BRAND.blue }}>
              See our Services
            </Link>
          </div>
        </div>
      </section>

      <SiteFooter />
      <SiteMobileBar />
    </main>
  )
}
