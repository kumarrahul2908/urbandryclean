'use client'
import { Sparkles } from 'lucide-react'

export default function OfferBadge({ size = 'md', className = '' }) {
  const sizes = {
    sm: 'px-3 py-1 text-[11px]',
    md: 'px-3.5 py-1.5 text-xs',
    lg: 'px-4 py-2 text-sm',
  }
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-bold uppercase tracking-wider text-white shadow-sm ${sizes[size]} ${className}`}
      style={{ background: 'linear-gradient(90deg, #42A62B 0%, #287E1E 100%)' }}
    >
      <Sparkles className="h-3.5 w-3.5" />
      Flat 25% OFF on Dry Cleaning
    </span>
  )
}
