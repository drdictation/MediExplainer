
import { writeFile } from 'fs/promises';
import { resolve } from 'path';
import { ROUTE_CONFIG } from '../src/lib/landingCopy.ts';

const BASE_URL = 'https://explainmymedicalreport.com';

async function generateSitemap() {
    const routes = Object.values(ROUTE_CONFIG);
    const date = new Date().toISOString().split('T')[0];

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes.map(route => {
        // Ensure path starts with /
        const path = route.path.startsWith('/') ? route.path : `/${route.path}`;
        // Handle root path correctly
        const url = path === '/' ? BASE_URL : `${BASE_URL}${path}`;

        return `    <url>
        <loc>${url}</loc>
        <lastmod>${date}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>${path === '/' ? '1.0' : '0.8'}</priority>
    </url>`;
    }).join('\n')}
</urlset>`;

    const robots = `User-agent: *
Allow: /
Sitemap: ${BASE_URL}/sitemap.xml
`;

    const publicDir = resolve(process.cwd(), 'public');

    await writeFile(resolve(publicDir, 'sitemap.xml'), sitemap);
    console.log('✅ Generated public/sitemap.xml');

    await writeFile(resolve(publicDir, 'robots.txt'), robots);
    console.log('✅ Generated public/robots.txt');
}

generateSitemap().catch(console.error);
