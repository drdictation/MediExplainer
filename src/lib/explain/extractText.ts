import * as pdfjsLib from 'pdfjs-dist';
import { extractTextFromPage } from '../pdf-engine';

/**
 * Extracts and concatenates text from all pages of the PDF.
 * Returns the full text and an array of per-page text.
 */
export async function extractTextFromPDF(pdf: pdfjsLib.PDFDocumentProxy): Promise<{ fullText: string; pageTexts: string[] }> {
    const pageTexts: string[] = [];

    for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const text = await extractTextFromPage(page);
        pageTexts.push(text);
    }

    return {
        fullText: pageTexts.join('\n\n'),
        pageTexts
    };
}
