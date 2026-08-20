'use client'
import Image from 'next/image'
import logoSrc from '@/lib/assets/logo.jpg'

export default function SiteLogo({ dark = false }) {
  const inner = (
    <Image
      src={logoSrc}
      alt="Urban Dry Clean — Premium Dry Cleaning Service"
      priority
      placeholder="blur"
      width={200}
      height={200}
      className="h-20 md:h-24 w-auto object-contain"
      style={{ mixBlendMode: 'multiply' }}
    />
  )
  if (dark) {
    return <div className="inline-flex items-center rounded-lg bg-white px-3 py-2">{inner}</div>
  }
  return <div className="flex items-center">{inner}</div>
}
