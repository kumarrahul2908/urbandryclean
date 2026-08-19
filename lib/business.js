// Central business config — update here to change site-wide info.
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
    full: 'SF-17, Eros Mart, Eros Sampoornam, Sector 2, Greater Noida West, Uttar Pradesh - 201318, India',
  },
  website: 'https://urbandryclean.in',
  serviceArea: 'Greater Noida West',
}

export function waLink(message) {
  const text = encodeURIComponent(message || 'Hello Urban Dry Clean, I would like to book a pickup. Please share the pickup details.')
  return `https://wa.me/${BUSINESS.whatsapp}?text=${text}`
}

export function waEnquire(serviceName) {
  return waLink(`Hello Urban Dry Clean, I would like to enquire about ${serviceName}. Please share the price and details.`)
}
