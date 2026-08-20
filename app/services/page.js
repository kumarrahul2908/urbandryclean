import Link from 'next/link'
import { MessageCircle, Phone,
  Shirt, WashingMachine, Wind, Bed, Layers, Crown, Briefcase, Wand2, Scissors, Home as HomeIcon, ArrowRight,
} from 'lucide-react'
import { BUSINESS, waLink, waEnquire } from '@/lib/business'
import { SERVICES } from '@/lib/services'
import SiteHeader from '@/components/site/SiteHeader'
import SiteFooter from '@/components/site/SiteFooter'
import SiteMobileBar from '@/components/site/SiteMobileBar'

export const metadata = {
  title: 'Our Services | Urban Dry Clean — Dry Cleaning & Laundry in Greater Noida West',
  description: 'Explore all Urban Dry Clean services — dry cleaning, laundry, steam iron, blanket & quilt cleaning, saree, suit & blazer, curtain and carpet cleaning in Greater Noida West.',
  alternates: { canonical: 'https://urbandryclean.in/services' },
  openGraph: { title: 'Urban Dry Clean — Our Services', description: 'Professional garment care for everyday wear, formal wear and household fabrics.', url: 'https://urbandryclean.in/services', type: 'website' },
}

const ICONS = { Shirt, WashingMachine, Wind, Bed, Layers, Crown, Briefcase, Wand2, Scissors, HomeIcon }
const BRAND = { blue: '#0759AD', blueDark: '#073F80', green: '#42A62B', greenDark: '#287E1E', navy: '#13233A', bg: '#F5F9FC' }

export default function ServicesPage() {
  return (
    <main>
      <SiteHeader />
      <section className="section" style={{ background: 'linear-gradient(180deg, #F5F9FC 0%, #FFF 100%)' }}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-[0.14em]" style={{ color: BRAND.blue }}>Our Services</p>
          <h1 className="mt-2 text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight" style={{ color: BRAND.navy }}>Care for every garment, every fabric</h1>
          <p className="mt-3 text-slate-600 max-w-2xl leading-relaxed">Professional cleaning and garment care for everyday wear, formal wear and household fabrics — with a <span className="font-semibold" style={{ color: BRAND.greenDark }}>flat 25% off on dry cleaning</span>.</p>
          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <a href={waLink()} target="_blank" rel="noopener noreferrer" data-analytics="whatsapp_click"
              className="inline-flex items-center justify-center gap-2 rounded-md px-5 py-3 text-sm font-semibold text-white shadow-sm" style={{ background: BRAND.green }}>
              <MessageCircle className="h-4 w-4" /> Book Pickup on WhatsApp
            </a>
            <Link href="/price-list" data-analytics="price_list_click"
              className="inline-flex items-center justify-center gap-2 rounded-md border-2 px-5 py-3 text-sm font-semibold" style={{ borderColor: BRAND.blue, color: BRAND.blue }}>
              View Price List <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <section className="section bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {SERVICES.map(s => {
              const Icon = ICONS[s.icon] || Shirt
              return (
                <div key={s.slug} className="card-hover group rounded-xl border border-slate-200 bg-white p-6 flex flex-col">
                  <div className="h-11 w-11 rounded-lg flex items-center justify-center mb-4" style={{ background: '#EEF4FB' }}>
                    <Icon className="h-6 w-6" style={{ color: BRAND.blue }} />
                  </div>
                  <h3 className="text-lg font-semibold" style={{ color: BRAND.navy }}>{s.name}</h3>
                  <p className="mt-1.5 text-[14px] text-slate-600 leading-relaxed flex-1">{s.desc}</p>
                  <div className="mt-5 flex flex-wrap items-center gap-3">
                    <a href={waEnquire(s.name)} target="_blank" rel="noopener noreferrer" data-analytics="whatsapp_click"
                      className="inline-flex items-center gap-1.5 text-[13.5px] font-semibold" style={{ color: BRAND.greenDark }}>
                      <MessageCircle className="h-4 w-4" /> Enquire on WhatsApp
                    </a>
                    <Link href="/price-list" data-analytics="price_list_click" className="inline-flex items-center gap-1 text-[13px] font-medium" style={{ color: BRAND.blue }}>
                      See prices <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <section className="section" style={{ background: BRAND.bg }}>
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold" style={{ color: BRAND.navy }}>Ready to book your pickup?</h2>
          <p className="mt-2 text-slate-600">Send us a message and our team will confirm the pickup time.</p>
          <div className="mt-6 flex flex-col sm:flex-row justify-center gap-3">
            <a href={waLink()} target="_blank" rel="noopener noreferrer" data-analytics="whatsapp_click"
              className="inline-flex items-center justify-center gap-2 rounded-md px-5 py-3 text-sm font-semibold text-white" style={{ background: BRAND.green }}>
              <MessageCircle className="h-4 w-4" /> Book Pickup on WhatsApp
            </a>
            <a href={`tel:${BUSINESS.phoneRaw}`} data-analytics="phone_click" className="inline-flex items-center justify-center gap-2 rounded-md border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-800">
              <Phone className="h-4 w-4" /> {BUSINESS.phone}
            </a>
          </div>
        </div>
      </section>

      <SiteFooter />
      <SiteMobileBar />
    </main>
  )
}
