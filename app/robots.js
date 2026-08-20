export default function robots() {
  return {
    rules: [{ userAgent: '*', allow: '/', disallow: ['/api/'] }],
    sitemap: 'https://urbandryclean.in/sitemap.xml',
    host: 'https://urbandryclean.in',
  }
}
