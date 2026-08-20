export default function robots() {
  const base = process.env.NEXT_PUBLIC_BASE_URL || 'https://urbandryclean.in'
  return {
    rules: [{ userAgent: '*', allow: '/', disallow: ['/api/'] }],
    sitemap: `${base}/sitemap.xml`,
    host: base,
  }
}
