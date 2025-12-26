export interface TermDefinition {
    term: string;
    definition: string;
    category: 'lab' | 'imaging' | 'general' | 'abbreviation';
}

// MVP Dictionary
const COMMON_TERMS: Record<string, TermDefinition> = {
    'wbc': { term: 'WBC', definition: 'White Blood Count. Measures cells that fight infection.', category: 'lab' },
    'rbc': { term: 'RBC', definition: 'Red Blood Count. Measures cells that carry oxygen.', category: 'lab' },
    'hgb': { term: 'Hemoglobin', definition: 'Protein in red blood cells that carries oxygen.', category: 'lab' },
    'hct': { term: 'Hematocrit', definition: 'Percentage of blood volume that is red blood cells.', category: 'lab' },
    'plt': { term: 'Platelets', definition: 'Cells that help blood clot.', category: 'lab' },
    'alt': { term: 'ALT', definition: 'Alanine Aminotransferase. An enzyme found in the liver.', category: 'lab' },
    'ast': { term: 'AST', definition: 'Aspartate Aminotransferase. A liver enzyme.', category: 'lab' },
    'creatinine': { term: 'Creatinine', definition: 'Waste product filtered by the kidneys.', category: 'lab' },
    'bun': { term: 'BUN', definition: 'Blood Urea Nitrogen. A measure of kidney function.', category: 'lab' },
    'glucose': { term: 'Glucose', definition: 'Blood sugar level.', category: 'lab' },
    'lipid': { term: 'Lipid', definition: 'Fats in the blood, like cholesterol.', category: 'lab' },
    'hld': { term: 'HDL', definition: 'High-Density Lipoprotein. "Good" cholesterol.', category: 'lab' },
    'ldl': { term: 'LDL', definition: 'Low-Density Lipoprotein. "Bad" cholesterol.', category: 'lab' },
    'thyroid': { term: 'Thyroid', definition: 'Gland that regulates metabolism.', category: 'general' },
    'tsh': { term: 'TSH', definition: 'Thyroid Stimulating Hormone.', category: 'lab' },
    'mri': { term: 'MRI', definition: 'Magnetic Resonance Imaging. Uses magnets to see inside the body.', category: 'imaging' },
    'ct': { term: 'CT Scan', definition: 'Computed Tomography. Uses X-rays to create detailed images.', category: 'imaging' },
    'contrast': { term: 'Contrast', definition: 'Dye used to make structures deeper in the body show up clearer.', category: 'imaging' },
    'benign': { term: 'Benign', definition: 'Not cancerous.', category: 'general' },
    'malignant': { term: 'Malignant', definition: 'Cancerous.', category: 'general' },
    'acute': { term: 'Acute', definition: 'Sudden onset, usually shortly duration.', category: 'general' },
    'chronic': { term: 'Chronic', definition: 'Long-developing, persistent condition.', category: 'general' },
    'fracture': { term: 'Fracture', definition: 'Broken bone.', category: 'imaging' },
    'lesion': { term: 'Lesion', definition: 'Area of abnormal tissue change.', category: 'general' },
    'unremarkable': { term: 'Unremarkable', definition: 'Normal. Nothing abnormal found.', category: 'general' },
    'intact': { term: 'Intact', definition: 'Normal, unbroken, functioning.', category: 'general' },
};

export function findTerms(text: string): TermDefinition[] {
    const found: TermDefinition[] = [];
    const lowerText = text.toLowerCase();

    // Naive string matching for MVP (improve with regex word boundaries later)
    Object.keys(COMMON_TERMS).forEach(key => {
        // Regex for whole word match to avoid substrings (e.g. 'bun' in 'bundle')
        const regex = new RegExp(`\\b${key}\\b`, 'i');
        if (regex.test(lowerText)) {
            found.push(COMMON_TERMS[key]);
        }
    });

    return found;
}
