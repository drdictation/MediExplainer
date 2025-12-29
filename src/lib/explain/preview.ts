import type { PreviewData } from './types';
import { extractTextFromPDF } from './extractText';
import { analyzeText } from '../gemini';

export async function generatePreview(pdf: any): Promise<PreviewData> {
    // 1. Extract Text & Images (if scanned)
    const { fullText, images, inlineData } = await extractTextFromPDF(pdf);

    // 2. Fallback for empty docs
    if (!fullText && (!images || images.length === 0) && !inlineData) {
        console.warn("[generatePreview] No text AND no images/PDF-data found in PDF explainer flow.");
        return {
            reportType: 'general',
            detectedSections: [],
            detectedTermsCount: 0,
            previewTerm: null,
            isLocked: true
        };
    }

    try {
        console.log(`[generatePreview] Requesting Gemini Analysis. TextLen: ${fullText.length}, Images: ${images?.length || 0}, PDF: ${!!inlineData}`);
        const data = await analyzeText(fullText, 'preview', images, inlineData);

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

