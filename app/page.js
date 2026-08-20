'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import {
  Phone, MessageCircle, Menu, X, ShieldCheck, Sparkles, PackageCheck, Truck,
  Shirt, WashingMachine, Wind, Bed, Layers, Crown, Briefcase, Wand2, Scissors,
  Home as HomeIcon, MapPin, ArrowRight, Clock, HeartHandshake, CheckCircle2
} from 'lucide-react'
import { BUSINESS, waLink, waEnquire } from '@/lib/business'
import { FAQS } from '@/lib/faq'
import FaqAccordion from '@/components/site/FaqAccordion'
import Link from 'next/link'

// ---------- Brand primitives ----------
const BRAND = {
  blue: '#0759AD', blueDark: '#073F80', green: '#42A62B', greenDark: '#287E1E',
  navy: '#13233A', bg: '#F5F9FC',
}

const nav = [
  { label: 'Home', href: '/' },
  { label: 'Services', href: '/services' },
  { label: 'Price List', href: '/price-list' },
  { label: 'How It Works', href: '#how' },
  { label: 'About Us', href: '/about' },
  { label: 'FAQ', href: '/faq' },
  { label: 'Contact', href: '/contact' },
]

// ---------- Logo (uses official Urban Dry Clean artwork at /public/logo.jpg) ----------
function Logo({ dark = false }) {
  const inner = (
    /* eslint-disable-next-line @next/next/no-img-element */
    <img
      src="/logo.jpg"
      alt="Urban Dry Clean — Premium Dry Cleaning Service"
      className="h-20 md:h-24 w-auto object-contain"
      style={{ mixBlendMode: 'multiply' }}
    />
  )
  if (dark) {
    return (
      <div className="inline-flex items-center rounded-lg bg-white px-3 py-2">
        {inner}
      </div>
    )
  }
  return <div className="flex items-center">{inner}</div>
}

