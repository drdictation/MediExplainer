export interface RouteConfig {
    path: string;
    primarySearchIntent: string; // Internal note for SEO intent
    h1: string;
    subhead: string;
    whyThisMatters: Array<{ title: string; text: string }>;
    howThisWorks: string;
    trustSignals: string;
    ctaText: string;
    metaTitle: string;
    metaDescription: string;
}

export const ROUTE_CONFIG: Record<string, RouteConfig> = {
    '/': {
        path: '/',
        primarySearchIntent: 'General PDF Redaction',
        h1: 'Black Out Sensitive Data in PDFs',
        subhead: 'Redact text permanently before sharing. Your files are processed 100% locally in your browser and are never uploaded to a server.',
        whyThisMatters: [
            { title: 'Flattened Output', text: 'Pages are converted to unselectable images to obscure hidden text data.' },
            { title: 'Manual Precision', text: 'You decide exactly what is redacted by drawing black boxes yourself.' },
            { title: 'Local Processing', text: 'Files are handled in your browser after the page loads.' },
            { title: 'Suitable for Sharing', text: 'Useful for statements, IDs, and personal documents.' },
        ],
        howThisWorks: 'Load your PDF, draw black boxes over sensitive text, and export a flattened, image-only version that cannot be un-redacted.',
        trustSignals: 'No server upload • Client-side processing • Flattened image output',
        ctaText: 'Select PDF to Redact',
        metaTitle: 'Redact PDF Online | RedactPDF',
        metaDescription: 'Black out sensitive information from PDFs directly in your browser. No server upload—files never leave your device.',
    },
    '/redact-bank-statement': {
        path: '/redact-bank-statement',
        primarySearchIntent: 'Hide bank account numbers/balance',
        h1: 'Black Out Sensitive Data on Bank Statements',
        subhead: 'Hide account numbers and balances before sharing. Your bank statement is processed locally in your browser and never sent to a server.',
        whyThisMatters: [
            { title: 'Hide Financial Details', text: 'Remove account numbers, balances, and transaction history from view.' },
            { title: 'Prevent Identity Theft', text: 'Ensure your banking details cannot be scraped or copied by third parties.' },
            { title: 'Secure for Emailing', text: 'Safe to send to landlords or lenders once sensitive data is flattened.' },
        ],
        howThisWorks: 'Upload your statement, draw irreversible black boxes over account numbers, and save a flattened copy.',
        trustSignals: 'Processed on your device • No bank data uploaded • Image-only export',
        ctaText: 'Select Bank Statement',
        metaTitle: 'Redact Bank Statements Online | Secure & Private',
        metaDescription: 'Black out account numbers and transaction details in your bank statement. No server upload—files stay on your device.',
    },
    '/redact-rental-application': {
        path: '/redact-rental-application',
        primarySearchIntent: 'Clean documents for rental application',
        h1: 'Black Out Data for Rental Applications',
        subhead: 'Hide SSNs and account details before submitting. Your documents are processed 100% locally in your browser.',
        whyThisMatters: [
            { title: 'Protect Your SSN', text: 'Never share your full Social Security Number with agents unless absolutely required.' },
            { title: 'Hide Cross-References', text: 'Redact deeply personal info that isn’t relevant to your application approval.' },
            { title: 'Landlord Ready', text: 'Submit clean, professional-looking proofs of income and ID.' },
        ],
        howThisWorks: 'Open your application docs, manually cover sensitive fields, and download a secure image-based PDF.',
        trustSignals: 'Files never leave your computer • Manual control • 100% Client-side',
        ctaText: 'Select Application Doc',
        metaTitle: 'Redact Documents for Rental Applications | Secure Tool',
        metaDescription: 'Prepare rental application documents by blacking out sensitive data. No server upload—files never leave your computer.',
    },
    '/redact-passport': {
        path: '/redact-passport',
        primarySearchIntent: 'Hide passport number/DOB',
        h1: 'Black Out Details on Passport Copies',
        subhead: 'Hide passport numbers and personal data before sharing. Your ID stays on your device and is never uploaded to the cloud.',
        whyThisMatters: [
            { title: 'Hide Passport Number', text: 'Prevent identity cloning by obscuring your unique passport number.' },
            { title: 'Mask Biometric Data', text: 'Cover photo or signature if they are not required for verification.' },
            { title: 'Safe International Sharing', text: 'Send copies to hotels or agencies without exposing full manufacturing data.' },
        ],
        howThisWorks: 'Load your passport scan, draw boxes over the MRZ code and numbers, and export a safe copy.',
        trustSignals: 'No cloud storage • Browser-based only • Irreversible redaction',
        ctaText: 'Select Passport Scan',
        metaTitle: 'Redact Passport Documents Securely | No Upload',
        metaDescription: 'Black out sensitive details on passport scans. No server upload—redact securely in your browser.',
    },
    '/redact-visa': {
        path: '/redact-visa',
        primarySearchIntent: 'Hide visa number/status details',
        h1: 'Black Out Sensitive Info on Visas',
        subhead: 'Hide personal details manually before sharing. Your visa documents are processed locally on your device, ensuring privacy.',
        whyThisMatters: [
            { title: 'Protect Immigration Status', text: 'Share only what’s needed for proof of right-to-rent or work.' },
            { title: 'Hide Application Numbers', text: 'Keep case reference numbers private to prevent unauthorized tracking.' },
            { title: 'Clean Digital Copies', text: 'Create safe versions of visa stamps for employers or landlords.' },
        ],
        howThisWorks: 'Select your visa PDF, block out the control numbers, and save a flattened version instantly.',
        trustSignals: 'Zero server uploads • Private processing • Image-only PDF',
        ctaText: 'Select Visa Document',
        metaTitle: 'Redact Visa Documents | Secure & Private',
        metaDescription: 'Redact sensitive info from visa documents. No server upload—files are processed locally in your browser.',
    },
    '/redact-id': {
        path: '/redact-id',
        primarySearchIntent: 'Hide driver licence number/address',
        h1: 'Black Out Details on ID Cards',
        subhead: 'Hide license numbers and home addresses before sharing. Your ID stays on your device and is never uploaded to the cloud.',
        whyThisMatters: [
            { title: 'Mask License Number', text: 'Your driver’s license number is a key target for identity theft—hide it.' },
            { title: 'Hide Home Address', text: 'Verify your age or name without giving away exactly where you live.' },
            { title: 'Prevent Duplicate Cards', text: 'Make it impossible for scammers to reprint a fake card with your info.' },
        ],
        howThisWorks: 'Upload your ID scan, draw solid boxes over address/number, and download a flattened image PDF.',
        trustSignals: 'Client-side privacy • No server logs • Permanent removal',
        ctaText: 'Select ID Document',
        metaTitle: 'Redact ID & Driver License | No Server Upload',
        metaDescription: 'Black out sensitive details on ID documents. No server upload—redact securely in your browser.',
    },
    '/redact-financial-documents': {
        path: '/redact-financial-documents',
        primarySearchIntent: 'Hide salary/tax file number',
        h1: 'Black Out Data on Financial Documents',
        subhead: 'Hide salary details and tax numbers before sending. Your files are processed locally in your browser and are never stored online.',
        whyThisMatters: [
            { title: 'Hide Salary Info', text: 'Share employment proof without revealing your exact income package.' },
            { title: 'Mask Tax Numbers', text: 'Redact TFN/SSN/NI numbers from payslips to prevent fraud.' },
            { title: 'Secure Tax Summaries', text: 'Flatten tax documents so values cannot be copied or scraped.' },
        ],
        howThisWorks: 'Import your playslip or tax form, cover the private figures, and export a secure image PDF.',
        trustSignals: 'Private local tool • No financial data uploaded • Flattened output',
        ctaText: 'Select Financial Doc',
        metaTitle: 'Redact Payslips & Financial Docs | Secure',
        metaDescription: 'Redact tax returns, payslips, and financial summaries locally. No server upload.',
    },
    '/redact-legal-documents': {
        path: '/redact-legal-documents',
        primarySearchIntent: 'Hide names/settlement amounts',
        h1: 'Black Out Text in Legal Documents',
        subhead: 'Hide names, dates, and amounts permanently. Files are processed 100% on your computer and never touch a server.',
        whyThisMatters: [
            { title: 'Protect Client Privilege', text: 'Ensure names and specific clauses are unreadable in shared copies.' },
            { title: 'Hide Settlement Figures', text: 'Redact amounts effectively so the underlying text is gone forever.' },
            { title: 'Sanitize Evidence', text: 'Prepare discovery documents by removing irrelevant sensitive info.' },
        ],
        howThisWorks: 'Load the contract or affidavit, manually black out clauses, and save as a flat image-based PDF.',
        trustSignals: 'Confidential processing • Zero data retention • Manual verify',
        ctaText: 'Select Legal Doc',
        metaTitle: 'Redact Legal Documents & Contracts | Private',
        metaDescription: 'Securely redact legal contracts and court documents in your browser. No server upload.',
    },
    '/redact-medical-records': {
        path: '/redact-medical-records',
        primarySearchIntent: 'Hide patient name/diagnosis',
        h1: 'Black Out Patient Info on Medical Records',
        subhead: 'Hide patient names and diagnoses before sharing. Your records are processed locally on your device for maximum privacy.',
        whyThisMatters: [
            { title: 'HIPAA/GDPR Safety', text: 'Manually ensure patient identifiers are completely covered.' },
            { title: 'Hide Specific Conditions', text: 'Share proof of treatment without revealing the detailed diagnosis.' },
            { title: 'Protect Provider Info', text: 'Redact doctor signatures or provider IDs if not relevant.' },
        ],
        howThisWorks: 'Open the medical record, draw boxes over PII/PHI, and export a non-selectable flattened copy.',
        trustSignals: 'No cloud processing • Local-only environment • Permanent redaction',
        ctaText: 'Select Medical Record',
        metaTitle: 'Redact Medical Records & Lab Results | No Upload',
        metaDescription: 'Black out sensitive patient info on medical records. Zero server upload—100% client-side privacy.',
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
