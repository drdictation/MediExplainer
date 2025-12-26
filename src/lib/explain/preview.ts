import type { PreviewData } from './types';
import { detectReportType } from './reportType'; // Fallback
import { segmentText } from './segment'; // Fallback
import { findTerms } from './terms'; // Fallback

import { analyzeText } from '../gemini';

export async function generatePreview(text: string): Promise<PreviewData> {
    try {
        console.log("Requesting Gemini Preview Analysis (Client-Side)...");
        const data = await analyzeText(text, 'preview');

        return {
            reportType: data.reportType,
            detectedSections: data.detectedSections,
            detectedTermsCount: data.detectedTerms?.length || 0,
            previewTerm: data.previewTerm || null,
            isLocked: true
        };

    } catch (err) {
        console.warn("Gemini Preview failed, falling back to local heuristics.", err);

        // Fallback Logic
        const reportTypeResult = detectReportType(text);
        const sections = segmentText(text);
        const terms = findTerms(text);

        return {
            reportType: reportTypeResult.type,
            detectedSections: sections.map(s => s.title),
            detectedTermsCount: terms.length,
            previewTerm: terms[0] || null,
            isLocked: true
        };
    }
}
