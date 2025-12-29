import * as pdfjsLib from 'pdfjs-dist';
import { extractTextFromPage } from '../pdf-engine';

/**
 * Extracts text OR images/PDF-data from the PDF.
 * If text content is very low (scanned), returns raw PDF data for Gemini 1.5/2.0 native analysis.
 */
export async function extractTextFromPDF(pdf: pdfjsLib.PDFDocumentProxy): Promise<{
    fullText: string;
    pageTexts: string[];
    images?: string[];
    inlineData?: { mimeType: string; data: string };
}> {
    const pageTexts: string[] = [];
    let totalTextLength = 0;

    // 1. Try Text Extraction
    for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const text = await extractTextFromPage(page);
        pageTexts.push(text);
        totalTextLength += text.trim().length;
    }

    const fullText = pageTexts.join('\n\n');
    console.log(`[extractText] Total text length: ${totalTextLength} chars`);

    // 2. Check for Scanned Document / Photo PDF
    if (totalTextLength < 100) {
        console.warn("[extractText] Low text detected (<100 chars). Sending RAW PDF to Gemini.");

        try {
            // Get the raw PDF data
            const data = await pdf.getData();
            // Convert Unit8Array to Base64 manually to avoid dependencies
            let binary = '';
            const len = data.byteLength;
            for (let i = 0; i < len; i++) {
                binary += String.fromCharCode(data[i]);
            }
            const base64 = btoa(binary);

            console.log(`[extractText] PDF converted to Base64 (${base64.length} chars). Sending...`);

            return {
                fullText: "",
                pageTexts: [],
                inlineData: { mimeType: 'application/pdf', data: base64 }
            };

        } catch (e) {
            console.error("[extractText] Failed to get PDF data:", e);
        }
    }

    return {
        fullText,
        pageTexts
    };
}
