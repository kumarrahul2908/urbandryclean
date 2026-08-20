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
      streetAddress: 'Shop SF17, 2nd Floor, S-Mart Eros Sampoornam, Sector 2, Patwari',
      addressLocality: 'Greater Noida',
      addressRegion: 'Uttar Pradesh',
      postalCode: '201306',
      addressCountry: 'IN',
    },
    areaServed: {
      '@type': 'Place',
      name: BUSINESS.serviceArea,
    },
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
