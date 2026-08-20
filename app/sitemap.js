export default function sitemap() {
  const base = process.env.NEXT_PUBLIC_BASE_URL || 'https://urbandryclean.in'
  const routes = ['', '/services', '/price-list', '/about', '/faq', '/contact']
  const now = new Date()
  return routes.map(r => ({
    url: `${base}${r}`,
    lastModified: now,
    changeFrequency: r === '' ? 'weekly' : 'monthly',
    priority: r === '' ? 1.0 : 0.8,
  }))
}
