import { BUSINESS } from '@/lib/business'
import logoSrc from '@/lib/assets/logo.jpg'

export default function JsonLd() {
  const logoUrl = `${BUSINESS.website}${logoSrc.src}`
  const data = {
    '@context': 'https://schema.org',
    '@type': 'DryCleaningOrLaundry',
    name: BUSINESS.name,
    image: logoUrl,
    logo: logoUrl,
    url: BUSINESS.website,
    telephone: BUSINESS.phoneRaw,
    priceRange: '₹39 – ₹1499',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'SF-17, Eros Mart, Eros Sampoornam, Sector 2',
      addressLocality: 'Greater Noida West',
      addressRegion: 'Uttar Pradesh',
      postalCode: '201318',
      addressCountry: 'IN',
    },
    areaServed: { '@type': 'Place', name: BUSINESS.serviceArea },
    sameAs: [],
  }
  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}
