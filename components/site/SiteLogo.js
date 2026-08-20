'use client'

export default function SiteLogo({ dark = false }) {
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
    return <div className="inline-flex items-center rounded-lg bg-white px-3 py-2">{inner}</div>
  }
  return <div className="flex items-center">{inner}</div>
}