// ---------- Header ----------
function Header() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    window.addEventListener('scroll', onScroll); onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className={`sticky top-0 z-50 w-full backdrop-blur bg-white/90 transition-shadow ${scrolled ? 'shadow-[0_1px_0_0_#e5eefc,0_8px_24px_-16px_rgba(19,35,58,.25)]' : 'border-b border-slate-100'}`}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-24 items-center justify-between">
          <a href="#home" aria-label="Urban Dry Clean home"><Logo /></a>
          <nav className="hidden xl:flex items-center gap-6">
            {nav.map(n => (
              <a key={n.href} href={n.href} className="nav-link text-[14px] font-medium text-slate-700 hover:text-[#0759AD]">{n.label}</a>
            ))}
          </nav>
          <div className="hidden lg:flex items-center gap-2">
            <a href={`tel:${BUSINESS.phoneRaw}`} data-analytics="phone_click" className="inline-flex items-center gap-2 rounded-md border border-slate-200 px-3.5 py-2 text-sm font-medium text-slate-800 hover:border-[#0759AD] hover:text-[#0759AD]">
              <Phone className="h-4 w-4" /> Call Now
            </a>
            <a href={waLink()} target="_blank" rel="noopener noreferrer" data-analytics="whatsapp_click" className="inline-flex items-center gap-2 rounded-md px-3.5 py-2 text-sm font-semibold text-white shadow-sm" style={{ background: BRAND.green }}>
              <MessageCircle className="h-4 w-4" /> Book Pickup
            </a>
          </div>
          <button onClick={() => setOpen(o => !o)} className="xl:hidden inline-flex items-center justify-center rounded-md p-2 text-slate-700 hover:bg-slate-100" aria-label="Toggle menu">
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>
      {open && (
        <div className="xl:hidden border-t border-slate-100 bg-white">
          <div className="px-4 py-3 flex flex-col">
            {nav.map(n => (
              <a key={n.href} href={n.href} onClick={() => setOpen(false)} className="py-2.5 text-[15px] font-medium text-slate-800">{n.label}</a>
            ))}
            <div className="grid grid-cols-2 gap-2 pt-3 pb-1">
              <a href={`tel:${BUSINESS.phoneRaw}`} className="inline-flex items-center justify-center gap-2 rounded-md border border-slate-200 px-3 py-2 text-sm font-medium"><Phone className="h-4 w-4" /> Call</a>
              <a href={waLink()} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-semibold text-white" style={{ background: BRAND.green }}><MessageCircle className="h-4 w-4" /> WhatsApp</a>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}

// ---------- Hero ----------
function Hero() {
  return (
    <section id="home" className="relative overflow-hidden" style={{ background: `linear-gradient(180deg, #F5F9FC 0%, #FFFFFF 70%)` }}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-14 md:pt-20 pb-16 md:pb-24">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 items-center">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full font-bold uppercase tracking-wider text-white shadow-sm px-3.5 py-1.5 text-[11px]"
                style={{ background: 'linear-gradient(90deg, #42A62B 0%, #287E1E 100%)' }}>
                <Sparkles className="h-3.5 w-3.5" /> Flat 25% OFF on Dry Cleaning
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-700 shadow-sm">
                <MapPin className="h-3.5 w-3.5" style={{ color: BRAND.blue }} />
                Serving Greater Noida West
              </span>
            </div>
            <h1 className="mt-5 text-4xl sm:text-5xl lg:text-[56px] font-bold leading-[1.05] tracking-tight" style={{ color: BRAND.navy }}>
              Premium Dry Cleaning<br />&amp; Laundry Service
            </h1>
            <p className="mt-5 text-lg text-slate-600 max-w-xl leading-relaxed">
              Professional garment care with convenient pickup and delivery. Neatly finished, carefully handled &mdash; booked in seconds on WhatsApp.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <a href={waLink()} target="_blank" rel="noopener noreferrer" data-analytics="whatsapp_click"
                className="inline-flex items-center justify-center gap-2 rounded-md px-6 py-3.5 text-[15px] font-semibold text-white shadow-md hover:shadow-lg transition"
                style={{ background: BRAND.green }}>
                <MessageCircle className="h-5 w-5" /> Book Pickup on WhatsApp
              </a>
              <a href="/price-list" data-analytics="price_list_click"
                className="inline-flex items-center justify-center gap-2 rounded-md border-2 px-6 py-3 text-[15px] font-semibold"
                style={{ borderColor: BRAND.blue, color: BRAND.blue }}>
                View Price List <ArrowRight className="h-4 w-4" />
              </a>
            </div>
            <div className="mt-8 flex items-center gap-5 text-sm text-slate-600">
              <div className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4" style={{ color: BRAND.green }} /> Pickup &amp; Delivery</div>
              <div className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4" style={{ color: BRAND.green }} /> Quality Finishing</div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-4 rounded-[28px] -z-10" style={{ background: `radial-gradient(60% 60% at 50% 40%, rgba(7,89,173,.10), transparent 70%)` }} />
            <div className="overflow-hidden rounded-2xl border border-slate-200 shadow-xl">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://images.pexels.com/photos/6045323/pexels-photo-6045323.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=700&w=940"
                alt="Freshly steamed and pressed clothes on a rack"
                className="w-full h-[420px] md:h-[520px] object-cover"
                loading="eager"
              />
            </div>
            <div className="hidden sm:flex absolute -bottom-5 -left-5 items-center gap-3 rounded-xl bg-white shadow-lg border border-slate-100 px-4 py-3">
              <div className="h-10 w-10 rounded-full flex items-center justify-center" style={{ background: '#E8F5E4' }}>
                <Sparkles className="h-5 w-5" style={{ color: BRAND.greenDark }} />
              </div>
              <div>
                <div className="text-sm font-semibold" style={{ color: BRAND.navy }}>Careful handling</div>
                <div className="text-xs text-slate-500">Sorted by fabric &amp; care label</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ---------- Trust strip ----------
function TrustStrip() {
  const items = [
    { icon: ShieldCheck, label: 'Professional Garment Care' },
    { icon: Sparkles, label: 'Quality Finishing' },
    { icon: HeartHandshake, label: 'Careful Handling' },
    { icon: MessageCircle, label: 'Convenient Booking' },
    { icon: Truck, label: 'Pickup & Delivery' },
  ]
  return (
    <section className="border-y border-slate-100 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {items.map((it) => (
            <div key={it.label} className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-md flex items-center justify-center" style={{ background: '#EEF4FB' }}>
                <it.icon className="h-5 w-5" style={{ color: BRAND.blue }} />
              </div>
              <span className="text-sm font-medium text-slate-700">{it.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ---------- Services ----------
const SERVICES = [
  { name: 'Dry Cleaning', desc: 'Solvent-based cleaning for delicate and formal garments.', Icon: Shirt },
  { name: 'Laundry', desc: 'Everyday wash, dry and fold for regular wear.', Icon: WashingMachine },
  { name: 'Steam Iron', desc: 'Crisp, wrinkle-free finishing for shirts, trousers and more.', Icon: Wind },
  { name: 'Blanket Cleaning', desc: 'Thorough cleaning for single, double and heavy blankets.', Icon: Bed },
  { name: 'Quilt / Rajai Cleaning', desc: 'Careful cleaning for quilts and rajais of all sizes.', Icon: Layers },
  { name: 'Saree Cleaning', desc: 'Gentle care for sarees, including delicate silk and embroidery.', Icon: Crown },
  { name: 'Suit & Blazer Cleaning', desc: 'Professional dry cleaning and pressing for suits and blazers.', Icon: Briefcase },
  { name: 'Jacket & Coat Cleaning', desc: 'Care for jackets, coats and heavy winterwear.', Icon: Wand2 },
  { name: 'Curtain Cleaning', desc: 'Cleaning for curtains and drapes of various fabrics.', Icon: Scissors },
  { name: 'Carpet Cleaning', desc: 'Cleaning for rugs and carpets to refresh your interiors.', Icon: HomeIcon },
]

function Services() {
  return (
    <section id="services" className="section bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.14em]" style={{ color: BRAND.blue }}>Our Services</p>
          <h2 className="mt-2 text-3xl sm:text-4xl font-bold tracking-tight" style={{ color: BRAND.navy }}>Care for every garment, every fabric</h2>
          <p className="mt-3 text-slate-600 leading-relaxed">Professional cleaning and garment care for everyday wear, formal wear and household fabrics.</p>
        </div>

        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {SERVICES.map((s) => (
            <div key={s.name} className="card-hover group rounded-xl border border-slate-200 bg-white p-5 flex flex-col">
              <div className="h-11 w-11 rounded-lg flex items-center justify-center mb-4" style={{ background: '#EEF4FB' }}>
                <s.Icon className="h-6 w-6" style={{ color: BRAND.blue }} />
              </div>
              <h3 className="text-[15.5px] font-semibold" style={{ color: BRAND.navy }}>{s.name}</h3>
              <p className="mt-1.5 text-[13.5px] text-slate-600 leading-relaxed flex-1">{s.desc}</p>
              <a href={waEnquire(s.name)} target="_blank" rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-1.5 text-[13px] font-semibold"
                style={{ color: BRAND.greenDark }}>
                <MessageCircle className="h-4 w-4" /> Enquire on WhatsApp
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ---------- How It Works ----------
const STEPS = [
  { n: '01', title: 'Book a Pickup', text: 'Send your pickup request on WhatsApp or call us.', Icon: MessageCircle },
  { n: '02', title: 'We Collect', text: 'Your garments are collected from the agreed location.', Icon: PackageCheck },
  { n: '03', title: 'Professional Care', text: 'Your garments are processed according to the item and selected service.', Icon: Sparkles },
  { n: '04', title: 'Ready for Delivery', text: 'Cleaned and finished garments are returned to you.', Icon: Truck },
]

function HowItWorks() {
  return (
    <section id="how" className="section" style={{ background: BRAND.bg }}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.14em]" style={{ color: BRAND.blue }}>How It Works</p>
          <h2 className="mt-2 text-3xl sm:text-4xl font-bold tracking-tight" style={{ color: BRAND.navy }}>Simple, transparent, doorstep-friendly</h2>
        </div>
        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {STEPS.map((s, i) => (
            <div key={s.n} className="relative rounded-xl bg-white border border-slate-200 p-6">
              <div className="flex items-center justify-between">
                <span className="text-3xl font-bold" style={{ color: BRAND.blue }}>{s.n}</span>
                <div className="h-10 w-10 rounded-md flex items-center justify-center" style={{ background: '#E8F5E4' }}>
                  <s.Icon className="h-5 w-5" style={{ color: BRAND.greenDark }} />
                </div>
              </div>
              <h3 className="mt-4 text-lg font-semibold" style={{ color: BRAND.navy }}>{s.title}</h3>
              <p className="mt-1.5 text-[14px] text-slate-600 leading-relaxed">{s.text}</p>
              {i < STEPS.length - 1 && (
                <div className="hidden lg:block absolute right-[-14px] top-1/2 -translate-y-1/2">
                  <ArrowRight className="h-5 w-5 text-slate-300" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ---------- Why Urban Dry Clean ----------
function WhyUs() {
  const points = [
    'Professional garment care',
    'Careful handling',
    'Quality finishing',
    'Convenient booking',
    'Transparent communication',
    'Local pickup and delivery',
  ]
  return (
    <section id="about" className="section bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-12 items-center">
        <div className="order-2 lg:order-1">
          <p className="text-sm font-semibold uppercase tracking-[0.14em]" style={{ color: BRAND.blue }}>Why Urban Dry Clean</p>
          <h2 className="mt-2 text-3xl sm:text-4xl font-bold tracking-tight" style={{ color: BRAND.navy }}>More than cleaning. It is garment care.</h2>
          <p className="mt-4 text-slate-600 leading-relaxed">
            Urban Dry Clean is a professional dry cleaning and garment care service in Greater Noida West. We focus on careful garment handling, quality cleaning and neat finishing, with convenient customer communication through phone and WhatsApp.
          </p>
          <ul className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6">
            {points.map(p => (
              <li key={p} className="flex items-start gap-2.5">
                <CheckCircle2 className="h-5 w-5 shrink-0 mt-0.5" style={{ color: BRAND.green }} />
                <span className="text-[14.5px] text-slate-700">{p}</span>
              </li>
            ))}
          </ul>
          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <a href={waLink()} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-md px-5 py-3 text-sm font-semibold text-white"
              style={{ background: BRAND.green }}>
              <MessageCircle className="h-4 w-4" /> Book Pickup on WhatsApp
            </a>
            <a href={`tel:${BUSINESS.phoneRaw}`}
              className="inline-flex items-center justify-center gap-2 rounded-md border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-800 hover:border-[#0759AD] hover:text-[#0759AD]">
              <Phone className="h-4 w-4" /> {BUSINESS.phone}
            </a>
          </div>
        </div>
        <div className="order-1 lg:order-2">
          <div className="overflow-hidden rounded-2xl border border-slate-200 shadow-lg">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://images.pexels.com/photos/10558192/pexels-photo-10558192.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"
              alt="Professional steaming and finishing of a white shirt"
              className="w-full h-[380px] md:h-[480px] object-cover"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>
  )
}

// ---------- Pickup & Delivery ----------
function PickupDelivery() {
  return (
    <section className="section" style={{ background: 'linear-gradient(180deg, #FFFFFF, #F5F9FC)' }}>
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-8 md:p-12 relative overflow-hidden">
          <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full" style={{ background: '#E8F5E4' }} aria-hidden />
          <div className="absolute -left-24 -bottom-24 h-64 w-64 rounded-full" style={{ background: '#EEF4FB' }} aria-hidden />
          <div className="relative">
            <div className="inline-flex items-center gap-2 rounded-full bg-white border border-slate-200 px-3 py-1 text-xs font-medium text-slate-700 shadow-sm">
              <Truck className="h-3.5 w-3.5" style={{ color: BRAND.blue }} /> Doorstep Service
            </div>
            <h2 className="mt-4 text-3xl sm:text-4xl font-bold tracking-tight" style={{ color: BRAND.navy }}>Doorstep Pickup &amp; Delivery</h2>
            <p className="mt-3 text-slate-600 max-w-2xl">Book your garment pickup conveniently through WhatsApp and let Urban Dry Clean take care of the rest.</p>
            <a href={waLink()} target="_blank" rel="noopener noreferrer"
              className="mt-6 inline-flex items-center justify-center gap-2 rounded-md px-6 py-3.5 text-[15px] font-semibold text-white shadow-md"
              style={{ background: BRAND.green }}>
              <MessageCircle className="h-5 w-5" /> Book Pickup on WhatsApp
            </a>
            <p className="mt-4 text-xs text-slate-500">Pickup and delivery availability depends on service area and operational availability.</p>
          </div>
        </div>
      </div>
    </section>
  )
}

// ---------- Pricing (teaser with real prices + link to full list) ----------
function PricingTeaser() {
  const highlights = [
    { name: 'Shirt / T-Shirt',                dc: '105',       si: '49',      mrp: '140' },
    { name: 'Trouser / Pant',                 dc: '113',       si: '59',      mrp: '150' },
    { name: 'Saree (Plain / Embroidered)',    dc: '199 / 399', si: '99 / 199',mrp: '249 / 499' },
    { name: 'Suit (2 Piece / 3 Piece)',       dc: '374 / 524', si: '229 / 349', mrp: '499 / 699' },
    { name: 'Coat / Blazer',                  dc: '299',       si: '169',     mrp: '399' },
    { name: 'Lehenga (Plain / Embroidered)',  dc: '499 / 749', si: '249 / 399', mrp: '665 / 999' },
  ]
  const specials = [
    { name: 'Blanket (Single / Double)', dc: '299 / 374', si: '199 / 249' },
    { name: 'Quilt (Single / Double)',   dc: '337 / 412', si: '220 / 279' },
  ]
  return (
    <section id="pricing" className="section bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Offer banner */}
        <div className="rounded-2xl p-6 md:p-8 text-white relative overflow-hidden shadow-md"
          style={{ background: `linear-gradient(120deg, ${BRAND.blueDark} 0%, ${BRAND.blue} 55%, ${BRAND.greenDark} 100%)` }}>
          <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-white/10" aria-hidden />
          <div className="absolute -left-24 -bottom-24 h-64 w-64 rounded-full bg-white/5" aria-hidden />
          <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-white/15 backdrop-blur px-3 py-1 text-[11px] font-bold uppercase tracking-wider">
                <Sparkles className="h-3.5 w-3.5" /> Limited Time Offer
              </div>
              <h2 className="mt-3 text-2xl md:text-4xl font-bold tracking-tight">FLAT 25% OFF on Dry Cleaning</h2>
              <p className="mt-2 text-white/85 text-sm md:text-base max-w-2xl">Enjoy a straight 25% discount across every dry-cleaned garment &mdash; from shirts and sarees to suits and lehengas.</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <a href="/price-list" className="inline-flex items-center justify-center gap-2 rounded-md bg-white px-5 py-3 text-sm font-semibold" style={{ color: BRAND.blueDark }}>
                View Full Price List <ArrowRight className="h-4 w-4" />
              </a>
              <a href={waLink('Hello Urban Dry Clean, please share the current price list.')} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-md px-5 py-3 text-sm font-semibold text-white border border-white/40 hover:bg-white/10">
                <MessageCircle className="h-4 w-4" /> Ask on WhatsApp
              </a>
            </div>
          </div>
        </div>

        {/* Popular items preview */}
        <div className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 rounded-xl border border-slate-200 bg-white overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
              <div>
                <div className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: BRAND.blue }}>Popular Items</div>
                <h3 className="mt-0.5 text-lg font-semibold" style={{ color: BRAND.navy }}>Dry Clean (25% OFF) preview</h3>
              </div>
              <a href="/price-list" className="hidden sm:inline-flex items-center gap-1 text-xs font-semibold" style={{ color: BRAND.blue }}>
                See all <ArrowRight className="h-3.5 w-3.5" />
              </a>
            </div>
            <div className="divide-y divide-slate-100">
              {highlights.map(h => (
                <div key={h.name} className="grid grid-cols-12 items-center gap-2 px-5 py-3.5 text-[14px]">
                  <div className="col-span-6 sm:col-span-5 font-medium text-slate-800">{h.name}</div>
                  <div className="col-span-6 sm:col-span-3">
                    <div className="text-[10px] uppercase tracking-wider text-slate-500">Dry Clean (25% OFF)</div>
                    <div className="font-bold" style={{ color: BRAND.greenDark }}>₹ {h.dc}</div>
                  </div>
                  <div className="col-span-6 sm:col-span-2">
                    <div className="text-[10px] uppercase tracking-wider text-slate-500">Steam Iron</div>
                    <div className="font-medium text-slate-700">₹ {h.si}</div>
                  </div>
                  <div className="col-span-6 sm:col-span-2 text-right">
                    <div className="text-[10px] uppercase tracking-wider text-slate-400">MRP</div>
                    <div className="text-slate-400 line-through decoration-slate-300">₹ {h.mrp}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Special reduced prices card */}
          <div className="rounded-xl border-2 p-5" style={{ borderColor: '#FCD34D', background: 'linear-gradient(180deg, #FFFBEB 0%, #FFF 100%)' }}>
            <div className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider" style={{ background: '#FEF3C7', color: '#92400E' }}>
              ★ Special Reduced Prices
            </div>
            <h3 className="mt-3 text-lg font-bold" style={{ color: BRAND.navy }}>Blankets &amp; Quilts</h3>
            <p className="mt-1 text-[13px] text-slate-600">Freshly priced for the season.</p>
            <div className="mt-4 space-y-3">
              {specials.map(s => (
                <div key={s.name} className="rounded-lg bg-white border border-slate-200 p-3.5">
                  <div className="font-semibold text-[14px] text-slate-900">{s.name}</div>
                  <div className="mt-2 grid grid-cols-2 gap-2 text-[13px]">
                    <div className="rounded-md px-3 py-2" style={{ background: '#EAF5E6' }}>
                      <div className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: BRAND.greenDark }}>Dry Clean (25% OFF)</div>
                      <div className="font-bold" style={{ color: BRAND.greenDark }}>₹ {s.dc}</div>
                    </div>
                    <div className="rounded-md px-3 py-2" style={{ background: '#EEF4FB' }}>
                      <div className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: BRAND.blueDark }}>Steam Iron</div>
                      <div className="font-bold" style={{ color: BRAND.blueDark }}>₹ {s.si}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <a href="/price-list#household" className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold" style={{ color: BRAND.blue }}>
              See all household prices <ArrowRight className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>

        <p className="mt-6 text-xs text-slate-500">Final prices confirmed on WhatsApp before pickup. Prices may vary based on fabric, size and finish.</p>
      </div>
    </section>
  )
}

// ---------- FAQ preview ----------
function FaqPreview() {
  return (
    <section id="faq" className="section" style={{ background: BRAND.bg }}>
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.14em]" style={{ color: BRAND.blue }}>FAQ</p>
          <h2 className="mt-2 text-3xl sm:text-4xl font-bold tracking-tight" style={{ color: BRAND.navy }}>Frequently asked questions</h2>
          <p className="mt-3 text-slate-600">Quick answers to the most common questions from our customers.</p>
        </div>
        <div className="mt-8">
          <FaqAccordion items={FAQS.slice(0, 6)} />
        </div>
        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <Link href="/faq" className="inline-flex items-center justify-center gap-2 rounded-md border-2 px-5 py-3 text-sm font-semibold" style={{ borderColor: BRAND.blue, color: BRAND.blue }}>
            See all FAQs <ArrowRight className="h-4 w-4" />
          </Link>
          <a href={waLink()} target="_blank" rel="noopener noreferrer" data-analytics="whatsapp_click"
            className="inline-flex items-center justify-center gap-2 rounded-md px-5 py-3 text-sm font-semibold text-white" style={{ background: BRAND.green }}>
            <MessageCircle className="h-4 w-4" /> Ask on WhatsApp
          </a>
        </div>
      </div>
    </section>
  )
}

// ---------- Reviews (placeholder for verified Google reviews) ----------
function Reviews() {
  // Update this once the Google Business Profile link is confirmed.
  const gbpUrl = 'https://www.google.com/search?q=Urban+Dry+Clean+Greater+Noida+West'
  return (
    <section className="section bg-white">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-slate-200 p-6 md:p-10 relative overflow-hidden"
          style={{ background: 'linear-gradient(180deg, #FFFFFF 0%, #F5F9FC 100%)' }}>
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.14em]" style={{ color: BRAND.blue }}>Customer Reviews</p>
            <h2 className="mt-2 text-2xl md:text-3xl font-bold tracking-tight" style={{ color: BRAND.navy }}>Trusted by customers in {BUSINESS.serviceArea}</h2>
            <p className="mt-3 text-slate-600 leading-relaxed">
              See our latest customer reviews on Google. Your feedback helps us keep improving.
            </p>
            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <a href={gbpUrl} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-md px-5 py-3 text-sm font-semibold text-white" style={{ background: BRAND.blue }}>
                See reviews on Google
              </a>
              <a href={waLink('Hello Urban Dry Clean, I would like to share feedback about my recent service.')} target="_blank" rel="noopener noreferrer" data-analytics="whatsapp_click"
                className="inline-flex items-center justify-center gap-2 rounded-md border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-800">
                <MessageCircle className="h-4 w-4" /> Share feedback
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ---------- Contact ----------
function Contact() {
  const mapsQuery = encodeURIComponent(BUSINESS.address.full)
  return (
    <section id="contact" className="section" style={{ background: BRAND.bg }}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-8 items-start">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.14em]" style={{ color: BRAND.blue }}>Contact</p>
            <h2 className="mt-2 text-3xl sm:text-4xl font-bold tracking-tight" style={{ color: BRAND.navy }}>We&rsquo;re here to help</h2>
            <p className="mt-3 text-slate-600">Reach us anytime for bookings, pricing or general enquiries.</p>

            <div className="mt-6 rounded-2xl bg-white border border-slate-200 p-6 shadow-sm">
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <div className="text-xs uppercase tracking-wider text-slate-500">Phone</div>
                  <a href={`tel:${BUSINESS.phoneRaw}`} className="mt-1 block text-[15px] font-semibold" style={{ color: BRAND.navy }}>{BUSINESS.phone}</a>
                </div>
                <div>
                  <div className="text-xs uppercase tracking-wider text-slate-500">WhatsApp</div>
                  <a href={waLink()} target="_blank" rel="noopener noreferrer" className="mt-1 block text-[15px] font-semibold" style={{ color: BRAND.greenDark }}>{BUSINESS.phone}</a>
                </div>
                <div className="sm:col-span-2">
                  <div className="text-xs uppercase tracking-wider text-slate-500">Address</div>
                  <div className="mt-1 text-[14.5px] leading-relaxed text-slate-700">
                    {BUSINESS.address.line1}<br />{BUSINESS.address.line2}<br />{BUSINESS.address.line3}
                  </div>
                </div>
              </div>
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-2">
                <a href={`tel:${BUSINESS.phoneRaw}`} className="inline-flex items-center justify-center gap-2 rounded-md border border-slate-300 px-3 py-2.5 text-sm font-semibold">
                  <Phone className="h-4 w-4" /> Call Now
                </a>
                <a href={waLink()} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 rounded-md px-3 py-2.5 text-sm font-semibold text-white" style={{ background: BRAND.green }}>
                  <MessageCircle className="h-4 w-4" /> WhatsApp
                </a>
                <a href={`https://www.google.com/maps/dir/?api=1&destination=${mapsQuery}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 rounded-md px-3 py-2.5 text-sm font-semibold text-white" style={{ background: BRAND.blue }}>
                  <MapPin className="h-4 w-4" /> Get Directions
                </a>
              </div>
            </div>
          </div>

          <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-sm bg-white">
            <iframe
              title="Urban Dry Clean location"
              src={`https://www.google.com/maps?q=${mapsQuery}&output=embed`}
              className="w-full h-[380px] md:h-[460px]"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </div>
    </section>
  )
}

// ---------- Footer ----------
function Footer() {
  return (
    <footer className="pt-14 pb-24 md:pb-14 text-slate-300" style={{ background: BRAND.navy }}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid gap-8 md:grid-cols-4">
        <div className="md:col-span-2">
          <Logo dark />
          <p className="mt-4 text-sm text-slate-400 max-w-md leading-relaxed">
            Premium Dry Cleaning Service &mdash; professional garment care, quality finishing and convenient pickup &amp; delivery in Greater Noida West.
          </p>
        </div>
        <div>
          <div className="text-sm font-semibold text-white">Quick Links</div>
          <ul className="mt-3 space-y-2 text-sm">
            {nav.map(n => (
              <li key={n.href}><a href={n.href} className="hover:text-white">{n.label}</a></li>
            ))}
          </ul>
        </div>
        <div>
          <div className="text-sm font-semibold text-white">Contact</div>
          <ul className="mt-3 space-y-2 text-sm">
            <li><a href={`tel:${BUSINESS.phoneRaw}`} className="hover:text-white">{BUSINESS.phone}</a></li>
            <li><a href={waLink()} target="_blank" rel="noopener noreferrer" className="hover:text-white">WhatsApp us</a></li>
            <li className="text-slate-400 leading-relaxed">{BUSINESS.address.line1},<br />{BUSINESS.address.line2},<br />{BUSINESS.address.line3}</li>
          </ul>
        </div>
      </div>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-10 pt-6 border-t border-white/10 text-xs text-slate-400 flex flex-col md:flex-row items-center justify-between gap-2">
        <div>&copy; 2026 Urban Dry Clean. All rights reserved.</div>
        <div>Made with care in Greater Noida West</div>
      </div>
    </footer>
  )
}

// ---------- Mobile bottom action bar ----------
function MobileActionBar() {
  return (
    <div className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white border-t border-slate-200 shadow-[0_-8px_24px_-16px_rgba(19,35,58,.25)]" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
      <div className="grid grid-cols-3">
        <a href={`tel:${BUSINESS.phoneRaw}`} className="flex flex-col items-center justify-center gap-1 py-2.5 text-[11px] font-medium text-slate-700">
          <Phone className="h-5 w-5" /> Call
        </a>
        <a href={waLink()} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center justify-center gap-1 py-2.5 text-[12px] font-bold text-white" style={{ background: BRAND.green }}>
          <MessageCircle className="h-5 w-5" /> WhatsApp
        </a>
        <a href="/price-list" className="flex flex-col items-center justify-center gap-1 py-2.5 text-[11px] font-medium text-slate-700">
          <Clock className="h-5 w-5" /> Price List
        </a>
      </div>
    </div>
  )
}

// ---------- Page ----------
function App() {
  return (
    <main>
      <Header />
      <Hero />
      <TrustStrip />
      <Services />
      <HowItWorks />
      <WhyUs />
      <PickupDelivery />
      <PricingTeaser />
      <FaqPreview />
      <Reviews />
      <Contact />
      <Footer />
      <MobileActionBar />
    </main>
  )
}

export default App
