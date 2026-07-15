export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/portal/', '/api/'],
      },
    ],
    sitemap: 'https://www.web-frame.eu/sitemap.xml',
  }
}
