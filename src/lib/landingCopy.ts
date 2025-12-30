export interface RouteConfig {
    path: string;
    primarySearchIntent: string;
    h1: string;
    subhead: string;

    // New Extended Content Fields
    summary?: string;
    definition?: string;
    whyItAppears?: string;
    whatItDoesNotMean?: string;
    reportWording?: string;
    questions?: string[];
    relatedTopics?: Array<{ title: string; path: string }>;
    faq?: Array<{ question: string; answer: string }>;

    // Legacy / Shared
    whyThisMatters: Array<{ title: string; text: string }>;
    howThisWorks: string;
    trustSignals: string;
    ctaText: string;
    metaTitle: string;
    metaDescription: string;
    disclaimer: string;
    // New Conversion Elements
    offerBanner?: string; // e.g. "Launch Offer: $19.99 -> $9.99"
    heroMicrocopy?: string; // Text below CTA
    trustBadge?: string; // Override for specific trust badge text
    previewGrid?: Array<{ icon: 'file' | 'book' | 'question'; title: string; description: string }>;
    questionsTeaser?: { visible: string[]; blurred: string[]; unlockCta: string };
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
    // ... existing pages remain valid as they satisfy the structure (missing optional fields) ...
    '/explain-lab-results': {
        path: '/explain-lab-results',
        primarySearchIntent: 'Explain Lab Results',
        h1: 'Understand Your Lab Results',
        subhead: 'Confused by "HDL", "ALT", or "Creatinine"? Get a line-by-line explanation of your lab report.',
        whyThisMatters: [
            { title: 'Define Terms', text: 'Know exactly what each test measures and why it matters.' },
            { title: 'Reference Ranges', text: 'Understand what "normal range" means conceptually.' },
            { title: 'Prepare for Visit', text: 'Walk into your appointment knowing exactly what to ask.' },
        ],
        howThisWorks: 'Upload your lab PDF.',
        trustSignals: 'Private Processing • Educational Only',
        ctaText: 'Explain Lab Results',
        metaTitle: 'Lab Results Explainer | Blood Work & Urine Tests | Private',
        metaDescription: 'Understand your blood test and lab results. We explain medical terms and reference ranges. Private and secure.',
        disclaimer: COMMON_DISCLAIMER,
    },
    '/explain-imaging-report': {
        path: '/explain-imaging-report',
        primarySearchIntent: 'Explain Imaging Report',
        h1: 'Understand Imaging Reports',
        subhead: 'Make sense of your X-Ray, MRI, or CT scan report.',
        whyThisMatters: [
            { title: 'Anatomy Explained', text: 'Understand which body parts are being discussed.' },
            { title: 'Findings vs. Impressions', text: 'Learn the difference between what was seen and what it might mean.' },
            { title: 'Neutral Clarity', text: 'Get the facts without the panic.' },
        ],
        howThisWorks: 'Upload your imaging report.',
        trustSignals: 'No Image Upload Needed • Text Analysis',
        ctaText: 'Explain Imaging Report',
        metaTitle: 'MRI & CT Scan Report Explainer | Understand Radiology Results',
        metaDescription: 'Decode your MRI, CT, or X-Ray report. We explain radiological terms. Private and secure.',
        disclaimer: COMMON_DISCLAIMER,
    },
    '/explain-discharge-summary': {
        path: '/explain-discharge-summary',
        primarySearchIntent: 'Explain Hospital Discharge',
        h1: 'Understand Discharge Summaries',
        subhead: 'Left the hospital confused? We explain your discharge summary.',
        whyThisMatters: [
            { title: 'Medication Context', text: 'Understand the classes of medications mentioned.' },
            { title: 'Hospital Course', text: 'Get a clear timeline of what happened.' },
            { title: 'Next Steps Clarity', text: 'Identify the key "plan" items.' },
        ],
        howThisWorks: 'Upload your discharge PDF.',
        trustSignals: 'Hospital Record Friendly • Local Privacy',
        ctaText: 'Explain Discharge Summary',
        metaTitle: 'Hospital Discharge Summary Explainer | Understand Medical Notes',
        metaDescription: 'Make sense of your hospital discharge summary. We explain medical notes and instructions. Private and secure.',
        disclaimer: COMMON_DISCLAIMER,
    },

    // ------------------------------------------------------------------
    // NEW LANDING PAGES START HERE
    // ------------------------------------------------------------------

    '/what-is-ipmn-pancreas-ct-mri-report': {
        path: '/what-is-ipmn-pancreas-ct-mri-report',
        primarySearchIntent: 'IPMN Pancreas CT MRI',
        h1: 'IPMN pancreas on CT or MRI report: what it means',
        subhead: 'Why the exact wording in your report matters more than the diagnosis label',
        summary: 'IPMN is a common finding on modern CT and MRI scans. But the same word can describe very different situations depending on size, duct involvement, and specific phrases used by the radiologist. This tool explains your exact report wording, not just the definition.',

        definition: `
            <p><strong>IPMN</strong> stands for <strong>Intraductal Papillary Mucinous Neoplasm</strong>.</p>
            <ul>
                <li><strong>Intraductal:</strong> It grows inside the "ducts" (tubes) of the pancreas.</li>
                <li><strong>Papillary:</strong> Under a microscope, the cells look like tiny fingers or fronds.</li>
                <li><strong>Mucinous:</strong> It produces thick fluid called mucin.</li>
                <li><strong>Neoplasm:</strong> A medical term for "new growth".</li>
            </ul>
        `,
        whyItAppears: `
            <p>IPMNs are often found "incidentally" on scans done for other reasons. Because modern scanners are so detailed, they pick up very small cysts that might not have been visible years ago.</p>
            <p>Radiologists describe them based on potential risk:</p>
            <ul>
                <li><strong>Main Duct IPMN:</strong> In the primary drainage tube (often higher concern).</li>
                <li><strong>Side Branch IPMN:</strong> In the smaller branches (often lower concern).</li>
            </ul>
        `,
        whatItDoesNotMean: `
            <p>Seeing "IPMN" on a report <strong>does NOT automatically mean you have pancreatic cancer.</strong></p>
            <p>Many IPMNs are indolent (slow-growing) and stable. The risk depends entirely on the "worrisome features" or "high-risk stigmata" mentioned in the text of your report.</p>
        `,
        reportWording: `
            <p><strong>The context is everything.</strong> Your report likely contains specific adjectives that change the meaning:</p>
            <ul>
                <li><strong>"Worrisome features":</strong> A specific medical checklist (like cyst size >3cm) that triggers closer follow-up.</li>
                <li><strong>"High-risk stigmata":</strong> Signs that suggest a need for expert evaluation.</li>
                <li><strong>"Communication with duct":</strong> A key diagnostic detail distinguishing it from other cysts.</li>
            </ul>
        `,
        questions: [
            "Does the report specify if this is Side-branch, Main-duct, or Mixed type?",
            "Did the radiologist identify any current 'worrisome features'?",
            "based on the size, do I need a follow-up MRI in 6 months or 1 year?",
            "Is a referral to a gastroenterologist recommended for this specific finding?",
            "Should I track CA 19-9 blood levels?"
        ],
        faq: [
            { question: "Is an IPMN a tumor?", answer: "Technically yes, 'neoplasm' means tumor, but in this context, it usually refers to a precancerous cyst that needs monitoring." },
            { question: "Can it disappear?", answer: "Rarely. Usually, they are stable or grow very slowly over years." },
            { question: "Is surgery always needed?", answer: "No. Surgery is typically reserved for IPMNs that show specific high-risk changes. Many are just watched safely." }
        ],
        relatedTopics: [
            { title: "Lung Nodule on CT", path: "/lung-nodule-ct-scan-report-meaning" },
            { title: "Fatty Liver on Ultrasound", path: "/fatty-liver-hepatic-steatosis-meaning" }
        ],
        whyThisMatters: [],
        howThisWorks: 'Upload your CT or MRI report.',
        trustSignals: 'Private • Educational • Radiology Explainer',
        ctaText: 'Explain My Pancreas Report',
        metaTitle: 'IPMN Pancreas on CT or MRI Report | Meaning & Explanation',
        metaDescription: 'Found "IPMN" on your pancreas CT or MRI report? Learn why specific wording like "Main Duct" vs "Side Branch" matters for your diagnosis.',
        disclaimer: COMMON_DISCLAIMER
    },

    '/lung-nodule-ct-scan-report-meaning': {
        path: '/lung-nodule-ct-scan-report-meaning',
        primarySearchIntent: 'Lung Nodule CT Scan',

        // Variant A: Appointment Preparation Framing
        h1: 'Prepare for Your Doctor Appointment About Your Lung Nodule',
        subhead: 'Understand the exact wording in your CT report — and get the questions doctors expect you to ask.',

        offerBanner: '🎉 Launch Offer: $19.99 → $9.99 (Limited Time)',
        trustBadge: '🛡️ Private & Educational Only — No Diagnosis, No Medical Advice',
        ctaText: 'Upload Report to Prepare',
        heroMicrocopy: 'Free preview generated instantly. Full explanation with questions to ask your doctor available for $9.99.',

        previewGrid: [
            { icon: 'file', title: 'Report Wording Explained', description: 'We highlight the specific phrases that matter in your scan results' },
            { icon: 'book', title: 'Key Terms Defined', description: 'Plain-English definitions for medical jargon like "ground-glass opacity"' },
            { icon: 'question', title: 'Questions for Your Doctor', description: 'A list of specific, neutral questions tailored to your findings' }
        ],

        // Consolidated Educational Content
        definition: `
            <h3>What does "lung nodule" mean on a CT scan?</h3>
            <p>A <strong>lung nodule</strong> is simply a "spot" or shadow seen on a scan. It describes <em>what it looks like</em>, not what it is. Most nodules are found incidentally and are completely benign — often scars from old infections or small lymph nodes.</p>
        `,
        whyItAppears: `
            <h3>Why does "lung nodule" appear on so many reports?</h3>
            <p>Modern CT scanners are incredibly sensitive. They detect spots as small as a few millimeters — things that might never have been seen on older equipment. Common causes include:</p>
            <ul>
                <li><strong>Old Infections:</strong> Healed scars from past colds or fungal exposures.</li>
                <li><strong>Lymph nodes:</strong> Small immune system filters in the lung.</li>
                <li><strong>Inflammation:</strong> Reactive tissue from dust or allergies.</li>
            </ul>
        `,
        whatItDoesNotMean: `
            <h3>What a lung nodule does NOT automatically mean</h3>
            <p>Seeing "lung nodule" on your report does <strong>NOT</strong> automatically mean lung cancer.</p>
            <p>Over 95% of small nodules found on screening CTs are benign. The urgency depends entirely on:</p>
            <ul>
                <li><strong>The size:</strong> Millimeters matter.</li>
                <li><strong>The texture:</strong> Solid vs. ground-glass.</li>
                <li><strong>Stability:</strong> Has it changed compared to prior scans?</li>
            </ul>
        `,
        reportWording: `
            <h3>Report phrases that change the meaning</h3>
            <p>Radiologists use specific vocabulary that carries different weight. Looking for these in your report is key:</p>
            <ul>
                <li><strong>"Spiculated":</strong> Edges that look spiked (a feature that may need closer follow-up).</li>
                <li><strong>"Smooth" or "Calcified":</strong> Features that often suggest a benign cause.</li>
                <li><strong>"Stable":</strong> Unchanged from prior scans (typically the most reassuring phrase).</li>
                <li><strong>"Ground-glass":</strong> A hazy appearance that requires context to interpret.</li>
            </ul>
        `,

        // Questions Teaser Section
        questionsTeaser: {
            visible: [
                "What is the exact size of the nodule in millimeters?",
                "Is it described as solid, ground-glass, or part-solid?"
            ],
            blurred: [
                "Are there old scans to compare it to?",
                "Does the report recommend a follow-up scan?",
                "Is the nodule calcified?",
                "What is the Lung-RADS score?"
            ],
            unlockCta: "Unlock all questions tailored to YOUR findings"
        },

        // Legacy / Fallback for SEO
        questions: [
            "What is the exact size of the nodule in millimeters?",
            "Is it described as solid, ground-glass, or part-solid?",
            "Are there old scans to compare it to?",
            "Does the report recommend a follow-up scan in 3, 6, or 12 months?",
            "Is the nodule calcified?"
        ],

        faq: [
            { question: "Is a lung nodule dangerous?", answer: "Not necessarily. The size, texture, and stability determine next steps. Most small nodules are benign." },
            { question: "What size is considered concerning?", answer: "Nodules under 6mm are very low risk. Nodules over 8mm generally require closer follow-up or additional testing." },
            { question: "Will I need surgery?", answer: "Most people don't. 'Watch and wait' (repeat scans to check stability) is the most common approach for small nodules." },
            { question: "Does this tool give me a diagnosis?", answer: "No. We explain medical language and help you prepare questions for your doctor. Only a clinician can diagnose." },
            { question: "Is my data private?", answer: "Yes. Your report is processed securely. We do not store your medical data permanently." }
        ],
        relatedTopics: [
            { title: "Low eGFR on Blood Test", path: "/low-egfr-blood-test-meaning" },
            { title: "IPMN Pancreas", path: "/what-is-ipmn-pancreas-ct-mri-report" }
        ],
        whyThisMatters: [], // Deprecated for this page, replaced by header content
        howThisWorks: 'Upload your Chest CT report.',
        trustSignals: 'Secure Private Processing • No Diagnosis • Educational Only',

        // SEO Metadata
        metaTitle: 'Lung Nodule on CT Scan Report | Meaning & Analysis',
        metaDescription: 'Found a lung nodule on your CT scan? Prepare for your doctor appointment by understanding report wording like "ground-glass" or "calcified".',
        disclaimer: COMMON_DISCLAIMER
    },

    '/fatty-liver-hepatic-steatosis-meaning': {
        path: '/fatty-liver-hepatic-steatosis-meaning',
        primarySearchIntent: 'Fatty Liver Ultrasound',
        h1: 'Fatty Liver / Hepatic Steatosis on ultrasound: what it means',
        subhead: 'Why the "Grade" and specific ultrasound description matter for your liver health',
        summary: 'Hepatic steatosis is a very common finding, but reports use specific technical phrases like "coarsened echotexture" or "focal sparing" to describe the severity and type. This tool explains exactly what your ultrasound report is describing.',
        definition: `
            <p><strong>Hepatic Steatosis</strong> means the liver cells are storing too much fat.</p>
            <p>On ultrasound, this fat reflects sound waves, making the liver look "bright" (echogenic) compared to the kidney. It is a sign of metabolic stress on the liver.</p>
        `,
        whyItAppears: `
            <p>It typically appears due to metabolic factors (weight, sugar processing) or alcohol intake. The liver acts as a filter, and when overwhelmed, it stores energy as fat.</p>
        `,
        whatItDoesNotMean: `
            <p>Simple fatty liver does <strong>NOT</strong> means you have cirrhosis or permanent liver failure.</p>
            <p>It is often the first, reversible stage. However, distinguishing it from "fibrosis" (scarring) is key.</p>
        `,
        reportWording: `
            <p>The adjectives used in the report define the severity:</p>
            <ul>
                <li><strong>"Mild / Grade 1":</strong> Early changes.</li>
                <li><strong>"Severe / Grade 3":</strong> Significant fat infiltration obscuring deep structures.</li>
                <li><strong>"Coarsened echotexture":</strong> A phrase that can suggest underlying chronic changes or fibrosis (scarring) in addition to the fat.</li>
            </ul>
        `,
        questions: [
            "Does the report just mention 'steatosis' (fat), or also 'fibrosis' or 'coarsened texture'?",
            "Is the liver size (hepatomegaly) normal or enlarged?",
            "Do I need a FibroScan to check for stiffness/scarring?",
            "Are my liver enzymes (ALT/AST) elevated on blood work?",
            "Is this reversible with lifestyle changes?"
        ],
        faq: [
            { question: "Is it reversible?", answer: "Yes, usually. Weight loss is the most effective treatment for reducing liver fat." },
            { question: "Is it painful?", answer: "Rarely. It is usually a silent condition found accidentally on imaging." },
            { question: "What is MASLD?", answer: "The new medical term for Non-Alcoholic Fatty Liver Disease, focusing on metabolic dysfunction." }
        ],
        relatedTopics: [
            { title: "Low eGFR on Blood Test", path: "/low-egfr-blood-test-meaning" },
            { title: "Adenomatous Polyp", path: "/adenomatous-polyp-pathology-report-meaning" }
        ],
        whyThisMatters: [],
        howThisWorks: 'Upload your ultrasound report.',
        trustSignals: 'Private • Educational • Liver Health',
        ctaText: 'Explain My Ultrasound Report',
        metaTitle: 'Fatty Liver (Hepatic Steatosis) Ultrasound | Meaning & Grades',
        metaDescription: 'Diagnosed with Hepatic Steatosis? Learn why the specific "Grade" and terms like "coarsened echotexture" matter for your long-term health.',
        disclaimer: COMMON_DISCLAIMER
    },

    '/adenomatous-polyp-pathology-report-meaning': {
        path: '/adenomatous-polyp-pathology-report-meaning',
        primarySearchIntent: 'Adenomatous Polyp Pathology',
        h1: 'Adenomatous Polyp on pathology report: what it means',
        subhead: 'Why the specific type of polyp determines your cancer risk and follow-up timeline',
        summary: 'Not all polyps are the same. A "tubular adenoma" has a completely different safety profile and timeline than a "villous" or "serrated" polyp. This tool explains the specific pathology terms found in your report so you understand your risk.',
        definition: `
            <p>An <strong>Adenomatous Polyp</strong> (adenoma) is a growth that is considered "pre-cancerous."</p>
            <p>This does not mean it is cancer. It means it had the <em>potential</em> to turn into cancer years in the future if it hadn't been removed.</p>
        `,
        whyItAppears: `
            <p>They are caused by genetic changes in the colon lining cells. They are the target of colonoscopies—finding and removing them breaks the chain to cancer.</p>
        `,
        whatItDoesNotMean: `
            <p>It does <strong>NOT</strong> mean you have colon cancer.</p>
            <p>The "adenoma" label confirms that the preventative procedure worked—the risk was identified and removed. The focus now shifts to "when do I need to check again?"</p>
        `,
        reportWording: `
            <p>Your pathology report contains the details that calculate your future risk:</p>
            <ul>
                <li><strong>"Tubular":</strong> The most common, standard risk type.</li>
                <li><strong>"Villous" or "High-Grade Dysplasia":</strong> Features that suggest the polyp was further along the pathway, often requiring closer follow-up.</li>
                <li><strong>"Margins negative":</strong> Confirms the polyp was completely cut out.</li>
            </ul>
        `,
        questions: [
            "Was the polyp completely removed (margins negative)?",
            "Did it show any 'high-grade dysplasia'?",
            "Based on the number and type of polyps, is my next colonoscopy in 3, 5, or 10 years?",
            "Do I need to inform my siblings or children to start screening earlier?",
            "Was it sessile (flat) or pedunculated (on a stalk)?"
        ],
        faq: [
            { question: "Is it cancer?", answer: "No. Adenomas are benign but have the potential to become cancer." },
            { question: "What is a hyperplastic polyp?", answer: "A different type of polyp that typically has zero cancer potential. It is 'safer' than an adenoma." },
            { question: "Does this increase my risk?", answer: "People who grow adenomas are 'polyp formers' and are essentially at slightly higher risk of growing more, which is why surveillance intervals are shortened." }
        ],
        relatedTopics: [
            { title: "Low eGFR on Blood Test", path: "/low-egfr-blood-test-meaning" },
            { title: "Fatty Liver Meaning", path: "/fatty-liver-hepatic-steatosis-meaning" }
        ],
        whyThisMatters: [],
        howThisWorks: 'Upload your pathology report.',
        trustSignals: 'Private • Educational • Pathology Explainer',
        ctaText: 'Explain My Pathology Report',
        metaTitle: 'Adenomatous Polyp Pathology Report | Meaning & Risk',
        metaDescription: 'Pathology report say "Adenomatous Polyp"? Learn why terms like "Tubular" vs "Villous" determine your cancer risk and colonoscopy schedule.',
        disclaimer: COMMON_DISCLAIMER
    },

    '/low-egfr-blood-test-meaning': {
        path: '/low-egfr-blood-test-meaning',
        primarySearchIntent: 'Low eGFR Blood Test',
        h1: 'Low eGFR on blood test: what it means',
        subhead: 'Why a single number doesn\'t tell the whole story of your kidney health',
        summary: 'eGFR can fluctuate significantly due to hydration, diet, and age. Doctors rarely rely on a single result; they look for trends and specific context. This tool explains what your specific lab values indicate about your kidney function.',
        definition: `
            <p><strong>eGFR</strong> (Estimated Glomerular Filtration Rate) is a math calculation, not a direct measurement.</p>
            <p>It estimates how much blood your kidneys filter per minute based on the level of waste (creatinine) in your blood, plus your age and sex.</p>
        `,
        whyItAppears: `
            <p>A "low" reading often flags automatically on lab reports. It can be caused by:</p>
            <ul>
                <li><strong>True Kidney Strain:</strong> Diabetes or high blood pressure over time.</li>
                <li><strong>Temporary Factors:</strong> Dehydration, heavy exercise, or a high-protein meal before the test.</li>
                <li><strong>Age:</strong> eGFR naturally drops as we get older (which is normal).</li>
            </ul>
        `,
        whatItDoesNotMean: `
            <p>One low result does <strong>NOT</strong> automatically mean you have kidney failure.</p>
            <p>Chronic Kidney Disease (CKD) is defined as a sustained low eGFR for more than 3 months. A single result is just a snapshot.</p>
        `,
        reportWording: `
            <p>Look for these details in the report:</p>
            <ul>
                <li><strong>"Stage":</strong> CKD is staged 1-5. Stage 1-2 often have normal eGFR but other signs of damage. Stage 3a/3b is where "low eGFR" usually begins.</li>
                <li><strong>"Creatinine":</strong> If this number is stable compared to last year, a slight drop in eGFR might just be due to age formulas.</li>
                <li><strong>"Albumin/Creatinine Ratio":</strong> A separate urine test that checks for actual damage/leakage.</li>
            </ul>
        `,
        questions: [
            "Was I dehydrated when I took this test?",
            "How does this compare to my eGFR from last year? Is it stable?",
            "Do I have any protein in my urine (albuminuria)?",
            "Should I avoid NSAIDs/ibuprofen?",
            "Do I need to re-test in 3 months to confirm if this is chronic?"
        ],
        faq: [
            { question: "Can it improve?", answer: "Yes, especially if caused by dehydration or acute illness. Chronic scarring helps but stabilizing the number is the main goal." },
            { question: "Does diet affect it?", answer: "Yes. Eating cooked meat raises creatinine, which lowers eGFR. Hydration raises eGFR." },
            { question: "What is normal for my age?", answer: "It's not always >90. For a 70-year-old, an eGFR of 60-70 can be perfectly functional and normal." }
        ],
        relatedTopics: [
            { title: "Fatty Liver Meaning", path: "/fatty-liver-hepatic-steatosis-meaning" },
            { title: "Lung Nodule on CT", path: "/lung-nodule-ct-scan-report-meaning" }
        ],
        whyThisMatters: [],
        howThisWorks: 'Upload your metabolic panel.',
        trustSignals: 'Private • Educational • Kidney Health',
        ctaText: 'Explain My Lab Report',
        metaTitle: 'Low eGFR Blood Test Meaning | Kidney Function Explained',
        metaDescription: 'Low eGFR on your blood test? Learn why single results vary and how hydration or age affects your Estimated Glomerular Filtration Rate.',
        disclaimer: COMMON_DISCLAIMER
    }
};

export function getRouteConfig(pathname: string): RouteConfig {
    // 1. Normalize: Remove ONE OR MORE trailing slashes regex (except for root '/')
    const normalizedPath = pathname === '/' ? pathname : pathname.replace(/\/+$/, '');

    // 2. Lookup
    const config = ROUTE_CONFIG[normalizedPath];

    // 3. Fallback (Soft 404 Safeguard)
    return config || ROUTE_CONFIG['/'];
}

