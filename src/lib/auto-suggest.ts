import * as pdfjsLib from 'pdfjs-dist';
import type { Redaction } from '../types';

// Regex Patterns
const PATTERNS = [
    { name: 'BSB', regex: /\b\d{3}[-.]?\d{3}\b/ }, // 123-456
    { name: 'Credit Card', regex: /\b(?:\d[ -]*?){13,16}\b/ }, // Simple 13-16 digits
    { name: 'Email', regex: /\b[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}\b/ },
];

export async function findSuggestions(
    page: pdfjsLib.PDFPageProxy,
    pageIndex: number
): Promise<Redaction[]> {
    const textContent = await page.getTextContent();
    const viewport = page.getViewport({ scale: 1.0 }); // Use base scale for calculations
    const suggestions: Redaction[] = [];

    for (const item of textContent.items) {
        const textItem = item as any; // Cast to any to access str and transform
        const text = textItem.str;

        // Check if item text matches any pattern
        // This is a naive implementation that checks individual text chunks.
        // It works for cases where the sensitive data is in a single chunk.
        const isMatch = PATTERNS.some(p => p.regex.test(text));

        if (isMatch) {
            // Calculate coordinates
            // PDF coordinates: origin at bottom-left usually
            // transform: [scaleX, skewX, skewY, scaleY, x, y]
            const tx = textItem.transform;
            const x = tx[4];
            const y = tx[5];

            // Width and Height of the text item
            // textItem.width exists, height is roughly font size (tx[0] or tx[3])
            const width = textItem.width;
            const height = textItem.height || Math.abs(tx[3]);

            // Convert PDF coords to Viewport coords (which pdf.js uses for canvas)
            // Viewport transform handles the y-flip
            // const rect = viewport.convertToViewportRectangle([x, y, x + width, y + height]);

            // rect is [x_min, y_min, x_max, y_max] in viewport pixel coords
            // But textItem y is usually baseline. Adjusting strictly might be hard.
            // Simpler approach: Use the viewport transform logic manually or just relative %

            // Actually, viewport.convertToViewportRectangle might expect [x1, y1, x2, y2]
            // where (x1, y1) is bottom-left and (x2, y2) is top-right in PDF space.
            const pdfRect = [x, y, x + width, y + height]; // This is simplistic
            // Let's use the normalized coordinates calculation

            const vRect = viewport.convertToViewportRectangle(pdfRect);
            // vRect = [minX, minY, maxX, maxY] usually

            const minX = Math.min(vRect[0], vRect[2]);
            const minY = Math.min(vRect[1], vRect[3]);
            const w = Math.abs(vRect[2] - vRect[0]);
            const h = Math.abs(vRect[3] - vRect[1]);

            // Convert to percentages
            suggestions.push({
                id: crypto.randomUUID(),
                pageIndex,
                x: (minX / viewport.width) * 100,
                y: (minY / viewport.height) * 100,
                width: (w / viewport.width) * 100,
                height: (h / viewport.height) * 100,
            });
        }
    }

    return suggestions;
}
