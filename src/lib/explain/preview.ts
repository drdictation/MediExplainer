import type { PreviewData } from './types';
import { extractTextFromPDF } from './extractText';
import { analyzeText } from '../gemini';

export async function generatePreview(pdf: any): Promise<PreviewData> {
    // 1. Extract Text & Images (if scanned)
    const { fullText, images } = await extractTextFromPDF(pdf);

    // 2. Fallback for empty docs
    if (!fullText && (!images || images.length === 0)) {
        return {
            reportType: 'general',
            detectedSections: [],
            detectedTermsCount: 0,
            previewTerm: null,
            isLocked: true
        };
    }

    try {
        console.log("Requesting Gemini Preview Analysis (Client-Side)...");
        const data = await analyzeText(fullText, 'preview', images);

        return {
            reportType: data.reportType,
            detectedSections: data.detectedSections,
            detectedTermsCount: data.detectedTerms?.length || 0,
            previewTerm: data.previewTerm || null,
            isLocked: true
        };

    } catch (e: any) {
        console.error("Gemini Preview failed (Vision support).", e);
        // Fallback to segments if strictly needed, but scanned docs have no text...
        return {
            reportType: 'general',
            detectedSections: [],
            detectedTermsCount: 0,
            previewTerm: null,
            isLocked: true
        };
    }
}

