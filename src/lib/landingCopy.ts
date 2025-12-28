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
        subhead: 'A simple guide to understanding Intraductal Papillary Mucinous Neoplasm mentions in radiology reports.',
        summary: 'An IPMN (Intraductal Papillary Mucinous Neoplasm) is a type of fluid-filled cyst that forms in the pancreas. It is a common finding on improved quality CT and MRI scans, and while many are benign (non-cancerous) and simply monitored, some types require closer follow-up.',

        definition: `
            <p><strong>IPMN</strong> stands for <strong>Intraductal Papillary Mucinous Neoplasm</strong>.</p>
            <ul>
                <li><strong>Intraductal:</strong> It grows inside the "ducts" (tubes) of the pancreas.</li>
                <li><strong>Papillary:</strong> Under a microscope, the cells look like tiny fingers or fronds.</li>
                <li><strong>Mucinous:</strong> It produces thick fluid called mucin.</li>
                <li><strong>Neoplasm:</strong> A medical term for "new growth" or abnormal growth of cells (which can be benign or premalignant).</li>
            </ul>
            <p>Think of it as a small "bubble" or cyst growing in the drainage system of the pancreas.</p>
        `,
        whyItAppears: `
            <p>IPMNs are often found "incidentally," meaning they are discovered when you undergo a CT or MRI scan for a completely different reason. Because modern scanners are so detailed, they pick up very small cysts that might not have been visible years ago.</p>
            <p>Radiologists describe them based on where they are located in the duct system:</p>
            <ul>
                <li><strong>Main Duct IPMN:</strong> Located in the primary drainage tube of the pancreas.</li>
                <li><strong>Side Branch IPMN:</strong> Located in the smaller branches feeding into the main duct (often considered lower risk).</li>
                <li><strong>Mixed Type:</strong> Involves both.</li>
            </ul>
        `,
        whatItDoesNotMean: `
            <p>Seeing "IPMN" on a report <strong>does NOT automatically mean you have pancreatic cancer.</strong></p>
            <p>Many IPMNs are indolent (slow-growing) and may never cause harm. However, because they have a <em>potential</em> to change over time, doctors usually recommend a schedule of surveillance (repeat scans) rather than ignoring them.</p>
        `,
        reportWording: `
            <p>Here are some phrases you might see and how they relate to the cyst's features:</p>
            <ul>
                <li><strong>"Worrisome features":</strong> A specific medical checklist (like cyst size >3cm or thickened walls) that suggests the cyst needs closer expert evaluation.</li>
                <li><strong>"High-risk stigmata":</strong> Signs that are more concerning and often trigger a referral to a surgeon or gastroenterologist for discussion.</li>
                <li><strong>"Communication with the pancreatic duct":</strong> This is a key feature that helps radiologists diagnose a cyst as an IPMN rather than another type of cyst.</li>
            </ul>
        `,
        questions: [
            "What type of IPMN does the report suggest I have (Side-branch, Main-duct, or Mixed)?",
            "Did the radiologist mention any 'worrisome features' or 'high-risk stigmata'?",
            "Do I need a follow-up scan, and if so, in how many months?",
            "Should I be referred to a gastroenterologist or pancreas specialist?",
            "Are there any blood tests (like CA 19-9) that you recommend tracking along with the imaging?",
            "Is an endoscopic ultrasound (EUS) needed to look at it more closely?"
        ],
        faq: [
            { question: "Is an IPMN a tumor?", answer: "Technically yes, 'neoplasm' means tumor, but in this context, it often refers to a pre-cancerous cyst. Many are benign but have the potential to progress." },
            { question: "Can IPMN disappear?", answer: "It is rare for an IPMN to disappear on its own. They are usually stable or slowly growing." },
            { question: "Is surgery always needed?", answer: "No. Surgery is typically reserved for IPMNs that show high-risk features. Many small, stable side-branch IPMNs are just watched with yearly MRI or CT." }
        ],
        relatedTopics: [
            { title: "Lung Nodule on CT", path: "/lung-nodule-ct-scan-report-meaning" },
            { title: "Fatty Liver on Ultrasound", path: "/fatty-liver-hepatic-steatosis-meaning" }
        ],
        whyThisMatters: [], // Fallback empty
        howThisWorks: 'Upload your CT or MRI report.',
        trustSignals: 'Private • Educational • Radiology Explainer',
        ctaText: 'Explain My Pancreas Report',
        metaTitle: 'IPMN Pancreas on CT or MRI Report | Meaning & Explanation',
        metaDescription: 'Found "IPMN" on your pancreas CT or MRI report? Learn what Intraductal Papillary Mucinous Neoplasm means, why it appears, and questions to ask your doctor.',
        disclaimer: COMMON_DISCLAIMER
    },

    '/lung-nodule-ct-scan-report-meaning': {
        path: '/lung-nodule-ct-scan-report-meaning',
        primarySearchIntent: 'Lung Nodule CT Scan',
        h1: 'Lung Nodule on CT scan report: what it means',
        subhead: 'Found a "nodule" or "spot" on your lung scan? Here is a plain English guide to what that term describes.',
        summary: 'A lung nodule is a small round or oval spot in the lungs. They are extremely common on CT scans and the vast majority are benign (non-cancerous), caused by past infections or scar tissue, though they do require strict monitoring to ensure they don\'t grow.',
        definition: `
            <p>A <strong>lung nodule</strong> (or pulmonary nodule) is simply a "spot" or shadow seen on an X-ray or CT scan. It is typically smaller than 3 centimeters (about 1.2 inches).</p>
            <ul>
                <li><strong>Solitary Pulmonary Nodule:</strong> A single spot.</li>
                <li><strong>Ground-glass opacity:</strong> A hazy spot that you can see through (like frosted glass), which can have different causes than a solid white spot.</li>
                <li><strong>Calcified:</strong> Contains calcium, which is often a sign of a healed, old issue (benign).</li>
            </ul>
        `,
        whyItAppears: `
            <p>CT scans are incredibly sensitive. They can see spots as small as a grain of rice. Common reasons nodules appear include:</p>
            <ul>
                <li><strong>Old Infections:</strong> Past fungal infections or tuberculosis can leave small scars.</li>
                <li><strong>Inflammation:</strong> Rheumatoid arthritis or sarcoidosis.</li>
                <li><strong>Lymph nodes:</strong> Small filters in the lung that can swell.</li>
                <li><strong>Early tumors:</strong> In some cases, a nodule can be an early lung cancer, which is why monitoring is key.</li>
            </ul>
        `,
        whatItDoesNotMean: `
            <p>A nodule does <strong>NOT</strong> automatically mean lung cancer.</p>
            <p>Studies show that over 95% of small nodules found on screening CTs are benign. However, "benign" is a diagnosis that is often confirmed over time—if it doesn\'t grow for 2 years, it is usually considered safe.</p>
        `,
        reportWording: `
            <p>Radiologists use specific guidelines (often called <strong>Fleischner Society guidelines</strong> or <strong>Lung-RADS</strong>) to decide what to do:</p>
            <ul>
                <li><strong>"Spiculated margins":</strong> Edges that look like a starburst or spikes (a feature that needs closer look).</li>
                <li><strong>"Smooth/calcified":</strong> Features that generally suggest a benign (safe) cause.</li>
                <li><strong>"Stable":</strong> Unchanged from a previous scan (very good news).</li>
            </ul>
        `,
        questions: [
            "What is the exact size of the nodule?",
            "Is the nodule solid, ground-glass, or part-solid?",
            "Does it look calcified or have smooth edges?",
            "Do I need a follow-up CT scan, and if so, in 3, 6, or 12 months?",
            "Are there old scans we can compare this to, to see if it's new?",
            "Does my smoking history change the risk level?"
        ],
        faq: [
            { question: "What size nodule is dangerous?", answer: "Risk increases with size. Nodules under 6mm are very low risk. Nodules over 8mm often require closer follow-up or a PET scan." },
            { question: "Can a lung nodule go away?", answer: "Yes, if it was caused by a temporary infection or inflammation, it can disappear on a future scan." },
            { question: "What is a 'watch and wait' approach?", answer: "It is the standard safety protocol. Because biopsies have risks, doctors prefer to re-scan in a few months to see if the nodule grows before doing invasive tests." }
        ],
        relatedTopics: [
            { title: "Low eGFR on Blood Test", path: "/low-egfr-blood-test-meaning" },
            { title: "IPMN Pancreas", path: "/what-is-ipmn-pancreas-ct-mri-report" }
        ],
        whyThisMatters: [],
        howThisWorks: 'Upload your Chest CT report.',
        trustSignals: 'Private • Educational • Radiology Explainer',
        ctaText: 'Explain My CT Report',
        metaTitle: 'Lung Nodule on CT Scan Report | Meaning & Explanation',
        metaDescription: 'Found a lung nodule on your CT scan? reliable explanation of what pulmonary nodules are, when they are worrisome, and questions to ask your doctor.',
        disclaimer: COMMON_DISCLAIMER
    },

    '/fatty-liver-hepatic-steatosis-meaning': {
        path: '/fatty-liver-hepatic-steatosis-meaning',
        primarySearchIntent: 'Fatty Liver Ultrasound',
        h1: 'Fatty Liver / Hepatic Steatosis on ultrasound: what it means',
        subhead: 'Understanding "hepatic steatosis" and fatty liver findings on your abdominal ultrasound or CT scan.',
        summary: 'Hepatic steatosis is the medical term for fatty liver—a build-up of excess fat in the liver cells. It is a very common finding often linked to metabolic health, diet, or alcohol use, and is typically reversible with lifestyle changes.',
        definition: `
            <p><strong>Hepatic Steatosis</strong> comes from <em>Hepatic</em> (liver) and <em>Steatosis</em> (fat retention).</p>
            <p>On an ultrasound, fat makes the liver look "brighter" (more echogenic) than the kidney next to it. It basically means the liver is storing more fat than it should.</p>
        `,
        whyItAppears: `
            <p>The liver is the body's metabolic engine. Excess fat piles up there due to:</p>
            <ul>
                <li><strong>Metabolic factors:</strong> Weight gain, insulin resistance, or type 2 diabetes (MASLD/NAFLD).</li>
                <li><strong>Alcohol intake:</strong> Regular alcohol consumption (MetALD).</li>
                <li><strong>Medications:</strong> Certain drugs can cause fat deposits.</li>
            </ul>
        `,
        whatItDoesNotMean: `
            <p>Simple fatty liver does <strong>NOT</strong> necessarily mean you have permanent liver damage or cirrhosis.</p>
            <p>It is often the earliest stage of liver change ("steatosis"). The next stage, if it progresses, involves inflammation ("steatohepatitis" or MASH). Catching it at the fatty stage is often considered a "warning light" rather than permanent damage.</p>
        `,
        reportWording: `
            <p>Radiologists grade the severity based on how "bright" the liver looks:</p>
            <ul>
                <li><strong>Mild / Grade 1:</strong> Slight increase in brightness.</li>
                <li><strong>Moderate / Grade 2:</strong> Obscures the walls of the blood vessels.</li>
                <li><strong>Severe / Grade 3:</strong> Makes it hard to see the diaphragm or deeper liver structures.</li>
                <li><strong>"Coarsened echotexture":</strong> A phrase that <em>might</em> suggest more chronic changes or fibrosis, distinct from simple fat.</li>
            </ul>
        `,
        questions: [
            "Is the report showing just fatty liver, or are there signs of scarring (fibrosis/cirrhosis)?",
            "Do I need a FibroScan (elastography) to check for liver stiffness?",
            "Should I check my liver function tests (ALT/AST) in my blood work?",
            "Is this likely due to alcohol, diet, or medications?",
            "What specific lifestyle changes (weight loss, diet) do you recommend?",
            "Do I need to see a hepatologist (liver specialist)?"
        ],
        faq: [
            { question: "Is fatty liver reversible?", answer: "Yes, in many cases. Losing 10% of body weight is often cited as a way to significantly reduce liver fat." },
            { question: "Does fatty liver cause pain?", answer: "Usually, no. It is a 'silent' condition. Some people feel mild fullness in the upper right abdomen." },
            { question: "What is MASLD?", answer: "Metabolic Dysfunction-Associated Steatotic Liver Disease. It is the new, more accurate medical term for Non-Alcoholic Fatty Liver Disease (NAFLD)." }
        ],
        relatedTopics: [
            { title: "Low eGFR on Blood Test", path: "/low-egfr-blood-test-meaning" },
            { title: "Adenomatous Polyp", path: "/adenomatous-polyp-pathology-report-meaning" }
        ],
        whyThisMatters: [],
        howThisWorks: 'Upload your ultrasound report.',
        trustSignals: 'Private • Educational • Liver Health',
        ctaText: 'Explain My Ultrasound Report',
        metaTitle: 'Fatty Liver (Hepatic Steatosis) on Ultrasound | Meaning',
        metaDescription: 'Diagnosed with Hepatic Steatosis or Fatty Liver on ultrasound? Learn what this common finding means, its causes, and questions for your doctor.',
        disclaimer: COMMON_DISCLAIMER
    },

    '/adenomatous-polyp-pathology-report-meaning': {
        path: '/adenomatous-polyp-pathology-report-meaning',
        primarySearchIntent: 'Adenomatous Polyp Pathology',
        h1: 'Adenomatous Polyp on pathology report: what it means',
        subhead: 'Understanding your colonoscopy results and what "adenoma" means for your cancer risk.',
        summary: 'An adenomatous polyp (or adenoma) is a benign growth found in the colon during a colonoscopy. It is considered "pre-cancerous," meaning it had the potential to turn into cancer if left alone, but removing it effectively breaks that chain.',
        definition: `
            <p><strong>Adenomatous Polyp:</strong> A growth of tissue from the lining of the colon.</p>
            <ul>
                <li><strong>Tubular Adenoma:</strong> The most common type (tube-shaped cells).</li>
                <li><strong>Villous Adenoma:</strong> Less common, often larger, with finger-like projections (higher risk).</li>
                <li><strong>Tubulovillous Adenoma:</strong> A mix of both.</li>
                <li><strong>Sessile vs. Pedunculated:</strong> Sessile means flat/broad-based; pedunculated means on a stalk (like a mushroom).</li>
            </ul>
        `,
        whyItAppears: `
            <p>Polyps grow due to genetic changes in the lining of the bowel. They are very common in adults over 45. The goal of screening colonoscopy is specifically to find and remove these <em>before</em> they can ever turn into cancer.</p>
        `,
        whatItDoesNotMean: `
            <p>Having an adenoma does <strong>NOT</strong> mean you have colon cancer.</p>
            <p>It means you have a risk factor. By removing the polyp, the doctor has removed that specific threat. However, because you grew one, you are more likely to grow another, which affects when your next colonoscopy should be.</p>
        `,
        reportWording: `
            <p>Pathology reports look for high-grade features:</p>
            <ul>
                <li><strong>"Low-grade dysplasia":</strong> The cells look slightly abnormal (standard for adenomas).</li>
                <li><strong>"High-grade dysplasia":</strong> The cells look very disorganized and closer to cancer (requires stricter follow-up).</li>
                <li><strong>"Margins negative":</strong> The doctor completely removed the polyp (good news).</li>
            </ul>
        `,
        questions: [
            "How many polyps did you find in total?",
            "Was the polyp completely removed?",
            "Did the pathology show 'high-grade dysplasia'?",
            "Based on this, when should I have my next colonoscopy (e.g., 3, 5, or 10 years)?",
            "Do my family members need to start screening earlier because of this?",
            "Should I change my diet or fiber intake?"
        ],
        faq: [
            { question: "Is a polyp cancer?", answer: "Most polyps are benign. Adenomas are 'pre-cancerous,' meaning they could become cancer years down the road if not removed." },
            { question: "What is the difference between hyperplastic and adenomatous?", answer: "Hyperplastic polyps are usually very low risk and not considered pre-cancerous. Adenomatous polyps carry a higher risk." },
            { question: "Does this mean I'm high risk?", answer: "It depends on the number and size. People with 3+ adenomas or large adenomas (>1cm) are often considered higher risk for recurrence." }
        ],
        relatedTopics: [
            { title: "Low eGFR on Blood Test", path: "/low-egfr-blood-test-meaning" },
            { title: "Fatty Liver Meaning", path: "/fatty-liver-hepatic-steatosis-meaning" }
        ],
        whyThisMatters: [],
        howThisWorks: 'Upload your pathology report.',
        trustSignals: 'Private • Educational • Pathology Explainer',
        ctaText: 'Explain My Pathology Report',
        metaTitle: 'Adenomatous Polyp on Pathology Report | Meaning & Risk',
        metaDescription: 'Pathology report say "Adenomatous Polyp"? Learn what tubular and villous adenomas are, and what they mean for your colonoscopy follow-up.',
        disclaimer: COMMON_DISCLAIMER
    },

    '/low-egfr-blood-test-meaning': {
        path: '/low-egfr-blood-test-meaning',
        primarySearchIntent: 'Low eGFR Blood Test',
        h1: 'Low eGFR on blood test: what it means',
        subhead: 'A guide to understanding Estimated Glomerular Filtration Rate and kidney function numbers.',
        summary: 'eGFR (Estimated Glomerular Filtration Rate) is a number that indicates how well your kidneys are filtering waste from your blood. A "low" number suggests reduced kidney function, but this can be temporary (dehydration) or persistent (chronic kidney disease).',
        definition: `
            <p><strong>eGFR:</strong> A calculated number based on your blood creatinine level, age, and sex.</p>
            <ul>
                <li><strong>> 90:</strong> Normal kidney function.</li>
                <li><strong>60 - 89:</strong> Mildly reduced function (often normal with age).</li>
                <li><strong>< 60:</strong> Indicates potential Chronic Kidney Disease (CKD) if persistent for 3+ months.</li>
                <li><strong>< 15:</strong> Kidney failure.</li>
            </ul>
        `,
        whyItAppears: `
            <p>Creatinine is a waste product from muscles. Healthy kidneys filter it out. If kidneys slow down, creatinine rises, and the calculated eGFR drops. Common causes for a drop include:</p>
            <ul>
                <li><strong>Dehydration:</strong> Not drinking enough water before the test.</li>
                <li><strong>High Blood Pressure / Diabetes:</strong> The two biggest stressors on kidneys.</li>
                <li><strong>Medications:</strong> NSAIDs (ibuprofen) or certain blood pressure meds.</li>
                <li><strong>Age:</strong> Kidney function naturally declines slightly as we get older.</li>
            </ul>
        `,
        whatItDoesNotMean: `
            <p>One low reading does <strong>NOT</strong> automatically mean you have permanent kidney failure.</p>
            <p>Doctors look for a <em>trend</em>. eGFR can fluctuate day to day. A diagnosis of Chronic Kidney Disease (CKD) usually requires two low tests spaced at least 3 months apart.</p>
        `,
        reportWording: `
            <p>You might see:</p>
            <ul>
                <li><strong>"CKD Stage":</strong> Doctors stage kidney disease from 1 to 5 based on the eGFR number.</li>
                <li><strong>"Stable":</strong> The number hasn't changed much from last year (often the goal).</li>
                <li><strong>"Creatinine":</strong> The actual chemical measured in the blood used to calculate the eGFR.</li>
            </ul>
        `,
        questions: [
            "Was I dehydrated during this test?",
            "Do I need to repeat the test in 3 months to confirm?",
            "Is my urine protein (albumin) level also elevated?",
            "Should I avoid certain painkillers (NSAIDs) like ibuprofen?",
            "Is my blood pressure in a safe range for my kidneys?",
            "What stage of kidney disease does this represent, if any?"
        ],
        faq: [
            { question: "Can eGFR improve?", answer: "Yes. If the drop was due to dehydration or acute illness, it can bounce back. However, chronic scarring is usually permanent, so the goal is to stop it from getting worse." },
            { question: "Does a high protein diet affect eGFR?", answer: "Yes, eating a lot of cooked meat can temporarily raise creatinine levels, which might falsely lower your eGFR calculation." },
            { question: "What is a normal eGFR for my age?", answer: "eGFR naturally declines. A 20-year-old might have 110, while a healthy 80-year-old might have 65. Both can be considered 'normal' for their age." }
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
        metaDescription: 'Low eGFR on your blood test? Understand what Estimated Glomerular Filtration Rate means, stages of kidney function, and questions to ask your doctor.',
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

