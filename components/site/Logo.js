'use client'
import Image from 'next/image'

export default function Logo({ className = 'h-11 w-auto', priority = false }) {
  return (
    <div className={`flex items-center ${className}`} aria-label="Urban Dry Clean">
      {/* Using next/image for optimization; logo file is the official artwork */}
      <Image
        src="/logo.jpg"
        alt="Urban Dry Clean — Premium Dry Cleaning Service"
        width={220}
        height={110}
        priority={priority}
        className="h-20 md:h-24 w-auto object-contain"
        style={{ mixBlendMode: 'multiply' }}
      />
    </div>
  )
}
