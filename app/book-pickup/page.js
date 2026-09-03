import Link from 'next/link'
import { Phone, MapPin, ShieldCheck, Clock, Truck } from 'lucide-react'
import SiteLogo from '@/components/site/SiteLogo'
import PickupForm from '@/components/site/PickupForm'
import { BUSINESS, SITE_URL } from '@/lib/business'

export const metadata = {
  title: 'Book a Pickup | Urban Dry Clean — Greater Noida West',
  description: 'Request a free dry-cleaning & laundry pickup at your doorstep in Greater Noida West. Fill the form and our team will call you back to confirm.',
  alternates: { canonical: `${SITE_URL}/book-pickup` },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Book a Pickup | Urban Dry Clean',
    description: 'Request a free dry-cleaning & laundry pickup at your doorstep in Greater Noida West.',
    url: `${SITE_URL}/book-pickup`,
    siteName: 'Urban Dry Clean',
    locale: 'en_IN',
    type: 'website',
  },
}

export default function BookPickupPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Minimal top bar — logo + call for Ads landing page */}
      <header className="w-full border-b border-slate-100 bg-white">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 flex h-20 items-center justify-between">
          <Link href="/" aria-label="Urban Dry Clean home"><SiteLogo /></Link>
          <a
            href={`tel:${BUSINESS.phoneRaw}`}
            data-analytics="phone_click"
            className="inline-flex items-center gap-2 rounded-md border border-slate-200 px-3 py-2 text-sm font-medium text-slate-800 hover:border-[#0759AD] hover:text-[#0759AD]"
          >
            <Phone className="h-4 w-4" /> <span className="hidden sm:inline">Call </span>{BUSINESS.phone}
          </a>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          {/* Left: pitch */}
          <div className="order-2 lg:order-1">
            <span
              className="inline-flex items-center rounded-full px-3 py-1 text-[11px] font-semibold text-white"
              style={{ background: '#42A62B' }}
            >
              {BUSINESS.offer.headline}
            </span>
            <h1 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-bold text-[#13233A] leading-tight">
              Book a Pickup
            </h1>
            <p className="mt-3 text-slate-600 text-base sm:text-lg max-w-xl">
              Request a convenient dry-cleaning &amp; laundry pickup at your doorstep. Fill in your
              mobile number below and our team will call you back to confirm a time that works for you.
            </p>

            <ul className="mt-6 space-y-3 text-sm text-slate-700">
              <li className="flex items-start gap-3">
                <span className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#E8F1FB] text-[#0759AD]">
                  <Truck className="h-4 w-4" />
                </span>
                <span><b>Free pickup &amp; delivery</b> in {BUSINESS.serviceArea}.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#EAF5E6] text-[#287E1E]">
                  <ShieldCheck className="h-4 w-4" />
                </span>
                <span><b>Premium garment care</b> — expert stain treatment &amp; fabric-safe cleaning.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#FFF4E5] text-[#B76B00]">
                  <Clock className="h-4 w-4" />
                </span>
                <span><b>Quick turnaround</b> — standard delivery in 48–72 hours.</span>
              </li>
            </ul>

            <div className="mt-6 text-sm text-slate-600 flex items-start gap-2">
              <MapPin className="h-4 w-4 mt-0.5 text-slate-400 shrink-0" />
              <span>{BUSINESS.address.full}</span>
            </div>
          </div>

          {/* Right: form card */}
          <div className="order-1 lg:order-2">
            <div className="rounded-2xl bg-white shadow-lg ring-1 ring-slate-100 overflow-hidden">
              <div className="px-5 py-4 border-b border-slate-100">
                <h2 className="text-lg font-bold text-[#13233A]">Request Your Pickup</h2>
                <p className="text-xs text-slate-500 mt-0.5">Only mobile number is required — rest is optional.</p>
              </div>
              <PickupForm source="book_pickup_page" />
            </div>
            <p className="mt-3 text-center text-[12px] text-slate-500">
              Prefer WhatsApp?{' '}
              <a
                href="https://wa.me/919710108181?text=Hello%20Urban%20Dry%20Clean%2C%20I%20would%20like%20to%20book%20a%20pickup.%20Please%20share%20the%20pickup%20details."
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-[#0759AD] hover:underline"
              >
                Message us here
              </a>
            </p>
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-100 bg-white">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-6 text-center text-[12px] text-slate-500">
          © {new Date().getFullYear()} {BUSINESS.name}. All rights reserved.
        </div>
      </footer>
    </main>
  )
}
