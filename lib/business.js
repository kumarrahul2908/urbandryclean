// Central business config — update here to change site-wide info.
export const SITE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://urbandryclean.in'

export const BUSINESS = {
  name: 'Urban Dry Clean',
  tagline: 'Premium Dry Cleaning Service',
  phone: '+91 97101 08181',
  phoneRaw: '+919710108181',
  whatsapp: '919710108181',
  address: {
    line1: 'SF-17, Eros Mart, Eros Sampoornam',
    line2: 'Sector 2, Greater Noida West',
    line3: 'Uttar Pradesh - 201318, India',
    full: 'SF-17, Eros Mart, Eros Sampoornam, Sector 2, Greater Noida West, Uttar Pradesh 201318',
  },
  website: process.env.NEXT_PUBLIC_BASE_URL || 'https://urbandryclean.in',
  serviceArea: 'Greater Noida West',
  offer: {
    headline: 'FLAT 25% OFF ON DRY CLEANING',
    short: 'FLAT 25% OFF',
  },
}

export function waLink(message) {
  const text = encodeURIComponent(message || 'Hello Urban Dry Clean, I would like to book a pickup. Please share the pickup details.')
  return `https://wa.me/${BUSINESS.whatsapp}?text=${text}`
}

export function waEnquire(serviceName) {
  return waLink(`Hello Urban Dry Clean, I would like to enquire about ${serviceName}. Please share the price and details.`)
}
