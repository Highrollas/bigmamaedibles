import Category from '@/models/Category';
import Products from '@/models/Products';
import Posts from '@/models/Posts';
import { NextResponse } from 'next/server';

export async function GET() {
      const baseUrl = 'https://bigmamasedibles.cc';

      // Helper to escape dangerous XML chars
      function escapeXml(unsafe: string) {
            return unsafe.replace(/&/g, '&amp;')
                  .replace(/</g, '&lt;')
                  .replace(/>/g, '&gt;')
                  .replace(/"/g, '&quot;')
                  .replace(/'/g, '&apos;');
      }

      try {
            // Fetch data with updatedAt
            const categories = await Category.find({}, { slug: 1, updatedAt: 1 }).lean();
            const products = await Products.find({}, { slug: 1, updatedAt: 1 }).lean();
            const posts = await Posts.find({}, { slug: 1, updatedAt: 1 }).lean();

            // Static pages (public only)
            const staticPages = [
                  '/',
                  '/pay-using-apple-pay-or-bank-card',
                  '/email-contact-form',
                  '/account/login',
                  '/account/register',
                  '/pay-using-moonpay',
                  '/checkout',
                  '/how-to-order',
                  '/contact',
                  '/cart',
            ];

            const now = new Date().toISOString();

            // Build full list: each as { loc, lastmod }
            const urls = [
                  ...staticPages.map(path => ({
                        loc: `${baseUrl}${path}`,
                        lastmod: now,  // you could replace with real deploy date if known
                  })),
                  ...categories.map(c => ({
                        loc: `${baseUrl}/product-category/${c.slug}`,
                        lastmod: c.updatedAt ? new Date(c.updatedAt).toISOString() : now,
                  })),
                  ...products.map(p => ({
                        loc: `${baseUrl}/product/${p.slug}`,
                        lastmod: p.updatedAt ? new Date(p.updatedAt).toISOString() : now,
                  })),
                  ...posts.map(post => ({
                        loc: `${baseUrl}/${post.slug}`,
                        lastmod: post.updatedAt ? new Date(post.updatedAt).toISOString() : now,
                  })),
            ];

            // Build XML sitemap
            const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
                  <urlset
                        xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
                        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
                        xmlns:xhtml="http://www.w3.org/1999/xhtml"
                        xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0"
                        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
                        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
                        ${urls.map(item => `
                        <url>
                              <loc>${escapeXml(item.loc)}</loc>
                              <lastmod>${item.lastmod}</lastmod>
                              <changefreq>daily</changefreq>
                              <priority>0.7</priority>
                        </url>`).join('')}
                  </urlset>`.trim();

            return new NextResponse(sitemap, {
                  headers: { 'Content-Type': 'application/xml' },
            });

      } catch (error) {
            console.error('Error generating sitemap:', error);
            return new NextResponse('Failed to generate sitemap', { status: 500 });
      }
}

