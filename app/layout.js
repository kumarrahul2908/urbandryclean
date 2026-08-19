import './globals.css'
import { Providers } from './providers'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'], display: 'swap', variable: '--font-inter' })

export const metadata = {
  metadataBase: new URL('https://urbandryclean.in'),
  title: 'Urban Dry Clean | Dry Cleaning & Laundry Service in Greater Noida West',
  description: 'Urban Dry Clean provides professional dry cleaning, laundry and garment care services in Greater Noida West with convenient WhatsApp booking and pickup & delivery.',
  keywords: ['dry cleaning in Greater Noida West','dry cleaner in Greater Noida West','laundry service in Greater Noida West','dry cleaning near me','blanket cleaning','quilt cleaning','suit dry cleaning','saree dry cleaning','laundry pickup and delivery'],
  openGraph: {
    title: 'Urban Dry Clean | Premium Dry Cleaning Service',
    description: 'Professional dry cleaning, laundry & garment care in Greater Noida West. Book pickup on WhatsApp.',
    url: 'https://urbandryclean.in',
    siteName: 'Urban Dry Clean',
    locale: 'en_IN',
    type: 'website',
  },
  alternates: { canonical: 'https://urbandryclean.in' },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <script dangerouslySetInnerHTML={{__html:'window.addEventListener("error",function(e){if(e.error instanceof DOMException&&e.error.name==="DataCloneError"&&e.message&&e.message.includes("PerformanceServerTiming")){e.stopImmediatePropagation();e.preventDefault()}},true);'}} />
      </head>
      <body className="font-sans antialiased bg-white text-[#13233A]">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
