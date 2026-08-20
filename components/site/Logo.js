'use client'
import Image from 'next/image'
import logoSrc from '@/lib/assets/logo.jpg'

export default function Logo({ className = 'h-20 md:h-24 w-auto', priority = false }) {
  return (
    <div className={`flex items-center ${className}`} aria-label="Urban Dry Clean">
      <Image
        src={logoSrc}
        alt="Urban Dry Clean — Premium Dry Cleaning Service"
        priority={priority}
        placeholder="blur"
        width={200}
        height={200}
        className="h-20 md:h-24 w-auto object-contain"
        style={{ mixBlendMode: 'multiply' }}
      />
    </div>
  )
}
