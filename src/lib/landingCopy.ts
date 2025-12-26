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
        metaDescription: 'Black out sensitive information from PDFs directly in your browser. No server upload—files never leave your device.',
        h1: 'Black Out Sensitive Data in PDFs',
        subhead: 'Redact text permanently before sharing. Your files are processed 100% locally in your browser and are never uploaded to a server.',
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
        metaDescription: 'Black out account numbers and transaction details in your bank statement. No server upload—files stay on your device.',
        h1: 'Black Out Sensitive Data on Bank Statements',
        subhead: 'Hide account numbers and balances before sharing. Your bank statement is processed locally in your browser and never sent to a server.',
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
        metaDescription: 'Black out sensitive details on ID documents. No server upload—redact passports and licenses securely in your browser.',
        h1: 'Black Out Details on ID Documents',
        subhead: 'Hide personal numbers and addresses before sharing. Your ID document stays on your device and is never uploaded to the cloud.',
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
        metaDescription: 'Redact sensitive info from visa documents. No server upload—files are processed locally in your browser.',
        h1: 'Black Out Sensitive Info on Visas',
        subhead: 'Hide personal details manually before sharing. Your visa documents are processed locally on your device, ensuring privacy.',
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
        metaDescription: 'Prepare rental application documents by blacking out sensitive data. No server upload—files never leave your computer.',
        h1: 'Black Out Data for Rental Applications',
        subhead: 'Hide SSNs and account details before submitting. Your documents are processed 100% locally in your browser.',
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
