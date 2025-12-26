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
    disclaimer: string;
}

const COMMON_DISCLAIMER = "This tool explains medical language in plain terms. It does not provide medical advice, diagnosis, or treatment recommendations. Always consult a qualified clinician for health concerns.";

export const ROUTE_CONFIG: Record<string, RouteConfig> = {
    '/': {
        path: '/',
        primarySearchIntent: 'Explain Medical Report',
        h1: 'Understand Your Medical Report',
        subhead: 'Transform complex medical language into plain English. Secure, private, and instant explanation of your results.',
        whyThisMatters: [
            { title: 'Plain English', text: 'We translate medical jargon into simple language you can actually understand.' },
            { title: 'Private & Secure', text: 'Your report is processed locally on your device or via secure, private channels. No data retention.' },
            { title: 'Questions to Ask', text: 'Get a list of specific, neutral questions to ask your doctor about your results.' },
            { title: 'No Medical Advice', text: 'We explain the *what*, not the *what to do*. No diagnosis or treatment advice.' },
        ],
        howThisWorks: 'Upload your PDF. We analyze the terminology and structure to provide a clear, educational explanation.',
        trustSignals: 'Private & Secure • No "Doctor" Claims • Explanations Only',
        ctaText: 'Upload Report for Explanation',
        metaTitle: 'Medical Report Explainer | Understand Your Results | Private',
        metaDescription: 'Upload medical reports, lab results, or discharge summaries to get a plain English explanation. Private, secure, and purely educational. No medical advice.',
        disclaimer: COMMON_DISCLAIMER,
    },
    '/explain-lab-results': {
        path: '/explain-lab-results',
        primarySearchIntent: 'Explain Lab Results',
        h1: 'Understand Your Lab Results',
        subhead: 'Confused by "HDL", "ALT", or "Creatinine"? Get a line-by-line explanation of your lab report in plain English.',
        whyThisMatters: [
            { title: 'Define Terms', text: 'Know exactly what each test measures and why it matters.' },
            { title: 'Reference Ranges', text: 'Understand what "normal range" means conceptually, without diagnostic claims.' },
            { title: 'Prepare for Visit', text: 'Walk into your appointment knowing exactly what to ask your clinician.' },
        ],
        howThisWorks: 'Upload your lab PDF. We extract the test names and values to explain what they mean.',
        trustSignals: 'Private Processing • Educational Only • No Diagnosis',
        ctaText: 'Explain Lab Results',
        metaTitle: 'Lab Results Explainer | Blood Work & Urine Tests | Private',
        metaDescription: 'Understand your blood test and lab results. We explain medical terms and reference ranges in plain English. Private and secure.',
        disclaimer: COMMON_DISCLAIMER,
    },
    '/explain-imaging-report': {
        path: '/explain-imaging-report',
        primarySearchIntent: 'Explain MRI/CT/X-Ray',
        h1: 'Understand Imaging Reports',
        subhead: 'Make sense of your X-Ray, MRI, or CT scan report. We decode the radiological terms into clear language.',
        whyThisMatters: [
            { title: 'Anatomy Explained', text: 'Understand which body parts and structures are being discussed.' },
            { title: 'Findings vs. Impressions', text: 'Learn the difference between what was seen and what it might mean.' },
            { title: 'Neutral Clarity', text: 'Get the facts without the panic. We stay neutral and objective.' },
        ],
        howThisWorks: 'Upload your imaging report. We break down the "Findings" and "Impression" sections.',
        trustSignals: 'No Image Upload Needed • Text Analysis • Private',
        ctaText: 'Explain Imaging Report',
        metaTitle: 'MRI & CT Scan Report Explainer | Understand Radiology Results',
        metaDescription: 'Decode your MRI, CT, or X-Ray report. We explain radiological terms and findings in plain English. Private and secure.',
        disclaimer: COMMON_DISCLAIMER,
    },
    '/explain-discharge-summary': {
        path: '/explain-discharge-summary',
        primarySearchIntent: 'Explain Hospital Discharge',
        h1: 'Understand Discharge Summaries',
        subhead: 'Left the hospital confused? We explain your discharge summary, medications lists, and follow-up instructions.',
        whyThisMatters: [
            { title: 'Medication Context', text: 'Understand the classes of medications mentioned in your summary.' },
            { title: 'Hospital Course', text: 'Get a clear timeline of what happened during your stay.' },
            { title: 'Next Steps Clarity', text: 'Identify the key "plan" items to discuss with your primary care provider.' },
        ],
        howThisWorks: 'Upload your discharge PDF. We organize the chaos into a structured summary.',
        trustSignals: 'Hospital Record Friendly • Local Privacy • Educational',
        ctaText: 'Explain Discharge Summary',
        metaTitle: 'Hospital Discharge Summary Explainer | Understand Medical Notes',
        metaDescription: 'Make sense of your hospital discharge summary. We explain medical notes and instructions in plain English. Private and secure.',
        disclaimer: COMMON_DISCLAIMER,
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
