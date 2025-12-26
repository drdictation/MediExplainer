import * as pdfjsLib from 'pdfjs-dist';
import { extractTextFromPage, renderPageToImage } from '../pdf-engine';

/**
 * Extracts text OR images from the PDF.
 * If text content is very low (scanned), returns images for vision analysis.
 */
export async function extractTextFromPDF(pdf: pdfjsLib.PDFDocumentProxy): Promise<{ fullText: string; pageTexts: string[]; images?: string[] }> {
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

    // 2. Check for Scanned Document (Threshold: < 50 chars per page on average? or just total < 100)
    // Adjust threshold as needed. 100 chars total for a report is suspicious.
    if (totalTextLength < 100) {
        console.warn("Low text detected. Promoting to Vision Mode (Scanned Document).");
        const images: string[] = [];

        // Limit to first 5 pages to save bandwidth/tokens for MVP
        const pagesToRender = Math.min(pdf.numPages, 5);

        for (let i = 1; i <= pagesToRender; i++) {
            const page = await pdf.getPage(i);
            const base64 = await renderPageToImage(page);
            images.push(base64);
        }

        return { fullText: "", pageTexts: [], images };
    }

    return {
        fullText,
        pageTexts
    };
}
