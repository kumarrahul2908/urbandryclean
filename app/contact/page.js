import { MessageCircle, Phone, MapPin, Mail } from 'lucide-react'
import { BUSINESS, waLink } from '@/lib/business'
import EnquiryForm from '@/components/site/EnquiryForm'
import SiteHeader from '@/components/site/SiteHeader'
import SiteFooter from '@/components/site/SiteFooter'
import SiteMobileBar from '@/components/site/SiteMobileBar'

const SITE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://urbandryclean.in'

export const metadata = {
  title: 'Contact Us | Urban Dry Clean — Book Pickup & Delivery',
  description: 'Contact Urban Dry Clean for dry cleaning, laundry and garment care in Greater Noida West. Call, WhatsApp or visit our store at S-Mart Eros Sampoornam.',
  alternates: { canonical: `${SITE_URL}/contact` },
  openGraph: { title: 'Contact Urban Dry Clean', description: 'Call, WhatsApp or visit us at S-Mart Eros Sampoornam, Sector 2, Patwari, Greater Noida.', url: `${SITE_URL}/contact`, type: 'website' },
}

const BRAND = { blue: '#0759AD', blueDark: '#073F80', green: '#42A62B', greenDark: '#287E1E', navy: '#13233A', bg: '#F5F9FC' }

export default function ContactPage() {
  const mapsQuery = encodeURIComponent(BUSINESS.address.full)
  return (
    <main>
      <SiteHeader />
      <section className="section" style={{ background: 'linear-gradient(180deg, #F5F9FC 0%, #FFF 100%)' }}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-[0.14em]" style={{ color: BRAND.blue }}>Contact</p>
          <h1 className="mt-2 text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight" style={{ color: BRAND.navy }}>We&rsquo;re here to help</h1>
          <p className="mt-3 text-slate-600 max-w-2xl leading-relaxed">Reach us anytime for bookings, pricing or general enquiries. Our team responds quickly on WhatsApp.</p>

          <div className="mt-10 grid lg:grid-cols-2 gap-8 items-start">
            <div className="space-y-6">
              <div className="rounded-2xl bg-white border border-slate-200 p-6 shadow-sm">
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <div className="text-xs uppercase tracking-wider text-slate-500">Phone</div>
                    <a href={`tel:${BUSINESS.phoneRaw}`} data-analytics="phone_click" className="mt-1 block text-[15px] font-semibold" style={{ color: BRAND.navy }}>{BUSINESS.phone}</a>
                  </div>
                  <div>
                    <div className="text-xs uppercase tracking-wider text-slate-500">WhatsApp</div>
                    <a href={waLink()} target="_blank" rel="noopener noreferrer" data-analytics="whatsapp_click" className="mt-1 block text-[15px] font-semibold" style={{ color: BRAND.greenDark }}>{BUSINESS.phone}</a>
                  </div>
                  <div className="sm:col-span-2">
                    <div className="text-xs uppercase tracking-wider text-slate-500">Address</div>
                    <div className="mt-1 text-[14.5px] leading-relaxed text-slate-700">
                      {BUSINESS.address.line1}<br />{BUSINESS.address.line2}<br />{BUSINESS.address.line3}
                    </div>
                  </div>
                </div>
                <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <a href={`tel:${BUSINESS.phoneRaw}`} data-analytics="phone_click" className="inline-flex items-center justify-center gap-2 rounded-md border border-slate-300 px-3 py-2.5 text-sm font-semibold">
                    <Phone className="h-4 w-4" /> Call Now
                  </a>
                  <a href={waLink()} target="_blank" rel="noopener noreferrer" data-analytics="whatsapp_click" className="inline-flex items-center justify-center gap-2 rounded-md px-3 py-2.5 text-sm font-semibold text-white" style={{ background: BRAND.green }}>
                    <MessageCircle className="h-4 w-4" /> WhatsApp
                  </a>
                  <a href={`https://www.google.com/maps/dir/?api=1&destination=${mapsQuery}`} target="_blank" rel="noopener noreferrer" data-analytics="directions_click" className="inline-flex items-center justify-center gap-2 rounded-md px-3 py-2.5 text-sm font-semibold text-white" style={{ background: BRAND.blue }}>
                    <MapPin className="h-4 w-4" /> Get Directions
                  </a>
                </div>
              </div>
              <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-sm bg-white">
                <iframe title="Urban Dry Clean location" src={`https://www.google.com/maps?q=${mapsQuery}&output=embed`} className="w-full h-[300px] md:h-[360px]" loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold" style={{ color: BRAND.navy }}>Send an enquiry</h2>
              <p className="mt-1 text-slate-600 text-sm">Fill this quick form — we’ll continue the conversation on WhatsApp.</p>
              <div className="mt-4">
                <EnquiryForm />
              </div>
            </div>
          </div>
        </div>
      </section>
      <SiteFooter />
      <SiteMobileBar />
    </main>
  )
}
