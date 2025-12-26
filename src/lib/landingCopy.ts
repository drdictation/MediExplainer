export interface RouteConfig {
    path: string;
    title: string;
    metaDescription: string;
    h1: string;
    subhead: string;
    bullets: Array<{ title?: string; text: string }>;
}

export const ROUTE_CONFIG: Record<string, RouteConfig> = {
    '/': {
        path: '/',
        title: 'Redact PDF Online | CleanSend',
        metaDescription: 'Manually redact sensitive information from PDFs in your browser. Client-side processing.',
        h1: 'Redact Sensitive Information from PDFs',
        subhead: 'Manually black out sensitive details directly in your browser. The final PDF is flattened into visual-only data, removing the underlying text layer.',
        bullets: [
            { title: 'Flattened Output', text: 'Pages are converted to unselectable images to obscure hidden text data.' },
            { title: 'Manual Precision', text: 'You decide exactly what is redacted by drawing black boxes yourself.' },
            { title: 'Local Processing', text: 'Files are handled in your browser after the page loads.' },
            { title: 'Suitable for Sharing', text: 'Useful for statements, IDs, and personal documents.' },
        ],
    },
    '/redact-bank-statement': {
        path: '/redact-bank-statement',
        title: 'Redact Bank Statements from PDFs | CleanSend',
        metaDescription: 'Redact bank statements in your browser. Manually black out sensitive fields and export a PDF where pages behave like images (no selectable text).',
        h1: 'Redact Bank Statements from PDFs',
        subhead: 'Black out account numbers and personal details directly in your browser. The final PDF is flattened into visual-only data, removing the underlying text layer.',
        bullets: [
            { title: 'Manual Precision', text: 'Manual redaction you control (draw black boxes).' },
            { title: 'Local Processing', text: 'Local processing in your browser after the page loads.' },
            { title: 'Flattened Output', text: 'Flattened output removes underlying text layer.' },
            { title: 'Ready for Sharing', text: 'Useful before sharing statements with third parties.' },
        ],
    },
    '/redact-id': {
        path: '/redact-id',
        title: 'Redact ID Documents from PDFs | CleanSend',
        metaDescription: 'Redact ID documents in your browser. Manually black out sensitive details and export a flattened PDF with no selectable text.',
        h1: 'Redact ID Documents from PDFs',
        subhead: 'Manually black out sensitive fields before sharing. The final PDF is flattened into visual-only data, removing the underlying text layer.',
        bullets: [
            { title: 'Precise Control', text: 'Manual precision (you choose what is redacted).' },
            { title: 'Local Processing', text: 'Local processing in your browser after the page loads.' },
            { title: 'Flattened Output', text: 'Flattened output removes underlying text layer.' },
            { title: 'Identity Protection', text: 'Useful for IDs and personal documents.' },
        ],
    },
    '/redact-visa': {
        path: '/redact-visa',
        title: 'Redact Visa Documents from PDFs | CleanSend',
        metaDescription: 'Redact visa documents in your browser. Manually black out sensitive fields and export a flattened PDF with no selectable text.',
        h1: 'Redact Visa Documents from PDFs',
        subhead: 'Black out sensitive fields manually before sharing. The final PDF is flattened into visual-only data, removing the underlying text layer.',
        bullets: [
            { title: 'Manual Redaction', text: 'Manual redaction (draw black boxes).' },
            { title: 'Local Processing', text: 'Local processing in your browser after the page loads.' },
            { title: 'Flattened Output', text: 'Flattened output removes underlying text layer.' },
            { title: 'Travel Ready', text: 'Useful for travel and identity documents.' },
        ],
    },
    '/redact-rental-application': {
        path: '/redact-rental-application',
        title: 'Redact Documents for Rental Applications | CleanSend',
        metaDescription: 'Prepare documents for rental applications. Manually redact sensitive details and export a flattened PDF with no selectable text.',
        h1: 'Redact Documents for Rental Applications',
        subhead: 'Manually black out sensitive fields before submission. The final PDF is flattened into visual-only data, removing the underlying text layer.',
        bullets: [
            { title: 'In Your Control', text: 'Manual redaction you control.' },
            { title: 'Local Processing', text: 'Local processing in your browser after the page loads.' },
            { title: 'Flattened Output', text: 'Flattened output removes underlying text layer.' },
            { title: 'Application Ready', text: 'Useful for statements, IDs, and application documents.' },
        ],
    },
};

export function getRouteConfig(pathname: string): RouteConfig {
    // 1. Normalize: Remove ONE OR MORE trailing slashes regex (except for root '/')
    const normalizedPath = pathname === '/' ? pathname : pathname.replace(/\/+$/, '');

    // 2. Lookup
    const config = ROUTE_CONFIG[normalizedPath];

    // 3. Fallback (Soft 404 Safeguard)
    return config || ROUTE_CONFIG['/'];
}
